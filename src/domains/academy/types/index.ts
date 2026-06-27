/**
 * Academy Types Index
 *
 * Exports all academy domain types.
 */

export { ResearchCategory, RESEARCH_CATEGORY_INFO, getResearchCategoryDisplayName, getResearchCategoryDescription } from './ResearchCategory';

export { ResearchStatus, isActiveResearchStatus, isCompletedResearchStatus, isLockedResearchStatus, isAvailableResearchStatus, canStartResearch, canResetResearch } from './ResearchStatus';

export { ResearchTier, RESEARCH_TIER_INFO, getResearchTierDisplayName, getResearchTierMinLevel, isValidResearchTier } from './ResearchTier';

export { UnlockType, requiresPrerequisites, requiresResources } from './UnlockType';

export type { AcademyMetadata, ResearchNodeMetadata } from './AcademyMetadata';
export { createDefaultAcademyMetadata } from './AcademyMetadata';

export type { AcademyStatistics } from './AcademyStatistics';
export { createInitialAcademyStatistics, INITIAL_ACADEMY_STATISTICS } from './AcademyStatistics';