/**
 * Analytics Event Type
 *
 * Defines all supported analytics event types in the system.
 * Analytics ONLY records events - it never modifies gameplay.
 */

/**
 * Supported analytics event types.
 * Each type represents a category of telemetry events.
 */
export enum AnalyticsEventType {
  // Gameplay events
  GAMEPLAY = 'gameplay',

  // Economy events
  ECONOMY = 'economy',

  // Museum events
  MUSEUM = 'museum',

  // Academy events
  ACADEMY = 'academy',

  // Quest events
  QUEST = 'quest',

  // Achievement events
  ACHIEVEMENT = 'achievement',

  // Guild events
  GUILD = 'guild',

  // Reward events
  REWARD = 'reward',

  // Notification events
  NOTIFICATION = 'notification',

  // System events
  SYSTEM = 'system',
}

/**
 * Constraints for analytics event types.
 */
export const ANALYTICS_EVENT_TYPE_CONSTRAINTS = {
  MAX_SOURCE_MODULE_LENGTH: 64,
  MAX_PAYLOAD_SIZE: 10240, // 10KB max payload size
} as const;
