/**
 * Artifact Metadata Type
 *
 * Extended metadata for artifacts including physical characteristics.
 */

/**
 * Physical conditions for artifacts.
 */
export enum ArtifactCondition {
  PRISTINE = 'pristine',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DAMAGED = 'damaged',
  FRAGMENTARY = 'fragmentary',
}

/**
 * Display labels for artifact conditions.
 */
export const ARTIFACT_CONDITION_LABELS: Record<ArtifactCondition, string> = {
  [ArtifactCondition.PRISTINE]: 'Pristine',
  [ArtifactCondition.EXCELLENT]: 'Excellent',
  [ArtifactCondition.GOOD]: 'Good',
  [ArtifactCondition.FAIR]: 'Fair',
  [ArtifactCondition.POOR]: 'Poor',
  [ArtifactCondition.DAMAGED]: 'Damaged',
  [ArtifactCondition.FRAGMENTARY]: 'Fragmentary',
} as const;

/**
 * Common materials for artifacts.
 */
export enum ArtifactMaterial {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  IRON = 'iron',
  STONE = 'stone',
  CLAY = 'clay',
  BONE = 'bone',
  IVORY = 'ivory',
  WOOD = 'wood',
  TEXTILE = 'textile',
  PAPER = 'paper',
  GLASS = 'glass',
  CERAMIC = 'ceramic',
  MARBLE = 'marble',
  JADE = 'jade',
  PRECIOUS_GEMS = 'precious_gems',
  LEATHER = 'leather',
  MIXED = 'mixed',
  OTHER = 'other',
}

/**
 * Display labels for artifact materials.
 */
export const ARTIFACT_MATERIAL_LABELS: Record<ArtifactMaterial, string> = {
  [ArtifactMaterial.GOLD]: 'Gold',
  [ArtifactMaterial.SILVER]: 'Silver',
  [ArtifactMaterial.BRONZE]: 'Bronze',
  [ArtifactMaterial.IRON]: 'Iron',
  [ArtifactMaterial.STONE]: 'Stone',
  [ArtifactMaterial.CLAY]: 'Clay',
  [ArtifactMaterial.BONE]: 'Bone',
  [ArtifactMaterial.IVORY]: 'Ivory',
  [ArtifactMaterial.WOOD]: 'Wood',
  [ArtifactMaterial.TEXTILE]: 'Textile',
  [ArtifactMaterial.PAPER]: 'Paper',
  [ArtifactMaterial.GLASS]: 'Glass',
  [ArtifactMaterial.CERAMIC]: 'Ceramic',
  [ArtifactMaterial.MARBLE]: 'Marble',
  [ArtifactMaterial.JADE]: 'Jade',
  [ArtifactMaterial.PRECIOUS_GEMS]: 'Precious Gems',
  [ArtifactMaterial.LEATHER]: 'Leather',
  [ArtifactMaterial.MIXED]: 'Mixed Materials',
  [ArtifactMaterial.OTHER]: 'Other',
} as const;

/**
 * Common cultures/civilizations for artifacts.
 */
export type ArtifactCulture =
  | 'egyptian'
  | 'greek'
  | 'roman'
  | 'mesopotamian'
  | 'persian'
  | 'chinese'
  | 'japanese'
  | 'indian'
  | 'byzantine'
  | 'islamic'
  | 'celtic'
  | 'norse'
  | 'medieval_european'
  | 'renaissance_italian'
  | 'ottoman'
  | 'mughal'
  | 'colonial_american'
  | 'industrial_european'
  | 'modern'
  | string;

/**
 * Artifact metadata structure.
 */
export interface ArtifactMetadata {
  /** Physical condition of the artifact */
  condition?: ArtifactCondition;

  /** Primary material composition */
  material?: ArtifactMaterial;

  /** Cultural/historical origin */
  culture?: ArtifactCulture;

  /** Physical dimensions (optional) */
  dimensions?: {
    height?: number;
    width?: number;
    depth?: number;
    weight?: number;
    unit?: string;
  };

  /** Dating information */
  dating?: {
    year?: number;
    yearEnd?: number;
    century?: string;
    circa?: boolean;
  };

  /** Discovery information */
  discovery?: {
    location?: string;
    year?: number;
    archaeologist?: string;
  };

  /** Museum/institution where artifact is housed */
  currentLocation?: string;

  /** Historical significance rating (1-5) */
  significance?: number;

  /** Tags for filtering and search */
  tags?: string[];

  /** Custom metadata extension */
  customFields?: Record<string, unknown>;
}

/**
 * Initial/default artifact metadata.
 */
export const INITIAL_ARTIFACT_METADATA: ArtifactMetadata = {};