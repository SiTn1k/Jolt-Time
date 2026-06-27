/**
 * Achievement Events Index
 *
 * Exports all achievement domain events.
 */

export type { AchievementCreatedEvent, AchievementCreatedEventData } from './AchievementCreated.event';
export { createAchievementCreatedEvent } from './AchievementCreated.event';

export type { AchievementUnlockedEvent, AchievementUnlockedEventData } from './AchievementUnlocked.event';
export { createAchievementUnlockedEvent } from './AchievementUnlocked.event';

export type { AchievementCompletedEvent, AchievementCompletedEventData } from './AchievementCompleted.event';
export { createAchievementCompletedEvent } from './AchievementCompleted.event';

export type { AchievementClaimRequestedEvent, AchievementClaimRequestedEventData } from './AchievementClaimRequested.event';
export { createAchievementClaimRequestedEvent } from './AchievementClaimRequested.event';
