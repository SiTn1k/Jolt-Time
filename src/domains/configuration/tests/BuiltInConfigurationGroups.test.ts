/**
 * Built-in Configuration Groups Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  BuiltInGroupName,
  BUILT_IN_GROUPS,
  getBuiltInGroupNames,
  getBuiltInGroupDefinition,
  isBuiltInGroup,
  getBuiltInGroupTags,
} from '../types/BuiltInConfigurationGroups';

describe('Built-in Configuration Groups', () => {
  describe('BUILT_IN_GROUPS', () => {
    it('should have all required groups', () => {
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.ECONOMY);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.MUSEUM);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.ACADEMY);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.QUEST);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.ACHIEVEMENT);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.GUILD);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.REWARD);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.NOTIFICATION);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.ANALYTICS);
      expect(BUILT_IN_GROUPS).toHaveProperty(BuiltInGroupName.SYSTEM);
    });

    it('should have description for all groups', () => {
      for (const group of Object.values(BUILT_IN_GROUPS)) {
        expect(group.description).toBeDefined();
        expect(typeof group.description).toBe('string');
        expect(group.description.length).toBeGreaterThan(0);
      }
    });

    it('should have tags for all groups', () => {
      for (const group of Object.values(BUILT_IN_GROUPS)) {
        expect(group.tags).toBeDefined();
        expect(Array.isArray(group.tags)).toBe(true);
      }
    });
  });

  describe('getBuiltInGroupNames', () => {
    it('should return all group names', () => {
      const names = getBuiltInGroupNames();
      expect(names).toContain(BuiltInGroupName.ECONOMY);
      expect(names).toContain(BuiltInGroupName.MUSEUM);
      expect(names).toContain(BuiltInGroupName.SYSTEM);
    });

    it('should return array of all values', () => {
      const names = getBuiltInGroupNames();
      expect(names.length).toBe(Object.values(BuiltInGroupName).length);
    });
  });

  describe('getBuiltInGroupDefinition', () => {
    it('should return definition for valid group name', () => {
      const definition = getBuiltInGroupDefinition(BuiltInGroupName.ECONOMY);
      expect(definition).toBeDefined();
      expect(definition?.name).toBe(BuiltInGroupName.ECONOMY);
    });

    it('should return undefined for invalid group name', () => {
      const definition = getBuiltInGroupDefinition('invalid' as BuiltInGroupName);
      expect(definition).toBeUndefined();
    });
  });

  describe('isBuiltInGroup', () => {
    it('should return true for valid built-in group names', () => {
      expect(isBuiltInGroup(BuiltInGroupName.ECONOMY)).toBe(true);
      expect(isBuiltInGroup(BuiltInGroupName.GUILD)).toBe(true);
      expect(isBuiltInGroup(BuiltInGroupName.SYSTEM)).toBe(true);
    });

    it('should return false for non built-in names', () => {
      expect(isBuiltInGroup('custom_group')).toBe(false);
      expect(isBuiltInGroup('invalid')).toBe(false);
      expect(isBuiltInGroup('')).toBe(false);
    });
  });

  describe('getBuiltInGroupTags', () => {
    it('should return tags for valid group', () => {
      const tags = getBuiltInGroupTags(BuiltInGroupName.ECONOMY);
      expect(tags).toContain('economy');
      expect(tags).toContain('currency');
    });

    it('should return empty array for undefined group', () => {
      const tags = getBuiltInGroupTags('invalid' as BuiltInGroupName);
      expect(tags).toEqual([]);
    });
  });

  describe('Group structure', () => {
    it('should have economy group with correct structure', () => {
      const economy = BUILT_IN_GROUPS[BuiltInGroupName.ECONOMY];
      expect(economy.name).toBe(BuiltInGroupName.ECONOMY);
      expect(economy.tags).toContain('economy');
      expect(economy.tags).toContain('currency');
    });

    it('should have museum group with correct structure', () => {
      const museum = BUILT_IN_GROUPS[BuiltInGroupName.MUSEUM];
      expect(museum.name).toBe(BuiltInGroupName.MUSEUM);
      expect(museum.tags).toContain('museum');
    });

    it('should have system group with correct structure', () => {
      const system = BUILT_IN_GROUPS[BuiltInGroupName.SYSTEM];
      expect(system.name).toBe(BuiltInGroupName.SYSTEM);
      expect(system.tags).toContain('system');
    });
  });
});
