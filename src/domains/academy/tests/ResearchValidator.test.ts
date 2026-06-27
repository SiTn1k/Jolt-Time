/**
 * ResearchValidator Tests
 *
 * Unit tests for the ResearchValidator.
 */

import { describe, it, expect } from 'vitest';
import { ResearchValidator } from '../validators/ResearchValidator';

describe('ResearchValidator', () => {
  describe('isValidSlug', () => {
    it('should return true for valid slugs', () => {
      expect(ResearchValidator.isValidSlug('ancient-egypt')).toBe(true);
      expect(ResearchValidator.isValidSlug('bronze-age')).toBe(true);
      expect(ResearchValidator.isValidSlug('a')).toBe(false); // Too short
      expect(ResearchValidator.isValidSlug('abc')).toBe(true);
      expect(ResearchValidator.isValidSlug('ancient-egypt-research')).toBe(true);
    });

    it('should return false for invalid slugs', () => {
      expect(ResearchValidator.isValidSlug('')).toBe(false);
      expect(ResearchValidator.isValidSlug(null)).toBe(false);
      expect(ResearchValidator.isValidSlug(undefined)).toBe(false);
      expect(ResearchValidator.isValidSlug('ancient_egypt')).toBe(false); // Underscore not allowed
      expect(ResearchValidator.isValidSlug('AncientEgypt')).toBe(false); // Uppercase not allowed
      expect(ResearchValidator.isValidSlug('-ancient')).toBe(false); // Can't start with hyphen
      expect(ResearchValidator.isValidSlug('ancient-')).toBe(false); // Can't end with hyphen
    });

    it('should enforce length constraints', () => {
      expect(ResearchValidator.isValidSlug('ab')).toBe(false); // Too short (min 3)
      expect(ResearchValidator.isValidSlug('a'.repeat(51))).toBe(false); // Too long (max 50)
      expect(ResearchValidator.isValidSlug('a'.repeat(50))).toBe(true);
    });
  });

  describe('isValidTitle', () => {
    it('should return true for valid titles', () => {
      expect(ResearchValidator.isValidTitle('Ancient Egypt')).toBe(true);
      expect(ResearchValidator.isValidTitle('Roman Empire')).toBe(true);
      expect(ResearchValidator.isValidTitle('abc')).toBe(true);
    });

    it('should return false for invalid titles', () => {
      expect(ResearchValidator.isValidTitle('')).toBe(false);
      expect(ResearchValidator.isValidTitle(null)).toBe(false);
      expect(ResearchValidator.isValidTitle(undefined)).toBe(false);
      expect(ResearchValidator.isValidTitle('ab')).toBe(false); // Too short
      expect(ResearchValidator.isValidTitle('a'.repeat(101))).toBe(false); // Too long
    });
  });

  describe('isValidDescription', () => {
    it('should return true for valid descriptions', () => {
      expect(ResearchValidator.isValidDescription('This is a valid description with enough characters.')).toBe(true);
      expect(ResearchValidator.isValidDescription('x'.repeat(10))).toBe(true);
      expect(ResearchValidator.isValidDescription('x'.repeat(1000))).toBe(true);
    });

    it('should return false for invalid descriptions', () => {
      expect(ResearchValidator.isValidDescription('')).toBe(false);
      expect(ResearchValidator.isValidDescription(null)).toBe(false);
      expect(ResearchValidator.isValidDescription(undefined)).toBe(false);
      expect(ResearchValidator.isValidDescription('Too short')).toBe(false); // Less than 10 chars
      expect(ResearchValidator.isValidDescription('a'.repeat(1001))).toBe(false); // Too long
    });
  });

  describe('isValidResearchCost', () => {
    it('should return true for valid costs', () => {
      expect(ResearchValidator.isValidResearchCost(0)).toBe(true);
      expect(ResearchValidator.isValidResearchCost(100)).toBe(true);
      expect(ResearchValidator.isValidResearchCost(999999999)).toBe(true);
    });

    it('should return false for invalid costs', () => {
      expect(ResearchValidator.isValidResearchCost(null)).toBe(false);
      expect(ResearchValidator.isValidResearchCost(undefined)).toBe(false);
      expect(ResearchValidator.isValidResearchCost(-1)).toBe(false);
      expect(ResearchValidator.isValidResearchCost(1.5)).toBe(false); // Not integer
      expect(ResearchValidator.isValidResearchCost(1000000000)).toBe(false); // Over max
    });
  });

  describe('isValidRequiredNodes', () => {
    it('should return true for valid required nodes', () => {
      expect(ResearchValidator.isValidRequiredNodes([])).toBe(true);
      expect(ResearchValidator.isValidRequiredNodes(null)).toBe(true);
      expect(ResearchValidator.isValidRequiredNodes(undefined)).toBe(true);
      expect(ResearchValidator.isValidRequiredNodes([
        '00000000-0000-4000-8000-000000000001'
      ])).toBe(true);
      expect(ResearchValidator.isValidRequiredNodes([
        '00000000-0000-4000-8000-000000000001',
        '00000000-0000-4000-8000-000000000002'
      ])).toBe(true);
    });

    it('should return false for invalid required nodes', () => {
      expect(ResearchValidator.isValidRequiredNodes('not-an-array')).toBe(false);
      expect(ResearchValidator.isValidRequiredNodes(123)).toBe(false);
      expect(ResearchValidator.isValidRequiredNodes(['not-a-uuid'])).toBe(false);
      expect(ResearchValidator.isValidRequiredNodes([''])).toBe(false);
    });
  });

  describe('validateResearchNode', () => {
    it('should return valid for complete valid data', () => {
      const result = ResearchValidator.validateResearchNode({
        slug: 'ancient-egypt',
        title: 'Ancient Egypt',
        description: 'This is a detailed description of ancient Egypt research.',
        category: 'history',
        tier: 1,
        requiredNodes: [],
        researchCost: 100,
        unlockType: 'default',
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for partial data (only provided fields validated)', () => {
      const result = ResearchValidator.validateResearchNode({
        slug: 'test-node',
        title: 'Test Node',
        description: 'Test description here.',
      });

      expect(result.isValid).toBe(true);
    });

    it('should return errors for invalid slug', () => {
      const result = ResearchValidator.validateResearchNode({
        slug: 'Invalid Slug',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Slug'))).toBe(true);
    });

    it('should return errors for invalid title', () => {
      const result = ResearchValidator.validateResearchNode({
        title: 'ab',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Title'))).toBe(true);
    });

    it('should return errors for invalid category', () => {
      const result = ResearchValidator.validateResearchNode({
        category: 'invalid_category',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Category'))).toBe(true);
    });

    it('should return errors for invalid tier', () => {
      const result = ResearchValidator.validateResearchNode({
        tier: 6,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Tier'))).toBe(true);
    });

    it('should return errors for invalid research cost', () => {
      const result = ResearchValidator.validateResearchNode({
        researchCost: -10,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('cost'))).toBe(true);
    });

    it('should return errors for invalid unlock type', () => {
      const result = ResearchValidator.validateResearchNode({
        unlockType: 'invalid_type',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Unlock type'))).toBe(true);
    });

    it('should collect multiple errors', () => {
      const result = ResearchValidator.validateResearchNode({
        slug: 'Invalid Slug',
        title: 'ab',
        description: 'short',
        tier: 10,
        researchCost: -1,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('validateResearchNodeOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => {
        ResearchValidator.validateResearchNodeOrThrow({
          slug: 'valid-slug',
          title: 'Valid Title',
          description: 'Valid description here.',
        });
      }).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => {
        ResearchValidator.validateResearchNodeOrThrow({
          slug: 'Invalid Slug',
        });
      }).toThrow();
    });
  });
});
