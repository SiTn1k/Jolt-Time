/**
 * TelegramContextProvider
 *
 * Provides current Telegram context including user, chat, platform, device,
 * launch parameters, and runtime context.
 *
 * This is the primary interface for accessing Telegram information throughout
 * the application.
 */

import { TelegramPlatform as Platform } from '../types/platform.types';
import type {
  TelegramUser,
  TelegramPlatform,
  RuntimeContext,
  LaunchParams,
  TelegramContext,
} from '../types/telegram.types';
import type {
  TelegramDeviceInfo,
  OSInfo,
} from '../types/platform.types';
import type {
  MiniAppCapabilities,
  MiniAppInitData,
} from '../types/miniapp.types';
import { TelegramSDK } from '../sdk/TelegramSDK';
import { detectPlatform, detectOS } from '../services/PlatformDetector';

/**
 * Context provider configuration.
 */
export interface TelegramContextConfig {
  sdk?: TelegramSDK;
  enableDeviceDetection?: boolean;
  enableRuntimeContext?: boolean;
}

/**
 * Telegram Context Provider
 *
 * Provides centralized access to Telegram context information.
 * Implements singleton pattern for consistent access.
 */
export class TelegramContextProvider {
  private static instance: TelegramContextProvider | null = null;
  private sdk: TelegramSDK;
  private user: TelegramUser | null = null;
  private chatType: TelegramContext['chatType'] = null;
  private chatInstance: string | null = null;
  private startParam: string | null = null;
  private platform: TelegramPlatform = Platform.UNKNOWN;
  private deviceInfo: TelegramDeviceInfo | null = null;
  private osInfo: OSInfo | null = null;
  private runtimeContext: RuntimeContext | null = null;
  private launchParams: LaunchParams = {};
  private initialized = false;

  private constructor(config: TelegramContextConfig = {}) {
    this.sdk = config.sdk ?? TelegramSDK.getInstance();
    if (config.enableDeviceDetection ?? true) {
      this.initializeDeviceInfo();
    }
    if (config.enableRuntimeContext ?? true) {
      this.initializeRuntimeContext();
    }
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: TelegramContextConfig): TelegramContextProvider {
    if (!TelegramContextProvider.instance) {
      TelegramContextProvider.instance = new TelegramContextProvider(config);
    }
    return TelegramContextProvider.instance;
  }

  /**
   * Reset singleton instance (for testing).
   */
  static resetInstance(): void {
    TelegramContextProvider.instance = null;
  }

  /**
   * Initialize the provider.
   * Must be called before use.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    await this.sdk.initialize();
    this.user = this.sdk.getUser();
    this.platform = this.sdk.getPlatform();
    this.launchParams = this.sdk.getLaunchParams();
    this.chatType = this.extractChatType();
    this.chatInstance = this.extractChatInstance();
    this.startParam = this.extractStartParam();
    this.initialized = true;
  }

  /**
   * Get the complete Telegram context.
   */
  getContext(): TelegramContext {
    return {
      user: this.user,
      chat: null,
      chatType: this.chatType,
      chatInstance: this.chatInstance,
      startParam: this.startParam,
      platform: this.platform,
      version: this.sdk.getVersion(),
      initData: this.sdk.getInitData(),
      initDataUnsafe: this.sdk.getInitDataUnsafe(),
      isMiniApp: this.sdk.isAvailable(),
      isBot: this.user?.isBot ?? false,
    };
  }

  /**
   * Get current user.
   */
  getUser(): TelegramUser | null {
    return this.user;
  }

  /**
   * Get current user ID.
   */
  getUserId(): number | null {
    return this.user?.id ?? null;
  }

  /**
   * Get current username.
   */
  getUsername(): string | null {
    return this.user?.username ?? null;
  }

  /**
   * Get display name.
   */
  getDisplayName(): string {
    if (!this.user) return 'Unknown User';
    return this.user.firstName + (this.user.lastName ? ` ${this.user.lastName}` : '');
  }

  /**
   * Get chat type.
   */
  getChatType(): TelegramContext['chatType'] {
    return this.chatType;
  }

  /**
   * Get chat instance.
   */
  getChatInstance(): string | null {
    return this.chatInstance;
  }

  /**
   * Get start parameter.
   */
  getStartParam(): string | null {
    return this.startParam;
  }

  /**
   * Get platform.
   */
  getPlatform(): TelegramPlatform {
    return this.platform;
  }

  /**
   * Get SDK version.
   */
  getVersion(): string | null {
    return this.sdk.getVersion();
  }

  /**
   * Get init data string.
   */
  getInitData(): string | null {
    return this.sdk.getInitData();
  }

  /**
   * Get parsed init data.
   */
  getInitDataUnsafe(): MiniAppInitData | null {
    return this.sdk.getInitDataUnsafe();
  }

  /**
   * Check if running in Telegram.
   */
  isInTelegram(): boolean {
    return this.sdk.isAvailable();
  }

  /**
   * Check if user is premium.
   */
  isPremium(): boolean {
    return this.user?.isPremium ?? false;
  }

  /**
   * Check if user is bot.
   */
  isBot(): boolean {
    return this.user?.isBot ?? false;
  }

  /**
   * Get device information.
   */
  getDeviceInfo(): TelegramDeviceInfo | null {
    return this.deviceInfo;
  }

  /**
   * Get OS information.
   */
  getOSInfo(): OSInfo | null {
    return this.osInfo;
  }

  /**
   * Get runtime context.
   */
  getRuntimeContext(): RuntimeContext {
    return this.runtimeContext ?? {
      isServer: typeof window === 'undefined',
      isClient: typeof window !== 'undefined',
      isiframe: false,
      isTelegram: this.sdk.isAvailable(),
      supportsViewportMeta: false,
      supportsDynamicMeta: false,
    };
  }

  /**
   * Get launch parameters.
   */
  getLaunchParams(): LaunchParams {
    return { ...this.launchParams };
  }

  /**
   * Get SDK capabilities.
   */
  getCapabilities(): MiniAppCapabilities {
    return this.sdk.getCapabilities();
  }

  /**
   * Get the underlying SDK.
   */
  getSDK(): TelegramSDK {
    return this.sdk;
  }

  /**
   * Initialize device information.
   */
  private initializeDeviceInfo(): void {
    const platform = this.sdk.getPlatform();
    this.deviceInfo = {
      platform,
      version: this.sdk.getVersion(),
      brand: null,
      model: null,
      isMobile: platform === Platform.ANDROID || platform === Platform.IOS,
      isTablet: false,
      isDesktop: platform === Platform.DESKTOP,
    };
    this.osInfo = detectOS();
  }

  /**
   * Initialize runtime context.
   */
  private initializeRuntimeContext(): void {
    if (typeof window === 'undefined') {
      this.runtimeContext = {
        isServer: true,
        isClient: false,
        isiframe: false,
        isTelegram: false,
        supportsViewportMeta: false,
        supportsDynamicMeta: false,
      };
      return;
    }

    const win = window;
    this.runtimeContext = {
      isServer: false,
      isClient: true,
      isiframe: win !== win.top,
      isTelegram: this.sdk.isAvailable(),
      supportsViewportMeta: this.checkViewportMeta(),
      supportsDynamicMeta: this.checkDynamicMeta(),
    };
  }

  /**
   * Check viewport meta support.
   */
  private checkViewportMeta(): boolean {
    if (typeof document === 'undefined') return false;
    const meta = document.querySelector('meta[name="viewport"]');
    return meta !== null;
  }

  /**
   * Check dynamic meta tag support.
   */
  private checkDynamicMeta(): boolean {
    if (typeof document === 'undefined') return false;
    return true;
  }

  /**
   * Extract chat type from init data.
   */
  private extractChatType(): TelegramContext['chatType'] {
    const initData = this.sdk.getInitDataUnsafe();
    if (!initData?.chatType) return null;
    return initData.chatType as TelegramContext['chatType'];
  }

  /**
   * Extract chat instance from init data.
   */
  private extractChatInstance(): string | null {
    const initData = this.sdk.getInitDataUnsafe();
    return initData?.chatInstance ?? null;
  }

  /**
   * Extract start parameter from init data.
   */
  private extractStartParam(): string | null {
    const initData = this.sdk.getInitDataUnsafe();
    return initData?.startParam ?? null;
  }
}

/**
 * Get context provider instance.
 */
export function getTelegramContext(config?: TelegramContextConfig): TelegramContextProvider {
  return TelegramContextProvider.getInstance(config);
}
