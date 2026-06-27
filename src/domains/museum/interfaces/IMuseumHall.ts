/**
 * Museum Hall Interface
 *
 * Interface defining the contract for MuseumHall entity.
 * All MuseumHall implementations must adhere to this interface.
 */

import type { HallId } from '../value-objects/HallId';
import type { MuseumId } from '../value-objects/MuseumId';
import type { HallCapacity } from '../value-objects/HallCapacity';
import type { HallType } from '../types/HallType';
import type { HallMetadata } from '../types/MuseumMetadata';

/**
 * MuseumHall entity interface.
 * Represents a hall within a museum.
 */
export interface IMuseumHall {
  /** Unique internal hall identifier */
  readonly hallId: HallId;

  /** Associated museum ID */
  readonly museumId: MuseumId;

  /** Hall type (era/category classification) */
  readonly hallType: HallType;

  /** Hall display name */
  readonly hallName: string;

  /** Hall capacity */
  readonly capacity: HallCapacity;

  /** Hall position/order in museum */
  readonly position: number;

  /** Hall metadata */
  readonly metadata: HallMetadata;

  /** Timestamp when hall was created */
  readonly createdAt: Date;

  /** Timestamp when hall was last updated */
  readonly updatedAt: Date;

  /**
   * Checks if the hall has room for more exhibits.
   * @param currentExhibitCount Current number of exhibits
   */
  hasRoom(currentExhibitCount: number): boolean;

  /**
   * Gets the remaining capacity.
   * @param currentExhibitCount Current number of exhibits
   */
  getRemainingCapacity(currentExhibitCount: number): number;

  /**
   * Serializes the MuseumHall to a plain object.
   */
  toJSON(): MuseumHallJSON;
}

/**
 * JSON serialization representation.
 */
export interface MuseumHallJSON {
  hallId: string;
  museumId: string;
  hallType: HallType;
  hallName: string;
  capacity: number;
  position: number;
  metadata: HallMetadata;
  createdAt: string;
  updatedAt: string;
}
