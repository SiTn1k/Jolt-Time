/**
 * Artifact Validator Tests
 *
 * Unit tests for ArtifactValidator validation rules.
 */

import { describe, it, expect } from 'vitest';
import { ArtifactValidator } from '../validators/ArtifactValidator';
import type { CreateArtifactDto } from '../dto/CreateArtifact.dto';
import type { UpdateArtifactDto } from '../dto/UpdateArtifact.dto';
import { ArtifactCategory, ArtifactRarity, ArtifactEra, ArtifactRegion } from '../types';

// Valid create DTO for testing
const validCreateDto: CreateArtifactDto = {
  slug: 'cuneiform-tablet',
  title: 'Cuneiform Tablet',
  description: 'An ancient Mesopotamian clay tablet with cuneiform script used for record keeping',
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

describe('ArtifactValidator', () => {
  describe('validateCreate', () => {
    it('should pass validation with valid DTO', () => {
      const result = ArtifactValidator.validateCreate(validCreateDto);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with empty slug', () => {
      const dto = { ...validCreateDto, slug: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Slug'))).toBe(true);
    });

    it('should fail validation with slug containing spaces', () => {
      const dto = { ...validCreateDto, slug: 'cuneiform tablet' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Slug'))).toBe(true);
    });

    it('should fail validation with short slug', () => {
      const dto = { ...validCreateDto, slug: 'ab' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Slug'))).toBe(true);
    });

    it('should fail validation with empty title', () => {
      const dto = { ...validCreateDto, title: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Title'))).toBe(true);
    });

    it('should fail validation with short title', () => {
      const dto = { ...validCreateDto, title: 'A' }; // 1 char < 2 min
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Title'))).toBe(true);
    });

    it('should fail validation with empty description', () => {
      const dto = { ...validCreateDto, description: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Description'))).toBe(true);
    });

    it('should fail validation with short description', () => {
      const dto = { ...validCreateDto, description: 'Short' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Description'))).toBe(true);
    });

    it('should fail validation with invalid category', () => {
      const dto = { ...validCreateDto, category: 'invalid' as any };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('category'))).toBe(true);
    });

    it('should fail validation with invalid rarity', () => {
      const dto = { ...validCreateDto, rarity: 'invalid' as any };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('rarity'))).toBe(true);
    });

    it('should fail validation with invalid era', () => {
      const dto = { ...validCreateDto, era: 'invalid' as any };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('era'))).toBe(true);
    });

    it('should fail validation with invalid region', () => {
      const dto = { ...validCreateDto, region: 'invalid' as any };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('region'))).toBe(true);
    });

    it('should fail validation with empty culture', () => {
      const dto = { ...validCreateDto, culture: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Culture'))).toBe(true);
    });

    it('should fail validation with empty material', () => {
      const dto = { ...validCreateDto, material: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Material'))).toBe(true);
    });

    it('should fail validation with empty condition', () => {
      const dto = { ...validCreateDto, condition: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Condition'))).toBe(true);
    });

    it('should fail validation with empty image', () => {
      const dto = { ...validCreateDto, image: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Image'))).toBe(true);
    });

    it('should fail validation with empty thumbnail', () => {
      const dto = { ...validCreateDto, thumbnail: '' };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Thumbnail'))).toBe(true);
    });

    it('should collect multiple errors', () => {
      const dto = {
        ...validCreateDto,
        slug: '',
        title: '',
        description: '',
        category: 'invalid' as any,
      };
      const result = ArtifactValidator.validateCreate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateUpdate', () => {
    it('should pass validation with empty DTO (no updates)', () => {
      const dto: UpdateArtifactDto = {};
      const result = ArtifactValidator.validateUpdate(dto);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass validation with valid partial update', () => {
      const dto: UpdateArtifactDto = { title: 'Updated Title' };
      const result = ArtifactValidator.validateUpdate(dto);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with invalid slug in update', () => {
      const dto: UpdateArtifactDto = { slug: '' };
      const result = ArtifactValidator.validateUpdate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Slug'))).toBe(true);
    });

    it('should fail validation with invalid title in update', () => {
      const dto: UpdateArtifactDto = { title: 'A' }; // 1 char < 2 min
      const result = ArtifactValidator.validateUpdate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Title'))).toBe(true);
    });

    it('should fail validation with invalid category in update', () => {
      const dto: UpdateArtifactDto = { category: 'invalid' as any };
      const result = ArtifactValidator.validateUpdate(dto);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('category'))).toBe(true);
    });

    it('should pass validation when only valid category is updated', () => {
      const dto: UpdateArtifactDto = { category: ArtifactCategory.RELIC };
      const result = ArtifactValidator.validateUpdate(dto);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateSlug', () => {
    it('should pass validation with valid slug', () => {
      const result = ArtifactValidator.validateSlug('cuneiform-tablet');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass validation with slug containing numbers', () => {
      const result = ArtifactValidator.validateSlug('cuneiform-tablet-123');

      expect(result.isValid).toBe(true);
    });

    it('should fail validation with null slug', () => {
      const result = ArtifactValidator.validateSlug(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Slug is required');
    });

    it('should fail validation with undefined slug', () => {
      const result = ArtifactValidator.validateSlug(undefined);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Slug is required');
    });

    it('should fail validation with slug containing spaces', () => {
      const result = ArtifactValidator.validateSlug('cuneiform tablet');

      expect(result.isValid).toBe(false);
    });

    it('should fail validation with slug containing special characters', () => {
      const result = ArtifactValidator.validateSlug('cuneiform_tablet');

      expect(result.isValid).toBe(false);
    });
  });

  describe('validateTitle', () => {
    it('should pass validation with valid title', () => {
      const result = ArtifactValidator.validateTitle('Cuneiform Tablet');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with null title', () => {
      const result = ArtifactValidator.validateTitle(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should fail validation with undefined title', () => {
      const result = ArtifactValidator.validateTitle(undefined);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should fail validation with short title', () => {
      const result = ArtifactValidator.validateTitle('A');

      expect(result.isValid).toBe(false);
    });
  });

  describe('validateDescription', () => {
    it('should pass validation with valid description', () => {
      const result = ArtifactValidator.validateDescription('A detailed description of the artifact');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation with null description', () => {
      const result = ArtifactValidator.validateDescription(null);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required');
    });

    it('should fail validation with short description', () => {
      const result = ArtifactValidator.validateDescription('Short'); // 5 chars < 10 min

      expect(result.isValid).toBe(false);
    });
  });

  describe('validateCreateOrThrow', () => {
    it('should not throw with valid DTO', () => {
      expect(() => ArtifactValidator.validateCreateOrThrow(validCreateDto)).not.toThrow();
    });

    it('should throw with invalid DTO', () => {
      const dto = { ...validCreateDto, slug: '' };

      expect(() => ArtifactValidator.validateCreateOrThrow(dto)).toThrow();
    });
  });

  describe('validateUpdateOrThrow', () => {
    it('should not throw with empty DTO', () => {
      expect(() => ArtifactValidator.validateUpdateOrThrow({})).not.toThrow();
    });

    it('should throw with invalid DTO', () => {
      const dto: UpdateArtifactDto = { slug: '' };

      expect(() => ArtifactValidator.validateUpdateOrThrow(dto)).toThrow();
    });
  });
});