/**
 * Admin Domain Repositories
 *
 * Repository implementations for the admin domain.
 */

export type { IAdminRepository, AdminFilterParams, AdminRoleFilterParams, AdminPermissionFilterParams } from '../interfaces/IAdminRepository';
export { SupabaseAdminRepository } from './SupabaseAdminRepository';