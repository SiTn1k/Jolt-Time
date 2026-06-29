/**
 * Configuration Resolution Service
 *
 * Resolves configuration values with priority: Global → Environment → Module → Feature → Player Override.
 * Player override is defined as an interface only (IConfigurationOverrideProvider).
 */

import type { ConfigurationEntry } from '../entities/ConfigurationEntry';
import { ConfigurationKey } from '../value-objects/ConfigurationKey';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('ConfigurationResolution');

/**
 * Configuration resolution context.
 */
export interface ConfigurationResolutionContext {
  /** Player profile ID for player-level overrides */
  playerId?: string;
  /** Current environment */
  environment?: string;
  /** Current module/game feature */
  module?: string;
  /** Additional context data */
  metadata?: Record<string, unknown>;
}

/**
 * Player override provider interface.
 * Implement this interface to provide player-specific configuration overrides.
 */
export interface IConfigurationOverrideProvider {
  /**
   * Gets a configuration override value for a player.
   * @param key The configuration key
   * @param playerId The player ID
   * @returns The override value or undefined if not overridden
   */
  getOverride(key: string, playerId: string): unknown | undefined;

  /**
   * Checks if a player has any overrides for a given key prefix.
   * @param keyPrefix The key prefix to check
   * @param playerId The player ID
   * @returns true if player has overrides
   */
  hasOverrides(keyPrefix: string, playerId: string): boolean;
}

/**
 * Resolved configuration value with metadata.
 */
export interface ResolvedConfiguration<T = unknown> {
  /** The resolved value */
  value: T;
  /** The resolved key */
  key: string;
  /** The source of the resolution */
  source: ConfigurationResolutionSource;
  /** Whether the value is overridden */
  isOverridden: boolean;
}

/**
 * Sources of configuration resolution.
 */
export enum ConfigurationResolutionSource {
  /** Resolved from global configuration */
  GLOBAL = 'global',
  /** Resolved from environment-specific configuration */
  ENVIRONMENT = 'environment',
  /** Resolved from module-specific configuration */
  MODULE = 'module',
  /** Resolved from feature-specific configuration */
  FEATURE = 'feature',
  /** Resolved from player override */
  PLAYER_OVERRIDE = 'player_override',
  /** Default/fallback value */
  DEFAULT = 'default',
}

/**
 * Configuration resolution options.
 */
export interface ConfigurationResolutionOptions {
  /** Enable environment-specific resolution */
  enableEnvironment?: boolean;
  /** Enable module-specific resolution */
  enableModule?: boolean;
  /** Enable feature-specific resolution */
  enableFeature?: boolean;
  /** Enable player override resolution */
  enablePlayerOverride?: boolean;
  /** Default value when no configuration found */
  defaultValue?: unknown;
  /** Player override provider */
  overrideProvider?: IConfigurationOverrideProvider;
}

/**
 * Default resolution options.
 */
export const DEFAULT_RESOLUTION_OPTIONS: Required<ConfigurationResolutionOptions> = {
  enableEnvironment: true,
  enableModule: true,
  enableFeature: true,
  enablePlayerOverride: true,
  defaultValue: undefined,
  overrideProvider: {
    getOverride: () => undefined,
    hasOverrides: () => false,
  },
};

/**
 * Configuration resolution key segments.
 */
export enum ConfigurationKeySegment {
  /** Global configuration prefix */
  GLOBAL = 'global',
  /** Environment prefix */
  ENVIRONMENT = 'env',
  /** Module prefix */
  MODULE = 'module',
  /** Feature prefix */
  FEATURE = 'feature',
}

/**
 * Configuration resolution service.
 * Resolves configuration values with priority: Global → Environment → Module → Feature → Player Override.
 */
export class ConfigurationResolution {
  private readonly options: Required<ConfigurationResolutionOptions>;
  private readonly globalPrefix: string;
  private readonly envPrefix: string;
  private readonly modulePrefix: string;
  private readonly featurePrefix: string;

  /**
   * Creates a new ConfigurationResolution instance.
   */
  constructor(options: ConfigurationResolutionOptions = {}) {
    this.options = { ...DEFAULT_RESOLUTION_OPTIONS, ...options } as Required<ConfigurationResolutionOptions>;
    this.globalPrefix = `${ConfigurationKeySegment.GLOBAL}.`;
    this.envPrefix = `${ConfigurationKeySegment.ENVIRONMENT}.`;
    this.modulePrefix = `${ConfigurationKeySegment.MODULE}.`;
    this.featurePrefix = `${ConfigurationKeySegment.FEATURE}.`;
    logger.debug('ConfigurationResolution initialized', { options: this.options });
  }

  /**
   * Resolves a configuration value by key.
   * Priority: Player Override → Feature → Module → Environment → Global → Default
   * @param key The configuration key
   * @param context Resolution context
   * @param entries Map of configuration entries by key
   * @returns Resolved configuration value
   */
  public resolve<T = unknown>(
    key: string,
    context: ConfigurationResolutionContext,
    entries: Map<string, ConfigurationEntry>
  ): ResolvedConfiguration<T> {
    logger.debug('Resolving configuration', { key, context });

    // 1. Check player override first
    if (this.options.enablePlayerOverride && context.playerId && this.options.overrideProvider) {
      const overrideValue = this.options.overrideProvider.getOverride(key, context.playerId);
      if (overrideValue !== undefined) {
        logger.debug('Resolved from player override', { key, playerId: context.playerId });
        return {
          value: overrideValue as T,
          key,
          source: ConfigurationResolutionSource.PLAYER_OVERRIDE,
          isOverridden: true,
        };
      }
    }

    // 2. Check feature-specific configuration
    if (this.options.enableFeature && context.module) {
      const featureKey = this.buildKey(this.featurePrefix, context.module, key);
      const featureEntry = entries.get(featureKey);
      if (featureEntry) {
        logger.debug('Resolved from feature configuration', { key, featureKey });
        return {
          value: featureEntry.value as T,
          key: featureKey,
          source: ConfigurationResolutionSource.FEATURE,
          isOverridden: false,
        };
      }
    }

    // 3. Check module-specific configuration
    if (this.options.enableModule && context.module) {
      const moduleKey = this.buildKey(this.modulePrefix, context.module, key);
      const moduleEntry = entries.get(moduleKey);
      if (moduleEntry) {
        logger.debug('Resolved from module configuration', { key, moduleKey });
        return {
          value: moduleEntry.value as T,
          key: moduleKey,
          source: ConfigurationResolutionSource.MODULE,
          isOverridden: false,
        };
      }
    }

    // 4. Check environment-specific configuration
    if (this.options.enableEnvironment && context.environment) {
      const envKey = this.buildKey(this.envPrefix, context.environment, key);
      const envEntry = entries.get(envKey);
      if (envEntry) {
        logger.debug('Resolved from environment configuration', { key, envKey });
        return {
          value: envEntry.value as T,
          key: envKey,
          source: ConfigurationResolutionSource.ENVIRONMENT,
          isOverridden: false,
        };
      }
    }

    // 5. Check global configuration
    const globalKey = this.buildKey(this.globalPrefix, '', key);
    const globalEntry = entries.get(globalKey);
    if (globalEntry) {
      logger.debug('Resolved from global configuration', { key, globalKey });
      return {
        value: globalEntry.value as T,
        key: globalKey,
        source: ConfigurationResolutionSource.GLOBAL,
        isOverridden: false,
      };
    }

    // 6. Check direct key (no prefix)
    const directEntry = entries.get(key);
    if (directEntry) {
      logger.debug('Resolved from direct key', { key });
      return {
        value: directEntry.value as T,
        key,
        source: ConfigurationResolutionSource.GLOBAL,
        isOverridden: false,
      };
    }

    // 7. Return default value
    logger.debug('Using default value', { key });
    return {
      value: this.options.defaultValue as T,
      key,
      source: ConfigurationResolutionSource.DEFAULT,
      isOverridden: false,
    };
  }

  /**
   * Resolves multiple configuration keys.
   * @param keys Array of configuration keys
   * @param context Resolution context
   * @param entries Map of configuration entries by key
   * @returns Map of resolved configurations by key
   */
  public resolveMany<T = unknown>(
    keys: string[],
    context: ConfigurationResolutionContext,
    entries: Map<string, ConfigurationEntry>
  ): Map<string, ResolvedConfiguration<T>> {
    const results = new Map<string, ResolvedConfiguration<T>>();

    for (const key of keys) {
      results.set(key, this.resolve<T>(key, context, entries));
    }

    return results;
  }

  /**
   * Gets all configurations for a given prefix.
   * @param prefix The key prefix
   * @param context Resolution context
   * @param entries Map of configuration entries by key
   * @returns Array of resolved configurations
   */
  public resolveByPrefix<T = unknown>(
    prefix: string,
    context: ConfigurationResolutionContext,
    entries: Map<string, ConfigurationEntry>
  ): ResolvedConfiguration<T>[] {
    const results: ResolvedConfiguration<T>[] = [];

    for (const [key, entry] of entries) {
      if (key.startsWith(prefix)) {
        results.push(this.resolve<T>(key, context, entries));
      }
    }

    return results;
  }

  /**
   * Gets the priority order for resolution sources.
   * @returns Array of sources in priority order
   */
  public getPriorityOrder(): ConfigurationResolutionSource[] {
    const priority: ConfigurationResolutionSource[] = [];

    if (this.options.enablePlayerOverride) {
      priority.push(ConfigurationResolutionSource.PLAYER_OVERRIDE);
    }
    if (this.options.enableFeature) {
      priority.push(ConfigurationResolutionSource.FEATURE);
    }
    if (this.options.enableModule) {
      priority.push(ConfigurationResolutionSource.MODULE);
    }
    if (this.options.enableEnvironment) {
      priority.push(ConfigurationResolutionSource.ENVIRONMENT);
    }
    priority.push(ConfigurationResolutionSource.GLOBAL);
    priority.push(ConfigurationResolutionSource.DEFAULT);

    return priority;
  }

  /**
   * Builds a configuration key with prefix.
   */
  private buildKey(prefix: string, segment: string, key: string): string {
    if (segment) {
      return `${prefix}${segment}.${key}`;
    }
    return `${prefix}${key}`;
  }

  /**
   * Extracts the base key from a prefixed key.
   * @param prefixedKey The prefixed key
   * @returns The base key without prefix
   */
  public extractBaseKey(prefixedKey: string): string {
    // Remove global prefix
    if (prefixedKey.startsWith(this.globalPrefix)) {
      return prefixedKey.slice(this.globalPrefix.length);
    }
    // Remove environment prefix
    if (prefixedKey.startsWith(this.envPrefix)) {
      const withoutEnv = prefixedKey.slice(this.envPrefix.length);
      const dotIndex = withoutEnv.indexOf('.');
      if (dotIndex !== -1) {
        return withoutEnv.slice(dotIndex + 1);
      }
    }
    // Remove module prefix
    if (prefixedKey.startsWith(this.modulePrefix)) {
      const withoutModule = prefixedKey.slice(this.modulePrefix.length);
      const dotIndex = withoutModule.indexOf('.');
      if (dotIndex !== -1) {
        return withoutModule.slice(dotIndex + 1);
      }
    }
    // Remove feature prefix
    if (prefixedKey.startsWith(this.featurePrefix)) {
      const withoutFeature = prefixedKey.slice(this.featurePrefix.length);
      const dotIndex = withoutFeature.indexOf('.');
      if (dotIndex !== -1) {
        return withoutFeature.slice(dotIndex + 1);
      }
    }
    return prefixedKey;
  }
}
