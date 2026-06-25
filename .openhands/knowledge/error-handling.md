# Error Handling System Architecture

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Status:** Architecture Specification

---

## Table of Contents

1. [Overview](#overview)
2. [Error Categories](#error-categories)
3. [Error Handling Philosophy](#error-handling-philosophy)
4. [Error Severity Levels](#error-severity-levels)
5. [Layer Responsibilities](#layer-responsibilities)
6. [User-Facing Error Philosophy](#user-facing-error-philosophy)
7. [Error Response Structure](#error-response-structure)
8. [Retry Philosophy](#retry-philosophy)
9. [Network Error Handling](#network-error-handling)
10. [Supabase Error Handling](#supabase-error-handling)
11. [Telegram Error Handling](#telegram-error-handling)
12. [AdsGram Error Handling](#adsgram-error-handling)
13. [Monitoring Philosophy](#monitoring-philosophy)
14. [Testing Philosophy](#testing-philosophy)
15. [Future Expansion Notes](#future-expansion-notes)
16. [Long-Term Philosophy](#long-term-philosophy)

---

## Overview

The Error Handling System establishes Jolt Time's standardized approach to managing errors across all application layers. This system ensures errors are predictable, traceable, and user-friendly while maintaining complete diagnostic capability for the development team.

### Core Principle

```
Errors are inevitable — how we handle them defines the user experience.
```

### System Goals

| Goal | Description |
|------|-------------|
| **Predictability** | Errors follow consistent patterns across all layers |
| **Traceability** | Every error can be traced to its source and context |
| **User-Friendliness** | Players see clear, actionable messages |
| **Recoverability** | Errors support appropriate recovery strategies |

### Error Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      ERROR OCCURS                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ERROR CAPTURE                             │
│  - Catch at appropriate layer                               │
│  - Enrich with context                                       │
│  - Classify severity                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   ERROR LOGGING                              │
│  - Record to logging system                                  │
│  - Include trace identifiers                                 │
│  - Store for analysis                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ERROR TRANSLATION                           │
│  - Convert to user-friendly message                          │
│  - Apply localization                                         │
│  - Add recovery options                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ERROR PRESENTATION                           │
│  - Display to user in appropriate format                     │
│  - Support retry if applicable                               │
│  - Track user acknowledgment                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Categories

### Category Overview

| Category | Layer | Description |
|----------|-------|-------------|
| **UI Errors** | Presentation | User interface and rendering issues |
| **Validation Errors** | Business Logic | Input validation failures |
| **Service Errors** | Service Layer | Business logic failures |
| **Repository Errors** | Data Layer | Data access failures |
| **API Errors** | External Layer | External service failures |
| **Database Errors** | Data Layer | Supabase and database failures |
| **Telegram Errors** | Platform Layer | Telegram API failures |
| **External Service Errors** | Integration Layer | Third-party service failures |

### UI Errors

UI Errors occur at the presentation layer:

| Error Type | Description | Example |
|------------|-------------|---------|
| **RenderError** | Component rendering failure | Missing dependencies |
| **StateError** | Invalid state transition | Corrupted store |
| **NavigationError** | Route navigation failure | Invalid path |
| **AnimationError** | Animation or transition failure | CSS transition error |
| **AssetError** | Failed to load assets | Missing images |

### Validation Errors

Validation Errors occur during input processing:

| Error Type | Description | Example |
|------------|-------------|---------|
| **RequiredError** | Missing required field | Empty username |
| **TypeError** | Invalid data type | String where number expected |
| **RangeError** | Value outside allowed range | Level too high |
| **FormatError** | Invalid format | Malformed email |
| **ConstraintError** | Business rule violation | Duplicate entry |

### Service Errors

Service Errors occur in business logic:

| Error Type | Description | Example |
|------------|-------------|---------|
| **BusinessRuleError** | Business rule violation | Insufficient balance |
| **StateTransitionError** | Invalid state change | Cannot level down |
| **AuthorizationError** | Permission denied | Not guild owner |
| **NotFoundError** | Resource not found | Invalid artifact ID |
| **ConflictError** | Resource conflict | Already claimed |

### Repository Errors

Repository Errors occur during data access:

| Error Type | Description | Example |
|------------|-------------|---------|
| **QueryError** | Database query failure | Invalid SQL |
| **ConnectionError** | Database connection failure | Timeout |
| **TransactionError** | Transaction failure | Rollback required |
| **ConstraintViolationError** | DB constraint violation | Foreign key violation |
| **DataIntegrityError** | Data consistency failure | Duplicate key |

### API Errors

API Errors occur during external communication:

| Error Type | Description | Example |
|------------|-------------|---------|
| **RequestError** | Invalid API request | Missing parameters |
| **ResponseError** | Invalid API response | Malformed JSON |
| **AuthenticationError** | API auth failure | Invalid token |
| **RateLimitError** | Rate limit exceeded | Too many requests |
| **TimeoutError** | API request timeout | Slow response |

### Database Errors

Database Errors are specific Supabase failures:

| Error Type | Description | Example |
|------------|-------------|---------|
| **DatabaseConnectionError** | Cannot connect to DB | Network issue |
| **DatabaseQueryError** | Query execution failure | Syntax error |
| **DatabaseConstraintError** | Constraint violation | NOT NULL violation |
| **DatabaseTimeoutError** | Query timeout | Long-running query |
| **DatabaseUnavailableError** | Database unavailable | Maintenance |

### Telegram Errors

Telegram Errors occur during platform integration:

| Error Type | Description | Example |
|------------|-------------|---------|
| **TelegramAPIError** | Telegram API failure | Bot blocked |
| **TelegramAuthError** | Telegram auth failure | Invalid initData |
| **PermissionError** | User permission issue | Blocked by user |
| **MessageError** | Message delivery failure | Chat not found |
| **DeepLinkError** | Deep link processing failure | Invalid start param |
| **ShareError** | Share operation failure | Cannot share |

### External Service Errors

External Service Errors include all other integrations:

| Error Type | Description | Example |
|------------|-------------|---------|
| **AdsGramError** | AdsGram integration failure | SDK error |
| **PaymentError** | Payment processing failure | Transaction failed |
| **AnalyticsError** | Analytics tracking failure | Event rejected |
| **CacheError** | Cache operation failure | Redis unavailable |
| **WebhookError** | Webhook processing failure | Invalid payload |

---

## Error Handling Philosophy

### Core Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Standardization** | All errors follow the same structure | Unified error types |
| **Understandability** | Errors are clear and actionable | User-friendly messages |
| **Recovery** | Errors support appropriate recovery | Retry mechanisms |
| **Traceability** | Errors can be traced and diagnosed | Unique error IDs |
| **Isolation** | Errors don't cascade | Layer containment |

### Standardization

Every error in Jolt Time follows a consistent pattern:

```typescript
interface JoltError {
  id: string;           // Unique trace identifier
  code: string;        // Machine-readable error code
  category: ErrorCategory;  // Error category
  severity: ErrorSeverity; // Severity level
  message: string;     // User-friendly message
  details?: unknown;   // Technical details (not shown to user)
  recoverable: boolean; // Whether retry is possible
  timestamp: Date;     // When error occurred
  context?: ErrorContext; // Additional context
}
```

### Understandability

Users should never see raw technical errors:

| ❌ Raw Error | ✅ User-Friendly Error |
|-------------|----------------------|
| `Error: ECONNREFUSED` | "Unable to connect. Please check your internet connection." |
| `ValidationError: field 'coins' must be positive` | "Something went wrong. Please try again." |
| `DatabaseError: foreign_key_violation` | "This action couldn't be completed. Please try again." |
| `RPCError: insufficient_balance` | "Not enough coins for this purchase." |

### Recovery

Errors should support appropriate recovery:

| Error Type | Recovery Strategy |
|------------|------------------|
| **Network Error** | Auto-retry with backoff |
| **Validation Error** | Show correction guidance |
| **Auth Error** | Prompt re-authentication |
| **Server Error** | Offer manual retry |
| **Business Error** | Explain and suggest alternatives |

---

## Error Severity Levels

### Severity Overview

| Level | Name | Behavior | Example |
|-------|------|----------|---------|
| **1** | Critical | Immediate alert, halt operation | Database crash |
| **2** | High | Alert logged, operation failed | Payment failure |
| **3** | Medium | Error logged, fallback activated | Cache miss |
| **4** | Low | Error logged, operation continued | Analytics miss |
| **5** | Informational | Logged for tracking | User action |

### Critical (Severity 1)

**Definition:** System-wide failure requiring immediate attention.

**Behavior:**
- Operation halts immediately
- User shown generic error message
- Engineering team alerted
- All relevant context logged
- Automatic incident created

**Examples:**
- Database connection lost
- Authentication system failure
- Payment processing failure
- Complete service outage

**Message Template:**
```
We're experiencing technical difficulties. Please try again in a few moments.
```

### High (Severity 2)

**Definition:** Operation failed, but system remains functional.

**Behavior:**
- Operation fails gracefully
- User shown specific error message
- Error logged with full context
- Alert triggered if threshold exceeded
- Operation can be retried manually

**Examples:**
- Insufficient currency balance
- Invalid game action
- Resource not found
- Permission denied

**Message Template:**
```
[Specific explanation of what went wrong]
Please [corrective action].
```

### Medium (Severity 3)

**Definition:** Operation completed with degraded functionality.

**Behavior:**
- Fallback mechanism activated
- User may see reduced functionality
- Error logged for analysis
- Silent recovery when possible
- Monitoring increased

**Examples:**
- Cache unavailable, fetching from DB
- Analytics event not tracked
- Optional feature unavailable
- Background sync failed

**Message Template:**
```
[Continue with reduced functionality]
Some features may be temporarily unavailable.
```

### Low (Severity 4)

**Definition:** Minor issue that doesn't affect operation.

**Behavior:**
- Operation completes successfully
- Error logged for analytics
- No user notification required
- Trend monitoring
- Future improvement noted

**Examples:**
- Optional analytics event failed
- Non-critical validation warning
- Cosmetic error (e.g., toast failed)
- Debug logging failure

**Message:** None (silent log only)

### Informational (Severity 5)

**Definition:** Notable events for tracking and analysis.

**Behavior:**
- Logged for business intelligence
- No operational impact
- Pattern analysis enabled
- User experience unaffected

**Examples:**
- User action completed
- Feature accessed
- Preference changed
- Navigation occurred

**Message:** None

---

## Layer Responsibilities

### Layer Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      COMPONENTS                              │
│  • Handle presentation errors                                │
│  • Show user-friendly messages                               │
│  • Offer retry options                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        HOOKS                                 │
│  • Catch errors from services                                │
│  • Transform errors for components                            │
│  • Manage error state                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       STORES                                 │
│  • Global error state management                             │
│  • Error boundary logic                                      │
│  • Error recovery coordination                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES                                │
│  • Handle business logic errors                              │
│  • Transform technical errors to business errors              │
│  • Coordinate error recovery                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    REPOSITORIES                              │
│  • Handle data access errors                                 │
│  • Translate DB errors to app errors                          │
│  • Implement retry for transient failures                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API CLIENTS                                │
│  • Handle external service errors                            │
│  • Normalize error responses                                 │
│  • Implement circuit breakers                                │
└─────────────────────────────────────────────────────────────┘
```

### Components

Components handle error presentation:

| Responsibility | Description |
|---------------|-------------|
| **Display** | Show error messages to users |
| **Retry** | Provide retry buttons when appropriate |
| **Dismiss** | Allow user to dismiss errors |
| **Fallback** | Show fallback UI when errors occur |

**Component Error Handling Pattern:**
```typescript
// Components should NOT catch errors - let them propagate
// Components only handle presentation

function ClaimRewardButton() {
  const { claimReward, isLoading, error } = useRewardService();
  
  if (error) {
    return <ErrorMessage error={error} onRetry={claimReward} />;
  }
  
  return <Button onClick={claimReward} loading={isLoading} />;
}
```

### Hooks

Hooks transform and manage errors:

| Responsibility | Description |
|---------------|-------------|
| **Transform** | Convert service errors to hook state |
| **Manage State** | Track loading, error, and success states |
| **Provide Callbacks** | Expose retry functions |
| **Log** | Record errors for analytics |

**Hook Error Handling Pattern:**
```typescript
function useRewardService() {
  const [state, setState] = useState<ServiceState>();
  
  const claimReward = async () => {
    setState({ status: 'loading' });
    try {
      const result = await rewardService.claim();
      setState({ status: 'success', data: result });
    } catch (error) {
      // Transform to user-friendly error
      const userError = transformError(error);
      setState({ status: 'error', error: userError });
      logError(error); // For analytics
    }
  };
  
  return { claimReward, state };
}
```

### Stores

Stores manage global error state:

| Responsibility | Description |
|---------------|-------------|
| **Global State** | Track errors that affect multiple features |
| **Error Boundaries** | Contain errors within feature boundaries |
| **Recovery Coordination** | Coordinate multi-step error recovery |
| **Persistence** | Persist critical error state across sessions |

**Store Error Handling Pattern:**
```typescript
// Zustand error store
interface ErrorStore {
  globalError: JoltError | null;
  errorHistory: JoltError[];
  setGlobalError: (error: JoltError) => void;
  clearError: () => void;
  logError: (error: JoltError) => void;
}
```

### Services

Services handle business logic errors:

| Responsibility | Description |
|---------------|-------------|
| **Business Rules** | Validate business rules, throw on violation |
| **Error Translation** | Convert technical errors to business errors |
| **Recovery Coordination** | Coordinate multi-repository operations |
| **Transaction Management** | Handle rollback on error |

**Service Error Handling Pattern:**
```typescript
class CurrencyService {
  async transfer(from: string, to: string, amount: number): Promise<void> {
    // Validate business rules
    const balance = await this.currencyRepo.getBalance(from);
    if (balance < amount) {
      throw new BusinessError('INSUFFICIENT_BALANCE', {
        required: amount,
        available: balance
      });
    }
    
    // Coordinate transaction with rollback
    try {
      await this.currencyRepo.debit(from, amount);
      await this.currencyRepo.credit(to, amount);
    } catch (error) {
      // Rollback on any failure
      await this.currencyRepo.rollback();
      throw this.translateError(error);
    }
  }
}
```

### Repositories

Repositories handle data access errors:

| Responsibility | Description |
|---------------|-------------|
| **Data Access** | Execute database operations |
| **Error Translation** | Convert DB errors to app errors |
| **Retry Logic** | Retry transient failures (connection, timeout) |
| **Connection Management** | Handle connection failures |

**Repository Error Handling Pattern:**
```typescript
class CurrencyRepository {
  async getBalance(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('user_currencies')
        .select('balance')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        throw this.translateDatabaseError(error);
      }
      
      return data?.balance ?? 0;
    } catch (error) {
      if (this.isRetryable(error)) {
        return this.retry(() => this.getBalance(userId));
      }
      throw error;
    }
  }
}
```

### API Clients

API Clients handle external service errors:

| Responsibility | Description |
|---------------|-------------|
| **External Communication** | Make requests to external services |
| **Error Normalization** | Normalize external errors to app errors |
| **Circuit Breaking** | Prevent cascade failures |
| **Rate Limiting** | Handle rate limit errors |

**API Client Error Handling Pattern:**
```typescript
class AdsGramClient {
  async requestAd(category: AdCategory): Promise<AdResult> {
    try {
      return await this.sdk.showAd(category);
    } catch (error) {
      const normalizedError = this.normalizeError(error);
      
      if (normalizedError.code === 'RATE_LIMIT') {
        throw new RetryableError(normalizedError, { retryAfter: 60 });
      }
      
      if (normalizedError.code === 'NETWORK_ERROR') {
        throw new RetryableError(normalizedError, { retryable: true });
      }
      
      throw normalizedError;
    }
  }
}
```

---

## User-Facing Error Philosophy

### Core Principle

**Players should never see raw technical errors.**

### Error Message Standards

| Standard | Description |
|----------|-------------|
| **Simple** | Use plain language, no technical terms |
| **Actionable** | Tell users what they can do |
| **Honest** | Don't hide that an error occurred |
| **Empathetic** | Acknowledge user frustration |
| **Localized** | Support all supported languages |

### Message Templates

#### Generic Errors

Used when details shouldn't be exposed:

```
We're experiencing technical difficulties.
Please try again in a few moments.

[Try Again] [Contact Support]
```

#### Network Errors

Used for connection issues:

```
Unable to connect to our servers.
Please check your internet connection and try again.

[Try Again]
```

#### Validation Errors

Used for user input issues:

```
[Specific field] [specific issue].
Please check and try again.

[Go Back]
```

#### Business Rule Errors

Used for game logic violations:

```
[Clear explanation of why action couldn't be completed].
[Suggested alternative or corrective action].

[OK]
```

#### Authorization Errors

Used for permission issues:

```
You don't have permission to do that.
Please [alternative action].

[OK]
```

### What NOT to Show Users

| ❌ Never Show | ✅ Show Instead |
|-------------|-----------------|
| Stack traces | Generic error message |
| Database errors | "Something went wrong" |
| Internal error codes | User-friendly message |
| API endpoints | "Please try again" |
| Environment details | "Contact support if persists" |
| Security-sensitive info | "Please try again later" |

### Localization

All user-facing errors must be localized:

```typescript
// Error messages are keys, not strings
const errorMessages = {
  'ERROR_GENERIC': {
    en: "We're experiencing technical difficulties. Please try again.",
    es: 'Estamos experimentando dificultades técnicas. Inténtalo de nuevo.',
    // ... other languages
  },
  'ERROR_NETWORK': {
    en: 'Unable to connect. Please check your internet connection.',
    es: 'No se puede conectar. Por favor, verifica tu conexión a internet.',
    // ... other languages
  }
};
```

---

## Error Response Structure

### Standard Error Format

```typescript
interface JoltError {
  // Identification
  id: string;              // UUID v4, unique per occurrence
  code: string;            // Machine-readable error code
  
  // Classification
  category: ErrorCategory;
  severity: ErrorSeverity;
  
  // User Communication
  message: LocalizedMessage;  // User-facing message
  userTitle: LocalizedMessage; // Short title for UI
  
  // Recovery
  recoverable: boolean;
  recoveryAction?: RecoveryAction;
  
  // Technical Details (internal only)
  details?: ErrorDetails;
  
  // Context
  context: ErrorContext;
  
  // Metadata
  timestamp: Date;
  traceId: string;         // For log correlation
  userId?: string;
  sessionId?: string;
}

interface LocalizedMessage {
  en: string;
  es?: string;
  // ... other supported languages
}

interface RecoveryAction {
  type: 'retry' | 'reload' | 'contact_support' | 'navigate' | 'dismiss';
  label?: LocalizedMessage;
  url?: string;
  retryable?: boolean;
  retryAfter?: number;
}

interface ErrorDetails {
  // Only logged, never shown to users
  originalError?: string;
  stack?: string;
  requestId?: string;
  endpoint?: string;
  query?: string;
  httpStatus?: number;
}

interface ErrorContext {
  // Where the error occurred
  layer: 'component' | 'hook' | 'store' | 'service' | 'repository' | 'api_client';
  feature: string;
  operation: string;
  
  // What triggered the error
  userId?: string;
  resourceId?: string;
  resourceType?: string;
}
```

### Error Code Format

Error codes follow a predictable pattern:

```
{CATEGORY}_{SUBCATEGORY}_{SPECIFIC_ERROR}
```

**Examples:**
- `VALIDATION_REQUIRED_FIELD` — Missing required field
- `SERVICE_INSUFFICIENT_BALANCE` — Not enough currency
- `REPOSITORY_QUERY_FAILED` — Database query error
- `TELEGRAM_MESSAGE_FAILED` — Cannot send message
- `ADSGRAM_SDK_ERROR` — AdsGram integration error

---

## Retry Philosophy

### Retry Strategy Overview

| Strategy | When Used | Behavior |
|----------|-----------|----------|
| **Automatic Retry** | Transient failures | System retries automatically |
| **Manual Retry** | Permanent failures after retry | User clicks retry button |
| **No Retry** | Non-recoverable errors | Show error, no retry option |

### Automatic Retry

For transient failures that are likely to succeed on retry:

```typescript
interface AutoRetryConfig {
  maxAttempts: number;      // Maximum retry attempts
  initialDelay: number;      // Initial delay in ms
  maxDelay: number;          // Maximum delay in ms
  backoffMultiplier: number; // Delay growth factor
  retryableErrors: string[];  // Error codes that trigger retry
}
```

**Default Configuration:**
```typescript
const DEFAULT_RETRY_CONFIG: AutoRetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,      // 1 second
  maxDelay: 10000,         // 10 seconds
  backoffMultiplier: 2,    // Exponential backoff
  retryableErrors: [
    'NETWORK_ERROR',
    'TIMEOUT',
    'DATABASE_CONNECTION_ERROR',
    'RATE_LIMIT_EXCEEDED'
  ]
};
```

### Manual Retry

For errors that require user action or when auto-retry exhausted:

```typescript
interface ManualRetryConfig {
  showRetryButton: boolean;
  retryLabel: LocalizedMessage;
  maxManualRetries?: number;  // Unlimited if undefined
}
```

### Retry Limits

To prevent infinite retry loops:

| Error Type | Auto Retry | Manual Retry | Total Max |
|------------|-----------|--------------|-----------|
| Network Error | 3 | Unlimited | Unlimited |
| Database Error | 2 | 5 | 7 |
| Rate Limit | 0 | After cooldown | After cooldown |
| Business Error | 0 | 1 | 1 |
| Auth Error | 0 | After re-auth | After re-auth |

---

## Network Error Handling

### Network States

| State | Detection | Handling |
|-------|-----------|----------|
| **Online** | navigator.onLine | Normal operation |
| **Offline** | !navigator.onLine | Queue operations, show offline UI |
| **Slow** | High latency | Increase timeouts, show loading |
| **Unstable** | Frequent disconnects | Reduce requests, cache aggressively |

### Offline Mode

When the user is offline:

```typescript
interface OfflineConfig {
  queueOperations: boolean;     // Queue for later
  queueStorage: 'localStorage' | 'sessionStorage';
  maxQueueSize: number;       // Max queued operations
  queueExpiry: number;        // Expire queued after ms
}
```

**Behavior:**
1. Detect offline state
2. Queue critical operations
3. Show offline indicator to user
4. On reconnect, process queue
5. Show sync status

### Connection Loss

When connection drops mid-operation:

```typescript
// Mid-operation connection loss
async function transferCurrency(from: string, to: string, amount: number) {
  try {
    return await currencyService.transfer(from, to, amount);
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      // Check if operation completed server-side
      const status = await checkTransactionStatus(from, to, amount);
      if (status === 'completed') {
        return { success: true, synced: true };
      }
      // Operation didn't complete
      throw new RetryableError('Transaction may not have completed. Checking status...');
    }
    throw error;
  }
}
```

### Timeout Handling

```typescript
interface TimeoutConfig {
  defaultTimeout: number;       // Default request timeout
  extendedTimeout: number;     // Timeout for long operations
  timeoutMessages: LocalizedMessage;
}

const TIMEOUT_ERROR: JoltError = {
  code: 'NETWORK_TIMEOUT',
  message: {
    en: 'The request took too long. Please try again.',
    es: 'La solicitud tardó demasiado. Inténtalo de nuevo.'
  },
  severity: ErrorSeverity.Medium,
  recoverable: true,
  recoveryAction: {
    type: 'retry',
    label: { en: 'Try Again', es: 'Intentar de nuevo' }
  }
};
```

### Partial Failures

When some operations in a batch succeed:

```typescript
interface PartialFailureResult<T> {
  succeeded: T[];
  failed: { item: T; error: JoltError }[];
  canRetry: boolean;
}

// Example: Multi-item purchase
async function purchaseItems(items: PurchaseItem[]): Promise<PartialFailureResult<Receipt>> {
  const result: PartialFailureResult<Receipt> = {
    succeeded: [],
    failed: [],
    canRetry: true
  };
  
  for (const item of items) {
    try {
      const receipt = await purchaseItem(item);
      result.succeeded.push(receipt);
    } catch (error) {
      result.failed.push({ item, error: transformError(error) });
    }
  }
  
  return result;
}
```

---

## Supabase Error Handling

### Database Errors

```typescript
// Database error translation
const DATABASE_ERROR_MAP: Record<string, JoltErrorConfig> = {
  '23505': { // unique_violation
    code: 'DATABASE_CONSTRAINT_DUPLICATE',
    message: 'This already exists. Please try a different one.',
    severity: ErrorSeverity.Medium,
    recoverable: false
  },
  '23503': { // foreign_key_violation
    code: 'DATABASE_CONSTRAINT_REFERENCE',
    message: 'This action is not allowed due to existing dependencies.',
    severity: ErrorSeverity.High,
    recoverable: false
  },
  '23502': { // not_null_violation
    code: 'DATABASE_CONSTRAINT_REQUIRED',
    message: 'Required information is missing.',
    severity: ErrorSeverity.High,
    recoverable: false
  },
  'PGRST301': { // RPC error
    code: 'DATABASE_RPC_ERROR',
    message: 'An operation failed. Please try again.',
    severity: ErrorSeverity.High,
    recoverable: true
  },
  'PGRST204': { // Not found
    code: 'DATABASE_NOT_FOUND',
    message: 'The requested information was not found.',
    severity: ErrorSeverity.Medium,
    recoverable: false
  }
};

interface JoltErrorConfig {
  code: string;
  message: string | LocalizedMessage;
  severity: ErrorSeverity;
  recoverable: boolean;
}
```

### RPC Errors

```typescript
// RPC error handling
interface RpcErrorHandler {
  translate(error: unknown): JoltError;
  isRetryable(error: RoltError): boolean;
  getRetryDelay(error: JoltError): number;
}

// Example RPC error translation
function translateRpcError(error: unknown): JoltError {
  if (error instanceof PostgrestError) {
    switch (error.code) {
      case '23505':
        return createError('DATABASE_DUPLICATE', 'This already exists.', false);
      case 'P0001': // Custom RPC error code
        return createError(`RPC_${error.message}`, error.details, false);
      default:
        return createError('RPC_FAILED', 'Operation failed. Please try again.', true);
    }
  }
  return createError('RPC_UNKNOWN', 'An unexpected error occurred.', true);
}
```

### Edge Function Errors

```typescript
// Edge function error handling
interface EdgeFunctionError {
  code: string;
  message: string;
  status: number;
}

// Example edge function error translation
function translateEdgeFunctionError(error: EdgeFunctionError): JoltError {
  if (error.status === 401) {
    return createAuthError('Session expired. Please log in again.');
  }
  
  if (error.status === 403) {
    return createPermissionError('You do not have permission for this action.');
  }
  
  if (error.status === 429) {
    return createRateLimitError(error);
  }
  
  if (error.status >= 500) {
    return createServerError('Server issue. Please try again later.');
  }
  
  // Client error (4xx) - likely user's fault
  return createError(`EDGE_FUNCTION_${error.status}`, error.message, false);
}
```

### Authentication Errors

```typescript
// Auth error handling
interface AuthErrorHandler {
  handleAuthError(error: AuthError): JoltError;
  isTokenExpired(error: AuthError): boolean;
  shouldRefreshToken(error: AuthError): boolean;
}

function handleAuthError(error: AuthError): JoltError {
  switch (error.message) {
    case 'Invalid login credentials':
      return createError('AUTH_INVALID_CREDENTIALS', 'Invalid email or password.', false);
    
    case 'JWT expired':
      return createAuthError('Your session has expired. Please log in again.', true);
    
    case 'User not found':
      return createError('AUTH_USER_NOT_FOUND', 'Account not found.', false);
    
    case 'Email not confirmed':
      return createError('AUTH_EMAIL_NOT_CONFIRMED', 'Please verify your email address.', false);
    
    default:
      return createAuthError('Authentication failed. Please try again.', true);
  }
}
```

---

## Telegram Error Handling

### Telegram API Errors

```typescript
// Telegram API error codes
const TELEGRAM_ERROR_MAP: Record<string, JoltErrorConfig> = {
  '400': {
    code: 'TELEGRAM_BAD_REQUEST',
    message: 'Invalid request. Please try again.',
    severity: ErrorSeverity.High,
    recoverable: true
  },
  '403': {
    code: 'TELEGRAM_FORBIDDEN',
    message: 'Cannot send message. Please check your settings.',
    severity: ErrorSeverity.Medium,
    recoverable: false
  },
  '403_USER_BOT_NOT_IN_GROUP': {
    code: 'TELEGRAM_BOT_NOT_IN_GROUP',
    message: 'Bot is not a member of this group.',
    severity: ErrorSeverity.Medium,
    recoverable: false
  },
  '400_CHAT_NOT_FOUND': {
    code: 'TELEGRAM_CHAT_NOT_FOUND',
    message: 'Chat not found or no longer accessible.',
    severity: ErrorSeverity.High,
    recoverable: false
  },
  '429': {
    code: 'TELEGRAM_RATE_LIMIT',
    message: 'Too many requests. Please wait a moment.',
    severity: ErrorSeverity.Medium,
    recoverable: true,
    retryAfter: 5
  },
  '401': {
    code: 'TELEGRAM_UNAUTHORIZED',
    message: 'Bot authentication failed.',
    severity: ErrorSeverity.Critical,
    recoverable: false
  }
};
```

### User Permission Issues

```typescript
// Permission error handling
interface TelegramPermissionError extends JoltError {
  permissionType: 'send_messages' | 'send_media' | 'invite_users' | 'change_info';
  chatId: number;
}

// Handle when bot can't send to user
async function handleSendMessageError(error: TelegramError): Promise<JoltError> {
  if (error.message.includes('bot was blocked by the user')) {
    return {
      code: 'TELEGRAM_USER_BLOCKED',
      message: 'You have blocked the bot. Unblock to continue receiving messages.',
      severity: ErrorSeverity.Low,
      recoverable: false,
      context: {
        userId: error.chatId,
        action: 'update_notification_preference'
      }
    };
  }
  
  if (error.message.includes('user is deactivated')) {
    return {
      code: 'TELEGRAM_USER_DEACTIVATED',
      message: 'This user account is no longer active.',
      severity: ErrorSeverity.Low,
      recoverable: false
    };
  }
  
  return translateTelegramError(error);
}
```

### Deep Link Errors

```typescript
// Deep link error handling
interface DeepLinkErrorHandler {
  parseStartParam(param: string): StartParam | null;
  validateStartParam(param: StartParam): ValidationResult;
  handleInvalidParam(param: string): JoltError;
}

function handleInvalidDeepLink(param: string): JoltError {
  // Unknown start parameter
  if (param.startsWith('ref_')) {
    // Invalid referral code
    return {
      code: 'DEEPLINK_INVALID_REFERRAL',
      message: 'This referral link is no longer valid.',
      severity: ErrorSeverity.Low,
      recoverable: true
    };
  }
  
  if (param.startsWith('event_')) {
    // Invalid event ID
    return {
      code: 'DEEPLINK_INVALID_EVENT',
      message: 'This event is no longer available.',
      severity: ErrorSeverity.Low,
      recoverable: true
    };
  }
  
  // Unknown parameter
  return {
    code: 'DEEPLINK_UNKNOWN',
    message: 'This link is not recognized.',
    severity: ErrorSeverity.Low,
    recoverable: true
  };
}
```

### Share Errors

```typescript
// Share operation error handling
interface ShareErrorHandler {
  handleShareError(error: ShareError): JoltError;
  isUserCancellation(error: ShareError): boolean;
}

function handleShareError(error: ShareError): JoltError {
  if (isUserCancellation(error)) {
    return {
      code: 'SHARE_CANCELLED',
      message: 'Share cancelled.',
      severity: ErrorSeverity.Informational,
      recoverable: false
    };
  }
  
  if (error.message.includes('cannot share in this context')) {
    return {
      code: 'SHARE_NOT_SUPPORTED',
      message: 'Sharing is not available in this context.',
      severity: ErrorSeverity.Low,
      recoverable: false
    };
  }
  
  return {
    code: 'SHARE_FAILED',
    message: 'Unable to share. Please try again.',
    severity: ErrorSeverity.Low,
    recoverable: true
  };
}
```

---

## AdsGram Error Handling

AdsGram remains one of the primary revenue systems for Jolt Time. Robust error handling is critical for both user experience and revenue protection.

### Ad Loading Failures

```typescript
// Ad loading error handling
interface AdsGramErrorHandler {
  handleLoadError(error: AdsLoadError): JoltError;
  isNetworkError(error: AdsLoadError): boolean;
  shouldOfferRetry(error: AdsLoadError): boolean;
}

function handleAdLoadError(error: AdsLoadError): JoltError {
  if (isNetworkError(error)) {
    return {
      code: 'ADSGRAM_NETWORK_ERROR',
      message: 'Unable to load ad. Please check your connection.',
      severity: ErrorSeverity.Medium,
      recoverable: true,
      recoveryAction: { type: 'retry', retryAfter: 5 }
    };
  }
  
  if (error.code === 'ADSGRAM_NO_INVENTORY') {
    return {
      code: 'ADSGRAM_NO_INVENTORY',
      message: 'No ad available right now. Please try again later.',
      severity: ErrorSeverity.Low,
      recoverable: true,
      recoveryAction: { type: 'retry', retryAfter: 60 }
    };
  }
  
  if (error.code === 'ADSGRAM_USER_NOT_ELIGIBLE') {
    return {
      code: 'ADSGRAM_NOT_ELIGIBLE',
      message: 'Ads are not available for your account.',
      severity: ErrorSeverity.Low,
      recoverable: false
    };
  }
  
  // Unknown error - treat as temporary
  return {
    code: 'ADSGRAM_LOAD_FAILED',
    message: 'Ad failed to load. Please try again.',
    severity: ErrorSeverity.Medium,
    recoverable: true
  };
}
```

### Reward Verification Failures

```typescript
// Reward verification error handling
interface RewardVerificationConfig {
  verifyOnServer: boolean;
  serverEndpoint: string;
  maxRetries: number;
  retryDelay: number;
}

async function verifyAdReward(viewId: string): Promise<RewardResult> {
  try {
    // Server-side verification
    const result = await server.verifyReward(viewId);
    return result;
  } catch (error) {
    // Verification failed - don't grant reward
    if (isVerificationError(error)) {
      throw {
        code: 'ADSGRAM_VERIFICATION_FAILED',
        message: 'Reward could not be verified.',
        severity: ErrorSeverity.High,
        recoverable: false,
        details: { viewId }
      };
    }
    
    // Transient error - allow retry
    throw {
      code: 'ADSGRAM_VERIFICATION_ERROR',
      message: 'Could not verify reward. Please try again.',
      severity: ErrorSeverity.Medium,
      recoverable: true
    };
  }
}
```

### Callback Failures

```typescript
// AdsGram callback handling
interface AdsGramCallbackHandler {
  handleCallback(callback: AdsGramCallback): Promise<void>;
  validateCallback(callback: AdsGramCallback): boolean;
  processRewardCallback(callback: RewardCallback): Promise<RewardResult>;
}

async function handleAdsGramCallback(callback: AdsGramCallback): Promise<void> {
  // Validate callback authenticity
  if (!validateAdsGramCallback(callback)) {
    throw {
      code: 'ADSGRAM_CALLBACK_INVALID',
      message: 'Invalid callback received.',
      severity: ErrorSeverity.High,
      recoverable: false
    };
  }
  
  switch (callback.type) {
    case 'ad_viewed':
      await processAdViewed(callback);
      break;
    case 'ad_completed':
      await processAdCompleted(callback);
      break;
    case 'ad_skipped':
      await processAdSkipped(callback);
      break;
    case 'ad_error':
      await processAdError(callback);
      break;
  }
}
```

### Duplicate Reward Prevention

```typescript
// Duplicate reward prevention
interface RewardDeduplicationConfig {
  useDeduplicationKey: boolean;
  deduplicationWindow: number;  // ms
  checkExistingBeforeGrant: boolean;
}

async function grantAdReward(
  userId: string,
  viewId: string,
  reward: AdReward
): Promise<GrantResult> {
  // Check for duplicate using viewId
  const existing = await rewardRepo.findByViewId(viewId);
  if (existing) {
    return {
      granted: false,
      reason: 'duplicate',
      existingRewardId: existing.id
    };
  }
  
  // Grant reward in transaction
  try {
    const rewardId = await rewardRepo.grantReward({
      userId,
      viewId,
      type: reward.type,
      amount: reward.amount
    });
    
    return { granted: true, rewardId };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      // Race condition - reward was already granted
      return { granted: false, reason: 'duplicate' };
    }
    throw error;
  }
}
```

---

## Monitoring Philosophy

### Logging Strategy

| Log Level | When Used | Retention |
|-----------|-----------|-----------|
| **Error** | Error occurred | 90 days |
| **Warning** | Potential issue | 30 days |
| **Info** | Notable events | 7 days |
| **Debug** | Development only | Not in prod |

### Error Logging

```typescript
interface ErrorLogEntry {
  // Error identity
  errorId: string;
  errorCode: string;
  severity: ErrorSeverity;
  
  // Context
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  traceId: string;
  
  // Location
  layer: Layer;
  feature: string;
  operation: string;
  
  // Error details
  message: string;
  stack?: string;
  
  // Recovery
  wasRecoverable: boolean;
  wasRetried: boolean;
  recoveredAutomatically: boolean;
  
  // Impact
  userAffected: boolean;
  operationFailed: boolean;
}
```

### Tracking Integration

Errors are tracked for analysis:

| Tracking Aspect | Purpose |
|-----------------|---------|
| **Error Frequency** | Identify recurring issues |
| **Error Distribution** | Understand error patterns |
| **User Impact** | Measure user experience impact |
| **Trend Analysis** | Detect emerging issues |
| **Correlation** | Link errors to deployments/changes |

### Diagnostics Support

```typescript
interface DiagnosticsCollector {
  // Collect context for debugging
  collectErrorContext(error: JoltError): ErrorContext;
  collectSystemState(): SystemState;
  collectUserState(userId: string): UserState;
  generateDiagnosticsReport(errorId: string): DiagnosticsReport;
}

interface DiagnosticsReport {
  error: ErrorLogEntry;
  systemState: SystemState;
  userState: UserState;
  recentActions: Action[];
  relatedErrors: ErrorLogEntry[];
  suggestedResolution?: string;
}
```

### Future Alerting

Error handling system supports future alerting:

```typescript
// Alert thresholds (future implementation)
interface AlertConfig {
  errorRateThreshold: number;      // Errors per minute
  errorCountThreshold: number;     // Total errors in window
  latencyThreshold: number;        // P99 latency ms
  availabilityThreshold: number;    // Success rate %
  
  // Alert channels
  channels: AlertChannel[];
  
  // Escalation
  escalateAfter: number;           // Minutes
  escalationPolicy: EscalationPolicy;
}

interface AlertChannel {
  type: 'slack' | 'email' | 'pagerduty' | 'webhook';
  target: string;
  severityThreshold: ErrorSeverity;
}
```

---

## Testing Philosophy

### Testability Principles

| Principle | Description |
|-----------|-------------|
| **Reproducibility** | Errors can be reliably reproduced in tests |
| **Isolation** | Each error scenario is tested independently |
| **Coverage** | All error paths are tested |
| **Documentation** | Error scenarios serve as documentation |

### Error Scenario Testing

```typescript
// Example error test structure
describe('CurrencyService', () => {
  describe('transfer', () => {
    it('should throw INSUFFICIENT_BALANCE when balance is too low', async () => {
      // Arrange
      mockCurrencyRepo.getBalance.mockResolvedValue(50);
      
      // Act & Assert
      await expect(service.transfer('user1', 'user2', 100))
        .rejects
        .toMatchObject({
          code: 'SERVICE_INSUFFICIENT_BALANCE',
          severity: ErrorSeverity.High,
          recoverable: false
        });
    });
    
    it('should retry on transient database error', async () => {
      // Arrange
      mockCurrencyRepo.debit
        .mockRejectedOnce(new Error('Connection lost'))
        .mockResolvedValueOnce(undefined);
      
      // Act
      await service.transfer('user1', 'user2', 50);
      
      // Assert
      expect(mockCurrencyRepo.debit).toHaveBeenCalledTimes(2);
    });
  });
});
```

### Error Type Coverage

| Category | Test Coverage Required |
|----------|----------------------|
| **Validation Errors** | All input permutations |
| **Business Errors** | All rule violations |
| **Network Errors** | Timeout, offline, slow connection |
| **Auth Errors** | Expired, invalid, missing tokens |
| **External Errors** | Each external service failure mode |

### Error State Testing

```typescript
// Test error state transitions
describe('ErrorState', () => {
  it('should transition from error to loading on retry', () => {
    const state = createErrorState('NETWORK_ERROR');
    
    const nextState = state.retry();
    
    expect(nextState.status).toBe('loading');
  });
  
  it('should transition from error to success on recovery', () => {
    const state = createErrorState('INSUFFICIENT_BALANCE');
    
    const nextState = state.recover({ newBalance: 100 });
    
    expect(nextState.status).toBe('success');
  });
  
  it('should clear error state on dismiss', () => {
    const state = createErrorState('GENERIC_ERROR');
    
    const nextState = state.dismiss();
    
    expect(nextState.error).toBeNull();
  });
});
```

---

## Future Expansion Notes

These represent **future concepts** for potential implementation:

### AI Diagnostics

**Concept:** Use AI to automatically diagnose error causes.

```typescript
// Future: AI-powered error diagnosis
interface AIDiagnostics {
  diagnose(error: JoltError): Promise<Diagnosis>;
  suggestFix(error: JoltError): Promise<FixSuggestion>;
  predictFailure(error: JoltError): Promise<Prediction>;
}

interface Diagnosis {
  rootCause: string;
  confidence: number;
  relatedIncidents: string[];
  suggestedInvestigation: string[];
}
```

### Automatic Issue Classification

**Concept:** ML-based error classification beyond rule matching.

```typescript
// Future: ML-based error classification
interface AutoClassifier {
  classify(error: JoltError): Promise<Classification>;
  learnFromFeedback(error: JoltError, feedback: Feedback): Promise<void>;
}

interface Classification {
  category: ErrorCategory;
  severity: ErrorSeverity;
  confidence: number;
  suggestedHandler: string;
}
```

### Self-Healing Workflows

**Concept:** Automatic error recovery through predefined workflows.

```typescript
// Future: Self-healing error recovery
interface SelfHealingWorkflow {
  trigger(error: JoltError): Promise<RecoveryResult>;
  canHeal(error: JoltError): boolean;
  executeRecovery(workflow: RecoveryWorkflow): Promise<void>;
}

// Example: Auto-restart failed service
const RESTART_SERVICE_WORKFLOW: RecoveryWorkflow = {
  name: 'restart_microservice',
  steps: [
    { action: 'stop', target: 'service' },
    { action: 'wait', duration: 5000 },
    { action: 'start', target: 'service' },
    { action: 'verify', healthCheck: 'service_health' }
  ]
};
```

### Predictive Error Detection

**Concept:** Detect errors before they occur.

```typescript
// Future: Predictive error detection
interface PredictiveErrorDetection {
  // Analyze patterns to predict failures
  predictFailure(userId: string, operation: string): Promise<Prediction>;
  
  // Detect anomalous behavior
  detectAnomaly(metrics: Metrics): Promise<Anomaly[]>;
  
  // Warn users before error occurs
  preemptiveWarning(userId: string): Promise<Warning[]>;
}

interface Prediction {
  likelihood: number;        // 0-1
  predictedError: JoltError;
  timeWindow: TimeWindow;
  mitigationSuggestion: string;
}
```

---

## Long-Term Philosophy

### Reliability Improvement

The Error Handling System improves reliability over time:

| Aspect | How |
|--------|-----|
| **Faster Resolution** | Better error context speeds debugging |
| **Fewer Errors** | Pattern analysis prevents recurring errors |
| **Better UX** | User-friendly errors reduce frustration |
| **Proactive Detection** | Early warning prevents user impact |

### User Frustration Reduction

| Strategy | Impact |
|----------|--------|
| **Clear Messages** | Users understand what happened |
| **Recovery Options** | Users know what to do |
| **No Technical Jargon** | Messages are accessible |
| **Consistent Experience** | Same errors handled same way |

### Debugging Simplification

With proper error handling:

```
Without System:
❌ Error: "Something went wrong"
❌ No trace ID
❌ No context
❌ Can't reproduce

With System:
✅ Error: "INSUFFICIENT_BALANCE"
✅ Trace ID: abc-123-def
✅ Context: { userId, balance, required }
✅ Reproducible with test
```

### Scaling Support

The error handling system supports scaling:

| Scalability Concern | Solution |
|--------------------|----------|
| **More Users** | Error aggregation and trending |
| **More Features** | Consistent error patterns across features |
| **More Services** | Unified error taxonomy |
| **Higher Complexity** | Layer isolation contains errors |

---

## Implementation Notes

### Migration Checklist

1. **Define error taxonomy** — Establish all error categories and codes
2. **Create error base class** — Shared error type for all layers
3. **Update API clients** — Implement error normalization
4. **Update repositories** — Add error translation
5. **Update services** — Business error definitions
6. **Update hooks** — Error state management
7. **Update components** — Error presentation
8. **Implement logging** — Error tracking infrastructure
9. **Add monitoring** — Error alerting
10. **Write tests** — Error scenario coverage

### Next Steps

1. Create `src/errors/` directory with base error types
2. Define error code constants
3. Implement error translation utilities
4. Add error logging to API clients
5. Create user-facing error components
6. Implement retry logic
7. Add error monitoring infrastructure

---

*Building the future through the lens of the past.*
