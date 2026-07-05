/**
 * IntegrationStatus Type
 *
 * Represents the overall status of the system integration.
 */

export type IntegrationStatus = 
  | 'unknown'        // Initial unknown state
  | 'initializing'   // System is initializing
  | 'healthy'        // All modules healthy
  | 'degraded'       // Some modules degraded
  | 'partial_failure' // Some modules failed
  | 'critical_failure'; // Critical failure state
