/**
 * Circuit Breaker
 *
 * Fault tolerance pattern implementation for external service calls.
 * Prevents cascading failures by monitoring and controlling access to external services.
 *
 * IMPORTANT: Circuit Breaker is a FAULT TOLERANCE pattern. It ONLY:
 * - Monitors service health
 * - Controls access to services
 * - Tracks failure counts
 * - Implements state transitions
 *
 * Circuit Breaker MUST NEVER:
 * - Modify business logic
 * - Grant rewards
 * - Modify balances
 * - Execute game logic
 */

/**
 * Circuit breaker states.
 */
export type CircuitBreakerState = 'closed' | 'open' | 'half_open';

/**
 * Circuit breaker event types.
 */
export type CircuitBreakerEvent = 'success' | 'failure' | 'timeout' | 'state_change';

/**
 * Circuit breaker event data.
 */
export interface CircuitBreakerEventData {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  lastFailure?: Error;
}

/**
 * Circuit breaker configuration.
 */
export interface CircuitBreakerConfig {
  /** Failure threshold to open circuit */
  failureThreshold?: number;
  /** Success threshold in half-open to close circuit */
  successThreshold?: number;
  /** Time in milliseconds to wait before transitioning to half-open */
  openTimeoutMs?: number;
  /** Time in milliseconds to wait for operation */
  timeoutMs?: number;
  /** Whether to reset failure count on success */
  resetFailureCountOnSuccess?: boolean;
  /** Volume threshold for half-open transition */
  volumeThreshold?: number;
}

/**
 * Circuit breaker statistics.
 */
export interface CircuitBreakerStats {
  /** Current state */
  state: CircuitBreakerState;
  /** Number of failures since last state change */
  failureCount: number;
  /** Number of successes since last state change */
  successCount: number;
  /** Total number of successful calls */
  totalSuccesses: number;
  /** Total number of failed calls */
  totalFailures: number;
  /** Timestamp of last state change */
  lastStateChangeAt: Date | null;
  /** Timestamp of last failure */
  lastFailureAt: Date | null;
  /** Timestamp of last success */
  lastSuccessAt: Date | null;
  /** Whether the circuit is currently allowing requests */
  isRequestAllowed: boolean;
}

/**
 * Circuit breaker result.
 */
export interface CircuitBreakerResult<T> {
  /** Whether the operation was allowed */
  allowed: boolean;
  /** Result data if allowed and successful */
  data?: T;
  /** Error if operation failed */
  error?: Error;
  /** Whether the operation succeeded */
  success: boolean;
}

/**
 * Circuit breaker state change listener.
 */
export type CircuitBreakerListener = (event: CircuitBreakerEvent, data: CircuitBreakerEventData) => void;

/**
 * Default circuit breaker configuration.
 */
export const DEFAULT_CIRCUIT_BREAKER_CONFIG: Required<CircuitBreakerConfig> = {
  failureThreshold: 5,
  successThreshold: 3,
  openTimeoutMs: 30000,
  timeoutMs: 10000,
  resetFailureCountOnSuccess: true,
  volumeThreshold: 10,
};

/**
 * Circuit Breaker implementation.
 * Implements the circuit breaker pattern for fault tolerance.
 */
export class CircuitBreaker {
  private readonly name: string;
  private state: CircuitBreakerState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private totalSuccesses = 0;
  private totalFailures = 0;
  private lastStateChangeAt: Date | null = null;
  private lastFailureAt: Date | null = null;
  private lastSuccessAt: Date | null = null;
  private readonly config: Required<CircuitBreakerConfig>;
  private readonly listeners: Set<CircuitBreakerListener> = new Set();

  /**
   * Creates a new Circuit Breaker.
   */
  constructor(name: string, config?: CircuitBreakerConfig) {
    this.name = name;
    this.config = { ...DEFAULT_CIRCUIT_BREAKER_CONFIG, ...config };
  }

  /**
   * Gets the current state.
   */
  getState(): CircuitBreakerState {
    this.ensureOpenTimeoutTransition();
    return this.state;
  }

  /**
   * Checks if requests are currently allowed.
   */
  isRequestAllowed(): boolean {
    this.ensureOpenTimeoutTransition();
    return this.state !== 'open';
  }

  /**
   * Gets circuit breaker statistics.
   */
  getStats(): CircuitBreakerStats {
    this.ensureOpenTimeoutTransition();
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalSuccesses: this.totalSuccesses,
      totalFailures: this.totalFailures,
      lastStateChangeAt: this.lastStateChangeAt,
      lastFailureAt: this.lastFailureAt,
      lastSuccessAt: this.lastSuccessAt,
      isRequestAllowed: this.state !== 'open',
    };
  }

  /**
   * Records a successful operation.
   */
  recordSuccess(): void {
    this.lastSuccessAt = new Date();
    this.totalSuccesses++;

    if (this.state === 'half_open') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.transitionTo('closed');
      }
    } else if (this.state === 'closed') {
      this.failureCount = 0;
    }

    this.emit('success', { state: this.state, failureCount: this.failureCount, successCount: this.successCount });
  }

  /**
   * Records a failed operation.
   */
  recordFailure(error?: Error): void {
    this.lastFailureAt = new Date();
    this.lastFailure = error;
    this.totalFailures++;
    this.failureCount++;

    if (this.state === 'half_open') {
      this.transitionTo('open');
    } else if (this.state === 'closed') {
      if (this.failureCount >= this.config.failureThreshold) {
        this.transitionTo('open');
      }
    }

    this.emit('failure', { 
      state: this.state, 
      failureCount: this.failureCount, 
      successCount: this.successCount,
      lastFailure: error,
    });
  }

  /**
   * Records a timeout.
   */
  recordTimeout(): void {
    this.recordFailure(new Error('Operation timed out'));
    this.emit('timeout', { state: this.state, failureCount: this.failureCount, successCount: this.successCount });
  }

  /**
   * Executes an operation with circuit breaker protection.
   */
  async execute<T>(operation: () => Promise<T>): Promise<CircuitBreakerResult<T>> {
    if (!this.isRequestAllowed()) {
      return {
        allowed: false,
        success: false,
        error: new Error(`Circuit breaker is open for: ${this.name}`),
      };
    }

    try {
      const result = await this.executeWithTimeout(operation);
      this.recordSuccess();
      return {
        allowed: true,
        data: result,
        success: true,
      };
    } catch (err) {
      this.recordFailure(err as Error);
      return {
        allowed: true,
        success: false,
        error: err as Error,
      };
    }
  }

  /**
   * Executes operation with timeout.
   */
  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, this.config.timeoutMs);

      operation()
        .then((result) => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch((err) => {
          clearTimeout(timeout);
          reject(err);
        });
    });
  }

  /**
   * Transitions to a new state.
   */
  private transitionTo(newState: CircuitBreakerState): void {
    const previousState = this.state;
    this.state = newState;
    this.lastStateChangeAt = new Date();

    if (newState === 'closed') {
      this.failureCount = 0;
      this.successCount = 0;
    } else if (newState === 'half_open') {
      this.successCount = 0;
    } else if (newState === 'open') {
      this.failureCount = 0;
    }

    this.emit('state_change', { 
      state: newState, 
      failureCount: this.failureCount, 
      successCount: this.successCount,
    });
  }

  /**
   * Ensures transition from open to half-open after timeout.
   */
  private ensureOpenTimeoutTransition(): void {
    if (this.state === 'open' && this.lastStateChangeAt) {
      const timeSinceTransition = Date.now() - this.lastStateChangeAt.getTime();
      if (timeSinceTransition >= this.config.openTimeoutMs) {
        this.transitionTo('half_open');
      }
    }
  }

  /**
   * Adds a listener for circuit breaker events.
   */
  addListener(listener: CircuitBreakerListener): void {
    this.listeners.add(listener);
  }

  /**
   * Removes a listener.
   */
  removeListener(listener: CircuitBreakerListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Emits an event to all listeners.
   */
  private emit(event: CircuitBreakerEvent, data: CircuitBreakerEventData): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch {
        // Ignore listener errors
      }
    }
  }

  /**
   * Resets the circuit breaker to initial state.
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastStateChangeAt = new Date();
    this.lastFailureAt = null;
    this.lastSuccessAt = null;
  }

  /**
   * Gets the name of this circuit breaker.
   */
  getName(): string {
    return this.name;
  }

  private lastFailure?: Error;
}

/**
 * Circuit Breaker Registry.
 * Manages multiple circuit breakers.
 */
export class CircuitBreakerRegistry {
  private readonly circuitBreakers: Map<string, CircuitBreaker> = new Map();

  /**
   * Gets or creates a circuit breaker.
   */
  getOrCreate(name: string, config?: CircuitBreakerConfig): CircuitBreaker {
    let circuitBreaker = this.circuitBreakers.get(name);
    if (!circuitBreaker) {
      circuitBreaker = new CircuitBreaker(name, config);
      this.circuitBreakers.set(name, circuitBreaker);
    }
    return circuitBreaker;
  }

  /**
   * Gets a circuit breaker by name.
   */
  get(name: string): CircuitBreaker | undefined {
    return this.circuitBreakers.get(name);
  }

  /**
   * Removes a circuit breaker.
   */
  remove(name: string): void {
    this.circuitBreakers.delete(name);
  }

  /**
   * Gets all circuit breaker statistics.
   */
  getAllStats(): Map<string, CircuitBreakerStats> {
    const stats = new Map<string, CircuitBreakerStats>();
    for (const [name, cb] of this.circuitBreakers) {
      stats.set(name, cb.getStats());
    }
    return stats;
  }

  /**
   * Resets all circuit breakers.
   */
  resetAll(): void {
    for (const cb of this.circuitBreakers.values()) {
      cb.reset();
    }
  }
}

/**
 * Global circuit breaker registry instance.
 */
let globalRegistry: CircuitBreakerRegistry | null = null;

/**
 * Gets the global circuit breaker registry.
 */
export function getCircuitBreakerRegistry(): CircuitBreakerRegistry {
  if (!globalRegistry) {
    globalRegistry = new CircuitBreakerRegistry();
  }
  return globalRegistry;
}
