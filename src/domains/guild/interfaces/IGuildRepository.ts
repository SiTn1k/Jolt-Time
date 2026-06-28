/**
 * IGuildRepository Interface
 *
 * Interface defining the contract for Guild persistence.
 * All GuildRepository implementations must adhere to this interface.
 */

import type { GuildId } from '../value-objects/GuildId';
import type { GuildSlug } from '../value-objects/GuildSlug';
import type { Guild } from '../entities/Guild';
import type { GuildMember } from '../entities/GuildMember';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying guilds.
 */
export interface GuildFilterParams {
  /** Filter by privacy */
  privacy?: 'public' | 'private';
  /** Filter by minimum level */
  minLevel?: number;
  /** Filter by maximum level */
  maxLevel?: number;
  /** Filter by name pattern */
  namePattern?: string;
  /** Filter by slug pattern */
  slugPattern?: string;
}

/**
 * Filter parameters for querying guild members.
 */
export interface GuildMemberFilterParams {
  /** Filter by role */
  role?: 'leader' | 'officer' | 'member';
  /** Filter by active status */
  isActive?: boolean;
}

/**
 * Guild repository interface.
 * Defines all data access operations for Guild entities.
 */
export interface IGuildRepository {
  // Guild operations

  /**
   * Creates a new guild.
   * @param guild The guild to create
   * @returns The created guild
   */
  create(guild: Guild): Promise<Guild>;

  /**
   * Finds a guild by its ID.
   * @param id The guild ID to find
   * @returns The guild if found, null otherwise
   */
  findById(id: GuildId): Promise<Guild | null>;

  /**
   * Finds a guild by its slug.
   * @param slug The guild slug to find
   * @returns The guild if found, null otherwise
   */
  findBySlug(slug: GuildSlug): Promise<Guild | null>;

  /**
   * Checks if a guild exists by ID.
   * @param id The guild ID to check
   * @returns true if guild exists
   */
  exists(id: GuildId): Promise<boolean>;

  /**
   * Checks if a guild slug is already taken.
   * @param slug The slug to check
   * @returns true if slug is taken
   */
  slugExists(slug: GuildSlug): Promise<boolean>;

  /**
   * Updates an existing guild.
   * @param guild The guild to update
   * @returns The updated guild
   */
  update(guild: Guild): Promise<Guild>;

  /**
   * Deletes a guild.
   * @param id The guild ID to delete
   */
  delete(id: GuildId): Promise<void>;

  /**
   * Lists guilds with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of guilds
   */
  list(
    params: PaginationParams,
    filters?: GuildFilterParams
  ): Promise<PaginatedResult<Guild>>;

  /**
   * Finds guilds where a player is the owner.
   * @param playerProfileId The player profile ID
   * @returns Guild if found, null otherwise
   */
  findByOwner(playerProfileId: string): Promise<Guild | null>;

  // Guild member operations

  /**
   * Creates a new guild member.
   * @param member The guild member to create
   * @returns The created guild member
   */
  createMember(member: GuildMember): Promise<GuildMember>;

  /**
   * Finds a guild member by ID.
   * @param memberId The member ID
   * @returns The guild member if found, null otherwise
   */
  findMemberById(memberId: string): Promise<GuildMember | null>;

  /**
   * Finds all members of a guild.
   * @param guildId The guild ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of guild members
   */
  findMembersByGuildId(
    guildId: GuildId,
    params?: PaginationParams,
    filters?: GuildMemberFilterParams
  ): Promise<PaginatedResult<GuildMember>>;

  /**
   * Finds a guild member by player profile ID and guild ID.
   * @param playerProfileId The player profile ID
   * @param guildId The guild ID
   * @returns The guild member if found, null otherwise
   */
  findMemberByPlayerAndGuild(playerProfileId: string, guildId: GuildId): Promise<GuildMember | null>;

  /**
   * Finds all guilds a player belongs to.
   * @param playerProfileId The player profile ID
   * @returns Array of guild members
   */
  findMembershipsByPlayer(playerProfileId: string): Promise<GuildMember[]>;

  /**
   * Updates a guild member.
   * @param member The guild member to update
   * @returns The updated guild member
   */
  updateMember(member: GuildMember): Promise<GuildMember>;

  /**
   * Deletes a guild member.
   * @param memberId The member ID to delete
   */
  deleteMember(memberId: string): Promise<void>;

  /**
   * Counts members in a guild.
   * @param guildId The guild ID
   * @returns Member count
   */
  countMembers(guildId: GuildId): Promise<number>;

  /**
   * Checks if a player is a member of any guild.
   * @param playerProfileId The player profile ID
   * @returns true if player is in any guild
   */
  isPlayerInGuild(playerProfileId: string): Promise<boolean>;

  /**
   * Gets the guild ID a player belongs to.
   * @param playerProfileId The player profile ID
   * @returns Guild ID if player is in a guild, null otherwise
   */
  getPlayerGuildId(playerProfileId: string): Promise<GuildId | null>;
}
