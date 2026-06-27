/**
 * Platform Detector
 *
 * Detects Telegram platform and device information.
 */

import type { TelegramPlatform, OSInfo, TelegramDeviceInfo } from '../types/platform.types';
import { TelegramPlatform as Platform } from '../types/platform.types';

/**
 * Detect platform from user agent.
 */
export function detectPlatform(userAgent?: string): TelegramPlatform {
  if (typeof window === 'undefined') return Platform.UNKNOWN;

  const ua = userAgent ?? window.navigator.userAgent.toLowerCase();
  
  if (ua.includes('telegram')) {
    if (ua.includes('android')) return Platform.ANDROID;
    if (ua.includes('iphone') || ua.includes('ipad')) return Platform.IOS;
    return Platform.MOBILE as TelegramPlatform;
  }

  if (/android|adr/.test(ua)) return Platform.ANDROID;
  if (/iphone|ipad|ipod/.test(ua)) return Platform.IOS;
  if (/windows|macos|linux/.test(ua)) return Platform.DESKTOP;
  if (/web/.test(ua)) return Platform.WEB;

  return Platform.UNKNOWN;
}

/**
 * Detect OS from user agent.
 */
export function detectOS(userAgent?: string): OSInfo {
  if (typeof window === 'undefined') {
    return { name: 'Unknown', version: '', platform: Platform.UNKNOWN };
  }

  const ua = userAgent ?? window.navigator.userAgent.toLowerCase();
  const platform = detectPlatform(ua);

  if (/iphone|ipad|ipod/.test(ua)) {
    const match = ua.match(/os\s*(\d+)_(\d+)/);
    return {
      name: 'iOS',
      version: match ? `${match[1]}.${match[2]}` : '',
      platform,
    };
  }

  if (/android/.test(ua)) {
    const match = ua.match(/android\s*(\d+\.?\d*)/);
    return {
      name: 'Android',
      version: match ? match[1] : '',
      platform,
    };
  }

  if (/windows/.test(ua)) {
    const match = ua.match(/windows\s*nt\s*(\d+\.?\d*)/);
    return {
      name: 'Windows',
      version: match ? windowsVersion(match[1]) : '',
      platform,
    };
  }

  if (/macos|mac/.test(ua)) {
    const match = ua.match(/mac\s*os\s*x\s*(\d+[._]\d+)/);
    return {
      name: 'macOS',
      version: match ? match[1].replace('_', '.') : '',
      platform,
    };
  }

  if (/linux/.test(ua)) {
    return {
      name: 'Linux',
      version: '',
      platform,
    };
  }

  return { name: 'Unknown', version: '', platform };
}

/**
 * Convert Windows NT version to readable name.
 */
function windowsVersion(nt: string): string {
  const versions: Record<string, string> = {
    '10.0': '10/11',
    '6.3': '8.1',
    '6.2': '8',
    '6.1': '7',
    '6.0': 'Vista',
    '5.1': 'XP',
  };
  return versions[nt] ?? nt;
}

/**
 * Check if device is mobile.
 */
export function isMobileDevice(userAgent?: string): boolean {
  const platform = detectPlatform(userAgent);
  return platform === Platform.ANDROID || platform === Platform.IOS;
}

/**
 * Check if device is tablet.
 */
export function isTabletDevice(userAgent?: string): boolean {
  const ua = userAgent ?? (typeof window !== 'undefined' ? window.navigator.userAgent : '');
  return /ipad|tablet|kindle/.test(ua.toLowerCase());
}

/**
 * Check if device is desktop.
 */
export function isDesktopDevice(userAgent?: string): boolean {
  const platform = detectPlatform(userAgent);
  return platform === Platform.DESKTOP;
}

/**
 * Get device information from Telegram SDK or fallback to detection.
 */
export function getDeviceInfo(
  sdkPlatform?: TelegramPlatform,
  sdkVersion?: string | null
): TelegramDeviceInfo {
  const platform = sdkPlatform ?? detectPlatform();
  const osInfo = detectOS();

  return {
    platform,
    version: sdkVersion ?? osInfo.version,
    brand: null,
    model: null,
    isMobile: platform === Platform.ANDROID || platform === Platform.IOS,
    isTablet: isTabletDevice(),
    isDesktop: platform === Platform.DESKTOP,
  };
}
