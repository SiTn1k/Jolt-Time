/**
 * Museum Statistics
 *
 * Statistical data for museum entities.
 */

/**
 * Museum statistics tracking.
 */
export interface MuseumStatistics {
  /** Total exhibits currently displayed */
  totalExhibits: number;

  /** Total artifacts referenced by exhibits */
  totalArtifacts: number;

  /** Total visitors received (future feature) */
  totalVisitors: number;

  /** Total views across all exhibits (future feature) */
  totalViews: number;

  /** Average popularity score across exhibits */
  averagePopularity: number;

  /** Number of halls in the museum */
  hallCount: number;

  /** Completion percentage (exhibits / capacity) */
  completionPercentage: number;

  /** Schema version for migrations */
  version: number;
}

/**
 * Initial museum statistics.
 */
export const INITIAL_MUSEUM_STATISTICS: MuseumStatistics = {
  totalExhibits: 0,
  totalArtifacts: 0,
  totalVisitors: 0,
  totalViews: 0,
  averagePopularity: 0,
  hallCount: 0,
  completionPercentage: 0,
  version: 1,
};

/**
 * Hall statistics tracking.
 */
export interface HallStatistics {
  /** Current number of exhibits */
  exhibitCount: number;

  /** Capacity utilization percentage */
  utilizationPercentage: number;

  /** Average popularity of exhibits in hall */
  averagePopularity: number;

  /** Schema version for migrations */
  version: number;
}

/**
 * Initial hall statistics.
 */
export const INITIAL_HALL_STATISTICS: HallStatistics = {
  exhibitCount: 0,
  utilizationPercentage: 0,
  averagePopularity: 0,
  version: 1,
};
