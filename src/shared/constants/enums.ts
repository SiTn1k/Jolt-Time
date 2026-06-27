/**
 * Application Enums
 *
 * Central enumeration definitions for the Jolt Time application.
 * All enums should be defined here for consistency.
 */

/**
 * Log levels for application logging.
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * Environment types for the application.
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

/**
 * Error categories for classification.
 */
export enum ErrorCategory {
  VALIDATION = 'validation',
  BUSINESS = 'business',
  DATABASE = 'database',
  API = 'api',
  SECURITY = 'security',
  TELEGRAM = 'telegram',
  INTERNAL = 'internal',
}

/**
 * Error severity levels.
 * 1 = Critical, 5 = Informational
 */
export enum ErrorSeverity {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  INFORMATIONAL = 5,
}

/**
 * Operation status for async operations.
 */
export enum OperationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Entity status for soft-deletable entities.
 */
export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

/**
 * Sort order for queries and lists.
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Supported languages for localization.
 */
export enum Language {
  EN = 'en',
  ES = 'es',
  RU = 'ru',
  ZH = 'zh',
  PT = 'pt',
  DE = 'de',
  FR = 'fr',
  IT = 'it',
  JA = 'ja',
  KO = 'ko',
  AR = 'ar',
  HI = 'hi',
}

/**
 * Currency types in the game.
 */
export enum CurrencyType {
  TIME_SHARDS = 'time_shards',
  CHRONO_COINS = 'chrono_coins',
  PRESTIGE_POINTS = 'prestige_points',
  EVENT_TOKENS = 'event_tokens',
  JOLT_CRYSTALS = 'jolt_crystals',
  RESEARCH_POINTS = 'research_points',
  MUSEUM_POINTS = 'museum_points',
}

/**
 * Reward types for game rewards.
 */
export enum RewardType {
  CURRENCY = 'currency',
  ENERGY = 'energy',
  ARTIFACT = 'artifact',
  CAPSULE = 'capsule',
  XP = 'xp',
  BOOSTER = 'booster',
  COSMETIC = 'cosmetic',
  TICKET = 'ticket',
}

/**
 * Notification categories.
 */
export enum NotificationCategory {
  DAILY = 'daily',
  EVENTS = 'events',
  RESEARCH_COMPLETE = 'research_complete',
  ENERGY_RESTORED = 'energy_restored',
  BUILDING_COMPLETE = 'building_complete',
  MARKETING = 'marketing',
}

/**
 * Notification types.
 */
export enum NotificationType {
  DAILY_REMINDER = 'daily_reminder',
  ENERGY_FULL = 'energy_full',
  EVENT_START = 'event_start',
  EVENT_END = 'event_end',
  LEVEL_UP = 'level_up',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  GUILD_INVITE = 'guild_invite',
  FRIEND_REQUEST = 'friend_request',
  TOURNAMENT_START = 'tournament_start',
  REWARD_READY = 'reward_ready',
  QUEST_COMPLETE = 'quest_complete',
  ARTIFACT_DISCOVERED = 'artifact_discovered',
  MUSEUM_RATING = 'museum_rating',
}

/**
 * Artifact rarities.
 */
export enum ArtifactRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

/**
 * Booster types for temporary effects.
 */
export enum BoosterType {
  ENERGY_BOOST = 'energy_boost',
  XP_BOOST = 'xp_boost',
  REWARD_BOOST = 'reward_boost',
  SPEED_BOOST = 'speed_boost',
  LUCKY_SPIN = 'lucky_spin',
}

/**
 * Game era identifiers.
 */
export enum Era {
  MESOPOTAMIA = 'mesopotamia',
  ANCIENT_EGYPT = 'ancient_egypt',
  CLASSICAL_GREECE = 'classical_greece',
  ROMAN_EMPIRE = 'roman_empire',
  MEDIEVAL_EUROPE = 'medieval_europe',
  RENAISSANCE = 'renaissance',
  INDUSTRIAL_AGE = 'industrial_age',
  MODERN = 'modern',
  FUTURE = 'future',
}

/**
 * Expedition difficulty levels.
 */
export enum ExpeditionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  LEGENDARY = 'legendary',
}

/**
 * Quest types.
 */
export enum QuestType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  STORY = 'story',
  ACHIEVEMENT = 'achievement',
  SPECIAL = 'special',
}

/**
 * Guild roles.
 */
export enum GuildRole {
  LEADER = 'leader',
  OFFICER = 'officer',
  MEMBER = 'member',
}

/**
 * Match result types for PvP.
 */
export enum MatchResult {
  WIN = 'win',
  LOSS = 'loss',
  DRAW = 'draw',
  DISCONNECT = 'disconnect',
  CANCELLED = 'cancelled',
}

/**
 * Season status.
 */
export enum SeasonStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
