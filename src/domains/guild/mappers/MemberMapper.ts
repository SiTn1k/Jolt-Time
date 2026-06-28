/**
 * Member Mapper
 *
 * Maps between GuildMember entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { GuildMember } from '../entities/GuildMember';
import type { GuildMemberRecord } from '../entities/GuildMember';
import type { GuildMemberDto, GuildMemberSummaryDto } from '../dto/GuildMember.dto';

/**
 * Mapper for converting between GuildMember entity and DTOs.
 */
export class MemberMapper {
  /**
   * Converts a GuildMember entity to GuildMemberDto.
   */
  public static toDto(member: GuildMember): GuildMemberDto {
    return {
      memberId: String(member.memberId),
      guildId: member.guildId.value,
      playerProfileId: member.playerProfileId,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
      lastActiveAt: member.lastActiveAt.toISOString(),
      statistics: member.statistics,
    };
  }

  /**
   * Converts a GuildMember entity to GuildMemberSummaryDto.
   */
  public static toSummary(
    member: GuildMember,
    playerNickname?: string,
    playerLevel?: number
  ): GuildMemberSummaryDto {
    return {
      memberId: String(member.memberId),
      playerProfileId: member.playerProfileId,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
      lastActiveAt: member.lastActiveAt.toISOString(),
      playerNickname,
      playerLevel,
    };
  }

  /**
   * Converts a GuildMember entity to a database record format.
   */
  public static toRecord(member: GuildMember): GuildMemberRecord {
    return member.toRecord();
  }

  /**
   * Converts a database record to GuildMemberDto.
   */
  public static fromRecordToDto(record: GuildMemberRecord): GuildMemberDto {
    return {
      memberId: record.memberId,
      guildId: record.guildId,
      playerProfileId: record.playerProfileId,
      role: record.role,
      joinedAt: record.joinedAt,
      lastActiveAt: record.lastActiveAt,
      statistics: record.statistics,
    };
  }

  /**
   * Converts an array of GuildMember entities to GuildMemberSummaryDto array.
   */
  public static toSummaryArray(
    members: GuildMember[],
    playerInfo?: Map<string, { nickname?: string; level?: number }>
  ): GuildMemberSummaryDto[] {
    return members.map((member) => {
      const info = playerInfo?.get(member.playerProfileId);
      return this.toSummary(member, info?.nickname, info?.level);
    });
  }
}
