/**
 * Telegram Mini App Types
 *
 * Type definitions for Telegram Mini App.
 */

/**
 * Mini App version information.
 */
export interface MiniAppVersion {
  major: number;
  minor: number;
  patch: number;
  string: string;
  isValid: boolean;
}

/**
 * Mini App capabilities.
 */
export interface MiniAppCapabilities {
  canSetSecureStyle: boolean;
  canSetHeaderColor: boolean;
  canToggleStickyHeader: boolean;
  canInvideFriends: boolean;
  canShareToStories: boolean;
  canAddHomeScreenIcon: boolean;
  canAutoApproveResizable: boolean;
  canResizeIFrame: boolean;
}

/**
 * Mini App viewport information.
 */
export interface MiniAppViewport {
  height: number;
  width: number;
  isExpanded: boolean;
  isStateStable: boolean;
  scrollTop: number;
  visibleHeight: number;
}

/**
 * Main Button states.
 */
export enum MainButtonState {
  TEXT = 'text',
  LOADING = 'loading',
  DISABLED = 'disabled',
  PROGRESS = 'progress',
}

/**
 * BackButton visibility state.
 */
export type BackButtonState = 'visible' | 'hidden';

/**
 * Mini App init data structure.
 */
export interface MiniAppInitData {
  queryId?: string;
  user?: MiniAppUser;
  chatType?: string;
  chatInstance?: string;
  startParam?: string;
  canEditMessage?: boolean;
  isMessagePrivate?: boolean;
  receiver?: MiniAppUser;
  authDate?: Date;
  hash?: string;
}

/**
 * Mini App user from init data.
 */
export interface MiniAppUser {
  id: number;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium: boolean;
}

/**
 * Popup configuration.
 */
export interface PopupConfig {
  title?: string;
  message: string;
  buttons?: PopupButton[];
}

/**
 * Popup button configuration.
 */
export interface PopupButton {
  id?: string;
  type?: 'default' | 'ok' | ' close' | 'cancel' | 'destructive';
  text?: string;
}

/**
 * Haptic feedback types.
 */
export enum HapticFeedbackType {
  IMPACT = 'impact',
  NOTIFICATION = 'notification',
  SELECTION = 'selection',
  SOFT = 'soft',
  RIGID = 'rigid',
}

/**
 * Impact feedback styles.
 */
export enum ImpactFeedbackStyle {
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

/**
 * Notification feedback types.
 */
export enum NotificationFeedbackType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}
