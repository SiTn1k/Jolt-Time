/**
 * DependencyStatus Type
 *
 * Represents the status of a module dependency.
 */

export type DependencyStatus = 
  | 'satisfied'   // Dependency is satisfied and available
  | 'unsatisfied' // Dependency is not satisfied
  | 'optional';   // Dependency is optional
