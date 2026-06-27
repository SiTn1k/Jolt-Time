/**
 * Museum Response DTOs
 *
 * Data transfer objects for museum API responses.
 */

import type { MuseumType } from '../types/MuseumType';
import type { HallType } from '../types/HallType';
import type { ExhibitCondition } from '../types/ExhibitCondition';
import type { MuseumStatistics, HallStatistics } from '../types/MuseumStatistics';
import type { MuseumMetadata, HallMetadata } from '../types/MuseumMetadata';

/**
 * Full museum response DTO.
 */
export interface MuseumResponseDto {
  /** Unique museum identifier */
  museumId: string;

  /** Associated player profile ID */
  playerProfileId: string;

  /** Museum display name */
  museumName: string;

  /** Museum type */
  museumType: MuseumType;

  /** Museum level */
  level: number;

  /** Museum rating */
  rating: number;

  /** Museum statistics */
  statistics: MuseumStatistics;

  /** Museum metadata */
  metadata: MuseumMetadata;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Museum summary DTO for list views.
 */
export interface MuseumSummaryDto {
  /** Unique museum identifier */
  museumId: string;

  /** Museum display name */
  museumName: string;

  /** Museum level */
  level: number;

  /** Museum rating */
  rating: number;

  /** Total exhibits */
  totalExhibits: number;

  /** Total halls */
  hallCount: number;

  /** Completion percentage */
  completionPercentage: number;
}

/**
 * Full museum hall response DTO.
 */
export interface MuseumHallResponseDto {
  /** Unique hall identifier */
  hallId: string;

  /** Associated museum ID */
  museumId: string;

  /** Hall type */
  hallType: HallType;

  /** Hall display name */
  hallName: string;

  /** Hall capacity */
  capacity: number;

  /** Hall position */
  position: number;

  /** Hall metadata */
  metadata: HallMetadata;

  /** Hall statistics */
  statistics: HallStatistics;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Museum hall summary DTO for list views.
 */
export interface MuseumHallSummaryDto {
  /** Unique hall identifier */
  hallId: string;

  /** Hall type */
  hallType: HallType;

  /** Hall display name */
  hallName: string;

  /** Hall capacity */
  capacity: number;

  /** Current exhibit count */
  exhibitCount: number;

  /** Utilization percentage */
  utilizationPercentage: number;
}

/**
 * Full museum exhibit response DTO.
 */
export interface MuseumExhibitResponseDto {
  /** Unique exhibit identifier */
  exhibitId: string;

  /** Associated hall ID */
  hallId: string;

  /** Associated inventory item ID */
  inventoryItemId: string;

  /** Associated artifact ID */
  artifactId: string;

  /** Display order */
  displayOrder: number;

  /** Exhibit condition */
  condition: ExhibitCondition;

  /** Popularity score */
  popularity: number;

  /** When exhibit was placed */
  placedAt: string;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Museum exhibit summary DTO for list views.
 */
export interface MuseumExhibitSummaryDto {
  /** Unique exhibit identifier */
  exhibitId: string;

  /** Associated artifact ID */
  artifactId: string;

  /** Display order */
  displayOrder: number;

  /** Condition */
  condition: ExhibitCondition;

  /** Popularity score */
  popularity: number;
}

/**
 * Museum with halls DTO.
 */
export interface MuseumWithHallsDto extends MuseumResponseDto {
  /** Halls in the museum */
  halls: MuseumHallSummaryDto[];
}

/**
 * Hall with exhibits DTO.
 */
export interface HallWithExhibitsDto extends MuseumHallResponseDto {
  /** Exhibits in the hall */
  exhibits: MuseumExhibitSummaryDto[];
}

/**
 * Museum statistics summary DTO.
 */
export interface MuseumStatisticsSummaryDto {
  /** Total exhibits across all halls */
  totalExhibits: number;

  /** Total halls */
  totalHalls: number;

  /** Average utilization */
  averageUtilization: number;

  /** Average popularity */
  averagePopularity: number;

  /** Completion percentage */
  completionPercentage: number;
}
