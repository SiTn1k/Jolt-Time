/**
 * Research Status
 *
 * Defines the possible statuses of a research node in the Academy.
 */

export enum ResearchStatus {
  /** Research is locked and cannot be started */
  LOCKED = 'locked',
  /** Research is available to start */
  AVAILABLE = 'available',
  /** Research is currently in progress */
  IN_PROGRESS = 'in_progress',
  /** Research is completed */
  COMPLETED = 'completed',
  /** Research was reset and needs to be restarted */
  RESET = 'reset',
}

/**
 * Checks if a status represents an active research state.
 */
export function isActiveResearchStatus(status: ResearchStatus): boolean {
  return status === ResearchStatus.IN_PROGRESS;
}

/**
 * Checks if a status represents a completed research.
 */
export function isCompletedResearchStatus(status: ResearchStatus): boolean {
  return status === ResearchStatus.COMPLETED;
}

/**
 * Checks if a status represents a locked research.
 */
export function isLockedResearchStatus(status: ResearchStatus): boolean {
  return status === ResearchStatus.LOCKED;
}

/**
 * Checks if a status represents an available research.
 */
export function isAvailableResearchStatus(status: ResearchStatus): boolean {
  return status === ResearchStatus.AVAILABLE;
}

/**
 * Checks if a research can be started (available status).
 */
export function canStartResearch(status: ResearchStatus): boolean {
  return status === ResearchStatus.AVAILABLE;
}

/**
 * Checks if a research can be reset.
 */
export function canResetResearch(status: ResearchStatus): boolean {
  return status === ResearchStatus.COMPLETED || status === ResearchStatus.IN_PROGRESS;
}