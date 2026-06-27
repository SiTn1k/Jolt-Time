/**
 * Authentication Middleware
 *
 * Middleware for protecting routes and operations.
 */

// Minimal type definitions for Express-like middleware (frontend project)
type MockRequest = {
  headers: Record<string, string | undefined>;
  query: Record<string, string | undefined>;
  cookies?: Record<string, string>;
  user?: UserIdentity;
  sessionToken?: string;
  authContext?: {
    isAuthenticated: boolean;
    isPremium: boolean;
    userId: string | null;
    telegramId: number | null;
  };
};

type MockResponse = {
  status: (code: number) => MockResponse;
  json: (body: unknown) => MockResponse;
};

type NextFunction = () => void | Promise<void>;

import type { UserIdentity, Permission } from '../types';
import type { AuthService } from '../services/auth.service';
import type { CurrentUserProvider } from '../providers/current-user.provider';
import { AuthGuard, PermissionGuard, ResourceGuard } from '../guards/auth.guard';
import { AuthErrors, AuthorizationErrors } from '../errors';

/**
 * Extended request with authentication context.
 */
export interface AuthenticatedRequest extends MockRequest {
  user?: UserIdentity;
  sessionToken?: string;
  authContext?: {
    isAuthenticated: boolean;
    isPremium: boolean;
    userId: string | null;
    telegramId: number | null;
  };
}

/**
 * Middleware factory options.
 */
export interface MiddlewareOptions {
  optional?: boolean;
  premium?: boolean;
  permissions?: Permission[];
}

/**
 * Authentication middleware for Express.
 */
export class AuthMiddleware {
  private readonly authService: AuthService;
  private readonly currentUserProvider: CurrentUserProvider;
  private readonly authGuard: AuthGuard;
  private readonly permissionGuard: PermissionGuard;
  private readonly resourceGuard: ResourceGuard;

  constructor(authService: AuthService, currentUserProvider: CurrentUserProvider) {
    this.authService = authService;
    this.currentUserProvider = currentUserProvider;
    this.authGuard = new AuthGuard(currentUserProvider);
    this.permissionGuard = new PermissionGuard(currentUserProvider);
    this.resourceGuard = new ResourceGuard(currentUserProvider);
  }

  /**
   * Create middleware that requires authentication.
   */
  requireAuth() {
    return async (req: AuthenticatedRequest, res: MockResponse, next: NextFunction): Promise<void> => {
      try {
        const sessionToken = this.extractToken(req);
        if (!sessionToken) {
          res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
          return;
        }

        const context = await this.authService.getContext(sessionToken);
        if (!context.isAuthenticated || !context.user) {
          res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Invalid or expired session',
          });
          return;
        }

        // Set context on request
        req.user = context.user;
        req.sessionToken = sessionToken;
        req.authContext = {
          isAuthenticated: true,
          isPremium: context.isPremium,
          userId: context.user.internalUserId,
          telegramId: context.user.telegramId,
        };

        this.currentUserProvider.setContext(context);
        next();
      } catch {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication failed',
        });
      }
    };
  }

  /**
   * Create middleware that optionally loads authentication.
   */
  optionalAuth() {
    return async (req: AuthenticatedRequest, res: MockResponse, next: NextFunction): Promise<void> => {
      try {
        const sessionToken = this.extractToken(req);
        if (sessionToken) {
          const context = await this.authService.getContext(sessionToken);
          if (context.isAuthenticated && context.user) {
            req.user = context.user;
            req.sessionToken = sessionToken;
            req.authContext = {
              isAuthenticated: true,
              isPremium: context.isPremium,
              userId: context.user.internalUserId,
              telegramId: context.user.telegramId,
            };
            this.currentUserProvider.setContext(context);
          }
        }
        next();
      } catch {
        // Continue without authentication
        next();
      }
    };
  }

  /**
   * Create middleware that requires premium status.
   */
  requirePremium() {
    return async (req: AuthenticatedRequest, res: MockResponse, next: NextFunction): Promise<void> => {
      try {
        const sessionToken = this.extractToken(req);
        if (!sessionToken) {
          res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
          return;
        }

        const context = await this.authService.getContext(sessionToken);
        if (!context.isAuthenticated || !context.user) {
          res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Invalid or expired session',
          });
          return;
        }

        if (!context.isPremium) {
          res.status(403).json({
            error: 'FORBIDDEN',
            message: 'Premium subscription required',
          });
          return;
        }

        req.user = context.user;
        req.sessionToken = sessionToken;
        req.authContext = {
          isAuthenticated: true,
          isPremium: true,
          userId: context.user.internalUserId,
          telegramId: context.user.telegramId,
        };

        this.currentUserProvider.setContext(context);
        next();
      } catch {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication failed',
        });
      }
    };
  }

  /**
   * Create middleware that requires specific permissions.
   */
  requirePermissions(permissions: Permission[]) {
    return async (req: AuthenticatedRequest, res: MockResponse, next: NextFunction): Promise<void> => {
      try {
        const sessionToken = this.extractToken(req);
        if (!sessionToken) {
          res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Authentication required',
          });
          return;
        }

        const context = await this.authService.getContext(sessionToken);
        if (!context.isAuthenticated || !context.user) {
          res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Invalid or expired session',
          });
          return;
        }

        // Check permissions (placeholder - always allows for now)
        const result = this.permissionGuard.checkPermissions(permissions);
        if (!result.allowed) {
          res.status(403).json({
            error: 'FORBIDDEN',
            message: result.reason ?? 'Insufficient permissions',
          });
          return;
        }

        req.user = context.user;
        req.sessionToken = sessionToken;
        req.authContext = {
          isAuthenticated: true,
          isPremium: context.isPremium,
          userId: context.user.internalUserId,
          telegramId: context.user.telegramId,
        };

        this.currentUserProvider.setContext(context);
        next();
      } catch {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication failed',
        });
      }
    };
  }

  /**
   * Extract session token from request.
   */
  private extractToken(req: MockRequest): string | null {
    // Try Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try query parameter
    if (req.query.sessionToken && typeof req.query.sessionToken === 'string') {
      return req.query.sessionToken;
    }

    // Try cookie
    if (req.cookies && req.cookies.sessionToken) {
      return req.cookies.sessionToken;
    }

    return null;
  }
}

/**
 * Helper to create error response.
 */
export function authErrorResponse(res: MockResponse, error: Error): void {
  if (error.message.includes('Premium')) {
    res.status(403).json({
      error: 'FORBIDDEN',
      message: error.message,
    });
  } else {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: error.message,
    });
  }
}
