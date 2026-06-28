/**
 * Channel Mapper
 *
 * Maps between NotificationChannel entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { NotificationChannel, type NotificationChannelRecord } from '../entities/NotificationChannel';
import type {
  CreateNotificationChannelDto,
  UpdateNotificationChannelDto,
  QueryNotificationChannelDto,
} from '../dto/NotificationChannelDto';
import type { NotificationChannelResponseDto } from '../dto/NotificationResponse.dto';

/**
 * Mapper for converting between NotificationChannel entity and DTOs.
 */
export class ChannelMapper {
  /**
   * Converts a NotificationChannel entity to NotificationChannelResponseDto.
   */
  public static toResponse(channel: NotificationChannel): NotificationChannelResponseDto {
    return {
      channelId: channel.channelId.value,
      channelType: channel.channelType,
      isEnabled: channel.isEnabled,
      configuration: channel.configuration,
      metadata: channel.metadata,
    };
  }

  /**
   * Converts an array of NotificationChannel entities to NotificationChannelResponseDto array.
   */
  public static toResponseList(channels: NotificationChannel[]): NotificationChannelResponseDto[] {
    return channels.map((channel) => this.toResponse(channel));
  }

  /**
   * Converts a CreateNotificationChannelDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateNotificationChannelDto): Omit<CreateNotificationChannelDto, never> {
    return {
      channelType: dto.channelType,
      isEnabled: dto.isEnabled,
      configuration: dto.configuration,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateNotificationChannelDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateNotificationChannelDto): Partial<NotificationChannel> {
    return {
      isEnabled: dto.isEnabled,
      configuration: dto.configuration,
      metadata: dto.metadata,
    } as Partial<NotificationChannel>;
  }

  /**
   * Converts a database record to NotificationChannel entity.
   */
  public static fromRecord(record: NotificationChannelRecord): NotificationChannel {
    return NotificationChannel.fromDatabase(record);
  }

  /**
   * Converts a NotificationChannel entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(channel: NotificationChannel): Omit<NotificationChannelRecord, never> {
    return {
      channel_id: channel.channelId.value,
      channel_type: channel.channelType,
      is_enabled: channel.isEnabled,
      configuration: channel.configuration,
      metadata: channel.metadata,
    };
  }

  /**
   * Converts a QueryNotificationChannelDto to repository query filters.
   */
  public static toQueryFilters(dto: QueryNotificationChannelDto) {
    return {
      channelType: dto.channelType,
      isEnabled: dto.isEnabled,
      limit: dto.limit ?? 50,
    };
  }
}