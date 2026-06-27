/**
 * Achievement Services Index
 *
 * Exports all achievement domain services.
 */

export { AchievementService, createAchievementService, type IAchievementService } from './AchievementService';
export { 
  AchievementEventProcessor, 
  createAchievementEventProcessor, 
  type IAchievementEventProcessor,
  type AchievementEventType,
  type AchievementDomainEvent,
} from './AchievementEventProcessor';
