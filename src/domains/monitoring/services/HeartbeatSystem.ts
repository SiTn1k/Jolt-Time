/**
 * HeartbeatSystem
 *
 * Manages service heartbeats for online/offline detection.
 * Heartbeats are tracked independently without affecting gameplay.
 */

import type { ILogger } from '../../../shared/types';
import { createLogger } from '../../../core/logging/logger.service';
import type { IMonitoringService } from './MonitoringService';
import { ServiceStatusType } from '../types/ServiceStatusType';
import type { MonitoringMetadata } from '../types/MonitoringMetadata';

/**
 * Heartbeat configuration.
 */
export interface HeartbeatConfig {
  /** Interval between heartbeats in milliseconds */
  intervalMs?: number;
  /** Threshold in milliseconds after which a service is considered offline */
  offlineThresholdMs?: number;
  /** Default metadata for heartbeat updates */
  defaultMetadata?: MonitoringMetadata;
}

/**
 * Service heartbeat state.
 */
export interface ServiceHeartbeatState {
  serviceName: string;
  lastHeartbeat: Date;
  status: ServiceStatusType;
  version?: string;
  consecutiveFailures: number;
  isOnline: boolean;
}

/**
 * Heartbeat event data.
 */
export interface HeartbeatEventData {
  serviceName: string;
  timestamp: Date;
  status: ServiceStatusType;
  isRecovery?: boolean;
}

/**
 * HeartbeatSystem manages service heartbeats for online/offline detection.
 * Heartbeats are passive and never affect gameplay.
 */
export class HeartbeatSystem {
  private readonly monitoringService: IMonitoringService;
  private readonly logger: ILogger;
  private readonly config: Required<HeartbeatConfig>;
  private readonly heartbeatStates: Map<string, ServiceHeartbeatState> = new Map();
  private heartbeatIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private offlineCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    monitoringService: IMonitoringService,
    config: HeartbeatConfig = {}
  ) {
    this.monitoringService = monitoringService;
    this.logger = createLogger('HeartbeatSystem');
    this.config = {
      intervalMs: config.intervalMs ?? 30000, // 30 seconds default
      offlineThresholdMs: config.offlineThresholdMs ?? 90000, // 90 seconds default (3x interval)
      defaultMetadata: config.defaultMetadata ?? { tags: [] },
    };
  }

  /**
   * Starts heartbeat tracking for a service.
   */
  async startTracking(serviceName: string, version?: string): Promise<void> {
    this.logger.info('Starting heartbeat tracking', { serviceName, version });

    // Record initial heartbeat
    await this.sendHeartbeat(serviceName, version);

    // Set up periodic heartbeat
    const intervalId = setInterval(async () => {
      await this.sendHeartbeat(serviceName, version);
    }, this.config.intervalMs);

    this.heartbeatIntervals.set(serviceName, intervalId);

    // Initialize state
    this.heartbeatStates.set(serviceName, {
      serviceName,
      lastHeartbeat: new Date(),
      status: ServiceStatusType.ONLINE,
      version,
      consecutiveFailures: 0,
      isOnline: true,
    });
  }

  /**
   * Stops heartbeat tracking for a service.
   */
  stopTracking(serviceName: string): void {
    this.logger.info('Stopping heartbeat tracking', { serviceName });

    const intervalId = this.heartbeatIntervals.get(serviceName);
    if (intervalId) {
      clearInterval(intervalId);
      this.heartbeatIntervals.delete(serviceName);
    }

    // Update status to offline
    this.updateServiceStatusOffline(serviceName);

    // Remove state
    this.heartbeatStates.delete(serviceName);
  }

  /**
   * Sends a heartbeat for a service.
   */
  async sendHeartbeat(serviceName: string, version?: string): Promise<void> {
    try {
      const serviceStatus = await this.monitoringService.recordHeartbeat(serviceName, version);

      // Update local state
      const state = this.heartbeatStates.get(serviceName);
      if (state) {
        state.lastHeartbeat = new Date();
        state.status = serviceStatus.status;
        state.version = version ?? state.version;
        state.consecutiveFailures = 0;
        state.isOnline = true;
      } else {
        this.heartbeatStates.set(serviceName, {
          serviceName,
          lastHeartbeat: new Date(),
          status: ServiceStatusType.ONLINE,
          version,
          consecutiveFailures: 0,
          isOnline: true,
        });
      }

      this.logger.debug('Heartbeat sent', { serviceName, version });
    } catch (err) {
      // Heartbeat failure must not affect gameplay
      this.logger.error('Failed to send heartbeat', err as Error, { serviceName });

      // Update failure count
      const state = this.heartbeatStates.get(serviceName);
      if (state) {
        state.consecutiveFailures++;
      }
    }
  }

  /**
   * Starts the offline detection check.
   */
  startOfflineDetection(): void {
    if (this.offlineCheckInterval) {
      return; // Already running
    }

    this.logger.info('Starting offline detection');

    this.offlineCheckInterval = setInterval(async () => {
      await this.checkForOfflineServices();
    }, this.config.intervalMs);
  }

  /**
   * Stops the offline detection check.
   */
  stopOfflineDetection(): void {
    if (this.offlineCheckInterval) {
      clearInterval(this.offlineCheckInterval);
      this.offlineCheckInterval = null;
      this.logger.info('Stopped offline detection');
    }
  }

  /**
   * Gets the heartbeat state for a service.
   */
  getHeartbeatState(serviceName: string): ServiceHeartbeatState | null {
    return this.heartbeatStates.get(serviceName) ?? null;
  }

  /**
   * Gets all heartbeat states.
   */
  getAllHeartbeatStates(): ServiceHeartbeatState[] {
    return Array.from(this.heartbeatStates.values());
  }

  /**
   * Gets heartbeat statistics.
   */
  getHeartbeatStatistics(): {
    totalServices: number;
    onlineServices: number;
    offlineServices: number;
    averageTimeSinceLastHeartbeat: number;
  } {
    const states = this.getAllHeartbeatStates();
    const now = Date.now();

    const onlineServices = states.filter((s) => s.isOnline).length;
    const offlineServices = states.filter((s) => !s.isOnline).length;

    let totalTimeSinceHeartbeat = 0;
    for (const state of states) {
      totalTimeSinceHeartbeat += now - state.lastHeartbeat.getTime();
    }

    const avgTimeSinceHeartbeat = states.length > 0
      ? totalTimeSinceHeartbeat / states.length
      : 0;

    return {
      totalServices: states.length,
      onlineServices,
      offlineServices,
      averageTimeSinceLastHeartbeat: avgTimeSinceHeartbeat,
    };
  }

  /**
   * Checks for offline services and updates their status.
   */
  private async checkForOfflineServices(): Promise<void> {
    const now = Date.now();
    const threshold = this.config.offlineThresholdMs;

    for (const [serviceName, state] of this.heartbeatStates) {
      const timeSinceHeartbeat = now - state.lastHeartbeat.getTime();

      if (timeSinceHeartbeat > threshold && state.isOnline) {
        this.logger.warn('Service marked as offline due to missing heartbeats', {
          serviceName,
          timeSinceHeartbeat,
          threshold,
        });

        state.isOnline = false;
        state.status = ServiceStatusType.OFFLINE;

        // Update status in repository
        await this.updateServiceStatusOffline(serviceName);

        // Emit recovery detection event if service comes back
        // This is tracked for statistics purposes only
      } else if (timeSinceHeartbeat <= threshold && !state.isOnline) {
        // Service came back online
        this.logger.info('Service recovered (heartbeat received)', { serviceName });

        state.isOnline = true;
        state.status = ServiceStatusType.ONLINE;
        state.consecutiveFailures = 0;

        // Update status in repository
        await this.monitoringService.updateServiceStatus({
          serviceName,
          status: ServiceStatusType.ONLINE,
          version: state.version,
          metadata: {
            ...this.config.defaultMetadata,
            description: 'Service recovered - heartbeat received',
          },
        });
      }
    }
  }

  /**
   * Updates service status to offline.
   */
  private async updateServiceStatusOffline(serviceName: string): Promise<void> {
    try {
      await this.monitoringService.updateServiceStatus({
        serviceName,
        status: ServiceStatusType.OFFLINE,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'Service marked offline - heartbeat timeout',
        },
      });
    } catch (err) {
      // Must never affect gameplay
      this.logger.error('Failed to update service status to offline', err as Error, { serviceName });
    }
  }

  /**
   * Stops all heartbeat tracking.
   */
  stopAll(): void {
    this.logger.info('Stopping all heartbeat tracking');

    // Clear all intervals
    for (const [serviceName, intervalId] of this.heartbeatIntervals) {
      clearInterval(intervalId);
      this.updateServiceStatusOffline(serviceName);
    }
    this.heartbeatIntervals.clear();

    // Stop offline detection
    this.stopOfflineDetection();

    // Clear states
    this.heartbeatStates.clear();
  }
}

/**
 * Creates a HeartbeatSystem instance.
 */
export function createHeartbeatSystem(
  monitoringService: IMonitoringService,
  config?: HeartbeatConfig
): HeartbeatSystem {
  return new HeartbeatSystem(monitoringService, config);
}
