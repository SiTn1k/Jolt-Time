/**
 * Admin Domain Types
 *
 * Type definitions for the admin domain.
 */

export { AdminStatus } from './AdminStatus';
export {
  AdminRoleType,
  ADMIN_ROLE_PRIORITY,
  getRolePriority,
  hasRolePriority,
} from './AdminRoleType';
export {
  AdminPermissionType,
  AdminModule,
  DEFAULT_ROLE_PERMISSIONS,
} from './AdminPermissionType';
export type {
  AdminMetadata,
  AdminRoleMetadata,
  AdminPermissionMetadata,
  createDefaultAdminMetadata,
  createDefaultRoleMetadata,
} from './AdminMetadata';
export type {
  AdminStatistics,
  AdminSessionStatistics,
  AdminActionStatistics,
  createEmptyAdminStatistics,
} from './AdminStatistics';