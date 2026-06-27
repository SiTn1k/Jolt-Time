/**
 * Museum DTOs
 *
 * Exports all DTOs for the Museum domain.
 */

export type { CreateMuseumDto } from './CreateMuseum.dto';
export { CREATE_MUSEUM_VALIDATION } from './CreateMuseum.dto';
export type { CreateHallDto } from './CreateHall.dto';
export { CREATE_HALL_VALIDATION } from './CreateHall.dto';
export type { CreateExhibitDto } from './CreateExhibit.dto';
export { CREATE_EXHIBIT_VALIDATION } from './CreateExhibit.dto';
export type {
  MuseumResponseDto,
  MuseumSummaryDto,
  MuseumHallResponseDto,
  MuseumHallSummaryDto,
  MuseumExhibitResponseDto,
  MuseumExhibitSummaryDto,
  MuseumWithHallsDto,
  HallWithExhibitsDto,
  MuseumStatisticsSummaryDto,
} from './MuseumResponse.dto';
