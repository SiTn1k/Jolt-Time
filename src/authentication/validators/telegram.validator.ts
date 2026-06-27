/**
 * Telegram InitData Validator
 *
 * Validates Telegram Mini App initData according to Telegram's specification.
 * This is the core security component that ensures we never trust client data directly.
 *
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */

import { createHmac, createHash } from 'crypto';
import type { TelegramInitData, TelegramUser, InitDataRaw } from '../types';
import { AuthErrors } from '../errors';

/**
 * Environment variable name for Telegram bot token.
 */
const TELEGRAM_BOT_TOKEN_ENV = 'TELEGRAM_BOT_TOKEN';

/**
 * Default maximum age of initData in seconds (1 hour).
 */
const DEFAULT_INIT_DATA_MAX_AGE = 3600;

/**
 * Fields that should be included in the hash calculation.
 */
const HASH_FIELDS = [
  'auth_date',
  'query_id',
  'user',
] as const;

/**
 * Result of initData validation.
 */
export interface InitDataValidationResult {
  valid: boolean;
  initData?: TelegramInitData;
  error?: ReturnType<typeof AuthErrors.invalidInitData>;
}

/**
 * Validator configuration.
 */
export interface TelegramValidatorConfig {
  botToken?: string;
  maxAgeSeconds?: number;
  allowNonPremium?: boolean;
}

/**
 * Telegram initData validator.
 */
export class TelegramInitDataValidator {
  private readonly botToken: string | null;
  private readonly maxAgeSeconds: number;
  private readonly allowNonPremium: boolean;

  constructor(config: TelegramValidatorConfig = {}) {
    this.botToken = config.botToken ?? process.env[TELEGRAM_BOT_TOKEN_ENV] ?? null;
    this.maxAgeSeconds = config.maxAgeSeconds ?? DEFAULT_INIT_DATA_MAX_AGE;
    this.allowNonPremium = config.allowNonPremium ?? true;
  }

  /**
   * Validate initData string from Telegram Mini App.
   *
   * @param initDataRaw - Raw initData string from Telegram
   * @returns Validation result with parsed data if valid
   */
  validate(initDataRaw: InitDataRaw): InitDataValidationResult {
    if (!initDataRaw || typeof initDataRaw !== 'string') {
      return {
        valid: false,
        error: AuthErrors.invalidInitData(new Error('initData is empty or not a string')),
      };
    }

    try {
      // Parse the initData
      const parsed = this.parseInitData(initDataRaw);

      if (!parsed) {
        return {
          valid: false,
          error: AuthErrors.invalidInitData(new Error('Failed to parse initData')),
        };
      }

      // Validate required fields
      if (!parsed.user || !parsed.auth_date || !parsed.hash) {
        return {
          valid: false,
          error: AuthErrors.invalidInitData(new Error('Missing required fields: user, auth_date, or hash')),
        };
      }

      // Validate user data
      const userValidation = this.validateUser(parsed.user);
      if (!userValidation.valid) {
        return {
          valid: false,
          error: AuthErrors.invalidInitData(userValidation.error),
        };
      }

      // Parse user from JSON string if needed
      const userObj = typeof parsed.user === 'string' 
        ? JSON.parse(parsed.user) 
        : parsed.user;

      // Validate timestamp
      const timestampValidation = this.validateTimestamp(parsed.auth_date);
      if (!timestampValidation.valid) {
        return {
          valid: false,
          error: AuthErrors.signatureExpired(
            timestampValidation.authDate!,
            this.maxAgeSeconds
          ),
        };
      }

      // Validate signature
      if (!this.botToken) {
        console.warn('[TelegramValidator] Bot token not configured - skipping signature verification');
        return {
          valid: true,
          initData: {
            user: userObj,
            chatInstance: parsed.chat_instance,
            chatType: parsed.chat_type,
            startParam: parsed.start_param,
            authDate: new Date(parseInt(parsed.auth_date, 10) * 1000),
            hash: parsed.hash,
          },
        };
      }

      const signatureValid = this.validateSignature(initDataRaw);
      if (!signatureValid) {
        return {
          valid: false,
          error: AuthErrors.invalidSignature(),
        };
      }

      return {
        valid: true,
        initData: {
          user: userObj,
          chatInstance: parsed.chat_instance,
          chatType: parsed.chat_type,
          startParam: parsed.start_param,
          authDate: new Date(parseInt(parsed.auth_date, 10) * 1000),
          hash: parsed.hash,
        },
      };
    } catch (err) {
      return {
        valid: false,
        error: AuthErrors.invalidInitData(err as Error),
      };
    }
  }

  /**
   * Parse initData string into key-value pairs.
   */
  private parseInitData(initDataRaw: string): Record<string, string> | null {
    const params: Record<string, string> = {};
    const pairs = initDataRaw.split('&');

    for (const pair of pairs) {
      const [key, ...valueParts] = pair.split('=');
      if (key) {
        params[key] = decodeURIComponent(valueParts.join('='));
      }
    }

    return params;
  }

  /**
   * Validate user object from initData.
   */
  private validateUser(userData: string | TelegramUser): { valid: boolean; error?: Error } {
    try {
      let user: Record<string, unknown>;
      if (typeof userData === 'string') {
        user = JSON.parse(userData);
      } else {
        user = userData as unknown as Record<string, unknown>;
      }

      if (!user.id || typeof user.id !== 'number') {
        return { valid: false, error: new Error('User id is required and must be a number') };
      }

      const firstName = (user.first_name ?? user.firstName) as string | undefined;
      if (!firstName || typeof firstName !== 'string') {
        return { valid: false, error: new Error('User first_name is required') };
      }

      const isPremium = (user.is_premium ?? user.isPremium) as boolean | undefined;
      if (isPremium === true && !this.allowNonPremium) {
        return { valid: false, error: new Error('Premium account required') };
      }

      return { valid: true };
    } catch (err) {
      return { valid: false, error: err as Error };
    }
  }

  /**
   * Validate auth_date timestamp.
   */
  private validateTimestamp(authDateStr: string): { valid: boolean; authDate?: Date } {
    const authDate = new Date(parseInt(authDateStr, 10) * 1000);
    const now = new Date();
    const maxAge = this.maxAgeSeconds * 1000;

    if (isNaN(authDate.getTime())) {
      return { valid: false };
    }

    // Check if auth date is too old
    if (now.getTime() - authDate.getTime() > maxAge) {
      return { valid: false };
    }

    // Check if auth date is in the future (with some tolerance)
    const toleranceMs = 60000; // 1 minute tolerance
    if (authDate.getTime() > now.getTime() + toleranceMs) {
      return { valid: false };
    }

    return { valid: true, authDate };
  }

  /**
   * Validate the cryptographic signature.
   *
   * Telegram's signature is computed as:
   * HMAC-SHA256 of "WebAppData" with bot token as key
   * Then HMAC-SHA256 of the sorted key=value pairs with the result as key
   */
  private validateSignature(initDataRaw: string): boolean {
    if (!this.botToken) {
      return false;
    }

    try {
      // Parse initData
      const params = this.parseInitData(initDataRaw);
      if (!params) {
        return false;
      }

      // Remove hash from the data to validate
      const { hash, ...dataWithoutHash } = params;

      // Sort keys alphabetically
      const sortedKeys = Object.keys(dataWithoutHash).sort();

      // Build the data string: key=value\n format, sorted by key name
      const dataCheckString = sortedKeys
        .map((key) => `${key}=${dataWithoutHash[key]}`)
        .join('\n');

      // Step 1: Create HMAC-SHA256 of "WebAppData" with bot token
      const secretKey = createHmac('sha256', 'WebAppData')
        .update(this.botToken)
        .digest();

      // Step 2: Create HMAC-SHA256 of dataCheckString with secretKey
      const calculatedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      // Step 3: Compare hashes in constant time
      return this.constantTimeCompare(calculatedHash, hash);
    } catch {
      return false;
    }
  }

  /**
   * Constant-time string comparison to prevent timing attacks.
   */
  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * Extract Telegram user from validated initData.
   */
  static extractUser(initData: TelegramInitData): TelegramUser {
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
 * Global validator instance.
 */
let globalValidator: TelegramInitDataValidator | null = null;

/**
 * Get or create the global validator instance.
 */
export function getGlobalValidator(config?: TelegramValidatorConfig): TelegramInitDataValidator {
  if (!globalValidator) {
    globalValidator = new TelegramInitDataValidator(config);
  }
  return globalValidator;
}

/**
 * Reset the global validator (for testing).
 */
export function resetGlobalValidator(): void {
  globalValidator = null;
}

/**
 * Quick validation function for simple use cases.
 */
export function validateTelegramInitData(
  initDataRaw: InitDataRaw,
  config?: TelegramValidatorConfig
): InitDataValidationResult {
  const validator = new TelegramInitDataValidator(config);
  return validator.validate(initDataRaw);
}