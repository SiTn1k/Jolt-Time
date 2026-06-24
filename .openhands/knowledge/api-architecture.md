# Jolt Time — API Architecture and External Integrations

**Critical Priority:** API systems should be scalable, secure, and easy to maintain.

---

## Overview

Jolt Time operates as a Telegram Mini App with Supabase backend, requiring robust API architecture for frontend-backend communication, third-party integrations, and service interactions. This document defines the complete API philosophy, integration patterns, and architectural decisions for maintaining a scalable, secure, and maintainable API ecosystem.

---

## API Categories

### 1. Internal APIs

Internal APIs handle communication between Jolt Time's own services:

- **Frontend API** — Communication between Telegram Mini App and backend services
- **Backend Services API** — Inter-service communication within the backend
- **Bot API** — Communication between Telegram bot and game services
- **Admin API** — Internal administrative interfaces for game management
- **Webhook Handlers** — Internal processing of incoming webhook events

### 2. External APIs

External APIs enable communication with third-party services:

- **Telegram Bot API** — Outbound notifications and inbound message handling
- **Telegram Mini Apps API** — Mini App functionality and player interaction
- **AdsGram API** — Ad serving, reward verification, and analytics
- **Payment Provider APIs** — Telegram Stars, future payment integrations
- **Analytics APIs** — External analytics service integration

### 3. Telegram APIs

Telegram platform APIs enable deep platform integration:

- **Telegram Bot API** — Send messages, manage groups, handle callbacks
- **Telegram Mini Apps API** — Mini App launching, data sharing, user authentication
- **Telegram Login Widget** — Web authentication via Telegram
- **Telegram Payments API** — Process payments through Telegram platform
- **Telegram Passport API** — Identity verification (future)

### 4. Payment APIs

Payment APIs handle financial transactions:

- **Telegram Stars API** — Process Telegram Stars payments for in-app purchases
- **TON Connect API** — Future TON blockchain wallet integration
- **Payment Webhook Handlers** — Process payment confirmations and refunds
- **Subscription Management API** — Handle subscription creation, updates, cancellations

### 5. Analytics APIs

Analytics APIs collect and process game data:

- **In-Game Analytics API** — Player actions, engagement metrics, progression tracking
- **AdsGram Analytics API** — Ad performance, revenue metrics, campaign data
- **Economy Analytics API** — Currency flows, inflation metrics, economic health
- **Performance Analytics API** — API latency, error rates, system performance

---

## Service Communication Philosophy

### Frontend-Backend Communication

The Telegram Mini App frontend communicates exclusively with backend services:

- **RESTful API Calls** — Standard HTTP requests for data operations
- **Real-Time Updates** — WebSocket or polling for live game state
- **Authentication** — Telegram initData passed with each request
- **Error Handling** — Consistent error responses for client handling

### Backend-Database Communication

Backend services interact with Supabase for data persistence:

- **Supabase Client** — Official Supabase client library for database operations
- **Connection Pooling** — Efficient connection management through Supabase
- **Query Optimization** — Efficient queries with proper indexing
- **Transaction Support** — ACID-compliant transactions for critical operations

### Backend-Bot Communication

Game services and Telegram bot communicate for player notifications:

- **Message Queue** — Asynchronous message processing for notifications
- **Shared State** — Bot reads game state for context-aware messages
- **Callback Handling** — Bot handles player responses to inline keyboards
- **Scheduled Notifications** — Bot triggers based on game events

### Telegram Bot-Telegram Platform Communication

The Telegram bot communicates directly with Telegram servers:

- **Bot API Calls** — Send messages, edits, answers to callbacks
- **Webhook Receivers** — Receive player messages and callbacks
- **File Handling** — Download and upload files for bot interactions
- **Group Management** — Handle group commands and settings

### Future External Services Communication

Architecture supports future third-party integrations:

- **API Gateway Pattern** — Central entry point for external APIs
- **Authentication Middleware** — Verify requests from external services
- **Rate Limiting** — Protect against external service abuse
- **Contract Documentation** — Clear API contracts for all integrations

---

## API Security Philosophy

### Request Protection

All API requests are protected against common vulnerabilities:

- **HTTPS Only** — All API communication encrypted in transit
- **Input Validation** — Validate and sanitize all incoming data
- **SQL Injection Prevention** — Parameterized queries through Supabase client
- **XSS Prevention** — Sanitize data before storage and display
- **CSRF Protection** — Validate origin and authenticity of requests

### Authentication Security

Authentication verifies player identity and prevents impersonation:

- **Telegram initData Validation** — Verify initData hash from Telegram Mini App
- **Timestamp Validation** — Reject requests with stale authentication
- **Session Tokens** — Secure session management with expiration
- **Token Refresh** — Automatic token refresh before expiration
- **Secure Storage** — Tokens stored securely, never logged

### Sensitive Operations

Sensitive operations require additional verification:

- **Payment Operations** — Webhook verification, idempotency checks
- **Account Changes** — Additional authentication for profile changes
- **Destructive Actions** — Confirmation required for deletions
- **Administrative Actions** — Elevated permissions and audit logging
- **Economy Operations** — Validation of all currency transactions

---

## Authentication Notes

### Telegram Authentication

Telegram Mini App authentication through platform-provided data:

**Authentication Flow:**
1. Telegram Mini App receives initData when launched
2. Frontend sends initData with each API request
3. Backend validates initData hash using bot token
4. Validated user data extracted for session creation
5. Session token returned for subsequent requests

**initData Validation:**
- Verify hash matches computed hash
- Check auth_date is recent (within 24 hours)
- Validate user data structure
- Extract user_id for player identification

### Session Validation

Backend sessions maintain player state across requests:

**Session Management:**
- Session token generated on successful authentication
- Token included in Authorization header
- Server validates token on each request
- Sessions expire after inactivity period
- Logout invalidates session immediately

**Session Security:**
- Tokens are cryptographically random
- Server-side session storage in Supabase
- Session metadata tracked (IP, user agent, created time)
- Concurrent session limits per player

### Future Account Systems

Architecture supports future account system evolution:

- **Multi-Platform Login** — Future support for web or mobile app logins
- **Account Linking** — Link Telegram accounts to other platforms
- **Account Recovery** — Secure recovery through verified email/phone
- **Guest Sessions** — Temporary sessions for unauthenticated players

---

## External Integrations

### Telegram Bot API

The Telegram bot enables player notifications and commands:

**Capabilities:**
- Send text messages and media
- Handle inline keyboards and callbacks
- Manage group commands
- Process payments via Telegram

**Integration Points:**
- Notification delivery for game events
- Player command processing
- Reminder and schedule management
- Support ticket notifications

### Telegram Mini Apps

Telegram Mini Apps provide the in-game experience:

**Capabilities:**
- Launch game interface within Telegram
- Access to Telegram user data
- Secure payment through Telegram
- Share functionality through Telegram

**Integration Points:**
- Game loading and initialization
- Player authentication
- In-game purchases
- Achievement sharing

### AdsGram

AdsGram provides video ad monetization:

**Capabilities:**
- Serve rewarded video ads
- Track ad completion
- Deliver player rewards
- Provide analytics

**Integration Points:**
- Ad request from game client
- Ad completion callback
- Reward grant verification
- Analytics collection

### Supabase

Supabase provides backend-as-a-service:

**Capabilities:**
- PostgreSQL database
- Authentication services
- Real-time subscriptions
- File storage

**Integration Points:**
- Player data storage
- Game state management
- Authentication
- File assets storage

### Telegram Stars

Telegram Stars enable in-app purchases:

**Capabilities:**
- Process Star payments
- Handle refunds
- Provide purchase receipts
- Manage subscription via Stars

**Integration Points:**
- Purchase initiation
- Payment confirmation
- Subscription management
- Receipt validation

### TON Connect

TON Connect enables blockchain wallet integration (future):

**Capabilities:**
- Connect TON wallets
- Sign transactions
- Verify wallet ownership
- Process TON payments

**Integration Points:**
- Wallet connection
- Transaction signing
- NFT minting (future)
- Marketplace transactions (future)

---

## Response Philosophy

### Predictable Results

API responses follow consistent patterns:

**Success Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "ISO-8601"
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "timestamp": "ISO-8601"
}
```

### Error Handling

Errors are categorized and handled consistently:

**Error Categories:**
- **400 Bad Request** — Invalid input or parameters
- **401 Unauthorized** — Missing or invalid authentication
- **403 Forbidden** — Valid auth but insufficient permissions
- **404 Not Found** — Resource does not exist
- **429 Too Many Requests** — Rate limit exceeded
- **500 Internal Error** — Server-side error

**Error Recovery:**
- Client errors require client-side fixes
- Server errors logged and investigated
- Retry guidance provided for transient errors
- Clear error messages aid debugging

### Future Expansion

API responses support future feature additions:

- **Extensible Data Structures** — Responses include version indicators
- **Unknown Field Tolerance** — Clients ignore unknown response fields
- **Pagination Support** — List endpoints support pagination parameters
- **Sparse Fieldsets** — Clients can request specific fields

---

## Versioning Philosophy

### API Updates

APIs evolve with careful change management:

**Change Categories:**
- **Additive Changes** — New fields, endpoints, or parameters (non-breaking)
- **Behavioral Changes** — Modified response format (potentially breaking)
- **Breaking Changes** — Removed fields, changed types (breaking)

**Change Process:**
1. Changes proposed and reviewed
2. Staging environment testing
3. Gradual rollout to production
4. Deprecation notices for breaking changes
5. Migration guides for major versions

### Backward Compatibility

Backward compatibility preserves existing client functionality:

**Compatibility Rules:**
- Never remove fields from responses without deprecation
- Never change field types or meanings
- Never change parameter names or types
- Add new optional parameters only
- Maintain semantic meaning of existing fields

**Deprecation Process:**
- Announce deprecation in API response headers
- Provide migration timeline
- Maintain old endpoint alongside new
- Remove deprecated elements after transition period

### Future Versions

Versioning strategy supports future API evolution:

**URL Versioning:**
- Major versions in URL path (e.g., /v1/, /v2/)
- Current version at stable endpoint
- Previous version maintained during transition

**Header Versioning:**
- Version specified in request headers
- Allows for smoother transitions
- Reduces URL complexity

---

## Rate Limiting Philosophy

### Abuse Prevention

Rate limiting protects against malicious usage:

**Limits by Endpoint Type:**
- **Public Endpoints** — Stricter limits to prevent scraping
- **Authenticated Endpoints** — Per-player limits based on usage patterns
- **Admin Endpoints** — Internal limits based on role
- **Webhooks** — Per-source limits for external services

**Abuse Detection:**
- Unusual request patterns flagged
- Automated blocking of detected abuse
- Manual review for suspected abuse
- Gradual limit increases for good actors

### Spam Request Prevention

Spam protection prevents excessive automated requests:

**Request Throttling:**
- Per-second request limits
- Per-minute request limits
- Per-hour request limits
- Concurrent connection limits

**Challenge Systems:**
- CAPTCHA for suspicious activity
- Proof-of-work for API access (future)
- Request queuing under load

### Overload Protection

Rate limiting prevents system overload:

**Load Shedding:**
- Reject requests before processing under extreme load
- Prioritize critical operations (gameplay over analytics)
- Queue non-critical requests for later processing

**Graceful Degradation:**
- Return cached data when overwhelmed
- Provide clear retry-after guidance
- Maintain core gameplay when possible

---

## API Monitoring Notes

### Response Time Tracking

API performance monitored for optimal player experience:

**Metrics Tracked:**
- Average response time per endpoint
- P50, P95, P99 latency percentiles
- Response time by player region
- Response time by time of day

**Performance Targets:**
- API responses < 200ms for P95
- Critical endpoints < 100ms for P95
- Database queries < 50ms for P95
- Slow query alerts for > 1s queries

### Failure Rate Monitoring

API failures tracked and analyzed:

**Failure Metrics:**
- Total failed requests by endpoint
- Failure rate as percentage of total
- Failure types distribution
- Player-affecting vs. non-affecting failures

**Alerting:**
- Error rate spike alerts
- Circuit breaker state changes
- Service degradation notifications

### Endpoint Usage Analysis

API usage patterns inform optimization:

**Usage Metrics:**
- Requests per endpoint per day
- Most and least used endpoints
- Usage trends over time
- Peak usage times and days

**Optimization Insights:**
- Identify endpoints needing optimization
- Discover unused endpoints for cleanup
- Guide capacity planning
- Inform caching strategies

---

## AdsGram Integration Notes

AdsGram remains one of the primary revenue systems for the project. API integration must be robust and reliable.

### Reward Callbacks

Player ad rewards require reliable callback handling:

**Callback Processing:**
1. Player completes ad view
2. AdsGram sends callback to Jolt Time
3. Server validates callback authenticity
4. Reward granted to player
5. Reward recorded in analytics

**Reliability:**
- Idempotent callback processing
- Duplicate callback detection
- Failed callback retry logic
- Callback queue for reliability

### Completion Verification

Ad completion must be verified before rewarding:

**Verification Steps:**
- Validate callback signature
- Check player eligibility
- Verify ad was actually completed
- Confirm reward amount
- Record completion in database

**Security:**
- Callback signature verification
- Player ID validation
- Reward amount validation
- Fraud detection for suspicious completions

### Analytics Collection

Accurate analytics essential for revenue optimization:

**Data Collected:**
- Ad view count per player
- Completion rate per ad
- Revenue per impression
- Player engagement patterns
- Campaign performance metrics

**Collection Process:**
- Real-time event collection
- Batch processing for detailed analytics
- Aggregation for reporting
- Retention for historical analysis

---

## Telegram Integration Philosophy

### Deep Links

Deep links enable direct navigation to specific content:

**Deep Link Types:**
- **Profile Links** — Open player profiles
- **Event Links** — Direct to specific events
- **Achievement Links** — Share achievements
- **Referral Links** — Invite friends to game

**Implementation:**
- Consistent URL format across platforms
- Server-side validation of deep link parameters
- Fallback handling for invalid links
- Analytics tracking for deep link usage

### Notifications

Telegram notifications keep players engaged:

**Notification Types:**
- **Event Reminders** — Tournament and event start alerts
- **Daily Bonuses** — Remind players to claim daily rewards
- **Friend Activity** — Friend achievements and requests
- **Marketplace** — Sale alerts and expiring listings

**Best Practices:**
- Respect notification frequency limits
- Allow player opt-out preferences
- Personalize content where possible
- Clear, concise message formatting

### Mini App Interactions

Mini App interactions leverage Telegram platform capabilities:

**Platform Features:**
- Access Telegram user data securely
- Share content through Telegram
- Process payments via Telegram
- Achievement posting to Telegram

**Integration Points:**
- Game launch with user context
- In-app navigation and state
- Purchase flow through Telegram
- Social sharing of achievements

---

## Future Expansion Notes

The following features are documented for future consideration:

### Public APIs

Future public API for third-party developers:

- **Developer Portal** — API documentation and key management
- **Rate Limited Access** — Tiered access based on subscription
- **Webhooks** — Event notifications for integrated apps
- **Analytics Dashboard** — Usage metrics for API consumers

### Creator APIs

APIs for content creators and influencers:

- **Content Management** — Upload and manage creator content
- **Analytics Access** — View performance of shared content
- **Reward Management** — Creator-specific reward pools
- **Community Tools** — Manage creator communities

### Partner Integrations

APIs for official partners and collaborators:

- **Partner Dashboard** — Partner-specific management interface
- **Data Sharing APIs** — Controlled data access for partners
- **Co-Marketing Tools** — Joint promotion capabilities
- **Revenue Sharing** — Automated partner revenue calculations

### Webhook Support

Enhanced webhook capabilities for real-time integrations:

- **Custom Webhooks** — Partners can register custom endpoints
- **Event Filtering** — Subscribe to specific event types
- **Retry Logic** — Automatic retry for failed deliveries
- **Signature Verification** — Secure webhook authentication

---

## Long-Term Philosophy

Jolt Time's API architecture reflects core principles:

### Remain Modular

API design maintains clear boundaries:

- **Service Isolation** — Services communicate through defined interfaces
- **Single Responsibility** — Each endpoint has clear purpose
- ** Loose Coupling** — Services independent of others
- **Clear Contracts** — API specifications well-documented

### Support Growth

Architecture scales with player base:

- **Horizontal Scaling** — Add capacity by adding servers
- **Caching Layers** — Reduce database load
- **Async Processing** — Handle bursts without blocking
- **Efficient Protocols** — Minimize data transfer

### Simplify Maintenance

Clean design reduces operational burden:

- **Consistent Patterns** — Same approach across all endpoints
- **Clear Documentation** — Up-to-date API docs
- **Predictable Behavior** — No surprises for developers
- **Comprehensive Testing** — High test coverage for reliability

---

## Implementation Notes

### Supabase Integration

Supabase provides core API infrastructure:

- Supabase auto-generated APIs for database operations
- Custom API endpoints for game-specific logic
- Real-time subscriptions for live updates
- Row-level security for data protection

### Security Integration

API security follows principles from `.openhands/knowledge/security-system.md`:

- All endpoints require appropriate authentication
- Sensitive operations require additional verification
- Rate limiting protects against abuse
- Comprehensive audit logging

### Telegram Integration

Telegram APIs require careful implementation:

- Bot API calls rate-limited by Telegram
- Mini App authentication validated on each request
- Deep links validated before processing
- Notifications respect Telegram's guidelines

---

*Last Updated: 2026-06-24*

*Building the future through the lens of the past.*
