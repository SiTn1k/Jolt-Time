/**
 * Artifact Interface
 *
 * Interface defining the contract for Artifact entity.
 * All Artifact implementations must adhere to this interface.
 */

import type { ArtifactId } from '../value-objects/ArtifactId';
import type { ArtifactSlug } from '../value-objects/ArtifactSlug';
import type { ArtifactTitle } from '../value-objects/ArtifactTitle';
import type { ArtifactDescription } from '../value-objects/ArtifactDescription';
import type {
  ArtifactCategory,
  ArtifactRarity,
  ArtifactEra,
  ArtifactRegion,
  ArtifactMetadata,
} from '../types';

/**
 * Artifact entity interface.
 * Represents an artifact definition in the Jolt Time system.
 */
export interface IArtifact {
  /** Unique internal artifact identifier */
  readonly artifactId: ArtifactId;

  /** URL-friendly identifier */
  readonly slug: ArtifactSlug;

  /** Display title */
  readonly title: ArtifactTitle;

  /** Historical description */
  readonly description: ArtifactDescription;

  /** Functional category */
  readonly category: ArtifactCategory;

  /** Rarity tier */
  readonly rarity: ArtifactRarity;

  /** Historical era */
  readonly era: ArtifactEra;

  /** Geographic region of origin */
  readonly region: ArtifactRegion;

  /** Cultural/historical origin */
  readonly culture: string;

  /** Primary material composition */
  readonly material: string;

  /** Physical condition */
  readonly condition: string;

  /** Image asset path or URL */
  readonly image: string;

  /** Thumbnail image asset path or URL */
  readonly thumbnail: string;

  /** Animation asset path or URL */
  readonly animation?: string;

  /** Whether artifact is a collectible */
  readonly isCollectible: boolean;

  /** Whether artifact can be displayed in museum */
  readonly isMuseumAllowed: boolean;

  /** Extended metadata */
  readonly metadata: ArtifactMetadata;

  /** Timestamp when artifact was created */
  readonly createdAt: Date;

  /** Timestamp when artifact was last updated */
  readonly updatedAt: Date;
}