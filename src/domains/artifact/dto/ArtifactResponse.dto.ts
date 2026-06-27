/**
 * Artifact Response DTO
 *
 * Data Transfer Object for artifact responses.
 */

import type {
  ArtifactCategory,
  ArtifactRarity,
  ArtifactEra,
  ArtifactRegion,
  ArtifactMetadata,
} from '../types';

/**
 * Full artifact response DTO.
 */
export interface ArtifactResponseDto {
  /** Unique internal artifact identifier */
  artifactId: string;

  /** URL-friendly identifier */
  slug: string;

  /** Display title */
  title: string;

  /** Historical description */
  description: string;

  /** Functional category */
  category: ArtifactCategory;

  /** Rarity tier */
  rarity: ArtifactRarity;

  /** Historical era */
  era: ArtifactEra;

  /** Geographic region of origin */
  region: ArtifactRegion;

  /** Cultural/historical origin */
  culture: string;

  /** Primary material composition */
  material: string;

  /** Physical condition */
  condition: string;

  /** Image asset path or URL */
  image: string;

  /** Thumbnail image asset path or URL */
  thumbnail: string;

  /** Animation asset path or URL */
  animation?: string;

  /** Whether artifact is a collectible */
  isCollectible: boolean;

  /** Whether artifact can be displayed in museum */
  isMuseumAllowed: boolean;

  /** Extended metadata */
  metadata: ArtifactMetadata;

  /** Timestamp when artifact was created */
  createdAt: string;

  /** Timestamp when artifact was last updated */
  updatedAt: string;
}

/**
 * Summary artifact response DTO for list views.
 */
export interface ArtifactSummaryDto {
  /** Unique internal artifact identifier */
  artifactId: string;

  /** URL-friendly identifier */
  slug: string;

  /** Display title */
  title: string;

  /** Functional category */
  category: ArtifactCategory;

  /** Rarity tier */
  rarity: ArtifactRarity;

  /** Historical era */
  era: ArtifactEra;

  /** Thumbnail image asset path or URL */
  thumbnail: string;

  /** Whether artifact is a collectible */
  isCollectible: boolean;
}