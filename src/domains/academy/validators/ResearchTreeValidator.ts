/**
 * Research Tree Validator
 *
 * Validates the technology tree structure and dependencies.
 */

import type { ResearchNode } from '../entities/ResearchNode';
import type { ResearchProgress } from '../entities/ResearchProgress';
import type { ResearchTier } from '../types/ResearchTier';
import { getResearchTierMinLevel } from '../types/ResearchTier';

/**
 * Result of research tree validation.
 */
export interface ResearchTreeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validation issue with a research node.
 */
export interface ResearchNodeIssue {
  nodeId: string;
  issue: string;
}

/**
 * Validator for research tree structure.
 */
export class ResearchTreeValidator {
  /**
   * Validates that a node's prerequisites are satisfied.
   * @param node The research node to validate
   * @param completedNodeIds Set of completed node IDs
   * @returns true if prerequisites are satisfied
   */
  public static arePrerequisitesSatisfied(
    node: ResearchNode,
    completedNodeIds: Set<string>
  ): boolean {
    for (const requiredNode of node.requiredNodes) {
      if (!completedNodeIds.has(requiredNode.value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Validates that a node can be unlocked based on academy level.
   * @param node The research node to validate
   * @param academyLevel The current academy level
   * @returns true if level requirement is met
   */
  public static isLevelRequirementMet(
    node: ResearchNode,
    academyLevel: number
  ): boolean {
    const minLevel = getResearchTierMinLevel(node.tier);
    return academyLevel >= minLevel;
  }

  /**
   * Validates the entire research tree structure.
   * @param nodes All research nodes in the tree
   * @returns Validation result with all errors and warnings
   */
  public static validateTree(nodes: ResearchNode[]): ResearchTreeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Build node lookup map
    const nodeMap = new Map<string, ResearchNode>();
    for (const node of nodes) {
      nodeMap.set(node.nodeId.value, node);
    }

    // Check for duplicate slugs
    const slugSet = new Set<string>();
    for (const node of nodes) {
      if (slugSet.has(node.slug)) {
        errors.push(`Duplicate slug found: ${node.slug}`);
      }
      slugSet.add(node.slug);
    }

    // Check for invalid required nodes
    for (const node of nodes) {
      for (const requiredNodeId of node.requiredNodes) {
        if (!nodeMap.has(requiredNodeId.value)) {
          errors.push(`Node ${node.slug} requires unknown node: ${requiredNodeId.value}`);
        }
        // Check for self-reference
        if (requiredNodeId.value === node.nodeId.value) {
          errors.push(`Node ${node.slug} requires itself`);
        }
      }
    }

    // Check for circular dependencies
    const circularDeps = this.findCircularDependencies(nodes);
    if (circularDeps.length > 0) {
      for (const cycle of circularDeps) {
        errors.push(`Circular dependency detected: ${cycle.join(' -> ')}`);
      }
    }

    // Check tier progression
    for (const node of nodes) {
      if (node.requiredNodes.length > 0) {
        const maxRequiredTier = this.getMaxRequiredTier(node, nodeMap);
        if (node.tier <= maxRequiredTier) {
          warnings.push(`Node ${node.slug} has tier ${node.tier} but requires tier ${maxRequiredTier}+ nodes`);
        }
      }
    }

    // Check for orphan nodes (no one requires them, not a starting node)
    const requiredBy = new Set<string>();
    for (const node of nodes) {
      for (const requiredId of node.requiredNodes) {
        requiredBy.add(requiredId.value);
      }
    }

    for (const node of nodes) {
      if (node.requiredNodes.length === 0 && !requiredBy.has(node.nodeId.value)) {
        warnings.push(`Node ${node.slug} is an orphan node (no prerequisites, not required by others)`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Gets the maximum tier among a node's prerequisites.
   */
  private static getMaxRequiredTier(
    node: ResearchNode,
    nodeMap: Map<string, ResearchNode>
  ): number {
    let maxTier = 0;
    for (const requiredId of node.requiredNodes) {
      const requiredNode = nodeMap.get(requiredId.value);
      if (requiredNode && requiredNode.tier > maxTier) {
        maxTier = requiredNode.tier;
      }
    }
    return maxTier;
  }

  /**
   * Finds circular dependencies in the research tree.
   * @param nodes All research nodes
   * @returns Array of circular dependency chains
   */
  private static findCircularDependencies(nodes: ResearchNode[]): string[][] {
    const cycles: string[][] = [];
    const nodeMap = new Map<string, ResearchNode>();
    for (const node of nodes) {
      nodeMap.set(node.nodeId.value, node);
    }

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string, path: string[]): void => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (node) {
        for (const requiredId of node.requiredNodes) {
          if (!visited.has(requiredId.value)) {
            dfs(requiredId.value, [...path, node.slug]);
          } else if (recursionStack.has(requiredId.value)) {
            // Found cycle
            const cycleStart = path.indexOf(nodeMap.get(requiredId.value)?.slug ?? '');
            const cycle = [...path.slice(cycleStart), node.slug, nodeMap.get(requiredId.value)?.slug ?? ''];
            cycles.push(cycle);
          }
        }
      }

      recursionStack.delete(nodeId);
    };

    for (const node of nodes) {
      if (!visited.has(node.nodeId.value)) {
        dfs(node.nodeId.value, [node.slug]);
      }
    }

    return cycles;
  }

  /**
   * Validates progress against tree structure.
   * @param nodes All research nodes
   * @param progress All research progress entries
   * @returns Validation result
   */
  public static validateProgress(
    nodes: ResearchNode[],
    progress: ResearchProgress[]
  ): ResearchTreeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const nodeMap = new Map<string, ResearchNode>();
    for (const node of nodes) {
      nodeMap.set(node.nodeId.value, node);
    }

    const progressMap = new Map<string, ResearchProgress>();
    for (const p of progress) {
      progressMap.set(p.nodeId.value, p);
    }

    // Check that completed nodes have valid prerequisites completed
    for (const p of progress) {
      if (p.status === 'completed') {
        const node = nodeMap.get(p.nodeId.value);
        if (node) {
          for (const requiredId of node.requiredNodes) {
            const requiredProgress = progressMap.get(requiredId.value);
            if (!requiredProgress || requiredProgress.status !== 'completed') {
              errors.push(
                `Node ${node.slug} is marked complete but prerequisite ${requiredId.value} is not complete`
              );
            }
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Gets all nodes that can be unlocked given current progress.
   * @param nodes All research nodes
   * @param progress All research progress entries
   * @param academyLevel Current academy level
   * @returns Array of node IDs that can be started
   */
  public static getUnlockableNodes(
    nodes: ResearchNode[],
    progress: ResearchProgress[],
    academyLevel: number
  ): string[] {
    const completedNodeIds = new Set<string>();
    for (const p of progress) {
      if (p.status === 'completed') {
        completedNodeIds.add(p.nodeId.value);
      }
    }

    const inProgressNodeIds = new Set<string>();
    for (const p of progress) {
      if (p.status === 'in_progress') {
        inProgressNodeIds.add(p.nodeId.value);
      }
    }

    const unlockable: string[] = [];

    for (const node of nodes) {
      // Skip if already completed or in progress
      if (completedNodeIds.has(node.nodeId.value) || inProgressNodeIds.has(node.nodeId.value)) {
        continue;
      }

      // Check level requirement
      if (!this.isLevelRequirementMet(node, academyLevel)) {
        continue;
      }

      // Check prerequisites
      if (this.arePrerequisitesSatisfied(node, completedNodeIds)) {
        unlockable.push(node.nodeId.value);
      }
    }

    return unlockable;
  }
}