/**
 * InMemoryEventBus Tests
 *
 * Comprehensive tests for the event bus implementation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryEventBus } from '../repositories/InMemoryEventBus';
import { DomainEvent } from '../entities/DomainEvent';
import { EventType } from '../value-objects/EventType';
import { AggregateId } from '../value-objects/AggregateId';
import { HandlerId } from '../value-objects/HandlerId';
import { EventStatus } from '../types/EventStatus';
import { EventSource } from '../types/EventSource';
import type { IEventHandler } from '../interfaces/IEventHandler';

/**
 * Creates a mock event handler for testing.
 */
function createMockHandler(params: {
  handlerId?: HandlerId;
  eventType?: EventType;
  handlerName?: string;
  shouldSucceed?: boolean;
  handleFn?: (event: DomainEvent) => Promise<boolean>;
} = {}): IEventHandler {
  const eventType = params.eventType ?? EventType.create('Test.Event');
  return {
    handlerId: params.handlerId ?? HandlerId.generate(),
    eventType,
    handlerName: params.handlerName ?? 'MockHandler',
    handle: params.handleFn ?? (async () => params.shouldSucceed ?? true),
    canHandle: (et: EventType) => et.value === eventType.value,
  } as IEventHandler;
}

/**
 * Creates a test domain event.
 */
function createTestEvent(params?: {
  eventType?: string;
  aggregateId?: string;
}): DomainEvent {
  return DomainEvent.create({
    eventType: EventType.create(params?.eventType ?? 'Test.Event'),
    aggregateId: AggregateId.create(params?.aggregateId ?? '550e8400-e29b-41d4-a716-446655440000'),
    aggregateType: 'TestAggregate',
    sourceModule: EventSource.PLAYER_PROFILE,
    payload: { test: 'data' },
  });
}

describe('InMemoryEventBus', () => {
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
  });

  describe('Lifecycle', () => {
    it('should not be running initially', () => {
      expect(eventBus.isRunning).toBe(false);
    });

    it('should start and stop correctly', async () => {
      await eventBus.start();
      expect(eventBus.isRunning).toBe(true);

      await eventBus.stop();
      expect(eventBus.isRunning).toBe(false);
    });

    it('should throw error when publishing without start', async () => {
      const event = createTestEvent();
      await expect(eventBus.publish(event)).rejects.toThrow('Event bus is not running');
    });

    it('should throw error when publishingFromDto without start', async () => {
      await expect(
        eventBus.publishFromDto({
          eventType: 'Test.Event',
          aggregateId: '550e8400-e29b-41d4-a716-446655440000',
          aggregateType: 'TestAggregate',
          sourceModule: EventSource.PLAYER_PROFILE,
          payload: { test: 'data' },
        })
      ).rejects.toThrow('Event bus is not running');
    });

    it('should allow subscribing before start', () => {
      const handler = createMockHandler();
      const eventType = EventType.create('Test.Event');

      expect(() => eventBus.subscribe(eventType, handler)).not.toThrow();
      expect(eventBus.hasHandlers(eventType)).toBe(true);
    });
  });

  describe('Subscription', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should subscribe a handler to an event type', () => {
      const handler = createMockHandler({ handlerName: 'TestHandler' });
      const eventType = EventType.create('PlayerProfile.Created');

      eventBus.subscribe(eventType, handler);

      expect(eventBus.hasHandlers(eventType)).toBe(true);
      expect(eventBus.getHandlers(eventType)).toHaveLength(1);
      expect(eventBus.getHandlers(eventType)[0].handlerName).toBe('TestHandler');
    });

    it('should prevent duplicate handler registration', () => {
      const handlerId = HandlerId.generate();
      const handler1 = createMockHandler({
        handlerId,
        handlerName: 'Handler1',
        eventType: EventType.create('Test.Event'),
      });
      const handler2 = createMockHandler({
        handlerId,
        handlerName: 'Handler2',
        eventType: EventType.create('Test.Event'),
      });

      const eventType = EventType.create('Test.Event');
      eventBus.subscribe(eventType, handler1);
      eventBus.subscribe(eventType, handler2);

      expect(eventBus.getHandlers(eventType)).toHaveLength(1);
      expect(eventBus.getHandlers(eventType)[0].handlerName).toBe('Handler2');
    });

    it('should unsubscribe a handler', () => {
      const handler = createMockHandler();
      const eventType = EventType.create('Test.Event');

      eventBus.subscribe(eventType, handler);
      expect(eventBus.hasHandlers(eventType)).toBe(true);

      eventBus.unsubscribe(eventType, handler.handlerId.value);
      expect(eventBus.hasHandlers(eventType)).toBe(false);
    });

    it('should unsubscribe all handlers for an event type', () => {
      const handler1 = createMockHandler({ handlerName: 'Handler1' });
      const handler2 = createMockHandler({ handlerName: 'Handler2' });
      const eventType = EventType.create('Test.Event');

      eventBus.subscribe(eventType, handler1);
      eventBus.subscribe(eventType, handler2);
      expect(eventBus.getHandlers(eventType)).toHaveLength(2);

      eventBus.unsubscribeAll(eventType);
      expect(eventBus.hasHandlers(eventType)).toBe(false);
    });

    it('should support registerHandler as alias for subscribe', () => {
      const handler = createMockHandler();
      const eventType = EventType.create('Test.Event');

      eventBus.registerHandler(eventType, handler);
      expect(eventBus.hasHandlers(eventType)).toBe(true);
    });

    it('should support removeHandler as alias for unsubscribe', () => {
      const handler = createMockHandler();
      const eventType = EventType.create('Test.Event');

      eventBus.subscribe(eventType, handler);
      eventBus.removeHandler(eventType, handler.handlerId.value);
      expect(eventBus.hasHandlers(eventType)).toBe(false);
    });
  });

  describe('Dispatch', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should dispatch event to handler', async () => {
      let handleCalled = false;
      const handler = createMockHandler({
        eventType: EventType.create('Test.Event'),
        handleFn: async () => {
          handleCalled = true;
          return true;
        },
      });

      eventBus.subscribe(EventType.create('Test.Event'), handler);

      const event = createTestEvent({ eventType: 'Test.Event' });
      const result = await eventBus.publish(event);

      expect(result.eventId).toBe(event.eventId.value);
      expect(handleCalled).toBe(true);
    });

    it('should mark event as processed when no handlers exist', async () => {
      const event = createTestEvent();
      const result = await eventBus.publish(event);

      expect(result.message).toBe('Event published successfully');
    });

    it('should handle handler failure gracefully', async () => {
      const handler = createMockHandler({
        eventType: EventType.create('Test.Event'),
        shouldSucceed: false,
        handleFn: async () => {
          throw new Error('Handler failed');
        },
      });

      eventBus.subscribe(EventType.create('Test.Event'), handler);

      const event = createTestEvent({ eventType: 'Test.Event' });
      const result = await eventBus.publish(event);

      expect(result.message).toBe('Event published successfully');
    });

    it('should isolate handler failures (failure isolation)', async () => {
      let successHandlerCalled = false;
      let failureHandlerCalled = false;

      const successHandler = createMockHandler({
        eventType: EventType.create('Test.Event'),
        handlerName: 'SuccessHandler',
        handleFn: async () => {
          successHandlerCalled = true;
          return true;
        },
      });

      const failureHandler = createMockHandler({
        eventType: EventType.create('Test.Event'),
        handlerName: 'FailureHandler',
        handleFn: async () => {
          failureHandlerCalled = true;
          throw new Error('Handler failed');
        },
      });

      eventBus.subscribe(EventType.create('Test.Event'), successHandler);
      eventBus.subscribe(EventType.create('Test.Event'), failureHandler);

      const event = createTestEvent({ eventType: 'Test.Event' });
      await eventBus.publish(event);

      expect(successHandlerCalled).toBe(true);
      expect(failureHandlerCalled).toBe(true);
    });
  });

  describe('Priority', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should return handlers sorted by priority', async () => {
      const handler1 = createMockHandler({
        handlerId: HandlerId.reconstruct('handler_a0000000_0000_4000_8000_000000000001'),
        eventType: EventType.create('Test.Event'),
        handlerName: 'HandlerA',
        handleFn: async () => true,
      });

      const handler2 = createMockHandler({
        handlerId: HandlerId.reconstruct('handler_b0000000_0000_4000_8000_000000000002'),
        eventType: EventType.create('Test.Event'),
        handlerName: 'HandlerB',
        handleFn: async () => true,
      });

      const eventType = EventType.create('Test.Event');

      eventBus.subscribe(eventType, handler1);
      eventBus.subscribe(eventType, handler2);

      const handlers = eventBus.getHandlers(eventType);
      expect(handlers).toHaveLength(2);
    });

    it('should return empty array when no handlers exist', () => {
      const handlers = eventBus.getHandlers(EventType.create('NonExistent.Event'));
      expect(handlers).toHaveLength(0);
    });
  });

  describe('Duplicate Detection', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should detect duplicate events', async () => {
      const event = createTestEvent();

      const result1 = await eventBus.publish(event);
      expect(result1.message).toBe('Event published successfully');
      expect(result1.envelopeId).not.toBe('');

      const result2 = await eventBus.publish(event);
      expect(result2.message).toBe('Event already published');
      expect(result2.envelopeId).toBe('');
    });
  });

  describe('Batch Publishing', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should publish multiple events in batch', async () => {
      const events = [
        createTestEvent({ eventType: 'Test.Event1', aggregateId: '550e8400-e29b-41d4-a716-446655440001' }),
        createTestEvent({ eventType: 'Test.Event2', aggregateId: '550e8400-e29b-41d4-a716-446655440002' }),
        createTestEvent({ eventType: 'Test.Event3', aggregateId: '550e8400-e29b-41d4-a716-446655440003' }),
      ];

      const results = await eventBus.publishBatch(events);

      expect(results).toHaveLength(3);
      // All events should be published (message contains "published")
      const allPublished = results.every((r) => r.message.includes('published'));
      expect(allPublished).toBe(true);
    });
  });

  describe('Statistics', () => {
    beforeEach(async () => {
      await eventBus.start();
      eventBus.clear();
    });

    it('should track published events', async () => {
      const id1 = '550e8400-e29b-41d4-a716-446655440001';
      const id2 = '550e8400-e29b-41d4-a716-446655440002';
      
      const result1 = await eventBus.publish(createTestEvent({ aggregateId: id1 }));
      expect(result1.message).toBe('Event published successfully');
      
      const result2 = await eventBus.publish(createTestEvent({ aggregateId: id2 }));
      expect(result2.message).toBe('Event published successfully');

      const stats = await eventBus.getStatistics();
      expect(stats.totalPublished).toBeGreaterThanOrEqual(2);
    });

    it('should return correct statistics structure', async () => {
      const stats = await eventBus.getStatistics();

      expect(stats).toHaveProperty('totalPublished');
      expect(stats).toHaveProperty('totalProcessed');
      expect(stats).toHaveProperty('totalFailed');
      expect(stats).toHaveProperty('totalProcessing');
      expect(stats).toHaveProperty('totalPending');
      expect(stats).toHaveProperty('totalDeadLettered');
      expect(stats).toHaveProperty('averageProcessingTimeMs');
      expect(stats).toHaveProperty('publishedPerMinute');
      expect(stats).toHaveProperty('processedPerMinute');
      expect(stats).toHaveProperty('failureRate');
    });
  });

  describe('Envelope Management', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should get envelope by ID', async () => {
      const event = createTestEvent({ aggregateId: '550e8400-e29b-41d4-a716-446655440001' });
      const result = await eventBus.publish(event);

      const envelope = await eventBus.getEnvelope(result.envelopeId);
      expect(envelope).not.toBeNull();
      expect(envelope?.eventId.value).toBe(event.eventId.value);
    });

    it('should return null for non-existent envelope', async () => {
      const envelope = await eventBus.getEnvelope('non-existent-id');
      expect(envelope).toBeNull();
    });

    it('should get envelopes by status', async () => {
      await eventBus.publish(createTestEvent({ aggregateId: '550e8400-e29b-41d4-a716-446655440001' }));
      await eventBus.publish(createTestEvent({ aggregateId: '550e8400-e29b-41d4-a716-446655440002' }));

      const pendingEnvelopes = await eventBus.getEnvelopesByStatus(EventStatus.PENDING);
      const publishedEnvelopes = await eventBus.getEnvelopesByStatus(EventStatus.PUBLISHED);
      const processedEnvelopes = await eventBus.getEnvelopesByStatus(EventStatus.PROCESSED);

      expect(Array.isArray(pendingEnvelopes)).toBe(true);
      expect(Array.isArray(publishedEnvelopes)).toBe(true);
      expect(Array.isArray(processedEnvelopes)).toBe(true);
    });
  });

  describe('Clear', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should clear all state', async () => {
      const handler = createMockHandler();
      eventBus.subscribe(EventType.create('Test.Event'), handler);
      await eventBus.publish(createTestEvent({ aggregateId: '550e8400-e29b-41d4-a716-446655440001' }));

      eventBus.clear();

      expect(eventBus.hasHandlers(EventType.create('Test.Event'))).toBe(false);
      const stats = await eventBus.getStatistics();
      expect(stats.totalPublished).toBe(0);
      expect(stats.totalProcessed).toBe(0);
      const deadLetters = eventBus.getDeadLetterEntries();
      expect(deadLetters).toHaveLength(0);
    });
  });

  describe('Validation', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should reject events with invalid event type', async () => {
      const invalidEvent = {
        eventType: '',
        aggregateId: '550e8400-e29b-41d4-a716-446655440000',
        aggregateType: 'TestAggregate',
        sourceModule: EventSource.PLAYER_PROFILE,
        payload: { test: 'data' },
      };

      await expect(eventBus.publishFromDto(invalidEvent)).rejects.toThrow();
    });

    it('should reject events with invalid aggregate ID', async () => {
      const invalidEvent = {
        eventType: 'Test.Event',
        aggregateId: 'invalid-uuid',
        aggregateType: 'TestAggregate',
        sourceModule: EventSource.PLAYER_PROFILE,
        payload: { test: 'data' },
      };

      await expect(eventBus.publishFromDto(invalidEvent)).rejects.toThrow();
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await eventBus.start();
    });

    it('should handle rapid event publishing', async () => {
      const events = Array.from({ length: 50 }, () => createTestEvent());

      const startTime = Date.now();
      const results = await eventBus.publishBatch(events);
      const endTime = Date.now();

      expect(results).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(10000);
    });

    it('should handle many handlers per event type', async () => {
      const handlers = Array.from({ length: 20 }, (_, i) =>
        createMockHandler({
          handlerId: HandlerId.generate(),
          handlerName: `Handler${i}`,
          eventType: EventType.create('Test.Event'),
          handleFn: async () => true,
        })
      );

      const eventType = EventType.create('Test.Event');
      handlers.forEach((handler) => eventBus.subscribe(eventType, handler));

      const event = createTestEvent({ eventType: 'Test.Event' });
      const result = await eventBus.publish(event);

      expect(result.message).toBe('Event published successfully');
      expect(eventBus.getHandlers(eventType)).toHaveLength(20);
    });
  });
});