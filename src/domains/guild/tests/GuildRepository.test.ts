/**
 * Guild Repository Tests
 *
 * Unit tests for SupabaseGuildRepository.
 * These tests verify the repository methods work with mocked Supabase client.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SupabaseGuildRepository } from '../repositories/SupabaseGuildRepository';
import { Guild } from '../entities/Guild';
import { GuildId } from '../value-objects/GuildId';
import { GuildSlug } from '../value-objects/GuildSlug';
import { GuildName } from '../value-objects/GuildName';

const mockGuildRecord = {
  id: '123e4567-e89b-42d3-a456-426614174001',
  slug: 'test-guild',
  name: 'Test Guild',
  description: 'A test guild',
  owner_player_id: '123e4567-e89b-42d3-a456-426614174000',
  guild_level: 1,
  guild_experience: 0,
  member_limit: 10,
  privacy: 'public',
  statistics: {
    totalExperience: 0,
    weeklyExperience: 0,
    activeMembersCount: 1,
    averageMemberLevel: 0,
    missionsCompleted: 0,
    missionCompletionRate: 0,
    warsParticipated: 0,
    warsWon: 0,
    seasonStanding: 0,
    allTimeSeasonPoints: 0,
    totalMembersJoined: 1,
    totalMembersLeft: 0,
  },
  metadata: {},
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

function createMockGuild(): Guild {
  return Guild.create({
    slug: GuildSlug.create('test-guild'),
    name: GuildName.create('Test Guild'),
    ownerPlayerId: '123e4567-e89b-42d3-a456-426614174000',
  });
}

function createMockSupabaseClient() {
  return {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    limit: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
  };
}

describe('SupabaseGuildRepository', () => {
  let repository: SupabaseGuildRepository;
  let mockClient: ReturnType<typeof createMockSupabaseClient>;
  let mockLogger: {
    debug: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
    warn: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
    child: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      child: vi.fn().mockReturnThis(),
    };

    mockClient = createMockSupabaseClient();
    repository = new SupabaseGuildRepository(mockClient as any, mockLogger as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Guild Operations', () => {
    describe('create', () => {
      it('should create a guild successfully', async () => {
        const guild = createMockGuild();
        mockClient.single.mockResolvedValue({ data: mockGuildRecord, error: null });

        const result = await repository.create(guild);

        expect(mockClient.from).toHaveBeenCalledWith('guilds');
        expect(mockClient.insert).toHaveBeenCalled();
        expect(result).toBeDefined();
      });

      it('should throw error when insert fails', async () => {
        const guild = createMockGuild();
        mockClient.single.mockResolvedValue({ data: null, error: { message: 'Insert failed' } });

        await expect(repository.create(guild)).rejects.toThrow();
      });
    });

    describe('findById', () => {
      it('should return guild when found', async () => {
        mockClient.single.mockResolvedValue({ data: mockGuildRecord, error: null });

        const guildId = GuildId.reconstruct(mockGuildRecord.id);
        const result = await repository.findById(guildId);

        expect(result).toBeDefined();
        expect(result?.guildId.value).toBe(mockGuildRecord.id);
      });

      it('should return null when guild not found', async () => {
        mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

        const guildId = GuildId.reconstruct('non-existent-id');
        const result = await repository.findById(guildId);

        expect(result).toBeNull();
      });
    });

    describe('findBySlug', () => {
      it('should return guild when found', async () => {
        mockClient.single.mockResolvedValue({ data: mockGuildRecord, error: null });

        const slug = GuildSlug.reconstruct('test-guild');
        const result = await repository.findBySlug(slug);

        expect(result).toBeDefined();
        expect(result?.slug.value).toBe('test-guild');
      });

      it('should return null when slug not found', async () => {
        mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

        const slug = GuildSlug.reconstruct('non-existent');
        const result = await repository.findBySlug(slug);

        expect(result).toBeNull();
      });
    });

    describe('exists', () => {
      it('should return true when guild exists', async () => {
        mockClient.limit.mockResolvedValue({ data: [{ id: mockGuildRecord.id }], error: null });

        const guildId = GuildId.reconstruct(mockGuildRecord.id);
        const result = await repository.exists(guildId);

        expect(result).toBe(true);
      });

      it('should return false when guild does not exist', async () => {
        mockClient.limit.mockResolvedValue({ data: [], error: null });

        const guildId = GuildId.reconstruct('non-existent-id');
        const result = await repository.exists(guildId);

        expect(result).toBe(false);
      });
    });

    describe('slugExists', () => {
      it('should return true when slug is taken', async () => {
        mockClient.limit.mockResolvedValue({ data: [{ id: mockGuildRecord.id }], error: null });

        const slug = GuildSlug.reconstruct('test-guild');
        const result = await repository.slugExists(slug);

        expect(result).toBe(true);
      });

      it('should return false when slug is available', async () => {
        mockClient.limit.mockResolvedValue({ data: [], error: null });

        const slug = GuildSlug.reconstruct('available-slug');
        const result = await repository.slugExists(slug);

        expect(result).toBe(false);
      });
    });

    describe('update', () => {
      it('should update guild successfully', async () => {
        const updatedRecord = { ...mockGuildRecord, name: 'Updated Guild' };
        mockClient.single.mockResolvedValue({ data: updatedRecord, error: null });

        const guild = createMockGuild();
        const result = await repository.update(guild);

        expect(mockClient.update).toHaveBeenCalled();
        expect(result).toBeDefined();
      });

      it('should throw error when update fails', async () => {
        mockClient.single.mockResolvedValue({ data: null, error: { message: 'Update failed' } });

        const guild = createMockGuild();
        await expect(repository.update(guild)).rejects.toThrow();
      });
    });

    describe('delete', () => {
      it('should delete guild and members successfully', async () => {
        mockClient.eq.mockResolvedValue({ error: null });

        const guildId = GuildId.reconstruct(mockGuildRecord.id);
        await expect(repository.delete(guildId)).resolves.toBeUndefined();

        expect(mockClient.from).toHaveBeenCalledWith('guild_members');
        expect(mockClient.from).toHaveBeenCalledWith('guilds');
      });
    });

    describe('list', () => {
      it('should list guilds with pagination', async () => {
        mockClient.range.mockResolvedValue({
          data: [mockGuildRecord],
          error: null,
          count: 1,
        });

        const result = await repository.list({ page: 1, pageSize: 20 });

        expect(result.items).toHaveLength(1);
        expect(result.total).toBe(1);
        expect(result.page).toBe(1);
      });
    });

    describe('findByOwner', () => {
      it('should return guild when owner is found', async () => {
        mockClient.single.mockResolvedValue({ data: mockGuildRecord, error: null });

        const result = await repository.findByOwner(mockGuildRecord.owner_player_id);

        expect(result).toBeDefined();
        expect(result?.ownerPlayerId).toBe(mockGuildRecord.owner_player_id);
      });

      it('should return null when owner has no guild', async () => {
        mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

        const result = await repository.findByOwner('non-existent-owner');

        expect(result).toBeNull();
      });
    });
  });

  describe('Guild Member Operations', () => {
    describe('findMemberById', () => {
      it('should return null when member not found', async () => {
        mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

        const result = await repository.findMemberById('non-existent');

        expect(result).toBeNull();
      });
    });

    describe('findMembersByGuildId', () => {
      it('should return members for guild', async () => {
        const mockMemberRecord = {
          id: '223e4567-e89b-42d3-a456-426614174002',
          guild_id: mockGuildRecord.id,
          player_profile_id: '123e4567-e89b-42d3-a456-426614174003',
          role: 'member' as const,
          joined_at: '2024-01-01T00:00:00.000Z',
          last_active_at: '2024-01-01T00:00:00.000Z',
          statistics: {
            missionsCompleted: 0,
            battlesWon: 0,
            warContributions: 0,
            resourcesDonated: 0,
            dailyLogins: 1,
          },
          metadata: {},
        };

        mockClient.range.mockResolvedValue({
          data: [mockMemberRecord],
          error: null,
          count: 1,
        });

        const guildId = GuildId.reconstruct(mockGuildRecord.id);
        const result = await repository.findMembersByGuildId(guildId, { page: 1, pageSize: 20 });

        expect(result.items).toHaveLength(1);
        expect(result.total).toBe(1);
      });
    });

    describe('findMembershipsByPlayer', () => {
      it('should return memberships for player', async () => {
        const mockMemberRecord = {
          id: '223e4567-e89b-42d3-a456-426614174002',
          guild_id: mockGuildRecord.id,
          player_profile_id: '123e4567-e89b-42d3-a456-426614174003',
          role: 'member' as const,
          joined_at: '2024-01-01T00:00:00.000Z',
          last_active_at: '2024-01-01T00:00:00.000Z',
          statistics: {
            missionsCompleted: 0,
            battlesWon: 0,
            warContributions: 0,
            resourcesDonated: 0,
            dailyLogins: 1,
          },
          metadata: {},
        };

        mockClient.eq.mockResolvedValue({ data: [mockMemberRecord], error: null });

        const result = await repository.findMembershipsByPlayer('123e4567-e89b-42d3-a456-426614174003');

        expect(result).toHaveLength(1);
      });
    });

    describe('deleteMember', () => {
      it('should delete member successfully', async () => {
        mockClient.eq.mockResolvedValue({ error: null });

        await expect(repository.deleteMember('223e4567-e89b-42d3-a456-426614174002')).resolves.toBeUndefined();

        expect(mockClient.delete).toHaveBeenCalled();
      });
    });

    describe('isPlayerInGuild', () => {
      it('should return true when player is in guild', async () => {
        mockClient.limit.mockResolvedValue({ data: [{ id: 'member-id' }], error: null });

        const result = await repository.isPlayerInGuild('123e4567-e89b-42d3-a456-426614174003');

        expect(result).toBe(true);
      });

      it('should return false when player is not in guild', async () => {
        mockClient.limit.mockResolvedValue({ data: [], error: null });

        const result = await repository.isPlayerInGuild('non-member');

        expect(result).toBe(false);
      });
    });

    describe('getPlayerGuildId', () => {
      it('should return guild ID when player is in guild', async () => {
        mockClient.single.mockResolvedValue({
          data: { guild_id: mockGuildRecord.id },
          error: null,
        });

        const result = await repository.getPlayerGuildId('123e4567-e89b-42d3-a456-426614174003');

        expect(result).toBeDefined();
        expect(result?.value).toBe(mockGuildRecord.id);
      });

      it('should return null when player is not in guild', async () => {
        mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

        const result = await repository.getPlayerGuildId('non-member');

        expect(result).toBeNull();
      });
    });
  });
});
