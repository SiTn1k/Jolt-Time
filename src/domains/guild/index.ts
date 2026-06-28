/**
 * Guild Domain Index
 *
 * Main entry point for the Guild domain.
 */

// Entities
export { Guild, GuildMember, GuildRole } from './entities';
export type { GuildProps, GuildRecord, GuildJSON } from './entities/Guild';
export type { GuildMemberProps, GuildMemberRecord, GuildMemberJSON } from './entities/GuildMember';
export type { GuildRoleProps, GuildRoleRecord, GuildRoleJSON } from './entities/GuildRole';
export { GuildMemberId } from './entities/GuildMemberId';
export { GuildRoleId } from './entities/GuildRoleId';

// Value Objects
export { GuildId, GuildSlug, GuildName, GuildLevel, MemberLimit } from './value-objects';
export { GUILD_LEVEL_THRESHOLDS } from './value-objects/GuildLevel';
export { MEMBER_LIMITS, OFFICER_LIMITS } from './value-objects/MemberLimit';

// Types
export type {
  GuildRoleType,
  GuildPermission,
  GuildMetadata,
  GuildIconPreset,
  GuildStatistics,
  GuildMemberStatistics,
  GuildStatus,
  GuildPrivacy,
  ApplicationStatus,
  InvitationStatus,
} from './types';
export {
  DEFAULT_GUILD_ROLE,
  GUILD_ROLE_PRIORITY,
  hasManagementPrivileges,
  canManageOfficers,
  canKickMembers,
} from './types/GuildRoleType';
export { DEFAULT_ROLE_PERMISSIONS, hasPermission } from './types/GuildPermission';
export { createDefaultGuildMetadata } from './types/GuildMetadata';
export { createEmptyGuildStatistics } from './types/GuildStatistics';
export { DEFAULT_GUILD_PRIVACY, DEFAULT_GUILD_STATUS } from './types/GuildStatus';

// DTOs
export type {
  CreateGuildDto,
  GuildMemberDto,
  GuildMemberSummaryDto,
  GuildRoleDto,
  CreateGuildRoleDto,
  GuildResponseDto,
  GuildSummaryDto,
  GuildListResponseDto,
  GuildDetailResponseDto,
  GuildWithLeaderDto,
} from './dto';
export { CREATE_GUILD_VALIDATION } from './dto/CreateGuild.dto';

// Interfaces
export type { IGuild } from './interfaces/IGuild';
export type { IGuildMember } from './interfaces/IGuildMember';
export type { IGuildRole } from './interfaces/IGuildRole';
export type { IGuildRepository, GuildFilterParams, GuildMemberFilterParams } from './interfaces/IGuildRepository';

// Validators
export { GuildValidator, GuildMemberValidator, GuildRoleValidator } from './validators';
export type { GuildValidationResult } from './validators/GuildValidator';
export type { GuildMemberValidationResult } from './validators/GuildMemberValidator';
export type { GuildRoleValidationResult } from './validators/GuildRoleValidator';

// Mappers
export { GuildMapper, MemberMapper, RoleMapper } from './mappers';

// Events
export type {
  GuildCreatedEvent,
  GuildCreatedEventData,
  GuildMemberJoinedEvent,
  GuildMemberJoinedEventData,
  GuildMemberLeftEvent,
  GuildMemberLeftEventData,
  LeaveReason,
  GuildRoleChangedEvent,
  GuildRoleChangedEventData,
  GuildDeletedEvent,
  GuildDeletedEventData,
  DeleteReason,
} from './events';
export {
  createGuildCreatedEvent,
  createGuildMemberJoinedEvent,
  createGuildMemberLeftEvent,
  createGuildRoleChangedEvent,
  createGuildDeletedEvent,
} from './events';

// Services
export { GuildService, GuildError, createGuildService } from './services';

// Repositories
export { SupabaseGuildRepository } from './repositories';

// DI
export { registerGuildDependencies, setupGuildDomain, GUILD_TOKENS } from './di';
