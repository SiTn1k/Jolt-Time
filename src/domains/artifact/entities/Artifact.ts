/**
 * Artifact Entity
 *
 * Domain entity representing an artifact definition.
 * The artifact is IMMUTABLE game content - it does NOT represent ownership.
 *
 * Artifact Entity Responsibilities:
 * - Define artifact properties (name, description, rarity, era, etc.)
 * - Provide static game content metadata
 * - Support cataloging and display
 *
 * Artifact Entity is NOT:
 * - Inventory (ownership storage)
 * - Museum placement (exhibition state)
 * - Wallet (currency storage)
 * - Any gameplay state or player association
 */

import type { IArtifact } from '../interfaces/IArtifact';
import { ArtifactId } from '../value-objects/ArtifactId';
import { ArtifactSlug } from '../value-objects/ArtifactSlug';
import { ArtifactTitle } from '../value-objects/ArtifactTitle';
import { ArtifactDescription } from '../value-objects/ArtifactDescription';
import type {
  ArtifactCategory,
  ArtifactRarity,
  ArtifactEra,
  ArtifactRegion,
  ArtifactMetadata,
} from '../types';

/**
 * Artifact entity class.
 * Immutable domain entity representing an artifact definition.
 */
export class Artifact implements IArtifact {
  /** Unique internal artifact identifier */
  public readonly artifactId: ArtifactId;

  /** URL-friendly identifier */
  public readonly slug: ArtifactSlug;

  /** Display title */
  public readonly title: ArtifactTitle;

  /** Historical description */
  public readonly description: ArtifactDescription;

  /** Functional category */
  public readonly category: ArtifactCategory;

  /** Rarity tier */
  public readonly rarity: ArtifactRarity;

  /** Historical era */
  public readonly era: ArtifactEra;

  /** Geographic region of origin */
  public readonly region: ArtifactRegion;

  /** Cultural/historical origin */
  public readonly culture: string;

  /** Primary material composition */
  public readonly material: string;

  /** Physical condition */
  public readonly condition: string;

  /** Image asset path or URL */
  public readonly image: string;

  /** Thumbnail image asset path or URL */
  public readonly thumbnail: string;

  /** Animation asset path or URL */
  public readonly animation?: string;

  /** Whether artifact is a collectible */
  public readonly isCollectible: boolean;

  /** Whether artifact can be displayed in museum */
  public readonly isMuseumAllowed: boolean;

  /** Extended metadata */
  public readonly metadata: ArtifactMetadata;

  /** Timestamp when artifact was created */
  public readonly createdAt: Date;

  /** Timestamp when artifact was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new Artifact instance.
   * @param props Artifact properties
   */
  constructor(props: ArtifactProps) {
    this.artifactId = props.artifactId;
    this.slug = props.slug;
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.rarity = props.rarity;
    this.era = props.era;
    this.region = props.region;
    this.culture = props.culture;
    this.material = props.material;
    this.condition = props.condition;
    this.image = props.image;
    this.thumbnail = props.thumbnail;
    this.animation = props.animation;
    this.isCollectible = props.isCollectible;
    this.isMuseumAllowed = props.isMuseumAllowed;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Artifact.
   * Factory method for new artifact creation.
   */
  public static create(params: {
    artifactId: ArtifactId;
    slug: ArtifactSlug;
    title: ArtifactTitle;
    description: ArtifactDescription;
    category: ArtifactCategory;
    rarity: ArtifactRarity;
    era: ArtifactEra;
    region: ArtifactRegion;
    culture: string;
    material: string;
    condition: string;
    image: string;
    thumbnail: string;
    animation?: string;
    isCollectible?: boolean;
    isMuseumAllowed?: boolean;
    metadata?: ArtifactMetadata;
  }): Artifact {
    const now = new Date();

    return new Artifact({
      artifactId: params.artifactId,
      slug: params.slug,
      title: params.title,
      description: params.description,
      category: params.category,
      rarity: params.rarity,
      era: params.era,
      region: params.region,
      culture: params.culture,
      material: params.material,
      condition: params.condition,
      image: params.image,
      thumbnail: params.thumbnail,
      animation: params.animation,
      isCollectible: params.isCollectible ?? true,
      isMuseumAllowed: params.isMuseumAllowed ?? true,
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an Artifact from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ArtifactRecord): Artifact {
    return new Artifact({
      artifactId: ArtifactId.reconstruct(record.artifact_id),
      slug: ArtifactSlug.reconstruct(record.slug),
      title: ArtifactTitle.reconstruct(record.title),
      description: ArtifactDescription.reconstruct(record.description),
      category: record.category as ArtifactCategory,
      rarity: record.rarity as ArtifactRarity,
      era: record.era as ArtifactEra,
      region: record.region as ArtifactRegion,
      culture: record.culture,
      material: record.material,
      condition: record.condition,
      image: record.image,
      thumbnail: record.thumbnail,
      animation: record.animation,
      isCollectible: record.is_collectible,
      isMuseumAllowed: record.is_museum_allowed,
      metadata: record.metadata ?? {},
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Serializes the Artifact to a plain object.
   */
  public toJSON(): ArtifactJSON {
    return {
      artifactId: this.artifactId.value,
      slug: this.slug.value,
      title: this.title.value,
      description: this.description.value,
      category: this.category,
      rarity: this.rarity,
      era: this.era,
      region: this.region,
      culture: this.culture,
      material: this.material,
      condition: this.condition,
      image: this.image,
      thumbnail: this.thumbnail,
      animation: this.animation,
      isCollectible: this.isCollectible,
      isMuseumAllowed: this.isMuseumAllowed,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new Artifact instance.
   */
  public copyWith(params: Partial<ArtifactProps>): Artifact {
    return new Artifact({
      artifactId: params.artifactId ?? this.artifactId,
      slug: params.slug ?? this.slug,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      category: params.category ?? this.category,
      rarity: params.rarity ?? this.rarity,
      era: params.era ?? this.era,
      region: params.region ?? this.region,
      culture: params.culture ?? this.culture,
      material: params.material ?? this.material,
      condition: params.condition ?? this.condition,
      image: params.image ?? this.image,
      thumbnail: params.thumbnail ?? this.thumbnail,
      animation: params.animation ?? this.animation,
      isCollectible: params.isCollectible ?? this.isCollectible,
      isMuseumAllowed: params.isMuseumAllowed ?? this.isMuseumAllowed,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}

/**
 * Artifact properties interface for constructor.
 */
export interface ArtifactProps {
  artifactId: ArtifactId;
  slug: ArtifactSlug;
  title: ArtifactTitle;
  description: ArtifactDescription;
  category: ArtifactCategory;
  rarity: ArtifactRarity;
  era: ArtifactEra;
  region: ArtifactRegion;
  culture: string;
  material: string;
  condition: string;
  image: string;
  thumbnail: string;
  animation?: string;
  isCollectible: boolean;
  isMuseumAllowed: boolean;
  metadata: ArtifactMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Artifact.
 */
export interface ArtifactRecord {
  artifact_id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  rarity: string;
  era: string;
  region: string;
  culture: string;
  material: string;
  condition: string;
  image: string;
  thumbnail: string;
  animation?: string;
  is_collectible: boolean;
  is_museum_allowed: boolean;
  metadata: ArtifactMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of Artifact.
 */
export interface ArtifactJSON {
  artifactId: string;
  slug: string;
  title: string;
  description: string;
  category: ArtifactCategory;
  rarity: ArtifactRarity;
  era: ArtifactEra;
  region: ArtifactRegion;
  culture: string;
  material: string;
  condition: string;
  image: string;
  thumbnail: string;
  animation?: string;
  isCollectible: boolean;
  isMuseumAllowed: boolean;
  metadata: ArtifactMetadata;
  createdAt: string;
  updatedAt: string;
}