/**
 * Telegram Theme Types
 *
 * Type definitions for Telegram theme system.
 */

/**
 * Theme color schemes supported by Telegram.
 */
export enum ColorScheme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

/**
 * Telegram color palette.
 */
export interface TelegramColors {
  bgColor: string;
  textColor: string;
  hintColor: string;
  linkColor: string;
  primaryColor: string;
  primaryBgColor: string;
  secondaryBgColor: string;
  headerBgColor: string;
  accentTextColor: string;
  sectionBgColor: string;
  secondaryTextColor: string;
}

/**
 * Theme configuration for Mini App.
 */
export interface TelegramTheme {
  colors: TelegramColors;
  colorScheme: ColorScheme;
  isDark: boolean;
  isLight: boolean;
  botVersion: string | null;
}

/**
 * Theme change event data.
 */
export interface ThemeChangedEvent {
  theme: TelegramTheme;
  colors: TelegramColors;
  colorScheme: ColorScheme;
}
