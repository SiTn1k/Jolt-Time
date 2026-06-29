/**
 * Admin Role Type Enum
 *
 * Defines the available administrative role types in the system.
 * Priority determines hierarchy (higher = more authority).
 */

export enum AdminRoleType {
  SUPPORT = 'support',
  MODERATOR = 'moderator',
  ANALYST = 'analyst',
  DEVELOPER = 'developer',
  ADMINISTRATOR = 'administrator',
  OWNER = 'owner',
}

/**
 * Role priority mapping.
 * Higher number = more authority.
 */
export const ADMIN_ROLE_PRIORITY: Record<AdminRoleType, number> = {
  [AdminRoleType.SUPPORT]: 1,
  [AdminRoleType.MODERATOR]: 2,
  [AdminRoleType.ANALYST]: 3,
  [AdminRoleType.DEVELOPER]: 4,
  [AdminRoleType.ADMINISTRATOR]: 5,
  [AdminRoleType.OWNER]: 6,
} as const;

/**
 * Gets the priority level for an admin role type.
 * @param role The admin role type
 * @returns The priority level
 */
export function getRolePriority(role: AdminRoleType): number {
  return ADMIN_ROLE_PRIORITY[role];
}

/**
 * Checks if role A has higher or equal priority than role B.
 * @param roleA First role to compare
 * @param roleB Second role to compare
 * @returns True if roleA >= roleB in priority
 */
export function hasRolePriority(roleA: AdminRoleType, roleB: AdminRoleType): boolean {
  return ADMIN_ROLE_PRIORITY[roleA] >= ADMIN_ROLE_PRIORITY[roleB];
}