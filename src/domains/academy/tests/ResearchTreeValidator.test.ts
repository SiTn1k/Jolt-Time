/**
 * ResearchTreeValidator Tests
 *
 * Unit tests for the ResearchTreeValidator.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ResearchTreeValidator } from '../validators/ResearchTreeValidator';
import { ResearchNode } from '../entities/ResearchNode';
import { ResearchProgress } from '../entities/ResearchProgress';
import { ResearchNodeId } from '../value-objects/ResearchNodeId';
import { AcademyId } from '../value-objects/AcademyId';
import { ResearchCategory } from '../types/ResearchCategory';
import { ResearchTier } from '../types/ResearchTier';
import { UnlockType } from '../types/UnlockType';

// Valid test UUIDs
const VALID_UUIDS = [
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444',
  '55555555-5555-4555-8555-555555555555',
];

let uuidIndex = 0;
const nextUuid = (): string => {
  const uuid = VALID_UUIDS[uuidIndex % VALID_UUIDS.length];
  uuidIndex++;
  return uuid;
};

// Helper to create a research node
const createNode = (
  slug: string,
  tier: ResearchTier,
  requiredNodes: ResearchNodeId[] = []
): ResearchNode => {
  const uuid = nextUuid();
  
  return ResearchNode.create({
    nodeId: ResearchNodeId.reconstruct(uuid),
    slug,
    title: `Test ${slug}`,
    description: `Description for ${slug}`,
    category: ResearchCategory.HISTORY,
    tier,
    requiredNodes,
    researchCost: 100,
    unlockType: UnlockType.DEFAULT,
  });
};

// Helper to create research progress
const createProgress = (
  nodeId: string,
  status: 'locked' | 'available' | 'in_progress' | 'completed'
): ResearchProgress => {
  return ResearchProgress.create({
    progressId: `progress-${nodeId}`,
    academyId: AcademyId.generate(),
    nodeId: ResearchNodeId.reconstruct(nodeId),
    initialStatus: status,
  });
};

describe('ResearchTreeValidator', () => {
  beforeEach(() => {
    // Reset UUID counter before each test
    uuidIndex = 0;
  });

  describe('arePrerequisitesSatisfied', () => {
    it('should return true when node has no prerequisites', () => {
      const node = createNode('tier1-node', ResearchTier.TIER_1, []);
      const completedIds = new Set<string>();

      const result = ResearchTreeValidator.arePrerequisitesSatisfied(node, completedIds);

      expect(result).toBe(true);
    });

    it('should return true when all prerequisites are completed', () => {
      const prereqNode = createNode('prereq', ResearchTier.TIER_1, []);
      const dependentNode = createNode('dependent', ResearchTier.TIER_2, [prereqNode.nodeId]);
      const completedIds = new Set<string>([prereqNode.nodeId.value]);

      const result = ResearchTreeValidator.arePrerequisitesSatisfied(dependentNode, completedIds);

      expect(result).toBe(true);
    });

    it('should return false when some prerequisites are not completed', () => {
      const prereq1 = createNode('prereq1', ResearchTier.TIER_1, []);
      const prereq2 = createNode('prereq2', ResearchTier.TIER_1, []);
      const dependentNode = createNode('dependent', ResearchTier.TIER_2, [prereq1.nodeId, prereq2.nodeId]);
      const completedIds = new Set<string>([prereq1.nodeId.value]);

      const result = ResearchTreeValidator.arePrerequisitesSatisfied(dependentNode, completedIds);

      expect(result).toBe(false);
    });

    it('should return false when no prerequisites are completed', () => {
      const prereq1 = createNode('prereq1', ResearchTier.TIER_1, []);
      const prereq2 = createNode('prereq2', ResearchTier.TIER_1, []);
      const dependentNode = createNode('dependent', ResearchTier.TIER_2, [prereq1.nodeId, prereq2.nodeId]);
      const completedIds = new Set<string>();

      const result = ResearchTreeValidator.arePrerequisitesSatisfied(dependentNode, completedIds);

      expect(result).toBe(false);
    });
  });

  describe('isLevelRequirementMet', () => {
    it('should return true when academy level meets tier requirement', () => {
      const node = createNode('tier1', ResearchTier.TIER_1, []);

      expect(ResearchTreeValidator.isLevelRequirementMet(node, 1)).toBe(true);
      expect(ResearchTreeValidator.isLevelRequirementMet(node, 5)).toBe(true);
    });

    it('should return true when academy level is higher than requirement', () => {
      const node = createNode('tier2', ResearchTier.TIER_2, []);

      expect(ResearchTreeValidator.isLevelRequirementMet(node, 10)).toBe(true);
    });

    it('should return false when academy level is lower than requirement', () => {
      const node = createNode('tier3', ResearchTier.TIER_3, []);

      expect(ResearchTreeValidator.isLevelRequirementMet(node, 5)).toBe(false);
      expect(ResearchTreeValidator.isLevelRequirementMet(node, 9)).toBe(false);
    });

    it('should handle Tier 1 nodes correctly', () => {
      const node = createNode('tier1', ResearchTier.TIER_1, []);

      expect(ResearchTreeValidator.isLevelRequirementMet(node, 0)).toBe(false);
      expect(ResearchTreeValidator.isLevelRequirementMet(node, 1)).toBe(true);
    });

    it('should handle Tier 5 nodes correctly', () => {
      const node = createNode('tier5', ResearchTier.TIER_5, []);

      expect(ResearchTreeValidator.isLevelRequirementMet(node, 34)).toBe(false);
      expect(ResearchTreeValidator.isLevelRequirementMet(node, 35)).toBe(true);
    });
  });

  describe('validateTree', () => {
    it('should return valid for correct tree structure', () => {
      const tier1a = createNode('tier1a', ResearchTier.TIER_1, []);
      const tier1b = createNode('tier1b', ResearchTier.TIER_1, []);
      const tier2 = createNode('tier2', ResearchTier.TIER_2, [tier1a.nodeId]);

      const result = ResearchTreeValidator.validateTree([tier1a, tier1b, tier2]);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect duplicate slugs', () => {
      const node1 = createNode('duplicate', ResearchTier.TIER_1, []);
      const node2 = createNode('duplicate', ResearchTier.TIER_1, []);

      const result = ResearchTreeValidator.validateTree([node1, node2]);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Duplicate slug'))).toBe(true);
    });

    it('should detect self-referencing prerequisites', () => {
      const nodeId = ResearchNodeId.reconstruct(VALID_UUIDS[0]);
      const node = ResearchNode.create({
        nodeId,
        slug: 'self-ref',
        title: 'Self Referencing Node',
        description: 'This node references itself',
        category: ResearchCategory.HISTORY,
        tier: ResearchTier.TIER_1,
        requiredNodes: [nodeId], // Self-reference
        researchCost: 100,
        unlockType: UnlockType.DEFAULT,
      });

      const result = ResearchTreeValidator.validateTree([node]);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('requires itself'))).toBe(true);
    });
  });

  describe('validateProgress', () => {
    it('should return valid when progress matches tree', () => {
      const node1 = createNode('tier1', ResearchTier.TIER_1, []);
      const node2 = createNode('tier2', ResearchTier.TIER_2, [node1.nodeId]);
      
      const progress = [
        createProgress(node1.nodeId.value, 'completed'),
      ];

      const result = ResearchTreeValidator.validateProgress([node1, node2], progress);

      expect(result.isValid).toBe(true);
    });

    it('should detect completed node without completed prerequisites', () => {
      const node1 = createNode('tier1', ResearchTier.TIER_1, []);
      const node2 = createNode('tier2', ResearchTier.TIER_2, [node1.nodeId]);
      
      const progress = [
        createProgress(node2.nodeId.value, 'completed'),
      ];

      const result = ResearchTreeValidator.validateProgress([node1, node2], progress);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('getUnlockableNodes', () => {
    it('should return all Tier 1 nodes for new player', () => {
      const tier1a = createNode('tier1a', ResearchTier.TIER_1, []);
      const tier1b = createNode('tier1b', ResearchTier.TIER_1, []);
      const tier2a = createNode('tier2a', ResearchTier.TIER_2, [tier1a.nodeId]);

      const nodes = [tier1a, tier1b, tier2a];
      const progress: ResearchProgress[] = [];

      const result = ResearchTreeValidator.getUnlockableNodes(nodes, progress, 1);

      expect(result).toContain(tier1a.nodeId.value);
      expect(result).toContain(tier1b.nodeId.value);
      expect(result).not.toContain(tier2a.nodeId.value);
    });

    it('should return Tier 2 nodes after completing prerequisites', () => {
      const tier1a = createNode('tier1a', ResearchTier.TIER_1, []);
      const tier2a = createNode('tier2a', ResearchTier.TIER_2, [tier1a.nodeId]);

      const nodes = [tier1a, tier2a];
      const progress = [
        createProgress(tier1a.nodeId.value, 'completed'),
      ];

      const result = ResearchTreeValidator.getUnlockableNodes(nodes, progress, 5);

      expect(result).toContain(tier2a.nodeId.value);
    });

    it('should not return already completed nodes', () => {
      const tier1a = createNode('tier1a', ResearchTier.TIER_1, []);

      const nodes = [tier1a];
      const progress = [
        createProgress(tier1a.nodeId.value, 'completed'),
      ];

      const result = ResearchTreeValidator.getUnlockableNodes(nodes, progress, 1);

      expect(result).not.toContain(tier1a.nodeId.value);
    });

    it('should not return nodes in progress', () => {
      const tier1a = createNode('tier1a', ResearchTier.TIER_1, []);

      const nodes = [tier1a];
      const progress = [
        createProgress(tier1a.nodeId.value, 'in_progress'),
      ];

      const result = ResearchTreeValidator.getUnlockableNodes(nodes, progress, 1);

      expect(result).not.toContain(tier1a.nodeId.value);
    });

    it('should respect academy level requirements', () => {
      const tier1 = createNode('tier1', ResearchTier.TIER_1, []);
      const tier3 = createNode('tier3', ResearchTier.TIER_3, [tier1.nodeId]);

      const nodes = [tier1, tier3];
      const progress = [
        createProgress(tier1.nodeId.value, 'completed'),
      ];

      // Academy level 5 is below Tier 3 requirement of 10
      const result = ResearchTreeValidator.getUnlockableNodes(nodes, progress, 5);

      expect(result).not.toContain(tier3.nodeId.value);
    });

    it('should return nodes when level requirement is met', () => {
      const tier1 = createNode('tier1', ResearchTier.TIER_1, []);
      const tier3 = createNode('tier3', ResearchTier.TIER_3, [tier1.nodeId]);

      const nodes = [tier1, tier3];
      const progress = [
        createProgress(tier1.nodeId.value, 'completed'),
      ];

      // Academy level 10 meets Tier 3 requirement
      const result = ResearchTreeValidator.getUnlockableNodes(nodes, progress, 10);

      expect(result).toContain(tier3.nodeId.value);
    });
  });
});
