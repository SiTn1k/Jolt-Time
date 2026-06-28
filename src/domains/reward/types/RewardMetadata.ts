/**
 * RewardMetadata Type
 *
 * Metadata associated with reward definitions and packages.
 */

import type { RewardType } from './RewardType';
import type { RewardSource } from './RewardSource';

/**
 * Reward metadata for definitions.
 */
export interface RewardDefinitionMetadata {
  /** Display icon for the reward */
  icon?: string;
  
  /** Display color for the reward */
  color?: string;
  
  /** Rarity tier (common, uncommon, rare, epic, legendary) */
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  
  /** Whether the reward is limited edition */
  limited?: boolean;
  
  /** Expiration date if any */
  expiresAt?: string;
  
  /** Custom metadata fields */
  custom?: Record<string, unknown>;
}

/**
 * Reward metadata for packages.
 */
export interface RewardPackageMetadata {
  /** Display theme for the package */
  theme?: string;
  
  /** Background image URL */
  backgroundImage?: string;
  
  /** Package tier */
  tier?: 'basic' | 'premium' | 'exclusive';
  
  /** Whether this is a surprise package */
  isSurprise?: boolean;
  
  /** Associated event if any */
  eventId?: string;
  
  /** Custom metadata fields */
  custom?: Record<string, unknown>;
}

/**
 * Request metadata for tracking and debugging.
 */
export interface RewardRequestMetadata {
  /** IP address of requester (for fraud prevention) */
  ipAddress?: string;
  
  /** User agent string */
  userAgent?: string;
  
  /** Session ID */
  sessionId?: string;
  
  /** Transaction ID for external systems */
  transactionId?: string;
  
  /** Related request IDs for batch processing */
  relatedRequests?: string[];
  
  /** Error message if rejected/failed */
  errorMessage?: string;
  
  /** Processing notes */
  notes?: string;
  
  /** Custom metadata fields */
  custom?: Record<string, unknown>;
}

/**
 * Union type for all reward metadata types.
 */
export type RewardMetadata = RewardDefinitionMetadata | RewardPackageMetadata | RewardRequestMetadata;

/**
 * Creates default definition metadata.
 */
export function createDefaultDefinitionMetadata(): RewardDefinitionMetadata {
  return {
    rarity: 'common',
    limited: false,
  };
}

/**
 * Creates default package metadata.
 */
export function createDefaultPackageMetadata(): RewardPackageMetadata {
  return {
    tier: 'basic',
    isSurprise: false,
  };
}

/**
 * Creates default request metadata.
 */
export function createDefaultRequestMetadata(): RewardRequestMetadata {
  return {};
}