/**
 * Museum Types
 *
 * Exports all type definitions for the Museum domain.
 */

export { MuseumType, VALID_MUSEUM_TYPES, isValidMuseumType } from './MuseumType';
export { HallType, VALID_HALL_TYPES, HALL_TYPE_METADATA, isValidHallType } from './HallType';
export type { MuseumStatistics, HallStatistics } from './MuseumStatistics';
export {
  INITIAL_MUSEUM_STATISTICS,
  INITIAL_HALL_STATISTICS,
} from './MuseumStatistics';
export type { MuseumMetadata, MuseumLayout, DisplayPreferences, HallMetadata } from './MuseumMetadata';
export {
  INITIAL_MUSEUM_METADATA,
  INITIAL_HALL_METADATA,
} from './MuseumMetadata';
export {
  ExhibitCondition,
  VALID_EXHIBIT_CONDITIONS,
  EXHIBIT_CONDITION_METADATA,
  isValidExhibitCondition,
  conditionAffectsPopularity,
} from './ExhibitCondition';
