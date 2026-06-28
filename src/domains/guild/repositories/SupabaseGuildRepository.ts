/**
 * Supabase Guild Repository
 *
 * Production Supabase implementation of the Guild repository.
 * Handles all Guild and GuildMember data persistence operations via Supabase.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import { SortOrder } from '../../../shared/constants';
import { RepositoryError } from '../../../database/errors/repository.error';
import { IGuildRepository, type GuildFilterParams, type GuildMemberFilterParams } from '../interfaces/IGuildRepository';
import { Guild, type GuildRecord } from '../entities/Guild';
import { GuildMember, type GuildMemberRecord } from '../entities/GuildMember';
import { GuildId } from '../value-objects/GuildId';
import { GuildSlug } from '../value-objects/GuildSlug';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Supabase implementation of the Guild Repository.
 * Implements IGuildRepository for Guild entity persistence.
 */
export class SupabaseGuildRepository implements IGuildRepository {
  private readonly client: SupabaseClient<Database>;
  private readonly logger: ILogger;
  private readonly tableName = 'guilds';
  private readonly memberTableName = 'guild_members';

  /**
   * Creates a new SupabaseGuildRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   * @param logger Optional logger instance (creates child logger if not provided)
   */
  constructor(
    client?: SupabaseClient<Database>,
    logger?: ILogger
  ) {
    this.client = client ?? getSupabaseClient();
    this.logger = logger ?? getLogger().child({ module: 'SupabaseGuildRepository' });
  }

  // #region Guild Operations

  /**
   * Creates a new guild.
   */
  async create(guild: Guild): Promise<Guild> {
    try {
      this.logger.debug('Creating guild', { guildId: guild.guildId.value, slug: guild.slug.value });

      const record = this.guildToRecord(guild);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create guild', error);
        throw RepositoryError.createFailed('Guild', this.toError(error));
      }

      if (!data) {
        throw RepositoryError.createFailed('Guild', new Error('No data returned after insert'));
      }

      const createdGuild = this.guildFromRecord(data);
      this.logger.info('Guild created successfully', { guildId: createdGuild.guildId.value });
      return createdGuild;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating guild', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.createFailed('Guild', err instanceof Error ? err : undefined);
    }
  }

  /**
   * Finds a guild by its ID.
   */
  async findById(id: GuildId): Promise<Guild | null> {
    try {
      this.logger.debug('Finding guild by ID', { guildId: id.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('id', id.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Guild not found by ID', { guildId: id.value });
          return null;
        }
        this.logger.error('Failed to find guild by ID', error);
        throw new RepositoryError({
          message: `Failed to find guild: ${id.value}`,
          operation: 'SELECT',
          cause: error,
          context: { guildId: id.value },
        });
      }

      if (!data) {
        return null;
      }

      return this.guildFromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding guild by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding guild: ${id.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds a guild by its slug.
   */
  async findBySlug(slug: GuildSlug): Promise<Guild | null> {
    try {
      this.logger.debug('Finding guild by slug', { slug: slug.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('slug', slug.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Guild not found by slug', { slug: slug.value });
          return null;
        }
        this.logger.error('Failed to find guild by slug', error);
        throw new RepositoryError({
          message: `Failed to find guild by slug: ${slug.value}`,
          operation: 'SELECT',
          cause: error,
          context: { slug: slug.value },
        });
      }

      if (!data) {
        return null;
      }

      return this.guildFromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding guild by slug', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding guild by slug: ${slug.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Checks if a guild exists by ID.
   */
  async exists(id: GuildId): Promise<boolean> {
    try {
      this.logger.debug('Checking if guild exists', { guildId: id.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('id', id.value)
        .limit(1);

      if (error) {
        this.logger.error('Failed to check guild existence', error);
        throw new RepositoryError({
          message: `Failed to check guild existence: ${id.value}`,
          operation: 'SELECT',
          cause: error,
        });
      }

      return data !== null && data.length > 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error checking guild existence', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error checking guild existence: ${id.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Checks if a guild slug is already taken.
   */
  async slugExists(slug: GuildSlug): Promise<boolean> {
    try {
      this.logger.debug('Checking if guild slug exists', { slug: slug.value });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('slug', slug.value)
        .limit(1);

      if (error) {
        this.logger.error('Failed to check guild slug existence', error);
        throw new RepositoryError({
          message: `Failed to check guild slug existence: ${slug.value}`,
          operation: 'SELECT',
          cause: error,
        });
      }

      return data !== null && data.length > 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error checking guild slug existence', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error checking guild slug existence: ${slug.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Updates an existing guild.
   */
  async update(guild: Guild): Promise<Guild> {
    try {
      this.logger.debug('Updating guild', { guildId: guild.guildId.value });

      const record = this.guildToRecord(guild);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.tableName) as any)
        .update(record)
        .eq('id', guild.guildId.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update guild', error);
        throw new RepositoryError({
          message: `Failed to update guild: ${guild.guildId.value}`,
          operation: 'UPDATE',
          cause: this.toError(error),
          context: { guildId: guild.guildId.value },
        });
      }

      if (!data) {
        throw new RepositoryError({
          message: `Guild not found for update: ${guild.guildId.value}`,
          operation: 'UPDATE',
          context: { guildId: guild.guildId.value },
        });
      }

      const updatedGuild = this.guildFromRecord(data);
      this.logger.info('Guild updated successfully', { guildId: updatedGuild.guildId.value });
      return updatedGuild;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating guild', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error updating guild: ${guild.guildId.value}`,
        operation: 'UPDATE',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Deletes a guild.
   */
  async delete(id: GuildId): Promise<void> {
    try {
      this.logger.debug('Deleting guild', { guildId: id.value });

      // First delete all members
      const { error: memberError } = await this.client
        .from(this.memberTableName)
        .delete()
        .eq('guild_id', id.value);

      if (memberError) {
        this.logger.error('Failed to delete guild members', memberError);
        throw RepositoryError.deleteFailed('GuildMember', id.value, this.toError(memberError));
      }

      // Then delete the guild
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', id.value);

      if (error) {
        this.logger.error('Failed to delete guild', error);
        throw RepositoryError.deleteFailed('Guild', id.value, this.toError(error));
      }

      this.logger.info('Guild deleted successfully', { guildId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error deleting guild', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.deleteFailed('Guild', id.value, err instanceof Error ? err : undefined);
    }
  }

  /**
   * Lists guilds with pagination and filtering.
   */
  async list(
    params: PaginationParams,
    filters?: GuildFilterParams
  ): Promise<PaginatedResult<Guild>> {
    try {
      this.logger.debug('Listing guilds', { params, filters });

      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      let query = this.client.from(this.tableName).select('*', { count: 'exact' });

      query = this.applyGuildFilters(query, filters);

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list guilds', error);
        throw new RepositoryError({
          message: 'Failed to list guilds',
          operation: 'SELECT',
          cause: error,
        });
      }

      const guilds = (data || []).map((record) => this.guildFromRecord(record));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      this.logger.debug('Guilds listed successfully', { count: guilds.length, total });

      return {
        items: guilds,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error listing guilds', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: 'Unexpected error listing guilds',
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds guilds where a player is the owner.
   */
  async findByOwner(playerProfileId: string): Promise<Guild | null> {
    try {
      this.logger.debug('Finding guild by owner', { playerProfileId });

      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('owner_player_id', playerProfileId)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Guild not found by owner', { playerProfileId });
          return null;
        }
        this.logger.error('Failed to find guild by owner', error);
        throw new RepositoryError({
          message: `Failed to find guild by owner: ${playerProfileId}`,
          operation: 'SELECT',
          cause: error,
          context: { playerProfileId },
        });
      }

      if (!data) {
        return null;
      }

      return this.guildFromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding guild by owner', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding guild by owner: ${playerProfileId}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  // #endregion

  // #region Guild Member Operations

  /**
   * Creates a new guild member.
   */
  async createMember(member: GuildMember): Promise<GuildMember> {
    try {
      this.logger.debug('Creating guild member', { 
        memberId: String(member.memberId), 
        guildId: member.guildId.value 
      });

      const record = this.memberToRecord(member);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.memberTableName) as any)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create guild member', error);
        throw RepositoryError.createFailed('GuildMember', this.toError(error));
      }

      if (!data) {
        throw RepositoryError.createFailed('GuildMember', new Error('No data returned after insert'));
      }

      const createdMember = this.memberFromRecord(data);
      this.logger.info('Guild member created successfully', { memberId: String(createdMember.memberId) });
      return createdMember;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating guild member', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.createFailed('GuildMember', err instanceof Error ? err : undefined);
    }
  }

  /**
   * Finds a guild member by ID.
   */
  async findMemberById(memberId: string): Promise<GuildMember | null> {
    try {
      this.logger.debug('Finding guild member by ID', { memberId });

      const { data, error } = await this.client
        .from(this.memberTableName)
        .select('*')
        .eq('id', memberId)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Guild member not found by ID', { memberId });
          return null;
        }
        this.logger.error('Failed to find guild member by ID', error);
        throw new RepositoryError({
          message: `Failed to find guild member: ${memberId}`,
          operation: 'SELECT',
          cause: error,
          context: { memberId },
        });
      }

      if (!data) {
        return null;
      }

      return this.memberFromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding guild member by ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding guild member: ${memberId}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds all members of a guild.
   */
  async findMembersByGuildId(
    guildId: GuildId,
    params?: PaginationParams,
    filters?: GuildMemberFilterParams
  ): Promise<PaginatedResult<GuildMember>> {
    try {
      this.logger.debug('Finding guild members by guild ID', { guildId: guildId.value, params, filters });

      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const offset = (page - 1) * pageSize;
      const sortBy = params?.sortBy ?? 'joined_at';
      const sortOrder = params?.sortOrder ?? SortOrder.ASC;

      let query = this.client
        .from(this.memberTableName)
        .select('*', { count: 'exact' })
        .eq('guild_id', guildId.value);

      query = this.applyMemberFilters(query, filters);

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to find guild members', error);
        throw new RepositoryError({
          message: `Failed to find guild members: ${guildId.value}`,
          operation: 'SELECT',
          cause: error,
          context: { guildId: guildId.value },
        });
      }

      const members = (data || []).map((record) => this.memberFromRecord(record));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      this.logger.debug('Guild members found successfully', { count: members.length, total });

      return {
        items: members,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding guild members', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding guild members: ${guildId.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds a guild member by player profile ID and guild ID.
   */
  async findMemberByPlayerAndGuild(playerProfileId: string, guildId: GuildId): Promise<GuildMember | null> {
    try {
      this.logger.debug('Finding guild member by player and guild', { playerProfileId, guildId: guildId.value });

      const { data, error } = await this.client
        .from(this.memberTableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .eq('guild_id', guildId.value)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Guild member not found by player and guild', { playerProfileId, guildId: guildId.value });
          return null;
        }
        this.logger.error('Failed to find guild member by player and guild', error);
        throw new RepositoryError({
          message: `Failed to find guild member: ${playerProfileId} in guild ${guildId.value}`,
          operation: 'SELECT',
          cause: error,
          context: { playerProfileId, guildId: guildId.value },
        });
      }

      if (!data) {
        return null;
      }

      return this.memberFromRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding guild member', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding guild member: ${playerProfileId} in guild ${guildId.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Finds all guilds a player belongs to.
   */
  async findMembershipsByPlayer(playerProfileId: string): Promise<GuildMember[]> {
    try {
      this.logger.debug('Finding guild memberships by player', { playerProfileId });

      const { data, error } = await this.client
        .from(this.memberTableName)
        .select('*')
        .eq('player_profile_id', playerProfileId);

      if (error) {
        this.logger.error('Failed to find guild memberships', error);
        throw new RepositoryError({
          message: `Failed to find guild memberships: ${playerProfileId}`,
          operation: 'SELECT',
          cause: error,
          context: { playerProfileId },
        });
      }

      const members = (data || []).map((record) => this.memberFromRecord(record));
      this.logger.debug('Guild memberships found', { count: members.length });
      return members;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding guild memberships', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error finding guild memberships: ${playerProfileId}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Updates a guild member.
   */
  async updateMember(member: GuildMember): Promise<GuildMember> {
    try {
      this.logger.debug('Updating guild member', { memberId: String(member.memberId) });

      const record = this.memberToRecord(member);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this.client.from(this.memberTableName) as any)
        .update(record)
        .eq('id', String(member.memberId))
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update guild member', error);
        throw new RepositoryError({
          message: `Failed to update guild member: ${member.memberId}`,
          operation: 'UPDATE',
          cause: this.toError(error),
          context: { memberId: String(member.memberId) },
        });
      }

      if (!data) {
        throw new RepositoryError({
          message: `Guild member not found for update: ${member.memberId}`,
          operation: 'UPDATE',
          context: { memberId: String(member.memberId) },
        });
      }

      const updatedMember = this.memberFromRecord(data);
      this.logger.info('Guild member updated successfully', { memberId: String(updatedMember.memberId) });
      return updatedMember;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating guild member', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error updating guild member: ${member.memberId}`,
        operation: 'UPDATE',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Deletes a guild member.
   */
  async deleteMember(memberId: string): Promise<void> {
    try {
      this.logger.debug('Deleting guild member', { memberId });

      const { error } = await this.client
        .from(this.memberTableName)
        .delete()
        .eq('id', memberId);

      if (error) {
        this.logger.error('Failed to delete guild member', error);
        throw RepositoryError.deleteFailed('GuildMember', memberId, this.toError(error));
      }

      this.logger.info('Guild member deleted successfully', { memberId });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error deleting guild member', err instanceof Error ? err : new Error(String(err)));
      throw RepositoryError.deleteFailed('GuildMember', memberId, err instanceof Error ? err : undefined);
    }
  }

  /**
   * Counts members in a guild.
   */
  async countMembers(guildId: GuildId): Promise<number> {
    try {
      this.logger.debug('Counting guild members', { guildId: guildId.value });

      const { data, error, count } = await this.client
        .from(this.memberTableName)
        .select('*', { count: 'exact', head: true })
        .eq('guild_id', guildId.value);

      if (error) {
        this.logger.error('Failed to count guild members', error);
        throw new RepositoryError({
          message: `Failed to count guild members: ${guildId.value}`,
          operation: 'SELECT',
          cause: error,
          context: { guildId: guildId.value },
        });
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error counting guild members', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error counting guild members: ${guildId.value}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Checks if a player is a member of any guild.
   */
  async isPlayerInGuild(playerProfileId: string): Promise<boolean> {
    try {
      this.logger.debug('Checking if player is in guild', { playerProfileId });

      const { data, error } = await this.client
        .from(this.memberTableName)
        .select('id')
        .eq('player_profile_id', playerProfileId)
        .limit(1);

      if (error) {
        this.logger.error('Failed to check player guild membership', error);
        throw new RepositoryError({
          message: `Failed to check player guild membership: ${playerProfileId}`,
          operation: 'SELECT',
          cause: error,
          context: { playerProfileId },
        });
      }

      return data !== null && data.length > 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error checking player guild membership', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error checking player guild membership: ${playerProfileId}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  /**
   * Gets the guild ID a player belongs to.
   */
  async getPlayerGuildId(playerProfileId: string): Promise<GuildId | null> {
    try {
      this.logger.debug('Getting player guild ID', { playerProfileId });

      const { data, error } = await this.client
        .from(this.memberTableName)
        .select('guild_id')
        .eq('player_profile_id', playerProfileId)
        .limit(1)
        .single();

      if (error) {
        if (this.isNotFoundError(error)) {
          this.logger.debug('Player not in any guild', { playerProfileId });
          return null;
        }
        this.logger.error('Failed to get player guild ID', error);
        throw new RepositoryError({
          message: `Failed to get player guild ID: ${playerProfileId}`,
          operation: 'SELECT',
          cause: error,
          context: { playerProfileId },
        });
      }

      if (!data) {
        return null;
      }

      return GuildId.reconstruct(data.guild_id);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error getting player guild ID', err instanceof Error ? err : new Error(String(err)));
      throw new RepositoryError({
        message: `Unexpected error getting player guild ID: ${playerProfileId}`,
        operation: 'SELECT',
        cause: err instanceof Error ? err as Error : undefined,
      });
    }
  }

  // #endregion

  // #region Private Helper Methods

  /**
   * Converts a database record to a Guild entity.
   */
  private guildFromRecord(record: unknown): Guild {
    const guildRecord = record as {
      id: string;
      slug: string;
      name: string;
      description: string;
      owner_player_id: string;
      guild_level: number;
      guild_experience: number;
      member_limit: number;
      privacy: 'public' | 'private';
      statistics: Record<string, unknown>;
      metadata: Record<string, unknown>;
      created_at: string;
      updated_at: string;
    };

    return Guild.fromStorage({
      guildId: guildRecord.id,
      slug: guildRecord.slug,
      name: guildRecord.name,
      description: guildRecord.description,
      ownerPlayerId: guildRecord.owner_player_id,
      guildLevel: guildRecord.guild_level,
      guildExperience: guildRecord.guild_experience,
      memberLimit: guildRecord.member_limit,
      privacy: guildRecord.privacy,
      statistics: guildRecord.statistics as Record<string, unknown> as never,
      metadata: guildRecord.metadata as Record<string, unknown>,
      createdAt: guildRecord.created_at,
      updatedAt: guildRecord.updated_at,
    });
  }

  /**
   * Converts a Guild entity to a database record.
   */
  private guildToRecord(guild: Guild): {
    id: string;
    slug: string;
    name: string;
    description: string;
    owner_player_id: string;
    guild_level: number;
    guild_experience: number;
    member_limit: number;
    privacy: 'public' | 'private';
    statistics: Record<string, unknown>;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  } {
    return {
      id: guild.guildId.value,
      slug: guild.slug.value,
      name: guild.name.value,
      description: guild.description,
      owner_player_id: guild.ownerPlayerId,
      guild_level: guild.guildLevel.value,
      guild_experience: guild.guildExperience,
      member_limit: guild.memberLimit,
      privacy: guild.privacy,
      statistics: guild.statistics as Record<string, unknown>,
      metadata: guild.metadata as Record<string, unknown>,
      created_at: guild.createdAt.toISOString(),
      updated_at: guild.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a database record to a GuildMember entity.
   */
  private memberFromRecord(record: unknown): GuildMember {
    const memberRecord = record as {
      id: string;
      guild_id: string;
      player_profile_id: string;
      role: 'leader' | 'officer' | 'member';
      joined_at: string;
      last_active_at: string;
      statistics: Record<string, unknown>;
      metadata: Record<string, unknown>;
    };

    return GuildMember.fromStorage({
      memberId: memberRecord.id,
      guildId: memberRecord.guild_id,
      playerProfileId: memberRecord.player_profile_id,
      role: memberRecord.role,
      joinedAt: memberRecord.joined_at,
      lastActiveAt: memberRecord.last_active_at,
      statistics: memberRecord.statistics as Record<string, unknown> as never,
      metadata: memberRecord.metadata as Record<string, unknown>,
    });
  }

  /**
   * Converts a GuildMember entity to a database record.
   */
  private memberToRecord(member: GuildMember): {
    id: string;
    guild_id: string;
    player_profile_id: string;
    role: 'leader' | 'officer' | 'member';
    joined_at: string;
    last_active_at: string;
    statistics: Record<string, unknown>;
    metadata: Record<string, unknown>;
  } {
    return {
      id: String(member.memberId),
      guild_id: member.guildId.value,
      player_profile_id: member.playerProfileId,
      role: member.role,
      joined_at: member.joinedAt.toISOString(),
      last_active_at: member.lastActiveAt.toISOString(),
      statistics: member.statistics as Record<string, unknown>,
      metadata: member.metadata as Record<string, unknown>,
    };
  }

  /**
   * Applies filters to a guild query builder.
   */
  private applyGuildFilters(
    query: ReturnType<typeof this.client.from>,
    filters?: GuildFilterParams
  ): ReturnType<typeof this.client.from> {
    if (!filters) return query;

    if (filters.privacy) {
      query = query.eq('privacy', filters.privacy);
    }

    if (filters.minLevel !== undefined) {
      query = query.gte('guild_level', filters.minLevel);
    }

    if (filters.maxLevel !== undefined) {
      query = query.lte('guild_level', filters.maxLevel);
    }

    if (filters.namePattern) {
      query = query.ilike('name', `%${filters.namePattern}%`);
    }

    if (filters.slugPattern) {
      query = query.ilike('slug', `%${filters.slugPattern}%`);
    }

    return query;
  }

  /**
   * Applies filters to a guild member query builder.
   */
  private applyMemberFilters(
    query: ReturnType<typeof this.client.from>,
    filters?: GuildMemberFilterParams
  ): ReturnType<typeof this.client.from> {
    if (!filters) return query;

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    return query;
  }

  /**
   * Checks if an error is a "not found" error.
   */
  private isNotFoundError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const err = error as { code?: string; message?: string };
    return err.code === 'PGRST116' || (typeof err.message === 'string' && err.message.includes('No rows'));
  }

  /**
   * Converts a Supabase error to a standard Error.
   */
  private toError(error: unknown): Error | undefined {
    if (error instanceof Error) return error;
    if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; code?: string };
      return new Error(err.message || `Database error: ${err.code || 'unknown'}`);
    }
    return undefined;
  }

  // #endregion
}
