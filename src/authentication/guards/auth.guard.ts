/**
 * Authentication Guard
 *
 * Guards for protecting routes and operations.
 */

import type { UserIdentity, Permission, AuthContext } from '../types';
import type { CurrentUserProvider } from '../providers/current-user.provider';
import { AuthorizationErrors } from '../errors';

/**
 * Access guard result.
 */
export interface GuardResult {
  allowed: boolean;
  reason?: string;
  user?: UserIdentity;
}

/**
 * Guard context for checking permissions.
 */
export interface GuardContext {
  user: UserIdentity;
  requiredPermissions?: Permission[];
  resource?: string;
}

/**
 * Base authentication guard.
 */
export class AuthGuard {
  protected readonly currentUserProvider: CurrentUserProvider;

  constructor(currentUserProvider: CurrentUserProvider) {
    this.currentUserProvider = currentUserProvider;
  }

  /**
   * Check if the current user is authenticated.
   */
  checkAuthenticated(): GuardResult {
    const user = this.currentUserProvider.getCurrentUser();
    if (!user) {
      return {
        allowed: false,
        reason: 'Authentication required',
      };
    }
    return {
      allowed: true,
      user,
    };
  }

  /**
   * Check if the current user is NOT authenticated.
   */
  checkUnauthenticated(): GuardResult {
    const user = this.currentUserProvider.getCurrentUser();
    if (user) {
      return {
        allowed: false,
        reason: 'Already authenticated',
        user,
      };
    }
    return {
      allowed: true,
    };
  }

  /**
   * Check if the current user has premium status.
   */
  checkPremium(): GuardResult {
    const result = this.checkAuthenticated();
    if (!result.allowed) {
      return result;
    }

    if (!result.user!.isPremium) {
      return {
        allowed: false,
        reason: 'Premium subscription required',
        user: result.user,
      };
    }

    return result;
  }

  /**
   * Require authentication - throws if not authenticated.
   */
  requireAuthenticated(): UserIdentity {
    const result = this.checkAuthenticated();
    if (!result.allowed) {
      throw AuthorizationErrors.accessDenied([]);
    }
    return result.user!;
  }

  /**
   * Require premium status - throws if not premium.
   */
  requirePremium(): UserIdentity {
    const result = this.checkPremium();
    if (!result.allowed) {
      throw AuthorizationErrors.accessDenied([]);
    }
    return result.user!;
  }
}

/**
 * Permission guard for checking user permissions.
 */
export class PermissionGuard extends AuthGuard {
  /**
   * Check if the current user has all required permissions.
   */
  checkPermissions(requiredPermissions: Permission[]): GuardResult {
    const result = this.checkAuthenticated();
    if (!result.allowed) {
      return result;
    }

    // For now, we don't have a full permission system implemented
    // This is a placeholder that always allows authenticated users
    // In the future, this would check against the user's roles/permissions

    return {
      allowed: true,
      user: result.user,
    };
  }

  /**
   * Require specific permissions - throws if not satisfied.
   */
  requirePermissions(requiredPermissions: Permission[]): UserIdentity {
    const result = this.checkPermissions(requiredPermissions);
    if (!result.allowed) {
      throw AuthorizationErrors.accessDenied(requiredPermissions);
    }
    return result.user!;
  }

  /**
   * Check if user has any of the required permissions.
   */
  checkAnyPermission(requiredPermissions: Permission[]): GuardResult {
    // Placeholder implementation - always returns allowed for now
    const result = this.checkAuthenticated();
    return result;
  }
}

/**
 * Resource guard for checking access to specific resources.
 */
export class ResourceGuard extends AuthGuard {
  /**
   * Check if the current user owns or can access a resource.
   */
  checkResourceOwner(resourceUserId: string): GuardResult {
    const result = this.checkAuthenticated();
    if (!result.allowed) {
      return result;
    }

    if (result.user!.internalUserId !== resourceUserId) {
      return {
        allowed: false,
        reason: 'Access denied to this resource',
        user: result.user,
      };
    }

    return result;
  }

  /**
   * Require ownership of a resource.
   */
  requireResourceOwner(resourceUserId: string): UserIdentity {
    const result = this.checkResourceOwner(resourceUserId);
    if (!result.allowed) {
      throw AuthorizationErrors.accessDenied([]);
    }
    return result.user!;
  }
}

/**
 * Composite guard that combines multiple guards.
 */
export class CompositeGuard {
  private readonly guards: AuthGuard[];

  constructor(guards: AuthGuard[]) {
    this.guards = guards;
  }

  /**
   * Check all guards - all must pass.
   */
  checkAll(): GuardResult {
    for (const guard of this.guards) {
      const result = guard.checkAuthenticated();
      if (!result.allowed) {
        return result;
      }
    }
    return { allowed: true };
  }

  /**
   * Check all guards - any must pass.
   */
  checkAny(): GuardResult {
    for (const guard of this.guards) {
      const result = guard.checkAuthenticated();
      if (result.allowed) {
        return result;
      }
    }
    return {
      allowed: false,
      reason: 'None of the guards passed',
    };
  }
}