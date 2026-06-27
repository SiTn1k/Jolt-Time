/**
 * User Repository Tests
 *
 * Unit tests for SupabaseUserRepository.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { TelegramId } from '../value-objects/TelegramId';
import { Username } from '../value-objects/Username';
import { LanguageCode } from '../value-objects/LanguageCode';
import { UserPhotoUrl } from '../value-objects/UserPhotoUrl';
import { UserStatus } from '../types/UserStatus';
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';

const mockUserRecord = {
  id: '123e4567-e89b-42d3-a456-426614174000',
  telegram_id: 123456789,
  username: 'testuser',
  first_name: 'Test',
  last_name: 'User',
  language_code: 'en',
  photo_url: 'https://example.com/photo.jpg',
  is_premium: true,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  last_seen_at: '2024-01-01T00:00:00.000Z',
  status: 'active',
};

function createMockUser(overrides = {}): User {
  return User.fromDatabase({
    ...mockUserRecord,
    ...overrides,
  } as any);
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

describe('SupabaseUserRepository', () => {
  let repository: SupabaseUserRepository;
  let mockClient: ReturnType<typeof createMockSupabaseClient>;
  let mockLogger: { debug: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn>; warn: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn>; child: ReturnType<typeof vi.fn> };

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
    repository = new SupabaseUserRepository(mockClient as any, mockLogger as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const user = createMockUser();
      
      mockClient.single.mockResolvedValue({ data: mockUserRecord, error: null });

      const result = await repository.create(user);

      expect(mockClient.from).toHaveBeenCalledWith('users');
      expect(mockClient.insert).toHaveBeenCalled();
      expect(mockClient.select).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.id.value).toBe(mockUserRecord.id);
    });

    it('should throw error when insert fails', async () => {
      const user = createMockUser();
      mockClient.single.mockResolvedValue({ data: null, error: { message: 'Insert failed' } });

      await expect(repository.create(user)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      mockClient.single.mockResolvedValue({ data: mockUserRecord, error: null });

      const userId = UserId.reconstruct(mockUserRecord.id);
      const result = await repository.findById(userId);

      expect(result).toBeDefined();
      expect(result?.id.value).toBe(mockUserRecord.id);
    });

    it('should return null when user not found', async () => {
      mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

      const userId = UserId.reconstruct('non-existent-id');
      const result = await repository.findById(userId);

      expect(result).toBeNull();
    });
  });

  describe('findByTelegramId', () => {
    it('should return user when found', async () => {
      mockClient.single.mockResolvedValue({ data: mockUserRecord, error: null });

      const telegramId = TelegramId.reconstruct(mockUserRecord.telegram_id);
      const result = await repository.findByTelegramId(telegramId);

      expect(result).toBeDefined();
      expect(result?.telegramId.value).toBe(mockUserRecord.telegram_id);
    });

    it('should return null when user not found', async () => {
      mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

      const telegramId = TelegramId.reconstruct(999999999);
      const result = await repository.findByTelegramId(telegramId);

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return user when found', async () => {
      mockClient.single.mockResolvedValue({ data: mockUserRecord, error: null });

      const username = Username.reconstruct(mockUserRecord.username);
      const result = await repository.findByUsername(username);

      expect(result).toBeDefined();
      expect(result?.username?.value).toBe(mockUserRecord.username);
    });

    it('should return null when user not found', async () => {
      mockClient.single.mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'No rows' } });

      const username = Username.reconstruct('nonexistent');
      const result = await repository.findByUsername(username);

      expect(result).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      mockClient.limit.mockResolvedValue({ data: [{ id: mockUserRecord.id }], error: null });

      const userId = UserId.reconstruct(mockUserRecord.id);
      const result = await repository.exists(userId);

      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      mockClient.limit.mockResolvedValue({ data: [], error: null });

      const userId = UserId.reconstruct('non-existent-id');
      const result = await repository.exists(userId);

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updatedRecord = { ...mockUserRecord, first_name: 'Updated' };
      mockClient.single.mockResolvedValue({ data: updatedRecord, error: null });

      const user = createMockUser();
      const result = await repository.update(user);

      expect(mockClient.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when update fails', async () => {
      mockClient.single.mockResolvedValue({ data: null, error: { message: 'Update failed' } });

      const user = createMockUser();
      await expect(repository.update(user)).rejects.toThrow();
    });
  });

  describe('updateLastSeen', () => {
    it('should update last seen successfully', async () => {
      mockClient.single.mockResolvedValue({ data: mockUserRecord, error: null });

      const userId = UserId.reconstruct(mockUserRecord.id);
      const result = await repository.updateLastSeen(userId);

      expect(mockClient.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('softDelete', () => {
    it('should soft delete user successfully', async () => {
      mockClient.eq.mockResolvedValue({ error: null });

      const userId = UserId.reconstruct(mockUserRecord.id);
      await expect(repository.softDelete(userId)).resolves.toBeUndefined();

      expect(mockClient.update).toHaveBeenCalled();
    });

    it('should throw error when delete fails', async () => {
      mockClient.eq.mockResolvedValue({ error: { message: 'Delete failed' } });

      const userId = UserId.reconstruct(mockUserRecord.id);
      await expect(repository.softDelete(userId)).rejects.toThrow();
    });
  });

  describe('restore', () => {
    it('should restore user successfully', async () => {
      const restoredRecord = { ...mockUserRecord, status: 'active' };
      mockClient.single.mockResolvedValue({ data: restoredRecord, error: null });

      const userId = UserId.reconstruct(mockUserRecord.id);
      const result = await repository.restore(userId);

      expect(mockClient.update).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('list', () => {
    it('should list users with pagination', async () => {
      mockClient.range.mockResolvedValue({ 
        data: [mockUserRecord], 
        error: null,
        count: 1,
      });

      const result = await repository.list({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
    });

    it('should apply filters correctly', async () => {
      mockClient.range.mockResolvedValue({ 
        data: [mockUserRecord], 
        error: null,
        count: 1,
      });

      await repository.list(
        { page: 1, pageSize: 20 },
        { status: 'active', isPremium: true }
      );

      expect(mockClient.eq).toHaveBeenCalledWith('status', 'active');
      expect(mockClient.eq).toHaveBeenCalledWith('is_premium', true);
    });
  });

  describe('count', () => {
    it('should count users', async () => {
      mockClient.select.mockReturnThis();
      const countQuery = { error: null, count: 42 };
      mockClient.eq = vi.fn().mockReturnValue(countQuery);

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue(countQuery),
      });
      mockClient.from = vi.fn().mockReturnValue({
        select: mockSelect,
      });

      const result = await repository.count({ status: 'active' });

      expect(result).toBe(42);
    });
  });
});