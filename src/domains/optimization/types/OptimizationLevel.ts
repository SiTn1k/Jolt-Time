/**
 * Optimization Level
 *
 * Defines the urgency/priority levels for optimization actions.
 */

export enum OptimizationLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

/**
 * Constraints for optimization level values.
 */
export const OPTIMIZATION_LEVEL_CONSTRAINTS = {
  MAX_LEVEL_LENGTH: 20,
} as const;
