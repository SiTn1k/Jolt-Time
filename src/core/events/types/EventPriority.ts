/**
 * Event Priority Types
 *
 * Defines the possible priority levels for event processing.
 */

/**
 * Event priority enumeration.
 * Higher priority events are processed first.
 */
export enum EventPriority {
  /** Lowest priority - processed when no other events are pending */
  LOW = 0,

  /** Normal priority - standard event processing */
  NORMAL = 1,

  /** High priority - processed before normal events */
  HIGH = 2,

  /** Critical priority - processed before all other events */
  CRITICAL = 3,
}

/**
 * Priority constraints for validation.
 */
export const EVENT_PRIORITY_CONSTRAINTS = {
  MIN_PRIORITY: EventPriority.LOW,
  MAX_PRIORITY: EventPriority.CRITICAL,
  DEFAULT_PRIORITY: EventPriority.NORMAL,
} as const;