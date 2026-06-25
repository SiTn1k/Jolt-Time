# API Client Layer Architecture

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Status:** Architecture Specification

---

## Table of Contents

1. [Overview](#overview)
2. [API Client Philosophy](#api-client-philosophy)
3. [API Client Categories](#api-client-categories)
4. [Folder Structure](#folder-structure)
5. [Supabase Client Architecture](#supabase-client-architecture)
6. [RPC Client Architecture](#rpc-client-architecture)
7. [Edge Function Client Architecture](#edge-function-client-architecture)
8. [Telegram Client Architecture](#telegram-client-architecture)
9. [AdsGram Client Architecture](#adsgram-client-architecture)
10. [Analytics Client Architecture](#analytics-client-architecture)
11. [Request Lifecycle Philosophy](#request-lifecycle-philosophy)
12. [Error Handling Standards](#error-handling-standards)
13. [Authentication Philosophy](#authentication-philosophy)
14. [Response Standardization Philosophy](#response-standardization-philosophy)
15. [Performance Philosophy](#performance-philosophy)
16. [Testing Philosophy](#testing-philosophy)
17. [Future Expansion Notes](#future-expansion-notes)
18. [Long-Term Philosophy](#long-term-philosophy)

---

## Overview

The API Client Layer establishes Jolt Time's **External Communication Gateway** — a unified system for all requests to external services, databases, and third-party platforms. This architectural layer ensures consistent communication patterns, centralized configuration, and simplified maintenance.

### Core Principle

```
Services → API Clients → External Systems
```

**Rule:** Repositories and Services MUST NEVER directly construct raw requests to external systems. All communication MUST pass through standardized API Clients.

### Architecture Context

```
┌─────────────────────────────────────────────────────────────┐
│                      Components                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Hooks                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Services                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Repositories                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Supabase │ RPC │ Edge │ Telegram │ AdsGram │ Analytics    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Systems                          │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ Supabase │ RPC Fn   │ Edge Fn  │ Telegram │ AdsGram         │
└──────────┴──────────┴──────────┴──────────┴─────────────────┘
```

---

## API Client Philosophy

### Standardization of Communication

API Clients enforce consistent communication patterns across all external integrations:

| Aspect | Standardization |
|--------|----------------|
| **Request Format** | All clients use consistent request builders |
| **Response Handling** | Unified response normalization |
| **Error Handling** | Consistent error types and retry logic |
| **Authentication** | Standard token management |
| **Logging** | Centralized request/response logging |

### Centralization of Configuration

All external service configuration is centralized within API Clients:

```typescript
// Configuration centralized in client
class SupabaseClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;
  
  // All configuration managed here
}
```

**Benefits:**
- Single source of truth for service URLs
- Consistent authentication headers
- Unified timeout and retry policies
- Centralized API key management

### Simplification of Maintenance

Centralized clients reduce maintenance burden:

| Without API Client | With API Client |
|-------------------|-----------------|
| Scattered request construction | Single location for requests |
| Duplicate authentication logic | Centralized auth |
| Inconsistent error handling | Unified error patterns |
| Scattered API keys | Centralized key management |
| Hard to test | Easy mocking and testing |

---

## API Client Categories

### Category Overview

| Category | Client | Purpose |
|----------|--------|---------|
| **Database Client** | SupabaseClient | PostgreSQL database access |
| **RPC Client** | RpcClient | Supabase RPC function execution |
| **Edge Client** | EdgeFunctionClient | Edge Function invocation |
| **Platform Client** | TelegramClient | Telegram Bot API integration |
| **Monetization Client** | AdsGramClient | AdsGram SDK communication |
| **Analytics Client** | AnalyticsClient | Event tracking and metrics |

### Client Responsibilities

#### Supabase Client
Manages all direct database operations through the Supabase PostgreSQL interface.

#### RPC Client
Handles execution of Supabase Remote Procedure Calls with parameter validation.

#### Edge Function Client
Invokes Supabase Edge Functions for server-side business logic.

#### Telegram Client
Integrates with Telegram Bot API for platform-specific operations.

#### AdsGram Client
Manages advertisement requests, reward verification, and monetization tracking.

#### Analytics Client
Provides unified event tracking and performance metrics collection.

---

## Folder Structure

### API Client Directory Architecture

```
src/
├── api/
│   ├── index.ts                      # Client exports and factory
│   ├── base/
│   │   ├── BaseClient.ts             # Abstract base class
│   │   ├── ClientConfig.ts           # Configuration types
│   │   ├── RequestBuilder.ts         # Request construction
│   │   ├── ResponseHandler.ts        # Response normalization
│   │   └── types.ts                  # Shared client types
│   ├── supabase/
│   │   ├── index.ts
│   │   ├── SupabaseClient.ts         # Database client
│   │   ├── AuthClient.ts             # Authentication client
│   │   └── RealtimeClient.ts         # Realtime subscriptions
│   ├── rpc/
│   │   ├── index.ts
│   │   ├── RpcClient.ts              # RPC executor
│   │   └── validators/              # Parameter validators
│   ├── edge-functions/
│   │   ├── index.ts
│   │   ├── EdgeFunctionClient.ts     # Edge function invoker
│   │   └── handlers/                 # Function-specific handlers
│   ├── telegram/
│   │   ├── index.ts
│   │   ├── TelegramClient.ts         # Bot API client
│   │   ├── DeepLinkClient.ts         # Deep link handling
│   │   └── ShareClient.ts            # Share functionality
│   ├── adsgram/
│   │   ├── index.ts
│   │   ├── AdsGramClient.ts          # AdsGram integration
│   │   ├── AdRequestClient.ts        # Ad request handling
│   │   └── RewardClient.ts           # Reward verification
│   └── analytics/
│       ├── index.ts
│       ├── AnalyticsClient.ts        # Analytics aggregator
│       ├── EventClient.ts            # Event tracking
│       └── MetricsClient.ts          # Metrics collection
```

### Separation from Services

```
src/services/          # Business logic (uses API clients)
src/repositories/      # Data access (uses API clients)
src/api/              # API clients (direct external communication)
```

---

## Supabase Client Architecture

### Responsibilities

The Supabase Client is the central database access layer:

| Responsibility | Description |
|----------------|-------------|
| **Authentication** | Manage user sessions, JWT tokens, and auth state |
| **Database Access** | Execute queries against PostgreSQL tables |
| **Realtime Connections** | Subscribe to database changes via Supabase Realtime |
| **File Storage** | Handle file uploads and downloads via Storage API |

### Authentication

```typescript
interface SupabaseAuthConfig {
  // Session management
  persistSession: boolean;
  autoRefreshToken: boolean;
  
  // Token configuration
  refreshTokenRetryAttempts: number;
  tokenRefreshInterval: number;
  
  // Security
  secureStorage: boolean;
  storageKeyPrefix: string;
}
```

**Authentication Methods:**

| Method | Purpose |
|--------|---------|
| `signInWithPassword()` | Email/password authentication |
| `signInWithOAuth()` | OAuth provider authentication |
| `signInWithTelegram()` | Telegram-based authentication |
| `signOut()` | Clear session and tokens |
| `refreshSession()` | Refresh expired tokens |

### Database Access

```typescript
interface SupabaseDatabaseConfig {
  // Connection
  url: string;
  headers: Record<string, string>;
  
  // Query settings
  defaultSelectLimit: number;
  queryTimeout: number;
  
  // Retry policy
  maxRetries: number;
  retryDelay: number;
}
```

**Query Pattern:**

```typescript
// All database access through standardized query builder
class SupabaseClient {
  from(table: string): QueryBuilder {
    return new QueryBuilder(this.url, this.headers, table);
  }
  
  // Helper methods for common operations
  async get<T>(table: string, id: string): Promise<T | null>;
  async getMany<T>(table: string, filters: Filter[]): Promise<T[]>;
  async insert<T>(table: string, data: Partial<T>): Promise<T>;
  async update<T>(table: string, id: string, data: Partial<T>): Promise<T>;
  async delete(table: string, id: string): Promise<boolean>;
}
```

### Realtime Connections

```typescript
interface RealtimeConfig {
  // Subscription types
  subscribeToTables: string[];
  subscribeToChannels: string[];
  
  // Event handling
  onInsert?: (payload) => void;
  onUpdate?: (payload) => void;
  onDelete?: (payload) => void;
  
  // Connection management
  reconnectInterval: number;
  maxReconnectAttempts: number;
}
```

---

## RPC Client Architecture

### Responsibilities

The RPC Client handles execution of Supabase Remote Procedure Calls:

| Responsibility | Description |
|----------------|-------------|
| **RPC Execution** | Invoke stored procedures with parameters |
| **Parameter Validation** | Validate input before execution |
| **Response Normalization** | Standardize RPC response format |
| **Error Handling** | Handle RPC-specific errors |

### RPC Execution

```typescript
interface RpcClientConfig {
  // Endpoint
  supabaseUrl: string;
  functionName: string;
  
  // Request settings
  timeout: number;
  headers: Record<string, string>;
  
  // Retry policy
  maxRetries: number;
  retryableErrors: string[];
}
```

**Execution Pattern:**

```typescript
class RpcClient {
  constructor(config: RpcClientConfig) {}
  
  // Execute RPC with typed parameters
  async execute<TInput, TOutput>(
    functionName: string,
    params: TInput
  ): Promise<RpcResult<TOutput>> {
    // 1. Validate parameters
    // 2. Construct request
    // 3. Execute with retry
    // 4. Normalize response
    // 5. Handle errors
  }
}
```

### Parameter Validation

```typescript
// RPC parameters should be validated before execution
interface RpcValidator<T> {
  validate(input: unknown): T;
  validateSync(input: unknown): T;  // For sync validation
  schema: z.ZodSchema;              // Zod schema for type safety
}

// Example validator
const ClaimRewardParamsSchema = z.object({
  userId: z.string().uuid(),
  multiplier: z.number().min(1).max(3).default(1),
  eventId: z.string().uuid().optional()
});
```

### Response Normalization

```typescript
// All RPC responses normalized to consistent format
interface RpcResult<T> {
  success: boolean;
  data?: T;
  error?: RpcError;
  metadata?: {
    executionTime: number;
    calledAt: Date;
  };
}

interface RpcError {
  code: string;
  message: string;
  details?: unknown;
}
```

---

## Edge Function Client Architecture

### Responsibilities

The Edge Function Client invokes serverless Edge Functions:

| Responsibility | Description |
|----------------|-------------|
| **Secure Invocation** | Handle authentication for Edge Function calls |
| **Request Handling** | Construct properly formatted requests |
| **Response Processing** | Parse and validate Edge Function responses |
| **Error Mapping** | Convert Edge Function errors to client errors |

### Secure Invocation

```typescript
interface EdgeFunctionConfig {
  // Endpoint
  supabaseUrl: string;
  functionsPath: string;
  
  // Authentication
  serviceRoleKey?: string;      // For admin operations
  userJwt?: string;             // For user-scoped operations
  
  // Request settings
  timeout: number;
  headers: Record<string, string>;
}
```

**Invocation Pattern:**

```typescript
class EdgeFunctionClient {
  constructor(config: EdgeFunctionConfig) {}
  
  // Invoke edge function
  async invoke<TRequest, TResponse>(
    functionName: string,
    request: TRequest,
    options?: {
      headers?: Record<string, string>;
      mode?: 'user' | 'service';
    }
  ): Promise<EdgeFunctionResult<TResponse>> {
    // 1. Construct URL
    // 2. Add authentication headers
    // 3. Execute request
    // 4. Parse response
    // 5. Handle errors
  }
}
```

### Request Handling

```typescript
interface EdgeFunctionRequest<T> {
  // Function identifier
  functionName: string;
  
  // Request body
  data: T;
  
  // Configuration
  headers?: Record<string, string>;
  
  // Execution options
  mode: 'user' | 'service';  // Determines auth context
}
```

### Response Processing

```typescript
interface EdgeFunctionResult<T> {
  success: boolean;
  data?: T;
  error?: EdgeFunctionError;
  statusCode: number;
  headers: Record<string, string>;
}

interface EdgeFunctionError {
  code: string;
  message: string;
  httpStatus: number;
}
```

---

## Telegram Client Architecture

### Responsibilities

The Telegram Client integrates with Telegram Bot API:

| Responsibility | Description |
|----------------|-------------|
| **Bot API Integration** | Send requests to Telegram Bot API |
| **User Data Handling** | Process Telegram user information |
| **Deep Link Processing** | Handle `/start` with parameters |
| **Share Operations** | Generate shareable links and content |

### Telegram SDK Integration

```typescript
interface TelegramClientConfig {
  // Bot configuration
  botToken: string;
  apiBaseUrl: string;
  
  // Request settings
  timeout: number;
  maxRetries: number;
  
  // Feature flags
  enabledPlugins: TelegramPlugin[];
}

type TelegramPlugin = 
  | 'messages'
  | 'inlineKeyboard'
  | 'callbackQuery'
  | 'preCheckoutQuery'
  | 'shippingQuery';
```

**Core Methods:**

| Method | Purpose |
|--------|---------|
| `sendMessage()` | Send text message to user |
| `editMessageText()` | Edit existing message |
| `answerCallbackQuery()` | Respond to callback query |
| `sendGame()` | Send game using Game API |
| `createInvoiceLink()` | Generate payment invoice link |

### User Data Handling

```typescript
// Telegram user data structure
interface TelegramUser {
  id: number;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium: boolean;
}

// Extended with Mini App data
interface TelegramInitData {
  queryId?: string;
  user: TelegramUser;
  receiver?: TelegramUser;
  chat?: TelegramChat;
  startParam?: string;
  authDate: number;
  hash: string;
}
```

### Deep Links

```typescript
interface DeepLinkClient {
  // Generate deep links
  createStartLink(params: StartLinkParams): string;
  createGameLink(params: GameLinkParams): string;
  createShareLink(params: ShareLinkParams): string;
  
  // Parse deep links
  parseStartPayload(startParam: string): StartPayload;
}

interface StartLinkParams {
  startGroup?: string;    // For bot-to-group sharing
  startApp?: string;      // For Mini App deep linking
  payload?: string;       // Custom payload data
}
```

### Share Operations

```typescript
interface ShareClient {
  // Generate shareable content
  createShareText(params: ShareTextParams): string;
  createShareGame(params: ShareGameParams): ShareContent;
  createInviteLink(): string;
  
  // Native share (Mini App)
  nativeShare(params: NativeShareParams): Promise<ShareResult>;
}

interface NativeShareParams {
  title: string;
  text: string;
  url?: string;
  buttons?: ShareButton[];
}
```

---

## AdsGram Client Architecture

### Responsibilities

AdsGram remains one of the primary revenue systems for Jolt Time. The AdsGram Client manages all advertising operations:

| Responsibility | Description |
|----------------|-------------|
| **Ad Requests** | Request ads from AdsGram SDK |
| **Reward Verification** | Verify ad completion and calculate rewards |
| **Monetization Tracking** | Track impressions, revenue, and performance |
| **Callback Handling** | Process AdsGram callbacks and events |

### Ad Requests

```typescript
interface AdsGramClientConfig {
  // SDK configuration
  adsGramToken: string;
  environment: 'development' | 'production';
  
  // Ad settings
  defaultRewardAmount: number;
  dailyLimits: Record<AdCategory, number>;
  cooldownSeconds: Record<AdCategory, number>;
  
  // Retry policy
  maxRetries: number;
  retryDelay: number;
}
```

**Ad Categories:**

| Category | Description | Typical Reward |
|----------|-------------|----------------|
| `REWARDED` | Player-initiated ad view | 100 coins |
| `BONUS_REWARD` | Bonus content ad | 250 coins |
| `DAILY_BONUS` | Daily bonus ad | 500 coins |
| `EXTRA_ENERGY` | Energy refill ad | 50 energy |
| `EXPEDITION_SPEEDUP` | Speed boost ad | 1 boost |

### Reward Verification

```typescript
interface RewardVerificationConfig {
  // Verification settings
  verifyOnDevice: boolean;
  verifyOnServer: boolean;
  serverEndpoint: string;
  
  // Security
  secretKey: string;
  signatureAlgorithm: 'HMAC-SHA256';
}

interface AdsGramClient {
  // Request and show ad
  requestAd(category: AdCategory): Promise<AdRequestResult>;
  
  // Verify completion
  verifyReward(viewId: string): Promise<RewardVerificationResult>;
  
  // Check availability
  isAdAvailable(category: AdCategory): Promise<boolean>;
}
```

### Monetization Tracking

```typescript
interface MonetizationTrackingConfig {
  // Analytics endpoints
  analyticsEndpoint: string;
  batchSize: number;
  flushInterval: number;
}

interface AdsGramClient {
  // Track impressions
  trackImpression(impression: AdImpression): Promise<void>;
  
  // Track revenue
  trackRevenue(revenue: AdRevenue): Promise<void>;
  
  // Get analytics
  getPerformanceMetrics(options: MetricsOptions): Promise<AdsMetrics>;
}
```

### Callback Handling

```typescript
// AdsGram callback events
interface AdsGramCallbacks {
  onAdShown?: (event: AdShownEvent) => void;
  onAdDismissed?: (event: AdDismissedEvent) => void;
  onRewardReady?: (event: RewardReadyEvent) => void;
  onError?: (event: AdErrorEvent) => void;
}

interface AdsGramClient {
  // Register callbacks
  setCallbacks(callbacks: AdsGramCallbacks): void;
  
  // Process background events
  processCallback(event: AdsGramEvent): Promise<void>;
}
```

---

## Analytics Client Architecture

### Responsibilities

The Analytics Client provides unified event tracking and metrics collection:

| Responsibility | Description |
|----------------|-------------|
| **Event Tracking** | Record game events with context |
| **Retention Tracking** | Monitor user engagement and retention |
| **Monetization Tracking** | Track revenue and conversion metrics |
| **Performance Tracking** | Monitor application performance |

### Event Tracking

```typescript
interface AnalyticsClientConfig {
  // Endpoint configuration
  endpoint: string;
  apiKey?: string;
  
  // Batch settings
  batchSize: number;
  flushInterval: number;
  maxQueueSize: number;
  
  // Privacy
  respectDnt: boolean;
  anonymizeIp: boolean;
}

interface AnalyticsEvent {
  // Event identification
  name: string;
  category: EventCategory;
  
  // Event data
  properties: Record<string, unknown>;
  
  // Context
  userId?: string;
  sessionId: string;
  timestamp: Date;
  
  // Environment
  platform: 'miniapp' | 'bot';
  version: string;
}
```

**Event Categories:**

| Category | Examples |
|----------|----------|
| `user` | sign_in, sign_out, profile_update |
| `game` | level_up, quest_complete, artifact_collected |
| `economy` | currency_earned, item_purchased, trade_completed |
| `social` | friend_added, guild_joined, message_sent |
| `monetization` | subscription_started, purchase_completed, ad_watched |
| `performance` | screen_load, api_latency, error_occurred |

### Retention Tracking

```typescript
interface RetentionClient {
  // Track user activity
  trackLogin(userId: string): Promise<void>;
  trackSessionStart(userId: string, sessionId: string): Promise<void>;
  trackSessionEnd(sessionId: string, duration: number): Promise<void>;
  
  // Retention metrics
  getRetentionMetrics(cohortDate: Date): Promise<RetentionMetrics>;
  getEngagementScore(userId: string): Promise<number>;
  
  // Cohort analysis
  getCohortAnalysis(options: CohortOptions): Promise<CohortData[]>;
}
```

### Monetization Tracking

```typescript
interface MonetizationClient {
  // Track revenue events
  trackPurchase(purchase: PurchaseEvent): Promise<void>;
  trackSubscription(event: SubscriptionEvent): Promise<void>;
  trackAdRevenue(event: AdRevenueEvent): Promise<void>;
  
  // Revenue metrics
  getRevenueMetrics(options: RevenueOptions): Promise<RevenueMetrics>;
  getLTV(userId: string): Promise<number>;
  getARPU(): Promise<number>;
}
```

### Performance Tracking

```typescript
interface PerformanceClient {
  // Web Vitals
  trackCoreWebVitals(metrics: WebVitals): Promise<void>;
  
  // Custom metrics
  trackMetric(name: string, value: number, tags?: Record<string, string>): Promise<void>;
  
  // Error tracking
  trackError(error: ErrorEvent): Promise<void>;
  
  // Latency tracking
  trackApiLatency(endpoint: string, duration: number): Promise<void>;
}
```

---

## Request Lifecycle Philosophy

### Lifecycle Stages

Every API request follows a standardized lifecycle:

```
┌─────────────────────────────────────────────────────────────┐
│  1. REQUEST CREATION                                        │
│     - Build request object                                  │
│     - Add authentication headers                             │
│     - Serialize request data                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. VALIDATION                                              │
│     - Validate parameters                                    │
│     - Check required fields                                 │
│     - Verify data types                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. EXECUTION                                               │
│     - Apply retry policy                                    │
│     - Execute HTTP request                                   │
│     - Handle timeouts                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. RESPONSE HANDLING                                        │
│     - Parse response                                         │
│     - Normalize data format                                  │
│     - Handle error responses                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  5. RESULT RETURN                                            │
│     - Return typed result                                    │
│     - Log request/response                                   │
│     - Update metrics                                         │
└─────────────────────────────────────────────────────────────┘
```

### Request Creation

```typescript
// Standardized request creation
interface RequestBuilder<T> {
  // Create new request
  create(endpoint: string): RequestBuilder<T>;
  
  // Add data
  withBody(data: T): RequestBuilder<T>;
  withQueryParams(params: Record<string, string>): RequestBuilder<T>;
  
  // Add headers
  withAuth(token: string): RequestBuilder<T>;
  withHeaders(headers: Record<string, string>): RequestBuilder<T>;
  
  // Configure
  withTimeout(ms: number): RequestBuilder<T>;
  withRetry(retryConfig: RetryConfig): RequestBuilder<T>;
  
  // Build and execute
  build(): Request;
  execute(): Promise<Response>;
}
```

### Validation

```typescript
// Pre-execution validation
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface RequestValidator {
  validateRequest<T>(request: T): ValidationResult;
  validateResponse<T>(response: unknown): T;
}
```

### Execution

```typescript
// Execution with retry support
interface ExecutionConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatusCodes: number[];
  retryableErrors: string[];
  
  // Exponential backoff
  useExponentialBackoff: boolean;
  maxRetryDelay: number;
}

interface ExecutionStrategy {
  execute<T>(request: Request, config: ExecutionConfig): Promise<T>;
}
```

### Response Handling

```typescript
// Response handling pattern
async function handleResponse<T>(response: Response): Promise<T> {
  // Check status
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  
  // Parse JSON
  const data = await response.json();
  
  // Validate response shape
  return validateResponse(data) as T;
}
```

---

## Error Handling Standards

### Error Types

```typescript
// Client-specific error types
class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends ApiError {
  constructor(message: string, public readonly originalError?: Error) {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

class TimeoutError extends ApiError {
  constructor(endpoint: string, timeout: number) {
    super(`Request to ${endpoint} timed out after ${timeout}ms`, 408, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

class RateLimitError extends ApiError {
  constructor(
    public readonly retryAfter?: number
  ) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}
```

### Retry Strategy

```typescript
interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  
  // Which errors to retry
  retryableStatusCodes: number[];
  retryableErrors: string[];
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['NETWORK_ERROR', 'TIMEOUT']
};
```

### Error Normalization

```typescript
// All errors normalized to consistent format
interface NormalizedError {
  code: string;           // Machine-readable code
  message: string;        // Human-readable message
  statusCode: number;     // HTTP status (0 for network errors)
  retryable: boolean;     // Whether the operation can be retried
  details?: unknown;      // Additional context
}

// Error handler interface
interface ErrorHandler {
  handle(error: unknown): NormalizedError;
  isRetryable(error: NormalizedError): boolean;
  getRetryDelay(error: NormalizedError, attempt: number): number;
}
```

---

## Authentication Philosophy

### User Sessions

```typescript
interface SessionConfig {
  // Storage
  storageBackend: 'memory' | 'localStorage' | 'sessionStorage';
  storageKeyPrefix: string;
  
  // Token management
  tokenRefreshThreshold: number;  // Refresh when this many seconds left
  refreshTokenRetryAttempts: number;
  
  // Security
  secureStorage: boolean;
  encryptTokens: boolean;
}
```

### Token Handling

```typescript
interface TokenManager {
  // Get current token
  getAccessToken(): string | null;
  
  // Refresh token
  refreshTokens(): Promise<boolean>;
  
  // Set tokens
  setTokens(accessToken: string, refreshToken: string): Promise<void>;
  
  // Clear tokens
  clearTokens(): Promise<void>;
  
  // Subscribe to token changes
  onTokenChange(callback: (tokens: Tokens | null) => void): () => void;
}
```

### Secure Communications

```typescript
// All external communications must use secure channels
interface SecurityConfig {
  // HTTPS only
  requireHttps: boolean;
  
  // Certificate validation
  validateCertificates: boolean;
  
  // CORS
  allowedOrigins: string[];
  
  // API key security
  apiKeyStorage: 'memory' | 'secureStorage';
  apiKeyRotation: boolean;
}
```

**Security Principles:**

| Principle | Implementation |
|-----------|----------------|
| **HTTPS Only** | All requests must use HTTPS |
| **Token Security** | Tokens stored securely, never in logs |
| **API Key Protection** | Keys stored server-side, never exposed to client |
| **Request Signing** | Critical operations use request signatures |

---

## Response Standardization Philosophy

### Success Responses

```typescript
// Standard success response format
interface ApiResponse<T> {
  success: true;
  data: T;
  metadata?: ResponseMetadata;
}

interface ResponseMetadata {
  timestamp: Date;
  requestId: string;
  executionTime: number;
  pagination?: PaginationInfo;
}
```

### Failure Responses

```typescript
// Standard error response format
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
  };
}
```

### Metadata Handling

```typescript
// Response metadata patterns
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  pagination?: {
    nextCursor?: string;
    prevCursor?: string;
  };
}

interface TimestampedResponse<T> {
  data: T;
  serverTime: Date;
  localTime: Date;
  timeOffset: number;  // Difference between server and local
}
```

### Response Validation

```typescript
// Validate response against expected shape
interface ResponseValidator<T> {
  validate(response: unknown): T;
  validateAsync(response: unknown): Promise<T>;
}

// Zod schema for type-safe validation
const UserResponseSchema = z.object({
  id: z.string().uuid(),
  telegramId: z.number(),
  username: z.string().optional(),
  displayName: z.string(),
  level: z.number(),
  experience: z.number()
});
```

---

## Performance Philosophy

### Request Reduction

```typescript
// Strategies to reduce duplicate requests
interface RequestDeduplicationConfig {
  enabled: boolean;
  windowMs: number;      // Deduplication window
  maxConcurrent: number;  // Max concurrent identical requests
}

// Example: Batch similar requests
class RequestBatcher {
  // Queue similar requests
  enqueue<T>(key: string, request: () => Promise<T>): Promise<T>;
  
  // Flush all pending requests
  flush(): Promise<void>;
  
  // Cancel pending requests
  cancelAll(): void;
}
```

### Caching Support

```typescript
// Caching interface for API clients
interface CacheConfig {
  enabled: boolean;
  ttl: number;           // Time to live in seconds
  maxSize: number;       // Max cache entries
  storage: 'memory' | 'localStorage';
}

interface CachedClient<T> {
  // Get with cache
  get(key: string, fetcher: () => Promise<T>): Promise<T>;
  
  // Invalidate cache
  invalidate(key: string): void;
  invalidatePattern(pattern: string): void;
  
  // Cache management
  clear(): void;
  getStats(): CacheStats;
}
```

### Network Optimization

```typescript
// Network optimization strategies
interface NetworkOptimizer {
  // Compress requests
  compressRequest<T>(data: T): CompressedData;
  
  // Decompress responses
  decompressResponse(data: CompressedData): unknown;
  
  // Connection reuse
  keepAlive: boolean;
  
  // Prefetching
  prefetchUrls: string[];
}

// Request compression
interface CompressionConfig {
  enabled: boolean;
  algorithm: 'gzip' | 'brotli';
  threshold: number;  // Only compress above this size
}
```

---

## Testing Philosophy

### Mocking Support

```typescript
// All clients support mocking for testing
interface MockableClient<T> {
  // Create mock instance
  createMock(overrides?: Partial<T>): T;
  
  // Setup mock responses
  mockResponse(method: string, response: unknown): void;
  
  // Setup mock errors
  mockError(method: string, error: Error): void;
  
  // Reset mock state
  resetMock(): void;
}

// Example mock setup
const mockSupabaseClient = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: mockUser })
      })
    })
  })
};
```

### Isolated Testing

```typescript
// Clients are independently testable
describe('SupabaseClient', () => {
  let client: SupabaseClient;
  let mockFetch: jest.Mock;
  
  beforeEach(() => {
    mockFetch = jest.fn();
    client = new SupabaseClient({
      url: 'http://test.supabase.co',
      fetch: mockFetch
    });
  });
  
  it('should handle errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    await expect(client.getUser('123')).rejects.toThrow('Network error');
  });
});
```

### Integration Testing

```typescript
// Integration test helpers
interface IntegrationTestConfig {
  // Test endpoints
  testEndpoint: string;
  
  // Test data
  testUserId: string;
  testDataPrefix: string;
  
  // Cleanup
  cleanupAfterEach: boolean;
}

// Test utilities
const TestHelpers = {
  async setupTestData(): Promise<TestData>;
  async cleanupTestData(): Promise<void>;
  async createMockUser(): Promise<MockUser>;
};
```

---

## Future Expansion Notes

These clients represent **future concepts** for potential implementation:

### AI Client

**Concept:** Unified client for AI service integrations.

```typescript
// Future: AI service integration
interface AIClient {
  // OpenAI / Claude / Gemini
  complete(prompt: string, options?: AIOptions): Promise<AIResponse>;
  embed(text: string): Promise<Embedding>;
  
  // Content generation
  generateGameContent(type: GameContentType): Promise<GameContent>;
  generateImage(prompt: string): Promise<ImageData>;
}
```

### Web3 Client

**Concept:** Client for blockchain and decentralized services.

```typescript
// Future: Web3 integration
interface Web3Client {
  // Wallet connection
  connectWallet(provider: WalletProvider): Promise<WalletConnection>;
  
  // Blockchain operations
  signTransaction(tx: Transaction): Promise<SignedTransaction>;
  broadcastTransaction(tx: SignedTransaction): Promise<string>;
  
  // NFT operations
  getNFTs(address: string): Promise<NFT[]>;
  transferNFT(from: string, to: string, nftId: string): Promise<string>;
}
```

### Creator Platform Client

**Concept:** Client for user-generated content platform.

```typescript
// Future: Creator economy
interface CreatorClient {
  // Content management
  publishContent(content: UGCContent): Promise<string>;
  updateContent(id: string, content: Partial<UGCContent>): Promise<void>;
  
  // Reviews
  submitForReview(contentId: string): Promise<ReviewRequest>;
  getReviewStatus(contentId: string): Promise<ReviewStatus>;
}
```

### NFT Client

**Concept:** Client for NFT marketplaces and minting.

```typescript
// Future: NFT marketplace
interface NFTClient {
  mint(artifactId: string, metadata: NFTMetadata): Promise<NFT>;
  list(nftId: string, price: Price): Promise<string>;
  buy(nftId: string, payment: Payment): Promise<Transaction>;
  transfer(nftId: string, to: string): Promise<Transaction>;
}
```

### External Partner API Client

**Concept:** Client for third-party integrations.

```typescript
// Future: Partner integrations
interface PartnerClient {
  // Partner management
  registerPartner(partner: PartnerInfo): Promise<string>;
  
  // API key management
  createApiKey(partnerId: string, scopes: string[]): Promise<ApiKey>;
  
  // Webhook handling
  registerWebhook(url: string, events: string[]): Promise<string>;
  processWebhook(event: WebhookEvent): Promise<void>;
}
```

---

## Long-Term Philosophy

### Centralization Benefits

The API Client Layer provides centralized external communication:

| Benefit | Description |
|---------|-------------|
| **Single Integration Point** | All external services accessed through clients |
| **Consistent Patterns** | Request/response patterns unified |
| **Easy Updates** | Change external service without affecting business logic |
| **Security Centralization** | Authentication and secrets in one place |

### Simplified Integrations

New external services integrate easily:

```
New External Service
        │
        ▼
┌───────────────────┐
│  Create API Client │  (Following established patterns)
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Update Repositories │ (No other changes needed)
└───────────────────┘
```

### Scalability Support

The API Client Layer enables horizontal scaling:

| Scalability Feature | Implementation |
|--------------------|----------------|
| **Request Batching** | Batch multiple requests into single call |
| **Caching** | Reduce redundant external calls |
| **Connection Pooling** | Reuse connections efficiently |
| **Load Balancing** | Distribute requests across instances |

### Reduced Technical Debt

Centralized clients reduce long-term debt:

| Without Clients | With Clients |
|----------------|--------------|
| Duplicate request code | Single implementation |
| Scattered API keys | Centralized management |
| Inconsistent error handling | Unified patterns |
| Hard to test | Easy mocking |
| Difficult to update | Single change updates all |

---

## Implementation Notes

### Migration from Current Architecture

**Current State:**
- Services directly use Supabase client
- AdsGram uses adapter pattern with direct SDK calls
- Telegram integration scattered across services

**Target State:**
```
Services → Repositories → API Clients → External Services
```

**Migration Steps:**
1. Create base API client classes
2. Create Supabase client with auth management
3. Create RPC client with validators
4. Create Edge Function client
5. Create Telegram client
6. Create AdsGram client with tracking
7. Create Analytics client
8. Update repositories to use API clients
9. Remove direct Supabase calls from services

### Next Steps

1. Define base client interfaces
2. Implement Supabase client wrapper
3. Add RPC client with validation
4. Implement Edge Function client
5. Create Telegram Bot API wrapper
6. Integrate AdsGram SDK through client
7. Add Analytics tracking client
8. Implement caching infrastructure
9. Add comprehensive tests

---

*Building the future through the lens of the past.*
