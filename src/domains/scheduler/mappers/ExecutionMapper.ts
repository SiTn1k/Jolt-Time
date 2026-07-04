/**
 * Execution Mapper
 *
 * Maps between JobExecution entity and DTOs.
 * No execution logic - pure transformation only.
 */

import type { JobExecution } from '../entities/JobExecution';
import type { JobExecutionRecord } from '../entities/JobExecution';
import type {
  JobExecutionDto,
  JobExecutionListDto,
  JobExecutionStatisticsDto,
} from '../dto/JobExecutionDto';

/**
 * Mapper for converting between JobExecution entity and DTOs.
 */
export class ExecutionMapper {
  /**
   * Converts a JobExecution entity to JobExecutionDto.
   */
  public static toDto(execution: JobExecution): JobExecutionDto {
    return {
      executionId: execution.executionId.value,
      jobId: execution.jobId.value,
      startedAt: execution.startedAt.toISOString(),
      finishedAt: execution.finishedAt?.toISOString(),
      duration: execution.duration,
      status: execution.status,
      errorMessage: execution.errorMessage,
      metadata: execution.metadata,
    };
  }

  /**
   * Converts a JobExecution entity to a database record format.
   */
  public static toRecord(execution: JobExecution): JobExecutionRecord {
    return execution.toRecord();
  }

  /**
   * Converts a database record to JobExecutionDto.
   */
  public static fromRecordToDto(record: JobExecutionRecord): JobExecutionDto {
    return {
      executionId: record.execution_id,
      jobId: record.job_id,
      startedAt: record.started_at,
      finishedAt: record.finished_at,
      duration: record.duration,
      status: record.status,
      errorMessage: record.error_message,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of JobExecution entities to JobExecutionListDto.
   */
  public static toListDto(
    executions: JobExecution[],
    total: number,
    page: number,
    pageSize: number
  ): JobExecutionListDto {
    return {
      executions: executions.map((exec) => this.toDto(exec)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts execution history to statistics DTO.
   */
  public static toStatisticsDto(executions: JobExecution[]): JobExecutionStatisticsDto {
    const total = executions.length;
    const successful = executions.filter((e) => e.status === 'success').length;
    const failed = executions.filter((e) => e.status === 'failed').length;
    const durations = executions.filter((e) => e.duration !== undefined).map((e) => e.duration!);
    const averageDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;

    const sorted = [...executions].sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    const lastExecutedAt = sorted[0]?.startedAt.toISOString();
    const lastSuccessful = sorted.find((e) => e.status === 'success');
    const lastSuccessfulAt = lastSuccessful?.startedAt.toISOString();
    const lastFailed = sorted.find((e) => e.status === 'failed');
    const lastFailedAt = lastFailed?.startedAt.toISOString();

    return {
      totalExecutions: total,
      successfulExecutions: successful,
      failedExecutions: failed,
      averageDurationMs: Math.round(averageDuration),
      lastExecutedAt,
      lastSuccessfulAt,
      lastFailedAt,
    };
  }
}
