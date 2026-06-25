# Query Optimization Strategy

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Project:** Jolt Time  
**Platform:** Telegram Mini App + Telegram Bot  
**Backend:** Supabase PostgreSQL  

---

## Table of Contents

1. [Query Categories](#1-query-categories)
2. [Query Optimization Philosophy](#2-query-optimization-philosophy)
3. [Read Query Standards](#3-read-query-standards)
4. [Write Query Standards](#4-write-query-standards)
5. [Aggregation Strategy](#5-aggregation-strategy)
6. [Analytics Query Standards](#6-analytics-query-standards)
7. [Search Query Standards](#7-search-query-standards)
8. [Repository Query Rules](#8-repository-query-rules)
9. [RPC Query Optimization Rules](#9-rpc-query-optimization-rules)
10. [Realtime Query Standards](#10-realtime-query-standards)
11. [AdsGram Query Notes](#11-adsgram-query-notes)
12. [Pagination Philosophy](#12-pagination-philosophy)
13. [Monitoring Standards](#13-monitoring-standards)
14. [Anti-Pattern Documentation](#14-anti-pattern-documentation)
15. [Scaling Philosophy](#15-scaling-philosophy)
16. [Future Expansion Notes](#16-future-expansion-notes)
17. [Long-Term Philosophy](#17-long-term-philosophy)

---

## 1. Query Categories

The Jolt Time database query system uses six primary query categories, each requiring specific optimization approaches.

### 1.1 Read Queries

Read queries retrieve data from the database without modifying state. These are the most frequent queries and require optimization for low latency.

**Characteristics:**
- Execute frequently (often thousands per second)
- Must return quickly (< 50ms target)
- Typically access single tables or joined data
- Should leverage indexes fully

**Examples:**
- Profile retrieval
- Artifact display
- Inventory listing
- Event status
- Leaderboard display

### 1.2 Write Queries

Write queries modify database state through INSERT, UPDATE, and DELETE operations. These require careful optimization to maintain data integrity.

**Characteristics:**
- Modify database state
- Require transaction safety
- May trigger cascading updates
- Should be as efficient as possible

**Examples:**
- Progression updates
- Reward processing
- Inventory changes
- Marketplace transactions

### 1.3 Aggregation Queries

Aggregation queries compute summary statistics from multiple rows. These can be expensive and require appropriate indexes.

**Characteristics:**
- Process large data volumes
- Use GROUP BY and aggregate functions
- May benefit from pre-computation
- Should use covering indexes

**Examples:**
- Statistics calculations
- Museum metrics
- Leaderboard generation
- Seasonal reporting

### 1.4 Analytics Queries

Analytics queries generate business intelligence from raw data. These often process large datasets and run less frequently.

**Characteristics:**
- Run on large data volumes
- May have relaxed latency requirements
- Often scheduled or batched
- Should use partition pruning

**Examples:**
- Retention reporting
- Monetization analysis
- Engagement metrics
- Growth reporting

### 1.5 Search Queries

Search queries find data matching text patterns or criteria. These require specialized indexes and optimization.

**Characteristics:**
- Use text matching (LIKE, full-text, trigram)
- May rank results by relevance
- Require specific index types
- Should limit result sets

**Examples:**
- Artifact search by name
- Museum search by theme
- Player search by username
- Content discovery

### 1.6 Realtime Queries

Realtime queries support live updates and notifications. These require efficient polling or subscription patterns.

**Characteristics:**
- Execute very frequently
- Must be extremely efficient
- May use caching
- Should avoid full table scans

**Examples:**
- Live leaderboard updates
- Event status changes
- Guild activity feeds
- Notification delivery

---

## 2. Query Optimization Philosophy

The Jolt Time query optimization philosophy establishes principles for writing efficient queries that scale.

### 2.1 Minimize Database Load

Queries should use minimum database resources to accomplish their purpose.

**Load Minimization Principles:**
| Technique | Benefit |
|-----------|---------|
| Select only needed columns | Reduced data transfer |
| Use appropriate indexes | Lower I/O |
| Limit result sets | Fewer rows processed |
| Avoid functions on indexed columns | Index utilization preserved |

### 2.2 Minimize Latency

Queries should return results quickly to provide responsive user experiences.

**Latency Targets:**
| Query Type | Target | Critical |
|------------|--------|----------|
| Simple read | < 20ms | < 50ms |
| Indexed read | < 10ms | < 20ms |
| Aggregation | < 100ms | < 500ms |
| Analytics | < 5s | < 30s |

### 2.3 Maximize Scalability

Queries should scale efficiently as data volumes grow.

**Scalability Principles:**
| Principle | Implementation |
|-----------|----------------|
| Index utilization | All frequent queries use indexes |
| Partition awareness | Queries leverage partition pruning |
| O(log n) complexity | Avoid linear scans where possible |
| Batch operations | Prefer bulk operations over row-by-row |

### 2.4 Avoid Unnecessary Complexity

Queries should be as simple as possible while achieving their purpose.

**Complexity Guidelines:**
| Avoid | Prefer |
|-------|--------|
| Multiple JOINs | Denormalized views |
| Subqueries | JOINs or CTEs |
| Complex functions | Simple operations |
| Dynamic SQL | Parameterized queries |

---

## 3. Read Query Standards

Read queries retrieve data efficiently while minimizing database load.

### 3.1 Profile Retrieval

Profile retrieval provides player identity and preference data.

**Query Patterns:**
| Pattern | Optimization |
|---------|---------------|
| Get by ID | Primary key lookup |
| Get by telegram_id | Unique index lookup |
| Search by name | trigram index with LIMIT |

**Standards:**
```
Good: SELECT id, username, level FROM players WHERE id = $1
Bad:  SELECT * FROM players WHERE id = $1
```

### 3.2 Artifact Retrieval

Artifact retrieval provides player possessions and museum data.

**Query Patterns:**
| Pattern | Optimization |
|---------|---------------|
| Get player's artifacts | Composite index on (owner_id, era_id) |
| Get artifact details | Primary key lookup with related data JOIN |
| Get collection progress | Aggregation query with index |

**Standards:**
```
Good: SELECT * FROM artifacts WHERE owner_id = $1 LIMIT 50
Bad:  SELECT * FROM artifacts WHERE owner_id = $1
```

### 3.3 Inventory Retrieval

Inventory retrieval provides player items and currency.

**Query Patterns:**
| Pattern | Optimization |
|---------|---------------|
| Get inventory items | Composite index with pagination |
| Get currency balances | Direct lookup from player record |
| Get recent transactions | Covering index on (user_id, created_at DESC) |

**Standards:**
```
Good: SELECT item_id, quantity FROM inventory WHERE user_id = $1
Bad:  SELECT * FROM inventory WHERE user_id = $1
```

### 3.4 Event Retrieval

Event retrieval provides event status and participation data.

**Query Patterns:**
| Pattern | Optimization |
|---------|---------------|
| Get active events | Partial index on (status = 'active') |
| Get user's participation | Composite index on (user_id, event_id) |
| Get event leaderboard | Pre-computed materialized view |

**Standards:**
```
Good: SELECT * FROM events WHERE status = 'active' ORDER BY start_time
Bad:  SELECT * FROM events ORDER BY start_time
```

### 3.5 Leaderboard Retrieval

Leaderboard retrieval provides player rankings and scores.

**Query Patterns:**
| Pattern | Optimization |
|---------|---------------|
| Get top N | Composite index with LIMIT |
| Get player's rank | Covering index for position |
| Get surrounding players | Efficient window function |

**Standards:**
```
Good: SELECT user_id, score FROM leaderboard WHERE period = $1 ORDER BY score DESC LIMIT 100
Bad:  SELECT * FROM leaderboard WHERE period = $1 ORDER BY score DESC
```

---

## 4. Write Query Standards

Write queries modify database state efficiently while ensuring data integrity.

### 4.1 Progression Updates

Progression updates modify player level, experience, and achievement data.

**Optimization Patterns:**
| Pattern | Technique |
|---------|-----------|
| Level up check | Conditional UPDATE with RETURNING |
| Experience addition | Atomic increment with threshold check |
| Achievement unlock | INSERT with ON CONFLICT DO NOTHING |

**Standards:**
```
Good: UPDATE players SET experience = experience + $1, updated_at = NOW() WHERE id = $2 RETURNING level
Bad:  SELECT experience FROM players WHERE id = $1; calculate new level; UPDATE players SET...
```

### 4.2 Reward Processing

Reward processing credits players with currency, items, or other benefits.

**Optimization Patterns:**
| Pattern | Technique |
|---------|-----------|
| Credit currency | Atomic UPDATE with balance check |
| Grant item | UPSERT with quantity increment |
| Multiple rewards | Batch INSERT with ON CONFLICT |

**Standards:**
```
Good: UPDATE balances SET shards = shards + $1 WHERE user_id = $2 AND shards + $1 >= 0 RETURNING shards
Bad:  SELECT shards FROM balances WHERE user_id = $1; if sufficient, UPDATE...
```

### 4.3 Inventory Changes

Inventory changes add, remove, or modify player possessions.

**Optimization Patterns:**
| Pattern | Technique |
|---------|-----------|
| Add item | UPSERT with quantity |
| Remove item | UPDATE with quantity check |
| Consume item | Atomic decrement with threshold |

**Standards:**
```
Good: UPDATE inventory SET quantity = quantity - 1 WHERE user_id = $1 AND item_id = $2 AND quantity > 0 RETURNING id
Bad:  SELECT quantity FROM inventory WHERE user_id = $1 AND item_id = $2; if > 0, UPDATE...
```

### 4.4 Marketplace Operations

Marketplace operations handle listing, purchasing, and settlement.

**Optimization Patterns:**
| Pattern | Technique |
|---------|-----------|
| Create listing | INSERT with item lock |
| Purchase | Atomic transfer with balance check |
| Cancel listing | UPDATE with ownership check |

**Standards:**
```
Good: UPDATE marketplace SET status = 'cancelled' WHERE id = $1 AND seller_id = $2 AND status = 'active' RETURNING id
Bad:  SELECT * FROM marketplace WHERE id = $1; verify ownership; UPDATE...
```

---

## 5. Aggregation Strategy

Aggregation queries compute summary statistics efficiently.

### 5.1 Statistics Calculations

Statistics calculations aggregate player metrics across game systems.

**Optimization Approaches:**
| Approach | When to Use |
|----------|-------------|
| Real-time aggregation | Simple counts and sums |
| Pre-computed aggregates | Complex metrics updated periodically |
| Materialized views | Stable aggregates for dashboards |
| RPC aggregation | Computed on-demand with caching |

**Example Strategy:**
```
Daily stats: Pre-compute daily, update incrementally
Lifetime stats: Aggregate from daily summaries
Realtime stats: Direct query with appropriate indexes
```

### 5.2 Museum Metrics

Museum metrics calculate collection completion and exhibition statistics.

**Optimization Approaches:**
| Metric | Optimization |
|--------|--------------|
| Completion percentage | Cached value, updated on acquisition |
| Exhibition score | Pre-computed from artifact values |
| Collection rarity | Stored per artifact, aggregated on query |

### 5.3 Leaderboard Generation

Leaderboard generation creates rankings from player scores.

**Optimization Approaches:**
| Approach | Performance |
|----------|-------------|
| Direct ORDER BY | < 100ms for 10K players |
| Pre-computed ranks | Real-time from score updates |
| Materialized view | Refresh hourly |
| RPC with caching | On-demand with 5-minute cache |

### 5.4 Seasonal Reporting

Seasonal reporting aggregates data for season-end rewards.

**Optimization Approaches:**
| Phase | Approach |
|-------|----------|
| During season | Pre-compute standings daily |
| Season end | Final aggregation with rank lock |
| Reward distribution | Batch processing via RPC |

---

## 6. Analytics Query Standards

Analytics queries generate business intelligence without impacting real-time performance.

### 6.1 Retention Reporting

Retention reporting tracks user return patterns over time.

**Query Standards:**
| Report | Query Pattern | Frequency |
|--------|---------------|-----------|
| DAU/MAU | COUNT DISTINCT with date filter | Hourly |
| Day 1/7/30 retention | Cohort comparison | Daily |
| Churn rate | Activity gap analysis | Daily |

**Standards:**
```
Good: SELECT DATE(first_login), COUNT(*), COUNT(CASE WHEN last_active >= DATE(first_login) + INTERVAL '7 days' THEN 1 END) FROM users GROUP BY 1
Bad:  SELECT for each user, calculate retention in application code
```

### 6.2 Monetization Reporting

Monetization reporting aggregates revenue and conversion metrics.

**Query Standards:**
| Report | Query Pattern | Frequency |
|--------|---------------|-----------|
| Daily revenue | SUM with date filter | Daily |
| ARPU | AVG with cohort filter | Daily |
| Conversion rate | COUNT with funnel stages | Daily |

### 6.3 Engagement Analysis

Engagement analysis measures player activity and feature usage.

**Query Standards:**
| Metric | Query Pattern | Frequency |
|--------|---------------|-----------|
| Sessions per user | COUNT with user_id grouping | Daily |
| Feature usage | COUNT with feature filter | Weekly |
| Session duration | AVG with percentile | Daily |

### 6.4 Growth Reporting

Growth reporting tracks user acquisition and expansion metrics.

**Query Standards:**
| Metric | Query Pattern | Frequency |
|--------|---------------|-----------|
| New registrations | COUNT with date filter | Daily |
| Growth rate | Period-over-period comparison | Weekly |
| Viral coefficient | Referral tracking aggregation | Weekly |

---

## 7. Search Query Standards

Search queries find data matching text patterns efficiently.

### 7.1 Artifact Search

Artifact search enables discovery by name, era, and attributes.

**Query Standards:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Name prefix | LIKE with index | < 10ms |
| Name fuzzy | trigram similarity | < 50ms |
| Full-text | GIN ts_vector | < 100ms |

**Standards:**
```
Good: SELECT * FROM artifacts WHERE name ILIKE $1 || '%' LIMIT 20
Bad:  SELECT * FROM artifacts WHERE name LIKE '%' || $1 || '%'
```

### 7.2 Museum Search

Museum search enables discovery of artifacts and collections.

**Query Standards:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Era filter | B-tree equality | < 5ms |
| Theme filter | B-tree equality | < 5ms |
| Cross-collection | Full-text with filter | < 100ms |

### 7.3 Player Search

Player search enables finding other players by username.

**Query Standards:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Exact match | B-tree equality | < 1ms |
| Prefix autocomplete | trigram with LIMIT | < 20ms |
| Fuzzy search | trigram similarity | < 50ms |

**Standards:**
```
Good: SELECT username, level FROM players WHERE username ILIKE $1 || '%' AND is_searchable = true LIMIT 10
Bad:  SELECT username FROM players WHERE username LIKE '%' || $1 || '%'
```

### 7.4 Content Discovery

Content discovery enables finding quests, lore, and events.

**Query Standards:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Quest by title | B-tree with ILIKE | < 10ms |
| Quest by description | Full-text search | < 100ms |
| Filtered search | Composite index | < 50ms |

---

## 8. Repository Query Rules

Repositories define how data is accessed, with specific rules for efficient queries.

### 8.1 Data Request Rules

Repositories should request only the data needed for the operation.

**Rules:**
| Rule | Rationale |
|------|-----------|
| Specify columns explicitly | Reduced data transfer |
| Use meaningful aliases | Clarity in result mapping |
| Validate parameters | Prevent injection and errors |

**Pattern:**
```
Good: repository.getProfile(id) → SELECT id, username, level, experience FROM players WHERE id = $1
Bad:  repository.getProfile(id) → SELECT * FROM players WHERE id = $1
```

### 8.2 Volume Limitation Rules

Repositories should limit result sets to reasonable sizes.

**Rules:**
| Rule | Limit |
|------|-------|
| Default page size | 20-50 items |
| Maximum page size | 100 items |
| Search results | 50 items |
| List aggregations | 200 items |

**Pattern:**
```
Good: SELECT * FROM artifacts WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 50
Bad:  SELECT * FROM artifacts WHERE owner_id = $1 ORDER BY created_at DESC
```

### 8.3 Over-fetching Prevention

Repositories should never fetch more data than needed.

**Prevention Techniques:**
| Technique | Implementation |
|-----------|----------------|
| Column selection | Explicit SELECT list |
| Pagination | LIMIT/OFFSET or cursor |
| Conditional fetching | Only join when needed |
| Lazy loading | Fetch related data on demand |

### 8.4 Pagination Support

Repositories should support efficient pagination for all list queries.

**Pagination Pattern:**
```typescript
interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

async function getArtifacts(userId: string, cursor?: string, limit = 20): Promise<PaginatedResult<Artifact>>;
```

---

## 9. RPC Query Optimization Rules

RPC functions optimize complex operations through efficient database access.

### 9.1 Multiple Query Replacement

RPC functions should replace multiple client-side queries with server-side operations.

**Replacement Patterns:**
| Before (Client) | After (RPC) |
|----------------|-------------|
| Fetch profile | RPC returns profile + stats |
| Fetch artifacts + collections | RPC returns combined data |
| Multiple updates | RPC executes transaction |

**Benefit:** Reduces network round-trips from N to 1.

### 9.2 Aggregation Use Cases

RPC functions should aggregate data when multiple tables are involved.

**Aggregation Patterns:**
| Use Case | RPC Approach |
|---------|---------------|
| Player dashboard | Single RPC aggregates all metrics |
| Museum overview | RPC aggregates collections + artifacts |
| Event status | RPC combines event + participation + rewards |

### 9.3 Transaction Optimization

RPC functions should use transactions for related operations.

**Transaction Patterns:**
| Pattern | Use Case |
|---------|----------|
| Atomic update | Balance deduction + item grant |
| Conditional write | Check + update in single transaction |
| Idempotent operation | Upsert with conflict handling |

**Standards:**
```
Good: RPC executes BEGIN...COMMIT atomically
Bad:  Client executes multiple statements without transaction
```

---

## 10. Realtime Query Standards

Realtime queries support live updates with minimal database load.

### 10.1 Live Leaderboards

Live leaderboards show real-time rankings with efficient updates.

**Optimization Strategies:**
| Strategy | Implementation |
|----------|----------------|
| Pre-computed ranks | Updated on score change |
| Cached rankings | 1-minute cache |
| Delta updates | Broadcast changes via Supabase Realtime |

### 10.2 Event Updates

Event updates provide real-time status changes.

**Optimization Strategies:**
| Strategy | Implementation |
|----------|----------------|
| Polling with index | Poll every 30s with timestamp index |
| Supabase Realtime | Subscribe to INSERT/UPDATE events |
| Debounced updates | Client-side debounce of rapid changes |

### 10.3 Guild Activity

Guild activity feeds show member contributions and events.

**Optimization Strategies:**
| Strategy | Implementation |
|----------|----------------|
| Activity log table | Append-only with index |
| Limited history | Keep last 100 activities |
| Aggregated feeds | Daily digest + live highlights |

### 10.4 Notifications

Notification delivery requires efficient polling and delivery.

**Optimization Strategies:**
| Strategy | Implementation |
|----------|----------------|
| Unread count | Cached counter with invalidation |
| Notification list | Paginated with cursor |
| Delivery status | Updated on read, not on list |

---

## 11. AdsGram Query Notes

AdsGram queries require optimization for reward verification, reporting, and fraud detection.

### 11.1 Reward Verification Queries

Reward verification queries check eligibility before crediting rewards.

**Query Standards:**
| Query | Optimization | Performance |
|-------|--------------|-------------|
| Duplicate check | UNIQUE index on completion_id | < 1ms |
| Rate limit check | Partial index on recent claims | < 5ms |
| Eligibility check | Composite index with filters | < 10ms |

### 11.2 Monetization Reporting Queries

Monetization reporting queries aggregate revenue data.

**Query Standards:**
| Report | Query Pattern | Frequency |
|--------|---------------|-----------|
| Daily revenue | SUM with date filter | Daily |
| Revenue by user | GROUP BY with limit | Daily |
| eCPM calculation | AVG with breakdown | Weekly |

### 11.3 Reward Tracking Queries

Reward tracking queries monitor ad engagement.

**Query Standards:**
| Metric | Query Pattern | Performance |
|--------|---------------|-------------|
| User total | SUM with user_id | < 10ms |
| Daily average | AVG with date range | < 50ms |
| Trend analysis | GROUP BY date | < 100ms |

### 11.4 Fraud Detection Queries

Fraud detection queries identify suspicious patterns.

**Query Standards:**
| Pattern | Detection Query | Performance |
|---------|---------------|-------------|
| Rapid claims | COUNT with time window | < 20ms |
| Geographic anomaly | GROUP BY country | < 50ms |
| Device fingerprint | GROUP BY device_hash | < 20ms |

---

## 12. Pagination Philosophy

Pagination enables efficient access to large datasets without overwhelming clients or databases.

### 12.1 Cursor Pagination

Cursor pagination provides efficient, stable pagination for large datasets.

**Cursor Pagination Pattern:**
```
SELECT * FROM artifacts 
WHERE owner_id = $1 
AND created_at < $2  -- cursor from last item
ORDER BY created_at DESC 
LIMIT 20;

-- Response includes next cursor
-- Works with any ORDER BY column
```

**Advantages:**
- Stable across inserts/deletes
- Constant time for deep pages
- Works with any sort order

### 12.2 Large Dataset Handling

Large datasets require special pagination handling.

**Handling Patterns:**
| Scenario | Approach |
|----------|----------|
| Deep pagination | Cursor preferred over OFFSET |
| Unknown total | No COUNT query, use hasMore |
| Shallow pages | OFFSET acceptable for < 1000 |
| Search results | Limit with relevance ranking |

### 12.3 Efficient Scrolling

Scrolling experiences should feel smooth and responsive.

**Scrolling Standards:**
| Experience | Implementation |
|------------|----------------|
| Initial load | Fetch first page immediately |
| Infinite scroll | Prefetch next page on scroll |
| Pull to refresh | Fetch first page again |
| Jump to page | Use cursor for stability |

---

## 13. Monitoring Standards

Query monitoring enables identification and resolution of performance issues.

### 13.1 Slow Query Tracking

Slow queries are logged and tracked for optimization.

**Thresholds:**
| Query Type | Warning | Critical |
|------------|---------|----------|
| Simple read | > 20ms | > 50ms |
| Aggregation | > 200ms | > 1s |
| Analytics | > 5s | > 30s |

### 13.2 Expensive Query Tracking

Expensive queries consume significant database resources.

**Tracking Metrics:**
| Metric | Threshold | Action |
|--------|-----------|--------|
| Rows scanned | > 10,000 | Alert |
| Execution time | > 100ms | Review |
| Frequency | > 100/min | Cache or optimize |

### 13.3 Query Frequency Tracking

Frequently executed queries warrant extra optimization attention.

**Frequency Categories:**
| Frequency | Query Type | Priority |
|-----------|------------|----------|
| > 1000/min | Primary lookups | Critical |
| 100-1000/min | Common lists | High |
| 10-100/min | User-specific | Medium |
| < 10/min | Admin/rare | Low |

### 13.4 Resource Usage Monitoring

Query resource usage affects overall database capacity.

**Resource Metrics:**
| Resource | Good | Warning | Critical |
|----------|------|---------|----------|
| Buffer cache hit | > 99% | 95-99% | < 95% |
| Index usage | > 90% | 80-90% | < 80% |
| Connection usage | < 50% | 50-80% | > 80% |

---

## 14. Anti-Pattern Documentation

Anti-patterns are common mistakes that should be avoided.

### 14.1 N+1 Query Problems

N+1 queries execute one query per item instead of batching.

**Bad Pattern:**
```sql
-- For each artifact, fetch owner details
SELECT * FROM artifacts WHERE owner_id = $1;
SELECT * FROM users WHERE id = (SELECT owner_id FROM artifacts LIMIT 1);
SELECT * FROM users WHERE id = (SELECT owner_id FROM artifacts OFFSET 1 LIMIT 1);
-- ... repeated for each artifact
```

**Good Pattern:**
```sql
-- Single JOIN fetches all data
SELECT a.*, u.username, u.level 
FROM artifacts a 
JOIN users u ON u.id = a.owner_id 
WHERE a.owner_id = $1;
```

### 14.2 Excessive Joins

Excessive joins combine too many tables, degrading performance.

**Bad Pattern:**
```sql
SELECT * FROM artifacts a
JOIN collections c ON c.id = a.collection_id
JOIN museums m ON m.id = c.museum_id
JOIN users u ON u.id = m.owner_id
JOIN player_stats ps ON ps.user_id = u.id
WHERE a.id = $1;
```

**Good Pattern:**
```sql
-- Fetch artifact with only needed joins
SELECT a.*, c.name as collection_name 
FROM artifacts a
JOIN collections c ON c.id = a.collection_id
WHERE a.id = $1;
```

### 14.3 Unnecessary Data Loading

Loading unnecessary data wastes bandwidth and memory.

**Bad Pattern:**
```sql
SELECT * FROM players WHERE id = $1;
-- When only username is needed
```

**Good Pattern:**
```sql
SELECT username FROM players WHERE id = $1;
```

### 14.4 Duplicate Queries

Duplicate queries fetch the same data multiple times.

**Bad Pattern:**
```sql
-- Multiple components fetch same player data
SELECT * FROM players WHERE telegram_id = $1; -- Header
SELECT * FROM players WHERE telegram_id = $1; -- Profile
SELECT * FROM players WHERE telegram_id = $1; -- Settings
```

**Good Pattern:**
```sql
-- Single fetch, cached for component access
const player = await playerRepo.getPlayer(telegramId);
-- Components read from cached store
```

---

## 15. Scaling Philosophy

Query optimization must scale from early development to large production environments.

### 15.1 Scale: 10,000 Users

At 10,000 users, basic optimization ensures responsive performance.

**Typical Queries:**
| Type | Volume | Optimization |
|------|--------|--------------|
| Profile reads | 1000/sec | Primary key lookup |
| Inventory reads | 500/sec | Indexed listing |
| Leaderboard reads | 200/sec | Pre-computed |
| Analytics | 1/min | Simple aggregation |

**Focus:**
- Index utilization verification
- Basic query standards compliance
- Simple caching where beneficial

### 15.2 Scale: 100,000 Users

At 100,000 users, advanced optimization prevents performance degradation.

**Typical Queries:**
| Type | Volume | Optimization |
|------|--------|--------------|
| Profile reads | 10,000/sec | Connection pooling |
| Inventory reads | 5,000/sec | Composite indexes |
| Leaderboard reads | 2,000/sec | Materialized views |
| Analytics | 10/min | Pre-aggregation |

**Focus:**
- Composite index coverage
- Query result caching
- RPC-based aggregation
- Partition pruning

### 15.3 Scale: 1,000,000+ Users

At 1,000,000+ users, sophisticated optimization enables scalability.

**Typical Queries:**
| Type | Volume | Optimization |
|------|--------|--------------|
| Profile reads | 100,000/sec | Read replicas |
| Inventory reads | 50,000/sec | Sharding consideration |
| Leaderboard reads | 20,000/sec | Distributed cache |
| Analytics | 60/min | Dedicated analytics DB |

**Focus:**
- Read replica routing
- Table partitioning
- Distributed caching
- Asynchronous processing

### 15.4 Scaling Strategies

| Strategy | Trigger | Implementation |
|----------|---------|----------------|
| Add index | Slow query on column | Create targeted index |
| Add cache | Repeated identical queries | Redis or in-memory |
| Pre-aggregate | Slow aggregation query | Materialized view |
| Partition | Table > 10M rows | Range partitioning |

---

## 16. Future Expansion Notes

Future query requirements may emerge as Jolt Time expands into new domains.

### 16.1 AI Workloads

AI-generated content and recommendations may require specialized queries.

**Potential Requirements:**
| Workload | Query Pattern | Optimization |
|----------|---------------|--------------|
| Embedding search | Vector similarity | pgvector indexes |
| Recommendation feed | Personalized ranking | Pre-computed scores |
| Content generation | Batch processing | Async queries |

**Status:** Future concept only, not currently planned.

### 16.2 Creator Economy Analytics

Creator content may require marketplace-style analytics queries.

**Potential Requirements:**
| Analytics | Query Pattern | Optimization |
|-----------|---------------|--------------|
| Creator metrics | User + content aggregation | Composite indexes |
| Revenue splits | Multi-party calculations | Batch processing |
| Content discovery | Search + filters | Full-text + ranking |

**Status:** Future concept only, not currently planned.

### 16.3 Web3 Systems

Blockchain integration may require address-based queries.

**Potential Requirements:**
| Data | Query Pattern | Optimization |
|------|---------------|--------------|
| Wallet lookup | Address equality | B-tree index |
| Transaction history | Address + time range | Composite index |
| Balance queries | User + token | Composite with balance |

**Status:** Future concept only, not currently planned.

### 16.4 NFT Systems

NFT ownership may require specialized tracking queries.

**Potential Requirements:**
| Data | Query Pattern | Optimization |
|------|---------------|--------------|
| Ownership | User + token | Composite index |
| Metadata search | JSONB operators | JSONB indexes |
| Activity | Token + time | Composite index |

**Status:** Future concept only, not currently planned.

### 16.5 Esports Analytics

Competitive gaming may require real-time tournament queries.

**Potential Requirements:**
| Analytics | Query Pattern | Optimization |
|-----------|---------------|--------------|
| Live rankings | Time + score | Pre-computed |
| Match history | User + timestamp | Composite index |
| Team stats | Aggregation | Materialized view |

**Status:** Future concept only, not currently planned.

---

## 17. Long-Term Philosophy

The Query Optimization Strategy ensures Jolt Time remains responsive and scalable as it grows.

### 17.1 Improve Responsiveness

Optimized queries provide fast, consistent user experiences.

**Responsiveness Benefits:**
| User Experience | Query Impact |
|-----------------|--------------|
| Instant navigation | < 50ms page loads |
| Smooth scrolling | < 100ms list updates |
| Quick actions | < 200ms confirmations |
| Real-time updates | < 500ms live data |

### 17.2 Reduce Infrastructure Costs

Efficient queries minimize database resource consumption.

**Cost Reduction Areas:**
| Resource | Optimization Benefit |
|----------|-------------------|
| Compute | Fewer CPU cycles per query |
| Memory | Smaller result sets |
| I/O | Better index utilization |
| Network | Less data transfer |

### 17.3 Support Growth

Optimization enables scaling without proportional infrastructure increase.

**Growth Support:**
| User Growth | Infrastructure Scaling | Optimization Effect |
|-------------|----------------------|-------------------|
| 10x | 5x infrastructure | 2x efficiency gain |
| 100x | 20x infrastructure | 5x efficiency gain |
| 1000x | 100x infrastructure | 10x efficiency gain |

### 17.4 Simplify Performance Management

Clear standards make performance management systematic.

**Management Benefits:**
| Aspect | Simplification |
|--------|---------------|
| New features | Known patterns to follow |
| Debugging | Clear benchmarks for comparison |
| Optimization | Systematic approach to fixes |
| Scaling | Predictable resource needs |

---

## Related Documentation

- **Database Indexing:** `.openhands/knowledge/database-indexing.md`
- **Database Migrations:** `.openhands/knowledge/database-migrations.md`
- **RPC Architecture:** `.openhands/knowledge/supabase-rpc-architecture.md`
- **Repository Pattern:** `.openhands/knowledge/repository-pattern.md`
- **AdsGram Integration:** `.openhands/knowledge/adsgram.md`

---

*Building the future through the lens of the past.*
