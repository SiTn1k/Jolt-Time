/**
 * Stabilization Domain Dependency Injection Registration
 *
 * Registers all stabilization domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseStabilizationRepository } from './repositories/SupabaseStabilizationRepository';
import { IssueMapper } from './mappers/IssueMapper';
import { ReportMapper } from './mappers/ReportMapper';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { StabilizationMapper } from './mappers/StabilizationMapper';
import { IssueValidator } from './validators/IssueValidator';
import { HealthValidator } from './validators/HealthValidator';
import { ReportValidator } from './validators/ReportValidator';
import { StabilizationService } from './services/StabilizationService';
import { HealthScanner } from './services/HealthScanner';
import { DependencyValidation } from './services/DependencyValidation';
import { RepositoryValidation } from './services/RepositoryValidation';
import { SystemValidation } from './services/SystemValidation';

/**
 * Stabilization Domain DI configuration keys.
 */
export const STABILIZATION_TOKENS = {
  STABILIZATION_REPOSITORY: Symbol.for('IStabilizationRepository'),
  ISSUE_MAPPER: Symbol.for('IssueMapper'),
  REPORT_MAPPER: Symbol.for('ReportMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  STABILIZATION_MAPPER: Symbol.for('StabilizationMapper'),
  ISSUE_VALIDATOR: Symbol.for('IssueValidator'),
  HEALTH_VALIDATOR: Symbol.for('HealthValidator'),
  REPORT_VALIDATOR: Symbol.for('ReportValidator'),
  STABILIZATION_SERVICE: Symbol.for('StabilizationService'),
  HEALTH_SCANNER: Symbol.for('HealthScanner'),
  DEPENDENCY_VALIDATION: Symbol.for('DependencyValidation'),
  REPOSITORY_VALIDATION: Symbol.for('RepositoryValidation'),
  SYSTEM_VALIDATION: Symbol.for('SystemValidation'),
} as const;

/**
 * Register all stabilization domain dependencies with the container.
 */
export function registerStabilizationDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.register(SupabaseStabilizationRepository, { lifetime: Lifetime.Scoped });

  // Mappers (Singleton - stateless)
  container.registerInstance(IssueMapper, new IssueMapper());
  container.registerInstance(ReportMapper, new ReportMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());
  container.registerInstance(StabilizationMapper, new StabilizationMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(IssueValidator, new IssueValidator());
  container.registerInstance(HealthValidator, new HealthValidator());
  container.registerInstance(ReportValidator, new ReportValidator());

  // Services (Singleton - stateful but single instance)
  container.register(StabilizationService, { lifetime: Lifetime.Singleton });
  container.register(HealthScanner, { lifetime: Lifetime.Singleton });
  container.register(DependencyValidation, { lifetime: Lifetime.Singleton });
  container.register(RepositoryValidation, { lifetime: Lifetime.Singleton });
  container.register(SystemValidation, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for stabilization domain.
 * Creates and configures all stabilization domain components.
 */
export function setupStabilizationDomain(): {
  stabilizationRepository: SupabaseStabilizationRepository;
  issueMapper: IssueMapper;
  reportMapper: ReportMapper;
  snapshotMapper: SnapshotMapper;
  stabilizationMapper: StabilizationMapper;
  issueValidator: IssueValidator;
  healthValidator: HealthValidator;
  reportValidator: ReportValidator;
  stabilizationService: StabilizationService;
  healthScanner: HealthScanner;
  dependencyValidation: DependencyValidation;
  repositoryValidation: RepositoryValidation;
  systemValidation: SystemValidation;
} {
  const stabilizationRepository = new SupabaseStabilizationRepository();
  const issueMapper = new IssueMapper();
  const reportMapper = new ReportMapper();
  const snapshotMapper = new SnapshotMapper();
  const stabilizationMapper = new StabilizationMapper();
  const issueValidator = new IssueValidator();
  const healthValidator = new HealthValidator();
  const reportValidator = new ReportValidator();
  const stabilizationService = new StabilizationService(stabilizationRepository);
  const healthScanner = new HealthScanner();
  const dependencyValidation = new DependencyValidation();
  const repositoryValidation = new RepositoryValidation();
  const systemValidation = new SystemValidation();

  return {
    stabilizationRepository,
    issueMapper,
    reportMapper,
    snapshotMapper,
    stabilizationMapper,
    issueValidator,
    healthValidator,
    reportValidator,
    stabilizationService,
    healthScanner,
    dependencyValidation,
    repositoryValidation,
    systemValidation,
  };
}
