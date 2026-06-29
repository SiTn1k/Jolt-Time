/**
 * Supabase Admin Repository
 *
 * Production Supabase implementation of the Admin repository.
 * Handles all Admin data persistence operations via Supabase.
 */

import type { SupabaseClient, PostgrestError } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import { getSupabaseClient, getSupabaseAdminClient } from '../../../database/providers/supabase.provider';
import { getLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import { SortOrder } from '../../../shared/constants';
import { RepositoryError } from '../../../database/errors/repository.error';
import type {
  IAdminRepository,
  AdminFilterParams,
  AdminRoleFilterParams,
  AdminPermissionFilterParams,
} from '../interfaces/IAdminRepository';
import { AdminAccount, type AdminAccountRecord } from '../entities/AdminAccount';
import { AdminRole, type AdminRoleRecord } from '../entities/AdminRole';
import { AdminPermission, type AdminPermissionRecord } from '../entities/AdminPermission';
import { AdminId } from '../value-objects/AdminId';
import { AdminRoleId } from '../value-objects/AdminRoleId';
import { PermissionId } from '../value-objects/PermissionId';
import { TelegramId } from '../../user/value-objects/TelegramId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { AdminRoleType } from '../types/AdminRoleType';

/**
 * Supabase implementation of the Admin Repository.
 * Implements IAdminRepository for Admin entity persistence.
 */
export class SupabaseAdminRepository implements IAdminRepository {
  private readonly client: SupabaseClient<Database>;
  private readonly logger: ILogger;
  private readonly adminTableName = 'admin_accounts';
  private readonly roleTableName = 'admin_roles';
  private readonly permissionTableName = 'admin_permissions';

  /**
   * Creates a new SupabaseAdminRepository instance.
   * @param client Optional Supabase client (uses default if not provided)
   * @param logger Optional logger instance (creates child logger if not provided)
   */
  constructor(
    client?: SupabaseClient<Database>,
    logger?: ILogger
  ) {
    this.client = client ?? getSupabaseClient();
    this.logger = logger ?? getLogger().child({ module: 'SupabaseAdminRepository' });
  }

  // #region Admin Account Operations
  // ================================================================================

  /**
   * Creates a new admin account.
   */
  async createAdmin(account: AdminAccount): Promise<AdminAccount> {
    try {
      const record = this.toAdminRecord(account);

      const { data, error } = await this.client
        .from(this.adminTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create admin account', { error, telegramId: account.telegramId.value });
        throw RepositoryError.createFailed('AdminAccount', this.toRepositoryError(error));
      }

      this.logger.info('Admin account created', { adminId: account.id.value, telegramId: account.telegramId.value });
      return this.fromAdminRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating admin', { error: err });
      throw RepositoryError.createFailed('AdminAccount', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Finds an admin account by their internal ID.
   */
  async findAdminById(id: AdminId): Promise<AdminAccount | null> {
    try {
      const { data, error } = await this.client
        .from(this.adminTableName)
        .select('*')
        .eq('id', id.value)
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to find admin by ID', { error, adminId: id.value });
        throw RepositoryError.entityNotFound('AdminAccount', id.value, this.adminTableName);
      }

      if (!data) return null;
      return this.fromAdminRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding admin by ID', { error: err, adminId: id.value });
      throw RepositoryError.entityNotFound('AdminAccount', id.value, this.adminTableName);
    }
  }

  /**
   * Finds an admin account by their Telegram ID.
   */
  async findAdminByTelegramId(telegramId: TelegramId): Promise<AdminAccount | null> {
    try {
      const { data, error } = await this.client
        .from(this.adminTableName)
        .select('*')
        .eq('telegram_id', telegramId.value)
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to find admin by Telegram ID', { error, telegramId: telegramId.value });
        throw RepositoryError.entityNotFound('AdminAccount', `telegram:${telegramId.value}`, this.adminTableName);
      }

      if (!data) return null;
      return this.fromAdminRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding admin by Telegram ID', { error: err, telegramId: telegramId.value });
      throw RepositoryError.entityNotFound('AdminAccount', `telegram:${telegramId.value}`, this.adminTableName);
    }
  }

  /**
   * Checks if an admin account exists by their internal ID.
   */
  async adminExists(id: AdminId): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from(this.adminTableName)
        .select('id')
        .eq('id', id.value)
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to check admin existence', { error, adminId: id.value });
        return false;
      }

      return data !== null;
    } catch (err) {
      this.logger.error('Unexpected error checking admin existence', { error: err, adminId: id.value });
      return false;
    }
  }

  /**
   * Updates an existing admin account.
   */
  async updateAdmin(account: AdminAccount): Promise<AdminAccount> {
    try {
      const record = this.toAdminRecord(account);

      const { data, error } = await this.client
        .from(this.adminTableName)
        .update(record)
        .eq('id', account.id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update admin account', { error, adminId: account.id.value });
        throw RepositoryError.updateFailed('AdminAccount', account.id.value, this.toRepositoryError(error));
      }

      this.logger.info('Admin account updated', { adminId: account.id.value });
      return this.fromAdminRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating admin', { error: err, adminId: account.id.value });
      throw RepositoryError.updateFailed('AdminAccount', account.id.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Updates the last login timestamp for an admin.
   */
  async updateLastLogin(id: AdminId): Promise<AdminAccount> {
    try {
      const now = new Date().toISOString();

      const { data, error } = await this.client
        .from(this.adminTableName)
        .update({ last_login_at: now, updated_at: now })
        .eq('id', id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update last login', { error, adminId: id.value });
        throw RepositoryError.updateFailed('AdminAccount', id.value, this.toRepositoryError(error));
      }

      this.logger.info('Admin last login updated', { adminId: id.value });
      return this.fromAdminRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating last login', { error: err, adminId: id.value });
      throw RepositoryError.updateFailed('AdminAccount', id.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Soft deletes an admin account.
   */
  async softDeleteAdmin(id: AdminId): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.adminTableName)
        .update({ status: 'inactive', updated_at: new Date().toISOString() })
        .eq('id', id.value);

      if (error) {
        this.logger.error('Failed to soft delete admin', { error, adminId: id.value });
        throw RepositoryError.deleteFailed('AdminAccount', id.value, this.toRepositoryError(error));
      }

      this.logger.info('Admin soft deleted', { adminId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error soft deleting admin', { error: err, adminId: id.value });
      throw RepositoryError.deleteFailed('AdminAccount', id.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Lists admin accounts with pagination and filtering.
   */
  async listAdmins(
    params: PaginationParams,
    filters?: AdminFilterParams
  ): Promise<PaginatedResult<AdminAccount>> {
    try {
      let query = this.client
        .from(this.adminTableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.roleType) {
          query = query.eq('role_type', filters.roleType);
        }
        if (filters.department) {
          query = query.eq('metadata->>department', filters.department);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      // Apply pagination
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const sortOrder = params.sortOrder ?? SortOrder.DESC;
      const sortBy = params.sortBy ?? 'created_at';
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list admins', { error });
        throw RepositoryError.createFailed('AdminAccount list', this.toRepositoryError(error));
      }

      const admins = (data ?? []).map((record) => this.fromAdminRecord(record));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: admins,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error listing admins', { error: err });
      throw RepositoryError.createFailed('AdminAccount list', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Counts total admin accounts with optional filtering.
   */
  async countAdmins(filters?: AdminFilterParams): Promise<number> {
    try {
      let query = this.client
        .from(this.adminTableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.roleType) {
          query = query.eq('role_type', filters.roleType);
        }
        if (filters.department) {
          query = query.eq('metadata->>department', filters.department);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { error, count } = await query;

      if (error) {
        this.logger.error('Failed to count admins', { error });
        return 0;
      }

      return count ?? 0;
    } catch (err) {
      this.logger.error('Unexpected error counting admins', { error: err });
      return 0;
    }
  }

  // ================================================================================
  // #endregion

  // #region Admin Role Operations
  // ================================================================================

  /**
   * Creates a new admin role.
   */
  async createRole(role: AdminRole): Promise<AdminRole> {
    try {
      const record = this.toRoleRecord(role);

      const { data, error } = await this.client
        .from(this.roleTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create admin role', { error, roleName: role.name });
        throw RepositoryError.createFailed('AdminRole', this.toRepositoryError(error));
      }

      this.logger.info('Admin role created', { roleId: role.id.value, roleName: role.name });
      return this.fromRoleRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating role', { error: err });
      throw RepositoryError.createFailed('AdminRole', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Finds an admin role by their internal ID.
   */
  async findRoleById(id: AdminRoleId): Promise<AdminRole | null> {
    try {
      const { data, error } = await this.client
        .from(this.roleTableName)
        .select('*')
        .eq('id', id.value)
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to find role by ID', { error, roleId: id.value });
        throw RepositoryError.entityNotFound('AdminRole', id.value, this.roleTableName);
      }

      if (!data) return null;
      return this.fromRoleRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding role by ID', { error: err, roleId: id.value });
      throw RepositoryError.entityNotFound('AdminRole', id.value, this.roleTableName);
    }
  }

  /**
   * Finds an admin role by role type.
   */
  async findRoleByType(type: AdminRoleType): Promise<AdminRole | null> {
    try {
      const { data, error } = await this.client
        .from(this.roleTableName)
        .select('*')
        .eq('type', type)
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to find role by type', { error, roleType: type });
        throw RepositoryError.entityNotFound('AdminRole', `type:${type}`, this.roleTableName);
      }

      if (!data) return null;
      return this.fromRoleRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding role by type', { error: err, roleType: type });
      throw RepositoryError.entityNotFound('AdminRole', `type:${type}`, this.roleTableName);
    }
  }

  /**
   * Updates an existing admin role.
   */
  async updateRole(role: AdminRole): Promise<AdminRole> {
    try {
      const record = this.toRoleRecord(role);

      const { data, error } = await this.client
        .from(this.roleTableName)
        .update(record)
        .eq('id', role.id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update admin role', { error, roleId: role.id.value });
        throw RepositoryError.updateFailed('AdminRole', role.id.value, this.toRepositoryError(error));
      }

      this.logger.info('Admin role updated', { roleId: role.id.value });
      return this.fromRoleRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating role', { error: err, roleId: role.id.value });
      throw RepositoryError.updateFailed('AdminRole', role.id.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Deletes an admin role.
   */
  async deleteRole(id: AdminRoleId): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.roleTableName)
        .delete()
        .eq('id', id.value);

      if (error) {
        this.logger.error('Failed to delete admin role', { error, roleId: id.value });
        throw RepositoryError.deleteFailed('AdminRole', id.value, this.toRepositoryError(error));
      }

      this.logger.info('Admin role deleted', { roleId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error deleting role', { error: err, roleId: id.value });
      throw RepositoryError.deleteFailed('AdminRole', id.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Lists admin roles with pagination and filtering.
   */
  async listRoles(
    params: PaginationParams,
    filters?: AdminRoleFilterParams
  ): Promise<PaginatedResult<AdminRole>> {
    try {
      let query = this.client
        .from(this.roleTableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.type) {
          query = query.eq('type', filters.type);
        }
        if (filters.minPriority !== undefined) {
          query = query.gte('priority', filters.minPriority);
        }
        if (filters.maxPriority !== undefined) {
          query = query.lte('priority', filters.maxPriority);
        }
      }

      // Apply pagination
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const sortOrder = params.sortOrder ?? SortOrder.DESC;
      const sortBy = params.sortBy ?? 'priority';
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list roles', { error });
        throw RepositoryError.createFailed('AdminRole list', this.toRepositoryError(error));
      }

      const roles = (data ?? []).map((record) => this.fromRoleRecord(record));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: roles,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error listing roles', { error: err });
      throw RepositoryError.createFailed('AdminRole list', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Gets all system roles.
   */
  async getSystemRoles(): Promise<AdminRole[]> {
    try {
      const { data, error } = await this.client
        .from(this.roleTableName)
        .select('*')
        .eq('metadata->>isSystemRole', 'true')
        .order('priority', { ascending: false });

      if (error) {
        this.logger.error('Failed to get system roles', { error });
        throw RepositoryError.createFailed('AdminRole system roles', this.toRepositoryError(error));
      }

      return (data ?? []).map((record) => this.fromRoleRecord(record));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error getting system roles', { error: err });
      throw RepositoryError.createFailed('AdminRole system roles', err instanceof Error ? err : new Error(String(err)));
    }
  }

  // ================================================================================
  // #endregion

  // #region Admin Permission Operations
  // ================================================================================

  /**
   * Creates a new admin permission.
   */
  async createPermission(permission: AdminPermission): Promise<AdminPermission> {
    try {
      const record = this.toPermissionRecord(permission);

      const { data, error } = await this.client
        .from(this.permissionTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to create admin permission', { error, permissionKey: permission.permissionKey });
        throw RepositoryError.createFailed('AdminPermission', this.toRepositoryError(error));
      }

      this.logger.info('Admin permission created', { permissionId: permission.id.value, permissionKey: permission.permissionKey });
      return this.fromPermissionRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error creating permission', { error: err });
      throw RepositoryError.createFailed('AdminPermission', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Finds an admin permission by their internal ID.
   */
  async findPermissionById(id: PermissionId): Promise<AdminPermission | null> {
    try {
      const { data, error } = await this.client
        .from(this.permissionTableName)
        .select('*')
        .eq('id', id.value)
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to find permission by ID', { error, permissionId: id.value });
        throw RepositoryError.entityNotFound('AdminPermission', id.value, this.permissionTableName);
      }

      if (!data) return null;
      return this.fromPermissionRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding permission by ID', { error: err, permissionId: id.value });
      throw RepositoryError.entityNotFound('AdminPermission', id.value, this.permissionTableName);
    }
  }

  /**
   * Finds an admin permission by permission key.
   */
  async findPermissionByKey(key: string): Promise<AdminPermission | null> {
    try {
      const { data, error } = await this.client
        .from(this.permissionTableName)
        .select('*')
        .eq('permission_key', key)
        .maybeSingle();

      if (error) {
        this.logger.error('Failed to find permission by key', { error, permissionKey: key });
        throw RepositoryError.entityNotFound('AdminPermission', `key:${key}`, this.permissionTableName);
      }

      if (!data) return null;
      return this.fromPermissionRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error finding permission by key', { error: err, permissionKey: key });
      throw RepositoryError.entityNotFound('AdminPermission', `key:${key}`, this.permissionTableName);
    }
  }

  /**
   * Updates an existing admin permission.
   */
  async updatePermission(permission: AdminPermission): Promise<AdminPermission> {
    try {
      const record = this.toPermissionRecord(permission);

      const { data, error } = await this.client
        .from(this.permissionTableName)
        .update(record)
        .eq('id', permission.id.value)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to update admin permission', { error, permissionId: permission.id.value });
        throw RepositoryError.updateFailed('AdminPermission', permission.id.value, this.toRepositoryError(error));
      }

      this.logger.info('Admin permission updated', { permissionId: permission.id.value });
      return this.fromPermissionRecord(data);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error updating permission', { error: err, permissionId: permission.id.value });
      throw RepositoryError.updateFailed('AdminPermission', permission.id.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Deletes an admin permission.
   */
  async deletePermission(id: PermissionId): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.permissionTableName)
        .delete()
        .eq('id', id.value);

      if (error) {
        this.logger.error('Failed to delete admin permission', { error, permissionId: id.value });
        throw RepositoryError.deleteFailed('AdminPermission', id.value, this.toRepositoryError(error));
      }

      this.logger.info('Admin permission deleted', { permissionId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error deleting permission', { error: err, permissionId: id.value });
      throw RepositoryError.deleteFailed('AdminPermission', id.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Lists admin permissions with pagination and filtering.
   */
  async listPermissions(
    params: PaginationParams,
    filters?: AdminPermissionFilterParams
  ): Promise<PaginatedResult<AdminPermission>> {
    try {
      let query = this.client
        .from(this.permissionTableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.module) {
          query = query.eq('module', filters.module);
        }
      }

      // Apply pagination
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 20;
      const sortOrder = params.sortOrder ?? SortOrder.ASC;
      const sortBy = params.sortBy ?? 'permission_key';
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
        .order(sortBy, { ascending: sortOrder === SortOrder.ASC })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        this.logger.error('Failed to list permissions', { error });
        throw RepositoryError.createFailed('AdminPermission list', this.toRepositoryError(error));
      }

      const permissions = (data ?? []).map((record) => this.fromPermissionRecord(record));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: permissions,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error listing permissions', { error: err });
      throw RepositoryError.createFailed('AdminPermission list', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Gets all system permissions.
   */
  async getSystemPermissions(): Promise<AdminPermission[]> {
    try {
      const { data, error } = await this.client
        .from(this.permissionTableName)
        .select('*')
        .order('module', { ascending: true })
        .order('permission_key', { ascending: true });

      if (error) {
        this.logger.error('Failed to get system permissions', { error });
        throw RepositoryError.createFailed('AdminPermission system permissions', this.toRepositoryError(error));
      }

      return (data ?? []).map((record) => this.fromPermissionRecord(record));
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      this.logger.error('Unexpected error getting system permissions', { error: err });
      throw RepositoryError.createFailed('AdminPermission system permissions', err instanceof Error ? err : new Error(String(err)));
    }
  }

  // ================================================================================
  // #endregion

  // #region Private Helper Methods
  // ================================================================================

  /**
   * Converts a database record to an AdminAccount entity.
   */
  private fromAdminRecord(record: unknown): AdminAccount {
    const adminRecord = record as AdminAccountRecord;
    return AdminAccount.fromDatabase(adminRecord);
  }

  /**
   * Converts a database record to an AdminRole entity.
   */
  private fromRoleRecord(record: unknown): AdminRole {
    const roleRecord = record as AdminRoleRecord;
    return AdminRole.fromDatabase(roleRecord);
  }

  /**
   * Converts a database record to an AdminPermission entity.
   */
  private fromPermissionRecord(record: unknown): AdminPermission {
    const permissionRecord = record as AdminPermissionRecord;
    return AdminPermission.fromDatabase(permissionRecord);
  }

  /**
   * Converts an AdminAccount entity to a database record.
   */
  private toAdminRecord(account: AdminAccount): AdminAccountRecord {
    return {
      id: account.id.value,
      telegram_id: account.telegramId.value,
      username: account.username,
      display_name: account.displayName,
      role_id: account.roleId.value,
      role_type: account.roleType,
      status: account.status,
      last_login_at: account.lastLoginAt?.toISOString() ?? null,
      created_at: account.createdAt.toISOString(),
      updated_at: account.updatedAt.toISOString(),
      metadata: account.metadata,
    };
  }

  /**
   * Converts an AdminRole entity to a database record.
   */
  private toRoleRecord(role: AdminRole): AdminRoleRecord {
    return {
      id: role.id.value,
      name: role.name,
      type: role.type,
      priority: role.priority,
      permissions: Array.from(role.permissions),
      metadata: role.metadata,
    };
  }

  /**
   * Converts an AdminPermission entity to a database record.
   */
  private toPermissionRecord(permission: AdminPermission): AdminPermissionRecord {
    return {
      id: permission.id.value,
      permission_key: permission.permissionKey,
      description: permission.description,
      module: permission.module,
      metadata: permission.metadata,
    };
  }

  /**
   * Checks if an error is a "not found" error.
   */
  private isNotFoundError(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    const err = error as { code?: string; message?: string };
    return err.code === 'PGRST116' || (typeof err.message === 'string' && err.message.includes('No rows'));
  }

  /**
   * Converts a Supabase error to a standard Error.
   */
  private toError(error: unknown): Error | undefined {
    if (error instanceof Error) return error;
    if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; code?: string };
      return new Error(err.message || `Database error: ${err.code || 'unknown'}`);
    }
    return undefined;
  }

  /**
   * Converts a PostgrestError to a RepositoryError.
   */
  private toRepositoryError(error: PostgrestError): RepositoryError {
    return new RepositoryError({
      message: error.message,
      code: error.code,
      operation: error.operation ?? 'UNKNOWN',
      details: { hint: error.hint, details: error.details },
    });
  }

  // ================================================================================
  // #endregion
}