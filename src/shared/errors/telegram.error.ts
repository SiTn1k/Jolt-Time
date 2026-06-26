/**
 * Telegram Error
 *
 * Error class for Telegram platform integration errors.
 */

import { ApplicationError } from './application.error';
import { ErrorCategory, ErrorSeverity } from '../constants';
import { TelegramErrorCodes } from '../types';

/**
 * Telegram error for platform integration failures.
 */
export class TelegramError extends ApplicationError {
  public readonly telegramCode?: number;
  public readonly chatId?: number;
  public readonly userId?: number;

  constructor(params: {
    message: string;
    code?: string;
    telegramCode?: number;
    chatId?: number;
    userId?: number;
    details?: Record<string, unknown>;
    context?: Record<string, unknown>;
    cause?: Error;
    severity?: ErrorSeverity;
    recoverable?: boolean;
  }) {
    super({
      message: params.message,
      code: params.code || TelegramErrorCodes.API_ERROR,
      category: ErrorCategory.TELEGRAM,
      severity: params.severity || determineTelegramSeverity(params.telegramCode),
      details: params.details,
      recoverable: params.recoverable ?? isTelegramRecoverable(params.telegramCode),
      context: params.context,
      cause: params.cause,
    });
    this.name = 'TelegramError';
    this.telegramCode = params.telegramCode;
    this.chatId = params.chatId;
    this.userId = params.userId;
  }

  /**
   * Create an API error from Telegram response.
   */
  static fromTelegramApi(
    message: string,
    code?: number,
    details?: Record<string, unknown>
  ): TelegramError {
    return new TelegramError({
      message,
      code: TelegramErrorCodes.API_ERROR,
      telegramCode: code,
      details,
    });
  }

  /**
   * Create authentication failed error.
   */
  static authFailed(reason?: string): TelegramError {
    return new TelegramError({
      message: `Telegram authentication failed: ${reason || 'Unknown reason'}`,
      code: TelegramErrorCodes.AUTH_FAILED,
      recoverable: false,
      severity: ErrorSeverity.HIGH,
    });
  }

  /**
   * Create user blocked error.
   */
  static userBlocked(userId: number): TelegramError {
    return new TelegramError({
      message: 'User has blocked the bot',
      code: TelegramErrorCodes.USER_BLOCKED,
      userId,
      recoverable: true,
      severity: ErrorSeverity.LOW,
    });
  }

  /**
   * Create chat not found error.
   */
  static chatNotFound(chatId: number): TelegramError {
    return new TelegramError({
      message: `Chat not found: ${chatId}`,
      code: TelegramErrorCodes.CHAT_NOT_FOUND,
      chatId,
      recoverable: true,
      severity: ErrorSeverity.MEDIUM,
    });
  }

  /**
   * Create message not sent error.
   */
  static messageNotSent(chatId: number, cause?: Error): TelegramError {
    return new TelegramError({
      message: `Failed to send message to chat ${chatId}`,
      code: TelegramErrorCodes.MESSAGE_NOT_SENT,
      chatId,
      cause,
    });
  }

  /**
   * Create invalid deep link error.
   */
  static invalidDeepLink(startParam?: string): TelegramError {
    return new TelegramError({
      message: `Invalid deep link: ${startParam || 'unknown'}`,
      code: TelegramErrorCodes.INVALID_DEEP_LINK,
      details: startParam ? { startParam } : undefined,
      recoverable: true,
      severity: ErrorSeverity.LOW,
    });
  }
}

/**
 * Determine severity based on Telegram error code.
 */
function determineTelegramSeverity(code?: number): ErrorSeverity {
  if (!code) return ErrorSeverity.MEDIUM;

  // Bot blocked by user - low severity
  if (code === 403) return ErrorSeverity.LOW;
  // Chat not found - medium severity
  if (code === 400) return ErrorSeverity.MEDIUM;
  // Flood control - medium severity
  if (code === 429) return ErrorSeverity.MEDIUM;
  // Server error - high severity
  if (code >= 500) return ErrorSeverity.HIGH;
  return ErrorSeverity.MEDIUM;
}

/**
 * Check if Telegram error is recoverable.
 */
function isTelegramRecoverable(code?: number): boolean {
  if (!code) return true;
  // Bot blocked - not recoverable without user action
  if (code === 403) return false;
  // Flood control - recoverable after cooldown
  if (code === 429) return true;
  // Server errors - usually recoverable
  if (code >= 500) return true;
  return true;
}
