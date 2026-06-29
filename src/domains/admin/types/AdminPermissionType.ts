/**
 * Admin Permission Type Enum
 *
 * Defines granular permissions that can be assigned to admin roles.
 * Admin domain permissions are ADMINISTRATION ONLY - no gameplay permissions.
 */

/**
 * Admin module categories for permission organization.
 */
export enum AdminModule {
  ADMIN_ACCOUNT = 'admin_account',
  ADMIN_ROLE = 'admin_role',
  ADMIN_PERMISSION = 'admin_permission',
  AUDIT_LOG = 'audit_log',
  CONFIGURATION = 'configuration',
  BAN_MANAGEMENT = 'ban_management',
  PLAYER_REVIEW = 'player_review',
  ECONOMY_OVERVIEW = 'economy_overview',
  REPORTING = 'reporting',
}

export enum AdminPermissionType {
  // Admin Account Management
  ADMIN_CREATE = 'admin:account:create',
  ADMIN_READ = 'admin:account:read',
  ADMIN_UPDATE = 'admin:account:update',
  ADMIN_DELETE = 'admin:account:delete',
  ADMIN_LIST = 'admin:account:list',

  // Admin Role Management
  ROLE_CREATE = 'admin:role:create',
  ROLE_READ = 'admin:role:read',
  ROLE_UPDATE = 'admin:role:update',
  ROLE_DELETE = 'admin:role:delete',
  ROLE_LIST = 'admin:role:list',
  ROLE_ASSIGN = 'admin:role:assign',

  // Admin Permission Management
  PERMISSION_CREATE = 'admin:permission:create',
  PERMISSION_READ = 'admin:permission:read',
  PERMISSION_UPDATE = 'admin:permission:update',
  PERMISSION_DELETE = 'admin:permission:delete',
  PERMISSION_LIST = 'admin:permission:list',

  // Audit Log
  AUDIT_READ = 'admin:audit:read',
  AUDIT_EXPORT = 'admin:audit:export',

  // Configuration
  CONFIG_READ = 'admin:config:read',
  CONFIG_UPDATE = 'admin:config:update',

  // Ban Management
  BAN_READ = 'admin:ban:read',
  BAN_CREATE = 'admin:ban:create',
  BAN_UPDATE = 'admin:ban:update',
  BAN_DELETE = 'admin:ban:delete',

  // Player Review (view only, no modification)
  PLAYER_READ = 'admin:player:read',
  PLAYER_SEARCH = 'admin:player:search',

  // Economy Overview (view only, no modification)
  ECONOMY_READ = 'admin:economy:read',

  // Reporting
  REPORT_VIEW = 'admin:report:view',
  REPORT_EXPORT = 'admin:report:export',
}

/**
 * Default permissions for each admin role type.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, AdminPermissionType[]> = {
  [AdminRoleType.SUPPORT]: [
    AdminPermissionType.PLAYER_READ,
    AdminPermissionType.PLAYER_SEARCH,
    AdminPermissionType.AUDIT_READ,
  ],
  [AdminRoleType.MODERATOR]: [
    AdminPermissionType.PLAYER_READ,
    AdminPermissionType.PLAYER_SEARCH,
    AdminPermissionType.BAN_READ,
    AdminPermissionType.BAN_CREATE,
    AdminPermissionType.BAN_UPDATE,
    AdminPermissionType.AUDIT_READ,
  ],
  [AdminRoleType.ANALYST]: [
    AdminPermissionType.PLAYER_READ,
    AdminPermissionType.PLAYER_SEARCH,
    AdminPermissionType.ECONOMY_READ,
    AdminPermissionType.REPORT_VIEW,
    AdminPermissionType.REPORT_EXPORT,
    AdminPermissionType.AUDIT_READ,
    AdminPermissionType.AUDIT_EXPORT,
  ],
  [AdminRoleType.DEVELOPER]: [
    AdminPermissionType.PLAYER_READ,
    AdminPermissionType.PLAYER_SEARCH,
    AdminPermissionType.ECONOMY_READ,
    AdminPermissionType.CONFIG_READ,
    AdminPermissionType.CONFIG_UPDATE,
    AdminPermissionType.AUDIT_READ,
    AdminPermissionType.AUDIT_EXPORT,
  ],
  [AdminRoleType.ADMINISTRATOR]: [
    AdminPermissionType.ADMIN_READ,
    AdminPermissionType.ADMIN_LIST,
    AdminPermissionType.ADMIN_UPDATE,
    AdminPermissionType.ROLE_READ,
    AdminPermissionType.ROLE_LIST,
    AdminPermissionType.PERMISSION_READ,
    AdminPermissionType.PERMISSION_LIST,
    AdminPermissionType.BAN_READ,
    AdminPermissionType.BAN_CREATE,
    AdminPermissionType.BAN_UPDATE,
    AdminPermissionType.BAN_DELETE,
    AdminPermissionType.PLAYER_READ,
    AdminPermissionType.PLAYER_SEARCH,
    AdminPermissionType.ECONOMY_READ,
    AdminPermissionType.CONFIG_READ,
    AdminPermissionType.CONFIG_UPDATE,
    AdminPermissionType.REPORT_VIEW,
    AdminPermissionType.REPORT_EXPORT,
    AdminPermissionType.AUDIT_READ,
    AdminPermissionType.AUDIT_EXPORT,
  ],
  [AdminRoleType.OWNER]: Object.values(AdminPermissionType),
};

// Import AdminRoleType for type reference
import { AdminRoleType } from './AdminRoleType';