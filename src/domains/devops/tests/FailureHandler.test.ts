/**
 * Failure Handler Tests
 *
 * Tests for DevOpsFailureHandler.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DevOpsFailureHandler, createDeploymentFailedEvent } from '../services/FailureHandler';
import type { IEventBus } from '../../../core/events/interfaces/IEventBus';

describe('DevOpsFailureHandler', () => {
  let handler: DevOpsFailureHandler;
  let mockEventBus: IEventBus;

  beforeEach(() => {
    mockEventBus = {
      publish: vi.fn().mockResolvedValue({}),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      getStatistics: vi.fn(),
      getEnvelopesByStatus: vi.fn(),
      getEnvelope: vi.fn(),
      clearPending: vi.fn(),
    };
    handler = new DevOpsFailureHandler(mockEventBus);
  });

  describe('handleDeploymentRegistrationFailure', () => {
    it('should not throw when handling failure', () => {
      const error = new Error('Database connection failed');

      expect(() =>
        handler.handleDeploymentRegistrationFailure({
          deploymentId: '123e4567-e89b-12d3-a456-426614174000',
          version: '1.0.0',
          environmentId: '123e4567-e89b-12d3-a456-426614174001',
          error,
        })
      ).not.toThrow();
    });

    it('should publish DeploymentFailed event', async () => {
      const error = new Error('Database connection failed');

      handler.handleDeploymentRegistrationFailure({
        deploymentId: '123e4567-e89b-12d3-a456-426614174000',
        version: '1.0.0',
        environmentId: '123e4567-e89b-12d3-a456-426614174001',
        error,
      });

      // Allow async publish to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it('should handle event bus publish failure gracefully', async () => {
      mockEventBus.publish = vi.fn().mockRejectedValue(new Error('Event bus error'));
      const error = new Error('Database connection failed');

      // Should not throw even if event bus fails
      expect(() =>
        handler.handleDeploymentRegistrationFailure({
          deploymentId: '123e4567-e89b-12d3-a456-426614174000',
          version: '1.0.0',
          environmentId: '123e4567-e89b-12d3-a456-426614174001',
          error,
        })
      ).not.toThrow();
    });

    it('should handle missing optional parameters', () => {
      const error = new Error('Unknown error');

      expect(() =>
        handler.handleDeploymentRegistrationFailure({
          error,
        })
      ).not.toThrow();
    });
  });

  describe('handleEnvironmentRegistrationFailure', () => {
    it('should not throw when handling failure', () => {
      const error = new Error('Validation failed');

      expect(() =>
        handler.handleEnvironmentRegistrationFailure({
          name: 'production',
          type: 'production',
          error,
        })
      ).not.toThrow();
    });

    it('should publish EnvironmentRegistrationFailed event', async () => {
      const error = new Error('Validation failed');

      handler.handleEnvironmentRegistrationFailure({
        name: 'production',
        type: 'production',
        error,
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockEventBus.publish).toHaveBeenCalled();
    });
  });

  describe('handleInfrastructureNodeRegistrationFailure', () => {
    it('should not throw when handling failure', () => {
      const error = new Error('Node registration failed');

      expect(() =>
        handler.handleInfrastructureNodeRegistrationFailure({
          nodeName: 'api-server-1',
          nodeType: 'api_server',
          region: 'us-east-1',
          error,
        })
      ).not.toThrow();
    });

    it('should publish InfrastructureNodeRegistrationFailed event', async () => {
      const error = new Error('Node registration failed');

      handler.handleInfrastructureNodeRegistrationFailure({
        nodeName: 'api-server-1',
        nodeType: 'api_server',
        region: 'us-east-1',
        error,
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockEventBus.publish).toHaveBeenCalled();
    });
  });
});

describe('createDeploymentFailedEvent', () => {
  it('should create a valid DeploymentFailed event', () => {
    const error = new Error('Test error');

    const event = createDeploymentFailedEvent({
      deploymentId: '123e4567-e89b-12d3-a456-426614174000',
      version: '1.0.0',
      environmentId: '123e4567-e89b-12d3-a456-426614174001',
      error,
    });

    expect(event.eventType).toBe('DeploymentFailed');
    expect(event.version).toBe(1);
    expect(event.data.deploymentId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(event.data.version).toBe('1.0.0');
    expect(event.data.environmentId).toBe('123e4567-e89b-12d3-a456-426614174001');
    expect(event.data.error).toBe('Test error');
    expect(event.data.occurredAt).toBeInstanceOf(Date);
  });

  it('should handle null optional parameters', () => {
    const error = new Error('Test error');

    const event = createDeploymentFailedEvent({
      error,
    });

    expect(event.eventType).toBe('DeploymentFailed');
    expect(event.data.deploymentId).toBeNull();
    expect(event.data.version).toBeNull();
    expect(event.data.environmentId).toBeNull();
  });
});
