/**
 * AdminAccount Entity
 *
 * Domain entity representing an administrative user account.
 * This entity contains ONLY administration identity - no gameplay data.
 *
 * AdminAccount Entity Responsibilities:
 * - Represent admin identity
 * - Store Telegram-linked profile information
 * - Track admin status and lifecycle
 * - Store role associations
 *
 * AdminAccount is NOT:
 * - Player data (gameplay)
 * - Game state or inventory
 * - Currency or rewards
 * - Any gameplay modifications
 */

import type { IAdminAccount } from '../interfaces/IAdminAccount';
import { AdminStatus } from '../types/AdminStatus';
import type { AdminRoleType } from '../types/AdminRoleType';
import type { AdminMetadata } from '../types/AdminMetadata';
import { AdminId } from '../value-objects/AdminId';
import { AdminRoleId } from '../value-objects/AdminRoleId';
import { TelegramId } from '../../user/value-objects/TelegramId';

/**
 * AdminAccount entity class.
 * Immutable domain entity representing an admin account.
 */
export class AdminAccount implements IAdminAccount {
  /** Unique internal identifier */
  public readonly id: AdminId;

  /** Telegram user ID */
  public readonly telegramId: TelegramId;

  /** Telegram username (optional) */
  public readonly username: string | null;

  /** Admin display name */
  public readonly displayName: string;

  /** Admin role ID */
  public readonly roleId: AdminRoleId;

  /** Admin role type (denormalized for quick access) */
  public readonly roleType: AdminRoleType;

  /** Current admin status */
  public readonly status: AdminStatus;

  /** Timestamp of last login */
  public readonly lastLoginAt: Date | null;

  /** Timestamp when account was created */
  public readonly createdAt: Date;

  /** Timestamp when account was last updated */
  public readonly updatedAt: Date;

  /** Additional metadata */
  public readonly metadata: AdminMetadata;

  /**
   * Creates a new AdminAccount instance.
   * @param props AdminAccount properties
   * @throws Error if required invariants are violated
   */
  constructor(props: AdminAccountProps) {
    this.id = props.id;
    this.telegramId = props.telegramId;
    this.username = props.username ?? null;
    this.displayName = props.displayName;
    this.roleId = props.roleId;
    this.roleType = props.roleType;
    this.status = props.status ?? AdminStatus.PENDING;
    this.lastLoginAt = props.lastLoginAt ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates an AdminAccount from Telegram user data.
   * Factory method for new admin registration.
   */
  public static create(params: {
    id?: string;
    telegramId: number;
    username?: string;
    displayName: string;
    roleId: string;
    roleType: AdminRoleType;
    status?: AdminStatus;
    metadata?: Partial<AdminMetadata>;
    createdBy?: string;
  }): AdminAccount {
    const now = new Date();
    const id = params.id ? AdminId.create(params.id) : AdminId.generate();

    const defaultMetadata: AdminMetadata = {
      notes: undefined,
      department: undefined,
      email: undefined,
      timezone: 'UTC',
      language: 'en',
      customFields: undefined,
      lastAction: undefined,
      allowedIpAddresses: undefined,
      twoFactorEnabled: false,
      sessionTimeoutSeconds: 3600,
      apiKeyHash: undefined,
      createdBy: params.createdBy,
      createdFromIp: undefined,
      updatedBy: undefined,
      updatedFromIp: undefined,
      version: 1,
    };

    return new AdminAccount({
      id,
      telegramId: TelegramId.create(params.telegramId),
      username: params.username ?? null,
      displayName: params.displayName,
      roleId: AdminRoleId.create(params.roleId),
      roleType: params.roleType,
      status: params.status ?? AdminStatus.PENDING,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
      metadata: { ...defaultMetadata, ...params.metadata },
    });
  }

  /**
   * Reconstructs an AdminAccount from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AdminAccountRecord): AdminAccount {
    return new AdminAccount({
      id: AdminId.reconstruct(record.id),
      telegramId: TelegramId.reconstruct(record.telegram_id),
      username: record.username,
      displayName: record.display_name,
      roleId: AdminRoleId.reconstruct(record.role_id),
      roleType: record.role_type as AdminRoleType,
      status: record.status as AdminStatus,
      lastLoginAt: record.last_login_at ? new Date(record.last_login_at) : null,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      metadata: record.metadata,
    });
  }

  /**
   * Serializes the AdminAccount to a plain object.
   */
  public toJSON(): AdminAccountJSON {
    return {
      id: this.id.value,
      telegramId: this.telegramId.value,
      username: this.username,
      displayName: this.displayName,
      roleId: this.roleId.value,
      roleType: this.roleType,
      status: this.status,
      lastLoginAt: this.lastLoginAt?.toISOString() ?? null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new AdminAccount instance.
   */
  public copyWith(params: Partial<AdminAccountProps>): AdminAccount {
    return new AdminAccount({
      id: this.id,
      telegramId: this.telegramId,
      username: params.username ?? this.username,
      displayName: params.displayName ?? this.displayName,
      roleId: params.roleId ?? this.roleId,
      roleType: params.roleType ?? this.roleType,
      status: params.status ?? this.status,
      lastLoginAt: params.lastLoginAt ?? this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Checks if this admin is active.
   */
  public isActive(): boolean {
    return this.status === AdminStatus.ACTIVE;
  }

  /**
   * Checks if this admin can perform actions.
   */
  public canPerformActions(): boolean {
    return this.status === AdminStatus.ACTIVE;
  }
}

/**
 * AdminAccount properties interface for constructor.
 */
export interface AdminAccountProps {
  id: AdminId;
  telegramId: TelegramId;
  username: string | null;
  displayName: string;
  roleId: AdminRoleId;
  roleType: AdminRoleType;
  status: AdminStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metadata: AdminMetadata;
}

/**
 * Database record representation of AdminAccount.
 */
export interface AdminAccountRecord {
  id: string;
  telegram_id: number;
  username: string | null;
  display_name: string;
  role_id: string;
  role_type: string;
  status: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: AdminMetadata;
}

/**
 * JSON serialization representation of AdminAccount.
 */
export interface AdminAccountJSON {
  id: string;
  telegramId: number;
  username: string | null;
  displayName: string;
  roleId: string;
  roleType: AdminRoleType;
  status: AdminStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: AdminMetadata;
}