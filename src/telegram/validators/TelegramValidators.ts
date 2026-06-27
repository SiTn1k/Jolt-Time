/**
 * Telegram Validators
 *
 * Security layer validators for:
 * - Telegram Data Validation
 * - Request Validation
 * - Signature Validation
 * - Launch Validation
 * - Replay Protection Integration
 */

import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Validator configuration.
 */
export interface TelegramValidatorConfig {
  botToken: string;
  allowedUpdates?: string[];
  maxInitDataAge?: number; // in seconds
  requireEncryption?: boolean;
}

/**
 * Validation result.
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Init data validation result.
 */
export interface InitDataValidationResult extends ValidationResult {
  initData?: {
    queryId?: string;
    user?: {
      id: number;
      firstName: string;
      lastName?: string;
      username?: string;
      languageCode?: string;
      isPremium: boolean;
    };
    authDate?: Date;
    startParam?: string;
    chatType?: string;
    chatId?: number;
    chatInstance?: string;
  };
}

/**
 * Signature validation result.
 */
export interface SignatureValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Telegram Data Validator
 *
 * Validates Telegram init data and webhook requests.
 */
export class TelegramValidator {
  private botToken: string;
  private maxInitDataAge: number;

  constructor(config: TelegramValidatorConfig) {
    this.botToken = config.botToken;
    this.maxInitDataAge = config.maxInitDataAge ?? 86400; // Default 24 hours
  }

  /**
   * Validate Telegram init data from Mini App.
   */
  validateInitData(initData: string): InitDataValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!initData || initData.trim() === '') {
      errors.push('Init data is empty');
      return { valid: false, errors, warnings };
    }

    try {
      // Parse init data
      const params = new URLSearchParams(initData);
      const hash = params.get('hash');

      if (!hash) {
        errors.push('Missing hash parameter');
        return { valid: false, errors, warnings };
      }

      // Remove hash and sort parameters
      params.delete('hash');
      const sortedParams = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
        .join('\n');

      // Calculate expected hash
      const secretKey = createHmac('sha256', 'WebAppData')
        .update(this.botToken)
        .digest();
      const expectedHash = createHmac('sha256', secretKey)
        .update(sortedParams)
        .digest('hex');

      // Compare hashes
      if (!timingSafeEqualFromHex(hash, expectedHash)) {
        errors.push('Invalid hash signature');
        return { valid: false, errors, warnings };
      }

      // Validate auth date
      const authDateStr = params.get('auth_date');
      if (authDateStr) {
        const authDate = new Date(parseInt(authDateStr, 10) * 1000);
        const now = new Date();
        const ageSeconds = (now.getTime() - authDate.getTime()) / 1000;

        if (ageSeconds > this.maxInitDataAge) {
          warnings.push('Init data is older than maximum allowed age');
        }

        if (ageSeconds < 0) {
          errors.push('Auth date is in the future');
        }
      } else {
        warnings.push('Missing auth_date parameter');
      }

      // Parse user
      const userParam = params.get('user');
      let user: NonNullable<InitDataValidationResult['initData']>['user'];
      if (userParam) {
        try {
          user = JSON.parse(decodeURIComponent(userParam));
        } catch {
          warnings.push('Failed to parse user parameter');
        }
      }

      // Parse other parameters
      const queryId = params.get('query_id') ?? undefined;
      const startParam = params.get('start_param') ?? undefined;
      const chatType = params.get('chat_type') ?? undefined;
      const chatIdStr = params.get('chat_id');
      const chatId = chatIdStr ? parseInt(chatIdStr, 10) : undefined;
      const chatInstance = params.get('chat_instance') ?? undefined;

      const authDate = authDateStr
        ? new Date(parseInt(authDateStr, 10) * 1000)
        : undefined;

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        initData: {
          queryId,
          user: user,
          authDate,
          startParam,
          chatType: chatType as 'private' | 'group' | 'supergroup' | 'channel' | undefined,
          chatId: chatId ?? undefined,
          chatInstance: chatInstance ?? undefined,
        },
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to validate init data: ${(error as Error).message}`],
        warnings,
      };
    }
  }

  /**
   * Validate webhook request signature.
   */
  validateWebhookSignature(
    body: string,
    signature: string,
    secret: string
  ): SignatureValidationResult {
    try {
      const expectedSignature = createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      if (!timingSafeEqualFromHex(signature, expectedSignature)) {
        return { valid: false, error: 'Invalid webhook signature' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: `Signature validation failed: ${(error as Error).message}` };
    }
  }

  /**
   * Validate update data from webhook.
   */
  validateUpdate(update: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!update.update_id) {
      errors.push('Missing update_id');
    }

    if (update.message) {
      const message = update.message as Record<string, unknown>;
      if (!message.chat) {
        errors.push('Message missing chat');
      }
      if (!message.date) {
        warnings.push('Message missing date');
      }
    }

    if (update.callback_query) {
      const callback = update.callback_query as Record<string, unknown>;
      if (!callback.id) {
        errors.push('Callback query missing id');
      }
      if (!callback.data && !callback.game_short_name) {
        warnings.push('Callback query missing data or game_short_name');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate launch parameters.
   */
  validateLaunchParams(params: Record<string, string>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate start_param length
    const startParam = params.start_param ?? params.startParam;
    if (startParam && startParam.length > 256) {
      errors.push('start_param exceeds maximum length of 256');
    }

    // Validate chat_type
    const chatType = params.chat_type ?? params.chatType;
    if (chatType && !['private', 'group', 'supergroup', 'channel'].includes(chatType)) {
      errors.push(`Invalid chat_type: ${chatType}`);
    }

    // Validate chat_id
    const chatId = params.chat_id ?? params.chatId;
    if (chatId) {
      const parsed = parseInt(chatId, 10);
      if (isNaN(parsed) || parsed <= 0) {
        errors.push('Invalid chat_id');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Check for replay attacks using auth_date.
   */
  checkReplayAttack(authDate: Date | undefined, existingTimestamps: Set<number>): {
    isReplay: boolean;
    timestamp?: number;
  } {
    if (!authDate) {
      return { isReplay: false };
    }

    const timestamp = Math.floor(authDate.getTime() / 1000);
    if (existingTimestamps.has(timestamp)) {
      return { isReplay: true, timestamp };
    }

    return { isReplay: false };
  }

  /**
   * Extract user from validated init data.
   */
  extractUser(initData: InitDataValidationResult['initData']): {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
    isPremium: boolean;
  } | null {
    if (!initData?.user) return null;
    return {
      id: initData.user.id,
      firstName: initData.user.firstName,
      lastName: initData.user.lastName,
      username: initData.user.username,
      languageCode: initData.user.languageCode,
      isPremium: initData.user.isPremium,
    };
  }
}

/**
 * Timing-safe hex comparison.
 */
function timingSafeEqualFromHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');

  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Create a replay tracker.
 */
export function createReplayTracker(maxEntries = 1000) {
  const timestamps = new Set<number>();

  return {
    add: (timestamp: number): void => {
      timestamps.add(timestamp);
      if (timestamps.size > maxEntries) {
        // Remove oldest entries
        const arr = Array.from(timestamps);
        arr.slice(0, arr.length - maxEntries).forEach((t) => timestamps.delete(t));
      }
    },
    has: (timestamp: number): boolean => timestamps.has(timestamp),
    clear: (): void => timestamps.clear(),
    size: (): number => timestamps.size,
  };
}

/**
 * Quick validation for init data string.
 */
export function quickValidateInitData(initData: string): boolean {
  if (!initData) return false;
  const params = new URLSearchParams(initData);
  return params.has('hash') && params.has('auth_date') && params.has('user');
}

/**
 * Extract hash from init data.
 */
export function extractHash(initData: string): string | null {
  const params = new URLSearchParams(initData);
  return params.get('hash');
}

/**
 * Extract auth date from init data.
 */
export function extractAuthDate(initData: string): Date | null {
  const params = new URLSearchParams(initData);
  const authDateStr = params.get('auth_date');
  if (!authDateStr) return null;
  return new Date(parseInt(authDateStr, 10) * 1000);
}

/**
 * Extract query ID from init data.
 */
export function extractQueryId(initData: string): string | null {
  const params = new URLSearchParams(initData);
  return params.get('query_id');
}
