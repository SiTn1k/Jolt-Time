/**
 * Guild Permission Type
 *
 * Defines the permissions available within a guild.
 */

/**
 * Guild permission types.
 */
export type GuildPermission =
  | 'guild:edit_name'
  | 'guild:edit_description'
  | 'guild:edit_icon'
  | 'guild:kick_member'
  | 'guild:promote_officer'
  | 'guild:demote_officer'
  | 'guild:transfer_leadership'
  | 'guild:invite_member'
  | 'guild:accept_application'
  | 'guild:create_mission'
  | 'guild:start_war'
  | 'guild:manage_war'
  | 'guild:view_statistics'
  | 'guild:participate_mission'
  | 'guild:donate'
  | 'guild:chat';

/**
 * Default permissions for each role.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, GuildPermission[]> = {
  leader: [
    'guild:edit_name',
    'guild:edit_description',
    'guild:edit_icon',
    'guild:kick_member',
    'guild:promote_officer',
    'guild:demote_officer',
    'guild:transfer_leadership',
    'guild:invite_member',
    'guild:accept_application',
    'guild:create_mission',
    'guild:start_war',
    'guild:manage_war',
    'guild:view_statistics',
    'guild:participate_mission',
    'guild:donate',
    'guild:chat',
  ],
  officer: [
    'guild:kick_member',
    'guild:invite_member',
    'guild:accept_application',
    'guild:create_mission',
    'guild:manage_war',
    'guild:view_statistics',
    'guild:participate_mission',
    'guild:donate',
    'guild:chat',
  ],
  member: [
    'guild:view_statistics',
    'guild:participate_mission',
    'guild:donate',
    'guild:chat',
  ],
} as const;

/**
 * Checks if a permission is allowed for a given role.
 */
export function hasPermission(
  role: string,
  permission: GuildPermission
): boolean {
  const permissions = DEFAULT_ROLE_PERMISSIONS[role];
  return permissions?.includes(permission) ?? false;
}
