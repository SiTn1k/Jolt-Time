/**
 * Database Module
 *
 * Production Database Layer for Jolt Time.
 * This is the ONLY way the application communicates with Supabase.
 */

// Types
export * from './types';

// Errors
export * from './errors';

// DTO
export * from './dto';

// Mappers
export * from './mappers';

// Providers
export * from './providers';

// Repositories
export * from './repositories';

/**
 * Database Module Usage
 * 
 * All database access must go through repositories:
 * 
 * ```typescript
 * import { SupabaseProvider, UserRepository } from './database';
 * 
 * // Initialize provider
 * const provider = SupabaseProvider.getInstance();
 * provider.initialize({ url: '...', anonKey: '...' });
 * 
 * // Create repository
 * const userRepo = new UserRepository(provider.getClient());
 * const result = await userRepo.findById('user-123');
 * ```
 */