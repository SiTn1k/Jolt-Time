/**
 * Guild Member Left Event
 *
 * Domain event emitted when a member leaves or is removed from a guild.
 */

/**
 * Reason for leaving the guild.
 */
export type LeaveReason = 'voluntary' | 'kicked' | 'promoted' | 'demoted';

/**
 * Event data for guild member left.
 */
export interface GuildMemberLeftEventData {
  /** Guild ID */
  guildId: string;
  /** Member ID */
  memberId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Previous role */
  previousRole: string;
  /** Reason for leaving */
  reason: LeaveReason;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for guild member left.
 */
export interface GuildMemberLeftEvent {
  /** Event type identifier */
  readonly eventType: 'GuildMemberLeft';
  /** Event data */
  readonly data: GuildMemberLeftEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GuildMemberLeftEvent.
 */
export function createGuildMemberLeftEvent(params: {
  guildId: string;
  memberId: string;
  playerProfileId: string;
  previousRole: string;
  reason: LeaveReason;
}): GuildMemberLeftEvent {
  return {
    eventType: 'GuildMemberLeft',
    version: 1,
    data: {
      guildId: params.guildId,
      memberId: params.memberId,
      playerProfileId: params.playerProfileId,
      previousRole: params.previousRole,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}
