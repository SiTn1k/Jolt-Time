/**
 * User Entity
 *
 * Domain entity representing an authenticated user.
 * This entity contains ONLY identity information - no gameplay data.
 *
 * User Entity Responsibilities:
 * - Represent authenticated user identity
 * - Store Telegram-related profile information
 * - Track user status and lifecycle
 *
 * User Entity is NOT:
 * - Player Profile (gameplay data)
 * - Game state or inventory
 * - Session or authentication tokens
 */

import type { IUser } from '../interfaces/IUser';
import { UserStatus } from '../types/UserStatus';
import { UserId } from '../value-objects/UserId';
import { TelegramId } from '../value-objects/TelegramId';
import { Username } from '../value-objects/Username';
import { LanguageCode } from '../value-objects/LanguageCode';
import { UserPhotoUrl } from '../value-objects/UserPhotoUrl';

/**
 * User entity class.
 * Immutable domain entity representing a user.
 */
export class User implements IUser {
  /** Unique internal identifier */
  public readonly id: UserId;

  /** Telegram user ID */
  public readonly telegramId: TelegramId;

  /** Telegram username (optional) */
  public readonly username: Username | null;

  /** User's first name */
  public readonly firstName: string;

  /** User's last name (optional) */
  public readonly lastName: string | null;

  /** Telegram language code */
  public readonly languageCode: LanguageCode | null;

  /** URL to user's Telegram photo */
  public readonly photoUrl: UserPhotoUrl | null;

  /** Whether user has Telegram Premium */
  public readonly isPremium: boolean;

  /** Timestamp when user was created */
  public readonly createdAt: Date;

  /** Timestamp when user was last updated */
  public readonly updatedAt: Date;

  /** Timestamp when user was last seen */
  public readonly lastSeenAt: Date | null;

  /** Current user status */
  public readonly status: UserStatus;

  /**
   * Creates a new User instance.
   * @param props User properties
   * @throws Error if required invariants are violated
   */
  constructor(props: UserProps) {
    this.id = props.id;
    this.telegramId = props.telegramId;
    this.username = props.username;
    this.firstName = props.firstName;
    this.lastName = props.lastName ?? null;
    this.languageCode = props.languageCode;
    this.photoUrl = props.photoUrl;
    this.isPremium = props.isPremium ?? false;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.lastSeenAt = props.lastSeenAt ?? null;
    this.status = props.status ?? UserStatus.ACTIVE;
  }

  /**
   * Creates a User from Telegram user data.
   * Factory method for new user registration.
   */
  public static fromTelegram(params: {
    id: string;
    telegramId: number;
    firstName: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
    photoUrl?: string;
    isPremium?: boolean;
  }): User {
    const now = new Date();

    return new User({
      id: UserId.create(params.id),
      telegramId: TelegramId.create(params.telegramId),
      firstName: params.firstName,
      lastName: params.lastName ?? null,
      username: Username.create(params.username),
      languageCode: LanguageCode.create(params.languageCode),
      photoUrl: UserPhotoUrl.create(params.photoUrl),
      isPremium: params.isPremium ?? false,
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now,
      status: UserStatus.ACTIVE,
    });
  }

  /**
   * Creates a User from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: UserRecord): User {
    return new User({
      id: UserId.reconstruct(record.id),
      telegramId: TelegramId.reconstruct(record.telegram_id),
      username: Username.create(record.username),
      firstName: record.first_name,
      lastName: record.last_name,
      languageCode: LanguageCode.create(record.language_code),
      photoUrl: UserPhotoUrl.create(record.photo_url),
      isPremium: record.is_premium,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      lastSeenAt: record.last_seen_at ? new Date(record.last_seen_at) : null,
      status: record.status as UserStatus,
    });
  }

  /**
   * Serializes the User to a plain object.
   */
  public toJSON(): UserJSON {
    return {
      id: this.id.value,
      telegramId: this.telegramId.value,
      username: this.username?.value ?? null,
      firstName: this.firstName,
      lastName: this.lastName,
      languageCode: this.languageCode?.value ?? null,
      photoUrl: this.photoUrl?.value ?? null,
      isPremium: this.isPremium,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastSeenAt: this.lastSeenAt?.toISOString() ?? null,
      status: this.status,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new User instance.
   */
  public copyWith(params: Partial<UserProps>): User {
    return new User({
      id: this.id,
      telegramId: this.telegramId,
      username: params.username ?? this.username,
      firstName: params.firstName ?? this.firstName,
      lastName: params.lastName ?? this.lastName,
      languageCode: params.languageCode ?? this.languageCode,
      photoUrl: params.photoUrl ?? this.photoUrl,
      isPremium: params.isPremium ?? this.isPremium,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      lastSeenAt: params.lastSeenAt ?? this.lastSeenAt,
      status: params.status ?? this.status,
    });
  }
}

/**
 * User properties interface for constructor.
 */
export interface UserProps {
  id: UserId;
  telegramId: TelegramId;
  username: Username | null;
  firstName: string;
  lastName: string | null;
  languageCode: LanguageCode | null;
  photoUrl: UserPhotoUrl | null;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt: Date | null;
  status: UserStatus;
}

/**
 * Database record representation of User.
 */
export interface UserRecord {
  id: string;
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
}

/**
 * JSON serialization representation of User.
 */
export interface UserJSON {
  id: string;
  telegramId: number;
  username: string | null;
  firstName: string;
  lastName: string | null;
  languageCode: string | null;
  photoUrl: string | null;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string | null;
  status: UserStatus;
}