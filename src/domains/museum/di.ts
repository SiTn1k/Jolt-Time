/**
 * Museum Domain Dependency Injection Registration
 *
 * Registers all museum domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseMuseumRepository } from './repositories/SupabaseMuseumRepository';
import { MuseumMapper } from './mappers/MuseumMapper';
import { HallMapper } from './mappers/HallMapper';
import { ExhibitMapper } from './mappers/ExhibitMapper';
import { MuseumValidator, HallValidator, ExhibitValidator } from './validators';

/**
 * Museum Domain DI configuration keys.
 */
export const MUSEUM_TOKENS = {
  MUSEUM_REPOSITORY: Symbol.for('SupabaseMuseumRepository'),
  MUSEUM_MAPPER: Symbol.for('MuseumMapper'),
  HALL_MAPPER: Symbol.for('HallMapper'),
  EXHIBIT_MAPPER: Symbol.for('ExhibitMapper'),
  MUSEUM_VALIDATOR: Symbol.for('MuseumValidator'),
  HALL_VALIDATOR: Symbol.for('HallValidator'),
  EXHIBIT_VALIDATOR: Symbol.for('ExhibitValidator'),
} as const;

/**
 * Register all museum domain dependencies with the container.
 */
export function registerMuseumDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(MuseumValidator, new MuseumValidator());
  container.registerInstance(HallValidator, new HallValidator());
  container.registerInstance(ExhibitValidator, new ExhibitValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(MuseumMapper, new MuseumMapper());
  container.registerInstance(HallMapper, new HallMapper());
  container.registerInstance(ExhibitMapper, new ExhibitMapper());

  // Repository (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseMuseumRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for museum domain.
 * Creates and configures all museum domain components.
 */
export function setupMuseumDomain(): {
  museumRepository: SupabaseMuseumRepository;
  museumMapper: MuseumMapper;
  hallMapper: HallMapper;
  exhibitMapper: ExhibitMapper;
  museumValidator: MuseumValidator;
  hallValidator: HallValidator;
  exhibitValidator: ExhibitValidator;
} {
  const museumValidator = new MuseumValidator();
  const hallValidator = new HallValidator();
  const exhibitValidator = new ExhibitValidator();
  const museumMapper = new MuseumMapper();
  const hallMapper = new HallMapper();
  const exhibitMapper = new ExhibitMapper();
  const museumRepository = new SupabaseMuseumRepository();

  return {
    museumRepository,
    museumMapper,
    hallMapper,
    exhibitMapper,
    museumValidator,
    hallValidator,
    exhibitValidator,
  };
}
