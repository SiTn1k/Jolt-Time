/**
 * Configuration Service
 *
 * Main service for loading, managing, and evaluating configuration entries and feature flags.
 * Provides caching, resolution, and feature flag evaluation.
 */

import type { IConfigurationRepository, ConfigurationFilterParams } from '../interfaces/IConfigurationRepository';
import type { ConfigurationEntry } from '../entities/ConfigurationEntry';
import type { ConfigurationGroup } from '../entities/ConfigurationGroup';
import type { FeatureFlag } from '../entities/FeatureFlag';
import type { ConfigurationId } from '../value-objects/ConfigurationId';
import type { GroupId } from '../value-objects/GroupId';
import type { FeatureFlagId } from '../value-objects/FeatureFlagId';
import type { ConfigurationKey } from '../value-objects/ConfigurationKey';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { CacheStatistics } from './ConfigurationCache';
import { ConfigurationCache, DEFAULT_CACHE_OPTIONS } from './ConfigurationCache';
import type { ConfigurationCacheOptions } from './ConfigurationCache';
import { FeatureFlagEngine } from './FeatureFlagEngine';
import type {
  FeatureFlagUserContext,
  FeatureFlagEnvironmentContext,
  FeatureFlagEvaluationResult,
  FeatureFlagEvaluationOptions,
} from './FeatureFlagEngine';
import { ConfigurationResolution } from './ConfigurationResolution';
import type {
  ConfigurationResolutionContext,
  ResolvedConfiguration,
  ConfigurationResolutionOptions,
} from './ConfigurationResolution';
import { ConfigurationValidator } from '../validators/ConfigurationValidator';
import { GroupValidator } from '../validators/GroupValidator';
import { FeatureFlagValidator } from '../validators/FeatureFlagValidator';
import { ConfigurationMapper } from '../mappers/ConfigurationMapper';
import { GroupMapper } from '../mappers/GroupMapper';
import { FeatureFlagMapper } from '../mappers/FeatureFlagMapper';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('ConfigurationService');

/**
 * Configuration service options.
 */
export interface ConfigurationServiceOptions {
  /** Cache options */
  cacheOptions?: ConfigurationCacheOptions;
  /** Feature flag evaluation options */
  featureFlagOptions?: FeatureFlagEvaluationOptions;
  /** Configuration resolution options */
  resolutionOptions?: ConfigurationResolutionOptions;
  /** Enable caching */
  enableCache?: boolean;
  /** Default TTL in milliseconds */
  defaultTtlMs?: number;
}

/**
 * Configuration summary.
 */
export interface ConfigurationSummary {
  totalEntries: number;
  totalGroups: number;
  totalFeatureFlags: number;
  activeFeatureFlags: number;
  cacheStatistics: CacheStatistics;
  lastRefreshed: Date | null;
}

/**
 * Main Configuration Service.
 * Provides centralized configuration management with caching and feature flag evaluation.
 */
export class ConfigurationService {
  private readonly repository: IConfigurationRepository;
  private readonly cache: ConfigurationCache;
  private readonly featureFlagEngine: FeatureFlagEngine;
  private readonly configurationResolution: ConfigurationResolution;
  private readonly cacheOptions: Required<ConfigurationCacheOptions>;
  private readonly enableCache: boolean;
  private lastRefreshed: Date | null = null;
  private isLoaded = false;

  /**
   * Creates a new ConfigurationService instance.
   */
  constructor(
    repository: IConfigurationRepository,
    options: ConfigurationServiceOptions = {}
  ) {
    this.repository = repository;
    this.cacheOptions = {
      ...DEFAULT_CACHE_OPTIONS,
      ...options.cacheOptions,
      defaultTtlMs: options.defaultTtlMs ?? DEFAULT_CACHE_OPTIONS.defaultTtlMs,
    };
    this.cache = new ConfigurationCache(this.cacheOptions);
    this.featureFlagEngine = new FeatureFlagEngine(options.featureFlagOptions);
    this.configurationResolution = new ConfigurationResolution(options.resolutionOptions);
    this.enableCache = options.enableCache ?? true;

    logger.debug('ConfigurationService initialized', {
      enableCache: this.enableCache,
      cacheOptions: this.cacheOptions,
    });
  }

  // ========== Configuration Entry Operations ==========

  /**
   * Loads all configurations into cache.
   */
  public async loadConfiguration(): Promise<void> {
    logger.info('Loading configuration into cache');

    try {
      // Load all entries
      const entriesResult = await this.repository.listEntries({ page: 1, pageSize: 10000 });
      const entriesToCache = entriesResult.items.map((entry) => ({
        key: entry.key.value,
        value: entry,
      }));
      this.cache.preload(entriesToCache, 'entry');

      // Load all feature flags
      const flagsResult = await this.repository.listFeatureFlags({ page: 1, pageSize: 1000 });
      const flagsToCache = flagsResult.items.map((flag) => ({
        key: flag.key,
        value: flag,
      }));
      this.cache.preload(flagsToCache, 'flag');

      this.lastRefreshed = new Date();
      this.isLoaded = true;

      logger.info('Configuration loaded successfully', {
        entries: entriesToCache.length,
        flags: flagsToCache.length,
      });
    } catch (err) {
      logger.error('Failed to load configuration', err as Error);
      throw err;
    }
  }

  /**
   * Gets a configuration entry by key.
   * @param key The configuration key
   * @returns The configuration entry or null
   */
  public async getByKey(key: string): Promise<ConfigurationEntry | null> {
    logger.debug('Getting configuration by key', { key });

    // Check cache first
    if (this.enableCache && this.cache.has(key, 'entry')) {
      return this.cache.get<ConfigurationEntry>(key, 'entry');
    }

    // Load from repository
    const configKey = ConfigurationKey.reconstruct(key);
    const entry = await this.repository.findEntryByKey(configKey);

    // Cache if found
    if (entry && this.enableCache) {
      this.cache.set(key, entry, undefined, 'entry');
    }

    return entry;
  }

  /**
   * Gets a configuration entry by ID.
   * @param id The configuration ID
   * @returns The configuration entry or null
   */
  public async getById(id: string): Promise<ConfigurationEntry | null> {
    logger.debug('Getting configuration by ID', { id });

    const configId = ConfigurationId.reconstruct(id);
    return this.repository.findEntryById(configId);
  }

  /**
   * Creates a new configuration entry.
   * @param entry The entry to create
   * @returns The created entry
   */
  public async createConfiguration(entry: ConfigurationEntry): Promise<ConfigurationEntry> {
    logger.debug('Creating configuration', { key: entry.key.value });

    // Validate
    const validationResult = ConfigurationValidator.validate(
      entry.key.value,
      entry.value,
      entry.valueType
    );
    if (!validationResult.isValid) {
      throw new Error(`Configuration validation failed: ${validationResult.error}`);
    }

    const created = await this.repository.createEntry(entry);

    // Update cache
    if (this.enableCache) {
      this.cache.set(created.key.value, created, undefined, 'entry');
    }

    return created;
  }

  /**
   * Updates a configuration entry.
   * @param entry The entry to update
   * @returns The updated entry
   */
  public async updateConfiguration(entry: ConfigurationEntry): Promise<ConfigurationEntry> {
    logger.debug('Updating configuration', { key: entry.key.value });

    const updated = await this.repository.updateEntry(entry);

    // Update cache
    if (this.enableCache) {
      this.cache.set(updated.key.value, updated, undefined, 'entry');
    }

    return updated;
  }

  /**
   * Deletes a configuration entry.
   * @param id The configuration ID to delete
   */
  public async deleteConfiguration(id: string): Promise<void> {
    logger.debug('Deleting configuration', { id });

    // Get entry to find its key for cache invalidation
    const entry = await this.repository.findEntryById(ConfigurationId.reconstruct(id));

    await this.repository.deleteEntry(ConfigurationId.reconstruct(id));

    // Invalidate cache
    if (this.enableCache && entry) {
      this.cache.delete(entry.key.value, 'entry');
    }
  }

  /**
   * Lists configuration entries with pagination.
   * @param params Pagination parameters
   * @param filters Optional filters
   * @returns Paginated result of entries
   */
  public async listConfigurations(
    params: PaginationParams,
    filters?: ConfigurationFilterParams
  ): Promise<PaginatedResult<ConfigurationEntry>> {
    return this.repository.listEntries(params, filters);
  }

  /**
   * Counts configuration entries.
   * @param filters Optional filters
   * @returns Count of entries
   */
  public async countConfigurations(filters?: ConfigurationFilterParams): Promise<number> {
    return this.repository.countEntries(filters);
  }

  /**
   * Gets entries by group.
   * @param groupId The group ID
   * @returns Array of entries in the group
   */
  public async getByGroup(groupId: string): Promise<ConfigurationEntry[]> {
    const result = await this.repository.listEntries(
      { page: 1, pageSize: 1000 },
      { groupId: GroupId.reconstruct(groupId) }
    );
    return result.items;
  }

  // ========== Feature Flag Operations ==========

  /**
   * Loads all feature flags into cache.
   */
  public async loadFeatureFlags(): Promise<void> {
    logger.info('Loading feature flags into cache');

    try {
      const result = await this.repository.listFeatureFlags({ page: 1, pageSize: 1000 });
      const flagsToCache = result.items.map((flag) => ({
        key: flag.key,
        value: flag,
      }));
      this.cache.preload(flagsToCache, 'flag');

      logger.info('Feature flags loaded successfully', { count: flagsToCache.length });
    } catch (err) {
      logger.error('Failed to load feature flags', err as Error);
      throw err;
    }
  }

  /**
   * Gets a feature flag by key.
   * @param key The flag key
   * @returns The flag or null
   */
  public async getFeatureFlag(key: string): Promise<FeatureFlag | null> {
    logger.debug('Getting feature flag by key', { key });

    // Check cache first
    if (this.enableCache && this.cache.has(key, 'flag')) {
      return this.cache.get<FeatureFlag>(key, 'flag');
    }

    const flag = await this.repository.findFeatureFlagByKey(key);

    // Cache if found
    if (flag && this.enableCache) {
      this.cache.set(key, flag, undefined, 'flag');
    }

    return flag;
  }

  /**
   * Gets all feature flags.
   * @returns Array of all feature flags
   */
  public async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    const result = await this.repository.listFeatureFlags({ page: 1, pageSize: 1000 });
    return result.items;
  }

  /**
   * Creates a new feature flag.
   * @param flag The flag to create
   * @returns The created flag
   */
  public async createFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag> {
    logger.debug('Creating feature flag', { key: flag.key });

    // Validate
    const validationResult = FeatureFlagValidator.validate(flag.key, flag.rollout, flag.enabled, flag.description);
    if (!validationResult.isValid) {
      throw new Error(`Feature flag validation failed: ${validationResult.error}`);
    }

    const created = await this.repository.createFeatureFlag(flag);

    // Update cache
    if (this.enableCache) {
      this.cache.set(created.key, created, undefined, 'flag');
    }

    return created;
  }

  /**
   * Updates a feature flag.
   * @param flag The flag to update
   * @returns The updated flag
   */
  public async updateFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag> {
    logger.debug('Updating feature flag', { key: flag.key });

    const updated = await this.repository.updateFeatureFlag(flag);

    // Update cache
    if (this.enableCache) {
      this.cache.set(updated.key, updated, undefined, 'flag');
    }

    return updated;
  }

  /**
   * Deletes a feature flag.
   * @param id The flag ID to delete
   */
  public async deleteFeatureFlag(id: string): Promise<void> {
    logger.debug('Deleting feature flag', { id });

    // Get flag to find its key for cache invalidation
    const flag = await this.repository.findFeatureFlagById(FeatureFlagId.reconstruct(id));

    await this.repository.deleteFeatureFlag(FeatureFlagId.reconstruct(id));

    // Invalidate cache
    if (this.enableCache && flag) {
      this.cache.delete(flag.key, 'flag');
    }
  }

  /**
   * Evaluates a feature flag for a user.
   * @param key The flag key
   * @param userContext User context
   * @param environmentContext Environment context
   * @returns Evaluation result
   */
  public async evaluateFeatureFlag(
    key: string,
    userContext?: FeatureFlagUserContext,
    environmentContext?: FeatureFlagEnvironmentContext
  ): Promise<FeatureFlagEvaluationResult> {
    const flags = new Map<string, FeatureFlag>();

    // Get flag (from cache or repository)
    const flag = await this.getFeatureFlag(key);
    if (flag) {
      flags.set(key, flag);
    }

    return this.featureFlagEngine.evaluateByKey(key, flags, userContext, environmentContext);
  }

  /**
   * Checks if a feature is enabled for a user.
   * @param key The flag key
   * @param userContext User context
   * @param environmentContext Environment context
   * @returns true if feature is enabled
   */
  public async isFeatureEnabled(
    key: string,
    userContext?: FeatureFlagUserContext,
    environmentContext?: FeatureFlagEnvironmentContext
  ): Promise<boolean> {
    const result = await this.evaluateFeatureFlag(key, userContext, environmentContext);
    return result.value;
  }

  // ========== Configuration Group Operations ==========

  /**
   * Creates a new configuration group.
   * @param group The group to create
   * @returns The created group
   */
  public async createGroup(group: ConfigurationGroup): Promise<ConfigurationGroup> {
    logger.debug('Creating configuration group', { name: group.name });

    // Validate
    const validationResult = GroupValidator.validate(group.name, group.description);
    if (!validationResult.isValid) {
      throw new Error(`Group validation failed: ${validationResult.error}`);
    }

    return this.repository.createGroup(group);
  }

  /**
   * Gets a configuration group by ID.
   * @param id The group ID
   * @returns The group or null
   */
  public async getGroupById(id: string): Promise<ConfigurationGroup | null> {
    return this.repository.findGroupById(GroupId.reconstruct(id));
  }

  /**
   * Gets a configuration group by name.
   * @param name The group name
   * @returns The group or null
   */
  public async getGroupByName(name: string): Promise<ConfigurationGroup | null> {
    return this.repository.findGroupByName(name);
  }

  /**
   * Updates a configuration group.
   * @param group The group to update
   * @returns The updated group
   */
  public async updateGroup(group: ConfigurationGroup): Promise<ConfigurationGroup> {
    return this.repository.updateGroup(group);
  }

  /**
   * Deletes a configuration group.
   * @param id The group ID to delete
   */
  public async deleteGroup(id: string): Promise<void> {
    await this.repository.deleteGroup(GroupId.reconstruct(id));
  }

  /**
   * Lists all configuration groups.
   * @param params Pagination parameters
   * @returns Paginated result of groups
   */
  public async listGroups(params: PaginationParams): Promise<PaginatedResult<ConfigurationGroup>> {
    return this.repository.listGroups(params);
  }

  // ========== Configuration Resolution ==========

  /**
   * Resolves a configuration value with priority resolution.
   * @param key The configuration key
   * @param context Resolution context
   * @returns Resolved configuration
   */
  public async resolve<T = unknown>(
    key: string,
    context: ConfigurationResolutionContext
  ): Promise<ResolvedConfiguration<T>> {
    // Build entries map from cache
    const entries = new Map<string, ConfigurationEntry>();
    const cachedEntries = this.cache.keys('entry');

    for (const cachedKey of cachedEntries) {
      const entry = this.cache.get<ConfigurationEntry>(cachedKey, 'entry');
      if (entry) {
        entries.set(cachedKey, entry);
      }
    }

    return this.configurationResolution.resolve<T>(key, context, entries);
  }

  // ========== Cache Operations ==========

  /**
   * Refreshes the cache.
   */
  public async refreshCache(): Promise<void> {
    logger.info('Refreshing configuration cache');
    this.cache.invalidate('all');
    await this.loadConfiguration();
  }

  /**
   * Invalidates the cache.
   * @param cacheType Type of cache to invalidate
   */
  public invalidateCache(cacheType: 'entry' | 'flag' | 'all' = 'all'): void {
    this.cache.invalidate(cacheType);
  }

  /**
   * Gets cache statistics.
   * @returns Cache statistics
   */
  public getCacheStatistics(): CacheStatistics {
    return this.cache.getStatistics();
  }

  /**
   * Gets configuration summary.
   * @returns Configuration summary
   */
  public async getSummary(): Promise<ConfigurationSummary> {
    const entriesCount = await this.countConfigurations();
    const groupsResult = await this.listGroups({ page: 1, pageSize: 1 });
    const flags = await this.getAllFeatureFlags();
    const activeFlags = flags.filter((f) => f.isActive()).length;

    return {
      totalEntries: entriesCount,
      totalGroups: groupsResult.total,
      totalFeatureFlags: flags.length,
      activeFeatureFlags: activeFlags,
      cacheStatistics: this.getCacheStatistics(),
      lastRefreshed: this.lastRefreshed,
    };
  }
}
