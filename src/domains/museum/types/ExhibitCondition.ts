/**
 * Exhibit Condition
 *
 * Condition states for museum exhibits.
 */

/**
 * Exhibit condition status.
 */
export enum ExhibitCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  RESTORATION_NEEDED = 'restoration_needed',
}

/**
 * Valid exhibit condition values.
 */
export const VALID_EXHIBIT_CONDITIONS: readonly ExhibitCondition[] = [
  ExhibitCondition.EXCELLENT,
  ExhibitCondition.GOOD,
  ExhibitCondition.FAIR,
  ExhibitCondition.POOR,
  ExhibitCondition.RESTORATION_NEEDED,
];

/**
 * Exhibit condition metadata.
 */
export interface ExhibitConditionMetadata {
  id: ExhibitCondition;
  name: string;
  description: string;
  color: string;
  affectsPopularity: boolean;
}

/**
 * Exhibit condition metadata registry.
 */
export const EXHIBIT_CONDITION_METADATA: Record<ExhibitCondition, ExhibitConditionMetadata> = {
  [ExhibitCondition.EXCELLENT]: {
    id: ExhibitCondition.EXCELLENT,
    name: 'Excellent',
    description: 'Exhibit is in pristine condition',
    color: '#00D9FF',
    affectsPopularity: false,
  },
  [ExhibitCondition.GOOD]: {
    id: ExhibitCondition.GOOD,
    name: 'Good',
    description: 'Exhibit is in good condition',
    color: '#22C55E',
    affectsPopularity: false,
  },
  [ExhibitCondition.FAIR]: {
    id: ExhibitCondition.FAIR,
    name: 'Fair',
    description: 'Exhibit shows some wear',
    color: '#F59E0B',
    affectsPopularity: true,
  },
  [ExhibitCondition.POOR]: {
    id: ExhibitCondition.POOR,
    name: 'Poor',
    description: 'Exhibit requires attention',
    color: '#EF4444',
    affectsPopularity: true,
  },
  [ExhibitCondition.RESTORATION_NEEDED]: {
    id: ExhibitCondition.RESTORATION_NEEDED,
    name: 'Restoration Needed',
    description: 'Exhibit needs restoration',
    color: '#DC2626',
    affectsPopularity: true,
  },
};

/**
 * Checks if a value is a valid ExhibitCondition.
 */
export function isValidExhibitCondition(value: string): value is ExhibitCondition {
  return Object.values(ExhibitCondition).includes(value as ExhibitCondition);
}

/**
 * Checks if a condition affects popularity.
 */
export function conditionAffectsPopularity(condition: ExhibitCondition): boolean {
  return EXHIBIT_CONDITION_METADATA[condition]?.affectsPopularity ?? false;
}
