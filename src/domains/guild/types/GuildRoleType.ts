/**
 * Guild Role Type
 *
 * Defines the roles a member can have within a guild.
 */

/**
 * Guild role types.
 */
export type GuildRoleType = 'leader' | 'officer' | 'member';

/**
 * Default role for new guild members.
 */
export const DEFAULT_GUILD_ROLE: GuildRoleType = 'member';

/**
 * Role priority for hierarchy (lower number = higher priority).
 */
export const GUILD_ROLE_PRIORITY: Record<GuildRoleType, number> = {
  leader: 1,
  officer: 2,
  member: 3,
} as const;

/**
 * Checks if a role has management privileges.
 */
export function hasManagementPrivileges(role: GuildRoleType): boolean {
  return role === 'leader' || role === 'officer';
}

/**
 * Checks if a role can manage other officers.
 */
export function canManageOfficers(role: GuildRoleType): boolean {
  return role === 'leader';
}

/**
 * Checks if a role can kick members.
 */
export function canKickMembers(role: GuildRoleType, targetRole: GuildRoleType): boolean {
  if (role === 'leader') {
    return true;
  }
  if (role === 'officer' && targetRole === 'member') {
    return true;
  }
  return false;
}
