# Database Indexing Strategy

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Project:** Jolt Time  
**Platform:** Telegram Mini App + Telegram Bot  
**Backend:** Supabase PostgreSQL  

---

## Table of Contents

1. [Index Categories](#1-index-categories)
2. [Indexing Philosophy](#2-indexing-philosophy)
3. [Table Indexing Strategy](#3-table-indexing-strategy)
4. [Player Data Indexing Standards](#4-player-data-indexing-standards)
5. [Museum Data Indexing Standards](#5-museum-data-indexing-standards)
6. [Economy Data Indexing Standards](#6-economy-data-indexing-standards)
7. [Event Data Indexing Standards](#7-event-data-indexing-standards)
8. [PvP and Guild Data Indexing Standards](#8-pvp-and-guild-data-indexing-standards)
9. [Analytics Indexing Strategy](#9-analytics-indexing-strategy)
10. [AdsGram Data Indexing Notes](#10-adsgram-data-indexing-notes)
11. [Search Optimization Philosophy](#11-search-optimization-philosophy)
12. [Composite Index Strategy](#12-composite-index-strategy)
13. [Monitoring Standards](#13-monitoring-standards)
14. [Maintenance Philosophy](#14-maintenance-philosophy)
15. [Scaling Philosophy](#15-scaling-philosophy)
16. [Future Expansion Notes](#16-future-expansion-notes)
17. [Long-Term Philosophy](#17-long-term-philosophy)

---

## 1. Index Categories

The Jolt Time database indexing system uses six primary index categories, each serving specific performance and query requirements.

### 1.1 Primary Indexes

Primary indexes enforce entity identity and enable fast entity lookups. Every table must have a primary key index for efficient row identification.

**Characteristics:**
- Unique by definition (no duplicate values)
- Automatically created on primary key columns
- Clustered storage for optimal access
- Used in foreign key references

**Usage Patterns:**
- Single-row lookups by ID
- Foreign key joins
- Entity identification in RPC functions

**Naming Convention:** Primary indexes use the table's primary key constraint name (typically `pk_{table_name}`).

### 1.2 Foreign Key Indexes

Foreign key indexes optimize referential integrity checks and join operations between related tables.

**Characteristics:**
- Created on columns referencing other tables
- Essential for join performance
- Support referential integrity enforcement
- Enable efficient constraint validation

**Usage Patterns:**
- JOIN operations between parent and child tables
- Cascading updates and deletes
- Parent entity lookups from child records

**Naming Convention:** `idx_{referencing_table}_{referenced_table}_{column}` (e.g., `idx_users_telegram_id`)

### 1.3 Search Indexes

Search indexes enable full-text and pattern-based searching across textual columns.

**Characteristics:**
- Support keyword and phrase matching
- Enable prefix and suffix searches
- May include ranking/scoring
- Higher storage overhead than B-tree

**Usage Patterns:**
- Player username search
- Artifact name and description search
- Content text search
- Filter autocomplete

**Types:**
| Type | Use Case | Overhead |
|------|----------|----------|
| B-tree (LIKE) | Prefix matching | Low |
| pg_trgm | Fuzzy matching | Medium |
| GIN Full-text | Text search | High |
| ILIKE | Case-insensitive | Low |

### 1.4 Composite Indexes

Composite indexes cover multiple columns in a single index structure, optimizing multi-column query patterns.

**Characteristics:**
- Column order matters significantly
- Can satisfy queries on leading columns
- May cover entire query (index-only scan)
- Reduce index count compared to single-column indexes

**Usage Patterns:**
- Queries filtering by multiple columns
- Range queries with additional filters
- Sorting with filtering

**Ordering Principles:**
- Equality conditions first
- Range conditions last
- High-cardinality columns earlier

### 1.5 Analytics Indexes

Analytics indexes optimize aggregation queries and reporting operations.

**Characteristics:**
- Support GROUP BY and ORDER BY optimization
- Enable covering indexes for analytics queries
- May use partial indexes for data subsets
- Optimized for scan operations

**Usage Patterns:**
- Retention cohort queries
- Revenue aggregation
- User behavior analytics
- Time-series aggregations

### 1.6 Performance Indexes

Performance indexes address specific query performance bottlenecks.

**Characteristics:**
- Created based on query analysis
- May be temporary during optimization
- Monitored for utilization
- Removed when no longer needed

**Usage Patterns:**
- High-frequency query optimization
- Reporting dashboard queries
- Leaderboard ranking queries

---

## 2. Indexing Philosophy

The Jolt Time indexing philosophy establishes principles for creating and maintaining indexes that support long-term performance and scalability.

### 2.1 Improve Query Performance

Indexes must demonstrably improve query performance for common operations.

**Performance Requirements:**
| Query Type | Target Performance |
|------------|-------------------|
| Primary key lookup | < 1ms |
| Foreign key JOIN | < 5ms |
| Indexed range query | < 20ms |
| Aggregation (indexed) | < 100ms |
| Full table scan | Avoid for OLTP |

**Index Justification:**
Every index must justify its existence through demonstrated performance improvement. Indexes should not be created speculatively without query evidence.

### 2.2 Support Scalability

Indexes must scale efficiently as data volumes grow.

**Scalability Considerations:**
- B-tree indexes scale logarithmically with row count
- Composite indexes reduce when query patterns align
- Partial indexes maintain performance as tables grow
- Index size management critical at scale

**Growth Projections:**
| User Scale | Index Count | Index Size Budget |
|------------|-------------|-------------------|
| 10,000 | 20-30 | < 100MB |
| 100,000 | 40-60 | < 1GB |
| 1,000,000+ | 80-120 | < 10GB |

### 2.3 Avoid Unnecessary Overhead

Indexes carry costs that must be balanced against query benefits.

**Overhead Costs:**
| Cost | Impact |
|------|--------|
| Storage | Each index consumes disk space |
| Write Performance | INSERT/UPDATE/DELETE slower |
| Maintenance | VACUUM/ANALYZE more expensive |
| Memory | Index pages compete for buffer pool |

**Balancing Principle:**
```
Benefit = Query Improvement × Query Frequency
Cost = Storage + Write Overhead × Modification Frequency

Justify index when: Benefit > Cost
```

---

## 3. Table Indexing Strategy

Each major table category requires specific indexing approaches based on access patterns and data relationships.

### 3.1 Players Table Indexes

The players table is the most frequently accessed table, requiring optimized indexing for common lookups.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_players_telegram_id` | `telegram_id` | Telegram user lookup |
| `idx_players_username` | `username` | Username search |
| `idx_players_level` | `level DESC` | Leaderboard by level |

**Conditional Indexes:**
| Index | Condition | Purpose |
|-------|-----------|---------|
| `idx_players_active` | `WHERE last_active_at > NOW() - INTERVAL '7 days'` | Active player queries |

### 3.2 Artifacts Table Indexes

The artifacts table requires indexes for ownership, collection, and search operations.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_artifacts_owner_id` | `owner_id` | Player's artifacts |
| `idx_artifacts_era` | `era_id` | Era filtering |
| `idx_artifacts_rarity` | `rarity` | Rarity filtering |

**Composite Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_artifacts_owner_era` | `(owner_id, era_id)` | Player's artifacts by era |
| `idx_artifacts_owner_rarity` | `(owner_id, rarity)` | Player's artifacts by rarity |

### 3.3 Collections Table Indexes

The collections table indexes support completion tracking and display queries.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_collections_owner_id` | `owner_id` | Player's collections |
| `idx_collections_era` | `era_id` | Era collections |

**Composite Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_collections_owner_complete` | `(owner_id, is_complete)` | Completion status |

### 3.4 Events Table Indexes

The events table requires indexes for time-based queries and participation tracking.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_events_active` | `WHERE status = 'active'` | Active events |
| `idx_events_time_range` | `(start_time, end_time)` | Event time queries |
| `idx_events_type` | `event_type` | Event type filtering |

**Participation Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_event_participation_user` | `(user_id, event_id)` | User's event participation |
| `idx_event_participation_event` | `(event_id, user_id)` | Event's participants |

### 3.5 Missions Table Indexes

The missions table indexes support progress tracking and completion queries.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_missions_event_id` | `event_id` | Event's missions |
| `idx_missions_type` | `mission_type` | Mission type filtering |

**Progress Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_mission_progress_user` | `(user_id, mission_id)` | User's mission progress |
| `idx_mission_progress_status` | `(user_id, status)` | User's incomplete missions |

### 3.6 Rewards Table Indexes

The rewards table requires indexes for efficient claim and history queries.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_rewards_user_id` | `user_id` | Player's rewards |
| `idx_rewards_type` | `reward_type` | Reward type filtering |
| `idx_rewards_claimed` | `is_claimed` | Unclaimed rewards |

**Composite Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_rewards_user_claimed` | `(user_id, is_claimed)` | Player's unclaimed rewards |
| `idx_rewards_user_type` | `(user_id, reward_type)` | Player's rewards by type |

### 3.7 Guilds Table Indexes

The guilds table requires indexes for membership, ranking, and search operations.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_guilds_name` | `name` | Guild name search |
| `idx_guilds_level` | `level DESC` | Guild leaderboard |

**Membership Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_guild_members_guild` | `guild_id` | Guild's members |
| `idx_guild_members_user` | `user_id` | User's guild membership |

### 3.8 Leaderboards Table Indexes

The leaderboards table requires indexes for efficient ranking and score update operations.

**Primary Indexes:**
- Primary key on `id`

**Required Indexes:**
| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_leaderboards_type_period` | `(leaderboard_type, period)` | Specific leaderboard |
| `idx_leaderboards_score` | `(leaderboard_type, period, score DESC)` | Rankings by score |
| `idx_leaderboards_user` | `(user_id, leaderboard_type, period)` | User's ranking |

---

## 4. Player Data Indexing Standards

Player data indexing focuses on three primary access patterns: profile lookups, progression queries, and account identification.

### 4.1 Profile Lookups

Profile lookups retrieve player identity and preference data.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get profile by ID | Very High | Primary key |
| Get profile by telegram_id | Very High | `idx_players_telegram_id` |
| Search profiles by name | Medium | `idx_players_username` (trgm) |

**Index Standards:**
```
Primary: id (UUID) - Clustered B-tree
High Frequency: telegram_id - B-tree
Search: username - GIN trigram
```

### 4.2 Progression Lookups

Progression lookups retrieve player level, experience, and achievement data.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get player level | High | Included in players |
| Get player XP | High | Included in players |
| Get achievements | Medium | `idx_achievements_user_id` |

**Index Standards:**
```
Level queries: level DESC (composite)
Achievement tracking: (user_id, achievement_id) UNIQUE
```

### 4.3 Account Identification

Account identification enables authentication and cross-reference operations.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Authenticate user | Very High | telegram_id |
| Link accounts | Low | telegram_id + provider |
| Verify ownership | High | user_id + resource_id |

**Index Standards:**
```
Authentication: telegram_id UNIQUE
Account linking: (provider, provider_uid) UNIQUE
Resource ownership: (user_id, resource_type, resource_id)
```

---

## 5. Museum Data Indexing Standards

Museum data indexing supports artifact retrieval, collection filtering, and exhibition management.

### 5.1 Artifact Retrieval

Artifact retrieval queries fetch owned artifacts for display and management.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get player's artifacts | High | `idx_artifacts_owner_id` |
| Get artifact details | High | Primary key |
| Get artifact history | Low | `idx_artifact_history_artifact_id` |

**Index Standards:**
```
Ownership: owner_id B-tree
Artifact lookup: id (primary key)
History: artifact_id + timestamp
```

### 5.2 Collection Filtering

Collection filtering queries identify artifacts matching criteria.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Filter by era | Medium | `idx_artifacts_era` |
| Filter by rarity | Medium | `idx_artifacts_rarity` |
| Filter by type | Medium | `idx_artifacts_type` |
| Filter by set | Medium | `idx_artifacts_set_id` |

**Composite Indexes:**
```
(owner_id, era_id) - Player's artifacts by era
(owner_id, rarity) - Player's artifacts by rarity
(owner_id, type_id) - Player's artifacts by type
```

### 5.3 Exhibition Queries

Exhibition queries retrieve current museum display configuration.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get exhibition slots | High | `idx_exhibitions_owner_id` |
| Get slot contents | High | `idx_exhibition_slots_position` |

**Index Standards:**
```
Exhibition config: (owner_id, slot_position)
```

---

## 6. Economy Data Indexing Standards

Economy data indexing supports inventory operations, transaction history, and reward processing.

### 6.1 Inventory Operations

Inventory operations manage player possessions with high-frequency updates.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get inventory | High | `idx_inventory_user_id` |
| Find item | High | `idx_inventory_user_item` |
| Count items | Medium | Included in inventory |

**Index Standards:**
```
Inventory: (user_id, item_id) UNIQUE - Prevents duplicates
Item list: user_id - For listing
```

### 6.2 Transaction History

Transaction history queries support audit trails and balance verification.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get recent transactions | High | `idx_transactions_user_time` |
| Filter by type | Medium | `idx_transactions_type` |
| Sum by period | Low | `idx_transactions_user_period` |

**Index Standards:**
```
Recent history: (user_id, created_at DESC)
Type filter: (user_id, transaction_type, created_at DESC)
Period aggregation: (user_id, created_at) for date range
```

### 6.3 Reward Processing

Reward processing requires efficient claiming and prevention of duplicates.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get unclaimed rewards | High | `idx_rewards_user_unclaimed` |
| Check duplicate | High | `idx_rewards_source_id` UNIQUE |
| Process batch | Medium | `idx_rewards_status` |

**Index Standards:**
```
Unclaimed: (user_id, is_claimed, created_at)
Duplicate prevention: (source_type, source_id) UNIQUE
Batch processing: (status, created_at)
```

---

## 7. Event Data Indexing Standards

Event data indexing supports event participation, mission tracking, and seasonal content.

### 7.1 Event Participation

Event participation queries track which events players have joined.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get user's events | High | `idx_participation_user_id` |
| Get event's participants | Medium | `idx_participation_event_id` |
| Check participation | High | `idx_participation_user_event` UNIQUE |

**Index Standards:**
```
User events: (user_id, joined_at DESC)
Event participants: (event_id, joined_at DESC)
Unique check: (user_id, event_id) UNIQUE
```

### 7.2 Mission Tracking

Mission tracking queries monitor progress toward completion.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get user's missions | High | `idx_mission_progress_user` |
| Update progress | High | `idx_mission_progress_composite` |
| Get completions | Medium | `idx_mission_progress_completed` |

**Index Standards:**
```
User missions: (user_id, status)
Progress update: (user_id, mission_id, updated_at)
Completions: (user_id, completed_at)
```

### 7.3 Seasonal Content

Seasonal content requires time-bounded queries and completion tracking.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get current season | High | `idx_seasons_active` |
| Get season rewards | Medium | `idx_season_rewards_user_season` |
| Season leaderboard | High | `idx_season_leaderboard` |

**Index Standards:**
```
Active season: (status, start_time, end_time)
Season rewards: (user_id, season_id, is_claimed)
Season rankings: (season_id, score DESC)
```

---

## 8. PvP and Guild Data Indexing Standards

PvP and guild data indexing supports rankings, battle history, guild operations, and leaderboard queries.

### 8.1 Rankings

Ranking queries determine player positions in competitive hierarchies.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get top N | High | `idx_rankings_score_desc` |
| Get player rank | High | `idx_rankings_user_type` |
| Get rank changes | Medium | `idx_rankings_previous` |

**Index Standards:**
```
Top rankings: (ranking_type, period, score DESC)
Player rank: (user_id, ranking_type, period)
Rank history: (user_id, ranking_type, calculated_at DESC)
```

### 8.2 Battle History

Battle history queries support match review and statistics calculation.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get recent battles | High | `idx_battles_user_recent` |
| Get battle details | Medium | Primary key |
| Get opponent history | Medium | `idx_battles_opponent` |

**Index Standards:**
```
Recent battles: (player_id, played_at DESC)
Opponent history: (player_id, opponent_id, played_at DESC)
Match lookup: id (primary key)
```

### 8.3 Guild Progression

Guild progression queries track collective advancement.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Get guild members | High | `idx_guild_members_guild` |
| Get member roles | Medium | `idx_guild_members_role` |
| Guild search | Medium | `idx_guilds_name_trgm` |

**Index Standards:**
```
Members: guild_id + role
Name search: name GIN trigram
Guild lookup: id (primary key)
```

### 8.4 Leaderboard Queries

Leaderboard queries retrieve rankings efficiently for display.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Global top 100 | Very High | `idx_leaderboard_scores` |
| User's surroundings | High | `idx_leaderboard_user_position` |
| Guild rankings | High | `idx_guild_rankings` |

**Index Standards:**
```
Top scores: (leaderboard_id, period, score DESC)
User position: (leaderboard_id, period, user_id)
Guild rankings: (type, period, score DESC)
```

---

## 9. Analytics Indexing Strategy

Analytics indexing optimizes data aggregation for reporting, retention analysis, and monetization metrics.

### 9.1 Reporting Indexes

Reporting indexes support dashboard and operational reports.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Daily active users | High | `idx_events_user_date` |
| Revenue reports | Medium | `idx_transactions_revenue` |
| Activity reports | Medium | `idx_events_type_date` |

**Index Standards:**
```
DAU: (event_date, user_id) for COUNT DISTINCT
Revenue: (created_at, type, amount) for SUM
Activity: (event_type, created_at) for aggregations
```

### 9.2 Aggregation Indexes

Aggregation indexes optimize GROUP BY and SUM operations.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Cohort retention | Low | `idx_users_cohort_date` |
| Revenue by period | Medium | `idx_revenue_period` |
| Engagement metrics | Medium | `idx_engagement_user_period` |

**Index Standards:**
```
Cohort: (cohort_date, user_id) for retention calculation
Revenue aggregation: (period, revenue_type)
Engagement: (user_id, period_start, period_end)
```

### 9.3 Retention Analysis

Retention analysis queries track user return patterns.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Day 1 retention | Medium | `idx_sessions_user_date` |
| Cohort retention | Low | `idx_users_first_session` |
| Churn prediction | Low | `idx_activity_churn_score` |

**Index Standards:**
```
Session tracking: (user_id, started_at)
First session: (user_id) for cohort baseline
Activity window: (user_id, last_active_at)
```

### 9.4 Monetization Analysis

Monetization analysis queries aggregate revenue data.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| ARPU calculation | Medium | `idx_revenue_user` |
| Payment history | Low | `idx_payments_user_date` |
| Refund tracking | Low | `idx_refunds_user_date` |

**Index Standards:**
```
ARPU: (created_at, user_id) for averaging
Payment history: (user_id, created_at DESC)
Refund tracking: (status, created_at)
```

---

## 10. AdsGram Data Indexing Notes

AdsGram data requires specialized indexing for reward verification, monetization tracking, analytics reporting, and fraud detection.

### 10.1 Reward Verification

Reward verification requires efficient duplicate prevention and validation queries.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Check duplicate reward | Very High | `idx_ad_rewards_completion_id` UNIQUE |
| Verify user eligibility | High | `idx_ad_rewards_user_hour` |
| Get user's rewards | High | `idx_ad_rewards_user_date` |

**Index Standards:**
```
Duplicate prevention: (completion_id) UNIQUE
Rate limiting: (user_id, created_at) for hourly limits
Reward history: (user_id, created_at DESC)
```

### 10.2 Monetization Tracking

Monetization tracking indexes support revenue aggregation and reporting.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Daily revenue | High | `idx_ad_revenue_date` |
| Revenue by user | Medium | `idx_ad_revenue_user` |
| eCPM calculations | Low | `idx_ad_views_impression_data` |

**Index Standards:**
```
Daily aggregation: (date, revenue)
User revenue: (user_id, date)
Impression data: (date, country, ad_type)
```

### 10.3 Analytics Reporting

AdsGram analytics requires indexes for campaign and publisher reporting.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Campaign performance | Medium | `idx_ad_campaign_stats` |
| Publisher earnings | Medium | `idx_ad_publisher_earnings` |
| Conversion funnels | Low | `idx_ad_conversions_funnel` |

**Index Standards:**
```
Campaign: (campaign_id, date)
Publisher: (publisher_id, period)
Funnel: (campaign_id, conversion_type, date)
```

### 10.4 Fraud Detection

Fraud detection requires indexes for anomaly identification.

**Query Patterns:**
| Query | Frequency | Index Required |
|-------|-----------|----------------|
| Rapid reward claims | High | `idx_ad_rewards_user_speed` |
| Geographic anomalies | Medium | `idx_ad_views_geo_pattern` |
| Device fingerprints | Medium | `idx_ad_views_device` |

**Index Standards:**
```
Speed analysis: (user_id, ip_address, created_at)
Geo patterns: (user_id, country, hour)
Device analysis: (device_hash, created_at)
```

---

## 11. Search Optimization Philosophy

Search optimization enables efficient text-based queries across artifacts, museums, players, and content.

### 11.1 Artifact Search

Artifact search enables players to find artifacts by name, description, or attributes.

**Search Patterns:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Exact match | B-tree = | < 1ms |
| Prefix match | B-tree LIKE | < 5ms |
| Fuzzy match | trigram GIN | < 20ms |
| Full-text | GIN ts_vector | < 50ms |

**Index Strategy:**
```
Name: VARCHAR_pattern_ops or GIN trigram
Description: GIN ts_vector for full-text
Attributes: Composite B-tree for filtering
```

### 11.2 Museum Search

Museum search enables discovery of artifacts and collections.

**Search Patterns:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Collection by era | B-tree | < 5ms |
| Collection by theme | B-tree | < 5ms |
| Cross-collection | Full-text | < 50ms |

**Index Strategy:**
```
Era/theme: B-tree composite
Collection name: trigram GIN
Artifact cross-search: GIN ts_vector
```

### 11.3 Player Search

Player search enables finding other players by username or display name.

**Search Patterns:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Exact match | B-tree | < 1ms |
| Prefix match | B-tree | < 5ms |
| Username autocomplete | trigram | < 20ms |

**Index Strategy:**
```
Username: VARCHAR_pattern_ops
Display name: trigram GIN
Privacy-respecting: WHERE is_searchable = true
```

### 11.4 Content Search

Content search enables discovery of historical content, quests, and lore.

**Search Patterns:**
| Search Type | Implementation | Performance |
|-------------|----------------|-------------|
| Quest by title | B-tree | < 5ms |
| Quest by description | Full-text | < 50ms |
| Historical content | Full-text + filter | < 100ms |

**Index Strategy:**
```
Title: B-tree
Description: GIN ts_vector
Filters: Composite B-tree
```

---

## 12. Composite Index Strategy

Composite indexes optimize queries filtering by multiple columns.

### 12.1 When to Use Composite Indexes

Composite indexes should be used when queries consistently filter by the same column combinations.

**Composite Index Justification:**
```
Query: SELECT * FROM artifacts 
       WHERE owner_id = ? AND era_id = ? 
       ORDER BY rarity DESC

Justification:
- Two equality conditions (owner_id, era_id)
- Frequently executed together
- Covers sorting without additional sort step
```

### 12.2 Column Ordering Principles

Column order in composite indexes significantly impacts effectiveness.

**Ordering Rules:**
| Column Type | Position | Rationale |
|-------------|----------|----------|
| Equality (=) | First | Reduces index slice |
| Range (<, >, BETWEEN) | Last | Preserves index use |
| High cardinality | Earlier | Reduces rows faster |
| Sort columns | Last | Enables index-only sort |

**Example:**
```
Query: WHERE country = 'US' AND age > 25 ORDER BY score DESC

Correct: (country, age, score DESC)
Wrong: (age, country, score DESC)
```

### 12.3 Query Coverage

Composite indexes can cover entire queries, eliminating table access.

**Covering Index Pattern:**
```
Query: SELECT user_id, level, experience 
       FROM players 
       WHERE level > 10

Covering index: (level) INCLUDE (user_id, experience)
Benefit: Index-only scan, no table access
```

### 12.4 Composite Index Examples

| Query Pattern | Recommended Index |
|---------------|-------------------|
| Player's artifacts by era | `(owner_id, era_id)` |
| Player's artifacts by rarity | `(owner_id, rarity)` |
| Active events by type | `(status, event_type, start_time)` |
| Unclaimed rewards by type | `(user_id, is_claimed, reward_type)` |
| Leaderboard rankings | `(leaderboard_id, period, score DESC)` |

---

## 13. Monitoring Standards

Index monitoring ensures indexes remain effective and efficient over time.

### 13.1 Slow Query Tracking

Slow queries indicate potential index optimization opportunities.

**Slow Query Thresholds:**
| Query Type | Warning | Critical |
|------------|---------|----------|
| Simple lookup | > 10ms | > 50ms |
| JOIN query | > 50ms | > 200ms |
| Aggregation | > 200ms | > 1s |
| Full scan | > 1s | > 5s |

**Monitoring Approach:**
- Enable `pg_stat_statements` for query tracking
- Log queries exceeding threshold
- Review weekly for optimization opportunities

### 13.2 Index Utilization

Index utilization metrics show how often indexes are used.

**Utilization Metrics:**
| Metric | Target | Action |
|--------|--------|--------|
| Index scans / total scans | > 90% | Good |
| Index size / table size | < 50% | Acceptable |
| Index hit rate | > 99% | Good |
| Unused indexes | 0 | Drop unused |

**Monitoring Query:**
```sql
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### 13.3 Query Performance

Query performance tracking identifies degradation over time.

**Performance Metrics:**
| Metric | Collection | Retention |
|--------|------------|-----------|
| Query duration | Every query | 30 days |
| Query plan | On slow query | 90 days |
| Index size | Daily | 1 year |
| Table size | Daily | 1 year |

### 13.4 Index Maintenance

Index maintenance ensures indexes remain efficient.

**Maintenance Tasks:**
| Task | Frequency | Purpose |
|------|-----------|---------|
| VACUUM | Daily | reclaim space |
| ANALYZE | Daily | Update statistics |
| REINDEX | Weekly (if needed) | Compact large indexes |
| Size check | Weekly | Identify bloat |

---

## 14. Maintenance Philosophy

Index maintenance ensures long-term performance and efficiency.

### 14.1 Index Reviews

Regular index reviews identify optimization opportunities.

**Review Frequency:**
| Review Type | Frequency | Participants |
|-------------|----------|--------------|
| Utilization review | Weekly | DBA |
| Slow query review | Weekly | Development |
| Unused index review | Monthly | DBA |
| Full performance audit | Quarterly | Team lead |

**Review Checklist:**
- [ ] Identify unused indexes
- [ ] Identify missing indexes
- [ ] Check index bloat
- [ ] Verify query plans
- [ ] Assess composite index coverage

### 14.2 Index Cleanup

Unused and redundant indexes should be removed promptly.

**Cleanup Triggers:**
| Trigger | Action |
|---------|--------|
| Zero scans for 30 days | Drop index |
| Duplicate index | Drop duplicate |
| Redundant index | Drop redundant |
| Replaced by composite | Drop original |

**Drop Procedure:**
1. Verify no query uses the index
2. Test in staging environment
3. Schedule low-traffic window for production
4. Monitor query performance post-drop
5. Document removal in migration

### 14.3 Index Evolution

Indexes evolve as query patterns and data volumes change.

**Evolution Triggers:**
| Trigger | Evolution Action |
|---------|------------------|
| New query pattern | Add covering index |
| Data growth | Partition + local indexes |
| Schema change | Update dependent indexes |
| Performance degradation | Rebuild or replace |

**Evolution Process:**
1. Identify performance issue
2. Analyze query patterns
3. Design new index
4. Test in staging
5. Deploy with monitoring
6. Remove old index if applicable

---

## 15. Scaling Philosophy

The indexing strategy must support Jolt Time's growth from thousands to millions of users.

### 15.1 Scale: 10,000 Users

At 10,000 users, basic indexing ensures responsive performance.

**Expected Data:**
| Table | Estimated Rows |
|-------|----------------|
| players | 10,000 |
| artifacts | 100,000 |
| transactions | 1,000,000 |
| events | 100 |

**Index Count:** 20-30 indexes  
**Index Storage:** < 100MB

**Primary Focus:**
- Primary key indexes
- Foreign key indexes
- Common query patterns

### 15.2 Scale: 100,000 Users

At 100,000 users, composite indexes and query optimization become critical.

**Expected Data:**
| Table | Estimated Rows |
|-------|----------------|
| players | 100,000 |
| artifacts | 1,000,000 |
| transactions | 10,000,000 |
| events | 1,000 |

**Index Count:** 40-60 indexes  
**Index Storage:** < 1GB

**Additional Focus:**
- Composite covering indexes
- Partial indexes for active data
- Search optimization indexes
- Analytics aggregation indexes

### 15.3 Scale: 1,000,000+ Users

At 1,000,000+ users, partitioning and advanced optimization are required.

**Expected Data:**
| Table | Estimated Rows |
|-------|----------------|
| players | 1,000,000+ |
| artifacts | 10,000,000+ |
| transactions | 100,000,000+ |
| events | 10,000+ |

**Index Count:** 80-120 indexes  
**Index Storage:** < 10GB

**Advanced Focus:**
- Table partitioning with local indexes
- Index compression
- Expression indexes
- JSONB indexes for flexible schemas
- Partition-aware composite indexes

### 15.4 Scaling Strategies

| Strategy | Trigger | Implementation |
|----------|---------|----------------|
| Add composite index | Multi-column filter queries | Composite covering index |
| Add partial index | Queries on data subset | Partial index on active rows |
| Partition table | > 10M rows | Range partitioning by date |
| Add expression index | Computed column queries | Expression index |
| Use index include | Covering index needs | INCLUDE clause |

---

## 16. Future Expansion Notes

Future data domains may require specialized indexing approaches.

### 16.1 AI Data Indexing

AI-generated content and recommendations may require vector indexing.

**Potential Requirements:**
| Data Type | Index Type | Use Case |
|-----------|-----------|----------|
| Embeddings | pgvector HNSW | Similarity search |
| Recommendations | Composite | Personalized feeds |
| Content features | Expression | ML feature retrieval |

**Status:** Future concept only, not currently planned.

### 16.2 Creator Economy Data Indexing

Creator content may require marketplace-style indexes.

**Potential Requirements:**
| Data Type | Index Type | Use Case |
|-----------|-----------|----------|
| Content metadata | Composite | Discovery |
| Creator rankings | Composite | Leaderboards |
| Content search | Full-text | Search |

**Status:** Future concept only, not currently planned.

### 16.3 Web3 Systems Indexing

Blockchain integration may require address-based indexes.

**Potential Requirements:**
| Data Type | Index Type | Use Case |
|-----------|-----------|----------|
| Wallet addresses | B-tree | User lookup |
| Transaction hashes | B-tree | History lookup |
| Token balances | Composite | Balance queries |

**Status:** Future concept only, not currently planned.

### 16.4 NFT Systems Indexing

NFT ownership tracking may require specialized indexes.

**Potential Requirements:**
| Data Type | Index Type | Use Case |
|-----------|-----------|----------|
| Ownership | Composite | Owner lookup |
| Token metadata | JSONB | Property search |
| Transaction history | Composite | Activity tracking |

**Status:** Future concept only, not currently planned.

### 16.5 Esports Systems Indexing

Competitive gaming may require real-time ranking indexes.

**Potential Requirements:**
| Data Type | Index Type | Use Case |
|-----------|-----------|----------|
| Match results | Composite | History queries |
| Team rankings | Composite | Live rankings |
| Player stats | Expression | Aggregations |

**Status:** Future concept only, not currently planned.

---

## 17. Long-Term Philosophy

The indexing strategy serves Jolt Time's long-term performance and scalability needs.

### 17.1 Improve Performance

Indexes provide predictable, low-latency query performance.

**Performance Benefits:**
| Benefit | Impact |
|---------|--------|
| Fast lookups | < 1ms primary key access |
| Efficient joins | < 5ms foreign key access |
| Smooth aggregations | < 100ms analytics |
| Responsive search | < 50ms text search |

### 17.2 Support Growth

Indexes scale with data volumes while maintaining performance.

**Growth Support:**
| Scale | Strategy |
|-------|----------|
| 10K users | Basic indexing |
| 100K users | Composite + partial |
| 1M+ users | Partitioning + advanced |

### 17.3 Reduce Database Costs

Efficient indexes reduce compute and storage costs.

**Cost Reduction:**
| Cost Factor | Index Benefit |
|-------------|---------------|
| Compute | Fewer full table scans |
| Memory | Better buffer pool usage |
| Storage | Appropriate index sizing |
| I/O | Reduced disk reads |

### 17.4 Simplify Scaling

Good indexing simplifies horizontal and vertical scaling.

**Scaling Benefits:**
| Challenge | Index Solution |
|-----------|-----------------|
| Write scaling | Minimal necessary indexes |
| Read scaling | Read replicas effective |
| Data growth | Partition-friendly indexes |
| Query complexity | Covering indexes |

---

## Related Documentation

- **Database Migrations:** `.openhands/knowledge/database-migrations.md`
- **RPC Architecture:** `.openhands/knowledge/supabase-rpc-architecture.md`
- **Repository Pattern:** `.openhands/knowledge/repository-pattern.md`
- **AdsGram Integration:** `.openhands/knowledge/adsgram.md`
- **Analytics:** `.openhands/knowledge/analytics.md`

---

*Building the future through the lens of the past.*
