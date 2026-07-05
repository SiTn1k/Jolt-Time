# Error Handling Domain

## Overview

The Error Handling Domain provides a centralized error management layer for Jolt Time. This foundation stores errors, categories, and contexts - it NEVER modifies gameplay, retries operations, grants rewards, or modifies balances/inventory.

## Architecture

```
src/domains/error-handling/
├── entities/           # Domain entities (SystemError, ErrorCategory, ErrorContext)
├── repositories/       # Data access layer (SupabaseErrorRepository skeleton)
├── dto/                # Data Transfer Objects
├── mappers/            # Entity-DTO mappers (only mapping, no logic)
├── validators/         # Input validation
├── events/             # Domain events
├── types/              # Type definitions
├── interfaces/         # Abstract interfaces
├── value-objects/      # Immutable value objects
├── di.ts              # Dependency injection
└── index.ts           # Module exports
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

## Key Principle

**Error Handling NEVER modifies gameplay**

This domain ONLY:
- Stores errors
- Stores categories
- Stores contexts
- Emits events

This domain does NOT:
- Retry operations
- Modify gameplay
- Grant rewards
- Modify balances
- Modify inventory

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
const { errorRepository, errorMapper, errorValidator } = setupErrorHandlingDomain();
```

## Validation

Validators ensure data integrity:
- `ErrorValidator` - Validates system error data
- `CategoryValidator` - Validates error category data
- `ContextValidator` - Validates error context data

## Not Implemented (P-191.2)

The following will be implemented in P-191.2:
- Full SupabaseErrorRepository implementation
- Global Exception Handler
- Sentry integration
- Retry Engine
- Recovery Engine
- Error Notifications
- Crash Recovery
- Automatic Restart
