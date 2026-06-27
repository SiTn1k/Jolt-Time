/**
 * Game State Types
 *
 * Exports all types for the game-state domain.
 */

export { OnlineStatus, isOnline, isInGame } from './OnlineStatus';
export { SessionState, isActiveSession, isTransitionalSession } from './SessionState';
export { GameScene, isGameplayScene, isMenuScene } from './GameScene';
export { 
  createDefaultGameStateMetadata,
  INITIAL_GAME_STATE_METADATA,
} from './GameStateMetadata';
export type { GameStateMetadata } from './GameStateMetadata';