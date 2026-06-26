/**
 * Logging Index
 *
 * Central export for logging system.
 */

export { Logger, initializeLogger, getLogger, createLogger } from './logger.service';
export type { LogEntry, ILogTransport } from './logger.service';
