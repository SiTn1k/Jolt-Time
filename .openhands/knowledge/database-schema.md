# Jolt Time — Database Schema Master Plan

## Overview

This document defines the complete database architecture philosophy for the Jolt Time ecosystem. The database is one of the most critical parts of the project — it must scale to millions of players, support complex game mechanics, protect player progress, and enable long-term growth.

The structure prioritizes **scalability**, **maintainability**, and **long-term growth**. All decisions are made with the understanding that Jolt Time will expand significantly beyond its initial release.

**Technology Stack:** Supabase (PostgreSQL, Auth, Realtime, Edge Functions)

---

## Database Categories

The Jolt Time database is organized into eight distinct categories. Each category contains related tables that share similar access patterns, retention policies, and scaling requirements.

### 1. Player Tables

Core player identity, progression, and state.

- `profiles` — Primary player record
- `player_stats` — Lifetime statistics and achievements
- `player_settings` — User preferences and configuration
- `player_achievements` — Unlocked achievements
- `player_progression` — Era/story progression state
- `player_daily_state` — Daily reset state (streaks, daily claims)

### 2. Economy Tables

Currency, inventory, and transactional systems.

- `currencies` — Currency definitions
- `player_currencies` — Per-player currency balances
- `marketplace_listings` — Active player-to-player listings
- `marketplace_transactions` — Completed trades
- `transactions` — Economic ledger (immutable audit log)
- `pack_definitions` — Purchasable pack templates
- `player_pack_purchases` — Purchase history

### 3. Museum Tables

Artifact collection and museum display systems.

- `artifacts` — Artifact catalog (read-only reference)
- `artifact_evolution_trees` — Evolution prerequisites
- `player_artifacts` — Player inventory
- `museum_collections` — Collection definitions
- `player_museum_collections` — Collection completion progress
- `museum_displays` — Museum layout slots
- `player_museum_displays` — Player museum configuration

### 4. Event Tables

Time-limited events and seasonal content.

- `events` — Event definitions (read-only)
- `player_events` — Participation and progress
- `event_rewards` — Reward tier definitions
- `player_event_rewards` — Claimed rewards
- `battle_pass_seasons` — Season definitions
- `player_battle_pass` — Season progress
- `battle_pass_tiers` — Tier definitions

### 5. PvP Tables

Competitive play and ranking systems.

- `battle_history` — Match records
- `player_rankings` — Current rank information
- `leaderboards` — Leaderboard configurations
- `leaderboard_snapshots` — Periodic snapshots
- `tournaments` — Tournament definitions
- `player_tournaments` — Tournament participation
- `player_ratings` — ELO/mmr tracking

### 6. Social Tables

Friends, guilds, and community features.

- `friendships` — Friend relationships
- `friend_requests` — Pending requests
- `guilds` — Guild data
- `guild_members` — Membership records
- `guild_ranks` — Rank definitions
- `guild_applications` — Pending applications
- `chat_messages` — In-game chat (future)
- `clips` — Shared moments (future)

### 7. Analytics Tables

Player metrics, monetization tracking, and AdsGram data.

- `ads_views` — Individual ad view records
- `ads_statistics` — Aggregated ad metrics
- `player_session_logs` — Session start/end events
- `economy_snapshots` — Periodic economy state
- `player_retention_events` — Retention milestone events
- `revenue_events` — Purchase and subscription events
- `user_ad_settings` — Ad preferences

### 8. Administration Tables

System configuration, moderation, and audit logging.

- `admin_audit_log` — Sensitive operation records
- `moderation_actions` — User/content moderation
- `system_settings` — Feature flags and config
- `data_exports` — GDPR data export requests
- `bot_users` — Telegram bot user tracking
- `bot_logs` — Bot operation logs
- `notification_cooldowns` — Rate limiting
- `notification_queue` — Deferred notifications
- `cron_job_status` — Scheduled job tracking

---

## Core Table Philosophy

### Logical Separation

Each table category maps to a distinct domain in the game. This separation ensures:

- **Clear ownership** — Each domain team knows which tables they own
- **Independent scaling** — High-traffic categories (analytics) can scale separately
- **Targeted backups** — Critical tables (player, economy) can have stricter backup policies
- **Simplified permissions** — RLS policies can be domain-specific

### Table Sizing Strategy

No single table should exceed reasonable PostgreSQL limits:

- **Maximum rows per table:** 1 billion (architectural limit)
- **Typical user table cap:** 100 million rows before partitioning consideration
- **Analytics tables:** Partitioned by month from the start
- **Large history tables:** Partitioned when approaching 10 million rows

When a table approaches these thresholds, implement partitioning or archival before problems emerge.

### Support for Future Expansion

Every table is designed with extensibility in mind:

- **JSONB columns** for optional/evolving data without schema changes
- **Foreign key constraints** that allow NULL for future relation types
- **is_active flags** instead of row deletion for "soft" removal
- **created_at/updated_at** on every table for auditability
- **Extensible enums** using VARCHAR until values are stable

---

## Player Data Structure

The player is the central entity in Jolt Time. All other data traces back to a player.

### Profiles

The `profiles` table is the single source of truth for player identity.

```
profiles
├── id (PK, UUID)           — Internal identifier
├── telegram_id (BIGINT)    — Telegram user ID (unique)
├── username (VARCHAR)       — Telegram username
├── first_name (VARCHAR)     — Display name
├── avatar_url (TEXT)        — Profile picture
├── level (INTEGER)          — Current progression level
├── experience (BIGINT)      — Total XP earned
├── current_era (VARCHAR)   — Unlocked era key
├── is_premium (BOOLEAN)    — Jolt Time Plus subscriber
├── is_banned (BOOLEAN)     — Account status
├── created_at (TIMESTAMPTZ)— Account creation
└── last_login_at (TIMESTAMPTZ) — Last session timestamp
```

**Design Decisions:**
- `telegram_id` is the natural key for authentication — no email/password
- Level and experience are denormalized here for fast leaderboard queries
- No password field — authentication handled entirely by Telegram

### Progression

Player progression is tracked across multiple dimensions:

```
player_progression
├── user_id (FK → profiles.id)
├── unlocked_eras (JSONB)        — Array of era keys
├── completed_stories (JSONB)     — Story completion records
├── tutorial_step (INTEGER)      — Current tutorial position
├── tutorial_completed_at (TIMESTAMPTZ)
└── world_position (JSONB)       — Current map position

player_daily_state
├── user_id (FK → profiles.id)
├── daily_streak (INTEGER)       — Current login streak
├── longest_streak (INTEGER)     — Historical best
├── last_login_date (DATE)       — For streak calculation
├── energy_last_refill (TIMESTAMPTZ) — For regeneration calc
├── daily_quests_reset_at (TIMESTAMPTZ)
└── daily_rewards_claimed (INTEGER) — Calendar position (1-7)
```

### Settings

User preferences are stored separately for clean separation:

```
player_settings
├── user_id (FK → profiles.id) (PK)
├── notifications_enabled (BOOLEAN)
├── notification_types (JSONB)         — Granular toggles
├── sound_enabled (BOOLEAN)
├── music_enabled (BOOLEAN)
├── vibration_enabled (BOOLEAN)
├── language_preference (VARCHAR)       — UI language
├── timezone (VARCHAR)                  — For event scheduling
├── privacy_show_profile (BOOLEAN)      — Leaderboard visibility
├── privacy_show_stats (BOOLEAN)        — Profile stats public
├── theme_mode (VARCHAR)                — dark/light/system
├── chat_enabled (BOOLEAN)              — In-game chat toggle
└── marketing_opt_in (BOOLEAN)          — External communications
```

### Statistics

Aggregate statistics are maintained for performance:

```
player_stats
├── user_id (FK → profiles.id) (PK)
├── total_clicks (BIGINT)          — All time clicks
├── total_energy_spent (BIGINT)   — All time consumption
├── total_battles (INTEGER)       — PvP matches played
├── battles_won (INTEGER)         — PvP victories
├── artifacts_collected (INTEGER) — Unique artifacts owned
├── quests_completed (INTEGER)    — Total quests finished
├── events_participated (INTEGER) — Events joined
├── total_play_time (INTERVAL)    — Cumulative session time
├── ads_watched (INTEGER)         — Total ads viewed
├── currency_spent (JSONB)         — Lifetime spending tracker
└── last_stat_update (TIMESTAMPTZ)
```

**Design Notes:**
- Stats are updated asynchronously via triggers or background jobs
- Immutable counters (total_clicks) are never decremented
- currency_spent is JSONB for multi-currency tracking

---

## Economy Data Structure

The economy system must track multiple currencies, handle millions of transactions, and support player-to-player trading.

### Currencies

```
currencies (Reference Table)
├── id (UUID) (PK)
├── currency_key (VARCHAR)        — e.g., "chrono_coins"
├── name (VARCHAR)                — Display name
├── type (VARCHAR)                — soft, premium, event
├── icon_url (TEXT)                — Currency icon
├── is_active (BOOLEAN)            — Currently available
└── decimals (INTEGER)             — Display precision (0-8)
```

### Inventories

```
player_currencies
├── user_id (FK → profiles.id) (PK, composite)
├── currency_id (FK → currencies.id) (PK, composite)
├── balance (BIGINT)              — Current balance
├── lifetime_earned (BIGINT)      — All time earned (audit)
├── lifetime_spent (BIGINT)       — All time spent (audit)
└── last_transaction_at (TIMESTAMPTZ)
```

### Transactions

All economic movements flow through an immutable ledger:

```
transactions
├── id (UUID) (PK)
├── transaction_key (VARCHAR)     — Unique business key
├── user_id (FK → profiles.id)
├── currency_id (FK → currencies.id)
├── amount (BIGINT)               — Positive = credit, negative = debit
├── balance_after (BIGINT)        — Snapshot for reconciliation
├── transaction_type (VARCHAR)   — earned, spent, reward, purchase
├── source_type (VARCHAR)         — quest, battle, ads, shop, system
├── source_id (UUID)              — Related entity ID
├── metadata (JSONB)               — Additional context
└── created_at (TIMESTAMPTZ)     — Immutable timestamp

Indexes:
  - (user_id, currency_id, created_at DESC)
  - (source_type, source_id)
  - (transaction_key) UNIQUE
```

**Design Notes:**
- The `transactions` table is append-only — never update or delete rows
- `balance_after` provides point-in-time reconstruction capability
- `transaction_key` enables idempotent operations (prevent duplicate rewards)

### Marketplace Systems

```
marketplace_listings
├── id (UUID) (PK)
├── seller_id (FK → profiles.id)
├── item_type (VARCHAR)           — artifact, cosmetic, item
├── item_id (UUID)                — Reference to item
├── price_amount (BIGINT)         — Price in Chrono Coins
├── status (VARCHAR)              — active, sold, cancelled
├── expires_at (TIMESTAMPTZ)      — Auto-cancel deadline
└── created_at (TIMESTAMPTZ)

marketplace_transactions
├── id (UUID) (PK)
├── listing_id (FK)
├── seller_id (FK → profiles.id)
├── buyer_id (FK → profiles.id)
├── price_paid (BIGINT)            — Actual sale price
├── platform_fee (BIGINT)          — Jolt Time fee
├── seller_net (BIGINT)            — Seller proceeds
└── completed_at (TIMESTAMPTZ)
```

---

## Event Data Structure

Events are time-limited experiences that drive engagement spikes. The schema must handle high concurrency during event launches.

### Event Progress

```
events (Reference Table)
├── id (UUID) (PK)
├── event_key (VARCHAR)            — Programmatic ID
├── title (VARCHAR)
├── description (TEXT)
├── type (VARCHAR)                 — seasonal, limited, community
├── era (VARCHAR)                  — Associated era
├── start_date (TIMESTAMPTZ)
├── end_date (TIMESTAMPTZ)
├── participation_reward (JSONB)    — Guaranteed rewards
├── tier_rewards (JSONB)           — Rank-based rewards
├── leaderboard_enabled (BOOLEAN)
├── max_participants (INTEGER)     — Optional cap
├── requirements (JSONB)           — Level/item prerequisites
└── is_active (BOOLEAN)            — Available in game

player_events
├── id (UUID) (PK)
├── user_id (FK → profiles.id)
├── event_id (FK → events.id)
├── progress (BIGINT)              — Current point score
├── rank (INTEGER)                 — Current leaderboard rank
├── status (VARCHAR)               — active, completed, expired
├── joined_at (TIMESTAMPTZ)
├── completed_at (TIMESTAMPTZ)
└── rewards_claimed (BOOLEAN)

Constraints:
  - UNIQUE(user_id, event_id)
```

### Event Rewards

```
event_rewards (Reference Table)
├── id (UUID) (PK)
├── event_id (FK → events.id)
├── tier (INTEGER)                 — Reward tier number
├── threshold (BIGINT)             — Points needed
├── rewards (JSONB)                — {coins, items, cosmetics}
└── is_claimable (BOOLEAN)        — Active for claiming

player_event_rewards
├── id (UUID) (PK)
├── user_id (FK → profiles.id)
├── event_id (FK → events.id)
├── reward_id (FK → event_rewards.id)
├── tier (INTEGER)
└── claimed_at (TIMESTAMPTZ)

Constraints:
  - UNIQUE(user_id, reward_id)
```

### Participation History

All participation is logged for analytics:

```
event_participation_history
├── id (UUID) (PK)
├── user_id (FK → profiles.id)
├── event_id (FK → events.id)
├── final_rank (INTEGER)           — Ending rank
├── total_progress (BIGINT)       — Final point score
├── rewards_received (JSONB)      — All rewards obtained
├── duration_seconds (INTEGER)      — Time between join/complete
└── participated_at (TIMESTAMPTZ)
```

---

## Social Data Structure

Social features enable community building. The schema supports friends, guilds, and leaderboards.

### Friends

```
friendships
├── id (UUID) (PK)
├── requester_id (FK → profiles.id)
├── addressee_id (FK → profiles.id)
├── status (VARCHAR)               — accepted, blocked
├── created_at (TIMESTAMPTZ)
└── related_friendship_id (UUID)  — Reverse relationship

Indexes:
  - (requester_id, addressee_id) UNIQUE
  - (addressee_id, requester_id)
  - (requester_id, status)
  - (addressee_id, status)

friend_requests
├── id (UUID) (PK)
├── requester_id (FK → profiles.id)
├── addressee_id (FK → profiles.id)
├── message (TEXT)                 — Optional greeting
├── status (VARCHAR)               — pending, accepted, declined
├── expires_at (TIMESTAMPTZ)       — Auto-expire pending
├── created_at (TIMESTAMPTZ)
└── responded_at (TIMESTAMPTZ)

Constraints:
  - UNIQUE(requester_id, addressee_id) WHERE status = 'pending'
```

### Guilds

```
guilds
├── id (UUID) (PK)
├── name (VARCHAR)                 — Guild display name
├── tag (VARCHAR)                  — Short tag (3-5 chars)
├── description (TEXT)
├── leader_id (FK → profiles.id)
├── level (INTEGER)                — Guild level
├── experience (BIGINT)            — Guild XP
├── icon_url (TEXT)                — Guild emblem
├── banner_url (TEXT)              — Guild banner
├── settings (JSONB)               — Guild configuration
├── is_recruiting (BOOLEAN)
├── max_members (INTEGER)          — Member cap
└── created_at (TIMESTAMPTZ)

guild_members
├── id (UUID) (PK)
├── guild_id (FK → guilds.id)
├── user_id (FK → profiles.id)
├── rank_id (FK → guild_ranks.id)
├── joined_at (TIMESTAMPTZ)
├── contributed_this_week (BIGINT)
└── total_contributed (BIGINT)

Constraints:
  - UNIQUE(guild_id, user_id)
  - UNIQUE(guild_id, rank_id) WHERE rank_id = guild_leader_rank

guild_ranks (Reference Table)
├── id (UUID) (PK)
├── guild_id (FK → guilds.id)
├── name (VARCHAR)
├── position (INTEGER)             — Sort order (1 = leader)
└── permissions (JSONB)            — {can_invite, can_kick, etc}
```

### Chats (Future)

```
chat_rooms
├── id (UUID) (PK)
├── type (VARCHAR)                 — guild, direct, global
├── guild_id (FK → guilds.id)      — NULL for non-guild rooms
├── name (VARCHAR)                 — Room display name
├── settings (JSONB)
└── created_at (TIMESTAMPTZ)

chat_messages
├── id (UUID) (PK)
├── room_id (FK → chat_rooms.id)
├── user_id (FK → profiles.id)
├── content (TEXT)                 — Message content
├── attachments (JSONB)            — Media, reactions
├── edited_at (TIMESTAMPTZ)
├── deleted_at (TIMESTAMPTZ)       — Soft delete
└── created_at (TIMESTAMPTZ)

Partitioning Strategy:
  - Range partition by month on created_at
  - 3 months online, older archived to cold storage
```

### Leaderboards

```
leaderboards (Reference Table)
├── id (UUID) (PK)
├── board_key (VARCHAR)            — e.g., "weekly_experience"
├── name (VARCHAR)
├── description (TEXT)
├── type (VARCHAR)                 — weekly, monthly, all_time
├── metric (VARCHAR)               — experience, wins, artifacts
├── reset_at (TIMESTAMPTZ)         — Next reset time
├── duration_days (INTEGER)        — Period length
└── is_active (BOOLEAN)

leaderboard_snapshots
├── id (UUID) (PK)
├── leaderboard_id (FK → leaderboards.id)
├── period_start (TIMESTAMPTZ)
├── period_end (TIMESTAMPTZ)
├── snapshot_data (JSONB)          — [{rank, user_id, value}]
└── created_at (TIMESTAMPTZ)

player_rankings
├── id (UUID) (PK)
├── user_id (FK → profiles.id)
├── leaderboard_id (FK → leaderboards.id)
├── current_rank (INTEGER)
├── current_value (BIGINT)          — Metric value
├── highest_rank (INTEGER)          — Historical best
└── last_updated (TIMESTAMPTZ)

Constraints:
  - UNIQUE(user_id, leaderboard_id)
```

---

## Analytics Data Structure

Analytics track the health of the business. The schema prioritizes write performance and supports complex aggregations.

### Player Metrics

```
player_session_logs
├── id (UUID) (PK)
├── user_id (FK → profiles.id)
├── session_id (UUID)              — Groups start/end events
├── event_type (VARCHAR)           — session_start, session_end
├── platform (VARCHAR)             — mini_app, bot
├── client_version (VARCHAR)        — App version
├── device_info (JSONB)            — Device characteristics
├── session_duration (INTEGER)      — Seconds (from end event)
└── created_at (TIMESTAMPTZ)      — Event timestamp

Partitioning: RANGE BY MONTH on created_at
Retention: 6 months online, older aggregated to summary tables
```

### Monetization Metrics

```
revenue_events
├── id (UUID) (PK)
├── user_id (FK → profiles.id)
├── event_type (VARCHAR)           — subscription, purchase, refund
├── provider (VARCHAR)             — telegram_stars, adsgram
├── amount_usd (DECIMAL(10,2))    — Revenue in USD
├── currency_amount (BIGINT)        — In-game currency awarded
├── product_id (VARCHAR)           — SKU identifier
├── transaction_id (VARCHAR)        — Provider reference
└── created_at (TIMESTAMPTZ)

Indexes:
  - (user_id, created_at)
  - (created_at) for time-series queries
  - (event_type, created_at)
```

### AdsGram Statistics

AdsGram is the primary revenue system for Jolt Time. All ad-related data is tracked with high fidelity.

```
ads_views
├── id (UUID) (PK)
├── user_id (FK → profiles.id)
├── ad_type (VARCHAR)              — rewarded, interstitial, banner
├── ad_provider (VARCHAR)          — adsgram, admob
├── ad_id (VARCHAR)                — Provider's ad identifier
├── reward_type (VARCHAR)           — energy, coins, shards
├── reward_amount (BIGINT)          — Amount awarded
├── session_id (VARCHAR)           — Session tracking
├── placement (VARCHAR)             — In-game placement location
├── watched_duration_ms (INTEGER)  — Actual watch time
├── completed (BOOLEAN)             — Full view vs partial
├── error_code (VARCHAR)           — If view failed
└── created_at (TIMESTAMPTZ)      — Completion timestamp

Indexes:
  - (user_id, created_at)
  - (created_at) for time-series
  - (ad_type, created_at)
  - (reward_type, created_at)

Partitioning: RANGE BY MONTH on created_at
Retention: 12 months online, older archived

ads_statistics
├── id (UUID) (PK)
├── date (DATE)                    — Aggregation date
├── ad_type (VARCHAR)
├── ad_provider (VARCHAR)
├── total_views (INTEGER)          — Count of views
├── completed_views (INTEGER)       — Count of completed views
├── total_reward_amount (BIGINT)   — Sum of rewards given
├── estimated_revenue_usd (DECIMAL) — Estimated revenue
└── created_at (TIMESTAMPTZ)

Constraints:
  - UNIQUE(date, ad_type, ad_provider)

user_ad_settings
├── user_id (FK → profiles.id) (PK)
├── ads_enabled (BOOLEAN)          — Opt-out toggle
├── daily_ad_limit (INTEGER)        — Personal cap
├── preferred_ad_types (JSONB)     — Allowed types
├── blocked_hours (JSONB)           — Times when no ads
└── updated_at (TIMESTAMPTZ)
```

---

## Security Philosophy

Database security is foundational. Every design decision considers risk minimization.

### Principle of Least Privilege

- **Service Role:** Only for server-side operations that modify data
- **Authenticated Users:** Can only access their own data via RLS
- **Public Access:** Only for read-only reference tables
- **API Keys:** Never stored in client-accessible code

### Row Level Security (RLS)

Every table with user data has RLS enabled:

```
-- Player can only read their own data
CREATE POLICY "Users read own data" ON player_currencies
  FOR SELECT USING (auth.uid() = user_id);

-- Players can only insert their own records
CREATE POLICY "Users insert own data" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Critical tables: only service role can insert
CREATE POLICY "Service role only" ON ads_views
  FOR INSERT TO service_role USING (true);
```

### Backup Strategy

- **Full Backups:** Daily snapshots retained for 30 days
- **Point-in-Time Recovery:** Continuous WAL archiving
- **Cross-Region Replicas:** Automatic failover capability
- **Test Restores:** Monthly backup validation

### Recovery Procedures

| Scenario | Recovery Time | Data Loss |
|----------|--------------|-----------|
| Accidental delete | < 1 hour | < 24 hours |
| Database corruption | < 4 hours | None (PITR) |
| Region failure | < 1 hour | < 1 hour |
| Security breach | < 2 hours | Depends on scope |

### Audit Logging

All sensitive operations are logged:

```
admin_audit_log:
  - Schema changes (DDL)
  - User bans/unbans
  - Currency modifications
  - Bulk operations
  - Access to restricted data
```

---

## Relationship Philosophy

Clear relationships prevent data anomalies and simplify queries.

### One-to-One Relationships

Used when data belongs exclusively to a single entity.

```
profiles ←→ player_stats
profiles ←→ player_settings
profiles ←→ player_daily_state
user ←→ player_currencies (per currency)
```

**Implementation:** Primary key of parent is also the foreign key in child.

### One-to-Many Relationships

Used when one entity can have multiple related entities.

```
profiles → player_artifacts
profiles → player_quests
profiles → player_events
profiles → transactions
profiles → battle_history
profiles → friendships (as requester or addressee)
guild → guild_members
event → player_events
```

**Implementation:** Foreign key on the "many" side referencing the "one."

### Many-to-Many Relationships

Used when entities can associate with multiple counterparts.

```
profiles ←→ profiles (friendship)
profiles ←→ guilds (membership)
profiles ←→ events (participation)
artifacts ←→ player_artifacts (inventory)
```

**Implementation:** Junction table with two foreign keys.

```
friendships:
  requester_id (FK → profiles.id)
  addressee_id (FK → profiles.id)
  status (VARCHAR)
  PRIMARY KEY (requester_id, addressee_id)
```

---

## Naming Standards

Consistent naming prevents ambiguity and simplifies maintenance.

### Table Names

| Pattern | Example | Usage |
|---------|---------|-------|
| `plural_kebab_case` | `player_stats` | Standard tables |
| `plural_kebab_case` | `artifacts` | Reference/catalog tables |
| `prefix_plural` | `ads_views` | Category prefix for disambiguation |

### Column Names

| Pattern | Example | Usage |
|---------|---------|-------|
| `snake_case` | `user_id` | Standard columns |
| `_id` suffix | `profile_id` | Foreign keys |
| `_at` suffix | `created_at` | Timestamp columns |
| `_count` suffix | `view_count` | Numeric aggregates |
| `is_/has_` prefix | `is_active` | Boolean flags |
| `total_` prefix | `total_clicks` | Lifetime accumulators |

### Index Names

```
idx_{table}_{column(s)}_{purpose}
idx_profiles_telegram_id          -- Unique lookup
idx_profiles_experience_desc      -- Sorted query
idx_transactions_user_date        -- Range query
```

### Constraint Names

```
pk_{table}              -- Primary key
fk_{table}_{ref}        -- Foreign key
uq_{table}_{columns}    -- Unique constraint
ck_{table}_{column}     -- Check constraint
```

### Reserved Prefixes

| Prefix | Usage |
|--------|-------|
| `sys_` | System tables |
| `tmp_` | Temporary tables |
| `bak_` | Backup tables |
| `_old` suffix | Old table during migration |

---

## Migration Philosophy

Migrations are first-class artifacts. Every schema change is versioned, tested, and reversible.

### Versioning Convention

```
supabase/migrations/
  20240615000001_create_initial_schema.sql
  20240620000001_add_player_artifacts.sql
  20240625000001_add_guild_system.sql
```

### Migration Workflow

```
1. Author migration file with UP and DOWN sections
2. Test DOWN migration on development database
3. Review migration in pull request
4. Apply to staging environment
5. Validate application compatibility
6. Apply to production during low-traffic window
7. Monitor error rates for 30 minutes post-migration
```

### Safety Rules

**ALWAYS:**
- Include DOWN migration for rollback
- Use `CREATE INDEX CONCURRENTLY` for large tables
- Test migrations with production-scale data
- Have a rollback plan before applying

**NEVER:**
- Drop columns without deprecation period
- Alter NOT NULL constraints without checking
- Remove data without backup
- Apply destructive migrations during peak hours

### Zero-Downtime Migrations

```
Phase 1: Add column as nullable
Phase 2: Deploy code that writes to new column
Phase 3: Backfill existing rows (batched)
Phase 4: Add NOT NULL constraint
Phase 5: Remove legacy column (future migration)
```

### Rollback Procedures

Every migration documents:

```sql
-- UP: Add column
ALTER TABLE profiles ADD COLUMN new_field VARCHAR(50);

-- DOWN: Remove column
ALTER TABLE profiles DROP COLUMN new_field;

-- Verification (run before and after)
SELECT COUNT(*) FROM profiles WHERE new_field IS NOT NULL;
```

---

## Future Expansion Notes

The schema supports future systems without major refactoring.

### Sharding

When a table exceeds 100 million rows, horizontal sharding becomes necessary:

```
-- Sharding by user_id hash
CREATE TABLE player_events_0 PARTITION OF player_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE player_events_1 PARTITION OF player_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 1);
```

**Applicable Tables:**
- `transactions` (highest volume)
- `ads_views`
- `battle_history`
- `chat_messages`

### Archival Tables

Cold data moves to archival storage:

```
-- arch_transactions (partitioned by year)
-- arch_ads_views
-- arch_battle_history
-- arch_chat_messages
```

**Retention Policy:**
- Hot storage: 12 months
- Warm storage (compressed): 3 years
- Cold storage (archived): 7 years
- Delete: never (historical requirements)

### Data Warehouses

For analytics beyond PostgreSQL:

```
-- Sync to external warehouse via Supabase integrations
- BigQuery for complex analytics
- ClickHouse for real-time dashboards
- S3 for raw event archival
```

### Historical Snapshots

Track point-in-time state for rollback or analysis:

```
economy_snapshots:
  - Daily currency totals per player
  - Weekly player level distribution
  - Monthly cohort retention
```

---

## Long-Term Philosophy

Jolt Time maintains clean architecture, scalable databases, and reliable data structures through deliberate design.

### Clean Architecture

- **Separation of Concerns:** Each table category has distinct responsibilities
- **Reference Tables:** Static data separated from player-specific data
- **Immutable Ledgers:** Transactions never change — they only grow
- **Soft Deletes:** No data destruction — only deactivation

### Scalable Databases

- **Connection Pooling:** Supabase built-in pooler for connection management
- **Read Replicas:** Scale read-heavy operations across replicas
- **Partitioning:** Time-series and high-volume tables pre-partitioned
- **Caching:** Multi-layer caching strategy for hot data

### Reliable Data Structures

- **ACID Compliance:** All transactions are atomic, consistent, isolated, durable
- **Point-in-Time Recovery:** WAL archiving enables any-point restoration
- **Checksum Validation:** Database checksums detect corruption
- **Consistent Backups:** Verified backup restores monthly

---

## Documentation References

| Document | Purpose |
|----------|---------|
| `knowledge/economy-system.md` | Economy and currency specifications |
| `knowledge/adsgram.md` | AdsGram integration details |
| `knowledge/social-system.md` | Social features specifications |
| `knowledge/guild-system.md` | Guild system design |
| `knowledge/events.md` | Event system specifications |
| `knowledge/museum-system.md` | Museum and artifact systems |
| `knowledge/pvp-arena.md` | PvP and ranking systems |
| `knowledge/analytics.md` | Analytics tracking specifications |
| `knowledge/backup-system.md` | Backup and recovery procedures |
| `agents/database.md` | Database Agent responsibilities |

---

*Database architecture is the foundation upon which empires are built — take the time to do it right.*
