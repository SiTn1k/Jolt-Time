/**
 * ProductionStatus Type
 *
 * Defines the status of a production certification.
 */

/**
 * Production status values.
 */
export enum ProductionStatus {
  /** Not yet started */
  NOT_STARTED = 'not_started',
  /** In progress */
  IN_PROGRESS = 'in_progress',
  /** Ready for production */
  READY = 'ready',
  /** In production */
  IN_PRODUCTION = 'in_production',
  /** Production certified */
  CERTIFIED = 'certified',
  /** Certification failed */
  FAILED = 'failed',
}

/**
 * Status display names.
 */
export const PRODUCTION_STATUS_DISPLAY: Record<ProductionStatus, string> = {
  [ProductionStatus.NOT_STARTED]: 'Not Started',
  [ProductionStatus.IN_PROGRESS]: 'In Progress',
  [ProductionStatus.READY]: 'Ready',
  [ProductionStatus.IN_PRODUCTION]: 'In Production',
  [ProductionStatus.CERTIFIED]: 'Certified',
  [ProductionStatus.FAILED]: 'Failed',
};

/**
 * Checks if a status represents an active (non-terminal) state.
 */
export function isActiveProductionStatus(status: ProductionStatus): boolean {
  return status === ProductionStatus.NOT_STARTED || status === ProductionStatus.IN_PROGRESS;
}

/**
 * Checks if a status represents a completed certification.
 */
export function isCompletedProductionStatus(status: ProductionStatus): boolean {
  return status === ProductionStatus.CERTIFIED || status === ProductionStatus.READY;
}
