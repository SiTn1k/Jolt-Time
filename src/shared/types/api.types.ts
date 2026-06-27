/**
 * API Types
 *
 * API-related type definitions for HTTP and RPC communication.
 */

/**
 * HTTP methods supported by the API client.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Query parameters for API requests.
 */
export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Headers for API requests.
 */
export type HttpHeaders = Record<string, string>;

/**
 * API request configuration.
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: QueryParams;
  headers?: HttpHeaders;
  body?: unknown;
  timeout?: number;
}

/**
 * Telegram init data for authentication.
 */
export interface TelegramInitData {
  queryId: string;
  user: TelegramUser;
  chat?: TelegramChat;
  chatType?: string;
  chatInstance?: string;
  startParam?: string;
  canSendAfter?: number;
  authDate: number;
  hash: string;
}

/**
 * Telegram user from init data.
 */
export interface TelegramUser {
  id: number;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
}

/**
 * Telegram chat from init data.
 */
export interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Telegram callback query data.
 */
export interface TelegramCallbackData {
  action: string;
  payload?: Record<string, unknown>;
}

/**
 * Edge function response wrapper.
 */
export interface EdgeFunctionResponse<T = unknown> {
  statusCode: number;
  body: T;
  headers?: Record<string, string>;
}

/**
 * Webhook event payload.
 */
export interface WebhookPayload<T = unknown> {
  event: string;
  timestamp: number;
  data: T;
  signature?: string;
}
