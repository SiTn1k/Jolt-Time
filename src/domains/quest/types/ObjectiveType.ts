/**
 * Objective Type
 *
 * Defines the type of objective a quest requires.
 */

/**
 * Objective type values.
 */
export enum ObjectiveType {
  /** Collect specific items or artifacts */
  COLLECT = 'collect',
  /** Win battles against opponents */
  BATTLE_WIN = 'battle_win',
  /** Complete any battle */
  BATTLE_COMPLETE = 'battle_complete',
  /** Watch an advertisement */
  WATCH_AD = 'watch_ad',
  /** Visit or explore a specific era */
  VISIT_ERA = 'visit_era',
  /** Level up an artifact */
  LEVEL_UP_ARTIFACT = 'level_up_artifact',
  /** Enhance or upgrade an artifact */
  ENHANCE_ARTIFACT = 'enhance_artifact',
  /** Complete an expedition */
  COMPLETE_EXPEDITION = 'complete_expedition',
  /** Display artifact in museum */
  DISPLAY_ARTIFACT = 'display_artifact',
  /** View artifacts in museum */
  VIEW_ARTIFACT = 'view_artifact',
  /** Complete research in academy */
  COMPLETE_RESEARCH = 'complete_research',
  /** Perform any game action */
  PLAY_GAME = 'play_game',
  /** Log in to the game */
  DAILY_LOGIN = 'daily_login',
  /** Reach a total power threshold */
  REACH_POWER = 'reach_power',
  /** Complete a set of artifacts */
  COMPLETE_SET = 'complete_set',
  /** Participate in PvP */
  PVP_PARTICIPATE = 'pvp_participate',
  /** Complete specific quest */
  COMPLETE_QUEST = 'complete_quest',
  /** Accumulate currency */
  ACCUMULATE_CURRENCY = 'accumulate_currency',
}

/**
 * Objective type display names.
 */
export const OBJECTIVE_TYPE_DISPLAY: Record<ObjectiveType, string> = {
  [ObjectiveType.COLLECT]: 'Collect Items',
  [ObjectiveType.BATTLE_WIN]: 'Win Battles',
  [ObjectiveType.BATTLE_COMPLETE]: 'Complete Battles',
  [ObjectiveType.WATCH_AD]: 'Watch Ads',
  [ObjectiveType.VISIT_ERA]: 'Visit Era',
  [ObjectiveType.LEVEL_UP_ARTIFACT]: 'Level Up Artifact',
  [ObjectiveType.ENHANCE_ARTIFACT]: 'Enhance Artifact',
  [ObjectiveType.COMPLETE_EXPEDITION]: 'Complete Expedition',
  [ObjectiveType.DISPLAY_ARTIFACT]: 'Display Artifact',
  [ObjectiveType.VIEW_ARTIFACT]: 'View Artifact',
  [ObjectiveType.COMPLETE_RESEARCH]: 'Complete Research',
  [ObjectiveType.PLAY_GAME]: 'Play Game',
  [ObjectiveType.DAILY_LOGIN]: 'Daily Login',
  [ObjectiveType.REACH_POWER]: 'Reach Power',
  [ObjectiveType.COMPLETE_SET]: 'Complete Set',
  [ObjectiveType.PVP_PARTICIPATE]: 'PvP Participate',
  [ObjectiveType.COMPLETE_QUEST]: 'Complete Quest',
  [ObjectiveType.ACCUMULATE_CURRENCY]: 'Accumulate Currency',
};

/**
 * Checks if objective type requires a target identifier.
 */
export function requiresTargetIdentifier(type: ObjectiveType): boolean {
  return [
    ObjectiveType.COLLECT,
    ObjectiveType.VISIT_ERA,
    ObjectiveType.LEVEL_UP_ARTIFACT,
    ObjectiveType.ENHANCE_ARTIFACT,
    ObjectiveType.COMPLETE_EXPEDITION,
    ObjectiveType.DISPLAY_ARTIFACT,
    ObjectiveType.VIEW_ARTIFACT,
    ObjectiveType.COMPLETE_RESEARCH,
    ObjectiveType.COMPLETE_QUEST,
  ].includes(type);
}
