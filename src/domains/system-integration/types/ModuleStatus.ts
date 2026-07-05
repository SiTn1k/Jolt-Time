/**
 * ModuleStatus Type
 *
 * Represents the current status of a system module.
 */

export type ModuleStatus = 
  | 'registered'  // Module has been registered
  | 'initializing' // Module is initializing
  | 'active'      // Module is active and running
  | 'degraded'    // Module is running but with reduced functionality
  | 'error'       // Module has encountered an error
  | 'stopped'     // Module has been stopped
  | 'unregistered'; // Module has been unregistered
