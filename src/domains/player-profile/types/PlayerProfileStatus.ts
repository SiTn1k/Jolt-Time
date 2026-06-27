/**
 * Player Profile Status Enum
 *
 * Possible status values for a PlayerProfile entity.
 */

export enum PlayerProfileStatus {
  /** Active and playable profile */
  ACTIVE = 'active',

  /** Temporarily restricted */
  RESTRICTED = 'restricted',

  /** Permanently banned */
  BANNED = 'banned',

  /** Soft deleted profile */
  DELETED = 'deleted',
}