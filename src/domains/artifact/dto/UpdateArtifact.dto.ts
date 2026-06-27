/**
 * Update Artifact DTO
 *
 * Data Transfer Object for updating an existing artifact.
 */

import type {
  ArtifactCategory,
  ArtifactRarity,
  ArtifactEra,
  ArtifactRegion,
  ArtifactMetadata,
} from '../types';

/**
 * DTO for updating an existing artifact.
 * All fields are optional - only provided fields will be updated.
 */
export interface UpdateArtifactDto {
  /** URL-friendly identifier */
  slug?: string;

  /** Display title */
  title?: string;

  /** Historical description */
  description?: string;

  /** Functional category */
  category?: ArtifactCategory;

  /** Rarity tier */
  rarity?: ArtifactRarity;

  /** Historical era */
  era?: ArtifactEra;

  /** Geographic region of origin */
  region?: ArtifactRegion;

  /** Cultural/historical origin */
  culture?: string;

  /** Primary material composition */
  material?: string;

  /** Physical condition */
  condition?: string;

  /** Image asset path or URL */
  image?: string;

  /** Thumbnail image asset path or URL */
  thumbnail?: string;

  /** Animation asset path or URL */
  animation?: string;

  /** Whether artifact is a collectible */
  isCollectible?: boolean;

  /** Whether artifact can be displayed in museum */
  isMuseumAllowed?: boolean;

  /** Extended metadata */
  metadata?: ArtifactMetadata;
}