/**
 * TutorialStep Value Object
 *
 * Immutable value object representing the current tutorial progress step.
 * Encapsulates tutorial step validation and progression logic.
 */

/**
 * Tutorial step enumeration for game tutorial.
 */
export enum TutorialStepValue {
  NOT_STARTED = 0,
  WELCOME = 1,
  BASIC_MOVEMENT = 2,
  FIRST_ACTION = 3,
  ENERGY_EXPLANATION = 4,
  HEALTH_EXPLANATION = 5,
  SCENE_NAVIGATION = 6,
  SESSION_START = 7,
  COMPLETED = 99,
}

/**
 * Tutorial step constraints.
 */
export const TUTORIAL_STEP_CONSTRAINTS = {
  MIN_STEP: TutorialStepValue.NOT_STARTED,
  MAX_STEP: TutorialStepValue.COMPLETED,
  FIRST_STEP: TutorialStepValue.WELCOME,
} as const;

/**
 * TutorialStep value object class.
 * Immutable - once created, cannot be modified.
 */
export class TutorialStep {
  private readonly _value: TutorialStepValue;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The tutorial step value
   */
  private constructor(value: TutorialStepValue) {
    this._value = value;
  }

  /**
   * Creates a TutorialStep from a numeric value.
   * Validates that the value is within acceptable range.
   * @param value The tutorial step value
   * @returns A new TutorialStep instance
   * @throws Error if validation fails
   */
  public static create(value: number): TutorialStep {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Tutorial step must be a valid number');
    }
    if (value < TUTORIAL_STEP_CONSTRAINTS.MIN_STEP) {
      throw new Error(`Tutorial step cannot be less than ${TUTORIAL_STEP_CONSTRAINTS.MIN_STEP}`);
    }
    if (value > TUTORIAL_STEP_CONSTRAINTS.MAX_STEP) {
      throw new Error(`Tutorial step cannot exceed ${TUTORIAL_STEP_CONSTRAINTS.MAX_STEP}`);
    }
    return new TutorialStep(value as TutorialStepValue);
  }

  /**
   * Reconstructs a TutorialStep from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The tutorial step value
   * @returns A new TutorialStep instance
   */
  public static reconstruct(value: number): TutorialStep {
    return new TutorialStep(value as TutorialStepValue);
  }

  /**
   * Creates the initial tutorial step (not started).
   * @returns A new TutorialStep instance at NOT_STARTED
   */
  public static start(): TutorialStep {
    return new TutorialStep(TutorialStepValue.NOT_STARTED);
  }

  /**
   * Creates the first tutorial step.
   * @returns A new TutorialStep instance at WELCOME
   */
  public static begin(): TutorialStep {
    return new TutorialStep(TutorialStepValue.WELCOME);
  }

  /**
   * Creates a completed tutorial step.
   * @returns A new TutorialStep instance at COMPLETED
   */
  public static complete(): TutorialStep {
    return new TutorialStep(TutorialStepValue.COMPLETED);
  }

  /**
   * Gets the tutorial step value.
   */
  public get value(): TutorialStepValue {
    return this._value;
  }

  /**
   * Gets the numeric value for database storage.
   */
  public get numericValue(): number {
    return this._value;
  }

  /**
   * Checks if tutorial has not started.
   */
  public get isNotStarted(): boolean {
    return this._value === TutorialStepValue.NOT_STARTED;
  }

  /**
   * Checks if tutorial is in progress.
   */
  public get isInProgress(): boolean {
    return this._value > TutorialStepValue.NOT_STARTED && this._value < TutorialStepValue.COMPLETED;
  }

  /**
   * Checks if tutorial has been completed.
   */
  public get isCompleted(): boolean {
    return this._value === TutorialStepValue.COMPLETED;
  }

  /**
   * Creates a new TutorialStep advanced to the next step.
   * Returns a new instance (immutable operation).
   * @returns A new TutorialStep instance at the next step
   */
  public next(): TutorialStep {
    if (this._value >= TutorialStepValue.COMPLETED) {
      return this;
    }
    return TutorialStep.create(this._value + 1);
  }

  /**
   * Creates a new TutorialStep at a specific step.
   * Returns a new instance (immutable operation).
   * @param step The step to advance to
   * @returns A new TutorialStep instance
   */
  public advanceTo(step: TutorialStepValue): TutorialStep {
    if (step < this._value) {
      throw new Error('Cannot advance to a previous tutorial step');
    }
    return TutorialStep.create(step);
  }

  /**
   * Resets tutorial to the beginning.
   * Returns a new instance (immutable operation).
   * @returns A new TutorialStep instance at NOT_STARTED
   */
  public reset(): TutorialStep {
    return TutorialStep.start();
  }

  /**
   * Checks equality with another TutorialStep.
   * @param other The other TutorialStep to compare
   * @returns true if values are equal
   */
  public equals(other: TutorialStep): boolean {
    if (!(other instanceof TutorialStep)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the TutorialStep.
   */
  public toString(): string {
    return TutorialStepValue[this._value] ?? `Step(${this._value})`;
  }
}