/**
 * Mini App Lifecycle Service
 *
 * Manages the lifecycle of the Telegram Mini App including:
 * - Initialization
 * - Ready state
 * - Expand/collapse
 * - Viewport changes
 * - Theme changes
 * - Closing with cleanup
 */

import {
  LifecycleState,
  type LifecycleEvent,
  type ViewportState,
  type ViewportChangedEvent,
  type LifecycleCallbacks,
} from "../types/lifecycle.types";
import type {
  TelegramTheme,
} from "../types/theme.types";
import { TelegramSDK } from "../sdk/TelegramSDK";
import { TelegramEventBus, TELEGRAM_EVENT_BUS_EVENTS, TELEGRAM_LIFECYCLE_EVENTS } from "../events/TelegramEventBus";

/**
 * Lifecycle service configuration.
 */
export interface LifecycleConfig {
  sdk?: TelegramSDK;
  eventBus?: TelegramEventBus;
  autoExpand?: boolean;
  autoTrackViewport?: boolean;
  autoTrackTheme?: boolean;
}

/**
 * Mini App Lifecycle Service
 *
 * Manages Mini App lifecycle events and state transitions.
 */
export class MiniAppLifecycle {
  private static instance: MiniAppLifecycle | null = null;
  private sdk: TelegramSDK;
  private eventBus: TelegramEventBus;
  private state: LifecycleState = LifecycleState.INITIAL;
  private previousState: LifecycleState | null = null;
  private viewport: ViewportState | null = null;
  private theme: TelegramTheme | null = null;
  private callbacks: LifecycleCallbacks = {};
  private initialized = false;
  private listenersAttached = false;

  private constructor(config: LifecycleConfig = {}) {
    this.sdk = config.sdk ?? TelegramSDK.getInstance();
    this.eventBus = config.eventBus ?? TelegramEventBus.getInstance();
    if (config.autoExpand ?? true) {
      this.sdk.expand();
    }
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: LifecycleConfig): MiniAppLifecycle {
    if (!MiniAppLifecycle.instance) {
      MiniAppLifecycle.instance = new MiniAppLifecycle(config);
    }
    return MiniAppLifecycle.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    MiniAppLifecycle.instance = null;
  }

  /**
   * Register lifecycle callbacks.
   */
  onReady(callback: () => void): void {
    this.callbacks.onReady = callback;
  }

  /**
   * Register expand callback.
   */
  onExpand(callback: () => void): void {
    this.callbacks.onExpand = callback;
  }

  /**
   * Register collapse callback.
   */
  onCollapse(callback: () => void): void {
    this.callbacks.onCollapse = callback;
  }

  /**
   * Register viewport changed callback.
   */
  onViewportChanged(callback: (event: ViewportChangedEvent) => void): void {
    this.callbacks.onViewportChanged = callback;
  }

  /**
   * Register theme changed callback.
   */
  onThemeChanged(callback: (event: { theme: Record<string, string> }) => void): void {
    this.callbacks.onThemeChanged = callback;
  }

  /**
   * Register close callback.
   */
  onClose(callback: () => void): void {
    this.callbacks.onClose = callback;
  }

  /**
   * Register before close callback.
   */
  onBeforeClose(callback: (confirmed: () => void, cancelled: () => void) => void): void {
    this.callbacks.onBeforeClose = callback;
  }

  /**
   * Initialize the lifecycle service.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    await this.sdk.initialize();
    this.theme = this.sdk.getTheme();
    this.viewport = this.mapViewport(this.sdk.getViewport());
    this.attachListeners();
    this.transitionTo(LifecycleState.READY);
    this.initialized = true;

    if (this.callbacks.onReady) {
      this.callbacks.onReady();
    }

    this.eventBus.emit(TELEGRAM_LIFECYCLE_EVENTS.READY, {
      state: this.state,
      timestamp: Date.now(),
    });
  }

  /**
   * Get current lifecycle state.
   */
  getState(): LifecycleState {
    return this.state;
  }

  /**
   * Get previous lifecycle state.
   */
  getPreviousState(): LifecycleState | null {
    return this.previousState;
  }

  /**
   * Get current viewport state.
   */
  getViewport(): ViewportState | null {
    return this.viewport;
  }

  /**
   * Get current theme.
   */
  getTheme(): TelegramTheme | null {
    return this.theme;
  }

  /**
   * Expand to full screen.
   */
  expand(): void {
    this.sdk.expand();
    this.transitionTo(LifecycleState.EXPANDED);
    if (this.callbacks.onExpand) {
      this.callbacks.onExpand();
    }
  }

  /**
   * Request viewport expansion.
   */
  requestExpand(): void {
    this.sdk.expand();
  }

  /**
   * Request viewport collapse.
   */
  requestCollapse(): void {
    // Mini Apps cannot programmatically collapse
    // User must swipe down
  }

  /**
   * Check if viewport is expanded.
   */
  isExpanded(): boolean {
    return this.state === LifecycleState.EXPANDED || (this.viewport?.isExpanded ?? false);
  }

  /**
   * Close the Mini App.
   */
  close(force = false): void {
    if (force) {
      this.performClose();
    } else if (this.callbacks.onBeforeClose) {
      this.callbacks.onBeforeClose(
        () => this.performClose(),
        () => {} // cancelled - do nothing
      );
    } else {
      this.performClose();
    }
  }

  /**
   * Perform the actual close operation.
   */
  private performClose(): void {
    this.transitionTo(LifecycleState.CLOSING);
    if (this.callbacks.onClose) {
      this.callbacks.onClose();
    }
    this.sdk.close();
    this.transitionTo(LifecycleState.CLOSED);
  }

  /**
   * Attach SDK event listeners.
   */
  private attachListeners(): void {
    if (this.listenersAttached) return;

    // Viewport changed
    this.eventBus.on(TELEGRAM_LIFECYCLE_EVENTS.VIEWPORT_CHANGED, (data: ViewportChangedEvent) => {
      const previousViewport = this.viewport;
      this.viewport = data.viewport;

      const wasExpanded = previousViewport?.isExpanded ?? false;
      const isExpanded = data.viewport.isExpanded;

      if (!wasExpanded && isExpanded) {
        this.transitionTo(LifecycleState.EXPANDED);
        if (this.callbacks.onExpand) {
          this.callbacks.onExpand();
        }
      } else if (wasExpanded && !isExpanded) {
        this.transitionTo(LifecycleState.MINIMIZED);
        if (this.callbacks.onCollapse) {
          this.callbacks.onCollapse();
        }
      } else {
        this.transitionTo(LifecycleState.VIEWportChanged);
      }

      if (this.callbacks.onViewportChanged) {
        this.callbacks.onViewportChanged(data);
      }
    });

    // Theme changed
    this.eventBus.on(TELEGRAM_LIFECYCLE_EVENTS.THEME_CHANGED, (data: { theme: Record<string, string> }) => {
      this.theme = this.sdk.getTheme();
      this.transitionTo(LifecycleState.THEME_UPDATED);
      if (this.callbacks.onThemeChanged) {
        this.callbacks.onThemeChanged(data);
      }
    });

    // Main button clicked
    this.eventBus.on(TELEGRAM_EVENT_BUS_EVENTS.MAIN_BUTTON_CLICKED, () => {
      // Main button click is handled by the component using MainButton
    });

    // Back button clicked
    this.eventBus.on(TELEGRAM_EVENT_BUS_EVENTS.BACK_BUTTON_CLICKED, () => {
      // Back button click should navigate back in the app
    });

    // Settings button clicked
    this.eventBus.on(TELEGRAM_EVENT_BUS_EVENTS.SETTINGS_BUTTON_CLICKED, () => {
      // Settings button click should open settings
    });

    // Invoice closed
    this.eventBus.on(TELEGRAM_LIFECYCLE_EVENTS.INVOICE_CLOSED, (data: { slug: string }) => {
      // Handle invoice closed
    });

    this.listenersAttached = true;
  }

  /**
   * Transition to a new state.
   */
  private transitionTo(newState: LifecycleState): void {
    if (this.state === newState) return;

    this.previousState = this.state;
    this.state = newState;

    const themeColors = this.theme?.colors;
    const themeData: Record<string, string> = (themeColors as unknown as Record<string, string>) ?? {};

    const event: LifecycleEvent = {
      state: newState,
      timestamp: Date.now(),
      previousState: this.previousState ?? undefined,
      viewport: this.viewport ?? undefined,
      themeData,
    };

    this.eventBus.emit(TELEGRAM_LIFECYCLE_EVENTS.LIFECYCLE_CHANGE, event);
  }

  /**
   * Map SDK viewport to lifecycle viewport.
   */
  private mapViewport(sdkViewport: { height: number; width: number; isExpanded: boolean; isStateStable: boolean; scrollTop: number; visibleHeight: number }): ViewportState {
    return {
      height: sdkViewport.height,
      width: sdkViewport.width,
      isExpanded: sdkViewport.isExpanded,
      isStable: sdkViewport.isStateStable,
      scrollTop: sdkViewport.scrollTop,
      bufferHeight: sdkViewport.height - sdkViewport.visibleHeight,
    };
  }

  /**
   * Cleanup and remove all listeners.
   */
  cleanup(): void {
    this.callbacks = {};
    this.eventBus.off(TELEGRAM_LIFECYCLE_EVENTS.VIEWPORT_CHANGED, () => {});
    this.eventBus.off(TELEGRAM_LIFECYCLE_EVENTS.THEME_CHANGED, () => {});
    this.eventBus.off(TELEGRAM_EVENT_BUS_EVENTS.MAIN_BUTTON_CLICKED, () => {});
    this.eventBus.off(TELEGRAM_EVENT_BUS_EVENTS.BACK_BUTTON_CLICKED, () => {});
    this.eventBus.off(TELEGRAM_EVENT_BUS_EVENTS.SETTINGS_BUTTON_CLICKED, () => {});
    this.eventBus.off(TELEGRAM_LIFECYCLE_EVENTS.INVOICE_CLOSED, () => {});
    this.listenersAttached = false;
  }
}

/**
 * Get lifecycle service instance.
 */
export function getMiniAppLifecycle(config?: LifecycleConfig): MiniAppLifecycle {
  return MiniAppLifecycle.getInstance(config);
}
