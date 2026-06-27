/**
 * Museum Interface
 *
 * Interface defining the contract for Museum entity.
 * All Museum implementations must adhere to this interface.
 */

import type { MuseumId } from '../value-objects/MuseumId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { MuseumType } from '../types/MuseumType';
import type { MuseumStatistics } from '../types/MuseumStatistics';
import type { MuseumMetadata } from '../types/MuseumMetadata';

/**
 * Museum entity interface.
 * Represents a player's virtual museum.
 */
export interface IMuseum {
  /** Unique internal museum identifier */
  readonly museumId: MuseumId;

  /** Associated player profile ID (owner) */
  readonly playerProfileId: PlayerProfileId;

  /** Museum display name */
  readonly museumName: string;

  /** Museum type/classification */
  readonly museumType: MuseumType;

  /** Museum level */
  readonly level: number;

  /** Museum rating */
  readonly rating: number;

  /** Museum statistics */
  readonly statistics: MuseumStatistics;

  /** Museum metadata */
  readonly metadata: MuseumMetadata;

  /** Timestamp when museum was created */
  readonly createdAt: Date;

  /** Timestamp when museum was last updated */
  readonly updatedAt: Date;

  /**
   * Serializes the Museum to a plain object.
   */
  toJSON(): MuseumJSON;
}

/**
 * JSON serialization representation.
 */
export interface MuseumJSON {
  museumId: string;
  playerProfileId: string;
  museumName: string;
  museumType: MuseumType;
  level: number;
  rating: number;
  statistics: MuseumStatistics;
  metadata: MuseumMetadata;
  createdAt: string;
  updatedAt: string;
}
