/**
 * Guild Deleted Event
 *
 * Domain event emitted when a guild is deleted.
 */

/**
 * Reason for guild deletion.
 */
export type DeleteReason = 'voluntary' | 'banned' | 'abandoned';

/**
 * Event data for guild deleted.
 */
export interface GuildDeletedEventData {
  /** Guild ID */
  guildId: string;
  /** Guild name */
  guildName: string;
  /** Owner player profile ID */
  ownerPlayerId: string;
  /** Deletion reason */
  reason: DeleteReason;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for guild deleted.
 */
export interface GuildDeletedEvent {
  /** Event type identifier */
  readonly eventType: 'GuildDeleted';
  /** Event data */
  readonly data: GuildDeletedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GuildDeletedEvent.
 */
export function createGuildDeletedEvent(params: {
  guildId: string;
  guildName: string;
  ownerPlayerId: string;
  reason: DeleteReason;
}): GuildDeletedEvent {
  return {
    eventType: 'GuildDeleted',
    version: 1,
    data: {
      guildId: params.guildId,
      guildName: params.guildName,
      ownerPlayerId: params.ownerPlayerId,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}
