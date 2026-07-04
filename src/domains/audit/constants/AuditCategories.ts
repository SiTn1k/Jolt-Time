/**
 * Audit Categories
 *
 * Predefined audit categories for grouping audit records.
 * These categories are used to classify and filter audit events.
 */

import { AuditCategory } from '../entities/AuditCategory';

/**
 * Predefined audit categories.
 * Each category has a unique ID and description.
 */
export const AUDIT_CATEGORIES = {
  /**
   * Security-related audit events.
   * Includes authentication, authorization, and access control events.
   */
  SECURITY: AuditCategory.create({
    name: 'Security',
    description: 'Security-related audit events including authentication, authorization, and access control',
  }),

  /**
   * Administration-related audit events.
   * Includes admin actions, configuration changes, and system management.
   */
  ADMINISTRATION: AuditCategory.create({
    name: 'Administration',
    description: 'Administration-related audit events including admin actions and system management',
  }),

  /**
   * Economy-related audit events.
   * Includes currency operations, reward grants, and transaction events.
   */
  ECONOMY: AuditCategory.create({
    name: 'Economy',
    description: 'Economy-related audit events including currency operations and reward grants',
  }),

  /**
   * Gameplay-related audit events.
   * Includes player actions, quest completions, and achievement unlocks.
   */
  GAMEPLAY: AuditCategory.create({
    name: 'Gameplay',
    description: 'Gameplay-related audit events including player actions and quest completions',
  }),

  /**
   * Configuration-related audit events.
   * Includes config changes, feature flags, and settings modifications.
   */
  CONFIGURATION: AuditCategory.create({
    name: 'Configuration',
    description: 'Configuration-related audit events including config changes and settings modifications',
  }),

  /**
   * Scheduler-related audit events.
   * Includes scheduled job executions and cron events.
   */
  SCHEDULER: AuditCategory.create({
    name: 'Scheduler',
    description: 'Scheduler-related audit events including scheduled job executions and cron events',
  }),

  /**
   * Notification-related audit events.
   * Includes notification dispatches, delivery status, and user preferences.
   */
  NOTIFICATION: AuditCategory.create({
    name: 'Notification',
    description: 'Notification-related audit events including notification dispatches and delivery status',
  }),

  /**
   * Analytics-related audit events.
   * Includes analytics tracking, metrics collection, and reporting events.
   */
  ANALYTICS: AuditCategory.create({
    name: 'Analytics',
    description: 'Analytics-related audit events including metrics collection and reporting',
  }),

  /**
   * System-related audit events.
   * Includes system startup, shutdown, errors, and maintenance events.
   */
  SYSTEM: AuditCategory.create({
    name: 'System',
    description: 'System-related audit events including startup, shutdown, errors, and maintenance',
  }),
} as const;

/**
 * Type for all predefined audit categories.
 */
export type PredefinedAuditCategory = (typeof AUDIT_CATEGORIES)[keyof typeof AUDIT_CATEGORIES];

/**
 * Gets a category by its name.
 */
export function getAuditCategoryByName(name: string): AuditCategory | undefined {
  const categories = Object.values(AUDIT_CATEGORIES);
  return categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());
}

/**
 * Gets a category by its ID.
 */
export function getAuditCategoryById(categoryId: string): AuditCategory | undefined {
  const categories = Object.values(AUDIT_CATEGORIES);
  return categories.find((cat) => cat.categoryId.value === categoryId);
}

/**
 * Gets all predefined audit categories.
 */
export function getAllAuditCategories(): AuditCategory[] {
  return Object.values(AUDIT_CATEGORIES);
}
