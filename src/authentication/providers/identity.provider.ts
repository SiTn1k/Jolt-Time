/**
 * Identity Provider
 *
 * Provides access to user identity information throughout the application.
 */

import type { UserIdentity, AuthContext } from '../types';
import type { IUserIdentityRepository } from '../repositories';
import { AuthErrors } from '../errors';

/**
 * Identity provider for accessing user identity.
 */
export class IdentityProvider {
  private readonly userIdentityRepository: IUserIdentityRepository;

  constructor(userIdentityRepository: IUserIdentityRepository) {
    this.userIdentityRepository = userIdentityRepository;
  }

  /**
   * Get user identity by internal user ID.
   */
  async getById(id: string): Promise<UserIdentity | null> {
    const result = await this.userIdentityRepository.findById(id);
    if (!result.success) {
      return null;
    }
    return result.data;
  }

  /**
   * Get user identity by Telegram ID.
   */
  async getByTelegramId(telegramId: number): Promise<UserIdentity | null> {
    const result = await this.userIdentityRepository.findByTelegramId(telegramId);
    if (!result.success) {
      return null;
    }
    return result.data;
  }

  /**
   * Check if user exists by Telegram ID.
   */
  async exists(telegramId: number): Promise<boolean> {
    return this.userIdentityRepository.existsByTelegramId(telegramId);
  }

  /**
   * Update user identity.
   */
  async update(id: string, data: Partial<UserIdentity>): Promise<UserIdentity> {
    const result = await this.userIdentityRepository.update(id, data);
    if (!result.success || !result.data) {
      throw AuthErrors.userNotFound(id);
    }
    return result.data;
  }

  /**
   * Update last authenticated timestamp.
   */
  async touch(id: string): Promise<void> {
    await this.userIdentityRepository.update(id, {
      lastAuthenticatedAt: new Date(),
    });
  }

  /**
   * Resolve player ID from various identifiers.
   */
  async resolvePlayerId(identifier: string | number): Promise<string | null> {
    if (typeof identifier === 'string' && identifier.startsWith('user_')) {
      // Already an internal user ID
      const exists = await this.userIdentityRepository.findById(identifier);
      return exists.success && exists.data ? identifier : null;
    }

    if (typeof identifier === 'number') {
      // Telegram ID
      const result = await this.userIdentityRepository.findByTelegramId(identifier);
      if (result.success && result.data) {
        return result.data.internalUserId;
      }
    }

    return null;
  }

  /**
   * Get multiple identities by internal user IDs.
   */
  async getMany(ids: string[]): Promise<Map<string, UserIdentity>> {
    const identities = new Map<string, UserIdentity>();

    await Promise.all(
      ids.map(async (id) => {
        const result = await this.userIdentityRepository.findById(id);
        if (result.success && result.data) {
          identities.set(id, result.data);
        }
      })
    );

    return identities;
  }
}

/**
 * Global identity provider instance.
 */
let globalIdentityProvider: IdentityProvider | null = null;

/**
 * Get or create the global identity provider.
 */
export function getIdentityProvider(userIdentityRepository?: IUserIdentityRepository): IdentityProvider {
  if (!globalIdentityProvider && userIdentityRepository) {
    globalIdentityProvider = new IdentityProvider(userIdentityRepository);
  }
  if (!globalIdentityProvider) {
    throw new Error('IdentityProvider not initialized. Provide userIdentityRepository.');
  }
  return globalIdentityProvider;
}

/**
 * Reset the global identity provider (for testing).
 */
export function resetIdentityProvider(): void {
  globalIdentityProvider = null;
}