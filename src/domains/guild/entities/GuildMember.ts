/**
 * GuildMember Entity
 *
 * Domain entity representing a guild member.
 * Represents the membership relationship between a player and guild.
 */

import type { IGuildMember } from '../interfaces/IGuildMember';
import { GuildMemberId } from './GuildMemberId';
import { GuildId } from '../value-objects/GuildId';
import type { GuildRoleType } from '../types/GuildRoleType';
import type { GuildMemberStatistics } from '../types/GuildStatistics';

/**
 * GuildMember entity props for constructor.
 */
export interface GuildMemberProps {
  memberId: GuildMemberId;
  guildId: GuildId;
  playerProfileId: string;
  role: GuildRoleType;
  joinedAt: Date;
  lastActiveAt: Date;
  statistics: GuildMemberStatistics;
  metadata: Record<string, unknown>;
}

/**
 * Database record representation of GuildMember.
 */
export interface GuildMemberRecord {
  memberId: string;
  guildId: string;
  playerProfileId: string;
  role: GuildRoleType;
  joinedAt: string;
  lastActiveAt: string;
  statistics: GuildMemberStatistics;
  metadata: Record<string, unknown>;
}

/**
 * JSON serialization representation of GuildMember.
 */
export interface GuildMemberJSON {
  memberId: string;
  guildId: string;
  playerProfileId: string;
  role: GuildRoleType;
  joinedAt: string;
  lastActiveAt: string;
  statistics: GuildMemberStatistics;
  metadata: Record<string, unknown>;
}

/**
 * GuildMember entity class.
 * Immutable domain entity representing a guild membership.
 */
export class GuildMember implements IGuildMember {
  public readonly memberId: GuildMemberId;
  public readonly guildId: GuildId;
  public readonly playerProfileId: string;
  public readonly role: GuildRoleType;
  public readonly joinedAt: Date;
  public readonly lastActiveAt: Date;
  public readonly statistics: GuildMemberStatistics;
  public readonly metadata: Record<string, unknown>;

  /**
   * Creates a new GuildMember instance.
   */
  constructor(props: GuildMemberProps) {
    this.memberId = props.memberId;
    this.guildId = props.guildId;
    this.playerProfileId = props.playerProfileId;
    this.role = props.role;
    this.joinedAt = props.joinedAt;
    this.lastActiveAt = props.lastActiveAt;
    this.statistics = props.statistics;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new GuildMember entity.
   */
  public static create(params: {
    guildId: GuildId;
    playerProfileId: string;
    role?: GuildRoleType;
  }): GuildMember {
    const now = new Date();

    return new GuildMember({
      memberId: GuildMemberId.create(),
      guildId: params.guildId,
      playerProfileId: params.playerProfileId,
      role: params.role ?? 'member',
      joinedAt: now,
      lastActiveAt: now,
      statistics: {
        missionsCompleted: 0,
        battlesWon: 0,
        warContributions: 0,
        resourcesDonated: 0,
        dailyLogins: 1,
      },
      metadata: {},
    });
  }

  /**
   * Reconstructs a GuildMember from stored data.
   */
  public static fromStorage(record: GuildMemberRecord): GuildMember {
    return new GuildMember({
      memberId: GuildMemberId.reconstruct(record.memberId),
      guildId: GuildId.reconstruct(record.guildId),
      playerProfileId: record.playerProfileId,
      role: record.role,
      joinedAt: new Date(record.joinedAt),
      lastActiveAt: new Date(record.lastActiveAt),
      statistics: record.statistics,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if member is the guild leader.
   */
  public get isLeader(): boolean {
    return this.role === 'leader';
  }

  /**
   * Checks if member is an officer.
   */
  public get isOfficer(): boolean {
    return this.role === 'officer';
  }

  /**
   * Checks if member is a regular member.
   */
  public get isMember(): boolean {
    return this.role === 'member';
  }

  /**
   * Checks if member has management privileges.
   */
  public get hasManagementPrivileges(): boolean {
    return this.role === 'leader' || this.role === 'officer';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<GuildMemberProps, 'memberId' | 'guildId' | 'playerProfileId' | 'joinedAt'>>): GuildMember {
    return new GuildMember({
      memberId: this.memberId,
      guildId: this.guildId,
      playerProfileId: this.playerProfileId,
      role: params.role ?? this.role,
      joinedAt: this.joinedAt,
      lastActiveAt: params.lastActiveAt ?? new Date(),
      statistics: params.statistics ?? this.statistics,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the GuildMember to a plain object.
   */
  public toJSON(): GuildMemberJSON {
    return {
      memberId: String(this.memberId),
      guildId: this.guildId.value,
      playerProfileId: this.playerProfileId,
      role: this.role,
      joinedAt: this.joinedAt.toISOString(),
      lastActiveAt: this.lastActiveAt.toISOString(),
      statistics: this.statistics,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): GuildMemberRecord {
    return {
      memberId: String(this.memberId),
      guildId: this.guildId.value,
      playerProfileId: this.playerProfileId,
      role: this.role,
      joinedAt: this.joinedAt.toISOString(),
      lastActiveAt: this.lastActiveAt.toISOString(),
      statistics: this.statistics,
      metadata: this.metadata,
    };
  }
}
