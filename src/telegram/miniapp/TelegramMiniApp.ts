/**
 * Telegram Mini App
 *
 * Mini App integration utilities and components.
 */

import type { MiniAppViewport, MiniAppCapabilities } from '../types/miniapp.types';
import type { TelegramTheme } from '../types/theme.types';
import { TelegramSDK } from '../sdk/TelegramSDK';
import { TelegramContextProvider } from '../providers/TelegramContextProvider';

/**
 * Mini App configuration.
 */
export interface MiniAppConfig {
  sdk?: TelegramSDK;
  contextProvider?: TelegramContextProvider;
  autoExpand?: boolean;
  autoTrackTheme?: boolean;
}

/**
 * Telegram Mini App
 *
 * Main entry point for Mini App functionality.
 */
export class TelegramMiniApp {
  private static instance: TelegramMiniApp | null = null;
  private sdk: TelegramSDK;
  private contextProvider: TelegramContextProvider;
  private initialized = false;

  private constructor(config: MiniAppConfig) {
    this.sdk = config.sdk ?? TelegramSDK.getInstance();
    this.contextProvider = config.contextProvider ?? TelegramContextProvider.getInstance();
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: MiniAppConfig): TelegramMiniApp {
    if (!TelegramMiniApp.instance) {
      TelegramMiniApp.instance = new TelegramMiniApp(config ?? {});
    }
    return TelegramMiniApp.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    TelegramMiniApp.instance = null;
  }

  /**
   * Initialize the Mini App.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.sdk.initialize();
    await this.contextProvider.initialize();
    this.initialized = true;
  }

  /**
   * Get current viewport.
   */
  getViewport(): MiniAppViewport {
    return this.sdk.getViewport();
  }

  /**
   * Get current theme.
   */
  getTheme(): TelegramTheme {
    return this.sdk.getTheme();
  }

  /**
   * Get capabilities.
   */
  getCapabilities(): MiniAppCapabilities {
    return this.sdk.getCapabilities();
  }

  /**
   * Expand the Mini App.
   */
  expand(): void {
    this.sdk.expand();
  }

  /**
   * Close the Mini App.
   */
  close(): void {
    this.sdk.close();
  }

  /**
   * Check if running in Telegram.
   */
  isAvailable(): boolean {
    return this.sdk.isAvailable();
  }

  /**
   * Get the SDK instance.
   */
  getSDK(): TelegramSDK {
    return this.sdk;
  }

  /**
   * Get the context provider instance.
   */
  getContextProvider(): TelegramContextProvider {
    return this.contextProvider;
  }
}

/**
 * Get Mini App instance.
 */
export function getTelegramMiniApp(config?: MiniAppConfig): TelegramMiniApp {
  return TelegramMiniApp.getInstance(config);
}
