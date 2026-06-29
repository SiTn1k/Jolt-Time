/**
 * Scheduler Domain Index
 *
 * Exports all scheduler domain public interfaces.
 */

// Value Objects
export {
  JobId,
  ExecutionId,
  DefinitionId,
} from './value-objects';

// Types
export type {
  ScheduleType,
  JobStatus,
  ExecutionStatus,
  SchedulerPriority,
  SchedulerJobMetadata,
  SchedulerExecutionMetadata,
  SchedulerDefinitionMetadata,
  SchedulerJobStatistics,
  SchedulerStatistics,
} from './types';

export {
  SCHEDULE_TYPE_DISPLAY,
  SCHEDULE_TYPE_DESCRIPTIONS,
  requiresCronExpression,
  requiresInterval,
  isTimeBasedSchedule,
  isDynamicSchedule,
  JOB_STATUS_DISPLAY,
  JOB_STATUS_COLORS,
  isActiveJobStatus,
  isTerminalJobStatus,
  isCancellableJobStatus,
  EXECUTION_STATUS_DISPLAY,
  EXECUTION_STATUS_COLORS,
  isActiveExecutionStatus,
  isTerminalExecutionStatus,
  isCancellableExecutionStatus,
  SCHEDULER_PRIORITY_DISPLAY,
  SCHEDULER_PRIORITY_VALUES,
  SCHEDULER_PRIORITY_COLORS,
  getPriorityValue,
  comparePriorities,
  isHigherPriority,
  DEFAULT_SCHEDULER_PRIORITY,
  createDefaultJobMetadata,
  createDefaultExecutionMetadata,
  createDefaultDefinitionMetadata,
  INITIAL_JOB_STATISTICS,
  INITIAL_SCHEDULER_STATISTICS,
} from './types';

// Entities
export {
  ScheduledJob,
  JobExecution,
  JobDefinition,
} from './entities';

export type {
  ScheduledJobProps,
  ScheduledJobRecord,
  ScheduledJobJSON,
  JobExecutionProps,
  JobExecutionRecord,
  JobExecutionJSON,
  JobDefinitionProps,
  JobDefinitionRecord,
  JobDefinitionJSON,
} from './entities';

// Interfaces
export type {
  IScheduledJob,
  IJobExecution,
  IJobDefinition,
  ISchedulerRepository,
  ScheduledJobFilterParams,
  JobExecutionFilterParams,
} from './interfaces';

// DTOs
export type {
  ScheduledJobDto,
  ScheduledJobListDto,
  CreateScheduledJobDto,
  UpdateScheduledJobDto,
  JobExecutionDto,
  JobExecutionListDto,
  JobExecutionStatisticsDto,
  JobDefinitionDto,
  JobDefinitionListDto,
  CreateJobDefinitionDto,
  UpdateJobDefinitionDto,
  SchedulerResponseDto,
  SchedulerHealthDto,
} from './dto';

export { toSchedulerResponseDto } from './dto';

// Validators
export {
  SchedulerValidator,
  ExecutionValidator,
  DefinitionValidator,
} from './validators';

export type {
  SchedulerValidationResult,
  ExecutionValidationResult,
  DefinitionValidationResult,
} from './validators';

// Mappers
export {
  SchedulerMapper,
  ExecutionMapper,
  DefinitionMapper,
} from './mappers';

// Events
export type {
  JobCreatedEvent,
  JobCreatedEventData,
  JobScheduledEvent,
  JobScheduledEventData,
  JobStartedEvent,
  JobStartedEventData,
  JobFinishedEvent,
  JobFinishedEventData,
  JobFailedEvent,
  JobFailedEventData,
} from './events';

export {
  createJobCreatedEvent,
  createJobScheduledEvent,
  createJobStartedEvent,
  createJobFinishedEvent,
  createJobFailedEvent,
} from './events';

// Repositories
export {
  SupabaseSchedulerRepository,
} from './repositories';

// DI
export {
  SCHEDULER_TOKENS,
  registerSchedulerDependencies,
  setupSchedulerDomain,
} from './di';
