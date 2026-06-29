/**
 * AdminPermission Entity
 *
 * Domain entity representing a granular permission in the admin system.
 * Permissions are the finest level of access control.
 *
 * AdminPermission Entity Responsibilities:
 * - Define permission identity
 * - Store permission metadata
 * - Categorize permissions by module
 *
 * AdminPermission is NOT:
 * - A gameplay permission
 * - Any gameplay logic
 */

import type { IAdminPermission } from '../interfaces/IAdminPermission';
import type { AdminPermissionType } from '../types/AdminPermissionType';
import type { AdminModule } from '../types/AdminPermissionType';
import type { AdminPermissionMetadata } from '../types/AdminMetadata';
import { PermissionId } from '../value-objects/PermissionId';

/**
 * AdminPermission entity class.
 * Immutable domain entity representing an admin permission.
 */
export class AdminPermission implements IAdminPermission {
  /** Unique internal identifier */
  public readonly id: PermissionId;

  /** Permission key (e.g., 'admin:account:read') */
  public readonly permissionKey: AdminPermissionType;

  /** Human-readable description */
  public readonly description: string;

  /** Module this permission belongs to */
  public readonly module: AdminModule;

  /** Additional metadata */
  public readonly metadata: AdminPermissionMetadata;

  /**
   * Creates a new AdminPermission instance.
   * @param props AdminPermission properties
   * @throws Error if required invariants are violated
   */
  constructor(props: AdminPermissionProps) {
    this.id = props.id;
    this.permissionKey = props.permissionKey;
    this.description = props.description;
    this.module = props.module;
    this.metadata = props.metadata;
  }

  /**
   * Creates an AdminPermission from a permission type.
   * Factory method for creating system permissions.
   */
  public static fromType(params: {
    permissionType: AdminPermissionType;
    description: string;
    module: AdminModule;
    createdBy?: string;
  }): AdminPermission {
    const metadata: AdminPermissionMetadata = {
      description: params.description,
      module: params.module,
      category: undefined,
      isDangerous: params.permissionType.includes('delete') || params.permissionType.includes('create'),
      createdBy: params.createdBy,
      version: 1,
    };

    return new AdminPermission({
      id: PermissionId.generate(),
      permissionKey: params.permissionType,
      description: params.description,
      module: params.module,
      metadata,
    });
  }

  /**
   * Creates a custom AdminPermission.
   * Factory method for creating custom permissions.
   */
  public static create(params: {
    id?: string;
    permissionKey: AdminPermissionType;
    description: string;
    module: AdminModule;
    metadata?: Partial<AdminPermissionMetadata>;
    createdBy?: string;
  }): AdminPermission {
    const metadata: AdminPermissionMetadata = {
      description: params.description,
      module: params.module,
      category: params.metadata?.category,
      isDangerous: params.metadata?.isDangerous ?? false,
      createdBy: params.createdBy,
      version: 1,
    };

    return new AdminPermission({
      id: params.id ? PermissionId.create(params.id) : PermissionId.generate(),
      permissionKey: params.permissionKey,
      description: params.description,
      module: params.module,
      metadata,
    });
  }

  /**
   * Reconstructs an AdminPermission from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AdminPermissionRecord): AdminPermission {
    return new AdminPermission({
      id: PermissionId.reconstruct(record.id),
      permissionKey: record.permission_key as AdminPermissionType,
      description: record.description,
      module: record.module as AdminModule,
      metadata: record.metadata,
    });
  }

  /**
   * Serializes the AdminPermission to a plain object.
   */
  public toJSON(): AdminPermissionJSON {
    return {
      id: this.id.value,
      permissionKey: this.permissionKey,
      description: this.description,
      module: this.module,
      metadata: this.metadata,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new AdminPermission instance.
   */
  public copyWith(params: Partial<AdminPermissionProps>): AdminPermission {
    return new AdminPermission({
      id: this.id,
      permissionKey: params.permissionKey ?? this.permissionKey,
      description: params.description ?? this.description,
      module: params.module ?? this.module,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Checks if this permission is considered dangerous.
   * Dangerous permissions typically involve delete or create operations.
   */
  public isDangerous(): boolean {
    return this.metadata.isDangerous;
  }
}

/**
 * AdminPermission properties interface for constructor.
 */
export interface AdminPermissionProps {
  id: PermissionId;
  permissionKey: AdminPermissionType;
  description: string;
  module: AdminModule;
  metadata: AdminPermissionMetadata;
}

/**
 * Database record representation of AdminPermission.
 */
export interface AdminPermissionRecord {
  id: string;
  permission_key: string;
  description: string;
  module: string;
  metadata: AdminPermissionMetadata;
}

/**
 * JSON serialization representation of AdminPermission.
 */
export interface AdminPermissionJSON {
  id: string;
  permissionKey: AdminPermissionType;
  description: string;
  module: AdminModule;
  metadata: AdminPermissionMetadata;
}