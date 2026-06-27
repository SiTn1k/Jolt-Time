/**
 * Artifact Mapper
 *
 * Maps between Artifact entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { Artifact } from '../entities/Artifact';
import type { ArtifactRecord } from '../entities/Artifact';
import type { CreateArtifactDto } from '../dto/CreateArtifact.dto';
import type { UpdateArtifactDto } from '../dto/UpdateArtifact.dto';
import type { ArtifactResponseDto, ArtifactSummaryDto } from '../dto/ArtifactResponse.dto';

/**
 * Mapper for converting between Artifact entity and DTOs.
 */
export class ArtifactMapper {
  /**
   * Converts an Artifact entity to ArtifactResponseDto.
   */
  public static toResponse(artifact: Artifact): ArtifactResponseDto {
    return {
      artifactId: artifact.artifactId.value,
      slug: artifact.slug.value,
      title: artifact.title.value,
      description: artifact.description.value,
      category: artifact.category,
      rarity: artifact.rarity,
      era: artifact.era,
      region: artifact.region,
      culture: artifact.culture,
      material: artifact.material,
      condition: artifact.condition,
      image: artifact.image,
      thumbnail: artifact.thumbnail,
      animation: artifact.animation,
      isCollectible: artifact.isCollectible,
      isMuseumAllowed: artifact.isMuseumAllowed,
      metadata: artifact.metadata,
      createdAt: artifact.createdAt.toISOString(),
      updatedAt: artifact.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Artifact entity to ArtifactSummaryDto.
   */
  public static toSummary(artifact: Artifact): ArtifactSummaryDto {
    return {
      artifactId: artifact.artifactId.value,
      slug: artifact.slug.value,
      title: artifact.title.value,
      category: artifact.category,
      rarity: artifact.rarity,
      era: artifact.era,
      thumbnail: artifact.thumbnail,
      isCollectible: artifact.isCollectible,
    };
  }

  /**
   * Converts an array of Artifact entities to ArtifactResponseDto array.
   */
  public static toResponseList(artifacts: Artifact[]): ArtifactResponseDto[] {
    return artifacts.map((artifact) => this.toResponse(artifact));
  }

  /**
   * Converts an array of Artifact entities to ArtifactSummaryDto array.
   */
  public static toSummaryList(artifacts: Artifact[]): ArtifactSummaryDto[] {
    return artifacts.map((artifact) => this.toSummary(artifact));
  }

  /**
   * Converts a CreateArtifactDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateArtifactDto): Omit<CreateArtifactDto, never> {
    return {
      slug: dto.slug,
      title: dto.title,
      description: dto.description,
      category: dto.category,
      rarity: dto.rarity,
      era: dto.era,
      region: dto.region,
      culture: dto.culture,
      material: dto.material,
      condition: dto.condition,
      image: dto.image,
      thumbnail: dto.thumbnail,
      animation: dto.animation,
      isCollectible: dto.isCollectible,
      isMuseumAllowed: dto.isMuseumAllowed,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateArtifactDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateArtifactDto): Partial<Artifact> {
    return {
      slug: dto.slug as unknown as Artifact['slug'],
      title: dto.title as unknown as Artifact['title'],
      description: dto.description as unknown as Artifact['description'],
      category: dto.category,
      rarity: dto.rarity,
      era: dto.era,
      region: dto.region,
      culture: dto.culture,
      material: dto.material,
      condition: dto.condition,
      image: dto.image,
      thumbnail: dto.thumbnail,
      animation: dto.animation,
      isCollectible: dto.isCollectible,
      isMuseumAllowed: dto.isMuseumAllowed,
      metadata: dto.metadata,
    } as Partial<Artifact>;
  }

  /**
   * Converts a database record to CreateArtifactDto format.
   */
  public static fromRecordToDto(record: ArtifactRecord): CreateArtifactDto {
    return {
      slug: record.slug,
      title: record.title,
      description: record.description,
      category: record.category as CreateArtifactDto['category'],
      rarity: record.rarity as CreateArtifactDto['rarity'],
      era: record.era as CreateArtifactDto['era'],
      region: record.region as CreateArtifactDto['region'],
      culture: record.culture,
      material: record.material,
      condition: record.condition,
      image: record.image,
      thumbnail: record.thumbnail,
      animation: record.animation,
      isCollectible: record.is_collectible,
      isMuseumAllowed: record.is_museum_allowed,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an Artifact entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(artifact: Artifact): Omit<ArtifactRecord, never> {
    return {
      artifact_id: artifact.artifactId.value,
      slug: artifact.slug.value,
      title: artifact.title.value,
      description: artifact.description.value,
      category: artifact.category,
      rarity: artifact.rarity,
      era: artifact.era,
      region: artifact.region,
      culture: artifact.culture,
      material: artifact.material,
      condition: artifact.condition,
      image: artifact.image,
      thumbnail: artifact.thumbnail,
      animation: artifact.animation,
      is_collectible: artifact.isCollectible,
      is_museum_allowed: artifact.isMuseumAllowed,
      metadata: artifact.metadata,
      created_at: artifact.createdAt.toISOString(),
      updated_at: artifact.updatedAt.toISOString(),
    };
  }
}