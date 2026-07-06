/**
 * Production Domain Dependency Injection Registration
 *
 * Registers all production domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseProductionRepository } from './repositories/SupabaseProductionRepository';
import { ProductionService } from './services/ProductionService';
import { CertificateMapper } from './mappers/CertificateMapper';
import { ChecklistMapper } from './mappers/ChecklistMapper';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { ProductionMapper } from './mappers/ProductionMapper';
import { CertificateValidator, ChecklistValidator, SnapshotValidator } from './validators';

/**
 * Production Domain DI configuration keys.
 */
export const PRODUCTION_TOKENS = {
  PRODUCTION_REPOSITORY: Symbol.for('SupabaseProductionRepository'),
  PRODUCTION_SERVICE: Symbol.for('ProductionService'),
  CERTIFICATE_MAPPER: Symbol.for('CertificateMapper'),
  CHECKLIST_MAPPER: Symbol.for('ChecklistMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  PRODUCTION_MAPPER: Symbol.for('ProductionMapper'),
  CERTIFICATE_VALIDATOR: Symbol.for('CertificateValidator'),
  CHECKLIST_VALIDATOR: Symbol.for('ChecklistValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
} as const;

/**
 * Register all production domain dependencies with the container.
 */
export function registerProductionDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(CertificateValidator, new CertificateValidator());
  container.registerInstance(ChecklistValidator, new ChecklistValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(CertificateMapper, new CertificateMapper());
  container.registerInstance(ChecklistMapper, new ChecklistMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());
  container.registerInstance(ProductionMapper, new ProductionMapper());

  // Repositories (Singleton for simplicity)
  container.register(SupabaseProductionRepository, { lifetime: Lifetime.Singleton });

  // Services (Singleton)
  container.register(ProductionService, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for production domain.
 * Creates and configures all production domain components.
 */
export function setupProductionDomain(): {
  productionRepository: SupabaseProductionRepository;
  productionService: ProductionService;
  certificateMapper: CertificateMapper;
  checklistMapper: ChecklistMapper;
  snapshotMapper: SnapshotMapper;
  productionMapper: ProductionMapper;
  certificateValidator: CertificateValidator;
  checklistValidator: ChecklistValidator;
  snapshotValidator: SnapshotValidator;
} {
  const certificateValidator = new CertificateValidator();
  const checklistValidator = new ChecklistValidator();
  const snapshotValidator = new SnapshotValidator();
  const certificateMapper = new CertificateMapper();
  const checklistMapper = new ChecklistMapper();
  const snapshotMapper = new SnapshotMapper();
  const productionMapper = new ProductionMapper();
  const productionRepository = new SupabaseProductionRepository();
  const productionService = new ProductionService(productionRepository);

  return {
    productionRepository,
    productionService,
    certificateMapper,
    checklistMapper,
    snapshotMapper,
    productionMapper,
    certificateValidator,
    checklistValidator,
    snapshotValidator,
  };
}
