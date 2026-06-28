/**
 * Guild Mapper
 *
 * Maps between Guild entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { Guild } from '../entities/Guild';
import type { GuildRecord } from '../entities/Guild';
import type { CreateGuildDto } from '../dto/CreateGuild.dto';
import type {
  GuildResponseDto,
  GuildSummaryDto,
  GuildListResponseDto,
  GuildDetailResponseDto,
} from '../dto/GuildResponse.dto';
import { GuildSlug } from '../value-objects/GuildSlug';
import { GuildName } from '../value-objects/GuildName';

/**
 * Mapper for converting between Guild entity and DTOs.
 */
export class GuildMapper {
  /**
   * Converts a Guild entity to GuildResponseDto.
   */
  public static toResponse(guild: Guild, memberCount: number = 0): GuildResponseDto {
    return {
      guildId: guild.guildId.value,
      slug: guild.slug.value,
      name: guild.name.value,
      description: guild.description,
      ownerPlayerId: guild.ownerPlayerId,
      guildLevel: guild.guildLevel.value,
      guildExperience: guild.guildExperience,
      memberLimit: guild.memberLimit,
      memberCount,
      privacy: guild.privacy,
      status: 'active',
      statistics: guild.statistics,
      metadata: guild.metadata,
      createdAt: guild.createdAt.toISOString(),
      updatedAt: guild.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a Guild entity to GuildSummaryDto.
   */
  public static toSummary(guild: Guild, memberCount: number = 0): GuildSummaryDto {
    return {
      guildId: guild.guildId.value,
      slug: guild.slug.value,
      name: guild.name.value,
      guildLevel: guild.guildLevel.value,
      memberCount,
      memberLimit: guild.memberLimit,
      privacy: guild.privacy,
      iconPreset: guild.metadata.iconPreset,
    };
  }

  /**
   * Converts a Guild entity to a database record format.
   */
  public static toRecord(guild: Guild): GuildRecord {
    return guild.toRecord();
  }

  /**
   * Converts a database record to GuildResponseDto.
   */
  public static fromRecordToDto(record: GuildRecord, memberCount: number = 0): GuildResponseDto {
    return {
      guildId: record.guildId,
      slug: record.slug,
      name: record.name,
      description: record.description,
      ownerPlayerId: record.ownerPlayerId,
      guildLevel: record.guildLevel,
      guildExperience: record.guildExperience,
      memberLimit: record.memberLimit,
      memberCount,
      privacy: record.privacy,
      status: 'active',
      statistics: record.statistics,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of Guild entities to GuildListResponseDto.
   */
  public static toListResponse(
    guilds: Guild[],
    memberCounts: Map<string, number>,
    total: number,
    page: number,
    pageSize: number
  ): GuildListResponseDto {
    return {
      guilds: guilds.map((guild) => this.toSummary(guild, memberCounts.get(guild.guildId.value) ?? 0)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateGuildDto to Guild entity creation params.
   */
  public static fromCreateDto(dto: CreateGuildDto): {
    slug: GuildSlug;
    name: GuildName;
    description: string;
    ownerPlayerId: string;
    privacy: 'public' | 'private';
  } {
    return {
      slug: GuildSlug.create(dto.slug),
      name: GuildName.create(dto.name),
      description: dto.description ?? '',
      ownerPlayerId: dto.ownerPlayerId,
      privacy: dto.privacy ?? 'public',
    };
  }
}
