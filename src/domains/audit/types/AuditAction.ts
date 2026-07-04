/**
 * Audit Action Types
 *
 * Defines all supported audit action types in the system.
 * Actions are the operations being recorded in the audit log.
 */

/**
 * Supported audit action types.
 * Each action represents a category of auditable system operations.
 */
export enum AuditAction {
  // Authentication actions
  AUTHENTICATION_LOGIN = 'authentication.login',
  AUTHENTICATION_LOGOUT = 'authentication.logout',
  AUTHENTICATION_FAILED = 'authentication.failed',
  AUTHENTICATION_2FA_ENABLED = 'authentication.2fa_enabled',
  AUTHENTICATION_2FA_DISABLED = 'authentication.2fa_disabled',

  // Player actions
  PLAYER_CREATED = 'player.created',
  PLAYER_UPDATED = 'player.updated',
  PLAYER_DELETED = 'player.deleted',
  PLAYER_BANNED = 'player.banned',
  PLAYER_UNBANNED = 'player.unbanned',
  PLAYER_RESTRICTED = 'player.restricted',
  PLAYER_UNRESTRICTED = 'player.unrestricted',

  // Currency actions
  CURRENCY_GRANTED = 'currency.granted',
  CURRENCY_SPENT = 'currency.spent',
  CURRENCY_ADJUSTED = 'currency.adjusted',
  CURRENCY_TRANSFERRED = 'currency.transferred',

  // Inventory actions
  INVENTORY_ITEM_ADDED = 'inventory.item_added',
  INVENTORY_ITEM_REMOVED = 'inventory.item_removed',
  INVENTORY_ITEM_USED = 'inventory.item_used',
  INVENTORY_ITEM_TRADED = 'inventory.item_traded',

  // Artifact actions
  ARTIFACT_ACQUIRED = 'artifact.acquired',
  ARTIFACT_EVOLVED = 'artifact.evolved',
  ARTIFACT_DISMANTLED = 'artifact.dismantled',

  // Museum actions
  MUSEUM_EXHIBIT_ADDED = 'museum.exhibit_added',
  MUSEUM_EXHIBIT_REMOVED = 'museum.exhibit_removed',
  MUSEUM_HALL_UNLOCKED = 'museum.hall_unlocked',

  // Quest actions
  QUEST_STARTED = 'quest.started',
  QUEST_COMPLETED = 'quest.completed',
  QUEST_ABANDONED = 'quest.abandoned',
  QUEST_REWARD_CLAIMED = 'quest.reward_claimed',

  // Achievement actions
  ACHIEVEMENT_UNLOCKED = 'achievement.unlocked',
  ACHIEVEMENT_PROGRESS_UPDATED = 'achievement.progress_updated',

  // Guild actions
  GUILD_CREATED = 'guild.created',
  GUILD_JOINED = 'guild.joined',
  GUILD_LEFT = 'guild.left',
  GUILD_DISBANDED = 'guild.disbanded',
  GUILD_ROLE_CHANGED = 'guild.role_changed',

  // Admin actions
  ADMIN_ROLE_ASSIGNED = 'admin.role_assigned',
  ADMIN_PERMISSION_GRANTED = 'admin.permission_granted',
  ADMIN_CONFIG_CHANGED = 'admin.config_changed',

  // System actions
  SYSTEM_INITIALIZED = 'system.initialized',
  SYSTEM_SHUTDOWN = 'system.shutdown',
  SYSTEM_CONFIG_UPDATED = 'system.config_updated',

  // Reward actions
  REWARD_DISTRIBUTED = 'reward.distributed',
  REWARD_CLAIMED = 'reward.claimed',

  // Event actions
  EVENT_STARTED = 'event.started',
  EVENT_ENDED = 'event.ended',
  EVENT_PARTICIPATED = 'event.participated',

  // Generic CRUD actions
  ENTITY_CREATED = 'entity.created',
  ENTITY_UPDATED = 'entity.updated',
  ENTITY_DELETED = 'entity.deleted',
}

/**
 * Constraints for audit action types.
 */
export const AUDIT_ACTION_CONSTRAINTS = {
  MAX_TARGET_TYPE_LENGTH: 64,
  MAX_TARGET_ID_LENGTH: 128,
} as const;
