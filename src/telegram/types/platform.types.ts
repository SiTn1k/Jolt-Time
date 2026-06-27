/**
 * Telegram Platform Types
 *
 * Type definitions for Telegram platform detection.
 */

/**
 * Supported Telegram platform types.
 */
export enum TelegramPlatform {
  ANDROID = 'android',
  IOS = 'ios',
  DESKTOP = 'desktop',
  WEB = 'web',
  UNKNOWN = 'unknown',
  MOBILE = 'mobile',
}

/**
 * Device information extracted from Telegram.
 */
export interface TelegramDeviceInfo {
  platform: TelegramPlatform;
  version: string | null;
  brand: string | null;
  model: string | null;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Device manufacturer type.
 */
export type DeviceManufacturer = 'apple' | 'samsung' | 'xiaomi' | 'huawei' | 'oneplus' | 'google' | 'other';

/**
 * Operating system information.
 */
export interface OSInfo {
  name: string;
  version: string;
  platform: TelegramPlatform;
}
