/**
 * Telegram Lifecycle Types
 *
 * Type definitions for Mini App lifecycle management.
 */

/**
 * Mini App lifecycle states.
 */
export enum LifecycleState {
  INITIAL = 'initial',
  LOADING = 'loading',
  READY = 'ready',
  EXPANDED = 'expanded',
  MINIMIZED = 'minimized',
  VIEWportChanged = 'viewport_changed',
  THEME_UPDATED = 'theme_updated',
  CLOSING = 'closing',
  CLOSED = 'closed',
}

/**
 * Mini App lifecycle event data.
 */
export interface LifecycleEvent {
  state: LifecycleState;
  timestamp: number;
  previousState?: LifecycleState;
  viewport?: ViewportState;
  themeData?: Record<string, string>;
}

/**
 * Viewport state information.
 */
export interface ViewportState {
  height: number;
  width: number;
  isExpanded: boolean;
  isStable: boolean;
  scrollTop: number;
  bufferHeight: number;
}

/**
 * Viewport change event data.
 */
export interface ViewportChangedEvent {
  viewport: ViewportState;
  previousViewport?: ViewportState;
  isStable: boolean;
}

/**
 * Mini App initialization options.
 */
export interface MiniAppOptions {
  elem: HTMLElement | null;
  mode?: 'iframe' | 'tab' | 'semi-transparent';
  transition?: 'fade' | 'slide';
  allowVerticalScroll?: boolean;
  showDuration?: number;
  haptic?: boolean;
}

/**
 * Lifecycle callbacks interface.
 */
export interface LifecycleCallbacks {
  onReady?: () => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onViewportChanged?: (event: ViewportChangedEvent) => void;
  onThemeChanged?: (event: { theme: Record<string, string> }) => void;
  onClose?: () => void;
  onBeforeClose?: (confirmed: () => void, cancelled: () => void) => void;
}
