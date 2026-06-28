/**
 * Event Source Types
 *
 * Defines the possible sources of domain events.
 */

/**
 * Event source enumeration.
 */
export enum EventSource {
  /** Player Profile domain */
  PLAYER_PROFILE = 'PLAYER_PROFILE',

  /** User domain */
  USER = 'USER',

  /** Currency domain */
  CURRENCY = 'CURRENCY',

  /** Inventory domain */
  INVENTORY = 'INVENTORY',

  /** Artifact domain */
  ARTIFACT = 'ARTIFACT',

  /** Museum domain */
  MUSEUM = 'MUSEUM',

  /** Academy domain */
  ACADEMY = 'ACADEMY',

  /** Quest domain */
  QUEST = 'QUEST',

  /** Achievement domain */
  ACHIEVEMENT = 'ACHIEVEMENT',

  /** Guild domain */
  GUILD = 'GUILD',

  /** Game State domain */
  GAME_STATE = 'GAME_STATE',

  /** Reward Engine domain */
  REWARD = 'REWARD',

  /** Event Bus internal events */
  EVENT_BUS = 'EVENT_BUS',

  /** Unknown source */
  UNKNOWN = 'UNKNOWN',
}