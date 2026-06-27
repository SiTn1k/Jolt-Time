/**
 * Museum Interfaces
 *
 * Exports all interfaces for the Museum domain.
 */

export type { IMuseum, MuseumJSON } from './IMuseum';
export type { IMuseumHall, MuseumHallJSON } from './IMuseumHall';
export type {
  IMuseumExhibit,
  MuseumExhibitJSON,
  ExhibitMetadataJSON,
} from './IMuseumExhibit';
export type {
  IMuseumRepository,
  MuseumFilterParams,
  HallFilterParams,
  ExhibitFilterParams,
  MuseumStatisticsResult,
  HallStatisticsResult,
} from './IMuseumRepository';
