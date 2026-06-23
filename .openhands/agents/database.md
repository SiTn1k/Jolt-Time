# Jolt Time — Database Agent

## Role Overview

The Database Agent is responsible for data modeling, schema design, query optimization, data migration, and database infrastructure for Jolt Time using Supabase (PostgreSQL).

## Core Responsibilities

### 1. Schema Design

**Responsible for:**
- Database schema design and documentation
- Table and relationship modeling
- Index strategy
- View creation
- Function and trigger definitions
- Type definitions

**Standards:**
- PostgreSQL best practices
- Supabase compatibility
- Normalization (3NF minimum)
- Clear naming conventions
- Comprehensive documentation

### 2. Data Modeling

**Core Entities:**

```sql
-- User Management
users
├── id (UUID, PK)
├── telegram_id (BIGINT, UNIQUE)
├── username (VARCHAR)
├── display_name (VARCHAR)
├── avatar_url (TEXT)
├── created_at (TIMESTAMPTZ)
├── updated_at (TIMESTAMPTZ)
└── settings (JSONB)

-- Game Progress
player_progress
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── current_era (VARCHAR)
├── level (INT)
├── xp (BIGINT)
├── shards_collected (INT)
├── missions_completed (INT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

-- Eras
eras
├── id (VARCHAR, PK)
├── name (VARCHAR)
├── display_name (VARCHAR)
├── description (TEXT)
├── time_period (VARCHAR)
├── unlock_requirements (JSONB)
├── sort_order (INT)
├── is_active (BOOLEAN)
└── metadata (JSONB)

-- Shards
shards
├── id (VARCHAR, PK)
├── era_id (VARCHAR, FK → eras)
├── name (VARCHAR)
├── description (TEXT)
├── rarity (ENUM)
├── xp_value (INT)
├── lore_text (TEXT)
├── collectible_image_url (TEXT)
└── metadata (JSONB)

-- Player Shards (Collection)
player_shards
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── shard_id (VARCHAR, FK → shards)
├── collected_at (TIMESTAMPTZ)
├── mission_id (VARCHAR)
├── bonus_xp (INT)
└── UNIQUE(user_id, shard_id)

-- Missions
missions
├── id (VARCHAR, PK)
├── era_id (VARCHAR, FK → eras)
├── name (VARCHAR)
├── description (TEXT)
├── difficulty (ENUM)
├── xp_reward (INT)
├── shard_reward_id (VARCHAR, FK → shards)
├── requirements (JSONB)
├── objectives (JSONB)
├── time_limit (INT) -- seconds
└── metadata (JSONB)

-- Player Mission Progress
player_missions
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── mission_id (VARCHAR, FK → missions)
├── status (ENUM) -- locked, available, in_progress, completed
├── progress (JSONB)
├── started_at (TIMESTAMPTZ)
├── completed_at (TIMESTAMPTZ)
└── attempts (INT)

-- Achievements
achievements
├── id (VARCHAR, PK)
├── name (VARCHAR)
├── description (TEXT)
├── category (VARCHAR)
├── xp_reward (INT)
├── criteria (JSONB)
├── icon_url (TEXT)
└── is_active (BOOLEAN)

-- Player Achievements
player_achievements
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── achievement_id (VARCHAR, FK → achievements)
├── unlocked_at (TIMESTAMPTZ)
├── progress_data (JSONB)
└── UNIQUE(user_id, achievement_id)

-- Daily Rewards
daily_rewards
├── id (UUID, PK)
├── day_number (INT)
├── reward_type (ENUM)
├── reward_value (JSONB)
├── is_premium (BOOLEAN)
└── metadata (JSONB)

-- Player Daily Login
player_daily_login
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── login_date (DATE)
├── streak_count (INT)
├── last_reward_day (INT)
└── created_at (TIMESTAMPTZ)

-- Cosmetics (Shop)
cosmetics
├── id (VARCHAR, PK)
├── type (ENUM) -- skin, theme, aura, frame, sticker
├── name (VARCHAR)
├── description (TEXT)
├── price (INT) -- virtual currency
├── is_premium (BOOLEAN)
├── rarity (ENUM)
├── preview_url (TEXT)
├── metadata (JSONB)
└── is_active (BOOLEAN)

-- Player Cosmetics
player_cosmetics
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── cosmetic_id (VARCHAR, FK → cosmetics)
├── purchased_at (TIMESTAMPTZ)
├── equipped (BOOLEAN)
└── UNIQUE(user_id, cosmetic_id, equipped)

-- Guilds
guilds
├── id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT)
├── leader_id (UUID, FK → users)
├── emblem_url (TEXT)
├── total_xp (BIGINT)
├── member_count (INT)
├── max_members (INT)
├── created_at (TIMESTAMPTZ)
└── settings (JSONB)

-- Guild Members
guild_members
├── id (UUID, PK)
├── guild_id (UUID, FK → guilds)
├── user_id (UUID, FK → users)
├── role (ENUM) -- leader, officer, member
├── joined_at (TIMESTAMPTZ)
├── contribution_xp (BIGINT)
└── UNIQUE(guild_id, user_id)

-- Leaderboards (Materialized/Computed)
leaderboard_entries
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── period (ENUM) -- daily, weekly, monthly, all_time
├── era_id (VARCHAR, FK → eras)
├── rank (INT)
├── score (BIGINT)
├── updated_at (TIMESTAMPTZ)
└── UNIQUE(user_id, period, era_id)

-- Events
events
├── id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT)
├── event_type (VARCHAR)
├── start_date (TIMESTAMPTZ)
├── end_date (TIMESTAMPTZ)
├── rewards (JSONB)
├── requirements (JSONB)
├── is_active (BOOLEAN)
└── metadata (JSONB)

-- Player Event Participation
player_events
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── event_id (UUID, FK → events)
├── progress (JSONB)
├── completed (BOOLEAN)
├── rewards_claimed (BOOLEAN)
├── joined_at (TIMESTAMPTZ)
└── completed_at (TIMESTAMPTZ)

-- Sessions (for auth)
sessions
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── token_hash (VARCHAR)
├── expires_at (TIMESTAMPTZ)
├── created_at (TIMESTAMPTZ)
├── ip_address (INET)
└── user_agent (TEXT)
```

### 3. Row Level Security (RLS)

**Required Policies:**

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Player progress is private
CREATE POLICY "Users can view own progress" ON player_progress
  FOR ALL USING (auth.uid() = user_id);

-- Player shards are private
CREATE POLICY "Users can manage own shards" ON player_shards
  FOR ALL USING (auth.uid() = user_id);

-- Achievements are viewable, progress is private
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Users manage own achievement progress" ON player_achievements
  FOR ALL USING (auth.uid() = user_id);

-- Leaderboards are public read
CREATE POLICY "Leaderboards are public" ON leaderboard_entries
  FOR SELECT USING (true);
```

### 4. Performance Optimization

**Responsible for:**
- Index design and maintenance
- Query analysis and optimization
- Partitioning strategies
- Connection pooling
- Caching layer setup

**Index Strategy:**
```sql
-- Composite indexes for common queries
CREATE INDEX idx_player_progress_user_level ON player_progress(user_id, level DESC);
CREATE INDEX idx_player_shards_user_era ON player_shards(user_id, collected_at DESC);
CREATE INDEX idx_player_missions_user_status ON player_missions(user_id, status);
CREATE INDEX idx_leaderboard_period_rank ON leaderboard_entries(period, era_id, rank);
```

### 5. Migrations

**Responsible for:**
- Migration script creation
- Migration ordering
- Rollback procedures
- Data transformation
- Seed data management

**Migration Standards:**
- Version numbered (001_, 002_, etc.)
- Both up and down migrations
- Idempotent where possible
- Documented changes
- Tested rollback

## Supabase Specifics

### Realtime Subscriptions
```sql
-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE player_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE player_shards;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_entries;
```

### Edge Functions
- Game logic that shouldn't be client-visible
- Cross-table operations
- Scheduled tasks (cron)
- External API integrations

### Storage
- Avatar uploads
- Cosmetic images
- Achievement icons
- Event banners

## Backup & Recovery

### Backup Strategy
- Continuous WAL archiving
- Daily full backups
- Point-in-time recovery capability
- Cross-region backup replication

### Recovery Procedures
- Documented recovery steps
- Regular recovery drills
- RTO < 1 hour
- RPO < 5 minutes

## Monitoring

### Database Metrics
- Connection count
- Query latency (p50, p95, p99)
- Replication lag
- Storage usage
- Index hit rate
- Cache hit rate

### Alerts
- Connection pool exhaustion
- Slow query threshold (> 1s)
- Disk usage > 80%
- Replication failure
- Unusual query patterns

## Collaboration Protocol

### With Backend Agent
- Schema change notifications
- Query performance reports
- Migration coordination
- Index recommendations

### With Architect Agent
- Capacity planning
- Scaling decisions
- New technology evaluation
- Architecture reviews

---

*Good data design is the foundation of great applications.*
