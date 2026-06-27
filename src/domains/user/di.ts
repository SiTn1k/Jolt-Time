/**
 * User Domain Dependency Injection Registration
 *
 * Registers all user domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseUserRepository } from './repositories/SupabaseUserRepository';
import { UserService, createUserService } from './services/UserService';
import { UserMapper } from './mappers/UserMapper';
import { UserValidator, UsernameValidator, LanguageValidator } from './validators';

/**
 * User Domain DI configuration keys.
 */
export const USER_TOKENS = {
  USER_REPOSITORY: Symbol.for('SupabaseUserRepository'),
  USER_SERVICE: Symbol.for('UserService'),
  USER_MAPPER: Symbol.for('UserMapper'),
  USER_VALIDATOR: Symbol.for('UserValidator'),
  USERNAME_VALIDATOR: Symbol.for('UsernameValidator'),
  LANGUAGE_VALIDATOR: Symbol.for('LanguageValidator'),
} as const;

/**
 * Register all user domain dependencies with the container.
 */
export function registerUserDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseUserRepository,
    () => new SupabaseUserRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Service (Scoped - depends on repository)
  container.registerFactory(
    UserService,
    () => createUserService(new SupabaseUserRepository()),
    { lifetime: Lifetime.Scoped }
  );

  // Mapper (Singleton - stateless)
  container.registerInstance(UserMapper, new UserMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(UserValidator, new UserValidator());
  container.registerInstance(UsernameValidator, new UsernameValidator());
  container.registerInstance(LanguageValidator, new LanguageValidator());
}

/**
 * Quick setup function for user domain.
 * Creates and configures all user domain components.
 */
export function setupUserDomain(): {
  userRepository: SupabaseUserRepository;
  userService: UserService;
  userMapper: UserMapper;
  userValidator: UserValidator;
} {
  const userRepository = new SupabaseUserRepository();
  const userService = createUserService(userRepository);
  const userMapper = new UserMapper();
  const userValidator = new UserValidator();

  return {
    userRepository,
    userService,
    userMapper,
    userValidator,
  };
}