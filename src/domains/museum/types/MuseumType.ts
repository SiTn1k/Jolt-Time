/**
 * Museum Type
 *
 * Type definitions for museum categorization.
 */

/**
 * Museum type classification.
 * Defines the overall museum style or category.
 */
export enum MuseumType {
  CLASSIC = 'classic',
  MODERN = 'modern',
  THEMED = 'themed',
}

/**
 * Valid museum type values.
 */
export const VALID_MUSEUM_TYPES: readonly MuseumType[] = [
  MuseumType.CLASSIC,
  MuseumType.MODERN,
  MuseumType.THEMED,
];

/**
 * Checks if a value is a valid MuseumType.
 */
export function isValidMuseumType(value: string): value is MuseumType {
  return Object.values(MuseumType).includes(value as MuseumType);
}
