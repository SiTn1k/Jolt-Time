/**
 * Admin Domain Dependency Injection Registration
 *
 * Registers all admin domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAdminRepository } from './repositories/SupabaseAdminRepository';
import { AdminMapper } from './mappers/AdminMapper';
import { RoleMapper } from './mappers/RoleMapper';
import { PermissionMapper } from './mappers/PermissionMapper';
import { AdminValidator, RoleValidator, PermissionValidator } from './validators';
import { AdminService } from './services/AdminService';
import { PermissionEngine, getPermissionEngine } from './services/PermissionEngine';
import { AuditService, getAuditService } from './services/AuditService';

/**
 * Admin Domain DI configuration keys.
 */
export const ADMIN_TOKENS = {
  ADMIN_REPOSITORY: Symbol.for('SupabaseAdminRepository'),
  ADMIN_SERVICE: Symbol.for('AdminService'),
  PERMISSION_ENGINE: Symbol.for('PermissionEngine'),
  AUDIT_SERVICE: Symbol.for('AuditService'),
  ADMIN_MAPPER: Symbol.for('AdminMapper'),
  ROLE_MAPPER: Symbol.for('RoleMapper'),
  PERMISSION_MAPPER: Symbol.for('PermissionMapper'),
  ADMIN_VALIDATOR: Symbol.for('AdminValidator'),
  ROLE_VALIDATOR: Symbol.for('RoleValidator'),
  PERMISSION_VALIDATOR: Symbol.for('PermissionValidator'),
} as const;

/**
 * Register all admin domain dependencies with the container.
 */
export function registerAdminDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseAdminRepository,
    () => new SupabaseAdminRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Services (Singleton)
  container.registerFactory(
    AdminService,
    (c) => new AdminService(c.resolve<IAdminRepository>(ADMIN_TOKENS.ADMIN_REPOSITORY)),
    { lifetime: Lifetime.Singleton }
  );

  container.registerInstance(PermissionEngine, getPermissionEngine());
  container.registerInstance(AuditService, getAuditService());

  // Mappers (Singleton - stateless)
  container.registerInstance(AdminMapper, new AdminMapper());
  container.registerInstance(RoleMapper, new RoleMapper());
  container.registerInstance(PermissionMapper, new PermissionMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(AdminValidator, new AdminValidator());
  container.registerInstance(RoleValidator, new RoleValidator());
  container.registerInstance(PermissionValidator, new PermissionValidator());
}

// Import the repository interface for type resolution
import type { IAdminRepository } from './interfaces/IAdminRepository';

/**
 * Quick setup function for admin domain.
 * Creates and configures all admin domain components.
 */
export function setupAdminDomain(): {
  adminRepository: SupabaseAdminRepository;
  adminService: AdminService;
  permissionEngine: PermissionEngine;
  auditService: AuditService;
  adminMapper: AdminMapper;
  roleMapper: RoleMapper;
  permissionMapper: PermissionMapper;
  adminValidator: AdminValidator;
  roleValidator: RoleValidator;
  permissionValidator: PermissionValidator;
} {
  const adminRepository = new SupabaseAdminRepository();
  const adminService = new AdminService(adminRepository);
  const permissionEngine = getPermissionEngine();
  const auditService = getAuditService();
  const adminMapper = new AdminMapper();
  const roleMapper = new RoleMapper();
  const permissionMapper = new PermissionMapper();
  const adminValidator = new AdminValidator();
  const roleValidator = new RoleValidator();
  const permissionValidator = new PermissionValidator();

  return {
    adminRepository,
    adminService,
    permissionEngine,
    auditService,
    adminMapper,
    roleMapper,
    permissionMapper,
    adminValidator,
    roleValidator,
    permissionValidator,
  };
}