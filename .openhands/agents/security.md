# Jolt Time — Security Agent

## Role Overview

The Security Agent is responsible for application security, data protection, compliance, and security best practices for Jolt Time. This agent ensures that player data is protected and the application is secure against threats.

## Core Responsibilities

### 1. Security Architecture

**Responsible for:**
- Security design reviews
- Threat modeling
- Security requirements
- Security architecture decisions
- Compliance implementation

### 2. Authentication Security

**Telegram Authentication:**
```javascript
// Secure initData validation
function validateTelegramAuth(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  
  // Build data check string
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // Verify HMAC-SHA256
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return hash === calculatedHash;
}
```

**Session Management:**
- JWT tokens with short expiration (15 min)
- Refresh tokens with longer expiration (7 days)
- Token rotation on refresh
- Secure token storage
- Session invalidation on logout

### 3. Data Protection

**Encryption:**
```javascript
// Data at rest
- Supabase handles encryption at rest
- User-generated content encrypted

// Data in transit
- TLS 1.2+ required
- Certificate pinning recommended
- HSTS headers enabled

// Sensitive fields
- tokens hashed (bcrypt)
- PII fields encrypted
```

**Data Classification:**
| Category | Examples | Protection |
|----------|----------|------------|
| Public | Achievements, leaderboard | None |
| Private | Profile, progress | RLS policies |
| Sensitive | Auth tokens, session | Encryption |
| Personal | Email (if any), Telegram ID | RLS + Encryption |

### 4. Input Validation

**Validation Rules:**
```javascript
// All user inputs must be validated
const validationRules = {
  username: {
    type: 'string',
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
    sanitize: true
  },
  missionId: {
    type: 'string',
    pattern: /^[a-z0-9-]+$/,
    maxLength: 50
  },
  xpAmount: {
    type: 'integer',
    min: 0,
    max: 1000000
  }
};
```

**Sanitization:**
- HTML entities escaped
- SQL injection prevented (parameterized queries)
- XSS prevented (output encoding)
- Command injection prevented

### 5. API Security

**Rate Limiting:**
```javascript
const rateLimits = {
  global: { points: 100, duration: 60 },      // 100 req/min
  auth: { points: 5, duration: 60 },           // 5 attempts/min
  gameAction: { points: 30, duration: 60 },    // 30 actions/min
  shardCollection: { points: 10, duration: 60 } // Anti-cheat
};
```

**Request Validation:**
- Validate content-type
- Validate content-length
- Validate authorization header
- Validate rate limit headers

### 6. Database Security

**Row Level Security (RLS):**
```sql
-- User can only access own data
CREATE POLICY "user_data_isolation" ON player_progress
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Validate references
CREATE POLICY "shard_exists" ON player_shards
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shards WHERE id = shard_id
    )
  );
```

**Audit Logging:**
```sql
-- Log all data modifications
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  table_name TEXT,
  operation TEXT,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  ip_address INET,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. Telegram-Specific Security

**WebApp Security:**
```javascript
// Validate Telegram environment
if (!window.Telegram?.WebApp?.initData) {
  throw new SecurityError('Invalid environment');
}

// Verify initData integrity
const isValid = await validateTelegramAuth(
  window.Telegram.WebApp.initData
);

if (!isValid) {
  throw new SecurityError('Authentication failed');
}
```

**Security Checklist:**
- [ ] initData validation on server
- [ ] User ID extracted securely
- [ ] Theme data not trusted
- [ ] No sensitive data in initData
- [ ] InitData expiration checked

### 8. Compliance

**GDPR Compliance:**
- Consent management
- Data export functionality
- Data deletion (right to be forgotten)
- Privacy policy
- Cookie consent
- Data retention policies

**COPPA Compliance:**
- Age verification consideration
- Parental consent for under 13
- Limited data collection for minors
- Parental controls

**Telegram Policy Compliance:**
- No spam or abuse
- Proper data handling
- User consent for notifications
- Clear monetization disclosure

### 9. Security Monitoring

**Logging:**
```javascript
// Security events to log
const securityEvents = {
  LOGIN_SUCCESS: 'info',
  LOGIN_FAILED: 'warn',
  RATE_LIMIT_EXCEEDED: 'warn',
  INVALID_TOKEN: 'warn',
  SUSPICIOUS_ACTIVITY: 'error',
  DATA_BREACH_ATTEMPT: 'critical'
};
```

**Monitoring:**
- Failed login attempts
- Rate limit violations
- Unusual API patterns
- Database anomalies
- Session anomalies

**Alerting:**
- >10 failed logins/minute
- Rate limit breach cascade
- Database connection exhaustion
- Unusual traffic patterns

### 10. Vulnerability Management

**Dependency Scanning:**
```bash
# npm audit for vulnerabilities
npm audit --audit-level=high

# Snyk or Dependabot for monitoring
# GitHub Dependabot enabled
```

**Security Checklist:**
- [ ] OWASP Top 10 mitigated
- [ ] No hardcoded secrets
- [ ] Dependencies up to date
- [ ] Security headers configured
- [ ] CORS properly configured

### 11. Security Headers

```javascript
// Required security headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

### 12. Secure Development Practices

**Code Review Checklist:**
- Authentication/authorization reviewed
- Input validation present
- Output encoding present
- Error handling doesn't leak info
- No sensitive data in logs
- No hardcoded secrets
- Dependencies vetted

**Security Testing:**
- Static analysis (ESLint security plugins)
- Dynamic analysis (OWASP ZAP)
- Penetration testing (quarterly)
- Bug bounty program (future)

## Incident Response

### Security Incident Classification
| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Data breach, account compromise | Immediate |
| High | Vulnerability exploitation | < 4 hours |
| Medium | Suspicious activity | < 24 hours |
| Low | Minor security concern | < 72 hours |

### Incident Response Plan
1. **Detection** — Identify the incident
2. **Containment** — Limit the damage
3. **Investigation** — Understand the scope
4. **Resolution** — Fix the issue
5. **Recovery** — Restore normal operations
6. **Post-mortem** — Document and improve

### Contact Information
- Security issues: security@jolttime.game
- Bug bounty program: [TBD]

## Security Documentation

### Required Documentation
- Security architecture document
- Threat model
- Incident response plan
- Data retention policy
- Privacy policy
- Cookie policy

---

*Security is not a product, but a process.*
