/**
 * Online Status Type
 *
 * Represents the player's online/connection status in the game.
 */

/**
 * Player online status enumeration.
 */
export enum OnlineStatus {
  /** Player is offline */
  OFFLINE = 'offline',
  
  /** Player is online and active */
  ONLINE = 'online',
  
  /** Player is online but idle (no recent activity) */
  IDLE = 'idle',
  
  /** Player is in a game session */
  IN_SESSION = 'in_session',
  
  /** Player is in a match/multiplayer game */
  IN_MATCH = 'in_match',
}

/**
 * Checks if an online status represents an active state.
 */
export function isOnline(status: OnlineStatus): boolean {
  return status !== OnlineStatus.OFFLINE;
}

/**
 * Checks if an online status represents an in-game state.
 */
export function isInGame(status: OnlineStatus): boolean {
  return status === OnlineStatus.IN_SESSION || status === OnlineStatus.IN_MATCH;
}