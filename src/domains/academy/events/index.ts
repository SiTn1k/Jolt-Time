/**
 * Academy Events Index
 *
 * Exports all academy domain events.
 */

export type { AcademyCreatedEvent, AcademyCreatedEventData } from './AcademyCreated.event';
export { createAcademyCreatedEvent } from './AcademyCreated.event';

export type { ResearchStartedEvent, ResearchStartedEventData } from './ResearchStarted.event';
export { createResearchStartedEvent } from './ResearchStarted.event';

export type { ResearchCompletedEvent, ResearchCompletedEventData } from './ResearchCompleted.event';
export { createResearchCompletedEvent } from './ResearchCompleted.event';

export type { ResearchResetEvent, ResearchResetEventData } from './ResearchReset.event';
export { createResearchResetEvent } from './ResearchReset.event';