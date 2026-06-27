/**
 * CurrencyType Value Object
 *
 * Immutable value object representing a type of currency in the game.
 * Encapsulates currency type validation and comparison logic.
 */

/**
 * Supported currency types in the game.
 */
export enum CurrencyTypeEnum {
  /** Primary game currency - earned through gameplay */
  GOLD = 'gold',
  /** Premium currency - earned through purchases or rare rewards */
  GEMS = 'gems',
  /** Event currency - earned during special events */
  EVENT_TOKENS = 'event_tokens',
  /** Guild currency - earned through guild activities */
  GUILD_CREDITS = 'guild_credits',
  /** Energy currency for expeditions */
  ENERGY_CREDITS = 'energy_credits',
}

/**
 * CurrencyType value object class.
 * Immutable - once created, cannot be modified.
 */
export class CurrencyType {
  private readonly _value: CurrencyTypeEnum;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The currency type value
   */
  private constructor(value: CurrencyTypeEnum) {
    this._value = value;
  }

  /**
   * Creates a CurrencyType from a string value.
   * Validates that the value is a valid currency type.
   * @param value The currency type string
   * @returns A new CurrencyType instance
   * @throws Error if validation fails
   */
  public static create(value: string): CurrencyType {
    const normalizedValue = value.toLowerCase() as CurrencyTypeEnum;
    if (!Object.values(CurrencyTypeEnum).includes(normalizedValue)) {
      throw new Error(`Invalid currency type: ${value}. Must be one of: ${Object.values(CurrencyTypeEnum).join(', ')}`);
    }
    return new CurrencyType(normalizedValue);
  }

  /**
   * Reconstructs a CurrencyType from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The currency type value
   * @returns A new CurrencyType instance
   */
  public static reconstruct(value: CurrencyTypeEnum): CurrencyType {
    return new CurrencyType(value);
  }

  /**
   * Gets all valid currency type values.
   * @returns Array of all valid currency type values
   */
  public static values(): CurrencyTypeEnum[] {
    return Object.values(CurrencyTypeEnum);
  }

  /**
   * Checks if a string is a valid currency type.
   * @param value The string to check
   * @returns true if valid currency type
   */
  public static isValid(value: string): boolean {
    return Object.values(CurrencyTypeEnum).includes(value.toLowerCase() as CurrencyTypeEnum);
  }

  /**
   * Gets the underlying value.
   */
  public get value(): CurrencyTypeEnum {
    return this._value;
  }

  /**
   * Gets the display name for the currency type.
   */
  public get displayName(): string {
    const names: Record<CurrencyTypeEnum, string> = {
      [CurrencyTypeEnum.GOLD]: 'Gold',
      [CurrencyTypeEnum.GEMS]: 'Gems',
      [CurrencyTypeEnum.EVENT_TOKENS]: 'Event Tokens',
      [CurrencyTypeEnum.GUILD_CREDITS]: 'Guild Credits',
      [CurrencyTypeEnum.ENERGY_CREDITS]: 'Energy Credits',
    };
    return names[this._value];
  }

  /**
   * Gets the symbol for the currency type.
   */
  public get symbol(): string {
    const symbols: Record<CurrencyTypeEnum, string> = {
      [CurrencyTypeEnum.GOLD]: '💰',
      [CurrencyTypeEnum.GEMS]: '💎',
      [CurrencyTypeEnum.EVENT_TOKENS]: '🎫',
      [CurrencyTypeEnum.GUILD_CREDITS]: '🏛️',
      [CurrencyTypeEnum.ENERGY_CREDITS]: '⚡',
    };
    return symbols[this._value];
  }

  /**
   * Checks if this currency type is premium (purchased with real money).
   */
  public get isPremium(): boolean {
    return this._value === CurrencyTypeEnum.GEMS;
  }

  /**
   * Checks equality with another CurrencyType.
   * @param other The other CurrencyType to compare
   * @returns true if values are equal
   */
  public equals(other: CurrencyType): boolean {
    if (!(other instanceof CurrencyType)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the CurrencyType.
   */
  public toString(): string {
    return this._value;
  }
}
