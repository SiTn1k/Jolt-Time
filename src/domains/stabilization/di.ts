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
} as const;

/**
 * Register all stabilization domain dependencies with the container.
 */
export function registerStabilizationDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseStabilizationRepository,
    () => new SupabaseStabilizationRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Mappers (Singleton - stateless)
  container.registerInstance(IssueMapper, new IssueMapper());
  container.registerInstance(ReportMapper, new ReportMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());
  container.registerInstance(StabilizationMapper, new StabilizationMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(IssueValidator, new IssueValidator());
  container.registerInstance(HealthValidator, new HealthValidator());
  container.registerInstance(ReportValidator, new ReportValidator());
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
} {
  const stabilizationRepository = new SupabaseStabilizationRepository();
  const issueMapper = new IssueMapper();
  const reportMapper = new ReportMapper();
  const snapshotMapper = new SnapshotMapper();
  const stabilizationMapper = new StabilizationMapper();
  const issueValidator = new IssueValidator();
  const healthValidator = new HealthValidator();
  const reportValidator = new ReportValidator();

  return {
    stabilizationRepository,
    issueMapper,
    reportMapper,
    snapshotMapper,
    stabilizationMapper,
    issueValidator,
    healthValidator,
    reportValidator,
  };
}
