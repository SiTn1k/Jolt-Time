/**
 * Session State Type
 *
 * Represents the state of a player's current gaming session.
 */

/**
 * Session state enumeration.
 */
export enum SessionState {
  /** No active session */
  NONE = 'none',
  
  /** Session is starting/loading */
  STARTING = 'starting',
  
  /** Session is active and gameplay is in progress */
  ACTIVE = 'active',
  
  /** Session is paused */
  PAUSED = 'paused',
  
  /** Session has ended normally */
  ENDED = 'ended',
  
  /** Session was interrupted/disconnected */
  INTERRUPTED = 'interrupted',
}

/**
 * Checks if a session state represents an active playable state.
 */
export function isActiveSession(state: SessionState): boolean {
  return state === SessionState.ACTIVE;
}

/**
 * Checks if a session state represents a transitional state.
 */
export function isTransitionalSession(state: SessionState): boolean {
  return state === SessionState.STARTING || state === SessionState.ENDED || state === SessionState.INTERRUPTED;
}