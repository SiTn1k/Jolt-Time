/**
 * User Registration Flow Tests
 *
 * Integration tests for user registration and Telegram synchronization.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService, type TelegramUserData } from '../services/UserService';
import { User } from '../entities/User';
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

describe('User Registration Flow', () => {
  let service: UserService;
  let mockRepository: {
    create: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByTelegramId: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    updateLastSeen: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
    restore: ReturnType<typeof vi.fn>;
    exists: ReturnType<typeof vi.fn>;
    list: ReturnType<typeof vi.fn>;
    count: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByTelegramId: vi.fn(),
      update: vi.fn(),
      updateLastSeen: vi.fn(),
      softDelete: vi.fn(),
      restore: vi.fn(),
      exists: vi.fn(),
      list: vi.fn(),
      count: vi.fn(),
    };

    service = new UserService(mockRepository as any);
  });

  describe('Scenario: New user enters Telegram Mini App', () => {
    it('should create new user with correct initial state', async () => {
      mockRepository.findByTelegramId.mockResolvedValue(null);
      mockRepository.create.mockImplementation((user) => Promise.resolve(user));

      const telegramData: TelegramUserData = {
        telegramId: 987654321,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        languageCode: 'en',
        isPremium: false,
      };

      const user = await service.registerUser(telegramData);

      expect(user).toBeDefined();
      expect(user.telegramId.value).toBe(987654321);
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.username?.value).toBe('johndoe');
      expect(user.languageCode?.value).toBe('en');
      expect(user.isPremium).toBe(false);
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.lastSeenAt).toBeInstanceOf(Date);
    });

    it('should initialize metadata correctly for new user', async () => {
      mockRepository.findByTelegramId.mockResolvedValue(null);
      mockRepository.create.mockImplementation((user) => Promise.resolve(user));

      const telegramData: TelegramUserData = {
        telegramId: 111222333,
        firstName: 'Jane',
      };

      const user = await service.registerUser(telegramData);

      expect(user.lastSeenAt).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('Scenario: Existing user enters Telegram Mini App', () => {
    it('should return existing user without creating new one', async () => {
      const existingUser = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);

      const telegramData: TelegramUserData = {
        telegramId: 123456789,
        firstName: 'Test',
      };

      const user = await service.registerUser(telegramData);

      expect(user).toBe(existingUser);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should load existing user with all fields intact', async () => {
      const existingUser = createMockUser({
        telegram_id: 555666777,
        first_name: 'Alice',
        last_name: 'Smith',
        username: 'alicesmith',
        language_code: 'es',
        is_premium: true,
      });
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);

      const telegramData: TelegramUserData = {
        telegramId: 555666777,
        firstName: 'Alice',
      };

      const user = await service.registerUser(telegramData);

      expect(user.id.value).toBe(existingUser.id.value);
      expect(user.telegramId.value).toBe(555666777);
      expect(user.firstName).toBe('Alice');
      expect(user.lastName).toBe('Smith');
      expect(user.username?.value).toBe('alicesmith');
      expect(user.languageCode?.value).toBe('es');
      expect(user.isPremium).toBe(true);
    });
  });

  describe('Scenario: User data synchronization', () => {
    it('should synchronize only changed fields', async () => {
      const existingUser = createMockUser({
        username: 'oldusername',
        first_name: 'OldName',
        is_premium: false,
      });
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);
      mockRepository.update.mockImplementation((user) => Promise.resolve(user));

      await service.syncFromTelegram(123456789, {
        username: 'newusername',
        isPremium: true,
      });

      const updateCall = mockRepository.update.mock.calls[0][0];
      expect(updateCall.username?.value).toBe('newusername');
      expect(updateCall.isPremium).toBe(true);
      expect(updateCall.firstName).toBe('OldName');
    });

    it('should update lastSeenAt when syncing', async () => {
      const existingUser = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);
      mockRepository.update.mockImplementation((user) => Promise.resolve(user));

      await service.syncFromTelegram(123456789, {
        firstName: 'Updated',
      });

      const updateCall = mockRepository.update.mock.calls[0][0];
      expect(updateCall.lastSeenAt).toBeInstanceOf(Date);
    });

    it('should only update lastSeen when no other changes provided', async () => {
      const existingUser = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);
      mockRepository.updateLastSeen.mockResolvedValue(existingUser);

      await service.syncFromTelegram(123456789, {});

      expect(mockRepository.updateLastSeen).toHaveBeenCalled();
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should handle premium status change', async () => {
      const existingUser = createMockUser({ is_premium: false });
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);
      mockRepository.update.mockImplementation((user) => Promise.resolve(user));

      const result = await service.syncFromTelegram(123456789, {
        isPremium: true,
      });

      expect(result.isPremium).toBe(true);
    });

    it('should handle username change', async () => {
      const existingUser = createMockUser({ username: 'oldname' });
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);
      mockRepository.update.mockImplementation((user) => Promise.resolve(user));

      const result = await service.syncFromTelegram(123456789, {
        username: 'newname',
      });

      expect(result.username?.value).toBe('newname');
    });

    it('should handle language code change', async () => {
      const existingUser = createMockUser({ language_code: 'en' });
      mockRepository.findByTelegramId.mockResolvedValue(existingUser);
      mockRepository.update.mockImplementation((user) => Promise.resolve(user));

      const result = await service.syncFromTelegram(123456789, {
        languageCode: 'es',
      });

      expect(result.languageCode?.value).toBe('es');
    });
  });

  describe('Scenario: User lifecycle', () => {
    it('should soft delete user correctly', async () => {
      mockRepository.softDelete.mockResolvedValue(undefined);

      await service.deleteUser(mockUserRecord.id);

      expect(mockRepository.softDelete).toHaveBeenCalled();
    });

    it('should restore soft-deleted user', async () => {
      const restoredUser = createMockUser({ status: 'active' });
      mockRepository.restore.mockResolvedValue(restoredUser);

      const result = await service.restoreUser(mockUserRecord.id);

      expect(result.status).toBe(UserStatus.ACTIVE);
    });

    it('should update last seen on user activity', async () => {
      const user = createMockUser();
      mockRepository.updateLastSeen.mockResolvedValue(user);

      const result = await service.updateLastSeen(mockUserRecord.id);

      expect(mockRepository.updateLastSeen).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('Scenario: User lookup operations', () => {
    it('should find user by internal ID', async () => {
      const user = createMockUser();
      mockRepository.findById.mockResolvedValue(user);

      const result = await service.getUserById(mockUserRecord.id);

      expect(result?.id.value).toBe(mockUserRecord.id);
    });

    it('should find user by Telegram ID', async () => {
      const user = createMockUser();
      mockRepository.findByTelegramId.mockResolvedValue(user);

      const result = await service.getUserByTelegramId(123456789);

      expect(result?.telegramId.value).toBe(123456789);
    });

    it('should check if user exists', async () => {
      mockRepository.exists.mockResolvedValue(true);

      const result = await service.userExists(mockUserRecord.id);

      expect(result).toBe(true);
    });

    it('should return user summary', async () => {
      const user = createMockUser();
      mockRepository.findById.mockResolvedValue(user);

      const result = await service.getUserSummary(mockUserRecord.id);

      expect(result?.id).toBe(mockUserRecord.id);
      expect(result?.firstName).toBe('Test');
      expect(result?.username).toBe('testuser');
    });
  });

  describe('Scenario: Edge cases', () => {
    it('should handle user with no username', async () => {
      mockRepository.findByTelegramId.mockResolvedValue(null);
      mockRepository.create.mockImplementation((user) => Promise.resolve(user));

      const telegramData: TelegramUserData = {
        telegramId: 333444555,
        firstName: 'NoUsername',
      };

      const user = await service.registerUser(telegramData);

      expect(user.username).toBeNull();
    });

    it('should handle user with no lastName', async () => {
      mockRepository.findByTelegramId.mockResolvedValue(null);
      mockRepository.create.mockImplementation((user) => Promise.resolve(user));

      const telegramData: TelegramUserData = {
        telegramId: 444555666,
        firstName: 'SingleName',
      };

      const user = await service.registerUser(telegramData);

      expect(user.lastName).toBeNull();
    });

    it('should handle sync for non-existent user gracefully', async () => {
      mockRepository.findByTelegramId.mockResolvedValue(null);

      await expect(
        service.syncFromTelegram(999999999, { firstName: 'Test' })
      ).rejects.toThrow('User not found for Telegram ID');
    });

    it('should handle update for non-existent user', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateUser('987e6543-e89b-42d3-a456-426614174001', { firstName: 'Test' })
      ).rejects.toThrow('User not found');
    });
  });
});