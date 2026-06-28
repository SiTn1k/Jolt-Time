/**
 * RewardType Enum
 *
 * Defines all supported reward types in the game.
 */

/**
 * Supported reward types.
 */
export enum RewardType {
  /** Currency rewards (coins, gems, etc.) */
  CURRENCY = 'currency',
  
  /** Artifact rewards */
  ARTIFACT = 'artifact',
  
  /** Experience points */
  EXPERIENCE = 'experience',
  
  /** Research points for Academy */
  RESEARCH_POINTS = 'research_points',
  
  /** Museum display points */
  MUSEUM_POINTS = 'museum_points',
  
  /** Inventory items */
  ITEM = 'item',
  
  /** Title rewards (e.g., "Time Traveler") */
  TITLE = 'title',
  
  /** Avatar rewards */
  AVATAR = 'avatar',
  
  /** Badge rewards */
  BADGE = 'badge',
  
  /** Unlock rewards (features, content) */
  UNLOCK = 'unlock',
}

/**
 * Reward type display information.
 */
export const REWARD_TYPE_DISPLAY: Record<RewardType, { label: string; icon: string }> = {
  [RewardType.CURRENCY]: { label: 'Currency', icon: '💰' },
  [RewardType.ARTIFACT]: { label: 'Artifact', icon: '🏺' },
  [RewardType.EXPERIENCE]: { label: 'Experience', icon: '⭐' },
  [RewardType.RESEARCH_POINTS]: { label: 'Research Points', icon: '🔬' },
  [RewardType.MUSEUM_POINTS]: { label: 'Museum Points', icon: '🏛️' },
  [RewardType.ITEM]: { label: 'Item', icon: '📦' },
  [RewardType.TITLE]: { label: 'Title', icon: '👑' },
  [RewardType.AVATAR]: { label: 'Avatar', icon: '🎭' },
  [RewardType.BADGE]: { label: 'Badge', icon: '🏅' },
  [RewardType.UNLOCK]: { label: 'Unlock', icon: '🔓' },
};

/**
 * Checks if a reward type is valid.
 */
export function isValidRewardType(type: string): type is RewardType {
  return Object.values(RewardType).includes(type as RewardType);
}

/**
 * Checks if a reward type requires a target identifier.
 */
export function requiresTargetIdentifier(type: RewardType): boolean {
  return [RewardType.ARTIFACT, RewardType.ITEM, RewardType.TITLE, RewardType.AVATAR, RewardType.UNLOCK].includes(type);
}