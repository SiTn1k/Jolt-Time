/**
 * Feature Flag Engine Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { FeatureFlagEngine } from '../services/FeatureFlagEngine';
import { FeatureFlag } from '../entities/FeatureFlag';
import { FeatureFlagId } from '../value-objects/FeatureFlagId';
import { FeatureFlagEvaluationReason } from '../services/FeatureFlagEngine';

describe('FeatureFlagEngine', () => {
  let engine: FeatureFlagEngine;

  const createFlag = (overrides: Partial<FeatureFlag> = {}): FeatureFlag => ({
    flagId: FeatureFlagId.reconstruct('00000000-0000-4000-8000-000000000001'),
    key: overrides.key ?? 'test_flag',
    enabled: overrides.enabled ?? true,
    rollout: overrides.rollout ?? 100,
    description: overrides.description ?? 'Test flag',
    metadata: overrides.metadata ?? {},
    isActive: () => (overrides.enabled ?? true) && ((overrides.rollout ?? 100) > 0),
    shouldShowForPercentage: (percentage: number) =>
      (overrides.enabled ?? true) && percentage <= (overrides.rollout ?? 100),
    toJSON: () => ({
      flagId: '00000000-0000-4000-8000-000000000001',
      key: overrides.key ?? 'test_flag',
      enabled: overrides.enabled ?? true,
      rollout: overrides.rollout ?? 100,
      description: overrides.description ?? 'Test flag',
      metadata: overrides.metadata ?? {},
    }),
    copyWith: () => createFlag(overrides),
  } as unknown as FeatureFlag);

  beforeEach(() => {
    engine = new FeatureFlagEngine();
  });

  describe('basic evaluation', () => {
    it('should return enabled=true for enabled flag with 100% rollout', () => {
      const flag = createFlag({ enabled: true, rollout: 100 });
      const result = engine.evaluate(flag);
      expect(result.value).toBe(true);
      expect(result.enabled).toBe(true);
    });

    it('should return enabled=false for disabled flag', () => {
      const flag = createFlag({ enabled: false });
      const result = engine.evaluate(flag);
      expect(result.value).toBe(false);
      expect(result.reason).toBe(FeatureFlagEvaluationReason.FLAG_DISABLED);
    });

    it('should return not_active for flag with 0% rollout', () => {
      const flag = createFlag({ enabled: true, rollout: 0 });
      const result = engine.evaluate(flag);
      expect(result.value).toBe(false);
      expect(result.reason).toBe(FeatureFlagEvaluationReason.NOT_ACTIVE);
    });
  });

  describe('percentage rollout', () => {
    it('should evaluate based on consistent hash', () => {
      const flag = createFlag({ enabled: true, rollout: 50 });
      const flagsMap = new Map([[flag.key, flag]]);

      // Test that same user always gets same result
      const userId = 'user123';
      const result1 = engine.evaluateByKey(flag.key, flagsMap, { userId });
      const result2 = engine.evaluateByKey(flag.key, flagsMap, { userId });
      expect(result1.value).toBe(result2.value);
    });

    it('should handle 100% rollout for all users', () => {
      const flag = createFlag({ enabled: true, rollout: 100 });
      const flagsMap = new Map([[flag.key, flag]]);

      const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
      for (const user of users) {
        const result = engine.evaluateByKey(flag.key, flagsMap, { userId: user });
        expect(result.value).toBe(true);
      }
    });

    it('should handle 0% rollout for no users', () => {
      const flag = createFlag({ enabled: true, rollout: 0 });
      const flagsMap = new Map([[flag.key, flag]]);

      const users = ['user1', 'user2', 'user3', 'user4', 'user5'];
      for (const user of users) {
        const result = engine.evaluateByKey(flag.key, flagsMap, { userId: user });
        expect(result.value).toBe(false);
      }
    });
  });

  describe('target users', () => {
    it('should enable flag for target user', () => {
      const flag = createFlag({ enabled: true, rollout: 0 });
      const flagsMap = new Map([[flag.key, flag]]);

      const result = engine.evaluateByKey(flag.key, flagsMap, {
        userId: 'target_user',
        targetUserIds: ['target_user', 'another_target'],
      });

      expect(result.value).toBe(true);
      expect(result.reason).toBe(FeatureFlagEvaluationReason.TARGET_USER);
    });

    it('should not enable flag for non-target user', () => {
      const flag = createFlag({ enabled: true, rollout: 0 });
      const flagsMap = new Map([[flag.key, flag]]);

      const result = engine.evaluateByKey(flag.key, flagsMap, {
        userId: 'normal_user',
        targetUserIds: ['target_user'],
      });

      expect(result.value).toBe(false);
    });
  });

  describe('missing flag handling', () => {
    it('should return default value for missing flag', () => {
      const emptyMap = new Map<string, FeatureFlag>();
      const result = engine.evaluateByKey('missing_flag', emptyMap, { userId: 'user1' });

      expect(result.value).toBe(false);
      expect(result.reason).toBe(FeatureFlagEvaluationReason.FLAG_NOT_FOUND);
    });

    it('should respect custom default value', () => {
      const customEngine = new FeatureFlagEngine({ defaultValue: true });
      const emptyMap = new Map<string, FeatureFlag>();
      const result = customEngine.evaluateByKey('missing_flag', emptyMap, { userId: 'user1' });

      expect(result.value).toBe(true);
    });
  });

  describe('isEnabled helper', () => {
    it('should return true for enabled flag', () => {
      const flag = createFlag({ enabled: true, rollout: 100 });
      const flagsMap = new Map([[flag.key, flag]]);
      expect(engine.isEnabled(flag.key, flagsMap, { userId: 'user1' })).toBe(true);
    });

    it('should return false for disabled flag', () => {
      const flag = createFlag({ enabled: false });
      const flagsMap = new Map([[flag.key, flag]]);
      expect(engine.isEnabled(flag.key, flagsMap, { userId: 'user1' })).toBe(false);
    });
  });

  describe('getEnabledFlags', () => {
    it('should return only enabled flags', () => {
      const flags = new Map<string, FeatureFlag>();
      flags.set('enabled_flag', createFlag({ key: 'enabled_flag', enabled: true, rollout: 100 }));
      flags.set('disabled_flag', createFlag({ key: 'disabled_flag', enabled: false }));
      flags.set('zero_rollout', createFlag({ key: 'zero_rollout', enabled: true, rollout: 0 }));

      const enabled = engine.getEnabledFlags(flags, { userId: 'user1' });

      expect(enabled).toContain('enabled_flag');
      expect(enabled).not.toContain('disabled_flag');
      expect(enabled).not.toContain('zero_rollout');
    });
  });

  describe('evaluateMany', () => {
    it('should evaluate multiple flags', () => {
      const flags = new Map<string, FeatureFlag>();
      flags.set('flag1', createFlag({ key: 'flag1', enabled: true, rollout: 100 }));
      flags.set('flag2', createFlag({ key: 'flag2', enabled: false }));

      const results = engine.evaluateMany(['flag1', 'flag2', 'missing'], flags, { userId: 'user1' });

      expect(results.get('flag1')?.value).toBe(true);
      expect(results.get('flag2')?.value).toBe(false);
      expect(results.get('missing')?.reason).toBe(FeatureFlagEvaluationReason.FLAG_NOT_FOUND);
    });
  });

  describe('consistent hashing', () => {
    it('should produce consistent results across evaluations', () => {
      const flag = createFlag({ enabled: true, rollout: 50 });
      const flagsMap = new Map([[flag.key, flag]]);
      const userId = 'consistent_user';

      const results = new Set<boolean>();
      for (let i = 0; i < 10; i++) {
        const result = engine.evaluateByKey(flag.key, flagsMap, { userId });
        results.add(result.value);
      }

      // Should always return the same value for the same user
      expect(results.size).toBe(1);
    });

    it('should distribute users roughly according to rollout percentage', () => {
      const flag = createFlag({ enabled: true, rollout: 50 });
      const flagsMap = new Map([[flag.key, flag]]);

      let enabledCount = 0;
      const totalUsers = 1000;

      for (let i = 0; i < totalUsers; i++) {
        const result = engine.evaluateByKey(flag.key, flagsMap, { userId: `user_${i}` });
        if (result.value) enabledCount++;
      }

      // Should be roughly 50% (allow 10% variance)
      const percentage = (enabledCount / totalUsers) * 100;
      expect(percentage).toBeGreaterThan(40);
      expect(percentage).toBeLessThan(60);
    });
  });
});
