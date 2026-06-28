/**
 * In-Memory Event Bus
 *
 * Production-ready in-memory implementation of the event bus.
 * Central communication mechanism for domain events.
 * All inter-domain communication MUST happen through Event Bus.
 *
 * Features:
 * - Synchronous event dispatch
 * - Priority-based handler ordering
 * - Multiple subscribers per event type
 * - Independent handler execution (failure isolation)
 * - Retry handling with configurable limits
 * - Dead Letter Queue for failed events
 * - Event validation and duplicate protection
 */

import type { IEventBus } from '../interfaces/IEventBus';
import { DomainEvent } from '../entities/DomainEvent';
import { EventEnvelope } from '../entities/EventEnvelope';
import type { IEventHandler } from '../interfaces/IEventHandler';
import { EventType } from '../value-objects/EventType';
import { HandlerId } from '../value-objects/HandlerId';
import type { PublishEventDto } from '../dto/PublishEventDto';
import type { PublishEventResponseDto } from '../dto/PublishEventDto';
import type { EventStatistics } from '../types/EventStatistics';
import { EventStatus } from '../types/EventStatus';
import { EventPriority, EVENT_PRIORITY_CONSTRAINTS } from '../types/EventPriority';
import { EventSource } from '../types/EventSource';
import { EventMapper } from '../mappers/EventMapper';
import { EnvelopeMapper } from '../mappers/EnvelopeMapper';
import { EventValidator } from '../validators/EventValidator';
import { EnvelopeValidator } from '../validators/EnvelopeValidator';

/**
 * Dead letter entry for failed events.
 */
interface DeadLetterEntry {
  envelope: EventEnvelope;
  failureReason: string;
  failedAt: Date;
  lastHandlerId?: HandlerId;
  lastHandlerName?: string;
}

/**
 * Handler subscription entry with metadata.
 */
interface HandlerSubscription {
  handler: IEventHandler;
  subscribedAt: Date;
  isActive: boolean;
}

/**
 * In-memory event bus implementation.
 * Thread-safe for single-process Node.js applications.
 */
export class InMemoryEventBus implements IEventBus {
  // Subscription storage: EventType string -> Set of handler subscriptions
  private readonly subscriptions: Map<string, Set<HandlerSubscription>> = new Map();

  // Event envelopes storage: envelopeId -> EventEnvelope
  private readonly envelopes: Map<string, EventEnvelope> = new Map();

  // Dead Letter Queue: envelopeId -> DeadLetterEntry
  private readonly deadLetterQueue: Map<string, DeadLetterEntry> = new Map();

  // Published event IDs for duplicate detection
  private readonly publishedEventIds: Set<string> = new Set();

  // Event bus state
  private _isRunning: boolean = false;

  // Statistics
  private _totalPublished: number = 0;
  private _totalProcessed: number = 0;
  private _totalFailed: number = 0;
  private _totalDeadLettered: number = 0;

  // Processing timestamps for rate calculation
  private readonly _publishedTimestamps: Date[] = [];
  private readonly _processedTimestamps: Date[] = [];

  // Validators
  private readonly eventValidator: EventValidator;
  private readonly envelopeValidator: EnvelopeValidator;

  /**
   * Creates a new InMemoryEventBus instance.
   */
  constructor(
    eventValidator?: EventValidator,
    envelopeValidator?: EnvelopeValidator
  ) {
    this.eventValidator = eventValidator ?? new EventValidator();
    this.envelopeValidator = envelopeValidator ?? new EnvelopeValidator();
  }

  /**
   * Publishes a domain event to the event bus.
   * Validates the event, creates an envelope, and dispatches to handlers.
   */
  public async publish(event: DomainEvent): Promise<PublishEventResponseDto> {
    if (!this._isRunning) {
      throw new Error('Event bus is not running. Call start() first.');
    }

    // Validate event
    const validationResult = this.eventValidator.validateEvent(event);
    if (!validationResult.valid) {
      throw new Error(`Invalid event: ${validationResult.errors.join(', ')}`);
    }

    // Duplicate detection
    if (this.publishedEventIds.has(event.eventId.value)) {
      return {
        eventId: event.eventId.value,
        envelopeId: '',
        message: 'Event already published',
        publishedAt: new Date().toISOString(),
      };
    }

    // Create envelope
    const envelope = EventEnvelope.create({
      event,
      priority: EventPriority.NORMAL,
      maxRetries: 3,
      timeoutMs: 30000,
    });

    // Store envelope
    this.envelopes.set(envelope.envelopeId.value, envelope);

    // Mark as published
    const publishedEnvelope = envelope.withStatus(EventStatus.PUBLISHED);
    this.envelopes.set(envelope.envelopeId.value, publishedEnvelope);

    // Track for duplicate detection
    this.publishedEventIds.add(event.eventId.value);
    this._totalPublished++;
    this._publishedTimestamps.push(new Date());

    // Dispatch to handlers
    await this.dispatch(publishedEnvelope);

    return {
      eventId: event.eventId.value,
      envelopeId: envelope.envelopeId.value,
      message: 'Event published successfully',
      publishedAt: envelope.publishedAt.toISOString(),
    };
  }

  /**
   * Publishes an event from a DTO.
   */
  public async publishFromDto(dto: PublishEventDto): Promise<PublishEventResponseDto> {
    if (!this._isRunning) {
      throw new Error('Event bus is not running. Call start() first.');
    }

    // Validate DTO
    const validationResult = this.eventValidator.validatePublishDto(dto);
    if (!validationResult.valid) {
      throw new Error(`Invalid event DTO: ${validationResult.errors.join(', ')}`);
    }

    // Create domain event from DTO
    const event = EventMapper.fromPublishDto(dto);

    // Publish the event
    return this.publish(event);
  }

  /**
   * Publishes multiple events in a batch.
   */
  public async publishBatch(events: DomainEvent[]): Promise<PublishEventResponseDto[]> {
    const results: PublishEventResponseDto[] = [];

    for (const event of events) {
      try {
        const result = await this.publish(event);
        results.push(result);
      } catch (error) {
        results.push({
          eventId: event.eventId.value,
          envelopeId: '',
          message: `Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`,
          publishedAt: new Date().toISOString(),
        });
      }
    }

    return results;
  }

  /**
   * Subscribes a handler to an event type.
   * Prevents duplicate handler registration.
   */
  public subscribe(eventType: EventType, handler: IEventHandler): void {
    const typeKey = eventType.value;

    // Get or create handler set for this event type
    if (!this.subscriptions.has(typeKey)) {
      this.subscriptions.set(typeKey, new Set());
    }

    const handlers = this.subscriptions.get(typeKey)!;

    // Check for duplicate handler registration
    const handlerArray = Array.from(handlers);
    for (const subscription of handlerArray) {
      if (subscription.handler.handlerId.equals(handler.handlerId)) {
        // Handler already subscribed, update if needed
        subscription.handler = handler;
        return;
      }
    }

    // Add new subscription
    handlers.add({
      handler,
      subscribedAt: new Date(),
      isActive: true,
    });
  }

  /**
   * Registers a handler directly (alias for subscribe).
   */
  public registerHandler(eventType: EventType, handler: IEventHandler): void {
    this.subscribe(eventType, handler);
  }

  /**
   * Unsubscribes a handler from an event type.
   */
  public unsubscribe(eventType: EventType, handlerId: string): void {
    const typeKey = eventType.value;
    const handlers = this.subscriptions.get(typeKey);

    if (!handlers) {
      return;
    }

    const handlerArray = Array.from(handlers);
    for (const subscription of handlerArray) {
      if (subscription.handler.handlerId.value === handlerId) {
        subscription.isActive = false;
        handlers.delete(subscription);
        return;
      }
    }
  }

  /**
   * Removes a handler completely (alias for unsubscribe).
   */
  public removeHandler(eventType: EventType, handlerId: string): void {
    this.unsubscribe(eventType, handlerId);
  }

  /**
   * Unsubscribes all handlers from an event type.
   */
  public unsubscribeAll(eventType: EventType): void {
    this.subscriptions.delete(eventType.value);
  }

  /**
   * Gets all handlers for a given event type, sorted by priority.
   */
  public getHandlers(eventType: EventType): IEventHandler[] {
    const typeKey = eventType.value;
    const handlers = this.subscriptions.get(typeKey);

    if (!handlers) {
      return [];
    }

    // Filter active handlers and sort by priority (descending)
    return Array.from(handlers)
      .filter((sub) => sub.isActive)
      .map((sub) => sub.handler)
      .sort((a, b) => {
        const aPriority = this.getHandlerPriority(a);
        const bPriority = this.getHandlerPriority(b);
        return bPriority - aPriority; // Higher priority first
      });
  }

  /**
   * Checks if there are handlers for a given event type.
   */
  public hasHandlers(eventType: EventType): boolean {
    return this.getHandlers(eventType).length > 0;
  }

  /**
   * Starts the event bus processing.
   */
  public async start(): Promise<void> {
    if (this._isRunning) {
      return;
    }
    this._isRunning = true;
  }

  /**
   * Stops the event bus processing.
   */
  public async stop(): Promise<void> {
    if (!this._isRunning) {
      return;
    }
    this._isRunning = false;
  }

  /**
   * Gets the current event statistics.
   */
  public async getStatistics(): Promise<EventStatistics> {
    // Clean up old timestamps (keep last minute)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    this.cleanupTimestamps(this._publishedTimestamps, oneMinuteAgo);
    this.cleanupTimestamps(this._processedTimestamps, oneMinuteAgo);

    // Calculate totals by status
    let totalPending = 0;
    let totalProcessing = 0;

    const envelopeValues = Array.from(this.envelopes.values());
    for (const envelope of envelopeValues) {
      switch (envelope.status) {
        case EventStatus.PENDING:
        case EventStatus.PUBLISHED:
          totalPending++;
          break;
        case EventStatus.PROCESSING:
          totalProcessing++;
          break;
      }
    }

    // Calculate failure rate
    const totalAttempted = this._totalProcessed + this._totalFailed;
    const failureRate = totalAttempted > 0 ? (this._totalFailed / totalAttempted) * 100 : 0;

    // Calculate average processing time
    const avgProcessingTime = this._processedTimestamps.length > 0 ? 0 : 0; // Would need actual timing data

    return {
      totalPublished: this._totalPublished,
      totalProcessed: this._totalProcessed,
      totalFailed: this._totalFailed,
      totalProcessing,
      totalPending,
      totalDeadLettered: this._totalDeadLettered,
      averageProcessingTimeMs: avgProcessingTime,
      publishedPerMinute: this._publishedTimestamps.length,
      processedPerMinute: this._processedTimestamps.length,
      failureRate,
    };
  }

  /**
   * Gets envelopes by status.
   */
  public async getEnvelopesByStatus(status: EventStatus): Promise<EventEnvelope[]> {
    const result: EventEnvelope[] = [];

    const envelopeValues = Array.from(this.envelopes.values());
    for (const envelope of envelopeValues) {
      if (envelope.status === status) {
        result.push(envelope);
      }
    }

    return result;
  }

  /**
   * Gets an envelope by ID.
   */
  public async getEnvelope(envelopeId: string): Promise<EventEnvelope | null> {
    return this.envelopes.get(envelopeId) ?? null;
  }

  /**
   * Clears all pending events.
   */
  public async clearPending(): Promise<void> {
    const toRemove: string[] = [];

    const envelopeEntries = Array.from(this.envelopes.entries());
    for (const [id, envelope] of envelopeEntries) {
      if (
        envelope.status === EventStatus.PENDING ||
        envelope.status === EventStatus.PUBLISHED
      ) {
        toRemove.push(id);
      }
    }

    for (const id of toRemove) {
      this.envelopes.delete(id);
    }
  }

  /**
   * Clears all handlers, envelopes, and resets state.
   */
  public clear(): void {
    this.subscriptions.clear();
    this.envelopes.clear();
    this.deadLetterQueue.clear();
    this.publishedEventIds.clear();
    this._totalPublished = 0;
    this._totalProcessed = 0;
    this._totalFailed = 0;
    this._totalDeadLettered = 0;
    this._publishedTimestamps.length = 0;
    this._processedTimestamps.length = 0;
  }

  /**
   * Gets all dead letter entries.
   */
  public getDeadLetterEntries(): DeadLetterEntry[] {
    return Array.from(this.deadLetterQueue.values());
  }

  /**
   * Gets a dead letter entry by envelope ID.
   */
  public getDeadLetterEntry(envelopeId: string): DeadLetterEntry | undefined {
    return this.deadLetterQueue.get(envelopeId);
  }

  /**
   * Removes an entry from the dead letter queue.
   */
  public removeDeadLetter(envelopeId: string): boolean {
    return this.deadLetterQueue.delete(envelopeId);
  }

  /**
   * Clears the dead letter queue.
   */
  public clearDeadLetterQueue(): void {
    this.deadLetterQueue.clear();
  }

  /**
   * Requeues a dead letter event for retry.
   */
  public async requeueDeadLetter(envelopeId: string): Promise<boolean> {
    const deadLetter = this.deadLetterQueue.get(envelopeId);

    if (!deadLetter) {
      return false;
    }

    const envelope = deadLetter.envelope;

    // Reset envelope for retry
    const retriedEnvelope = envelope
      .withStatus(EventStatus.PENDING)
      .withRetry();

    this.envelopes.set(envelopeId, retriedEnvelope);
    this.deadLetterQueue.delete(envelopeId);

    // Dispatch again
    await this.dispatch(retriedEnvelope);

    return true;
  }

  /**
   * Dispatches an event to all registered handlers.
   * Handles priority ordering, failure isolation, and retry logic.
   */
  private async dispatch(envelope: EventEnvelope): Promise<void> {
    const eventType = envelope.event.eventType;
    const handlers = this.getHandlers(eventType);

    if (handlers.length === 0) {
      // No handlers, mark as processed
      const processedEnvelope = envelope.withStatus(EventStatus.PROCESSED);
      this.envelopes.set(envelope.envelopeId.value, processedEnvelope);
      this._totalProcessed++;
      this._processedTimestamps.push(new Date());
      return;
    }

    // Update status to processing
    const processingEnvelope = envelope.withStatus(EventStatus.PROCESSING);
    this.envelopes.set(envelope.envelopeId.value, processingEnvelope);

    // Process each handler independently (failure isolation)
    let allSucceeded = true;
    let lastError: Error | null = null;

    for (const handler of handlers) {
      try {
        await this.executeHandler(handler, processingEnvelope);
      } catch (error) {
        allSucceeded = false;
        lastError = error instanceof Error ? error : new Error(String(error));

        // Handle failure
        await this.handleHandlerFailure(
          processingEnvelope,
          handler,
          lastError.message,
          lastError.stack
        );
      }
    }

    // Update final status
    const finalEnvelope = this.envelopes.get(envelope.envelopeId.value);

    if (!finalEnvelope) {
      return;
    }

    if (finalEnvelope.status === EventStatus.DEAD_LETTERED) {
      this._totalDeadLettered++;
      this.addToDeadLetterQueue(finalEnvelope, lastError?.message ?? 'Unknown error');
    } else if (finalEnvelope.status === EventStatus.FAILED) {
      // Check if we should retry
      if (finalEnvelope.canRetry()) {
        await this.scheduleRetry(finalEnvelope);
      } else {
        this._totalDeadLettered++;
        this.addToDeadLetterQueue(finalEnvelope, lastError?.message ?? 'Max retries exceeded');
      }
    } else if (finalEnvelope.status === EventStatus.PROCESSING) {
      // All handlers succeeded, mark as processed
      const processedFinal = finalEnvelope.withStatus(EventStatus.PROCESSED);
      this.envelopes.set(envelope.envelopeId.value, processedFinal);
      this._totalProcessed++;
      this._processedTimestamps.push(new Date());
    }
  }

  /**
   * Executes a single handler with timeout support.
   */
  private async executeHandler(handler: IEventHandler, envelope: EventEnvelope): Promise<void> {
    const timeoutMs = envelope.metadata.timeoutMs ?? 30000;

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Handler ${handler.handlerName} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    const handlerPromise = handler.handle(envelope.event);

    await Promise.race([handlerPromise, timeoutPromise]);
  }

  /**
   * Handles handler failure with retry logic.
   */
  private async handleHandlerFailure(
    envelope: EventEnvelope,
    handler: IEventHandler,
    errorMessage: string,
    errorStack?: string
  ): Promise<void> {
    const updatedEnvelope = envelope.withError(errorMessage, errorStack);

    // Check if we can retry
    if (updatedEnvelope.canRetry()) {
      updatedEnvelope.withStatus(EventStatus.RETRYING);
    } else {
      updatedEnvelope.withStatus(EventStatus.DEAD_LETTERED);
    }

    this.envelopes.set(envelope.envelopeId.value, updatedEnvelope);
    this._totalFailed++;
  }

  /**
   * Schedules a retry for a failed envelope.
   */
  private async scheduleRetry(envelope: EventEnvelope): Promise<void> {
    const retryDelay = this.calculateRetryDelay(envelope.retryCount);

    // Update envelope with retry status
    const retryEnvelope = envelope.withRetry();
    this.envelopes.set(envelope.envelopeId.value, retryEnvelope);

    // Schedule the retry after delay
    setTimeout(async () => {
      const currentEnvelope = this.envelopes.get(envelope.envelopeId.value);
      if (currentEnvelope && currentEnvelope.status === EventStatus.RETRYING) {
        const dispatchEnvelope = currentEnvelope.withStatus(EventStatus.PUBLISHED);
        this.envelopes.set(envelope.envelopeId.value, dispatchEnvelope);
        await this.dispatch(dispatchEnvelope);
      }
    }, retryDelay);
  }

  /**
   * Calculates retry delay with exponential backoff.
   */
  private calculateRetryDelay(retryCount: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
    return delay;
  }

  /**
   * Adds an envelope to the dead letter queue.
   */
  private addToDeadLetterQueue(envelope: EventEnvelope, failureReason: string): void {
    this.deadLetterQueue.set(envelope.envelopeId.value, {
      envelope,
      failureReason,
      failedAt: new Date(),
    });
  }

  /**
   * Gets the priority of a handler.
   */
  private getHandlerPriority(handler: IEventHandler): number {
    // Try to get priority from handler if it has it
    if ('priority' in handler && typeof handler.priority === 'number') {
      return handler.priority;
    }
    return EVENT_PRIORITY_CONSTRAINTS.DEFAULT_PRIORITY;
  }

  /**
   * Cleans up timestamps older than the cutoff.
   */
  private cleanupTimestamps(timestamps: Date[], cutoff: Date): void {
    while (timestamps.length > 0 && timestamps[0] < cutoff) {
      timestamps.shift();
    }
  }

  /**
   * Checks if the event bus is running.
   */
  public get isRunning(): boolean {
    return this._isRunning;
  }
}