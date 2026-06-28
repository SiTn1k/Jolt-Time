/**
 * Guild Created Event
 *
 * Domain event emitted when a new guild is created.
 */

import type { GuildPrivacy } from '../types/GuildStatus';

/**
 * Event data for guild creation.
 */
export interface GuildCreatedEventData {
  /** Guild ID */
  guildId: string;
  /** Guild slug */
  slug: string;
  /** Guild name */
  name: string;
  /** Owner player profile ID */
  ownerPlayerId: string;
  /** Privacy setting */
  privacy: GuildPrivacy;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for guild creation.
 */
export interface GuildCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'GuildCreated';
  /** Event data */
  readonly data: GuildCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a GuildCreatedEvent.
 */
export function createGuildCreatedEvent(params: {
  guildId: string;
  slug: string;
  name: string;
  ownerPlayerId: string;
  privacy: GuildPrivacy;
}): GuildCreatedEvent {
  return {
    eventType: 'GuildCreated',
    version: 1,
    data: {
      guildId: params.guildId,
      slug: params.slug,
      name: params.name,
      ownerPlayerId: params.ownerPlayerId,
      privacy: params.privacy,
      occurredAt: new Date(),
    },
  };
}
