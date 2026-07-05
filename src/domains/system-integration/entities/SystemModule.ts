/**
 * SystemModule Entity
 *
 * Domain entity representing a system module in the integration architecture.
 * A module is a self-contained component that can be registered and tracked.
 *
 * SystemModule Entity Responsibilities:
 * - Store module identity (ID, name, version)
 * - Track module status
 * - Store module dependencies
 * - Store module metadata
 *
 * SystemModule is NOT:
 * - A health checker
 * - A dependency resolver
 * - An auto-recovery mechanism
 * - A startup validator
 * - A module loader
 * - Any runtime synchronization logic
 *
 * System Integration Foundation ONLY stores registered modules, integration state,
 * and integration snapshots. All runtime logic belongs to P-194.2.
 */

import type { ISystemModule } from '../interfaces/ISystemModule';
import { ModuleId } from '../value-objects/ModuleId';
import type { ModuleStatus } from '../types/ModuleStatus';
import type { DependencyStatus } from '../types/DependencyStatus';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Module dependency definition.
 */
export interface ModuleDependency {
  /** Module ID of the dependency */
  moduleId: string;

  /** Name of the dependency */
  moduleName: string;

  /** Status of the dependency */
  status: DependencyStatus;

  /** Whether the dependency is optional */
  isOptional: boolean;
}

/**
 * SystemModule entity props for constructor.
 */
export interface SystemModuleProps {
  /** Unique module identifier */
  moduleId: ModuleId;

  /** Module display name */
  moduleName: string;

  /** Module version */
  moduleVersion: string;

  /** Current module status */
  status: ModuleStatus;

  /** Module dependencies */
  dependencies: ModuleDependency[];

  /** Module metadata */
  metadata: IntegrationMetadata;
}

/**
 * Database record representation of SystemModule.
 */
export interface SystemModuleRecord {
  module_id: string;
  module_name: string;
  module_version: string;
  status: ModuleStatus;
  dependencies: ModuleDependency[];
  metadata: IntegrationMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of SystemModule.
 */
export interface SystemModuleJSON {
  moduleId: string;
  moduleName: string;
  moduleVersion: string;
  status: ModuleStatus;
  dependencies: ModuleDependency[];
  metadata: IntegrationMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * SystemModule entity class.
 * Immutable domain entity representing a system module.
 */
export class SystemModule implements ISystemModule {
  /** Unique module identifier */
  public readonly moduleId: ModuleId;

  /** Module display name */
  public readonly moduleName: string;

  /** Module version */
  public readonly moduleVersion: string;

  /** Current module status */
  public readonly status: ModuleStatus;

  /** Module dependencies */
  public readonly dependencies: ModuleDependency[];

  /** Module metadata */
  public readonly metadata: IntegrationMetadata;

  /** Timestamp when module was created */
  public readonly createdAt: Date;

  /** Timestamp when module was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new SystemModule instance.
   */
  constructor(props: SystemModuleProps & { createdAt?: Date; updatedAt?: Date }) {
    this.moduleId = props.moduleId;
    this.moduleName = props.moduleName;
    this.moduleVersion = props.moduleVersion;
    this.status = props.status;
    this.dependencies = props.dependencies;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Creates a new SystemModule entity.
   * Factory method for new module registration.
   */
  public static create(params: {
    moduleId?: ModuleId;
    moduleName: string;
    moduleVersion?: string;
    status?: ModuleStatus;
    dependencies?: ModuleDependency[];
    metadata?: IntegrationMetadata;
  }): SystemModule {
    const now = new Date();

    return new SystemModule({
      moduleId: params.moduleId ?? ModuleId.generate(),
      moduleName: params.moduleName,
      moduleVersion: params.moduleVersion ?? '1.0.0',
      status: params.status ?? 'registered',
      dependencies: params.dependencies ?? [],
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a SystemModule from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: SystemModuleRecord & { created_at?: string; updated_at?: string }): SystemModule {
    return new SystemModule({
      moduleId: ModuleId.reconstruct(record.module_id),
      moduleName: record.module_name,
      moduleVersion: record.module_version,
      status: record.status,
      dependencies: record.dependencies,
      metadata: record.metadata,
      createdAt: record.created_at ? new Date(record.created_at) : new Date(),
      updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
    });
  }

  /**
   * Checks if this module is active.
   */
  public isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * Checks if this module has an error status.
   */
  public hasError(): boolean {
    return this.status === 'error';
  }

  /**
   * Checks if this module is degraded.
   */
  public isDegraded(): boolean {
    return this.status === 'degraded';
  }

  /**
   * Checks if all required dependencies are satisfied.
   */
  public hasSatisfiedDependencies(): boolean {
    return this.dependencies
      .filter((dep) => !dep.isOptional)
      .every((dep) => dep.status === 'satisfied');
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<SystemModuleProps, 'moduleId' | 'createdAt'>>): SystemModule {
    return new SystemModule({
      moduleId: this.moduleId,
      moduleName: params.moduleName ?? this.moduleName,
      moduleVersion: params.moduleVersion ?? this.moduleVersion,
      status: params.status ?? this.status,
      dependencies: params.dependencies ?? this.dependencies,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the SystemModule to a plain object.
   */
  public toJSON(): SystemModuleJSON {
    return {
      moduleId: this.moduleId.value,
      moduleName: this.moduleName,
      moduleVersion: this.moduleVersion,
      status: this.status,
      dependencies: this.dependencies,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): SystemModuleRecord {
    return {
      module_id: this.moduleId.value,
      module_name: this.moduleName,
      module_version: this.moduleVersion,
      status: this.status,
      dependencies: this.dependencies,
      metadata: this.metadata,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
