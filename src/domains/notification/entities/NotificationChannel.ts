/**
 * NotificationChannel Entity
 *
 * Domain entity representing a configured notification delivery channel.
 * Channels define how notifications are delivered to players.
 *
 * NotificationChannel Entity Responsibilities:
 * - Store channel configuration
 * - Track channel enable/disable state
 * - Define channel-specific settings
 *
 * NotificationChannel Entity is NOT:
 * - A notification instance
 * - A template
 * - A delivery mechanism (that's handled by P-179.2)
 */

import type {
  INotificationChannel,
  NotificationChannelConfiguration,
  NotificationChannelMetadata,
} from '../interfaces/INotificationChannel';
import { ChannelId } from '../value-objects/ChannelId';
import { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * Default channel metadata.
 */
const DEFAULT_CHANNEL_METADATA: NotificationChannelMetadata = {
  name: '',
  schemaVersion: 1,
};

/**
 * Default channel configuration.
 */
const DEFAULT_CHANNEL_CONFIGURATION: NotificationChannelConfiguration = {
  enableBatching: false,
  batchSize: 100,
  batchIntervalMs: 60000,
  enableRetries: true,
  maxRetries: 3,
  retryDelayMs: 5000,
  trackReceipts: true,
};

/**
 * NotificationChannel entity class.
 * Immutable domain entity representing a notification delivery channel.
 */
export class NotificationChannel implements INotificationChannel {
  /** Unique channel identifier */
  public readonly channelId: ChannelId;

  /** Channel type */
  public readonly channelType: NotificationChannelType;

  /** Whether this channel is enabled */
  public readonly isEnabled: boolean;

  /** Channel-specific configuration */
  public readonly configuration: NotificationChannelConfiguration;

  /** Channel metadata */
  public readonly metadata: NotificationChannelMetadata;

  /**
   * Creates a new NotificationChannel instance.
   * @param props NotificationChannel properties
   */
  constructor(props: NotificationChannelProps) {
    this.channelId = props.channelId;
    this.channelType = props.channelType;
    this.isEnabled = props.isEnabled;
    this.configuration = props.configuration;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new NotificationChannel.
   * Factory method for channel creation.
   */
  public static create(params: {
    channelId: ChannelId;
    channelType: NotificationChannelType;
    configuration?: Partial<NotificationChannelConfiguration>;
    metadata?: Partial<NotificationChannelMetadata>;
  }): NotificationChannel {
    return new NotificationChannel({
      channelId: params.channelId,
      channelType: params.channelType,
      isEnabled: true,
      configuration: {
        ...DEFAULT_CHANNEL_CONFIGURATION,
        ...params.configuration,
      },
      metadata: {
        ...DEFAULT_CHANNEL_METADATA,
        ...params.metadata,
        schemaVersion: DEFAULT_CHANNEL_METADATA.schemaVersion,
      },
    });
  }

  /**
   * Creates a NotificationChannel from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: NotificationChannelRecord): NotificationChannel {
    return new NotificationChannel({
      channelId: ChannelId.reconstruct(record.channel_id),
      channelType: record.channel_type as NotificationChannelType,
      isEnabled: record.is_enabled,
      configuration: record.configuration ?? DEFAULT_CHANNEL_CONFIGURATION,
      metadata: record.metadata ?? DEFAULT_CHANNEL_METADATA,
    });
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new NotificationChannel instance.
   */
  public copyWith(params: Partial<NotificationChannelProps>): NotificationChannel {
    return new NotificationChannel({
      channelId: params.channelId ?? this.channelId,
      channelType: params.channelType ?? this.channelType,
      isEnabled: params.isEnabled ?? this.isEnabled,
      configuration: params.configuration ?? this.configuration,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Creates a copy with the channel enabled or disabled.
   * Returns a new NotificationChannel instance.
   */
  public setEnabled(enabled: boolean): NotificationChannel {
    return this.copyWith({ isEnabled: enabled });
  }

  /**
   * Serializes the NotificationChannel to a plain object.
   */
  public toJSON(): NotificationChannelJSON {
    return {
      channelId: this.channelId.value,
      channelType: this.channelType,
      isEnabled: this.isEnabled,
      configuration: this.configuration,
      metadata: this.metadata,
    };
  }
}

/**
 * NotificationChannel properties interface for constructor.
 */
export interface NotificationChannelProps {
  channelId: ChannelId;
  channelType: NotificationChannelType;
  isEnabled: boolean;
  configuration: NotificationChannelConfiguration;
  metadata: NotificationChannelMetadata;
}

/**
 * Database record representation of NotificationChannel.
 */
export interface NotificationChannelRecord {
  channel_id: string;
  channel_type: string;
  is_enabled: boolean;
  configuration: NotificationChannelConfiguration | null;
  metadata: NotificationChannelMetadata | null;
}

/**
 * JSON serialization representation of NotificationChannel.
 */
export interface NotificationChannelJSON {
  channelId: string;
  channelType: NotificationChannelType;
  isEnabled: boolean;
  configuration: NotificationChannelConfiguration;
  metadata: NotificationChannelMetadata;
}