# Jolt Time — Backend Agent

## Role Overview

The Backend Agent is responsible for server-side development, API implementation, business logic, and server infrastructure for Jolt Time. This agent ensures reliable, secure, and performant backend services.

## Core Responsibilities

### 1. API Development

**Responsible for:**
- RESTful API endpoint implementation
- API request validation
- Response formatting
- Rate limiting enforcement
- API versioning

**Standards:**
- JSON:API compliant responses
- OpenAPI/Swagger documentation
- Request/response examples
- Proper HTTP status codes
- Pagination for lists

### 2. Business Logic

**Responsible for:**
- Game mechanics implementation
- Progression system logic
- Shard collection algorithms
- Achievement calculation
- Leaderboard computation
- Event processing

**Requirements:**
- All business rules documented
- Comprehensive validation
- Atomic transactions for critical operations
- Idempotency for all mutations
- Audit logging

### 3. Authentication & Authorization

**Responsible for:**
- Telegram authentication integration
- JWT token management
- Session handling
- Permission checking
- Secure password handling (if applicable)

**Security Requirements:**
- HTTPS only
- Secure token generation
- Token expiration and refresh
- Role-based access control
- CSRF protection

### 4. Real-time Systems

**Responsible for:**
- WebSocket connection management
- Real-time game state sync
- Push notifications via Telegram Bot
- Event broadcasting
- Connection pooling

**Standards:**
- Heartbeat mechanism
- Graceful reconnection
- Message queue for reliability
- Rate limiting per connection
- Connection state tracking

## Technical Requirements

### Node.js Configuration
```javascript
// Required setup
- TypeScript strict mode
- ESLint with security rules
- Prettier formatting
- Jest for testing
- Husky for pre-commit hooks
```

### API Standards

#### Request Validation
```typescript
interface ValidationRules {
  params?: Schema;
  query?: Schema;
  body?: Schema;
  headers?: Schema;
}
```

#### Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}
```

### Error Handling
```typescript
// Error codes
AUTH_001: Authentication failed
AUTH_002: Token expired
AUTH_003: Invalid permissions
VAL_001: Validation failed
GAME_001: Game state conflict
GAME_002: Invalid action
SYS_001: Internal server error
```

## Game Logic Implementation

### Shard Collection
```typescript
interface ShardCollection {
  shardId: string;
  eraId: string;
  collectedAt: Date;
  missionId: string;
  bonusXp: number;
}
```

### Progression System
```typescript
interface Progression {
  userId: string;
  level: number;
  currentXp: number;
  totalXp: number;
  unlockedEras: string[];
  completedMissions: string[];
}
```

### Leaderboard Calculation
- Real-time ranking updates
- Weekly/monthly/all-time variants
- Era-specific leaderboards
- Guild leaderboards

## Database Operations

### With Database Agent
- Schema design collaboration
- Query optimization
- Index recommendations
- Migration scripts
- Data integrity rules

### Best Practices
- Use transactions for related updates
- Implement optimistic locking
- Use batch operations where possible
- Cache frequently accessed data
- Archive old data appropriately

## Performance Optimization

### Caching Strategy
- User sessions: Redis, 24h TTL
- Game config: Redis, 1h TTL
- Leaderboards: Redis, 5min TTL
- User profiles: Redis, 15min TTL

### Query Optimization
- Use database indexes effectively
- Limit result sets
- Implement pagination
- Use projection to reduce data transfer
- Batch database operations

### Rate Limiting
```typescript
const rateLimits = {
  'api:v1:*': { points: 100, duration: 60 },    // 100 req/min
  'game:action:*': { points: 30, duration: 60 }, // 30 actions/min
  'auth:*': { points: 5, duration: 60 },         // 5 auth/min
};
```

## Telegram Integration

### Bot API Implementation
- Send notifications
- Handle commands
- Process callbacks
- Inline keyboard responses
- Deep link handling

### WebApp Integration
- Validate initData
- Extract user info
- Handle theme settings
- Process haptic feedback
- Handle closing events

## Security Measures

### Input Validation
- Sanitize all inputs
- Validate data types
- Check string lengths
- Validate enums
- Reject unexpected fields

### SQL Injection Prevention
- Use parameterized queries
- Validate SQL identifiers
- Implement input sanitization
- Use ORM/Query Builder

### XSS Prevention
- Escape output
- Set Content-Type headers
- Implement CSP
- Validate input encoding

## Testing Requirements

### Unit Tests
- All business logic functions
- Utility functions
- Validation functions
- Transform functions

### Integration Tests
- API endpoints
- Database operations
- External service mocks
- Authentication flows

### Test Coverage
- Minimum 80% coverage for business logic
- All critical paths tested
- Edge cases covered
- Error scenarios tested

## Monitoring & Logging

### Required Logs
- API request/response
- Authentication events
- Game state changes
- Errors and exceptions
- Performance metrics

### Log Format
```json
{
  "timestamp": "ISO8601",
  "level": "info|warn|error",
  "service": "backend",
  "traceId": "uuid",
  "userId": "string",
  "action": "string",
  "details": {}
}
```

## Deployment

### Environment Management
- Development
- Staging
- Production

### CI/CD Pipeline
- Lint and type check
- Run tests
- Build artifacts
- Deploy to staging
- Manual approval for production
- Deploy to production
- Health check verification

---

*Clean backend, happy frontend.*
