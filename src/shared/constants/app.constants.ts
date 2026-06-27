/**
 * Application Constants
 *
 * Central application-wide constant values.
 * No magic numbers allowed - all values defined here.
 */

/**
 * Application info constants.
 */
export const APP_NAME = 'Jolt Time';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Time travel educational entertainment';

/**
 * API configuration constants.
 */
export const API_TIMEOUT_MS = 30000;
export const API_RETRY_ATTEMPTS = 3;
export const API_RETRY_DELAY_MS = 1000;

/**
 * Pagination constants.
 */
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 1;

/**
 * Cache TTL constants in milliseconds.
 */
export const CACHE_TTL_SHORT_MS = 60_000; // 1 minute
export const CACHE_TTL_MEDIUM_MS = 300_000; // 5 minutes
export const CACHE_TTL_LONG_MS = 3_600_000; // 1 hour

/**
 * Energy system constants.
 */
export const ENERGY_DEFAULT_MAX = 100;
export const ENERGY_STARTING_AMOUNT = 100;
export const ENERGY_REGEN_PER_TICK = 1;
export const ENERGY_REGEN_MINUTES_PER_TICK = 3;
export const ENERGY_MAX_CAP_PER_LEVEL = [
  { level: 1, maxEnergy: 100 },
  { level: 11, maxEnergy: 110 },
  { level: 21, maxEnergy: 125 },
  { level: 31, maxEnergy: 140 },
  { level: 41, maxEnergy: 160 },
  { level: 51, maxEnergy: 180 },
  { level: 61, maxEnergy: 200 },
  { level: 71, maxEnergy: 220 },
  { level: 81, maxEnergy: 240 },
  { level: 91, maxEnergy: 260 },
];

/**
 * Player level constants.
 */
export const PLAYER_MAX_LEVEL = 100;
export const XP_PER_LEVEL_BASE = 1000;
export const XP_PER_LEVEL_GROWTH = 1.2;

/**
 * Daily rewards cycle constants.
 */
export const DAILY_REWARDS_CYCLE_LENGTH = 7;
export const DAILY_REWARDS_MAX_STREAK = 365;

/**
 * Notification cooldown constants in milliseconds.
 */
export const NOTIFICATION_COOLDOWN_SHORT_MS = 300_000; // 5 minutes
export const NOTIFICATION_COOLDOWN_MEDIUM_MS = 3_600_000; // 1 hour
export const NOTIFICATION_COOLDOWN_LONG_MS = 86_400_000; // 24 hours

/**
 * Ads integration constants.
 */
export const ADS_DAILY_LIMIT_FREE = 5;
export const ADS_DAILY_LIMIT_PREMIUM = 10;
export const ADS_INTERSTITIAL_HOURLY_LIMIT = 8;
export const ADS_COOLDOWN_MS = 60_000; // 1 minute

/**
 * Guild constants.
 */
export const GUILD_MAX_MEMBERS = 50;
export const GUILD_MIN_NAME_LENGTH = 3;
export const GUILD_MAX_NAME_LENGTH = 30;
export const GUILD_OFFICER_LIMIT = 5;

/**
 * Friend system constants.
 */
export const FRIEND_MAX_COUNT = 100;
export const FRIEND_GIFT_DAILY_LIMIT = 5;

/**
 * Leaderboard constants.
 */
export const LEADERBOARD_TOP_COUNT = 100;
export const LEADERBOARD_UPDATE_INTERVAL_MS = 300_000; // 5 minutes

/**
 * Expedition time constants in milliseconds.
 */
export const EXPEDITION_SHORT_MS = 1_800_000; // 30 minutes
export const EXPEDITION_MEDIUM_MS = 7_200_000; // 2 hours
export const EXPEDITION_LONG_MS = 28_800_000; // 8 hours

/**
 * Story mode energy costs.
 */
export const STORY_ENERGY_COST_EASY = 5;
export const STORY_ENERGY_COST_MEDIUM = 10;
export const STORY_ENERGY_COST_HARD = 15;
export const STORY_ENERGY_COST_LEGENDARY = 20;

/**
 * PvP constants.
 */
export const PVP_TICKETS_MAX = 5;
export const PVP_TICKETS_REGEN_DAILY = 5;
export const PVP_ENERGY_COST = 15;

/**
 * Tournament bracket sizes.
 */
export const TOURNAMENT_BRACKET_SIZES = [4, 8, 16, 32, 64];

/**
 * Validation limits.
 */
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const BIO_MAX_LENGTH = 500;
export const GUILD_DESCRIPTION_MAX_LENGTH = 200;

/**
 * Rate limiting constants.
 */
export const RATE_LIMIT_REQUESTS_PER_MINUTE = 60;
export const RATE_LIMIT_BURST = 10;

/**
 * Date/time format constants.
 */
export const DATE_FORMAT_ISO = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
export const DATE_FORMAT_DISPLAY = 'MMM DD, YYYY';
export const DATE_FORMAT_TIME = 'HH:mm';
export const TIMEZONE_UTC = 'UTC';

/**
 * Animation duration constants in milliseconds.
 */
export const ANIMATION_FAST_MS = 150;
export const ANIMATION_NORMAL_MS = 300;
export const ANIMATION_SLOW_MS = 500;

/**
 * Debounce/throttle constants in milliseconds.
 */
export const DEBOUNCE_DELAY_MS = 300;
export const THROTTLE_DELAY_MS = 100;

/**
 * Local storage keys.
 */
export const STORAGE_KEY_USER_PREFERENCES = 'jolt_user_preferences';
export const STORAGE_KEY_AUTH_TOKEN = 'jolt_auth_token';
export const STORAGE_KEY_LAST_SYNC = 'jolt_last_sync';

/**
 * Feature flag keys.
 */
export const FLAG_NEW_MUSEUM_UI = 'new_museum_ui';
export const FLAG_EXPERIMENTAL_FEATURES = 'experimental_features';
export const FLAG_BATTLE_PASS_V2 = 'battle_pass_v2';
