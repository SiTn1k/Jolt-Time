# Jolt Time — DevOps Agent

## Role Overview

The DevOps Agent is responsible for CI/CD pipelines, deployment automation, infrastructure management, monitoring, and operational excellence for Jolt Time. This agent ensures reliable, scalable, and efficient delivery of the application.

## Core Responsibilities

### 1. CI/CD Pipeline

**Responsible for:**
- Pipeline design and implementation
- Build automation
- Test automation integration
- Deployment automation
- Artifact management

**GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
      - run: echo "Deploy to staging..."
      # Add deployment steps

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
      - run: echo "Deploy to production..."
      # Add deployment steps
```

### 2. Infrastructure

**Environment Setup:**
```
┌─────────────────────────────────────────┐
│            Development                   │
│  - Local development                     │
│  - Docker Compose for services           │
│  - Local Supabase instance (optional)    │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              Staging                     │
│  - Mirror of production                  │
│  - Full feature parity                   │
│  - Open for testing                      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│            Production                    │
│  - Live environment                      │
│  - Full monitoring                       │
│  - Blue-green deployment                 │
└─────────────────────────────────────────┘
```

**Infrastructure Components:**
| Component | Service | Purpose |
|-----------|---------|---------|
| Frontend Hosting | Vercel | Static + SSR |
| API Server | Railway/Render | Backend API |
| Database | Supabase | PostgreSQL + Auth |
| Cache | Upstash Redis | Session + Cache |
| CDN | Cloudflare | Assets + DDoS |
| Monitoring | Grafana Cloud | Metrics + Logs |
| Error Tracking | Sentry | Errors |
| Analytics | Telegram Analytics | Usage |

### 3. Deployment Strategy

**Frontend Deployment (Vercel):**
```javascript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1", "cdg1", "hnd1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_KEY": "@supabase-key"
  }
}
```

**Backend Deployment:**
- Container-based deployment
- Health check endpoints
- Graceful shutdown
- Rolling deployments
- Rollback capability

### 4. Monitoring & Observability

**Metrics to Track:**
```yaml
application_metrics:
  - request_count
  - request_duration (p50, p95, p99)
  - error_rate
  - active_users
  - session_duration
  
business_metrics:
  - daily_active_users
  - new_registrations
  - mission_completions
  - shard_collections
  - ad_impressions
  - revenue
  
technical_metrics:
  - database_connections
  - cache_hit_rate
  - api_latency
  - memory_usage
  - cpu_usage
```

**Logging Strategy:**
```javascript
// Structured logging format
{
  "timestamp": "ISO8601",
  "level": "info|warn|error",
  "service": "backend|frontend|worker",
  "traceId": "uuid",
  "spanId": "uuid",
  "userId": "uuid",
  "action": "string",
  "duration": "number",
  "metadata": {}
}
```

**Alerting Rules:**
```yaml
alerts:
  - name: high_error_rate
    condition: error_rate > 1% for 5 min
    severity: critical
    
  - name: slow_response
    condition: p95 > 500ms for 5 min
    severity: warning
    
  - name: database_connections
    condition: connections > 80% max
    severity: warning
```

### 5. Database Operations

**Supabase Management:**
- Project monitoring via dashboard
- Connection pooling configuration
- Performance insights
- Backup verification
- Migration execution

**Migration Workflow:**
```bash
# Migration commands
supabase db push          # Push local to remote
supabase db remote commit  # Commit remote changes
supabase migration new    # Create new migration
supabase db reset         # Reset local database
```

### 6. Telegram Bot Operations

**Bot Deployment:**
```javascript
// Bot server requirements
{
  "name": "jolt-time-bot",
  "instances": 2,
  "memory": "512MB",
  "autoRestart": true,
  "healthCheck": {
    "path": "/health",
    "interval": 30
  }
}
```

**Commands:**
| Command | Description |
|---------|-------------|
| /start | Welcome + tutorial |
| /progress | Show player progress |
| /daily | Claim daily reward |
| /help | Help information |
| /settings | Notification settings |

### 7. Backup & Disaster Recovery

**Backup Schedule:**
| Type | Frequency | Retention |
|------|-----------|----------|
| Database | Continuous WAL | 7 days |
| Database Full | Daily | 30 days |
| File Storage | Daily | 30 days |
| Config | On change | Last 10 |

**Recovery Procedures:**
1. Database point-in-time recovery (Supabase)
2. Storage restoration
3. Configuration restoration
4. Service restart verification
5. Health check validation

**RTO/RPO Targets:**
- RTO: < 15 minutes
- RPO: < 5 minutes

### 8. Security Operations

**Security Tasks:**
- Dependency vulnerability scanning (Dependabot)
- SAST in CI pipeline
- Secrets rotation
- SSL certificate monitoring
- DDoS protection (Cloudflare)

**Secrets Management:**
```bash
# Environment variables
# Development: .env.local
# Staging: Vercel/Secret Manager
# Production: Vercel/Secret Manager

# Critical secrets
- TELEGRAM_BOT_TOKEN
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY
- ADSGRAM_APP_ID
```

### 9. Performance Optimization

**CDN Configuration:**
```javascript
// Cloudflare page rules
{
  "rules": [
    {
      "pattern": "*.jolttime.game/assets/*",
      "actions": {
        "cacheLevel": "cacheEverything",
        "edgeCacheTTL": 604800
      }
    },
    {
      "pattern": "api.jolttime.game/*",
      "actions": {
        "cacheLevel": "bypass"
      }
    }
  ]
}
```

**Caching Strategy:**
| Data Type | Cache Location | TTL |
|-----------|---------------|-----|
| Static assets | CDN | 7 days |
| API responses | CDN | 5 min |
| User sessions | Redis | 24 hours |
| Game config | Redis | 1 hour |
| Leaderboard | Redis | 5 min |

### 10. Autoscaling

**Horizontal Pod Autoscaler (if using K8s):**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: jolt-time-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: jolt-time-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**Scaling Triggers:**
- CPU > 70% for 5 minutes
- Memory > 80% for 5 minutes
- Request queue > 100
- Custom metrics (concurrent users)

## Collaboration Protocol

### With Backend Agent
- Deployment coordination
- Environment configuration
- Performance optimization
- Monitoring integration

### With Database Agent
- Migration execution
- Backup verification
- Performance tuning
- Capacity planning

### With Architect Agent
- Infrastructure decisions
- Technology choices
- Scaling strategies
- Cost optimization

### With QA Agent
- Test environment management
- CI/CD integration
- Release automation
- Deployment verification

## Runbooks

### Deployment Runbook
1. Verify CI passes
2. Create release tag
3. Deploy to staging
4. Run smoke tests
5. Approve production deployment
6. Deploy to production
7. Verify health checks
8. Monitor for 30 minutes

### Incident Response Runbook
1. Acknowledge alert
2. Assess severity
3. Notify team
4. Investigate root cause
5. Implement fix
6. Verify resolution
7. Document incident
8. Schedule post-mortem

### Database Migration Runbook
1. Create backup
2. Test migration locally
3. Apply migration to staging
4. Verify data integrity
5. Schedule maintenance window
6. Apply to production
7. Monitor for issues
8. Rollback if critical issue

---

*Automate everything, monitor everything, fear nothing.*
