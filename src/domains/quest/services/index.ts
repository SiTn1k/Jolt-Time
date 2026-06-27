/**
 * Quest Services Index
 *
 * Exports all quest domain services.
 */

export { QuestService, createQuestService, type IQuestService } from './QuestService';
export {
  QuestInitializationService,
  createQuestInitializationService,
  type IQuestInitializationService,
  DEFAULT_STARTER_QUESTS,
  type StarterQuestConfig,
} from './QuestInitializationService';
export {
  ObjectiveTrackingService,
  createObjectiveTrackingService,
  type IObjectiveTrackingService,
  type ObjectiveProgressEvent,
  type ObjectiveCompletionResult,
  OBJECTIVE_HANDLERS,
} from './ObjectiveTrackingService';