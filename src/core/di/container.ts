/**
 * Dependency Injection Container
 *
 * Lightweight DI container for managing service dependencies.
 */

/**
 * Lifetime scope for registered services.
 */
export enum Lifetime {
  /**
   * Single instance per container.
   */
  Singleton = 'singleton',
  /**
   * New instance each time.
   */
  Transient = 'transient',
  /**
   * One instance per request/scope.
   */
  Scoped = 'scoped',
}

/**
 * Service registration options.
 */
interface Registration<T> {
  service: new (...args: never[]) => T;
  instance?: T;
  factory?: (...args: never[]) => T;
  lifetime: Lifetime;
  tags?: string[];
}

/**
 * Dependency injection container.
 */
export class Container {
  private readonly registrations = new Map<new (...args: never[]) => unknown, Registration<unknown>>();
  private readonly instances = new Map<new (...args: never[]) => unknown, unknown>();
  private readonly scopedInstances = new Map<new (...args: never[]) => unknown, unknown>();

  /**
   * Register a service.
   */
  register<T>(
    service: new (...args: never[]) => T,
    options: {
      lifetime?: Lifetime;
      tags?: string[];
    } = {}
  ): Container {
    this.registrations.set(service as new (...args: never[]) => unknown, {
      service: service as new (...args: never[]) => unknown,
      lifetime: options.lifetime || Lifetime.Singleton,
      tags: options.tags,
    } as Registration<unknown>);
    return this;
  }

  /**
   * Register a singleton instance.
   */
  registerInstance<T>(service: new (...args: never[]) => T, instance: T): Container {
    this.registrations.set(service as new (...args: never[]) => unknown, {
      service: service as new (...args: never[]) => unknown,
      instance,
      lifetime: Lifetime.Singleton,
    } as Registration<unknown>);
    return this;
  }

  /**
   * Register with factory function.
   */
  registerFactory<T>(
    service: new (...args: never[]) => T,
    factory: (...args: never[]) => T,
    options: {
      lifetime?: Lifetime;
      tags?: string[];
    } = {}
  ): Container {
    this.registrations.set(service as new (...args: never[]) => unknown, {
      service: service as new (...args: never[]) => unknown,
      factory: factory as (...args: never[]) => unknown,
      lifetime: options.lifetime || Lifetime.Singleton,
      tags: options.tags,
    } as Registration<unknown>);
    return this;
  }

  /**
   * Check if service is registered.
   */
  isRegistered<T>(service: new (...args: never[]) => T): boolean {
    return this.registrations.has(service as new (...args: never[]) => unknown);
  }

  /**
   * Get a service instance.
   */
  resolve<T>(service: new (...args: never[]) => T): T {
    const registration = this.registrations.get(service as new (...args: never[]) => unknown) as Registration<T> | undefined;

    if (!registration) {
      throw new Error(`Service not registered: ${service.name}`);
    }

    switch (registration.lifetime) {
      case Lifetime.Singleton:
        return this.resolveSingleton(service, registration);
      case Lifetime.Transient:
        return this.resolveTransient(service, registration);
      case Lifetime.Scoped:
        return this.resolveScoped(service, registration);
    }
  }

  /**
   * Create a scoped container for request scope.
   */
  createScope(): ScopedContainer {
    return new ScopedContainer(this);
  }

  /**
   * Clear all registrations and instances.
   */
  reset(): void {
    this.registrations.clear();
    this.instances.clear();
    this.scopedInstances.clear();
  }

  /**
   * Resolve singleton instance.
   */
  private resolveSingleton<T>(service: new (...args: never[]) => T, registration: Registration<T>): T {
    const key = service as new (...args: never[]) => unknown;
    if (!this.instances.has(key)) {
      this.instances.set(key, this.createInstance(service, registration));
    }
    return this.instances.get(key) as T;
  }

  /**
   * Resolve transient instance.
   */
  private resolveTransient<T>(service: new (...args: never[]) => T, registration: Registration<T>): T {
    return this.createInstance(service, registration);
  }

  /**
   * Resolve scoped instance.
   */
  private resolveScoped<T>(service: new (...args: never[]) => T, registration: Registration<T>): T {
    const key = service as new (...args: never[]) => unknown;
    if (!this.scopedInstances.has(key)) {
      this.scopedInstances.set(key, this.createInstance(service, registration));
    }
    return this.scopedInstances.get(key) as T;
  }

  /**
   * Create a new instance using constructor or factory.
   */
  private createInstance<T>(service: new (...args: never[]) => T, registration: Registration<T>): T {
    if (registration.instance !== undefined) {
      return registration.instance;
    }

    if (registration.factory) {
      return registration.factory() as T;
    }

    return new service();
  }

  /**
   * Clear scoped instances.
   */
  clearScope(): void {
    this.scopedInstances.clear();
  }
}

/**
 * Scoped container for request-scoped dependencies.
 */
export class ScopedContainer {
  private readonly parent: Container;

  constructor(parent: Container) {
    this.parent = parent;
  }

  /**
   * Get a service from the parent container.
   */
  resolve<T>(service: new (...args: never[]) => T): T {
    return this.parent.resolve(service);
  }

  /**
   * Create a child scope.
   */
  createScope(): ScopedContainer {
    return this.parent.createScope();
  }

  /**
   * Clear this scope's instances.
   */
  reset(): void {
    this.parent.clearScope();
  }
}

/**
 * Global container instance.
 */
let globalContainer: Container | null = null;

/**
 * Initialize the global container.
 */
export function initializeContainer(): Container {
  globalContainer = new Container();
  return globalContainer;
}

/**
 * Get the global container.
 */
export function getContainer(): Container {
  if (!globalContainer) {
    globalContainer = initializeContainer();
  }
  return globalContainer;
}
