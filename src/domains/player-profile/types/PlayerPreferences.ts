/**
 * Player Preferences Type
 *
 * User-configurable preferences for a player profile.
 * Contains UI, notification, and gameplay preferences.
 */

/**
 * Player preferences settings.
 */
export interface PlayerPreferences {
  /** Display language code (ISO 639-1) */
  displayLanguage: string;

  /** Whether notifications are enabled */
  notificationsEnabled: boolean;

  /** Whether sound effects are enabled */
  soundEnabled: boolean;

  /** Whether music is enabled */
  musicEnabled: boolean;

  /** Whether haptic feedback is enabled */
  hapticEnabled: boolean;

  /** Preferred energy display format */
  energyDisplayFormat: 'numeric' | 'bar' | 'both';

  /** Preferred theme */
  theme: 'dark' | 'light' | 'auto';

  /** Whether to show tutorial tooltips */
  showTutorialTooltips: boolean;

  /** Whether to auto-start expeditions */
  autoStartExpeditions: boolean;

  /** Whether to show pvp confirmations */
  pvpConfirmEnabled: boolean;
}

/**
 * Default player preferences for new players.
 */
export const DEFAULT_PLAYER_PREFERENCES: PlayerPreferences = {
  displayLanguage: 'en',
  notificationsEnabled: true,
  soundEnabled: true,
  musicEnabled: true,
  hapticEnabled: true,
  energyDisplayFormat: 'bar',
  theme: 'dark',
  showTutorialTooltips: true,
  autoStartExpeditions: false,
  pvpConfirmEnabled: true,
} as const;