/**
 * Configuration Provider
 *
 * Provides typed access to configuration values.
 */

import type { IConfigProvider } from '../../shared/types';

/**
 * Configuration provider implementation.
 */
export class ConfigProvider implements IConfigProvider {
  private readonly config: Record<string, unknown>;
  private readonly defaults: Record<string, unknown>;

  constructor(config: Record<string, unknown> = {}, defaults: Record<string, unknown> = {}) {
    this.config = config;
    this.defaults = defaults;
  }

  /**
   * Get a configuration value by key.
   */
  get<T>(key: string, defaultValue?: T): T {
    const value = this.config[key];
    if (value !== undefined) {
      return value as T;
    }
    if (this.defaults[key] !== undefined) {
      return this.defaults[key] as T;
    }
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Configuration key not found: ${key}`);
  }

  /**
   * Get a string configuration value.
   */
  getString(key: string, defaultValue?: string): string {
    const value = this.get(key, defaultValue);
    if (typeof value === 'string') {
      return value;
    }
    return String(value);
  }

  /**
   * Get a number configuration value.
   */
  getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key, defaultValue);
    if (typeof value === 'number') {
      return value;
    }
    const parsed = parseInt(String(value), 10);
    if (isNaN(parsed)) {
      throw new Error(`Configuration value is not a number: ${key}`);
    }
    return parsed;
  }

  /**
   * Get a boolean configuration value.
   */
  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get(key, defaultValue);
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return ['true', '1', 'yes'].includes(String(value).toLowerCase());
    }
    return Boolean(defaultValue);
  }

  /**
   * Check if a configuration key exists.
   */
  has(key: string): boolean {
    return key in this.config || key in this.defaults;
  }

  /**
   * Get all configuration values.
   */
  getAll(): Record<string, unknown> {
    return { ...this.defaults, ...this.config };
  }

  /**
   * Merge additional configuration.
   */
  merge(additional: Record<string, unknown>): ConfigProvider {
    return new ConfigProvider(
      { ...this.config, ...additional },
      this.defaults
    );
  }

  /**
   * Create a subset of configuration.
   */
  subset(prefix: string): ConfigProvider {
    const subsetConfig: Record<string, unknown> = {};
    const subsetDefaults: Record<string, unknown> = {};

    const prefixLength = prefix.length + 1;

    for (const [key, value] of Object.entries(this.config)) {
      if (key.startsWith(`${prefix}_`) || key === prefix) {
        subsetConfig[key.substring(prefixLength) || key] = value;
      }
    }

    for (const [key, value] of Object.entries(this.defaults)) {
      if (key.startsWith(`${prefix}_`) || key === prefix) {
        subsetDefaults[key.substring(prefixLength) || key] = value;
      }
    }

    return new ConfigProvider(subsetConfig, subsetDefaults);
  }
}

/**
 * Global configuration provider instance.
 */
let globalConfigProvider: ConfigProvider | null = null;

/**
 * Initialize the global configuration provider.
 */
export function initializeConfig(config: Record<string, unknown>, defaults?: Record<string, unknown>): ConfigProvider {
  globalConfigProvider = new ConfigProvider(config, defaults);
  return globalConfigProvider;
}

/**
 * Get the global configuration provider.
 */
export function getConfig(): ConfigProvider {
  if (!globalConfigProvider) {
    throw new Error('Configuration provider not initialized. Call initializeConfig first.');
  }
  return globalConfigProvider;
}
