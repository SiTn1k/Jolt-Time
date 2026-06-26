/**
 * Logger Service
 *
 * Structured logging service with multiple log levels and transports.
 */

import { LogLevel, APP_NAME, APP_VERSION } from '../../shared/constants';
import type { ILogger } from '../../shared/types';

/**
 * Log entry structure.
 */
export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  levelName: string;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  appName: string;
  appVersion: string;
  traceId?: string;
}

/**
 * Log transport interface.
 */
export interface ILogTransport {
  log(entry: LogEntry): void;
}

/**
 * Console transport for development.
 */
class ConsoleTransport implements ILogTransport {
  private readonly minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.DEBUG) {
    this.minLevel = minLevel;
  }

  log(entry: LogEntry): void {
    if (entry.level < this.minLevel) return;

    const prefix = `[${entry.timestamp.toISOString()}] [${entry.levelName}]`;
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? `\n${entry.error.stack}` : '';

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ${entry.message}${contextStr}${errorStr}`);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${entry.message}${contextStr}${errorStr}`);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${entry.message}${contextStr}${errorStr}`);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`${prefix} ${entry.message}${contextStr}${errorStr}`);
        break;
    }
  }
}

/**
 * Production logger implementation.
 */
export class Logger implements ILogger {
  private readonly transports: ILogTransport[];
  private readonly minLevel: LogLevel;
  private readonly traceIdHeader: string;

  constructor(options: {
    transports?: ILogTransport[];
    minLevel?: LogLevel;
    traceIdHeader?: string;
  } = {}) {
    this.transports = options.transports || [new ConsoleTransport(options.minLevel)];
    this.minLevel = options.minLevel || LogLevel.DEBUG;
    this.traceIdHeader = options.traceIdHeader || 'x-trace-id';
  }

  /**
   * Create a child logger with additional context.
   */
  child(context: Record<string, unknown>): ChildLogger {
    return new ChildLogger(this, context);
  }

  /**
   * Generate trace ID.
   */
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Create log entry.
   */
  private createEntry(
    level: LogLevel,
    levelName: string,
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: new Date(),
      level,
      levelName,
      message,
      context,
      error,
      appName: APP_NAME,
      appVersion: APP_VERSION,
      traceId: this.generateTraceId(),
    };
  }

  /**
   * Log debug message.
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.minLevel > LogLevel.DEBUG) return;
    const entry = this.createEntry(LogLevel.DEBUG, 'DEBUG', message, undefined, context);
    this.transports.forEach((t) => t.log(entry));
  }

  /**
   * Log info message.
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.minLevel > LogLevel.INFO) return;
    const entry = this.createEntry(LogLevel.INFO, 'INFO', message, undefined, context);
    this.transports.forEach((t) => t.log(entry));
  }

  /**
   * Log warning message.
   */
  warn(message: string, context?: Record<string, unknown>): void {
    if (this.minLevel > LogLevel.WARN) return;
    const entry = this.createEntry(LogLevel.WARN, 'WARN', message, undefined, context);
    this.transports.forEach((t) => t.log(entry));
  }

  /**
   * Log error message.
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.minLevel > LogLevel.ERROR) return;
    const entry = this.createEntry(LogLevel.ERROR, 'ERROR', message, error, context);
    this.transports.forEach((t) => t.log(entry));
  }

  /**
   * Log fatal message.
   */
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createEntry(LogLevel.FATAL, 'FATAL', message, error, context);
    this.transports.forEach((t) => t.log(entry));
  }
}

/**
 * Child logger with inherited context.
 */
class ChildLogger implements ILogger {
  private readonly parent: Logger;
  private readonly context: Record<string, unknown>;

  constructor(parent: Logger, context: Record<string, unknown>) {
    this.parent = parent;
    this.context = context;
  }

  private mergeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!context) return this.context;
    return { ...this.context, ...context };
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.parent.debug(message, this.mergeContext(context));
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.parent.info(message, this.mergeContext(context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.parent.warn(message, this.mergeContext(context));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.parent.error(message, error, this.mergeContext(context));
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.parent.fatal(message, error, this.mergeContext(context));
  }
}

/**
 * Global logger instance.
 */
let globalLogger: Logger | null = null;

/**
 * Initialize the global logger.
 */
export function initializeLogger(options?: {
  transports?: ILogTransport[];
  minLevel?: LogLevel;
}): Logger {
  globalLogger = new Logger(options);
  return globalLogger;
}

/**
 * Get the global logger instance.
 */
export function getLogger(): Logger {
  if (!globalLogger) {
    // Create default logger with console transport
    globalLogger = new Logger({
      transports: [new ConsoleTransport(LogLevel.DEBUG)],
      minLevel: LogLevel.DEBUG,
    });
  }
  return globalLogger;
}

/**
 * Create a logger for a specific module.
 */
export function createLogger(moduleName: string): ILogger {
  return getLogger().child({ module: moduleName });
}
