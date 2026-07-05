/**
 * CacheKey Value Object
 *
 * Immutable value object representing a cache entry key.
 * Encapsulates key validation and comparison logic.
 */

const MAX_KEY_LENGTH = 512;
const MIN_KEY_LENGTH = 1;

/**
 * Reserved key prefixes that cannot be used directly.
 */
const RESERVED_PREFIXES = ['__system__', '__admin__', '__internal__'] as const;

/**
 * CacheKey value object class.
 * Immutable - once created, cannot be modified.
 */
export class CacheKey {
  private readonly _value: string;
  private readonly _region: string | null;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The cache key string value
   * @param region Optional region identifier
   */
  private constructor(value: string, region: string | null = null) {
    this._value = value;
    this._region = region;
  }

  /**
   * Creates a CacheKey from a string value.
   * @param value The cache key string
   * @returns A new CacheKey instance
   * @throws Error if validation fails
   */
  public static create(value: string): CacheKey {
    if (!value || value.trim().length < MIN_KEY_LENGTH) {
      throw new Error('CacheKey cannot be empty');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length > MAX_KEY_LENGTH) {
      throw new Error(`CacheKey exceeds maximum length of ${MAX_KEY_LENGTH}`);
    }

    for (const prefix of RESERVED_PREFIXES) {
      if (trimmedValue.startsWith(prefix)) {
        throw new Error(`CacheKey cannot start with reserved prefix: ${prefix}`);
      }
    }

    return new CacheKey(trimmedValue);
  }

  /**
   * Creates a CacheKey with an optional region prefix.
   * Format: region:key or just key
   * @param value The cache key string
   * @param region Optional region identifier
   * @returns A new CacheKey instance
   */
  public static createWithRegion(value: string, region: string): CacheKey {
    const key = CacheKey.create(value);
    return new CacheKey(key._value, region);
  }

  /**
   * Reconstructs a CacheKey from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The cache key string
   * @param region Optional region identifier
   * @returns A new CacheKey instance
   */
  public static reconstruct(value: string, region: string | null = null): CacheKey {
    return new CacheKey(value, region);
  }

  /**
   * Gets the full cache key including region prefix.
   */
  public get fullKey(): string {
    return this._region ? `${this._region}:${this._value}` : this._value;
  }

  /**
   * Gets the raw key value without region.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the region identifier if set.
   */
  public get region(): string | null {
    return this._region;
  }

  /**
   * Checks if this key has a region set.
   */
  public get hasRegion(): boolean {
    return this._region !== null;
  }

  /**
   * Checks equality with another CacheKey.
   * @param other The other CacheKey to compare
   * @returns true if values are equal
   */
  public equals(other: CacheKey): boolean {
    if (!(other instanceof CacheKey)) {
      return false;
    }
    return this._value === other._value && this._region === other._region;
  }

  /**
   * Returns the string representation of the CacheKey.
   */
  public toString(): string {
    return this.fullKey;
  }
}
