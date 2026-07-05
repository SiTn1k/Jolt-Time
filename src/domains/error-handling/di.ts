/**
 * Error Handling Domain Dependency Injection Registration
 *
 * Registers all error handling domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseErrorRepository } from './repositories/SupabaseErrorRepository';
import { ErrorMapper } from './mappers/ErrorMapper';
import { CategoryMapper } from './mappers/CategoryMapper';
import { ContextMapper } from './mappers/ContextMapper';
import { ErrorValidator } from './validators/ErrorValidator';
import { CategoryValidator } from './validators/CategoryValidator';
import { ContextValidator } from './validators/ContextValidator';

/**
 * Error Handling Domain DI configuration keys.
 */
export const ERROR_HANDLING_TOKENS = {
  ERROR_REPOSITORY: Symbol.for('SupabaseErrorRepository'),
  ERROR_MAPPER: Symbol.for('ErrorMapper'),
  CATEGORY_MAPPER: Symbol.for('CategoryMapper'),
  CONTEXT_MAPPER: Symbol.for('ContextMapper'),
  ERROR_VALIDATOR: Symbol.for('ErrorValidator'),
  CATEGORY_VALIDATOR: Symbol.for('CategoryValidator'),
  CONTEXT_VALIDATOR: Symbol.for('ContextValidator'),
} as const;

/**
 * Register all error handling domain dependencies with the container.
 */
export function registerErrorHandlingDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(ErrorValidator, new ErrorValidator());
  container.registerInstance(CategoryValidator, new CategoryValidator());
  container.registerInstance(ContextValidator, new ContextValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(ErrorMapper, new ErrorMapper());
  container.registerInstance(CategoryMapper, new CategoryMapper());
  container.registerInstance(ContextMapper, new ContextMapper());

  // Repository (Singleton)
  container.register(SupabaseErrorRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for error handling domain.
 * Creates and configures all error handling domain components.
 */
export function setupErrorHandlingDomain(): {
  errorRepository: SupabaseErrorRepository;
  errorMapper: ErrorMapper;
  categoryMapper: CategoryMapper;
  contextMapper: ContextMapper;
  errorValidator: ErrorValidator;
  categoryValidator: CategoryValidator;
  contextValidator: ContextValidator;
} {
  const errorRepository = new SupabaseErrorRepository();
  const errorMapper = new ErrorMapper();
  const categoryMapper = new CategoryMapper();
  const contextMapper = new ContextMapper();
  const errorValidator = new ErrorValidator();
  const categoryValidator = new CategoryValidator();
  const contextValidator = new ContextValidator();

  return {
    errorRepository,
    errorMapper,
    categoryMapper,
    contextMapper,
    errorValidator,
    categoryValidator,
    contextValidator,
  };
}

/**
 * Creates SupabaseErrorRepository with optional client.
 */
export function createErrorRepository(client?: SupabaseClient): SupabaseErrorRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new SupabaseErrorRepository(client as any);
}

// Import SupabaseClient type
import type { SupabaseClient } from '@supabase/supabase-js';
