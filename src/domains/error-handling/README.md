# Error Handling Domain

## Overview

The Error Handling Domain provides a centralized error management layer for Jolt Time. This foundation stores errors, categories, and contexts - it NEVER modifies gameplay, retries operations, grants rewards, or modifies balances/inventory.

## Architecture

```
src/domains/error-handling/
├── entities/           # Domain entities (SystemError, ErrorCategory, ErrorContext)
├── repositories/        # Data access layer (SupabaseErrorRepository)
├── services/            # ErrorHandlingService, GlobalExceptionHandler, HTTPErrorResponseService
├── dto/                 # Data Transfer Objects
├── mappers/             # Entity-DTO mappers (only mapping, no logic)
├── validators/           # Input validation
├── events/              # Domain events
├── types/               # Type definitions
├── interfaces/          # Abstract interfaces
├── value-objects/       # Immutable value objects
├── tests/               # Unit tests
├── di.ts                # Dependency injection
└── index.ts            # Module exports
```

## Core Entities

### SystemError
Stores error information including:
- Error ID (UUID)
- Error code
- Category (UI, Validation, Service, Repository, API, Database, Telegram, ExternalService, System, Security, Configuration, Network)
- Severity (Info, Warning, Error, Critical, Fatal)
- Message
- Stack trace (optional)
- Metadata
- Status (New, Investigating, Acknowledged, Resolved, Archived, Ignored)

### ErrorCategory
Stores category definitions:
- Category ID
- Name
- Description
- Category Type
- Metadata
- Active status

### ErrorContext
Stores error context:
- Context ID (UUID)
- Service name
- Operation name
- Request ID (optional)
- Actor ID (optional)
- Metadata

## Services

### ErrorHandlingService
Central service for capturing, classifying, and responding to errors.
- `captureError()` - Captures and stores an error
- `createContext()` - Creates error context for tracking
- `classifyError()` - Classifies error into categories
- `buildErrorResponse()` - Builds standardized error response
- `getSystemSummary()` - Gets error statistics

### GlobalExceptionHandler
Routes all exceptions through ErrorHandlingService.
- `handleException()` - Handles async exceptions
- `handleSync()` - Handles sync exceptions
- `wrapAsync()` - Wraps async functions with error handling
- `wrapSync()` - Wraps sync functions with error handling

### HTTPErrorResponseService
Centralized HTTP error response handling.
- `badRequest()` - 400
- `unauthorized()` - 401
- `forbidden()` - 403
- `notFound()` - 404
- `conflict()` - 409
- `unprocessableEntity()` - 422
- `tooManyRequests()` - 429
- `internalError()` - 500
- `serviceUnavailable()` - 503

## Key Principle

**Error Handling NEVER modifies gameplay**

This domain ONLY:
- Stores errors
- Stores categories
- Stores contexts
- Emits events
- Builds error responses
- Integrates with monitoring
- Integrates with audit

This domain does NOT:
- Retry operations
- Modify gameplay
- Grant rewards
- Modify balances
- Modify inventory
- Restart services
- Send notifications (PagerDuty, Slack, Email)

## Error Classification

| Classification | Description |
|----------------|-------------|
| BusinessError | Business logic rule violations |
| ValidationError | Input validation failures |
| RepositoryError | Data access failures |
| ExternalProviderError | Third-party service failures |
| ConfigurationError | Configuration-related failures |
| InternalError | Unknown internal failures |
| CriticalError | Critical system failures |

## Error Severity Levels

| Level | Description |
|-------|-------------|
| Info | Informational message - no action required |
| Warning | Warning condition - may require attention |
| Error | Error condition - something failed |
| Critical | Critical condition - immediate attention required |
| Fatal | Fatal condition - system cannot continue |

## Error Categories

| Category | Description |
|----------|-------------|
| UI | User interface and rendering issues |
| Validation | Input validation failures |
| Service | Business logic failures |
| Repository | Data access failures |
| API | External API communication failures |
| Database | Supabase and database failures |
| Telegram | Telegram API failures |
| ExternalService | Third-party service failures |
| System | Internal system failures |
| Security | Security-related failures |
| Configuration | Configuration-related failures |
| Network | Network connectivity failures |

## Error Status Flow

```
New → Investigating → Acknowledged → Resolved → Archived
                  ↓                    ↓
               Ignored              (reopened)
```

## Events

- `SystemErrorCreated` - Emitted when a new error is created
- `CriticalErrorDetected` - Emitted when a critical/fatal error is detected
- `ErrorArchived` - Emitted when an error is archived

## Dependency Injection

```typescript
import { registerErrorHandlingDependencies, ERROR_HANDLING_TOKENS } from './domains/error-handling/di';

// Register with DI container
registerErrorHandlingDependencies(container);

// Or use quick setup
import { setupErrorHandlingDomain } from './domains/error-handling/di';
const {
  errorRepository,
  errorMapper,
  errorValidator,
  errorHandlingService,
  globalExceptionHandler,
  httpErrorResponseService
} = setupErrorHandlingDomain();
```

## Validation

Validators ensure data integrity:
- `ErrorValidator` - Validates system error data
- `CategoryValidator` - Validates error category data
- `ContextValidator` - Validates error context data

## HTTP Status Codes

All HTTP error responses follow a unified format:

```typescript
interface ErrorResponseDto {
  errorId?: string;           // Error tracking ID
  errorCode: string;          // Error code (e.g., 'VALIDATION_ERROR')
  category: ErrorCategoryType; // Error category
  severity: ErrorSeverity;     // Error severity
  message: string;            // User-friendly message
  details?: string;           // Debug info (dev only)
  timestamp: string;           // ISO timestamp
  requestId?: string;         // Request tracing
  metadata?: Record<string, unknown>;
  userAction?: string;        // Suggested action
  supportContact?: string;    // Support info
}
```

## Monitoring Integration

Critical errors automatically:
1. Emit `CriticalErrorDetected` event
2. Send metric to Monitoring service (fire-and-forget)
3. Never block on monitoring

## Audit Integration

Critical system errors create audit records:
- Actor: 'system'
- Action: 'CRITICAL_ERROR_DETECTED'
- Target: SystemError entity
- Result: FAILURE

## Failure Handling

When Error Repository fails:
1. Log the failure
2. Never create recursive exceptions
3. Re-throw the original error
4. Continue execution gracefully

## Testing

```bash
# Run tests
npm test -- --testPathPattern="error-handling"

# Run with coverage
npm test -- --coverage --testPathPattern="error-handling"
```

## Implemented (P-191.2)

- ✅ Full SupabaseErrorRepository implementation
- ✅ ErrorHandlingService
- ✅ GlobalExceptionHandler
- ✅ HTTPErrorResponseService
- ✅ Error Classification system
- ✅ HTTP error responses (400, 401, 403, 404, 409, 422, 429, 500, 503)
- ✅ Monitoring integration
- ✅ Audit integration
- ✅ Failure handling with graceful degradation
- ✅ Unit tests
