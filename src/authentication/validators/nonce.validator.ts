/**
 * Nonce Validator
 *
 * Provides replay attack protection through nonce validation.
 * Tracks used nonces to prevent replay attacks.
 */

import { AuthErrors } from '../errors';

/**
 * Nonce validation result.
 */
export interface NonceValidationResult {
  valid: boolean;
  error?: ReturnType<typeof AuthErrors.replayDetected>;
}

/**
 * Nonce validator configuration.
 */
export interface NonceValidatorConfig {
  maxAgeSeconds?: number;
  maxStoredNonces?: number;
  cleanupIntervalSeconds?: number;
}

/**
 * Nonce entry with expiration tracking.
 */
interface NonceEntry {
  usedAt: Date;
  expiresAt: Date;
}

/**
 * Nonce validator for replay attack protection.
 */
export class NonceValidator {
  private readonly maxAgeSeconds: number;
  private readonly maxStoredNonces: number;
  private readonly usedNonces = new Map<string, NonceEntry>();
  private lastCleanup = Date.now();
  private readonly cleanupIntervalMs: number;

  constructor(config: NonceValidatorConfig = {}) {
    this.maxAgeSeconds = config.maxAgeSeconds ?? 3600; // 1 hour default
    this.maxStoredNonces = config.maxStoredNonces ?? 100000;
    this.cleanupIntervalMs = (config.cleanupIntervalSeconds ?? 300) * 1000; // 5 minutes default
  }

  /**
   * Validate a nonce for replay attack protection.
   *
   * @param nonce - The nonce to validate
   * @returns Whether the nonce is valid (not previously used and not expired)
   */
  validate(nonce: string): NonceValidationResult {
    if (!nonce || typeof nonce !== 'string') {
      return {
        valid: false,
        error: AuthErrors.replayDetected('', new Error('Invalid nonce format')),
      };
    }

    // Check if nonce already exists (replay attack)
    if (this.usedNonces.has(nonce)) {
      return {
        valid: false,
        error: AuthErrors.replayDetected(nonce),
      };
    }

    // Check cleanup interval
    this.maybeCleanup();

    // Store the nonce
    const now = new Date();
    this.usedNonces.set(nonce, {
      usedAt: now,
      expiresAt: new Date(now.getTime() + this.maxAgeSeconds * 1000),
    });

    // Check if we need to evict old entries due to size limit
    if (this.usedNonces.size > this.maxStoredNonces) {
      this.evictOldest();
    }

    return { valid: true };
  }

  /**
   * Check if a nonce has been used without marking it as used.
   * Useful for checking without consuming the nonce.
   */
  isUsed(nonce: string): boolean {
    return this.usedNonces.has(nonce);
  }

  /**
   * Remove a nonce from the tracking (for testing or session management).
   */
  remove(nonce: string): boolean {
    return this.usedNonces.delete(nonce);
  }

  /**
   * Clear all tracked nonces.
   */
  clear(): void {
    this.usedNonces.clear();
    this.lastCleanup = Date.now();
  }

  /**
   * Get the count of tracked nonces.
   */
  getCount(): number {
    return this.usedNonces.size;
  }

  /**
   * Perform cleanup if interval has passed.
   */
  private maybeCleanup(): void {
    const now = Date.now();
    if (now - this.lastCleanup > this.cleanupIntervalMs) {
      this.cleanup();
    }
  }

  /**
   * Remove expired nonces.
   */
  private cleanup(): void {
    const now = new Date();
    for (const [nonce, entry] of this.usedNonces) {
      if (entry.expiresAt <= now) {
        this.usedNonces.delete(nonce);
      }
    }
    this.lastCleanup = Date.now();
  }

  /**
   * Evict oldest entries when max capacity is reached.
   */
  private evictOldest(): void {
    const entries = Array.from(this.usedNonces.entries());
    // Sort by usedAt ascending (oldest first)
    entries.sort((a, b) => a[1].usedAt.getTime() - b[1].usedAt.getTime());

    // Remove 10% of oldest entries
    const toRemove = Math.ceil(this.maxStoredNonces * 0.1);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.usedNonces.delete(entries[i][0]);
    }
  }
}

/**
 * Global nonce validator instance.
 */
let globalNonceValidator: NonceValidator | null = null;

/**
 * Get the global nonce validator.
 */
export function getNonceValidator(config?: NonceValidatorConfig): NonceValidator {
  if (!globalNonceValidator) {
    globalNonceValidator = new NonceValidator(config);
  }
  return globalNonceValidator;
}

/**
 * Reset the global nonce validator (for testing).
 */
export function resetNonceValidator(): void {
  globalNonceValidator = null;
}