/**
 * Event Status Types
 *
 * Defines the possible states of an event envelope.
 */

/**
 * Event envelope status enumeration.
 */
export enum EventStatus {
  /** Event is pending publication */
  PENDING = 'PENDING',

  /** Event has been published */
  PUBLISHED = 'PUBLISHED',

  /** Event is being processed */
  PROCESSING = 'PROCESSING',

  /** Event has been successfully processed */
  PROCESSED = 'PROCESSED',

  /** Event processing failed */
  FAILED = 'FAILED',

  /** Event is scheduled for retry */
  RETRYING = 'RETRYING',

  /** Event has been dead-lettered (max retries exceeded) */
  DEAD_LETTERED = 'DEAD_LETTERED',
}