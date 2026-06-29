/**
 * Built-in Configuration Groups
 *
 * Predefined configuration groups for the Jolt Time game.
 * These groups organize configuration entries by domain/feature area.
 */

import type { GroupId } from '../value-objects/GroupId';

/**
 * Built-in configuration group names.
 */
export enum BuiltInGroupName {
  /** Economy configuration group */
  ECONOMY = 'economy',
  /** Museum configuration group */
  MUSEUM = 'museum',
  /** Academy configuration group */
  ACADEMY = 'academy',
  /** Quest configuration group */
  QUEST = 'quest',
  /** Achievement configuration group */
  ACHIEVEMENT = 'achievement',
  /** Guild configuration group */
  GUILD = 'guild',
  /** Reward configuration group */
  REWARD = 'reward',
  /** Notification configuration group */
  NOTIFICATION = 'notification',
  /** Analytics configuration group */
  ANALYTICS = 'analytics',
  /** System configuration group */
  SYSTEM = 'system',
  /** Game configuration group */
  GAME = 'game',
  /** User configuration group */
  USER = 'user',
  /** Event configuration group */
  EVENT = 'event',
  /** Battle pass configuration group */
  BATTLE_PASS = 'battle_pass',
  /** Tournament configuration group */
  TOURNAMENT = 'tournament',
  /** Daily reward configuration group */
  DAILY_REWARD = 'daily_reward',
}

/**
 * Configuration group definition.
 */
export interface ConfigurationGroupDefinition {
  /** Group name */
  name: string;
  /** Group description */
  description: string;
  /** Group ID (predefined) */
  predefinedId?: string;
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Built-in configuration groups definitions.
 */
export const BUILT_IN_GROUPS: Record<BuiltInGroupName, ConfigurationGroupDefinition> = {
  [BuiltInGroupName.ECONOMY]: {
    name: BuiltInGroupName.ECONOMY,
    description: 'Economy system configuration including currencies, exchange rates, and pricing',
    tags: ['economy', 'currency', 'pricing'],
  },
  [BuiltInGroupName.MUSEUM]: {
    name: BuiltInGroupName.MUSEUM,
    description: 'Museum system configuration including exhibit limits, visitor settings, and display options',
    tags: ['museum', 'exhibit', 'display'],
  },
  [BuiltInGroupName.ACADEMY]: {
    name: BuiltInGroupName.ACADEMY,
    description: 'Academy system configuration including course settings, progression, and rewards',
    tags: ['academy', 'course', 'learning'],
  },
  [BuiltInGroupName.QUEST]: {
    name: BuiltInGroupName.QUEST,
    description: 'Quest system configuration including quest types, difficulties, and rewards',
    tags: ['quest', 'mission', 'task'],
  },
  [BuiltInGroupName.ACHIEVEMENT]: {
    name: BuiltInGroupName.ACHIEVEMENT,
    description: 'Achievement system configuration including achievement types, criteria, and rewards',
    tags: ['achievement', 'milestone', 'goal'],
  },
  [BuiltInGroupName.GUILD]: {
    name: BuiltInGroupName.GUILD,
    description: 'Guild system configuration including member limits, permissions, and settings',
    tags: ['guild', 'clan', 'social'],
  },
  [BuiltInGroupName.REWARD]: {
    name: BuiltInGroupName.REWARD,
    description: 'Reward system configuration including reward types, multipliers, and limits',
    tags: ['reward', 'bonus', 'compensation'],
  },
  [BuiltInGroupName.NOTIFICATION]: {
    name: BuiltInGroupName.NOTIFICATION,
    description: 'Notification system configuration including templates, timing, and preferences',
    tags: ['notification', 'alert', 'message'],
  },
  [BuiltInGroupName.ANALYTICS]: {
    name: BuiltInGroupName.ANALYTICS,
    description: 'Analytics system configuration including tracking events, metrics, and retention settings',
    tags: ['analytics', 'tracking', 'metrics'],
  },
  [BuiltInGroupName.SYSTEM]: {
    name: BuiltInGroupName.SYSTEM,
    description: 'System-level configuration including timeouts, limits, and infrastructure settings',
    tags: ['system', 'infrastructure', 'performance'],
  },
  [BuiltInGroupName.GAME]: {
    name: BuiltInGroupName.GAME,
    description: 'Core game configuration including gameplay settings, balance, and progression',
    tags: ['gameplay', 'balance', 'progression'],
  },
  [BuiltInGroupName.USER]: {
    name: BuiltInGroupName.USER,
    description: 'User management configuration including registration, authentication, and preferences',
    tags: ['user', 'auth', 'profile'],
  },
  [BuiltInGroupName.EVENT]: {
    name: BuiltInGroupName.EVENT,
    description: 'Event system configuration including event types, schedules, and participation settings',
    tags: ['event', 'season', 'campaign'],
  },
  [BuiltInGroupName.BATTLE_PASS]: {
    name: BuiltInGroupName.BATTLE_PASS,
    description: 'Battle pass configuration including tiers, rewards, and progression settings',
    tags: ['battle_pass', 'premium', 'subscription'],
  },
  [BuiltInGroupName.TOURNAMENT]: {
    name: BuiltInGroupName.TOURNAMENT,
    description: 'Tournament configuration including brackets, rules, and rewards',
    tags: ['tournament', 'competition', 'bracket'],
  },
  [BuiltInGroupName.DAILY_REWARD]: {
    name: BuiltInGroupName.DAILY_REWARD,
    description: 'Daily reward configuration including reward tiers, streak settings, and reset timing',
    tags: ['daily_reward', 'streak', 'login'],
  },
};

/**
 * Gets all built-in group names.
 * @returns Array of built-in group names
 */
export function getBuiltInGroupNames(): BuiltInGroupName[] {
  return Object.values(BuiltInGroupName);
}

/**
 * Gets a built-in group definition by name.
 * @param name The group name
 * @returns The group definition or undefined
 */
export function getBuiltInGroupDefinition(name: BuiltInGroupName): ConfigurationGroupDefinition | undefined {
  return BUILT_IN_GROUPS[name];
}

/**
 * Checks if a name is a valid built-in group name.
 * @param name The name to check
 * @returns true if valid built-in group name
 */
export function isBuiltInGroup(name: string): name is BuiltInGroupName {
  return Object.values(BuiltInGroupName).includes(name as BuiltInGroupName);
}

/**
 * Gets tags for a built-in group.
 * @param name The group name
 * @returns Array of tags or empty array
 */
export function getBuiltInGroupTags(name: BuiltInGroupName): string[] {
  return BUILT_IN_GROUPS[name]?.tags ?? [];
}
