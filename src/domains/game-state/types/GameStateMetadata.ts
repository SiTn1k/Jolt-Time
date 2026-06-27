/**
 * Game State Metadata Type
 *
 * Metadata for tracking game state changes and modifications.
 */

/**
 * Initial metadata values for a new game state.
 */
export const INITIAL_GAME_STATE_METADATA: GameStateMetadata = {
  modifiedVia: 'creation',
  sessionCount: 0,
  totalPlayTimeSeconds: 0,
};

/**
 * Game state metadata interface.
 */
export interface GameStateMetadata {
  /** How the state was last modified (e.g., 'gameplay', 'tutorial', 'creation') */
  modifiedVia: string;
  
  /** Number of sessions played */
  sessionCount: number;
  
  /** Total play time in seconds */
  totalPlayTimeSeconds: number;
  
  /** Last scene before current */
  previousScene?: string;
  
  /** Session start timestamp */
  sessionStartTime?: string;
  
  /** Energy last regenerated at */
  lastEnergyRegenAt?: string;
  
  /** Health last regenerated at */
  lastHealthRegenAt?: string;
}

/**
 * Creates a default game state metadata.
 */
export function createDefaultGameStateMetadata(): GameStateMetadata {
  return { ...INITIAL_GAME_STATE_METADATA };
}