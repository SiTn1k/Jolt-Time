/**
 * User Service
 *
 * Business logic for user-related operations.
 * Handles user registration, loading, updates, and Telegram synchronization.
 */

import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import { generateUUID } from '../../../shared/utils/format.utils';
import { IUserRepository } from '../repositories/IUserRepository';
import { User, UserRecord } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { TelegramId } from '../value-objects/TelegramId';
import { Username } from '../value-objects/Username';
import { LanguageCode } from '../value-objects/LanguageCode';
import { UserPhotoUrl } from '../value-objects/UserPhotoUrl';
import { UserStatus } from '../types/UserStatus';
import { UserMapper } from '../mappers/UserMapper';
import { UserValidator } from '../validators/UserValidator';
import type { CreateUserDto } from '../dto/CreateUser.dto';
import type { UpdateUserDto } from '../dto/UpdateUser.dto';
import type { UserResponseDto, UserSummaryDto } from '../dto/UserResponse.dto';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { UserFilterParams } from '../repositories/IUserRepository';

/**
 * Telegram user data for synchronization.
 */
export interface TelegramUserData {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  photoUrl?: string;
  isPremium?: boolean;
}

/**
 * User Service interface for dependency injection.
 */
export interface IUserService {
  /**
   * Registers a new user or returns existing user.
   */
  registerUser(data: TelegramUserData): Promise<User>;

  /**
   * Loads a user by their internal ID.
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Loads a user by their Telegram ID.
   */
  getUserByTelegramId(telegramId: number): Promise<User | null>;

  /**
   * Checks if a user exists.
   */
  userExists(id: string): Promise<boolean>;

  /**
   * Updates a user's profile data.
   */
  updateUser(id: string, dto: UpdateUserDto): Promise<User>;

  /**
   * Updates the last seen timestamp.
   */
  updateLastSeen(id: string): Promise<User>;

  /**
   * Soft deletes a user.
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Restores a soft-deleted user.
   */
  restoreUser(id: string): Promise<User>;

  /**
   * Synchronizes user data with Telegram.
   */
  syncFromTelegram(telegramId: number, data: Partial<TelegramUserData>): Promise<User>;

  /**
   * Gets a user summary (minimal data).
   */
  getUserSummary(id: string): Promise<UserSummaryDto | null>;

  /**
   * Lists users with pagination.
   */
  listUsers(params: PaginationParams, filters?: UserFilterParams): Promise<PaginatedResult<User>>;

  /**
   * Counts users with optional filtering.
   */
  countUsers(filters?: UserFilterParams): Promise<number>;

  /**
   * Converts a user to a response DTO.
   */
  toResponse(user: User): UserResponseDto;
}

/**
 * User Service implementation.
 */
export class UserService implements IUserService {
  private readonly repository: IUserRepository;
  private readonly logger: ILogger;

  /**
   * Creates a new UserService instance.
   */
  constructor(
    repository: IUserRepository,
    logger?: ILogger
  ) {
    this.repository = repository;
    this.logger = logger ?? getLogger().child({ module: 'UserService' });
  }

  /**
   * Registers a new user or returns existing user.
   * 
   * When an authenticated Telegram user enters the application:
   * - If user exists: Load existing user
   * - If user does not exist: Create new user with initialized metadata
   */
  async registerUser(data: TelegramUserData): Promise<User> {
    this.logger.debug('Registering user', { telegramId: data.telegramId });

    const telegramId = TelegramId.create(data.telegramId);

    const existingUser = await this.repository.findByTelegramId(telegramId);
    if (existingUser) {
      this.logger.info('User already exists, loading', { userId: existingUser.id.value });
      return existingUser;
    }

    const createDto: CreateUserDto = {
      telegramId: data.telegramId,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      languageCode: data.languageCode,
      photoUrl: data.photoUrl,
      isPremium: data.isPremium ?? false,
      status: UserStatus.ACTIVE,
      registrationSource: 'telegram_mini_app',
    };

    UserValidator.validateCreateOrThrow(createDto);

    const now = new Date();
    const userId = generateUUID();

    const user = new User({
      id: UserId.reconstruct(userId),
      telegramId: TelegramId.create(data.telegramId),
      username: Username.create(data.username),
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      languageCode: LanguageCode.create(data.languageCode),
      photoUrl: UserPhotoUrl.create(data.photoUrl),
      isPremium: data.isPremium ?? false,
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now,
      status: UserStatus.ACTIVE,
    });

    const createdUser = await this.repository.create(user);
    this.logger.info('User registered successfully', { userId: createdUser.id.value });
    return createdUser;
  }

  /**
   * Loads a user by their internal ID.
   */
  async getUserById(id: string): Promise<User | null> {
    this.logger.debug('Getting user by ID', { userId: id });
    const userId = UserId.create(id);
    return this.repository.findById(userId);
  }

  /**
   * Loads a user by their Telegram ID.
   */
  async getUserByTelegramId(telegramId: number): Promise<User | null> {
    this.logger.debug('Getting user by Telegram ID', { telegramId });
    const userTelegramId = TelegramId.create(telegramId);
    return this.repository.findByTelegramId(userTelegramId);
  }

  /**
   * Checks if a user exists.
   */
  async userExists(id: string): Promise<boolean> {
    this.logger.debug('Checking if user exists', { userId: id });
    const userId = UserId.create(id);
    return this.repository.exists(userId);
  }

  /**
   * Updates a user's profile data.
   */
  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    this.logger.debug('Updating user', { userId: id });

    UserValidator.validateUpdateOrThrow(dto);

    const userId = UserId.create(id);
    const existingUser = await this.repository.findById(userId);

    if (!existingUser) {
      throw new Error(`User not found: ${id}`);
    }

    const updatedUser = existingUser.copyWith({
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username ? Username.create(dto.username) : existingUser.username,
      languageCode: dto.languageCode ? LanguageCode.create(dto.languageCode) : existingUser.languageCode,
      photoUrl: dto.photoUrl ? UserPhotoUrl.create(dto.photoUrl) : existingUser.photoUrl,
      isPremium: dto.isPremium,
      status: dto.status,
      lastSeenAt: dto.lastSeenAt,
    });

    return this.repository.update(updatedUser);
  }

  /**
   * Updates the last seen timestamp.
   */
  async updateLastSeen(id: string): Promise<User> {
    this.logger.debug('Updating last seen', { userId: id });
    const userId = UserId.create(id);
    return this.repository.updateLastSeen(userId);
  }

  /**
   * Soft deletes a user.
   */
  async deleteUser(id: string): Promise<void> {
    this.logger.debug('Deleting user', { userId: id });
    const userId = UserId.create(id);
    return this.repository.softDelete(userId);
  }

  /**
   * Restores a soft-deleted user.
   */
  async restoreUser(id: string): Promise<User> {
    this.logger.debug('Restoring user', { userId: id });
    const userId = UserId.create(id);
    return this.repository.restore(userId);
  }

  /**
   * Synchronizes user data with Telegram.
   * Only synchronizes changed fields.
   */
  async syncFromTelegram(telegramId: number, data: Partial<TelegramUserData>): Promise<User> {
    this.logger.debug('Syncing user from Telegram', { telegramId, changedFields: Object.keys(data) });

    const user = await this.getUserByTelegramId(telegramId);
    if (!user) {
      throw new Error(`User not found for Telegram ID: ${telegramId}`);
    }

    const changes: Partial<{
      username: Username | null;
      firstName: string;
      lastName: string | null;
      languageCode: LanguageCode | null;
      photoUrl: UserPhotoUrl | null;
      isPremium: boolean;
      lastSeenAt: Date;
    }> = {};

    if (data.username !== undefined && data.username !== user.username?.value) {
      changes.username = Username.create(data.username);
    }

    if (data.firstName !== undefined && data.firstName !== user.firstName) {
      changes.firstName = data.firstName;
    }

    if (data.lastName !== undefined && data.lastName !== user.lastName) {
      changes.lastName = data.lastName ?? null;
    }

    if (data.languageCode !== undefined && data.languageCode !== user.languageCode?.value) {
      changes.languageCode = LanguageCode.create(data.languageCode);
    }

    if (data.photoUrl !== undefined && data.photoUrl !== user.photoUrl?.value) {
      changes.photoUrl = UserPhotoUrl.create(data.photoUrl);
    }

    if (data.isPremium !== undefined && data.isPremium !== user.isPremium) {
      changes.isPremium = data.isPremium;
    }

    changes.lastSeenAt = new Date();

    if (Object.keys(changes).length === 1 && changes.lastSeenAt) {
      return this.repository.updateLastSeen(user.id);
    }

    const updatedUser = user.copyWith(changes);
    return this.repository.update(updatedUser);
  }

  /**
   * Gets a user summary (minimal data).
   */
  async getUserSummary(id: string): Promise<UserSummaryDto | null> {
    this.logger.debug('Getting user summary', { userId: id });
    const user = await this.getUserById(id);
    if (!user) return null;
    return UserMapper.toSummary(user);
  }

  /**
   * Lists users with pagination.
   */
  async listUsers(
    params: PaginationParams,
    filters?: UserFilterParams
  ): Promise<PaginatedResult<User>> {
    this.logger.debug('Listing users', { params, filters });
    return this.repository.list(params, filters);
  }

  /**
   * Counts users with optional filtering.
   */
  async countUsers(filters?: UserFilterParams): Promise<number> {
    this.logger.debug('Counting users', { filters });
    return this.repository.count(filters);
  }

  /**
   * Converts a user to a response DTO.
   */
  toResponse(user: User): UserResponseDto {
    return UserMapper.toResponse(user);
  }
}

/**
 * Creates a UserService with dependencies.
 */
export function createUserService(repository: IUserRepository): UserService {
  return new UserService(repository);
}