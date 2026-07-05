/**
 * Optimization Metadata
 *
 * Defines metadata structure for optimization entities.
 */

/**
 * Metadata for optimization entities.
 */
export interface OptimizationMetadata {
  /** Module path or identifier */
  modulePath?: string;

  /** Function or method name */
  functionName?: string;

  /** API endpoint if applicable */
  endpoint?: string;

  /** File path if applicable */
  filePath?: string;

  /** Line number if applicable */
  lineNumber?: number;

  /** Tags for categorization */
  tags?: string[];

  /** Additional custom metadata */
  [key: string]: unknown;
}

/**
 * Initial/default optimization metadata.
 */
export const INITIAL_OPTIMIZATION_METADATA: OptimizationMetadata = {};
