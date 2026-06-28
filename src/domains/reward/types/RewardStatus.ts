/**
 * RewardStatus Enum
 *
 * Defines all possible states of a reward request.
 */

/**
 * Reward request status.
 */
export enum RewardStatus {
  /** Request has been created but not yet processed */
  PENDING = 'pending',
  
  /** Request is being processed */
  PROCESSING = 'processing',
  
  /** Reward has been granted successfully */
  GRANTED = 'granted',
  
  /** Reward request was rejected */
  REJECTED = 'rejected',
  
  /** Reward has expired */
  EXPIRED = 'expired',
  
  /** Reward failed to be processed */
  FAILED = 'failed',
}

/**
 * Reward status display information.
 */
export const REWARD_STATUS_DISPLAY: Record<RewardStatus, { label: string; color: string }> = {
  [RewardStatus.PENDING]: { label: 'Pending', color: '#FFA500' },
  [RewardStatus.PROCESSING]: { label: 'Processing', color: '#00D9FF' },
  [RewardStatus.GRANTED]: { label: 'Granted', color: '#00FF00' },
  [RewardStatus.REJECTED]: { label: 'Rejected', color: '#FF0000' },
  [RewardStatus.EXPIRED]: { label: 'Expired', color: '#808080' },
  [RewardStatus.FAILED]: { label: 'Failed', color: '#FF0000' },
};

/**
 * Checks if a status represents a terminal state.
 */
export function isTerminalStatus(status: RewardStatus): boolean {
  return [RewardStatus.GRANTED, RewardStatus.REJECTED, RewardStatus.EXPIRED, RewardStatus.FAILED].includes(status);
}

/**
 * Checks if a status represents a pending state.
 */
export function isPendingStatus(status: RewardStatus): boolean {
  return status === RewardStatus.PENDING || status === RewardStatus.PROCESSING;
}