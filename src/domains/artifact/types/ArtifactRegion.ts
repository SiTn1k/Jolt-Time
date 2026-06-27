/**
 * Artifact Region Type
 *
 * Defines the geographical/cultural region of origin for an artifact.
 */

/**
 * Geographical and cultural regions for artifact classification.
 */
export enum ArtifactRegion {
  MESOPOTAMIA = 'mesopotamia',
  EGYPT = 'egypt',
  GREECE = 'greece',
  ROME = 'rome',
  CHINA = 'china',
  JAPAN = 'japan',
  PERSIA = 'persia',
  BYZANTINE = 'byzantine',
  MEDIEVAL_EUROPE = 'medieval_europe',
  ISLAMIC_WORLD = 'islamic_world',
  PRECOLUMBIAN_AMERICAS = 'precolumbian_americas',
  SUB_SAHARAN_AFRICA = 'sub_saharan_africa',
  SOUTH_ASIA = 'south_asia',
  SOUTHEAST_ASIA = 'southeast_asia',
  OCEANIA = 'oceania',
  WESTERN_EUROPE = 'western_europe',
  EASTERN_EUROPE = 'eastern_europe',
  NORTH_AMERICA = 'north_america',
  SOUTH_AMERICA = 'south_america',
  GLOBAL = 'global',
}

/**
 * Display labels for artifact regions.
 */
export const ARTIFACT_REGION_LABELS: Record<ArtifactRegion, string> = {
  [ArtifactRegion.MESOPOTAMIA]: 'Mesopotamia',
  [ArtifactRegion.EGYPT]: 'Egypt',
  [ArtifactRegion.GREECE]: 'Greece',
  [ArtifactRegion.ROME]: 'Rome',
  [ArtifactRegion.CHINA]: 'China',
  [ArtifactRegion.JAPAN]: 'Japan',
  [ArtifactRegion.PERSIA]: 'Persia',
  [ArtifactRegion.BYZANTINE]: 'Byzantine',
  [ArtifactRegion.MEDIEVAL_EUROPE]: 'Medieval Europe',
  [ArtifactRegion.ISLAMIC_WORLD]: 'Islamic World',
  [ArtifactRegion.PRECOLUMBIAN_AMERICAS]: 'Pre-Columbian Americas',
  [ArtifactRegion.SUB_SAHARAN_AFRICA]: 'Sub-Saharan Africa',
  [ArtifactRegion.SOUTH_ASIA]: 'South Asia',
  [ArtifactRegion.SOUTHEAST_ASIA]: 'Southeast Asia',
  [ArtifactRegion.OCEANIA]: 'Oceania',
  [ArtifactRegion.WESTERN_EUROPE]: 'Western Europe',
  [ArtifactRegion.EASTERN_EUROPE]: 'Eastern Europe',
  [ArtifactRegion.NORTH_AMERICA]: 'North America',
  [ArtifactRegion.SOUTH_AMERICA]: 'South America',
  [ArtifactRegion.GLOBAL]: 'Global',
} as const;

/**
 * Validates if a value is a valid ArtifactRegion.
 */
export function isArtifactRegion(value: unknown): value is ArtifactRegion {
  return Object.values(ArtifactRegion).includes(value as ArtifactRegion);
}