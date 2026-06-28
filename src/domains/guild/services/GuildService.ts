/**
 * Guild Service
 *
 * Domain service for Guild business logic.
 * Guild is the central social system managing players, roles, and permissions.
 * Guild NEVER directly modifies other gameplay domains.
 */

import type { IGuildRepository, GuildFilterParams, GuildMemberFilterParams } from '../interfaces/IGuildRepository';
import { Guild } from '../entities/Guild';
import { GuildMember } from '../entities/GuildMember';
import { GuildId } from '../value-objects/GuildId';
import { GuildSlug } from '../value-objects/GuildSlug';
import { GuildName } from '../value-objects/GuildName';
import type {
  GuildRoleType,
  GuildStatistics,
  GuildMemberStatistics,
} from '../types';
import {
  DEFAULT_GUILD_ROLE,
  GUILD_ROLE_PRIORITY,
  hasManagementPrivileges,
  canManageOfficers,
  canKickMembers,
  hasPermission,
  DEFAULT_ROLE_PERMISSIONS,
} from '../types';
import { createEmptyGuildStatistics } from '../types/GuildStatistics';
import { createDefaultGuildMetadata } from '../types/GuildMetadata';
import { GuildMapper } from '../mappers/GuildMapper';
import { MemberMapper } from '../mappers/MemberMapper';
import { GuildValidator } from '../validators/GuildValidator';
import { GuildMemberValidator } from '../validators/GuildMemberValidator';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type {
  CreateGuildDto,
  GuildResponseDto,
  GuildSummaryDto,
  GuildListResponseDto,
  GuildDetailResponseDto,
  GuildMemberDto,
  GuildMemberSummaryDto,
} from '../dto';
import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';

/**
 * Errors for guild operations.
 */
export class GuildError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GuildError';
  }
}

/**
 * Guild Service for managing guild operations.
 * This is the central social system that manages communities.
 */
export class GuildService {
  private readonly repository: IGuildRepository;
  private readonly logger: ILogger;

  /**
   * Creates a new GuildService instance.
   */
  constructor(repository: IGuildRepository, logger?: ILogger) {
    this.repository = repository;
    this.logger = logger ?? getLogger().child({ module: 'GuildService' });
  }

  // #region Guild Creation and Management

  /**
   * Creates a new guild with the owner as leader.
   * Automatically creates owner membership with leader role.
   */
  async createGuild(dto: CreateGuildDto): Promise<GuildResponseDto> {
    this.logger.debug('Creating guild', { slug: dto.slug, ownerPlayerId: dto.ownerPlayerId });

    // Validate owner player ID
    if (!GuildMemberValidator.isValidPlayerProfileId(dto.ownerPlayerId)) {
      throw new GuildError('Invalid owner player ID format');
    }

    // Validate slug
    if (!GuildValidator.isValidSlug(dto.slug)) {
      throw new GuildError('Invalid guild slug format');
    }

    // Check if slug is already taken
    const slug = GuildSlug.create(dto.slug);
    if (await this.repository.slugExists(slug)) {
      throw new GuildError('Guild slug is already taken');
    }

    // Check if player is already in a guild
    if (await this.repository.isPlayerInGuild(dto.ownerPlayerId)) {
      throw new GuildError('Player is already a member of a guild');
    }

    // Validate name
    const name = GuildName.create(dto.name);

    // Create guild entity
    const guild = Guild.create({
      slug,
      name,
      description: dto.description,
      ownerPlayerId: dto.ownerPlayerId,
      privacy: dto.privacy,
      metadata: dto.metadata,
    });

    // Save guild
    const createdGuild = await this.repository.create(guild);

    // Create owner as leader member
    const ownerMember = GuildMember.create({
      guildId: createdGuild.guildId,
      playerProfileId: dto.ownerPlayerId,
      role: 'leader',
    });

    await this.repository.createMember(ownerMember);

    // Get member count
    const memberCount = await this.repository.countMembers(createdGuild.guildId);

    this.logger.info('Guild created successfully', {
      guildId: createdGuild.guildId.value,
      slug: createdGuild.slug.value,
    });

    return GuildMapper.toResponse(createdGuild, memberCount);
  }

  /**
   * Loads a guild by ID.
   */
  async loadGuild(guildId: string): Promise<GuildResponseDto | null> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      return null;
    }

    const memberCount = await this.repository.countMembers(id);
    return GuildMapper.toResponse(guild, memberCount);
  }

  /**
   * Loads a guild by slug.
   */
  async loadGuildBySlug(slug: string): Promise<GuildResponseDto | null> {
    if (!GuildValidator.isValidSlug(slug)) {
      throw new GuildError('Invalid guild slug format');
    }

    const guildSlug = GuildSlug.reconstruct(slug);
    const guild = await this.repository.findBySlug(guildSlug);

    if (!guild) {
      return null;
    }

    const memberCount = await this.repository.countMembers(guild.guildId);
    return GuildMapper.toResponse(guild, memberCount);
  }

  /**
   * Gets guild details with members.
   */
  async getGuildDetails(guildId: string): Promise<GuildDetailResponseDto | null> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      return null;
    }

    const memberCount = await this.repository.countMembers(id);
    const members = await this.repository.findMembersByGuildId(id, { page: 1, pageSize: 100 });

    const response = GuildMapper.toResponse(guild, memberCount);
    const memberSummaries = MemberMapper.toSummaryArray(members.items);

    return {
      ...response,
      members: memberSummaries,
    };
  }

  /**
   * Lists guilds with pagination and filtering.
   */
  async listGuilds(
    params: PaginationParams,
    filters?: GuildFilterParams
  ): Promise<GuildListResponseDto> {
    const result = await this.repository.list(params, filters);

    // Get member counts for all guilds
    const memberCounts = new Map<string, number>();
    for (const guild of result.items) {
      const count = await this.repository.countMembers(guild.guildId);
      memberCounts.set(guild.guildId.value, count);
    }

    return GuildMapper.toListResponse(result.items, memberCounts, result.total, result.page, result.pageSize);
  }

  /**
   * Updates a guild.
   */
  async updateGuild(
    guildId: string,
    playerProfileId: string,
    updates: {
      name?: string;
      description?: string;
      privacy?: 'public' | 'private';
      metadata?: Record<string, unknown>;
    }
  ): Promise<GuildResponseDto> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      throw new GuildError('Guild not found');
    }

    // Check if player is the owner
    if (guild.ownerPlayerId !== playerProfileId) {
      // Check if player has permission to edit
      const member = await this.repository.findMemberByPlayerAndGuild(playerProfileId, id);
      if (!member || !hasPermission(member.role, 'guild:edit_name')) {
        throw new GuildError('Only the guild owner can update guild details');
      }
    }

    // Apply updates
    const updatedGuild = guild.copyWith({
      name: updates.name ? GuildName.create(updates.name) : undefined,
      description: updates.description,
      privacy: updates.privacy,
      metadata: updates.metadata,
    });

    const savedGuild = await this.repository.update(updatedGuild);
    const memberCount = await this.repository.countMembers(id);

    this.logger.info('Guild updated', { guildId: id.value, updatedBy: playerProfileId });

    return GuildMapper.toResponse(savedGuild, memberCount);
  }

  /**
   * Deletes a guild. Only owner can delete.
   */
  async deleteGuild(guildId: string, playerProfileId: string): Promise<void> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      throw new GuildError('Guild not found');
    }

    if (guild.ownerPlayerId !== playerProfileId) {
      throw new GuildError('Only the guild owner can delete the guild');
    }

    await this.repository.delete(id);

    this.logger.info('Guild deleted', { guildId: id.value, deletedBy: playerProfileId });
  }

  // #endregion

  // #region Membership Management

  /**
   * Joins a player to a guild.
   */
  async joinGuild(guildId: string, playerProfileId: string): Promise<GuildMemberDto> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    if (!GuildMemberValidator.isValidPlayerProfileId(playerProfileId)) {
      throw new GuildError('Invalid player profile ID format');
    }

    const id = GuildId.reconstruct(guildId);

    // Check if guild exists
    const guild = await this.repository.findById(id);
    if (!guild) {
      throw new GuildError('Guild not found');
    }

    // Check if player is already in a guild
    if (await this.repository.isPlayerInGuild(playerProfileId)) {
      throw new GuildError('Player is already a member of a guild');
    }

    // Check member limit
    const currentCount = await this.repository.countMembers(id);
    if (currentCount >= guild.memberLimit) {
      throw new GuildError('Guild has reached its member limit');
    }

    // Create member with default role
    const member = GuildMember.create({
      guildId: id,
      playerProfileId,
      role: DEFAULT_GUILD_ROLE,
    });

    const createdMember = await this.repository.createMember(member);

    // Update guild statistics
    const updatedGuild = guild.copyWith({
      statistics: {
        ...guild.statistics,
        totalMembersJoined: guild.statistics.totalMembersJoined + 1,
      },
    });
    await this.repository.update(updatedGuild);

    this.logger.info('Player joined guild', {
      playerProfileId,
      guildId: id.value,
    });

    return MemberMapper.toDto(createdMember);
  }

  /**
   * Leaves a guild.
   */
  async leaveGuild(guildId: string, playerProfileId: string): Promise<void> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      throw new GuildError('Guild not found');
    }

    const member = await this.repository.findMemberByPlayerAndGuild(playerProfileId, id);
    if (!member) {
      throw new GuildError('Player is not a member of this guild');
    }

    // Cannot leave if you're the owner - must transfer ownership first
    if (member.role === 'leader') {
      throw new GuildError('Guild owner cannot leave. Transfer ownership first.');
    }

    // Delete member
    await this.repository.deleteMember(String(member.memberId));

    // Update guild statistics
    const updatedGuild = guild.copyWith({
      statistics: {
        ...guild.statistics,
        totalMembersLeft: guild.statistics.totalMembersLeft + 1,
      },
    });
    await this.repository.update(updatedGuild);

    this.logger.info('Player left guild', {
      playerProfileId,
      guildId: id.value,
    });
  }

  /**
   * Kicks a member from the guild.
   */
  async kickMember(
    guildId: string,
    requesterProfileId: string,
    targetProfileId: string
  ): Promise<void> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      throw new GuildError('Guild not found');
    }

    const requester = await this.repository.findMemberByPlayerAndGuild(requesterProfileId, id);
    if (!requester) {
      throw new GuildError('Requester is not a member of this guild');
    }

    const target = await this.repository.findMemberByPlayerAndGuild(targetProfileId, id);
    if (!target) {
      throw new GuildError('Target is not a member of this guild');
    }

    // Check if requester can kick target
    if (!canKickMembers(requester.role, target.role)) {
      throw new GuildError('You do not have permission to kick this member');
    }

    // Cannot kick the owner
    if (target.role === 'leader') {
      throw new GuildError('Cannot kick the guild owner');
    }

    // Cannot kick officers unless you're the leader
    if (!canManageOfficers(requester.role) && target.role === 'officer') {
      throw new GuildError('Only the guild leader can kick officers');
    }

    // Delete member
    await this.repository.deleteMember(String(target.memberId));

    // Update guild statistics
    const updatedGuild = guild.copyWith({
      statistics: {
        ...guild.statistics,
        totalMembersLeft: guild.statistics.totalMembersLeft + 1,
      },
    });
    await this.repository.update(updatedGuild);

    this.logger.info('Member kicked from guild', {
      kickedProfileId: targetProfileId,
      guildId: id.value,
      kickedBy: requesterProfileId,
    });
  }

  // #endregion

  // #region Role Management

  /**
   * Changes a member's role.
   */
  async changeMemberRole(
    guildId: string,
    requesterProfileId: string,
    targetProfileId: string,
    newRole: GuildRoleType
  ): Promise<GuildMemberDto> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    if (!GuildMemberValidator.isValidRole(newRole)) {
      throw new GuildError('Invalid role type');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      throw new GuildError('Guild not found');
    }

    const requester = await this.repository.findMemberByPlayerAndGuild(requesterProfileId, id);
    if (!requester) {
      throw new GuildError('Requester is not a member of this guild');
    }

    const target = await this.repository.findMemberByPlayerAndGuild(targetProfileId, id);
    if (!target) {
      throw new GuildError('Target is not a member of this guild');
    }

    // Check permissions for role changes
    if (newRole === 'officer') {
      // Promoting to officer - only leader can do this
      if (!canManageOfficers(requester.role)) {
        throw new GuildError('Only the guild leader can promote to officer');
      }
    } else if (newRole === 'member' && target.role === 'officer') {
      // Demoting from officer - only leader can do this
      if (!canManageOfficers(requester.role)) {
        throw new GuildError('Only the guild leader can demote officers');
      }
    }

    // Cannot change owner's role
    if (target.role === 'leader') {
      throw new GuildError('Cannot change the guild owner\'s role');
    }

    // Update member role
    const updatedMember = target.copyWith({ role: newRole });
    const savedMember = await this.repository.updateMember(updatedMember);

    this.logger.info('Member role changed', {
      targetProfileId,
      guildId: id.value,
      newRole,
      changedBy: requesterProfileId,
    });

    return MemberMapper.toDto(savedMember);
  }

  /**
   * Transfers guild ownership to another member.
   */
  async transferOwnership(
    guildId: string,
    currentOwnerProfileId: string,
    newOwnerProfileId: string
  ): Promise<GuildResponseDto> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      throw new GuildError('Guild not found');
    }

    if (guild.ownerPlayerId !== currentOwnerProfileId) {
      throw new GuildError('Only the current owner can transfer ownership');
    }

    const newOwnerMember = await this.repository.findMemberByPlayerAndGuild(newOwnerProfileId, id);
    if (!newOwnerMember) {
      throw new GuildError('New owner must be a member of the guild');
    }

    // Update guild owner
    const updatedGuild = guild.copyWith({ ownerPlayerId: newOwnerProfileId });
    const savedGuild = await this.repository.update(updatedGuild);

    // Demote old owner to officer
    const oldOwnerMember = await this.repository.findMemberByPlayerAndGuild(currentOwnerProfileId, id);
    if (oldOwnerMember) {
      const demotedMember = oldOwnerMember.copyWith({ role: 'officer' });
      await this.repository.updateMember(demotedMember);
    }

    // Promote new owner to leader
    const promotedMember = newOwnerMember.copyWith({ role: 'leader' });
    await this.repository.updateMember(promotedMember);

    const memberCount = await this.repository.countMembers(id);

    this.logger.info('Guild ownership transferred', {
      guildId: id.value,
      oldOwner: currentOwnerProfileId,
      newOwner: newOwnerProfileId,
    });

    return GuildMapper.toResponse(savedGuild, memberCount);
  }

  // #endregion

  // #region Statistics and Queries

  /**
   * Gets guild summary.
   */
  async getGuildSummary(guildId: string): Promise<GuildSummaryDto | null> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      return null;
    }

    const memberCount = await this.repository.countMembers(id);
    return GuildMapper.toSummary(guild, memberCount);
  }

  /**
   * Gets member summary.
   */
  async getMemberSummary(guildId: string, playerProfileId: string): Promise<GuildMemberSummaryDto | null> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const member = await this.repository.findMemberByPlayerAndGuild(playerProfileId, id);

    if (!member) {
      return null;
    }

    return MemberMapper.toSummary(member);
  }

  /**
   * Gets all guild members.
   */
  async getGuildMembers(
    guildId: string,
    params?: PaginationParams,
    filters?: GuildMemberFilterParams
  ): Promise<PaginatedResult<GuildMember>> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    return this.repository.findMembersByGuildId(id, params, filters);
  }

  /**
   * Gets guild statistics.
   */
  async getGuildStatistics(guildId: string): Promise<GuildStatistics | null> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      throw new GuildError('Invalid guild ID format');
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      return null;
    }

    const memberCount = await this.repository.countMembers(id);

    return {
      ...guild.statistics,
      activeMembersCount: memberCount, // Simplified - real implementation would track active members
    };
  }

  /**
   * Gets guild by owner.
   */
  async getGuildByOwner(playerProfileId: string): Promise<GuildResponseDto | null> {
    const guild = await this.repository.findByOwner(playerProfileId);

    if (!guild) {
      return null;
    }

    const memberCount = await this.repository.countMembers(guild.guildId);
    return GuildMapper.toResponse(guild, memberCount);
  }

  /**
   * Gets player's guild membership.
   */
  async getPlayerGuild(playerProfileId: string): Promise<{
    guild: GuildResponseDto;
    member: GuildMemberDto;
  } | null> {
    const guildId = await this.repository.getPlayerGuildId(playerProfileId);

    if (!guildId) {
      return null;
    }

    const guild = await this.repository.findById(guildId);
    if (!guild) {
      return null;
    }

    const member = await this.repository.findMemberByPlayerAndGuild(playerProfileId, guildId);
    if (!member) {
      return null;
    }

    const memberCount = await this.repository.countMembers(guildId);

    return {
      guild: GuildMapper.toResponse(guild, memberCount),
      member: MemberMapper.toDto(member),
    };
  }

  // #endregion

  // #region Permission Checks

  /**
   * Checks if a player can perform an action in a guild.
   */
  async canPerformAction(
    playerProfileId: string,
    guildId: string,
    action: 'invite' | 'kick' | 'edit' | 'transfer' | 'manage_roles' | 'view'
  ): Promise<boolean> {
    if (!GuildValidator.isValidGuildId(guildId)) {
      return false;
    }

    const id = GuildId.reconstruct(guildId);
    const guild = await this.repository.findById(id);

    if (!guild) {
      return false;
    }

    // Owner can do anything
    if (guild.ownerPlayerId === playerProfileId) {
      return true;
    }

    const member = await this.repository.findMemberByPlayerAndGuild(playerProfileId, id);
    if (!member) {
      return false;
    }

    const permissionMap: Record<string, 'guild:invite_member' | 'guild:kick_member' | 'guild:edit_name' | 'guild:transfer_leadership' | 'guild:promote_officer' | 'guild:view_statistics'> = {
      invite: 'guild:invite_member',
      kick: 'guild:kick_member',
      edit: 'guild:edit_name',
      transfer: 'guild:transfer_leadership',
      manage_roles: 'guild:promote_officer',
      view: 'guild:view_statistics',
    };

    return hasPermission(member.role, permissionMap[action]);
  }

  // #endregion
}

/**
 * Creates a GuildService with dependencies.
 */
export function createGuildService(repository: IGuildRepository): GuildService {
  return new GuildService(repository);
}
