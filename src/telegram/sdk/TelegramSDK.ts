/**
 * TelegramSDK
 *
 * Production wrapper around Telegram.WebApp SDK.
 * This is the ONLY gateway for interacting with Telegram APIs from the Mini App.
 *
 * All SDK calls must go through this wrapper - no direct Telegram.WebApp access.
 */

import type {
  TelegramUser,
  TelegramPlatform,
  LaunchParams,
} from '../types/telegram.types';
import type {
  TelegramTheme,
  ColorScheme,
} from '../types/theme.types';
import type {
  MiniAppCapabilities,
  MiniAppInitData,
  MiniAppViewport,
  PopupConfig,
  PopupButton,
} from '../types/miniapp.types';
import { TelegramPlatform as Platform } from '../types/platform.types';
import { ColorScheme as ThemeColorScheme } from '../types/theme.types';

/**
 * Telegram SDK wrapper configuration.
 */
export interface TelegramSDKConfig {
  debug?: boolean;
  version?: string;
  ignoreTimeoutViewport?: boolean;
}

/**
 * Telegram SDK error.
 */
export class TelegramSDKError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'TelegramSDKError';
  }
}

/**
 * Main Telegram SDK wrapper class.
 * Provides type-safe access to Telegram.WebApp functionality.
 */
export class TelegramSDK {
  private static instance: TelegramSDK | null = null;
  private webApp: WebAppInstance | null = null;
  private config: TelegramSDKConfig;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor(config: TelegramSDKConfig = {}) {
    this.config = {
      debug: false,
      version: '7.0',
      ignoreTimeoutViewport: false,
      ...config,
    };
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: TelegramSDKConfig): TelegramSDK {
    if (!TelegramSDK.instance) {
      TelegramSDK.instance = new TelegramSDK(config);
    }
    return TelegramSDK.instance;
  }

  /**
   * Initialize the SDK.
   * Safe to call multiple times.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.performInitialization();
    await this.initPromise;
    this.initialized = true;
  }

  /**
   * Perform actual initialization.
   */
  private async performInitialization(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new TelegramSDKError('Cannot initialize Telegram SDK on server'));
        return;
      }

      const WebApp = (window as unknown as WebAppWindow).Telegram?.WebApp;

      if (!WebApp) {
        // In development without Telegram environment
        this.log('Telegram WebApp not available - running in development mode');
        this.webApp = null;
        resolve();
        return;
      }

      try {
        WebApp.ready();
        WebApp.expand();
        this.webApp = WebApp;
        this.log('Telegram SDK initialized successfully');
        resolve();
      } catch (error) {
        reject(new TelegramSDKError('Failed to initialize Telegram WebApp', 'INIT_FAILED'));
      }
    });
  }

  /**
   * Check if running in Telegram environment.
   */
  isAvailable(): boolean {
    return this.webApp !== null;
  }

  /**
   * Get the raw WebApp instance (for internal use only).
   * Use this sparingly - prefer typed wrapper methods.
   */
  getRawWebApp(): WebAppInstance | null {
    return this.webApp;
  }

  /**
   * Get current user.
   */
  getUser(): TelegramUser | null {
    if (!this.webApp) return null;
    const user = this.webApp.initDataUnsafe?.user as RawTelegramUser | undefined;
    if (!user) return null;
    return this.mapUser(user);
  }

  /**
   * Get init data.
   */
  getInitData(): string | null {
    return this.webApp?.initData ?? null;
  }

  /**
   * Get parsed init data.
   */
  getInitDataUnsafe(): MiniAppInitData | null {
    if (!this.webApp) return null;
    return this.webApp.initDataUnsafe as MiniAppInitData ?? null;
  }

  /**
   * Get current platform.
   */
  getPlatform(): TelegramPlatform {
    if (!this.webApp) return Platform.UNKNOWN;
    const platform = this.webApp.platform;
    return this.mapPlatform(platform);
  }

  /**
   * Get SDK version.
   */
  getVersion(): string | null {
    return this.webApp?.version ?? null;
  }

  /**
   * Check if version is supported.
   */
  isVersionSupported(minVersion: string): boolean {
    if (!this.webApp) return false;
    return this.compareVersions(this.webApp.version, minVersion) >= 0;
  }

  /**
   * Get color scheme.
   */
  getColorScheme(): ColorScheme {
    if (!this.webApp) return ThemeColorScheme.LIGHT;
    return this.webApp.colorScheme === 'dark'
      ? ThemeColorScheme.DARK
      : ThemeColorScheme.LIGHT;
  }

  /**
   * Get theme params.
   */
  getTheme(): TelegramTheme {
    if (!this.webApp) {
      return {
        colors: this.getDefaultColors(),
        colorScheme: ThemeColorScheme.LIGHT,
        isDark: false,
        isLight: true,
        botVersion: null,
      };
    }
    return {
      colors: this.webApp.themeParams as unknown as TelegramTheme['colors'],
      colorScheme: this.getColorScheme(),
      isDark: this.webApp.colorScheme === 'dark',
      isLight: this.webApp.colorScheme !== 'dark',
      botVersion: this.webApp.botVersion ?? null,
    };
  }

  /**
   * Get viewport state.
   */
  getViewport(): MiniAppViewport {
    if (!this.webApp) {
      return {
        height: 0,
        width: 0,
        isExpanded: true,
        isStateStable: true,
        scrollTop: 0,
        visibleHeight: 0,
      };
    }
    return {
      height: this.webApp.viewportHeight ?? 0,
      width: this.webApp.viewportWidth ?? 0,
      isExpanded: this.webApp.isExpanded ?? true,
      isStateStable: true,
      scrollTop: this.webApp.scrollTop ?? 0,
      visibleHeight: this.webApp.viewportHeight ?? 0,
    };
  }

  /**
   * Get startup params.
   */
  getLaunchParams(): LaunchParams {
    if (!this.webApp) return {};
    const initData = this.webApp.initDataUnsafe as Record<string, unknown> | null;
    return {
      startParam: (initData?.start_param as string) ?? (initData?.startParam as string),
      startGroup: false,
      chatType: (initData?.chat_type as string) ?? (initData?.chatType as string),
      chatId: initData?.chat_id as number | undefined,
      hash: initData?.hash as string | undefined,
      authDate: initData?.auth_date
        ? new Date((initData.auth_date as number) * 1000)
        : undefined,
    };
  }

  /**
   * Get capabilities.
   */
  getCapabilities(): MiniAppCapabilities {
    if (!this.webApp) {
      return {
        canSetSecureStyle: false,
        canSetHeaderColor: false,
        canToggleStickyHeader: false,
        canInvideFriends: false,
        canShareToStories: false,
        canAddHomeScreenIcon: false,
        canAutoApproveResizable: false,
        canResizeIFrame: false,
      };
    }
    return {
      canSetSecureStyle: this.isVersionSupported('6.1'),
      canSetHeaderColor: this.isVersionSupported('6.1'),
      canToggleStickyHeader: this.isVersionSupported('6.4'),
      canInvideFriends: this.isVersionSupported('6.1'),
      canShareToStories: this.isVersionSupported('6.4'),
      canAddHomeScreenIcon: this.isVersionSupported('6.1'),
      canAutoApproveResizable: this.isVersionSupported('6.9'),
      canResizeIFrame: this.isVersionSupported('6.9'),
    };
  }

  /**
   * Expand the Mini App to full screen.
   */
  expand(): void {
    if (!this.webApp) return;
    this.webApp.expand();
  }

  /**
   * Close the Mini App.
   */
  close(): void {
    if (!this.webApp) return;
    this.webApp.close();
  }

  /**
   * Enable closing confirmation.
   */
  enableClosingConfirmation(): void {
    if (!this.webApp) return;
    this.webApp.enableClosingConfirmation();
  }

  /**
   * Disable closing confirmation.
   */
  disableClosingConfirmation(): void {
    if (!this.webApp) return;
    this.webApp.disableClosingConfirmation();
  }

  /**
   * Set header color.
   */
  setHeaderColor(color: string): void {
    if (!this.webApp || !this.isVersionSupported('6.1')) return;
    this.webApp.setHeaderColor(color);
  }

  /**
   * Set background color.
   */
  setBackgroundColor(color: string): void {
    if (!this.webApp) return;
    this.webApp.setBackgroundColor(color);
  }

  /**
   * Set secure style.
   */
  setSecureStyle(color: string): void {
    if (!this.webApp || !this.isVersionSupported('6.1')) return;
    this.webApp.setSecureStyleColor(color);
  }

  /**
   * Show main button.
   */
  showMainButton(): void {
    if (!this.webApp) return;
    this.webApp.MainButton.show();
  }

  /**
   * Hide main button.
   */
  hideMainButton(): void {
    if (!this.webApp) return;
    this.webApp.MainButton.hide();
  }

  /**
   * Enable main button.
   */
  enableMainButton(): void {
    if (!this.webApp) return;
    this.webApp.MainButton.enable();
  }

  /**
   * Disable main button.
   */
  disableMainButton(): void {
    if (!this.webApp) return;
    this.webApp.MainButton.disable();
  }

  /**
   * Set main button text.
   */
  setMainButtonText(text: string): void {
    if (!this.webApp) return;
    this.webApp.MainButton.setText(text);
  }

  /**
   * Show main button loading.
   */
  showMainButtonLoading(): void {
    if (!this.webApp) return;
    this.webApp.MainButton.showLoading();
  }

  /**
   * Hide main button loading.
   */
  hideMainButtonLoading(): void {
    if (!this.webApp) return;
    this.webApp.MainButton.hideLoading();
  }

  /**
   * Show back button.
   */
  showBackButton(): void {
    if (!this.webApp) return;
    this.webApp.BackButton.show();
  }

  /**
   * Hide back button.
   */
  hideBackButton(): void {
    if (!this.webApp) return;
    this.webApp.BackButton.hide();
  }

  /**
   * Show settings button.
   */
  showSettingsButton(): void {
    if (!this.webApp || !this.isVersionSupported('6.1')) return;
    this.webApp.SettingsButton.show();
  }

  /**
   * Hide settings button.
   */
  hideSettingsButton(): void {
    if (!this.webApp) return;
    this.webApp.SettingsButton.hide();
  }

  /**
   * Show popup.
   */
  async showPopup(config: PopupConfig): Promise<string | null> {
    if (!this.webApp) return null;
    return new Promise((resolve) => {
      this.webApp!.showPopup(
        {
          title: config.title,
          message: config.message,
          buttons: this.mapPopupButtons(config.buttons),
        },
        (buttonId) => resolve(buttonId)
      );
    });
  }

  /**
   * Show alert.
   */
  async showAlert(message: string): Promise<void> {
    if (!this.webApp) return;
    return new Promise((resolve) => {
      this.webApp!.showAlert(message, () => resolve());
    });
  }

  /**
   * Show confirm.
   */
  async showConfirm(message: string): Promise<boolean> {
    if (!this.webApp) return false;
    return new Promise((resolve) => {
      this.webApp!.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  }

  /**
   * Share message.
   */
  async shareMessage(message: string, optionalSharedUrl?: string): Promise<boolean> {
    if (!this.webApp || !this.isVersionSupported('6.6')) return false;
    return new Promise((resolve) => {
      this.webApp!.shareMessage(message, optionalSharedUrl, (success) => resolve(success));
    });
  }

  /**
   * Share to story.
   */
  async shareToStory(mediaUrl: string, text?: string, caption?: string): Promise<boolean> {
    if (!this.webApp || !this.isVersionSupported('6.4')) return false;
    return new Promise((resolve) => {
      this.webApp!.shareToStory(
        {
          media_url: mediaUrl,
          text,
          caption,
        },
        () => resolve(true)
      );
    });
  }

  /**
   * Add to home screen.
   */
  async addToHomeScreen(): Promise<boolean> {
    if (!this.webApp || !this.isVersionSupported('6.1')) return false;
    return new Promise((resolve) => {
      this.webApp!.addToHomeScreen((success) => resolve(success));
    });
  }

  /**
   * Open link.
   */
  openLink(url: string, options?: { tryBrowser?: boolean; direct?: boolean }): void {
    if (!this.webApp) {
      window.open(url, '_blank');
      return;
    }
    if (options?.direct) {
      this.webApp.openLinkDirect(url);
    } else {
      this.webApp.openTelegramLink(url);
    }
  }

  /**
   * Open telegram link.
   */
  openTelegramLink(url: string): void {
    if (!this.webApp) {
      window.open(url, '_blank');
      return;
    }
    this.webApp.openTelegramLink(url);
  }

  /**
   * Open invoice.
   */
  async openInvoice(url: string, callback?: (slug: string) => void): Promise<void> {
    if (!this.webApp) return;
    this.webApp.openInvoice(url, callback as (slug: string) => unknown);
  }

  /**
   * Trigger haptic impact feedback.
   */
  hapticImpact(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium'): void {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.impactOccurred(style);
  }

  /**
   * Trigger notification haptic.
   */
  hapticNotification(type: 'success' | 'warning' | 'error' = 'success'): void {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.notificationOccurred(type);
  }

  /**
   * Trigger selection haptic.
   */
  hapticSelection(): void {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.selectionChanged();
  }

  /**
   * Check if content can be opened.
   */
  canOpenURL(url: string): Promise<boolean> {
    if (!this.webApp) return Promise.resolve(true);
    return new Promise((resolve) => {
      this.webApp!.canOpenURL(url, (canOpen) => resolve(canOpen));
    });
  }

  /**
   * Open a URL with permission.
   */
  async openUrl(url: string): Promise<boolean> {
    if (!this.webApp) {
      window.open(url, '_blank');
      return true;
    }
    return new Promise((resolve) => {
      this.webApp!.openURL(url, (success) => resolve(success));
    });
  }

  /**
   * Test invite friends.
   */
  testInviteFriends(): void {
    if (!this.webApp || !this.isVersionSupported('6.1')) return;
    this.webApp.testInviteFriends();
  }

  /**
   * Request write access.
   */
  async requestWriteAccess(): Promise<boolean> {
    if (!this.webApp || !this.isVersionSupported('6.1')) return false;
    return new Promise((resolve) => {
      this.webApp!.requestWriteAccess((allowed) => resolve(allowed));
    });
  }

  /**
   * Check if user has unread notifications.
   */
  hasUnfaseNotifications(): Promise<boolean> {
    if (!this.webApp || !this.isVersionSupported('6.2')) return Promise.resolve(false);
    return new Promise((resolve) => {
      this.webApp!.hasUnfaseNotifications((has) => resolve(has));
    });
  }

  /**
   * Mark last notification as read.
   */
  markLastNotificationAsRead(): void {
    if (!this.webApp || !this.isVersionSupported('6.2')) return;
    this.webApp.markLastNotificationAsRead();
  }

  /**
   * Enable swipe behavior.
   */
  enableSwipeBehavior(): void {
    if (!this.webApp) return;
    this.webApp.enableSwipeBehavior();
  }

  /**
   * Disable swipe behavior.
   */
  disableSwipeBehavior(): void {
    if (!this.webApp) return;
    this.webApp.disableSwipeBehavior();
  }

  /**
   * Check if fullscreen is supported.
   */
  supportsFullscreen(): boolean {
    return this.isVersionSupported('7.0');
  }

  /**
   * Request fullscreen.
   */
  async requestFullscreen(): Promise<boolean> {
    if (!this.webApp || !this.supportsFullscreen()) return false;
    return new Promise((resolve) => {
      this.webApp!.requestFullscreen((success) => resolve(success));
    });
  }

  /**
   * Exit fullscreen.
   */
  async exitFullscreen(): Promise<boolean> {
    if (!this.webApp || !this.supportsFullscreen()) return false;
    return new Promise((resolve) => {
      this.webApp!.exitFullscreen((success) => resolve(success));
    });
  }

  /**
   * Check if is in fullscreen mode.
   */
  isFullscreen(): boolean {
    if (!this.webApp || !this.supportsFullscreen()) return false;
    return this.webApp.isFullscreen ?? false;
  }

  /**
   * Check if vertical swipe is enabled.
   */
  isVerticalSwipeEnabled(): boolean {
    if (!this.webApp) return false;
    return this.webApp.isVerticalSwipeEnabled ?? false;
  }

  /**
   * Set vertical swipe enabled.
   */
  setVerticalSwipeEnabled(enabled: boolean): void {
    if (!this.webApp || !this.isVersionSupported('6.9')) return;
    this.webApp.setVerticalSwipeEnabled(enabled);
  }

  /**
   * Map platform string to enum.
   */
  private mapPlatform(platform: string): TelegramPlatform {
    switch (platform?.toLowerCase()) {
      case 'android':
        return Platform.ANDROID;
      case 'ios':
        return Platform.IOS;
      case 'desktop':
      case 'macos':
      case 'windows':
      case 'linux':
        return Platform.DESKTOP;
      case 'web':
      case 'weba':
      case 'webview':
        return Platform.WEB;
      default:
        return Platform.UNKNOWN;
    }
  }

  /**
   * Map raw user to typed user.
   */
  private mapUser(raw: RawTelegramUser): TelegramUser {
    return {
      id: raw.id,
      isBot: raw.is_bot ?? false,
      firstName: raw.first_name,
      lastName: raw.last_name,
      username: raw.username,
      languageCode: raw.language_code,
      isPremium: raw.is_premium ?? false,
      allowsWriteToPm: raw.allows_write_to_pm ?? false,
    };
  }

  /**
   * Map popup buttons.
   */
  private mapPopupButtons(buttons?: PopupButton[]): RawPopupButton[] {
    if (!buttons) return [];
    return buttons.map((btn) => ({
      id: btn.id,
      type: btn.type ?? 'default',
      text: btn.text,
    }));
  }

  /**
   * Compare version strings.
   */
  private compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] ?? 0;
      const partB = partsB[i] ?? 0;
      if (partA > partB) return 1;
      if (partA < partB) return -1;
    }
    return 0;
  }

  /**
   * Get default colors for development mode.
   */
  private getDefaultColors() {
    return {
      bgColor: '#ffffff',
      textColor: '#000000',
      hintColor: '#999999',
      linkColor: '#007AFF',
      primaryColor: '#007AFF',
      primaryBgColor: '#007AFF',
      secondaryBgColor: '#F0F0F0',
      headerBgColor: '#FFFFFF',
      accentTextColor: '#007AFF',
      sectionBgColor: '#F0F0F0',
      secondaryTextColor: '#666666',
    };
  }

  /**
   * Log debug message.
   */
  private log(...args: unknown[]): void {
    if (this.config.debug) {
      console.log('[TelegramSDK]', ...args);
    }
  }
}

// Raw Telegram WebApp types (from Telegram SDK)
interface RawTelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
}

interface RawPopupButton {
  id?: string;
  type?: string;
  text?: string;
}

interface WebAppInstance {
  ready(): void;
  expand(): void;
  close(): void;
  initData: string;
  initDataUnsafe: Record<string, unknown>;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  viewportHeight?: number;
  viewportWidth?: number;
  isExpanded?: boolean;
  scrollTop?: number;
  headerColor?: string;
  backgroundColor?: string;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  setSecureStyleColor(color: string): void;
  MainButton: MainButtonInstance;
  BackButton: BackButtonInstance;
  SettingsButton: SettingsButtonInstance;
  HapticFeedback: HapticFeedbackInstance;
  showPopup(config: Record<string, unknown>, callback: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback: (confirmed: boolean) => void): void;
  shareMessage(message: string, optionalSharedUrl: string | undefined, callback?: (success: boolean) => void): void;
  shareToStory(config: Record<string, unknown>, callback?: () => void): void;
  addToHomeScreen(callback?: (success: boolean) => void): void;
  openLink(url: string): void;
  openLinkDirect(url: string): void;
  openTelegramLink(url: string): void;
  openInvoice(url: string, callback?: (slug: string) => unknown): void;
  canOpenURL(url: string, callback: (canOpen: boolean) => void): void;
  openURL(url: string, callback?: (success: boolean) => void): void;
  testInviteFriends(): void;
  requestWriteAccess(callback: (allowed: boolean) => void): void;
  hasUnfaseNotifications(callback: (has: boolean) => void): void;
  markLastNotificationAsRead(): void;
  enableSwipeBehavior(): void;
  disableSwipeBehavior(): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  isVerticalSwipeEnabled?: boolean;
  setVerticalSwipeEnabled(enabled: boolean): void;
  isFullscreen?: boolean;
  requestFullscreen(callback?: (success: boolean) => void): void;
  exitFullscreen(callback?: (success: boolean) => void): void;
  botVersion?: string;
}

interface MainButtonInstance {
  show(): void;
  hide(): void;
  enable(): void;
  disable(): void;
  setText(text: string): void;
  showLoading(): void;
  hideLoading(): void;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
  setParams(params: Record<string, unknown>): void;
}

interface BackButtonInstance {
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
}

interface SettingsButtonInstance {
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
}

interface HapticFeedbackInstance {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
  notificationOccurred(type: 'success' | 'warning' | 'error'): void;
  selectionChanged(): void;
}

interface WebAppWindow {
  Telegram?: {
    WebApp?: WebAppInstance;
  };
}

/**
 * Get the SDK instance.
 */
export function getTelegramSDK(config?: TelegramSDKConfig): TelegramSDK {
  return TelegramSDK.getInstance(config);
}
