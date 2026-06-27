/**
 * User Mapper
 *
 * Maps between User entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { User } from '../entities/User';
import type { CreateUserDto } from '../dto/CreateUser.dto';
import type { UpdateUserDto } from '../dto/UpdateUser.dto';
import type { UserResponseDto, UserSummaryDto } from '../dto/UserResponse.dto';
import type { UserRecord } from '../entities/User';

/**
 * Mapper for converting between User entity and DTOs.
 */
export class UserMapper {
  /**
   * Converts a User entity to UserResponseDto.
   * Note: role is not part of User entity and should be resolved separately.
   */
  public static toResponse(user: User, role?: string): UserResponseDto {
    const response: UserResponseDto = {
      id: user.id.value,
      telegramId: user.telegramId.value,
      username: user.username?.value ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      languageCode: user.languageCode?.value ?? null,
      photoUrl: user.photoUrl?.value ?? null,
      isPremium: user.isPremium,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
    };

    if (role) {
      response.role = role as UserResponseDto['role'];
    }

    return response;
  }

  /**
   * Converts a User entity to UserSummaryDto.
   */
  public static toSummary(user: User): UserSummaryDto {
    return {
      id: user.id.value,
      username: user.username?.value ?? null,
      firstName: user.firstName,
      photoUrl: user.photoUrl?.value ?? null,
      isPremium: user.isPremium,
    };
  }

  /**
   * Converts an array of User entities to UserResponseDto array.
   */
  public static toResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }

  /**
   * Converts a CreateUserDto to partial User props.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateUserDto): Omit<CreateUserDto, 'telegramId' | 'firstName'> & {
    telegramId: number;
    firstName: string;
  } {
    return {
      telegramId: dto.telegramId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      languageCode: dto.languageCode,
      photoUrl: dto.photoUrl,
      isPremium: dto.isPremium,
      status: dto.status,
      registrationSource: dto.registrationSource,
    };
  }

  /**
   * Converts an UpdateUserDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateUserDto): Partial<User> {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username as unknown as User['username'],
      languageCode: dto.languageCode as unknown as User['languageCode'],
      photoUrl: dto.photoUrl as unknown as User['photoUrl'],
      isPremium: dto.isPremium,
      status: dto.status,
      lastSeenAt: dto.lastSeenAt,
    } as Partial<User>;
  }

  /**
   * Converts a database record to CreateUserDto format.
   */
  public static fromRecordToDto(record: UserRecord): CreateUserDto {
    return {
      telegramId: record.telegram_id,
      firstName: record.first_name,
      lastName: record.last_name ?? undefined,
      username: record.username ?? undefined,
      languageCode: record.language_code ?? undefined,
      photoUrl: record.photo_url ?? undefined,
      isPremium: record.is_premium,
      status: record.status as CreateUserDto['status'],
    };
  }

  /**
   * Converts a User entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(user: User): Omit<UserRecord, 'telegram_id' | 'username' | 'first_name' | 'last_name' | 'language_code' | 'photo_url' | 'is_premium' | 'created_at' | 'updated_at' | 'last_seen_at' | 'status'> & {
    telegram_id: number;
    username: string | null;
    first_name: string;
    last_name: string | null;
    language_code: string | null;
    photo_url: string | null;
    is_premium: boolean;
    created_at: string;
    updated_at: string;
    last_seen_at: string | null;
    status: string;
  } {
    return {
      id: user.id.value,
      telegram_id: user.telegramId.value,
      username: user.username?.value ?? null,
      first_name: user.firstName,
      last_name: user.lastName,
      language_code: user.languageCode?.value ?? null,
      photo_url: user.photoUrl?.value ?? null,
      is_premium: user.isPremium,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
      last_seen_at: user.lastSeenAt?.toISOString() ?? null,
      status: user.status,
    };
  }
}