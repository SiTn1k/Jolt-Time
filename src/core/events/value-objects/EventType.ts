/**
 * EventType Value Object
 *
 * Immutable value object representing an event type.
 * Encapsulates event type validation and comparison logic.
 */

const EVENT_TYPE_MAX_LENGTH = 128;
const EVENT_TYPE_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/;

/**
 * EventType value object class.
 * Immutable - once created, cannot be modified.
 */
export class EventType {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an EventType from a string value.
   * Validates the format: Domain.EntityName (e.g., PlayerProfile.Created)
   */
  public static create(value: string): EventType {
    if (!value || value.trim().length === 0) {
      throw new Error('EventType cannot be empty');
    }
    if (value.length > EVENT_TYPE_MAX_LENGTH) {
      throw new Error(`EventType exceeds maximum length of ${EVENT_TYPE_MAX_LENGTH}`);
    }
    if (!EVENT_TYPE_PATTERN.test(value)) {
      throw new Error(`Invalid EventType format: ${value}. Expected format: Domain.EntityName`);
    }
    return new EventType(value);
  }

  /**
   * Reconstructs an EventType from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   */
  public static reconstruct(value: string): EventType {
    return new EventType(value);
  }

  /**
   * Gets the underlying string value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the domain part of the event type (e.g., "PlayerProfile" from "PlayerProfile.Created").
   */
  public get domain(): string {
    const parts = this._value.split('.');
    return parts[0] || '';
  }

  /**
   * Gets the action part of the event type (e.g., "Created" from "PlayerProfile.Created").
   */
  public get action(): string {
    const parts = this._value.split('.');
    return parts[1] || '';
  }

  /**
   * Checks equality with another EventType.
   */
  public equals(other: EventType): boolean {
    if (!(other instanceof EventType)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the EventType.
   */
  public toString(): string {
    return this._value;
  }
}