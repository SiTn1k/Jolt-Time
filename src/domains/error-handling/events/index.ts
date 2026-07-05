/**
 * Error Handling Events
 *
 * Exports all events for the error-handling domain.
 */

export type { SystemErrorCreatedEvent, SystemErrorCreatedEventData } from './SystemErrorCreated.event';
export type { CriticalErrorDetectedEvent, CriticalErrorDetectedEventData } from './CriticalErrorDetected.event';
export type { ErrorArchivedEvent, ErrorArchivedEventData } from './ErrorArchived.event';

export { createSystemErrorCreatedEvent } from './SystemErrorCreated.event';
export { createCriticalErrorDetectedEvent } from './CriticalErrorDetected.event';
export { createErrorArchivedEvent } from './ErrorArchived.event';
