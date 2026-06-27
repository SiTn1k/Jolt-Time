/**
 * Hall Type
 *
 * Type definitions for museum hall categorization.
 */

/**
 * Hall type classification based on historical eras.
 * Organized by historical period for educational display.
 */
export enum HallType {
  ANCIENT = 'ancient',
  CLASSICAL = 'classical',
  MEDIEVAL = 'medieval',
  RENAISSANCE = 'renaissance',
  INDUSTRIAL = 'industrial',
  MODERN = 'modern',
  FUTURE = 'future',
  SPECIAL = 'special',
}

/**
 * Valid hall type values.
 */
export const VALID_HALL_TYPES: readonly HallType[] = [
  HallType.ANCIENT,
  HallType.CLASSICAL,
  HallType.MEDIEVAL,
  HallType.RENAISSANCE,
  HallType.INDUSTRIAL,
  HallType.MODERN,
  HallType.FUTURE,
  HallType.SPECIAL,
];

/**
 * Hall type metadata for display purposes.
 */
export interface HallTypeMetadata {
  id: HallType;
  name: string;
  description: string;
  icon: string;
  defaultCapacity: number;
}

/**
 * Hall type metadata registry.
 */
export const HALL_TYPE_METADATA: Record<HallType, HallTypeMetadata> = {
  [HallType.ANCIENT]: {
    id: HallType.ANCIENT,
    name: 'Ancient Era',
    description: 'Artifacts from 3500 BCE to 500 BCE',
    icon: '🏺',
    defaultCapacity: 12,
  },
  [HallType.CLASSICAL]: {
    id: HallType.CLASSICAL,
    name: 'Classical Era',
    description: 'Artifacts from 500 BCE to 500 CE',
    icon: '🏛️',
    defaultCapacity: 15,
  },
  [HallType.MEDIEVAL]: {
    id: HallType.MEDIEVAL,
    name: 'Medieval Era',
    description: 'Artifacts from 500 CE to 1400 CE',
    icon: '⚔️',
    defaultCapacity: 12,
  },
  [HallType.RENAISSANCE]: {
    id: HallType.RENAISSANCE,
    name: 'Renaissance Era',
    description: 'Artifacts from 1400 CE to 1700 CE',
    icon: '🎨',
    defaultCapacity: 12,
  },
  [HallType.INDUSTRIAL]: {
    id: HallType.INDUSTRIAL,
    name: 'Industrial Era',
    description: 'Artifacts from 1700 CE to 1900 CE',
    icon: '⚙️',
    defaultCapacity: 10,
  },
  [HallType.MODERN]: {
    id: HallType.MODERN,
    name: 'Modern Era',
    description: 'Artifacts from 1900 CE to 2000 CE',
    icon: '🚀',
    defaultCapacity: 10,
  },
  [HallType.FUTURE]: {
    id: HallType.FUTURE,
    name: 'Future Era',
    description: 'Artifacts from 2000 CE onwards',
    icon: '🔮',
    defaultCapacity: 5,
  },
  [HallType.SPECIAL]: {
    id: HallType.SPECIAL,
    name: 'Special Exhibits',
    description: 'Temporary and special collections',
    icon: '✨',
    defaultCapacity: 8,
  },
};

/**
 * Checks if a value is a valid HallType.
 */
export function isValidHallType(value: string): value is HallType {
  return Object.values(HallType).includes(value as HallType);
}
