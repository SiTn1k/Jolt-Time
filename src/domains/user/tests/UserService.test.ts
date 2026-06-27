/**
 * User Service Tests
 *
 * Unit tests for UserService.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService, type TelegramUserData } from '../services/UserService';
import { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { TelegramId } from '../value-objects/TelegramId';
import { Username } from '../value-objects/Username';
import { LanguageCode } from '../value-objects/LanguageCode';
import { UserPhotoUrl } from '../value-objects/UserPhotoUrl';
import { UserStatus } from '../types/UserStatus';

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

describe('UserService', () => {
  let service: UserService;
  let mockRepository: {
    create: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByTelegramId: ReturnType<typeof vi.fn>;
    findByUsername: ReturnType<typeof vi.fn>;
    exists: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    updateLastSeen: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
    restore: ReturnType<typeof vi.fn>;
    list: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByTelegramId: vi.fn(),
      findByUsername: vi.fn(),
      exists: vi.fn(),
      update: vi.fn(),
      updateLastSeen: vi.fn(),
      softDelete: vi.fn(),
      restore: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
    };

    service = new UserService(mockRepository as any);
  });

  describe('registerUser', () => {
    it('should return existing user when user already exists', async () => {
      const existingUser = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);

      const data: TelegramUserData = {
        telegramId: 123456789,
        firstName: 'Test',
      };

      const result = await service.registerUser(data);

      expect(mockRepository.findByTelegramId).toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(result).toBe(existingUser);
    });

    it('should create new user when user does not exist', async () => {
      mockRepository.findByTelegramId.mockResolvedValue(null);
      mockRepository.create.mockImplementation((user) => Promise.resolve(user));

      const data: TelegramUserData = {
        telegramId: 123456789,
        firstName: 'New',
        lastName: 'User',
        username: 'newuser',
        languageCode: 'en',
        isPremium: false,
      };

      const result = await service.registerUser(data);

      expect(mockRepository.findByTelegramId).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result.firstName).toBe('New');
      expect(result.lastName).toBe('User');
    });

    it('should throw error when telegramId is missing', async () => {
      const data = {
        telegramId: 0,
        firstName: 'Test',
      } as TelegramUserData;

      await expect(service.registerUser(data)).rejects.toThrow();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const user = createMockUser();
      mockRepository.findById.mockResolvedValue(user);

      const result = await service.getUserById(mockUserRecord.id);

      expect(result).toBeDefined();
      expect(result?.id.value).toBe(mockUserRecord.id);
    });

    it('should return null when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.getUserById('987e6543-e89b-42d3-a456-426614174000');

      expect(result).toBeNull();
    });
  });

  describe('getUserByTelegramId', () => {
    it('should return user when found', async () => {
      const user = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(user);

      const result = await service.getUserByTelegramId(123456789);

      expect(result).toBeDefined();
      expect(result?.telegramId.value).toBe(123456789);
    });
  });

  describe('userExists', () => {
    it('should return true when user exists', async () => {
      mockRepository.exists.mockResolvedValue(true);

      const result = await service.userExists(mockUserRecord.id);

      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      mockRepository.exists.mockResolvedValue(false);

      const result = await service.userExists('987e6543-e89b-42d3-a456-426614174000');

      expect(result).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const user = createMockUser();
      const updatedUser = createMockUser({ first_name: 'Updated' });
      mockRepository.findById.mockResolvedValue(user);
      mockRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(mockUserRecord.id, { firstName: 'Updated' });

      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.firstName).toBe('Updated');
    });

    it('should throw error when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateUser('987e6543-e89b-42d3-a456-426614174000', { firstName: 'Updated' })
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateLastSeen', () => {
    it('should update last seen successfully', async () => {
      const user = createMockUser();
      mockRepository.updateLastSeen.mockResolvedValue(user);

      const result = await service.updateLastSeen(mockUserRecord.id);

      expect(mockRepository.updateLastSeen).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user successfully', async () => {
      mockRepository.softDelete.mockResolvedValue(undefined);

      await service.deleteUser(mockUserRecord.id);

      expect(mockRepository.softDelete).toHaveBeenCalled();
    });
  });

  describe('restoreUser', () => {
    it('should restore user successfully', async () => {
      const user = createMockUser();
      mockRepository.restore.mockResolvedValue(user);

      const result = await service.restoreUser(mockUserRecord.id);

      expect(mockRepository.restore).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('syncFromTelegram', () => {
    it('should sync changed fields only', async () => {
      const user = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(user);
      mockRepository.update.mockImplementation((u) => Promise.resolve(u));

      const result = await service.syncFromTelegram(123456789, {
        firstName: 'Updated Name',
        isPremium: true,
      });

      expect(mockRepository.findByTelegramId).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.firstName).toBe('Updated Name');
    });

    it('should throw error when user not found', async () => {
      mockRepository.findByTelegramId.mockResolvedValue(null);

      await expect(
        service.syncFromTelegram(999999999, { firstName: 'Test' })
      ).rejects.toThrow('User not found for Telegram ID');
    });

    it('should only update lastSeenAt when no other changes', async () => {
      const user = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(user);
      mockRepository.updateLastSeen.mockResolvedValue(user);

      const result = await service.syncFromTelegram(123456789, {});

      expect(mockRepository.updateLastSeen).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getUserSummary', () => {
    it('should return user summary when user found', async () => {
      const user = createMockUser();
      mockRepository.findById.mockResolvedValue(user);

      const result = await service.getUserSummary(mockUserRecord.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(mockUserRecord.id);
      expect(result?.firstName).toBe(mockUserRecord.first_name);
    });

    it('should return null when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.getUserSummary('987e6543-e89b-42d3-a456-426614174000');

      expect(result).toBeNull();
    });
  });

  describe('listUsers', () => {
    it('should list users with pagination', async () => {
      const user = createMockUser();
      mockRepository.list.mockResolvedValue({
        items: [user],
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      const result = await service.listUsers({ page: 1, pageSize: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('countUsers', () => {
    it('should return user count', async () => {
      mockRepository.count.mockResolvedValue(42);

      const result = await service.countUsers();

      expect(result).toBe(42);
    });
  });

  describe('toResponse', () => {
    it('should convert user to response DTO', () => {
      const user = createMockUser();

      const result = service.toResponse(user);

      expect(result.id).toBe(mockUserRecord.id);
      expect(result.telegramId).toBe(mockUserRecord.telegram_id);
      expect(result.firstName).toBe(mockUserRecord.first_name);
    });
  });
});