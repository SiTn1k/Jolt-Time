/**
 * Authentication Dependency Injection Registration
 *
 * Registers all authentication services with the DI container.
 */

import { Container, Lifetime } from '../core/di';
import { SupabaseProvider } from '../database/providers';
import { SessionRepository, LoginHistoryRepository, SecurityEventRepository, UserIdentityRepository, AuthStateRepository } from './repositories';
import { SessionService } from './services/session.service';
import { AuthService } from './services/auth.service';
import { AuthenticationProvider, IdentityProvider, CurrentUserProvider, SessionProvider } from './providers';
import { AuthMiddleware } from './middleware/auth.middleware';

/**
 * Authentication DI configuration keys.
 */
export const AUTH_TOKENS = {
  SESSION_REPOSITORY: Symbol.for('ISessionRepository'),
  LOGIN_HISTORY_REPOSITORY: Symbol.for('ILoginHistoryRepository'),
  SECURITY_EVENT_REPOSITORY: Symbol.for('ISecurityEventRepository'),
  USER_IDENTITY_REPOSITORY: Symbol.for('IUserIdentityRepository'),
  AUTH_STATE_REPOSITORY: Symbol.for('IAuthStateRepository'),
  SESSION_SERVICE: Symbol.for('SessionService'),
  AUTH_SERVICE: Symbol.for('AuthService'),
  AUTHENTICATION_PROVIDER: Symbol.for('AuthenticationProvider'),
  IDENTITY_PROVIDER: Symbol.for('IdentityProvider'),
  CURRENT_USER_PROVIDER: Symbol.for('CurrentUserProvider'),
  SESSION_PROVIDER: Symbol.for('SessionProvider'),
  AUTH_MIDDLEWARE: Symbol.for('AuthMiddleware'),
} as const;

/**
 * Register all authentication dependencies with the container.
 */
export function registerAuthenticationDependencies(container: Container): void {
  // Get Supabase provider
  const supabaseProvider = SupabaseProvider.getInstance();

  // Repositories (Scoped - one instance per request)
  container.registerFactory(
    SessionRepository,
    () => new SessionRepository(supabaseProvider.getClient()),
    { lifetime: Lifetime.Scoped }
  );

  container.registerFactory(
    LoginHistoryRepository,
    () => new LoginHistoryRepository(supabaseProvider.getClient()),
    { lifetime: Lifetime.Scoped }
  );

  container.registerFactory(
    SecurityEventRepository,
    () => new SecurityEventRepository(supabaseProvider.getClient()),
    { lifetime: Lifetime.Scoped }
  );

  container.registerFactory(
    UserIdentityRepository,
    () => new UserIdentityRepository(supabaseProvider.getClient()),
    { lifetime: Lifetime.Scoped }
  );

  container.registerFactory(
    AuthStateRepository,
    () => new AuthStateRepository(),
    { lifetime: Lifetime.Singleton }
  );

  // Services (Singleton - one instance for the app)
  container.registerFactory(
    SessionService,
    (c: any) => new SessionService(
      c.resolve(SessionRepository as any)
    ),
    { lifetime: Lifetime.Singleton }
  );

  // Providers (Singleton)
  container.registerFactory(
    AuthenticationProvider,
    (c: any) => new AuthenticationProvider(
      c.resolve(SessionService as any),
      c.resolve(SessionRepository as any),
      c.resolve(UserIdentityRepository as any),
      c.resolve(LoginHistoryRepository as any),
      c.resolve(SecurityEventRepository as any)
    ),
    { lifetime: Lifetime.Singleton }
  );

  container.registerFactory(
    IdentityProvider,
    (c: any) => new IdentityProvider(
      c.resolve(UserIdentityRepository as any)
    ),
    { lifetime: Lifetime.Singleton }
  );

  container.registerFactory(
    CurrentUserProvider,
    (c: any) => new CurrentUserProvider(
      c.resolve(AuthenticationProvider as any)
    ),
    { lifetime: Lifetime.Scoped }
  );

  container.registerFactory(
    SessionProvider,
    (c: any) => new SessionProvider(
      c.resolve(SessionService as any)
    ),
    { lifetime: Lifetime.Singleton }
  );

  // Auth Service (Singleton)
  container.registerFactory(
    AuthService,
    (c: any) => new AuthService(
      c.resolve(AuthenticationProvider as any),
      c.resolve(SessionProvider as any),
      c.resolve(IdentityProvider as any)
    ),
    { lifetime: Lifetime.Singleton }
  );

  // Middleware (Scoped - one instance per request)
  container.registerFactory(
    AuthMiddleware,
    (c: any) => new AuthMiddleware(
      c.resolve(AuthService as any),
      c.resolve(CurrentUserProvider as any)
    ),
    { lifetime: Lifetime.Scoped }
  );
}

/**
 * Quick setup function for authentication.
 * Creates and configures all authentication components.
 */
export function setupAuthentication(): {
  authService: AuthService;
  authMiddleware: AuthMiddleware;
  currentUserProvider: CurrentUserProvider;
  sessionService: SessionService;
} {
  const supabaseProvider = SupabaseProvider.getInstance();

  // Create repositories
  const sessionRepository = new SessionRepository(supabaseProvider.getClient());
  const loginHistoryRepository = new LoginHistoryRepository(supabaseProvider.getClient());
  const securityEventRepository = new SecurityEventRepository(supabaseProvider.getClient());
  const userIdentityRepository = new UserIdentityRepository(supabaseProvider.getClient());
  const authStateRepository = new AuthStateRepository();

  // Create services
  const sessionService = new SessionService(sessionRepository);

  // Create providers
  const authenticationProvider = new AuthenticationProvider(
    sessionService,
    sessionRepository,
    userIdentityRepository,
    loginHistoryRepository,
    securityEventRepository
  );

  const identityProvider = new IdentityProvider(userIdentityRepository);
  const currentUserProvider = new CurrentUserProvider(authenticationProvider);
  const sessionProvider = new SessionProvider(sessionService);

  // Create auth service
  const authService = new AuthService(
    authenticationProvider,
    sessionProvider,
    identityProvider
  );

  // Create middleware
  const authMiddleware = new AuthMiddleware(authService, currentUserProvider);

  return {
    authService,
    authMiddleware,
    currentUserProvider,
    sessionService,
  };
}