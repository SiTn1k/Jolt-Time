/**
 * Artifact Mapper Tests
 *
 * Unit tests for ArtifactMapper transformations.
 */

import { describe, it, expect } from 'vitest';
import { ArtifactMapper } from '../mappers/ArtifactMapper';
import { Artifact } from '../entities/Artifact';
import { ArtifactId } from '../value-objects/ArtifactId';
import { ArtifactSlug } from '../value-objects/ArtifactSlug';
import { ArtifactTitle } from '../value-objects/ArtifactTitle';
import { ArtifactDescription } from '../value-objects/ArtifactDescription';
import { ArtifactCategory, ArtifactRarity, ArtifactEra, ArtifactRegion } from '../types';
import type { CreateArtifactDto } from '../dto/CreateArtifact.dto';
import type { ArtifactRecord } from '../entities/Artifact';

// Create a test artifact
const createTestArtifact = (): Artifact => {
  return Artifact.create({
    artifactId: ArtifactId.generate(),
    slug: ArtifactSlug.reconstruct('cuneiform-tablet'),
    title: ArtifactTitle.reconstruct('Cuneiform Tablet'),
    description: ArtifactDescription.reconstruct('An ancient Mesopotamian clay tablet with cuneiform script'),
    category: ArtifactCategory.DOCUMENT,
    rarity: ArtifactRarity.RARE,
    era: ArtifactEra.ANCIENT_WORLD,
    region: ArtifactRegion.MESOPOTAMIA,
    culture: 'Sumerian',
    material: 'Clay',
    condition: 'Good',
    image: '/images/cuneiform.png',
    thumbnail: '/images/cuneiform-thumb.png',
    animation: '/animations/cuneiform.json',
    isCollectible: true,
    isMuseumAllowed: true,
    metadata: {
      dimensions: { height: 30, width: 20, depth: 5, unit: 'cm' },
      significance: 4,
    },
  });
};

// Create a test record
const createTestRecord = (): ArtifactRecord => ({
  artifact_id: '123e4567-e89b-12d3-a456-426614174000',
  slug: 'cuneiform-tablet',
  title: 'Cuneiform Tablet',
  description: 'An ancient Mesopotamian clay tablet with cuneiform script',
  category: 'document',
  rarity: 'rare',
  era: 'ancient_world',
  region: 'mesopotamia',
  culture: 'Sumerian',
  material: 'Clay',
  condition: 'Good',
  image: '/images/cuneiform.png',
  thumbnail: '/images/cuneiform-thumb.png',
  animation: '/animations/cuneiform.json',
  is_collectible: true,
  is_museum_allowed: true,
  metadata: { dimensions: { height: 30, width: 20, depth: 5, unit: 'cm' } },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
});

// Valid create DTO
const validCreateDto: CreateArtifactDto = {
  slug: 'cuneiform-tablet',
  title: 'Cuneiform Tablet',
  description: 'An ancient Mesopotamian clay tablet with cuneiform script',
  category: ArtifactCategory.DOCUMENT,
  rarity: ArtifactRarity.RARE,
  era: ArtifactEra.ANCIENT_WORLD,
  region: ArtifactRegion.MESOPOTAMIA,
  culture: 'Sumerian',
  material: 'Clay',
  condition: 'Good',
  image: '/images/cuneiform.png',
  thumbnail: '/images/cuneiform-thumb.png',
};

describe('ArtifactMapper', () => {
  describe('toResponse', () => {
    it('should convert artifact entity to response DTO', () => {
      const artifact = createTestArtifact();

      const dto = ArtifactMapper.toResponse(artifact);

      expect(dto.artifactId).toBe(artifact.artifactId.value);
      expect(dto.slug).toBe(artifact.slug.value);
      expect(dto.title).toBe(artifact.title.value);
      expect(dto.description).toBe(artifact.description.value);
      expect(dto.category).toBe(artifact.category);
      expect(dto.rarity).toBe(artifact.rarity);
      expect(dto.era).toBe(artifact.era);
      expect(dto.region).toBe(artifact.region);
      expect(dto.culture).toBe(artifact.culture);
      expect(dto.material).toBe(artifact.material);
      expect(dto.condition).toBe(artifact.condition);
      expect(dto.image).toBe(artifact.image);
      expect(dto.thumbnail).toBe(artifact.thumbnail);
      expect(dto.animation).toBe(artifact.animation);
      expect(dto.isCollectible).toBe(artifact.isCollectible);
      expect(dto.isMuseumAllowed).toBe(artifact.isMuseumAllowed);
      expect(dto.metadata).toEqual(artifact.metadata);
      expect(dto.createdAt).toBe(artifact.createdAt.toISOString());
      expect(dto.updatedAt).toBe(artifact.updatedAt.toISOString());
    });
  });

  describe('toSummary', () => {
    it('should convert artifact entity to summary DTO', () => {
      const artifact = createTestArtifact();

      const dto = ArtifactMapper.toSummary(artifact);

      expect(dto.artifactId).toBe(artifact.artifactId.value);
      expect(dto.slug).toBe(artifact.slug.value);
      expect(dto.title).toBe(artifact.title.value);
      expect(dto.category).toBe(artifact.category);
      expect(dto.rarity).toBe(artifact.rarity);
      expect(dto.era).toBe(artifact.era);
      expect(dto.thumbnail).toBe(artifact.thumbnail);
      expect(dto.isCollectible).toBe(artifact.isCollectible);
    });

    it('should not include sensitive fields in summary', () => {
      const artifact = createTestArtifact();

      const dto = ArtifactMapper.toSummary(artifact);

      // Summary should NOT include these fields - only summary fields exist
      expect('description' in dto).toBe(false);
      expect('culture' in dto).toBe(false);
      expect('material' in dto).toBe(false);
      expect('metadata' in dto).toBe(false);
    });
  });

  describe('toResponseList', () => {
    it('should convert array of artifacts to response DTOs', () => {
      const artifact1 = createTestArtifact();
      const artifact2 = createTestArtifact();

      const dtos = ArtifactMapper.toResponseList([artifact1, artifact2]);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].artifactId).toBe(artifact1.artifactId.value);
      expect(dtos[1].artifactId).toBe(artifact2.artifactId.value);
    });

    it('should return empty array for empty input', () => {
      const dtos = ArtifactMapper.toResponseList([]);

      expect(dtos).toHaveLength(0);
    });
  });

  describe('toSummaryList', () => {
    it('should convert array of artifacts to summary DTOs', () => {
      const artifact1 = createTestArtifact();
      const artifact2 = createTestArtifact();

      const dtos = ArtifactMapper.toSummaryList([artifact1, artifact2]);

      expect(dtos).toHaveLength(2);
      expect(dtos[0].artifactId).toBe(artifact1.artifactId.value);
      expect(dtos[1].artifactId).toBe(artifact2.artifactId.value);
    });
  });

  describe('fromCreateDto', () => {
    it('should convert CreateArtifactDto to plain object', () => {
      const result = ArtifactMapper.fromCreateDto(validCreateDto);

      expect(result.slug).toBe(validCreateDto.slug);
      expect(result.title).toBe(validCreateDto.title);
      expect(result.description).toBe(validCreateDto.description);
      expect(result.category).toBe(validCreateDto.category);
      expect(result.rarity).toBe(validCreateDto.rarity);
      expect(result.era).toBe(validCreateDto.era);
      expect(result.region).toBe(validCreateDto.region);
      expect(result.culture).toBe(validCreateDto.culture);
      expect(result.material).toBe(validCreateDto.material);
      expect(result.condition).toBe(validCreateDto.condition);
      expect(result.image).toBe(validCreateDto.image);
      expect(result.thumbnail).toBe(validCreateDto.thumbnail);
      expect(result.animation).toBe(validCreateDto.animation);
      expect(result.isCollectible).toBe(validCreateDto.isCollectible);
      expect(result.isMuseumAllowed).toBe(validCreateDto.isMuseumAllowed);
      expect(result.metadata).toBe(validCreateDto.metadata);
    });
  });

  describe('fromRecordToDto', () => {
    it('should convert database record to CreateArtifactDto', () => {
      const record = createTestRecord();

      const dto = ArtifactMapper.fromRecordToDto(record);

      expect(dto.slug).toBe(record.slug);
      expect(dto.title).toBe(record.title);
      expect(dto.description).toBe(record.description);
      expect(dto.category).toBe(record.category);
      expect(dto.rarity).toBe(record.rarity);
      expect(dto.era).toBe(record.era);
      expect(dto.region).toBe(record.region);
      expect(dto.culture).toBe(record.culture);
      expect(dto.material).toBe(record.material);
      expect(dto.condition).toBe(record.condition);
      expect(dto.image).toBe(record.image);
      expect(dto.thumbnail).toBe(record.thumbnail);
      expect(dto.animation).toBe(record.animation);
      expect(dto.isCollectible).toBe(record.is_collectible);
      expect(dto.isMuseumAllowed).toBe(record.is_museum_allowed);
      expect(dto.metadata).toBe(record.metadata);
    });
  });

  describe('toRecord', () => {
    it('should convert artifact entity to database record', () => {
      const artifact = createTestArtifact();

      const record = ArtifactMapper.toRecord(artifact);

      expect(record.artifact_id).toBe(artifact.artifactId.value);
      expect(record.slug).toBe(artifact.slug.value);
      expect(record.title).toBe(artifact.title.value);
      expect(record.description).toBe(artifact.description.value);
      expect(record.category).toBe(artifact.category);
      expect(record.rarity).toBe(artifact.rarity);
      expect(record.era).toBe(artifact.era);
      expect(record.region).toBe(artifact.region);
      expect(record.culture).toBe(artifact.culture);
      expect(record.material).toBe(artifact.material);
      expect(record.condition).toBe(artifact.condition);
      expect(record.image).toBe(artifact.image);
      expect(record.thumbnail).toBe(artifact.thumbnail);
      expect(record.animation).toBe(artifact.animation);
      expect(record.is_collectible).toBe(artifact.isCollectible);
      expect(record.is_museum_allowed).toBe(artifact.isMuseumAllowed);
      expect(record.metadata).toBe(artifact.metadata);
      expect(record.created_at).toBe(artifact.createdAt.toISOString());
      expect(record.updated_at).toBe(artifact.updatedAt.toISOString());
    });
  });
});