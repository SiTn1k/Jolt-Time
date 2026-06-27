/**
 * Telegram Event Bus
 *
 * Central event bus for all Telegram events including:
 * - SDK Events
 * - MiniApp Events
 * - Theme Events
 * - Viewport Events
 * - Lifecycle Events
 */

import type { ViewportChangedEvent } from '../types/lifecycle.types';
import type { ThemeChangedEvent } from '../types/theme.types';

/**
 * Event bus configuration.
 */
export interface EventBusConfig {
  debug?: boolean;
}

/**
 * Event listener callback type.
 */
type EventListener<T = unknown> = (data: T) => void;

/**
 * Telegram Event Names
 */
export const TELEGRAM_EVENT_BUS_EVENTS = {
  READY: 'telegram:ready',
  EXPAND: 'telegram:expand',
  COLLAPSE: 'telegram:collapse',
  VIEWPORT_CHANGED: 'telegram:viewport_changed',
  THEME_CHANGED: 'telegram:theme_changed',
  MAIN_BUTTON_CLICKED: 'telegram:main_button_clicked',
  BACK_BUTTON_CLICKED: 'telegram:back_button_clicked',
  SETTINGS_BUTTON_CLICKED: 'telegram:settings_button_clicked',
  INVOICE_CLOSED: 'telegram:invoice_closed',
  CLOSE_BTN_CLICKED: 'telegram:close_btn_clicked',
  SWIPE_DOWN: 'telegram:swipe_down',
  SWIPE_UP: 'telegram:swipe_up',
} as const;

/**
 * Telegram Lifecycle Event Names
 */
export const TELEGRAM_LIFECYCLE_EVENTS = {
  READY: 'telegram:lifecycle:ready',
  EXPAND: 'telegram:lifecycle:expand',
  COLLAPSE: 'telegram:lifecycle:collapse',
  VIEWPORT_CHANGED: 'telegram:lifecycle:viewport_changed',
  THEME_CHANGED: 'telegram:lifecycle:theme_changed',
  LIFECYCLE_CHANGE: 'telegram:lifecycle:change',
  CLOSE: 'telegram:lifecycle:close',
  INVOICE_CLOSED: 'telegram:lifecycle:invoice_closed',
} as const;

/**
 * Telegram Theme Event Names
 */
export const TELEGRAM_THEME_EVENTS = {
  THEME_CHANGE: 'telegram:theme:change',
  COLOR_SCHEME_CHANGE: 'telegram:theme:color_scheme_change',
  PARAMS_UPDATE: 'telegram:theme:params_update',
} as const;

/**
 * Telegram Viewport Event Names
 */
export const TELEGRAM_VIEWPORT_EVENTS = {
  EXPAND: 'telegram:viewport:expand',
  COLLAPSE: 'telegram:viewport:collapse',
  CHANGE: 'telegram:viewport:change',
  STABLE: 'telegram:viewport:stable',
  SCROLL: 'telegram:viewport:scroll',
} as const;

/**
 * Event listener entry.
 */
interface ListenerEntry {
  callback: EventListener;
  context?: unknown;
  once?: boolean;
}

/**
 * Telegram Event Bus
 *
 * Central event bus for Telegram-related events.
 * Implements pub/sub pattern with support for:
 * - Typed events
 * - One-time listeners
 * - Event namespacing
 * - Multiple listeners per event
 */
export class TelegramEventBus {
  private static instance: TelegramEventBus | null = null;
  private listeners = new Map<string, ListenerEntry[]>();
  private debug: boolean;

  private constructor(config: EventBusConfig = {}) {
    this.debug = config.debug ?? false;
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: EventBusConfig): TelegramEventBus {
    if (!TelegramEventBus.instance) {
      TelegramEventBus.instance = new TelegramEventBus(config);
    }
    return TelegramEventBus.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    TelegramEventBus.instance = null;
  }

  /**
   * Subscribe to an event.
   */
  on<T = unknown>(event: string, callback: EventListener<T>, context?: unknown): () => void {
    const entries = this.listeners.get(event) ?? [];
    entries.push({ callback: callback as EventListener, context, once: false });
    this.listeners.set(event, entries);
    this.log(`Subscribed to: ${event}`);
    return () => this.off(event, callback, context);
  }

  /**
   * Subscribe to an event once.
   */
  once<T = unknown>(event: string, callback: EventListener<T>, context?: unknown): () => void {
    const entries = this.listeners.get(event) ?? [];
    entries.push({ callback: callback as EventListener, context, once: true });
    this.listeners.set(event, entries);
    this.log(`Subscribed once to: ${event}`);
    return () => this.off(event, callback, context);
  }

  /**
   * Unsubscribe from an event.
   */
  off<T = unknown>(event: string, callback: EventListener<T>, context?: unknown): void {
    const entries = this.listeners.get(event);
    if (!entries) return;

    const filtered = entries.filter(
      (entry) =>
        entry.callback !== callback ||
        (context !== undefined && entry.context !== context)
    );

    if (filtered.length === 0) {
      this.listeners.delete(event);
    } else {
      this.listeners.set(event, filtered);
    }
    this.log(`Unsubscribed from: ${event}`);
  }

  /**
   * Emit an event.
   */
  emit<T = unknown>(event: string, data?: T): void {
    const entries = this.listeners.get(event);
    if (!entries || entries.length === 0) {
      this.log(`No listeners for: ${event}`);
      return;
    }

    this.log(`Emitting: ${event}`, data);

    // Create a copy to avoid mutation issues
    const entriesCopy = [...entries];

    for (const entry of entriesCopy) {
      try {
        entry.callback(data as T);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }

      if (entry.once) {
        this.off(event, entry.callback, entry.context);
      }
    }
  }

  /**
   * Check if event has listeners.
   */
  hasListeners(event: string): boolean {
    const entries = this.listeners.get(event);
    return entries !== undefined && entries.length > 0;
  }

  /**
   * Get number of listeners for an event.
   */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.length ?? 0;
  }

  /**
   * Remove all listeners for an event.
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Subscribe to multiple events at once.
   */
  onMultiple(
    events: string[],
    callback: EventListener,
    context?: unknown
  ): () => void {
    const unsubscribes = events.map((event) => this.on(event, callback, context));
    return () => unsubscribes.forEach((unsub) => unsub());
  }

  /**
   * Subscribe to lifecycle events.
   */
  onLifecycleReady(callback: EventListener): () => void {
    return this.on(TELEGRAM_LIFECYCLE_EVENTS.READY, callback);
  }

  /**
   * Subscribe to viewport changes.
   */
  onViewportChanged(callback: EventListener<ViewportChangedEvent>): () => void {
    return this.on(TELEGRAM_LIFECYCLE_EVENTS.VIEWPORT_CHANGED, callback);
  }

  /**
   * Subscribe to theme changes.
   */
  onThemeChanged(callback: EventListener<ThemeChangedEvent>): () => void {
    return this.on(TELEGRAM_LIFECYCLE_EVENTS.THEME_CHANGED, callback);
  }

  /**
   * Subscribe to main button clicks.
   */
  onMainButtonClicked(callback: EventListener): () => void {
    return this.on(TELEGRAM_EVENT_BUS_EVENTS.MAIN_BUTTON_CLICKED, callback);
  }

  /**
   * Subscribe to back button clicks.
   */
  onBackButtonClicked(callback: EventListener): () => void {
    return this.on(TELEGRAM_EVENT_BUS_EVENTS.BACK_BUTTON_CLICKED, callback);
  }

  /**
   * Subscribe to settings button clicks.
   */
  onSettingsButtonClicked(callback: EventListener): () => void {
    return this.on(TELEGRAM_EVENT_BUS_EVENTS.SETTINGS_BUTTON_CLICKED, callback);
  }

  /**
   * Subscribe to invoice closed events.
   */
  onInvoiceClosed(callback: EventListener<{ slug: string }>): () => void {
    return this.on(TELEGRAM_EVENT_BUS_EVENTS.INVOICE_CLOSED, callback);
  }

  /**
   * Log debug message.
   */
  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[TelegramEventBus]', ...args);
    }
  }
}

/**
 * Get event bus instance.
 */
export function getTelegramEventBus(config?: EventBusConfig): TelegramEventBus {
  return TelegramEventBus.getInstance(config);
}
