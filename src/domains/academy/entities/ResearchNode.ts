/**
 * ResearchNode Entity
 *
 * Domain entity representing a research node in the Academy technology tree.
 * ResearchNodes define what research topics are available and their requirements.
 *
 * ResearchNode Entity Responsibilities:
 * - Define research properties (name, description, category, tier)
 * - Define unlock requirements (required nodes, research cost)
 * - Support the technology tree structure
 *
 * ResearchNode Entity is NOT:
 * - Player progress tracking (use ResearchProgress)
 * - Unlock logic execution (handled by Academy service)
 * - Bonus/effect application (handled by consuming services)
 */

import type { IResearchNode } from '../interfaces/IResearchNode';
import { ResearchNodeId } from '../value-objects/ResearchNodeId';
import type { ResearchCategory } from '../types/ResearchCategory';
import type { ResearchTier } from '../types/ResearchTier';
import type { UnlockType } from '../types/UnlockType';
import type { ResearchNodeMetadata } from '../types/AcademyMetadata';

/**
 * ResearchNode entity class.
 * Immutable domain entity representing a research node definition.
 */
export class ResearchNode implements IResearchNode {
  /** Unique research node identifier */
  public readonly nodeId: ResearchNodeId;

  /** URL-friendly identifier */
  public readonly slug: string;

  /** Display title */
  public readonly title: string;

  /** Research description */
  public readonly description: string;

  /** Research category */
  public readonly category: ResearchCategory;

  /** Research tier */
  public readonly tier: ResearchTier;

  /** IDs of required research nodes that must be completed first */
  public readonly requiredNodes: ResearchNodeId[];

  /** Research cost in research points */
  public readonly researchCost: number;

  /** How this research is unlocked */
  public readonly unlockType: UnlockType;

  /** Extended metadata */
  public readonly metadata: ResearchNodeMetadata;

  /** Timestamp when node was created */
  public readonly createdAt: Date;

  /** Timestamp when node was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new ResearchNode instance.
   * @param props ResearchNode properties
   */
  constructor(props: ResearchNodeProps) {
    this.nodeId = props.nodeId;
    this.slug = props.slug;
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.tier = props.tier;
    this.requiredNodes = props.requiredNodes;
    this.researchCost = props.researchCost;
    this.unlockType = props.unlockType;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new ResearchNode.
   * Factory method for new node creation.
   */
  public static create(params: {
    nodeId: ResearchNodeId;
    slug: string;
    title: string;
    description: string;
    category: ResearchCategory;
    tier: ResearchTier;
    requiredNodes?: ResearchNodeId[];
    researchCost: number;
    unlockType: UnlockType;
    metadata?: ResearchNodeMetadata;
  }): ResearchNode {
    const now = new Date();

    return new ResearchNode({
      nodeId: params.nodeId,
      slug: params.slug,
      title: params.title,
      description: params.description,
      category: params.category,
      tier: params.tier,
      requiredNodes: params.requiredNodes ?? [],
      researchCost: params.researchCost,
      unlockType: params.unlockType,
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a ResearchNode from database storage.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ResearchNodeRecord): ResearchNode {
    return new ResearchNode({
      nodeId: ResearchNodeId.reconstruct(record.nodeId),
      slug: record.slug,
      title: record.title,
      description: record.description,
      category: record.category as ResearchCategory,
      tier: record.tier as ResearchTier,
      requiredNodes: record.requiredNodes.map((id) => ResearchNodeId.reconstruct(id)),
      researchCost: record.researchCost,
      unlockType: record.unlockType as UnlockType,
      metadata: record.metadata ?? {},
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if this node has any prerequisites.
   */
  public get hasPrerequisites(): boolean {
    return this.requiredNodes.length > 0;
  }

  /**
   * Checks if this node is free (cost = 0).
   */
  public get isFree(): boolean {
    return this.researchCost === 0;
  }

  /**
   * Checks if this node is a starting node (no prerequisites).
   */
  public get isStartingNode(): boolean {
    return this.requiredNodes.length === 0;
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new ResearchNode instance.
   */
  public copyWith(params: Partial<ResearchNodeProps>): ResearchNode {
    return new ResearchNode({
      nodeId: params.nodeId ?? this.nodeId,
      slug: params.slug ?? this.slug,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      category: params.category ?? this.category,
      tier: params.tier ?? this.tier,
      requiredNodes: params.requiredNodes ?? this.requiredNodes,
      researchCost: params.researchCost ?? this.researchCost,
      unlockType: params.unlockType ?? this.unlockType,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the ResearchNode to a plain object.
   */
  public toJSON(): ResearchNodeJSON {
    return {
      nodeId: this.nodeId.value,
      slug: this.slug,
      title: this.title,
      description: this.description,
      category: this.category,
      tier: this.tier,
      requiredNodes: this.requiredNodes.map((id) => id.value),
      researchCost: this.researchCost,
      unlockType: this.unlockType,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

/**
 * ResearchNode properties interface for constructor.
 */
export interface ResearchNodeProps {
  nodeId: ResearchNodeId;
  slug: string;
  title: string;
  description: string;
  category: ResearchCategory;
  tier: ResearchTier;
  requiredNodes: ResearchNodeId[];
  researchCost: number;
  unlockType: UnlockType;
  metadata: ResearchNodeMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of ResearchNode.
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
  metadata: ResearchNodeMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of ResearchNode.
 */
export interface ResearchNodeJSON {
  nodeId: string;
  slug: string;
  title: string;
  description: string;
  category: ResearchCategory;
  tier: ResearchTier;
  requiredNodes: string[];
  researchCost: number;
  unlockType: UnlockType;
  metadata: ResearchNodeMetadata;
  createdAt: string;
  updatedAt: string;
}