/**
 * User Permissions
 *
 * Permission model for user access control.
 * This is ONLY the type definition - no permission logic.
 */

import { UserRole } from './UserRole';

/**
 * Individual permission flags that can be granted to users.
 */
export type UserPermission =
  | 'user.read'
  | 'user.write'
  | 'user.delete'
  | 'user.ban'
  | 'user.moderate'
  | 'game.play'
  | 'game.admin'
  | 'guild.create'
  | 'guild.manage'
  | 'guild.delete'
  | 'chat.send'
  | 'chat.moderate'
  | 'content.create'
  | 'content.moderate'
  | 'content.delete'
  | 'admin.bypass'
  | 'system.configure';

/**
 * Permission model for a user.
 * Contains role and associated permissions.
 */
export interface UserPermissions {
  /** User's role */
  role: UserRole;

  /** Set of granted permissions */
  permissions: ReadonlySet<UserPermission>;

  /** Whether user has admin privileges */
  isAdmin: boolean;

  /** Whether user has moderator privileges */
  isModerator: boolean;
}

/**
 * Default permissions for each role.
 */
export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  [UserRole.PLAYER]: {
    role: UserRole.PLAYER,
    permissions: new Set([
      'user.read',
      'game.play',
      'guild.create',
      'chat.send',
      'content.create',
    ]),
    isAdmin: false,
    isModerator: false,
  },
  [UserRole.MODERATOR]: {
    role: UserRole.MODERATOR,
    permissions: new Set([
      'user.read',
      'user.moderate',
      'user.ban',
      'game.play',
      'guild.create',
      'chat.send',
      'chat.moderate',
      'content.create',
      'content.moderate',
    ]),
    isAdmin: false,
    isModerator: true,
  },
  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    permissions: new Set([
      'user.read',
      'user.write',
      'user.delete',
      'user.ban',
      'user.moderate',
      'game.play',
      'game.admin',
      'guild.create',
      'guild.manage',
      'guild.delete',
      'chat.send',
      'chat.moderate',
      'content.create',
      'content.moderate',
      'content.delete',
      'admin.bypass',
    ]),
    isAdmin: true,
    isModerator: true,
  },
  [UserRole.SYSTEM]: {
    role: UserRole.SYSTEM,
    permissions: new Set([
      'user.read',
      'user.write',
      'user.delete',
      'user.ban',
      'user.moderate',
      'game.play',
      'game.admin',
      'guild.create',
      'guild.manage',
      'guild.delete',
      'chat.send',
      'chat.moderate',
      'content.create',
      'content.moderate',
      'content.delete',
      'admin.bypass',
      'system.configure',
    ]),
    isAdmin: true,
    isModerator: true,
  },
};
