/**
 * Telegram Theme Provider
 *
 * Provides theme information and listens for theme changes.
 */

import type {
  TelegramTheme,
  ColorScheme,
} from '../types/theme.types';
import { TelegramSDK } from '../sdk/TelegramSDK';
import { TelegramEventBus, TELEGRAM_THEME_EVENTS } from '../events/TelegramEventBus';

/**
 * Theme provider configuration.
 */
export interface ThemeProviderConfig {
  sdk?: TelegramSDK;
  eventBus?: TelegramEventBus;
  autoTrack?: boolean;
}

/**
 * Theme change listener callback.
 */
type ThemeChangeListener = (theme: TelegramTheme) => void;

/**
 * Telegram Theme Provider
 *
 * Provides centralized access to Telegram theme information
 * with support for theme change notifications.
 */
export class TelegramThemeProvider {
  private static instance: TelegramThemeProvider | null = null;
  private sdk: TelegramSDK;
  private eventBus: TelegramEventBus;
  private currentTheme: TelegramTheme | null = null;
  private listeners: Set<ThemeChangeListener> = new Set();
  private initialized = false;

  private constructor(config: ThemeProviderConfig = {}) {
    this.sdk = config.sdk ?? TelegramSDK.getInstance();
    this.eventBus = config.eventBus ?? TelegramEventBus.getInstance();
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: ThemeProviderConfig): TelegramThemeProvider {
    if (!TelegramThemeProvider.instance) {
      TelegramThemeProvider.instance = new TelegramThemeProvider(config);
    }
    return TelegramThemeProvider.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    TelegramThemeProvider.instance = null;
  }

  /**
   * Initialize the theme provider.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.sdk.initialize();
    this.currentTheme = this.sdk.getTheme();
    this.setupListeners();
    this.initialized = true;
  }

  /**
   * Get current theme.
   */
  getTheme(): TelegramTheme {
    if (!this.currentTheme) {
      this.currentTheme = this.sdk.getTheme();
    }
    return this.currentTheme;
  }

  /**
   * Get current color scheme.
   */
  getColorScheme(): ColorScheme {
    return this.getTheme().colorScheme;
  }

  /**
   * Check if dark mode.
   */
  isDark(): boolean {
    return this.getTheme().isDark;
  }

  /**
   * Check if light mode.
   */
  isLight(): boolean {
    return this.getTheme().isLight;
  }

  /**
   * Get color from theme.
   */
  getColor(colorKey: keyof TelegramTheme['colors']): string {
    const colors = this.getTheme().colors;
    return colors[colorKey] ?? '#000000';
  }

  /**
   * Get CSS variable value.
   */
  getCSSVariable(varName: string): string {
    const colorMap: Record<string, keyof TelegramTheme['colors']> = {
      '--tg-theme-bg-color': 'bgColor',
      '--tg-theme-text-color': 'textColor',
      '--tg-theme-hint-color': 'hintColor',
      '--tg-theme-link-color': 'linkColor',
      '--tg-theme-primary-color': 'primaryColor',
      '--tg-theme-primary-bg-color': 'primaryBgColor',
      '--tg-theme-secondary-bg-color': 'secondaryBgColor',
      '--tg-theme-header-bg-color': 'headerBgColor',
      '--tg-theme-accent-text-color': 'accentTextColor',
      '--tg-theme-section-bg-color': 'sectionBgColor',
      '--tg-theme-secondary-text-color': 'secondaryTextColor',
    };

    const colorKey = colorMap[varName];
    if (colorKey) {
      return this.getColor(colorKey);
    }
    return varName;
  }

  /**
   * Subscribe to theme changes.
   */
  onThemeChange(callback: ThemeChangeListener): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Check if has theme change listeners.
   */
  hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  /**
   * Get number of theme change listeners.
   */
  listenerCount(): number {
    return this.listeners.size;
  }

  /**
   * Get raw theme params from SDK.
   */
  getRawThemeParams(): Record<string, string> {
    const theme = this.sdk.getTheme();
    return theme.colors as unknown as Record<string, string>;
  }

  /**
   * Setup event listeners.
   */
  private setupListeners(): void {
    this.eventBus.on(TELEGRAM_THEME_EVENTS.THEME_CHANGE, (data: { theme: Record<string, string> }) => {
      this.currentTheme = this.sdk.getTheme();
      this.notifyListeners();
    });

    this.eventBus.on(TELEGRAM_THEME_EVENTS.PARAMS_UPDATE, () => {
      this.currentTheme = this.sdk.getTheme();
      this.notifyListeners();
    });
  }

  /**
   * Notify all listeners of theme change.
   */
  private notifyListeners(): void {
    if (!this.currentTheme) return;
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentTheme!);
      } catch (error) {
        console.error('Error in theme change listener:', error);
      }
    });
  }

  /**
   * Convert theme to CSS variables string.
   */
  toCSSVariables(): string {
    const colors = this.getRawThemeParams();
    const lines = Object.entries(colors).map(
      ([key, value]) => `  ${key}: ${value};`
    );
    return `:root {\n${lines.join('\n')}\n}`;
  }

  /**
   * Apply theme as CSS variables to document.
   */
  applyToDocument(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const colors = this.getRawThemeParams();
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
}

/**
 * Get theme provider instance.
 */
export function getTelegramThemeProvider(config?: ThemeProviderConfig): TelegramThemeProvider {
  return TelegramThemeProvider.getInstance(config);
}
