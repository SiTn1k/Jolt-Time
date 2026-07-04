/**
 * Execution Queue Service
 *
 * Memory-based priority queue for job executions.
 * Supports priority queue, sequential execution, parallel-safe execution,
 * duplicate protection, and queue statistics.
 *
 * NOTE: This is a memory-only implementation. For production distributed
 * systems, consider using Redis, BullMQ, RabbitMQ, or Kafka.
 */

import type { ScheduledJob } from '../entities/ScheduledJob';
import type { JobExecution } from '../entities/JobExecution';
import type { SchedulerPriority } from '../types/SchedulerPriority';
import { getPriorityValue } from '../types/SchedulerPriority';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('ExecutionQueueService');

/**
 * Queue item representing a job execution request.
 */
export interface QueueItem {
  id: string;
  job: ScheduledJob;
  execution: JobExecution;
  priority: number;
  addedAt: Date;
  scheduledAt?: Date;
  context?: Record<string, unknown>;
}

/**
 * Queue statistics.
 */
export interface QueueStatistics {
  totalItems: number;
  pendingItems: number;
  runningItems: number;
  completedItems: number;
  failedItems: number;
  averageWaitTimeMs: number;
  averageExecutionTimeMs: number;
}

/**
 * Queue configuration.
 */
export interface QueueConfig {
  maxConcurrent: number;
  maxQueueSize: number;
  defaultPriority: SchedulerPriority;
}

/**
 * Default queue configuration.
 */
export const DEFAULT_QUEUE_CONFIG: QueueConfig = {
  maxConcurrent: 5,
  maxQueueSize: 1000,
  defaultPriority: 'normal',
};

/**
 * Execution Queue Service
 * Memory-based priority queue for job executions.
 */
export class ExecutionQueueService {
  private readonly queue: QueueItem[] = [];
  private readonly running: Map<string, QueueItem> = new Map();
  private readonly completed: Map<string, QueueItem> = new Map();
  private readonly failed: Map<string, QueueItem> = new Map();
  private readonly processedIds: Set<string> = new Set();
  private config: QueueConfig;
  private isProcessing = false;

  /**
   * Creates a new ExecutionQueueService instance.
   */
  constructor(config?: Partial<QueueConfig>) {
    this.config = { ...DEFAULT_QUEUE_CONFIG, ...config };
  }

  /**
   * Updates the queue configuration.
   */
  public setConfig(config: Partial<QueueConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('Queue configuration updated', { config: this.config });
  }

  /**
   * Gets the current queue configuration.
   */
  public getConfig(): QueueConfig {
    return { ...this.config };
  }

  /**
   * Adds an item to the queue.
   */
  public enqueue(item: QueueItem): boolean {
    // Check queue size limit
    if (this.queue.length >= this.config.maxQueueSize) {
      logger.warn('Queue is full, rejecting item', {
        queueSize: this.queue.length,
        maxSize: this.config.maxQueueSize,
        jobKey: item.job.jobKey,
      });
      return false;
    }

    // Check for duplicate
    if (this.processedIds.has(item.id)) {
      logger.debug('Duplicate item rejected', { itemId: item.id });
      return false;
    }

    // Add to queue based on priority
    const insertIndex = this.queue.findIndex((existing) => existing.priority < item.priority);
    if (insertIndex === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(insertIndex, 0, item);
    }

    this.processedIds.add(item.id);

    logger.debug('Item enqueued', {
      itemId: item.id,
      jobKey: item.job.jobKey,
      priority: item.priority,
      queuePosition: insertIndex === -1 ? this.queue.length - 1 : insertIndex,
    });

    return true;
  }

  /**
   * Removes an item from the queue.
   */
  public dequeue(id: string): QueueItem | null {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const [item] = this.queue.splice(index, 1);
    this.processedIds.delete(id);

    logger.debug('Item dequeued', { itemId: id, jobKey: item.job.jobKey });

    return item;
  }

  /**
   * Gets the next item from the queue without removing it.
   */
  public peek(): QueueItem | null {
    return this.queue[0] ?? null;
  }

  /**
   * Gets an item by ID.
   */
  public get(id: string): QueueItem | null {
    // Check queue
    const queueItem = this.queue.find((item) => item.id === id);
    if (queueItem) return queueItem;

    // Check running
    const runningItem = this.running.get(id);
    if (runningItem) return runningItem;

    // Check completed
    const completedItem = this.completed.get(id);
    if (completedItem) return completedItem;

    // Check failed
    const failedItem = this.failed.get(id);
    if (failedItem) return failedItem;

    return null;
  }

  /**
   * Checks if the queue contains an item.
   */
  public has(id: string): boolean {
    return this.queue.some((item) => item.id === id) ||
           this.running.has(id) ||
           this.completed.has(id) ||
           this.failed.has(id);
  }

  /**
   * Checks if an item has already been processed.
   */
  public isProcessed(id: string): boolean {
    return this.processedIds.has(id);
  }

  /**
   * Marks an item as running.
   */
  public markRunning(id: string): boolean {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    const [item] = this.queue.splice(index, 1);
    this.running.set(id, item);

    logger.debug('Item marked as running', { itemId: id });

    return true;
  }

  /**
   * Marks an item as completed.
   */
  public markCompleted(id: string): boolean {
    const item = this.running.get(id);
    if (!item) {
      return false;
    }

    this.running.delete(id);
    this.completed.set(id, item);

    logger.debug('Item marked as completed', { itemId: id });

    return true;
  }

  /**
   * Marks an item as failed.
   */
  public markFailed(id: string): boolean {
    const item = this.running.get(id);
    if (!item) {
      return false;
    }

    this.running.delete(id);
    this.failed.set(id, item);

    logger.debug('Item marked as failed', { itemId: id });

    return true;
  }

  /**
   * Gets the count of items in the queue.
   */
  public size(): number {
    return this.queue.length;
  }

  /**
   * Gets the count of running items.
   */
  public runningCount(): number {
    return this.running.size;
  }

  /**
   * Gets the count of completed items.
   */
  public completedCount(): number {
    return this.completed.size;
  }

  /**
   * Gets the count of failed items.
   */
  public failedCount(): number {
    return this.failed.size;
  }

  /**
   * Checks if the queue is empty.
   */
  public isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Checks if the queue is full.
   */
  public isFull(): boolean {
    return this.queue.length >= this.config.maxQueueSize;
  }

  /**
   * Checks if can accept more running items.
   */
  public canAcceptMoreRunning(): boolean {
    return this.running.size < this.config.maxConcurrent;
  }

  /**
   * Gets all queue items.
   */
  public getAll(): QueueItem[] {
    return [...this.queue];
  }

  /**
   * Gets queue items filtered by priority.
   */
  public getByPriority(minPriority: SchedulerPriority): QueueItem[] {
    const minValue = getPriorityValue(minPriority);
    return this.queue.filter((item) => item.priority >= minValue);
  }

  /**
   * Gets queue items for a specific job key.
   */
  public getByJobKey(jobKey: string): QueueItem[] {
    return this.queue.filter((item) => item.job.jobKey === jobKey);
  }

  /**
   * Clears all items from the queue.
   */
  public clear(): void {
    this.queue.length = 0;
    this.running.clear();
    this.completed.clear();
    this.failed.clear();
    this.processedIds.clear();
    logger.info('Queue cleared');
  }

  /**
   * Clears completed items only.
   */
  public clearCompleted(): void {
    this.completed.clear();
    logger.debug('Completed items cleared');
  }

  /**
   * Clears failed items only.
   */
  public clearFailed(): void {
    this.failed.clear();
    logger.debug('Failed items cleared');
  }

  /**
   * Gets queue statistics.
   */
  public getStatistics(): QueueStatistics {
    const totalWaitTime = this.queue.reduce((sum, item) => {
      return sum + (Date.now() - item.addedAt.getTime());
    }, 0);

    const completedExecutionTimes = Array.from(this.completed.values()).map((item) => {
      const duration = item.execution.duration ?? 0;
      return duration;
    });
    const avgExecutionTime = completedExecutionTimes.length > 0
      ? completedExecutionTimes.reduce((a, b) => a + b, 0) / completedExecutionTimes.length
      : 0;

    return {
      totalItems: this.queue.length + this.running.size + this.completed.size + this.failed.size,
      pendingItems: this.queue.length,
      runningItems: this.running.size,
      completedItems: this.completed.size,
      failedItems: this.failed.size,
      averageWaitTimeMs: this.queue.length > 0 ? totalWaitTime / this.queue.length : 0,
      averageExecutionTimeMs: avgExecutionTime,
    };
  }

  /**
   * Starts queue processing.
   */
  public start(): void {
    this.isProcessing = true;
    logger.info('Queue processing started');
  }

  /**
   * Stops queue processing.
   */
  public stop(): void {
    this.isProcessing = false;
    logger.info('Queue processing stopped');
  }

  /**
   * Checks if queue is processing.
   */
  public isProcessingQueue(): boolean {
    return this.isProcessing;
  }

  /**
   * Gets the number of items that can be added before reaching the limit.
   */
  public getRemainingCapacity(): number {
    return this.config.maxQueueSize - this.queue.length;
  }

  /**
   * Prioritizes an item in the queue.
   */
  public prioritize(id: string, newPriority: SchedulerPriority): boolean {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    const [item] = this.queue.splice(index, 1);
    item.priority = getPriorityValue(newPriority);

    // Re-insert based on new priority
    const newIndex = this.queue.findIndex((existing) => existing.priority < item.priority);
    if (newIndex === -1) {
      this.queue.push(item);
    } else {
      this.queue.splice(newIndex, 0, item);
    }

    logger.debug('Item prioritized', { itemId: id, newPriority });

    return true;
  }
}
