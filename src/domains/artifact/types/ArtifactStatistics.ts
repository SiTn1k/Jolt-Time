/**
 * Artifact Statistics Type
 *
 * Aggregated statistics for artifacts in the collection.
 */

/**
 * Statistics tracking for artifact collection.
 */
export interface ArtifactStatistics {
  /** Total number of artifacts defined */
  totalArtifacts: number;

  /** Count by rarity tier */
  byRarity: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
    mythic: number;
  };

  /** Count by category */
  byCategory: Record<string, number>;

  /** Count by era */
  byEra: Record<string, number>;

  /** Count by region */
  byRegion: Record<string, number>;

  /** Average power across all artifacts */
  averagePower: number;

  /** Highest rarity artifact count */
  mythicCount: number;
  legendaryCount: number;
}

/**
 * Initial artifact statistics.
 */
export const INITIAL_ARTIFACT_STATISTICS: ArtifactStatistics = {
  totalArtifacts: 0,
  byRarity: {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    mythic: 0,
  },
  byCategory: {},
  byEra: {},
  byRegion: {},
  averagePower: 0,
  mythicCount: 0,
  legendaryCount: 0,
};