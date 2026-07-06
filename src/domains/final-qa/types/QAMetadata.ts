/**
 * QA Metadata Type
 *
 * Defines the metadata structure for QA entities.
 * Metadata provides additional context for QA checks, snapshots, and reports.
 */

/**
 * Initial/empty QA metadata.
 */
export const INITIAL_QA_METADATA: QAMetadata = {
  checkType: undefined,
  moduleName: undefined,
  duration: undefined,
  errorMessage: undefined,
  stackTrace: undefined,
  testResults: undefined,
  coverageData: undefined,
  notes: undefined,
  tags: undefined,
  extra: undefined,
};

/**
 * QA metadata structure.
 * Provides additional context for QA entities.
 */
export interface QAMetadata {
  /** Type of check performed */
  checkType?: string;

  /** Name of the module checked */
  moduleName?: string;

  /** Duration of the check in milliseconds */
  duration?: number;

  /** Error message if check failed */
  errorMessage?: string;

  /** Stack trace if check failed */
  stackTrace?: string;

  /** Test results summary */
  testResults?: Record<string, unknown>;

  /** Code coverage data */
  coverageData?: Record<string, unknown>;

  /** Additional notes */
  notes?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Extra data */
  extra?: Record<string, unknown>;
}

/**
 * Constraints for QA metadata.
 */
export const QA_METADATA_CONSTRAINTS = {
  MAX_CHECK_TYPE_LENGTH: 64,
  MAX_MODULE_NAME_LENGTH: 128,
  MAX_ERROR_MESSAGE_LENGTH: 1024,
  MAX_NOTES_LENGTH: 2048,
  MAX_TAGS_COUNT: 20,
} as const;
