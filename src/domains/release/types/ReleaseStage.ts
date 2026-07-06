/**
 * ReleaseStage Type
 *
 * Defines the release stage of the application.
 */

/**
 * Release stage values.
 */
export enum ReleaseStage {
  /** Support/legacy stage */
  SUPPORT = 'support',
  /** Internal alpha testing stage */
  INTERNAL_ALPHA = 'internal_alpha',
  /** Closed alpha testing stage */
  CLOSED_ALPHA = 'closed_alpha',
  /** Open alpha testing stage */
  OPEN_ALPHA = 'open_alpha',
  /** Release candidate stage */
  RELEASE_CANDIDATE = 'release_candidate',
  /** Production stage */
  PRODUCTION = 'production',
}

/**
 * Stage display names.
 */
export const RELEASE_STAGE_DISPLAY: Record<ReleaseStage, string> = {
  [ReleaseStage.SUPPORT]: 'Support',
  [ReleaseStage.INTERNAL_ALPHA]: 'Internal Alpha',
  [ReleaseStage.CLOSED_ALPHA]: 'Closed Alpha',
  [ReleaseStage.OPEN_ALPHA]: 'Open Alpha',
  [ReleaseStage.RELEASE_CANDIDATE]: 'Release Candidate',
  [ReleaseStage.PRODUCTION]: 'Production',
};

/**
 * Stage descriptions.
 */
export const RELEASE_STAGE_DESCRIPTIONS: Record<ReleaseStage, string> = {
  [ReleaseStage.SUPPORT]: 'Legacy support stage for deprecated versions',
  [ReleaseStage.INTERNAL_ALPHA]: 'Internal testing by development team',
  [ReleaseStage.CLOSED_ALPHA]: 'Testing with select external testers',
  [ReleaseStage.OPEN_ALPHA]: 'Public alpha testing',
  [ReleaseStage.RELEASE_CANDIDATE]: 'Feature complete, preparing for release',
  [ReleaseStage.PRODUCTION]: 'Production-ready stable release',
};

/**
 * Checks if a stage represents pre-release testing.
 */
export function isPreReleaseStage(stage: ReleaseStage): boolean {
  return (
    stage === ReleaseStage.INTERNAL_ALPHA ||
    stage === ReleaseStage.CLOSED_ALPHA ||
    stage === ReleaseStage.OPEN_ALPHA ||
    stage === ReleaseStage.RELEASE_CANDIDATE
  );
}

/**
 * Checks if a stage represents production-ready.
 */
export function isProductionStage(stage: ReleaseStage): boolean {
  return stage === ReleaseStage.PRODUCTION || stage === ReleaseStage.SUPPORT;
}
