/**
 * DevOps Failure Handler
 *
 * Handles failures in DevOps operations.
 * If deployment registration fails, DevOps does NOT interrupt the application.
 * Instead, it logs the error and publishes a DeploymentFailed event.
 * DevOps NEVER modifies gameplay or game state.
 */

import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import type { IEventBus } from '../../../core/events/interfaces/IEventBus';

/**
 * DeploymentFailed event data.
 */
export interface DeploymentFailedEventData {
  deploymentId: string | null;
  version: string | null;
  environmentId: string | null;
  error: string;
  occurredAt: Date;
}

/**
 * DeploymentFailed event.
 */
export interface DeploymentFailedEvent {
  readonly eventType: 'DeploymentFailed';
  readonly data: DeploymentFailedEventData;
  readonly version: 1;
}

/**
 * Failure Handler Interface
 */
export interface IDevOpsFailureHandler {
  /**
   * Handles a deployment registration failure.
   * Logs the error and publishes a DeploymentFailed event.
   * Does NOT throw - application continues running.
   */
  handleDeploymentRegistrationFailure(params: {
    deploymentId?: string;
    version?: string;
    environmentId?: string;
    error: Error;
  }): void;

  /**
   * Handles an environment registration failure.
   */
  handleEnvironmentRegistrationFailure(params: {
    name?: string;
    type?: string;
    error: Error;
  }): void;

  /**
   * Handles an infrastructure node registration failure.
   */
  handleInfrastructureNodeRegistrationFailure(params: {
    nodeName?: string;
    nodeType?: string;
    region?: string;
    error: Error;
  }): void;
}

/**
 * Creates a DeploymentFailedEvent.
 */
export function createDeploymentFailedEvent(params: {
  deploymentId?: string;
  version?: string;
  environmentId?: string;
  error: Error;
}): DeploymentFailedEvent {
  return {
    eventType: 'DeploymentFailed',
    version: 1,
    data: {
      deploymentId: params.deploymentId ?? null,
      version: params.version ?? null,
      environmentId: params.environmentId ?? null,
      error: params.error.message,
      occurredAt: new Date(),
    },
  };
}

/**
 * DevOps Failure Handler implementation.
 * 
 * IMPORTANT: This handler NEVER interrupts the application.
 * All failures are logged and events are published for monitoring.
 */
export class DevOpsFailureHandler implements IDevOpsFailureHandler {
  private readonly logger: ILogger;
  private readonly eventBus?: IEventBus;

  /**
   * Creates a new DevOpsFailureHandler instance.
   */
  constructor(eventBus?: IEventBus, logger?: ILogger) {
    this.eventBus = eventBus;
    this.logger = logger ?? createLogger('DevOpsFailureHandler');
  }

  /**
   * Handles deployment registration failure.
   * Does NOT throw - application continues running.
   */
  handleDeploymentRegistrationFailure(params: {
    deploymentId?: string;
    version?: string;
    environmentId?: string;
    error: Error;
  }): void {
    // Always log the error
    this.logger.error('Deployment registration failed', params.error, {
      deploymentId: params.deploymentId,
      version: params.version,
      environmentId: params.environmentId,
      errorMessage: params.error.message,
      errorStack: params.error.stack,
    });

    // Publish event if event bus is available
    if (this.eventBus) {
      try {
        const event = createDeploymentFailedEvent({
          deploymentId: params.deploymentId,
          version: params.version,
          environmentId: params.environmentId,
          error: params.error,
        });
        this.eventBus.publish(event).catch((publishError) => {
          this.logger.error('Failed to publish DeploymentFailed event', publishError as Error);
        });
      } catch (eventError) {
        // Never let event publishing failure affect the application
        this.logger.error('Failed to create DeploymentFailed event', eventError as Error);
      }
    }

    // DO NOT throw - application continues running
    this.logger.info('DevOps failure handled gracefully - application continues');
  }

  /**
   * Handles environment registration failure.
   */
  handleEnvironmentRegistrationFailure(params: {
    name?: string;
    type?: string;
    error: Error;
  }): void {
    this.logger.error('Environment registration failed', params.error, {
      name: params.name,
      type: params.type,
      errorMessage: params.error.message,
    });

    if (this.eventBus) {
      try {
        const event = {
          eventType: 'EnvironmentRegistrationFailed',
          version: 1,
          data: {
            name: params.name ?? null,
            type: params.type ?? null,
            error: params.error.message,
            occurredAt: new Date(),
          },
        };
        this.eventBus.publish(event as any).catch((publishError) => {
          this.logger.error('Failed to publish EnvironmentRegistrationFailed event', publishError as Error);
        });
      } catch (eventError) {
        this.logger.error('Failed to create EnvironmentRegistrationFailed event', eventError as Error);
      }
    }

    // DO NOT throw
    this.logger.info('Environment registration failure handled gracefully - application continues');
  }

  /**
   * Handles infrastructure node registration failure.
   */
  handleInfrastructureNodeRegistrationFailure(params: {
    nodeName?: string;
    nodeType?: string;
    region?: string;
    error: Error;
  }): void {
    this.logger.error('Infrastructure node registration failed', params.error, {
      nodeName: params.nodeName,
      nodeType: params.nodeType,
      region: params.region,
      errorMessage: params.error.message,
    });

    if (this.eventBus) {
      try {
        const event = {
          eventType: 'InfrastructureNodeRegistrationFailed',
          version: 1,
          data: {
            nodeName: params.nodeName ?? null,
            nodeType: params.nodeType ?? null,
            region: params.region ?? null,
            error: params.error.message,
            occurredAt: new Date(),
          },
        };
        this.eventBus.publish(event as any).catch((publishError) => {
          this.logger.error('Failed to publish InfrastructureNodeRegistrationFailed event', publishError as Error);
        });
      } catch (eventError) {
        this.logger.error('Failed to create InfrastructureNodeRegistrationFailed event', eventError as Error);
      }
    }

    // DO NOT throw
    this.logger.info('Infrastructure node registration failure handled gracefully - application continues');
  }
}
