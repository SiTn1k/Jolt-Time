/**
 * Museum Metadata
 *
 * Extended metadata for museum entities.
 */

/**
 * Museum configuration and settings.
 */
export interface MuseumMetadata {
  /** Museum description */
  description?: string;

  /** Museum theme/style */
  theme?: string;

  /** Primary color hex code */
  primaryColor?: string;

  /** Background color hex code */
  backgroundColor?: string;

  /** Layout configuration */
  layout?: MuseumLayout;

  /** Display preferences */
  displayPreferences?: DisplayPreferences;

  /** Custom metadata fields */
  customFields?: Record<string, unknown>;

  /** Schema version for migrations */
  version: number;
}

/**
 * Museum layout configuration.
 */
export interface MuseumLayout {
  /** Layout type */
  type: 'grid' | 'list' | 'showcase';

  /** Number of columns in grid layout */
  columns?: number;

  /** Spacing between exhibits */
  spacing?: number;

  /** Show labels */
  showLabels?: boolean;

  /** Show descriptions */
  showDescriptions?: boolean;
}

/**
 * Display preferences for museum.
 */
export interface DisplayPreferences {
  /** Show visitor count */
  showVisitorCount?: boolean;

  /** Show popularity scores */
  showPopularityScores?: boolean;

  /** Sort order default */
  defaultSortOrder?: 'position' | 'popularity' | 'recent' | 'alphabetical';

  /** Filter by condition */
  filterByCondition?: boolean;

  /** Auto-arrange exhibits */
  autoArrange?: boolean;
}

/**
 * Initial museum metadata.
 */
export const INITIAL_MUSEUM_METADATA: MuseumMetadata = {
  layout: {
    type: 'grid',
    columns: 3,
    spacing: 16,
    showLabels: true,
    showDescriptions: false,
  },
  displayPreferences: {
    showVisitorCount: false,
    showPopularityScores: true,
    defaultSortOrder: 'position',
    filterByCondition: false,
    autoArrange: true,
  },
  version: 1,
};

/**
 * Hall metadata for extended information.
 */
export interface HallMetadata {
  /** Hall description */
  description?: string;

  /** Hall image/cover */
  image?: string;

  /** Era/civilization theme */
  theme?: string;

  /** Special requirements for viewing */
  requirements?: string[];

  /** Custom metadata fields */
  customFields?: Record<string, unknown>;

  /** Schema version for migrations */
  version: number;
}

/**
 * Initial hall metadata.
 */
export const INITIAL_HALL_METADATA: HallMetadata = {
  version: 1,
};
