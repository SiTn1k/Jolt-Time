/**
 * AdminRole Entity
 *
 * Domain entity representing an administrative role.
 * Roles define sets of permissions that can be assigned to admin accounts.
 *
 * AdminRole Entity Responsibilities:
 * - Define role identity
 * - Store permission sets
 * - Track role priority for hierarchy
 * - Store metadata for UI display
 *
 * AdminRole is NOT:
 * - A gameplay role
 * - Any gameplay logic
 */

import type { IAdminRole } from '../interfaces/IAdminRole';
import { AdminRoleType } from '../types/AdminRoleType';
import { AdminPermissionType, DEFAULT_ROLE_PERMISSIONS } from '../types/AdminPermissionType';
import type { AdminRoleMetadata } from '../types/AdminMetadata';
import { AdminRoleId } from '../value-objects/AdminRoleId';

/**
 * AdminRole entity class.
 * Immutable domain entity representing an admin role.
 */
export class AdminRole implements IAdminRole {
  /** Unique internal identifier */
  public readonly id: AdminRoleId;

  /** Role name */
  public readonly name: string;

  /** Role type for system roles */
  public readonly type: AdminRoleType;

  /** Priority level (higher = more authority) */
  public readonly priority: number;

  /** Set of permissions granted by this role */
  public readonly permissions: Set<AdminPermissionType>;

  /** Additional metadata */
  public readonly metadata: AdminRoleMetadata;

  /**
   * Creates a new AdminRole instance.
   * @param props AdminRole properties
   * @throws Error if required invariants are violated
   */
  constructor(props: AdminRoleProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.priority = props.priority;
    this.permissions = new Set(props.permissions);
    this.metadata = props.metadata;
  }

  /**
   * Creates an AdminRole from role type.
   * Factory method for creating system roles.
   */
  public static fromType(params: {
    type: AdminRoleType;
    name?: string;
    permissions?: AdminPermissionType[];
    createdBy?: string;
  }): AdminRole {
    const now = new Date();
    const priority = {
      [AdminRoleType.SUPPORT]: 1,
      [AdminRoleType.MODERATOR]: 2,
      [AdminRoleType.ANALYST]: 3,
      [AdminRoleType.DEVELOPER]: 4,
      [AdminRoleType.ADMINISTRATOR]: 5,
      [AdminRoleType.OWNER]: 6,
    }[params.type];

    // Use DEFAULT_ROLE_PERMISSIONS when permissions not provided
    const defaultPermissions = params.permissions ?? DEFAULT_ROLE_PERMISSIONS[params.type] ?? [];

    const metadata: AdminRoleMetadata = {
      description: undefined,
      colorCode: undefined,
      iconName: undefined,
      isSystemRole: true,
      assignable: params.type !== AdminRoleType.OWNER,
      createdBy: params.createdBy,
      updatedBy: undefined,
      version: 1,
    };

    return new AdminRole({
      id: AdminRoleId.generate(),
      name: params.name ?? params.type,
      type: params.type,
      priority,
      permissions: defaultPermissions,
      metadata,
    });
  }

  /**
   * Creates a custom AdminRole.
   * Factory method for creating custom roles.
   */
  public static create(params: {
    id?: string;
    name: string;
    type?: AdminRoleType;
    priority: number;
    permissions: AdminPermissionType[];
    metadata?: Partial<AdminRoleMetadata>;
    createdBy?: string;
  }): AdminRole {
    const metadata: AdminRoleMetadata = {
      description: params.metadata?.description,
      colorCode: params.metadata?.colorCode,
      iconName: params.metadata?.iconName,
      isSystemRole: false,
      assignable: params.metadata?.assignable ?? true,
      createdBy: params.createdBy,
      updatedBy: undefined,
      version: 1,
    };

    return new AdminRole({
      id: params.id ? AdminRoleId.create(params.id) : AdminRoleId.generate(),
      name: params.name,
      type: params.type ?? AdminRoleType.ADMINISTRATOR,
      priority: params.priority,
      permissions: params.permissions,
      metadata,
    });
  }

  /**
   * Reconstructs an AdminRole from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AdminRoleRecord): AdminRole {
    return new AdminRole({
      id: AdminRoleId.reconstruct(record.id),
      name: record.name,
      type: record.type as AdminRoleType,
      priority: record.priority,
      permissions: record.permissions as AdminPermissionType[],
      metadata: record.metadata,
    });
  }

  /**
   * Serializes the AdminRole to a plain object.
   */
  public toJSON(): AdminRoleJSON {
    return {
      id: this.id.value,
      name: this.name,
      type: this.type,
      priority: this.priority,
      permissions: Array.from(this.permissions),
      metadata: this.metadata,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new AdminRole instance.
   */
  public copyWith(params: Partial<AdminRoleProps>): AdminRole {
    return new AdminRole({
      id: this.id,
      name: params.name ?? this.name,
      type: params.type ?? this.type,
      priority: params.priority ?? this.priority,
      permissions: params.permissions ?? Array.from(this.permissions),
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Checks if this role has a specific permission.
   */
  public hasPermission(permission: AdminPermissionType): boolean {
    return this.permissions.has(permission);
  }

  /**
   * Checks if this role has all of the specified permissions.
   */
  public hasAllPermissions(permissions: AdminPermissionType[]): boolean {
    return permissions.every((p) => this.permissions.has(p));
  }

  /**
   * Checks if this role has any of the specified permissions.
   */
  public hasAnyPermission(permissions: AdminPermissionType[]): boolean {
    return permissions.some((p) => this.permissions.has(p));
  }

  /**
   * Checks if this role has higher or equal priority than another.
   */
  public hasHigherOrEqualPriority(other: AdminRole): boolean {
    return this.priority >= other.priority;
  }
}

/**
 * AdminRole properties interface for constructor.
 */
export interface AdminRoleProps {
  id: AdminRoleId;
  name: string;
  type: AdminRoleType;
  priority: number;
  permissions: AdminPermissionType[];
  metadata: AdminRoleMetadata;
}

/**
 * Database record representation of AdminRole.
 */
export interface AdminRoleRecord {
  id: string;
  name: string;
  type: string;
  priority: number;
  permissions: string[];
  metadata: AdminRoleMetadata;
}

/**
 * JSON serialization representation of AdminRole.
 */
export interface AdminRoleJSON {
  id: string;
  name: string;
  type: AdminRoleType;
  priority: number;
  permissions: AdminPermissionType[];
  metadata: AdminRoleMetadata;
}