/**
 * Final QA Domain Dependency Injection Registration
 *
 * Registers all Final QA domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseQARepository } from './repositories/SupabaseQARepository';
import { QAMapper } from './mappers/QAMapper';
import { CheckMapper } from './mappers/CheckMapper';
import { SnapshotMapper } from './mappers/SnapshotMapper';
import { ReportMapper } from './mappers/ReportMapper';
import { CheckValidator, SnapshotValidator, ReportValidator } from './validators';

/**
 * Final QA Domain DI configuration keys.
 */
export const FINAL_QA_TOKENS = {
  QA_REPOSITORY: Symbol.for('IQARepository'),
  QA_MAPPER: Symbol.for('QAMapper'),
  CHECK_MAPPER: Symbol.for('CheckMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),
  REPORT_MAPPER: Symbol.for('ReportMapper'),
  CHECK_VALIDATOR: Symbol.for('CheckValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
  REPORT_VALIDATOR: Symbol.for('ReportValidator'),
} as const;

/**
 * Register all Final QA domain dependencies with the container.
 */
export function registerFinalQADependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseQARepository,
    () => new SupabaseQARepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Mappers (Singleton - stateless)
  container.registerInstance(QAMapper, new QAMapper());
  container.registerInstance(CheckMapper, new CheckMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());
  container.registerInstance(ReportMapper, new ReportMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(CheckValidator, new CheckValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());
  container.registerInstance(ReportValidator, new ReportValidator());
}

/**
 * Quick setup function for Final QA domain.
 * Creates and configures all Final QA domain components.
 */
export function setupFinalQADomain(): {
  qaRepository: SupabaseQARepository;
  qaMapper: QAMapper;
  checkMapper: CheckMapper;
  snapshotMapper: SnapshotMapper;
  reportMapper: ReportMapper;
  checkValidator: CheckValidator;
  snapshotValidator: SnapshotValidator;
  reportValidator: ReportValidator;
} {
  const qaRepository = new SupabaseQARepository();
  const qaMapper = new QAMapper();
  const checkMapper = new CheckMapper();
  const snapshotMapper = new SnapshotMapper();
  const reportMapper = new ReportMapper();
  const checkValidator = new CheckValidator();
  const snapshotValidator = new SnapshotValidator();
  const reportValidator = new ReportValidator();

  return {
    qaRepository,
    qaMapper,
    checkMapper,
    snapshotMapper,
    reportMapper,
    checkValidator,
    snapshotValidator,
    reportValidator,
  };
}
