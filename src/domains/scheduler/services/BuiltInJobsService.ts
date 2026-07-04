/**
 * Built-in Jobs Service
 *
 * Provides built-in system jobs that publish events.
 * These jobs ONLY publish events - they do NOT modify economy, inventory,
 * player state, or any other game data directly.
 *
 * Business logic handlers should listen to these events and perform
 * the actual game modifications.
 */

import type { ScheduledJob } from '../entities/ScheduledJob';
import type { JobHandler, JobExecutionContext, JobExecutionResult } from './JobExecutorService';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('BuiltInJobsService');

/**
 * Built-in job event types.
 */
export type BuiltInJobEventType =
  | 'DAILY_REWARD_TRIGGER'
  | 'DAILY_RESET_TRIGGER'
  | 'WEEKLY_RESET_TRIGGER'
  | 'MONTHLY_RESET_TRIGGER'
  | 'CONFIGURATION_REFRESH'
  | 'ANALYTICS_CLEANUP'
  | 'NOTIFICATION_CLEANUP'
  | 'SYSTEM_MAINTENANCE';

/**
 * Event payload for built-in jobs.
 */
export interface BuiltInJobEvent {
  type: BuiltInJobEventType;
  timestamp: string;
  jobKey: string;
  executionId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Event handler for built-in job events.
 */
export type BuiltInJobEventHandler = (event: BuiltInJobEvent) => void | Promise<void>;

/**
 * Built-in job definitions.
 */
export interface BuiltInJobDefinition {
  key: string;
  name: string;
  description: string;
  scheduleType: import('../types/ScheduleType').ScheduleType;
  cronExpression?: string;
  intervalMs?: number;
  priority: import('../types/SchedulerPriority').SchedulerPriority;
}

/**
 * Built-in Jobs Service
 * Manages built-in system jobs that only publish events.
 */
export class BuiltInJobsService {
  private eventHandlers: Map<BuiltInJobEventType, BuiltInJobEventHandler[]> = new Map();
  private registeredJobs: Map<string, boolean> = new Map();

  /**
   * Built-in job definitions.
   */
  public static readonly BUILT_IN_JOBS: BuiltInJobDefinition[] = [
    {
      key: 'system.daily_reward_trigger',
      name: 'Daily Reward Trigger',
      description: 'Triggers daily reward eligibility check for all players',
      scheduleType: 'daily',
      cronExpression: '0 0 * * *', // Midnight every day
      priority: 'high',
    },
    {
      key: 'system.daily_reset',
      name: 'Daily Reset',
      description: 'Triggers daily reset of quests, energy, and other daily mechanics',
      scheduleType: 'daily',
      cronExpression: '0 0 * * *', // Midnight every day
      priority: 'critical',
    },
    {
      key: 'system.weekly_reset',
      name: 'Weekly Reset',
      description: 'Triggers weekly reset of weekly quests and rewards',
      scheduleType: 'weekly',
      cronExpression: '0 0 * * 0', // Sunday midnight
      priority: 'high',
    },
    {
      key: 'system.monthly_reset',
      name: 'Monthly Reset',
      description: 'Triggers monthly reset of monthly rewards and statistics',
      scheduleType: 'monthly',
      cronExpression: '0 0 1 * *', // First day of month at midnight
      priority: 'high',
    },
    {
      key: 'system.config_refresh',
      name: 'Configuration Refresh',
      description: 'Refreshes cached configuration from database',
      scheduleType: 'interval',
      intervalMs: 300000, // 5 minutes
      priority: 'normal',
    },
    {
      key: 'system.analytics_cleanup',
      name: 'Analytics Cleanup',
      description: 'Cleans up old analytics data',
      scheduleType: 'daily',
      cronExpression: '0 3 * * *', // 3 AM every day
      priority: 'low',
    },
    {
      key: 'system.notification_cleanup',
      name: 'Notification Cleanup',
      description: 'Cleans up old notifications and notification cooldowns',
      scheduleType: 'daily',
      cronExpression: '0 4 * * *', // 4 AM every day
      priority: 'low',
    },
    {
      key: 'system.maintenance',
      name: 'System Maintenance',
      description: 'Performs system maintenance tasks',
      scheduleType: 'daily',
      cronExpression: '0 2 * * *', // 2 AM every day
      priority: 'normal',
    },
  ];

  /**
   * Registers an event handler for a built-in job event.
   */
  public onEvent(type: BuiltInJobEventType, handler: BuiltInJobEventHandler): void {
    const handlers = this.eventHandlers.get(type) ?? [];
    handlers.push(handler);
    this.eventHandlers.set(type, handlers);
  }

  /**
   * Removes an event handler.
   */
  public offEvent(type: BuiltInJobEventType, handler: BuiltInJobEventHandler): void {
    const handlers = this.eventHandlers.get(type) ?? [];
    this.eventHandlers.set(type, handlers.filter((h) => h !== handler));
  }

  /**
   * Gets all built-in job definitions.
   */
  public getBuiltInJobs(): BuiltInJobDefinition[] {
    return [...BuiltInJobsService.BUILT_IN_JOBS];
  }

  /**
   * Gets a built-in job definition by key.
   */
  public getBuiltInJob(key: string): BuiltInJobDefinition | undefined {
    return BuiltInJobsService.BUILT_IN_JOBS.find((job) => job.key === key);
  }

  /**
   * Checks if a job key is a built-in job.
   */
  public isBuiltInJob(key: string): boolean {
    return this.registeredJobs.has(key);
  }

  /**
   * Creates a handler for a built-in job.
   */
  public createHandler(jobKey: string): JobHandler {
    return async (context: JobExecutionContext): Promise<JobExecutionResult> => {
      try {
        const eventType = this.getEventTypeForJobKey(jobKey);
        const event: BuiltInJobEvent = {
          type: eventType,
          timestamp: new Date().toISOString(),
          jobKey,
          executionId: context.execution.executionId.value,
          metadata: context.metadata,
        };

        await this.emitEvent(event);

        logger.info('Built-in job executed', {
          jobKey,
          eventType,
          executionId: context.execution.executionId.value,
        });

        return { success: true };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Built-in job failed', err as Error, { jobKey });
        return { success: false, errorMessage };
      }
    };
  }

  /**
   * Emits an event to all registered handlers.
   */
  private async emitEvent(event: BuiltInJobEvent): Promise<void> {
    const handlers = this.eventHandlers.get(event.type) ?? [];

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        logger.error('Error in built-in job event handler', err as Error, {
          eventType: event.type,
          handler: handler.name,
        });
      }
    }

    logger.debug('Built-in job event emitted', {
      eventType: event.type,
      handlerCount: handlers.length,
    });
  }

  /**
   * Maps job keys to event types.
   */
  private getEventTypeForJobKey(jobKey: string): BuiltInJobEventType {
    const mapping: Record<string, BuiltInJobEventType> = {
      'system.daily_reward_trigger': 'DAILY_REWARD_TRIGGER',
      'system.daily_reset': 'DAILY_RESET_TRIGGER',
      'system.weekly_reset': 'WEEKLY_RESET_TRIGGER',
      'system.monthly_reset': 'MONTHLY_RESET_TRIGGER',
      'system.config_refresh': 'CONFIGURATION_REFRESH',
      'system.analytics_cleanup': 'ANALYTICS_CLEANUP',
      'system.notification_cleanup': 'NOTIFICATION_CLEANUP',
      'system.maintenance': 'SYSTEM_MAINTENANCE',
    };

    return mapping[jobKey] ?? 'SYSTEM_MAINTENANCE';
  }
}

// Singleton instance
let builtInJobsInstance: BuiltInJobsService | null = null;

/**
 * Gets the built-in jobs service singleton.
 */
export function getBuiltInJobsService(): BuiltInJobsService {
  if (!builtInJobsInstance) {
    builtInJobsInstance = new BuiltInJobsService();
  }
  return builtInJobsInstance;
}
