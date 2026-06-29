/**
 * Configuration Resolution Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { ConfigurationResolution } from '../services/ConfigurationResolution';
import { ConfigurationEntry } from '../entities/ConfigurationEntry';
import { ConfigurationKey } from '../value-objects/ConfigurationKey';
import { ConfigurationId } from '../value-objects/ConfigurationId';
import { ConfigurationType } from '../types/ConfigurationType';
import { ConfigurationResolutionSource } from '../services/ConfigurationResolution';

describe('ConfigurationResolution', () => {
  let resolution: ConfigurationResolution;

  const createEntry = (key: string, value: unknown): ConfigurationEntry => {
    return ConfigurationEntry.fromDatabase({
      config_id: `id-${key}`,
      key,
      value,
      value_type: typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string',
      group_id: null,
      description: '',
      version: 1,
      is_public: true,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  const createEntriesMap = (entries: ConfigurationEntry[]): Map<string, ConfigurationEntry> => {
    const map = new Map<string, ConfigurationEntry>();
    for (const entry of entries) {
      map.set(entry.key.value, entry);
    }
    return map;
  };

  beforeEach(() => {
    resolution = new ConfigurationResolution();
  });

  describe('basic resolution', () => {
    it('should resolve direct key', () => {
      const entries = createEntriesMap([createEntry('setting1', 'value1')]);
      const result = resolution.resolve('setting1', {}, entries);

      expect(result.value).toBe('value1');
      expect(result.source).toBe(ConfigurationResolutionSource.GLOBAL);
    });

    it('should return default value for missing key', () => {
      const entries = createEntriesMap([]);
      const result = resolution.resolve('missing', {}, entries);

      expect(result.value).toBeUndefined();
      expect(result.source).toBe(ConfigurationResolutionSource.DEFAULT);
    });

    it('should respect custom default value', () => {
      const customResolution = new ConfigurationResolution({ defaultValue: 'custom_default' });
      const entries = createEntriesMap([]);
      const result = customResolution.resolve('missing', {}, entries);

      expect(result.value).toBe('custom_default');
    });
  });

  describe('player override resolution', () => {
    it('should resolve from player override', () => {
      const entries = createEntriesMap([createEntry('setting1', 'global_value')]);
      const playerOverride = {
        getOverride: (key: string, playerId: string) => {
          if (key === 'setting1' && playerId === 'player1') {
            return 'player_override_value';
          }
          return undefined;
        },
        hasOverrides: () => false,
      };
      const customResolution = new ConfigurationResolution({
        overrideProvider: playerOverride,
      });

      const result = customResolution.resolve('setting1', { playerId: 'player1' }, entries);

      expect(result.value).toBe('player_override_value');
      expect(result.source).toBe(ConfigurationResolutionSource.PLAYER_OVERRIDE);
      expect(result.isOverridden).toBe(true);
    });

    it('should fallback to global when no player override', () => {
      const entries = createEntriesMap([createEntry('setting1', 'global_value')]);
      const playerOverride = {
        getOverride: () => undefined,
        hasOverrides: () => false,
      };
      const customResolution = new ConfigurationResolution({
        overrideProvider: playerOverride,
      });

      const result = customResolution.resolve('setting1', { playerId: 'player1' }, entries);

      expect(result.value).toBe('global_value');
    });
  });

  describe('environment-specific resolution', () => {
    it('should resolve environment-specific configuration', () => {
      const entries = createEntriesMap([
        createEntry('setting1', 'global'),
        createEntry('env.production.setting1', 'production_value'),
      ]);

      const result = resolution.resolve('setting1', { environment: 'production' }, entries);

      expect(result.value).toBe('production_value');
      expect(result.source).toBe(ConfigurationResolutionSource.ENVIRONMENT);
    });

    it('should fallback to global when no environment-specific config', () => {
      const entries = createEntriesMap([createEntry('setting1', 'global')]);

      const result = resolution.resolve('setting1', { environment: 'production' }, entries);

      expect(result.value).toBe('global');
    });
  });

  describe('module-specific resolution', () => {
    it('should resolve module-specific configuration', () => {
      const entries = createEntriesMap([
        createEntry('setting1', 'global'),
        createEntry('module.quest.setting1', 'quest_module_value'),
      ]);

      const result = resolution.resolve('setting1', { module: 'quest' }, entries);

      expect(result.value).toBe('quest_module_value');
      expect(result.source).toBe(ConfigurationResolutionSource.MODULE);
    });
  });

  describe('feature-specific resolution', () => {
    it('should resolve feature-specific configuration', () => {
      const entries = createEntriesMap([
        createEntry('setting1', 'global'),
        createEntry('feature.premium.setting1', 'premium_feature_value'),
      ]);

      const result = resolution.resolve('setting1', { module: 'premium' }, entries);

      expect(result.value).toBe('premium_feature_value');
      expect(result.source).toBe(ConfigurationResolutionSource.FEATURE);
    });
  });

  describe('priority order', () => {
    it('should respect priority: player_override > feature > module > environment > global', () => {
      const entries = createEntriesMap([
        createEntry('setting1', 'global'),
        createEntry('env.prod.setting1', 'env'),
        createEntry('module.test.setting1', 'module'),
        createEntry('feature.test.setting1', 'feature'),
      ]);
      const playerOverride = {
        getOverride: () => 'player_override' as const,
        hasOverrides: () => false,
      };
      const customResolution = new ConfigurationResolution({
        overrideProvider: playerOverride,
      });

      const result = customResolution.resolve('setting1', {
        playerId: 'player1',
        environment: 'prod',
        module: 'test',
      }, entries);

      expect(result.value).toBe('player_override');
    });
  });

  describe('resolveMany', () => {
    it('should resolve multiple keys', () => {
      const entries = createEntriesMap([
        createEntry('key1', 'value1'),
        createEntry('key2', 'value2'),
        createEntry('key3', 'value3'),
      ]);

      const results = resolution.resolveMany(['key1', 'key2', 'missing'], {}, entries);

      expect(results.get('key1')?.value).toBe('value1');
      expect(results.get('key2')?.value).toBe('value2');
      expect(results.get('missing')?.source).toBe(ConfigurationResolutionSource.DEFAULT);
    });
  });

  describe('resolveByPrefix', () => {
    it('should resolve all entries with a prefix', () => {
      const entries = createEntriesMap([
        createEntry('env.prod.setting1', 'value1'),
        createEntry('env.prod.setting2', 'value2'),
        createEntry('env.staging.setting1', 'value3'),
        createEntry('other.key', 'value4'),
      ]);

      const results = resolution.resolveByPrefix('env.prod.', {}, entries);

      expect(results.length).toBe(2);
      expect(results.map(r => r.value)).toContain('value1');
      expect(results.map(r => r.value)).toContain('value2');
    });
  });

  describe('getPriorityOrder', () => {
    it('should return correct priority order', () => {
      const priority = resolution.getPriorityOrder();

      expect(priority[0]).toBe(ConfigurationResolutionSource.PLAYER_OVERRIDE);
      expect(priority[priority.length - 1]).toBe(ConfigurationResolutionSource.DEFAULT);
    });
  });

  describe('extractBaseKey', () => {
    it('should extract base key from global prefix', () => {
      const baseKey = resolution.extractBaseKey('global.setting1');
      expect(baseKey).toBe('setting1');
    });

    it('should extract base key from environment prefix', () => {
      const baseKey = resolution.extractBaseKey('env.production.setting1');
      expect(baseKey).toBe('setting1');
    });

    it('should extract base key from module prefix', () => {
      const baseKey = resolution.extractBaseKey('module.quest.setting1');
      expect(baseKey).toBe('setting1');
    });

    it('should extract base key from feature prefix', () => {
      const baseKey = resolution.extractBaseKey('feature.premium.setting1');
      expect(baseKey).toBe('setting1');
    });

    it('should return key as-is if no prefix', () => {
      const baseKey = resolution.extractBaseKey('simple_key');
      expect(baseKey).toBe('simple_key');
    });
  });
});
