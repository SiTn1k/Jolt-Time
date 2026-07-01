// ═══════════════════════════════════════════════════════════════════════
// ERROR HANDLING & CRASH REPORTING
// Simplified version without Sentry (optional feature)
// ═══════════════════════════════════════════════════════════════════════

// Feature flag for error reporting
const ERROR_REPORTING_ENABLED = import.meta.env.VITE_SENTRY_DSN && import.meta.env.VITE_ENV === 'production';

// Initialize Sentry (placeholder - Sentry not installed)
export function initializeErrorReporting() {
  if (!ERROR_REPORTING_ENABLED) {
    console.log('[ErrorHandling] Error reporting disabled');
    return;
  }
  console.log('[ErrorHandling] Error reporting enabled (Sentry not configured)');
}

// Capture React errors
export function captureReactError(error: Error, errorInfo: React.ErrorInfo) {
  console.error('[React Error]', error, errorInfo);
}

// Capture promise rejections
export function captureUnhandledRejection(reason: unknown) {
  console.error('[Unhandled Promise Rejection]', reason);
}

// Capture Edge Function errors
export function captureEdgeFunctionError(functionName: string, error: Error, context?: Record<string, unknown>) {
  console.error(`[EdgeFunction:${functionName}]`, error, context);
}

// Capture game-specific errors
export function captureGameError(errorType: string, error: Error, details?: Record<string, unknown>) {
  console.error(`[GameError:${errorType}]`, error, details);
}

// Set user context (no-op without Sentry)
export function setUserContext(_telegramId: number, _userId: string) {
  // Placeholder - Sentry not configured
}

// Clear user context (no-op without Sentry)
export function clearUserContext() {
  // Placeholder - Sentry not configured
}

// Add breadcrumb for game events (no-op without Sentry)
export function addGameBreadcrumb(_category: string, _message: string, _data?: Record<string, unknown>) {
  // Placeholder - Sentry not configured
}

// ErrorBoundary placeholder
export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => children;
