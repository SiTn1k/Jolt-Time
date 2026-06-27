/**
 * Research Mapper
 *
 * Maps between ResearchNode and ResearchProgress entities and various DTOs.
 * No database logic - pure transformation only.
 */

import type { ResearchNode } from '../entities/ResearchNode';
import type { ResearchProgress } from '../entities/ResearchProgress';
import type { ResearchNodeDto, ResearchNodeSummaryDto, ResearchNodeDetailDto } from '../dto/ResearchNode.dto';
import type { ResearchProgressDto, ResearchProgressSummaryDto, ActiveResearchDto } from '../dto/ResearchProgress.dto';
import { getResearchCategoryDisplayName } from '../types/ResearchCategory';
import { getResearchTierDisplayName } from '../types/ResearchTier';

/**
 * Mapper for converting between ResearchNode entity and DTOs.
 */
export class ResearchMapper {
  /**
   * Converts a ResearchNode entity to ResearchNodeDto.
   */
  public static toNodeResponse(node: ResearchNode): ResearchNodeDto {
    return {
      nodeId: node.nodeId.value,
      slug: node.slug,
      title: node.title,
      description: node.description,
      category: node.category,
      categoryDisplayName: getResearchCategoryDisplayName(node.category),
      tier: node.tier,
      tierDisplayName: getResearchTierDisplayName(node.tier),
      requiredNodes: node.requiredNodes.map((id) => id.value),
      researchCost: node.researchCost,
      unlockType: node.unlockType,
      metadata: node.metadata,
      hasPrerequisites: node.hasPrerequisites,
      isFree: node.isFree,
      createdAt: node.createdAt.toISOString(),
      updatedAt: node.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a ResearchNode entity to ResearchNodeSummaryDto.
   */
  public static toNodeSummary(node: ResearchNode): ResearchNodeSummaryDto {
    return {
      nodeId: node.nodeId.value,
      slug: node.slug,
      title: node.title,
      category: node.category,
      tier: node.tier,
      researchCost: node.researchCost,
    };
  }

  /**
   * Converts a ResearchNode entity to ResearchNodeDetailDto.
   */
  public static toNodeDetail(node: ResearchNode): ResearchNodeDetailDto {
    return {
      ...this.toNodeResponse(node),
      era: node.metadata.era,
      region: node.metadata.region,
      figures: node.metadata.figures,
      relatedArtifacts: node.metadata.relatedArtifacts,
      keyDates: node.metadata.keyDates,
      facts: node.metadata.facts,
    };
  }

  /**
   * Converts an array of ResearchNode entities to ResearchNodeDto array.
   */
  public static toNodeResponseList(nodes: ResearchNode[]): ResearchNodeDto[] {
    return nodes.map((node) => this.toNodeResponse(node));
  }

  /**
   * Converts an array of ResearchNode entities to ResearchNodeSummaryDto array.
   */
  public static toNodeSummaryList(nodes: ResearchNode[]): ResearchNodeSummaryDto[] {
    return nodes.map((node) => this.toNodeSummary(node));
  }

  /**
   * Converts a ResearchProgress entity to ResearchProgressDto.
   */
  public static toProgressResponse(progress: ResearchProgress): ResearchProgressDto {
    const statusDisplayNames: Record<string, string> = {
      locked: 'Locked',
      available: 'Available',
      in_progress: 'In Progress',
      completed: 'Completed',
      reset: 'Reset',
    };

    return {
      progressId: progress.progressId,
      academyId: progress.academyId.value,
      nodeId: progress.nodeId.value,
      status: progress.status,
      statusDisplayName: statusDisplayNames[progress.status] ?? progress.status,
      progress: progress.progress.value,
      isComplete: progress.isComplete,
      completedAt: progress.completedAt?.toISOString() ?? null,
      metadata: progress.metadata,
    };
  }

  /**
   * Converts a ResearchProgress entity to ResearchProgressSummaryDto.
   */
  public static toProgressSummary(progress: ResearchProgress): ResearchProgressSummaryDto {
    return {
      progressId: progress.progressId,
      nodeId: progress.nodeId.value,
      status: progress.status,
      progress: progress.progress.value,
      isComplete: progress.isComplete,
    };
  }

  /**
   * Converts a ResearchProgress entity to ActiveResearchDto.
   */
  public static toActiveResearch(
    progress: ResearchProgress,
    node: ResearchNode
  ): ActiveResearchDto {
    return {
      progressId: progress.progressId,
      node: {
        nodeId: node.nodeId.value,
        title: node.title,
        slug: node.slug,
        category: node.category,
        tier: node.tier,
      },
      progress: progress.progress.value,
      remainingProgress: 100 - progress.progress.value,
    };
  }

  /**
   * Converts an array of ResearchProgress entities to ResearchProgressDto array.
   */
  public static toProgressResponseList(progressList: ResearchProgress[]): ResearchProgressDto[] {
    return progressList.map((progress) => this.toProgressResponse(progress));
  }

  /**
   * Converts an array of ResearchProgress entities to ResearchProgressSummaryDto array.
   */
  public static toProgressSummaryList(progressList: ResearchProgress[]): ResearchProgressSummaryDto[] {
    return progressList.map((progress) => this.toProgressSummary(progress));
  }

  /**
   * Converts a ResearchNode entity to a database record format.
   */
  public static nodeToRecord(node: ResearchNode): {
    nodeId: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    tier: number;
    requiredNodes: string[];
    researchCost: number;
    unlockType: string;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      nodeId: node.nodeId.value,
      slug: node.slug,
      title: node.title,
      description: node.description,
      category: node.category,
      tier: node.tier,
      requiredNodes: node.requiredNodes.map((id) => id.value),
      researchCost: node.researchCost,
      unlockType: node.unlockType,
      metadata: node.metadata as Record<string, unknown>,
      createdAt: node.createdAt.toISOString(),
      updatedAt: node.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a ResearchProgress entity to a database record format.
   */
  public static progressToRecord(progress: ResearchProgress): {
    progressId: string;
    academyId: string;
    nodeId: string;
    status: string;
    progress: number;
    completedAt: string | null;
    metadata: Record<string, unknown>;
  } {
    return {
      progressId: progress.progressId,
      academyId: progress.academyId.value,
      nodeId: progress.nodeId.value,
      status: progress.status,
      progress: progress.progress.value,
      completedAt: progress.completedAt?.toISOString() ?? null,
      metadata: progress.metadata,
    };
  }
}

/**
 * Database record representation of ResearchNode.
 * For use in repository mapping.
 */
export interface ResearchNodeRecord {
  nodeId: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tier: number;
  requiredNodes: string[];
  researchCost: number;
  unlockType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Database record representation of ResearchProgress.
 * For use in repository mapping.
 */
export interface ResearchProgressRecord {
  progressId: string;
  academyId: string;
  nodeId: string;
  status: string;
  progress: number;
  completedAt: string | null;
  metadata: Record<string, unknown>;
}