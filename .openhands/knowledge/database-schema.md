# Jolt Time — Supabase Database Architecture

## Overview

This document outlines the complete database architecture for Jolt Time using Supabase (PostgreSQL). The design prioritizes data integrity, performance, security, and scalability.

---

## Design Principles

1. **Normalization** — Reduce data redundancy, maintain integrity
2. **Indexing** — Optimize frequent queries
3. **Security** — Row Level Security on all user data
4. **Scalability** — Support millions of users
5. **Auditability** — Track important changes

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              JOLT TIME DATABASE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐       ┌──────────────────┐       ┌───────────────────┐    │
│  │   profiles   │       │  player_stats    │       │   user_settings   │    │
│  │──────────────│       │──────────────────│       │───────────────────│    │
│  │ PK id       │──┐    │ PK user_id (FK)  │──┐    │ PK user_id (FK)  │──┐ │
│  │    telegram_id   │    │    total_clicks │  │    │    settings...    │  │ │
│  │    username  │  │    │    daily_streak │  │    └───────────────────┘  │ │
│  │    level     │  │    └──────────────────┘  │                           │ │
│  │    energy    │  │                         │                           │ │
│  │    coins     │  │                         │                           │ │
│  └──────────────┘  │                         │                           │ │
│         │          │                         │                           │ │
│         │    ┌─────┴───────────┐     ┌───────┴────────┐                  │ │
│         │    │                │     │               │                  │ │
│         ▼    ▼                ▼     ▼               ▼                  │ │
│  ┌────────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────────┐    │ │
│  │ user_      │  │ user_        │  │ daily_   │  │  user_quests   │    │ │
│  │ artifacts  │  │ daily_rewards│  │ login_   │  │────────────────│    │ │
│  │────────────│  │──────────────│  │ log      │  │ quest_id (FK)  │    │ │
│  │ FK user_id │  │ FK user_id   │  │──────────│  │ progress       │    │ │
│  │ FK artifact│  │ current_day  │  │ FK user_ │  │ completed      │    │ │
│  │ level      │  │ last_claim   │  │ FK quest │  └────────────────┘    │ │
│  │ copies     │  └──────────────┘  └──────────┘                       │ │
│  └────────────┘                          │                              │ │
│         │                                │                              │ │
│         │    ┌──────────────────────────┘                              │ │
│         │    │                                                         │ │
│         ▼    ▼                                                         │ │
│  ┌──────────────┐       ┌──────────────┐                                │ │
│  │  artifacts   │       │   quests     │                                │ │
│  │──────────────│       │──────────────│                                │ │
│  │ PK id        │       │ PK id        │                                │ │
│  │    name      │       │    title     │                                │ │
│  │    era       │       │    type      │                                │ │
│  │    rarity    │       │    rewards   │                                │ │
│  │    stats...  │       │    active    │                                │ │
│  └──────────────┘       └──────────────┘                                │ │
│                                                                             │
│  ┌──────────────┐       ┌──────────────┐       ┌───────────────────┐    │
│  │ battle_      │       │  ads_        │       │   notifications   │    │
│  │ history      │       │  history     │       │───────────────────│    │
│  │──────────────│       │──────────────│       │ FK user_id       │    │
│  │ PK id        │       │ PK id        │       │    type          │    │
│  │ FK user_id   │       │ FK user_id   │       │    read          │    │
│  │    result    │       │    ad_type   │       │    created_at    │    │
│  │    rewards   │       │    watched_at│       └───────────────────┘    │
│  └──────────────┘       └──────────────┘                                │
│                                                                             │
│  ┌──────────────┐       ┌──────────────┐                                │
│  │   events     │       │ user_events  │                                │
│  │──────────────│       │──────────────│                                │
│  │ PK id        │──────│ FK event_id  │                                │
│  │    title     │       │ FK user_id   │                                │
│  │    dates...  │       │    progress  │                                │
│  │    active    │       └──────────────┘                                │
│  └──────────────┘                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Table Definitions

### 1. profiles

**Purpose:** Main user profile table

```yaml
table: profiles

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique identifier"
    
  telegram_id:
    type: BIGINT
    constraints: UNIQUE, NOT NULL
    description: "Telegram user ID"
    
  username:
    type: VARCHAR(255)
    constraints: NULLABLE
    description: "Telegram username"
    
  first_name:
    type: VARCHAR(255)
    constraints: NOT NULL
    description: "User's first name"
    
  language:
    type: VARCHAR(10)
    constraints: DEFAULT 'en'
    description: "Preferred language code"
    
  avatar_url:
    type: TEXT
    constraints: NULLABLE
    description: "Profile avatar URL"
    
  level:
    type: INTEGER
    constraints: DEFAULT 1
    description: "Current player level"
    
  experience:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Current experience points"
    
  energy:
    type: INTEGER
    constraints: DEFAULT 100
    description: "Current time energy"
    
  max_energy:
    type: INTEGER
    constraints: DEFAULT 100
    description: "Maximum energy capacity"
    
  coins:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Chrono Dust balance"
    
  time_shards:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Premium currency (paid only)"
    
  current_era:
    type: VARCHAR(50)
    constraints: DEFAULT 'mesopotamia'
    description: "Current unlocked era"
    
  created_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    description: "Account creation time"
    
  last_login_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Last login timestamp"
    
  updated_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    description: "Last update timestamp"
```

**Indexes:**
```yaml
indexes:
  - idx_profiles_telegram_id: "telegram_id"
  - idx_profiles_level: "level DESC"
  - idx_profiles_experience: "experience DESC"
  - idx_profiles_last_login: "last_login_at"
```

**Relationships:**
- One-to-One: player_stats (via user_id)
- One-to-One: user_settings (via user_id)
- One-to-Many: user_artifacts (via user_id)
- One-to-Many: user_quests (via user_id)
- One-to-Many: battle_history (via user_id)
- One-to-Many: ads_history (via user_id)
- One-to-Many: notifications (via user_id)
- One-to-Many: user_daily_rewards (via user_id)
- One-to-Many: daily_login_log (via user_id)

---

### 2. player_stats

**Purpose:** Track player statistics and achievements

```yaml
table: player_stats

columns:
  user_id:
    type: UUID
    constraints: PRIMARY KEY, FOREIGN KEY (profiles.id)
    description: "Reference to profiles"
    
  total_clicks:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Total interactions"
    
  total_battles:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Total battles fought"
    
  victories:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Battles won"
    
  defeats:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Battles lost"
    
  daily_streak:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Current login streak"
    
  longest_streak:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Best streak achieved"
    
  total_ads_watched:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Total AdsGram ads watched"
    
  total_play_time:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Total play time in seconds"
    
  total_energy_spent:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Lifetime energy spent"
    
  total_fragments_collected:
    type: INTEGER
    constraints: DEFAULT 0
    description: "All-time fragments collected"
    
  missions_completed:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Total missions completed"
    
  quests_completed:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Total quests completed"
    
  artifacts_collected:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Unique artifacts owned"
    
  eras_unlocked:
    type: INTEGER
    constraints: DEFAULT 1
    description: "Number of eras unlocked"
    
  created_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    
  updated_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_player_stats_daily_streak: "daily_streak DESC"
  - idx_player_stats_level: "user_id, daily_streak DESC"
```

**Relationships:**
- One-to-One: profiles (user_id)

---

### 3. artifacts

**Purpose:** Master catalog of all artifacts

```yaml
table: artifacts

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique artifact ID"
    
  artifact_key:
    type: VARCHAR(100)
    constraints: UNIQUE, NOT NULL
    description: "Unique artifact identifier"
    
  name:
    type: VARCHAR(255)
    constraints: NOT NULL
    description: "Artifact display name"
    
  era:
    type: VARCHAR(50)
    constraints: NOT NULL
    description: "Historical era"
    values:
      - mesopotamia
      - egypt
      - greece
      - rome
      - medieval
      - renaissance
      - industrial
      - modern
      - future
      
  rarity:
    type: VARCHAR(20)
    constraints: NOT NULL
    description: "Artifact rarity tier"
    values:
      - common
      - uncommon
      - rare
      - epic
      - legendary
      - mythic
      
  attack:
    type: INTEGER
    constraints: NOT NULL
    description: "Attack power value"
    
  defense:
    type: INTEGER
    constraints: NOT NULL
    description: "Defense power value"
    
  speed:
    type: INTEGER
    constraints: NOT NULL
    description: "Speed power value"
    
  image_url:
    type: TEXT
    constraints: NULLABLE
    description: "Artifact image URL"
    
  description:
    type: TEXT
    constraints: NULLABLE
    description: "Historical description"
    
  lore_text:
    type: TEXT
    constraints: NULLABLE
    description: "In-game lore"
    
  historical_fact:
    type: TEXT
    constraints: NULLABLE
    description: "Educational fact"
    
  source_citation:
    type: TEXT
    constraints: NULLABLE
    description: "Source for historical accuracy"
    
  set_id:
    type: VARCHAR(50)
    constraints: NULLABLE
    description: "Collection set identifier"
    
  is_active:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Available in game"
    
  created_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_artifacts_era: "era"
  - idx_artifacts_rarity: "rarity"
  - idx_artifacts_set: "set_id"
  - idx_artifacts_active: "is_active"
  - idx_artifacts_era_rarity: "(era, rarity)"
```

**Relationships:**
- One-to-Many: user_artifacts (via artifact_id)

---

### 4. user_artifacts

**Purpose:** Player's artifact inventory

```yaml
table: user_artifacts

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique record ID"
    
  user_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  artifact_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (artifacts.id)
    description: "Artifact reference"
    
  level:
    type: INTEGER
    constraints: DEFAULT 1
    description: "Current upgrade level (1-5)"
    
  copies:
    type: INTEGER
    constraints: DEFAULT 1
    description: "Duplicate copies owned"
    
  is_equipped:
    type: BOOLEAN
    constraints: DEFAULT false
    description: "Currently equipped"
    
  acquired_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    description: "First acquisition time"
    
  last_upgraded_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Last upgrade time"
    
  notes:
    type: TEXT
    constraints: NULLABLE
    description: "Player notes"
```

**Unique Constraint:**
```yaml
unique:
  - "(user_id, artifact_id)" # One record per artifact per user
```

**Indexes:**
```yaml
indexes:
  - idx_user_artifacts_user: "user_id"
  - idx_user_artifacts_artifact: "artifact_id"
  - idx_user_artifacts_equipped: "user_id, is_equipped"
  - idx_user_artifacts_level: "user_id, level DESC"
```

**Relationships:**
- Many-to-One: profiles (user_id)
- Many-to-One: artifacts (artifact_id)

---

### 5. quests

**Purpose:** Master catalog of all quests

```yaml
table: quests

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique quest ID"
    
  quest_key:
    type: VARCHAR(100)
    constraints: UNIQUE, NOT NULL
    description: "Unique quest identifier"
    
  title:
    type: VARCHAR(255)
    constraints: NOT NULL
    description: "Quest display name"
    
  description:
    type: TEXT
    constraints: NOT NULL
    description: "What player must do"
    
  type:
    type: VARCHAR(50)
    constraints: NOT NULL
    description: "Quest category"
    values:
      - daily
      - weekly
      - season
      - historical
      - collection
      - special_event
      
  objective_count:
    type: INTEGER
    constraints: NOT NULL
    description: "Number required to complete"
    
  reward_coins:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Chrono Dust reward"
    
  reward_experience:
    type: BIGINT
    constraints: DEFAULT 0
    description: "XP reward"
    
  reward_time_shards:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Premium currency reward"
    
  reward_capsule_type:
    type: VARCHAR(50)
    constraints: NULLABLE
    description: "Capsule reward type if any"
    
  era_required:
    type: VARCHAR(50)
    constraints: NULLABLE
    description: "Era needed to start quest"
    
  level_required:
    type: INTEGER
    constraints: DEFAULT 1
    description: "Player level needed"
    
  is_active:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Available in game"
    
  start_date:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Quest available from"
    
  end_date:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Quest available until"
    
  display_order:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Sort order in lists"
    
  created_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_quests_type: "type"
  - idx_quests_active: "is_active"
  - idx_quests_dates: "start_date, end_date"
  - idx_quests_level: "level_required"
```

**Relationships:**
- One-to-Many: user_quests (via quest_id)

---

### 6. user_quests

**Purpose:** Player's quest progress

```yaml
table: user_quests

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique record ID"
    
  user_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  quest_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (quests.id)
    description: "Quest reference"
    
  progress:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Current progress count"
    
  completed:
    type: BOOLEAN
    constraints: DEFAULT false
    description: "Quest completed"
    
  reward_claimed:
    type: BOOLEAN
    constraints: DEFAULT false
    description: "Reward collected"
    
  started_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    description: "When player accepted"
    
  completed_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Completion timestamp"
    
  expires_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Quest expires if not completed"
```

**Unique Constraint:**
```yaml
unique:
  - "(user_id, quest_id)" # One progress per quest per user
```

**Indexes:**
```yaml
indexes:
  - idx_user_quests_user: "user_id"
  - idx_user_quests_active: "user_id, completed, reward_claimed"
  - idx_user_quests_expires: "expires_at" # For cleanup
```

**Relationships:**
- Many-to-One: profiles (user_id)
- Many-to-One: quests (quest_id)

---

### 7. daily_rewards

**Purpose:** Player's daily reward streak tracking

```yaml
table: daily_rewards

columns:
  user_id:
    type: UUID
    constraints: PRIMARY KEY, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  current_day:
    type: INTEGER
    constraints: DEFAULT 1
    description: "Current streak day (1-7 cycle)"
    
  last_claim_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Last daily reward claim"
    
  longest_streak:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Best 7-day streak"
    
  total_claims:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Lifetime daily claims"
    
  grace_period_end:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Streak protection end time"
    
  shields_available:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Temporal shields in inventory"
    
  weekend_warrior_count:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Weekend warrior badges"
    
  updated_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_daily_rewards_streak: "current_day DESC"
  - idx_daily_rewards_claim: "last_claim_at"
```

**Relationships:**
- One-to-One: profiles (user_id)

---

### 8. daily_login_log

**Purpose:** Audit log for daily login verification

```yaml
table: daily_login_log

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    
  user_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  login_date:
    type: DATE
    constraints: NOT NULL
    description: "Date of login"
    
  login_time:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    description: "Exact login timestamp"
    
  reward_day:
    type: INTEGER
    constraints: NOT NULL
    description: "Which day of cycle (1-7)"
    
  reward_claimed:
    type: BOOLEAN
    constraints: DEFAULT false
    description: "Daily reward claimed"
```

**Unique Constraint:**
```yaml
unique:
  - "(user_id, login_date)" # One login per day per user
```

**Indexes:**
```yaml
indexes:
  - idx_daily_login_user: "user_id"
  - idx_daily_login_date: "login_date"
  - idx_daily_login_user_date: "(user_id, login_date DESC)"
```

**Relationships:**
- Many-to-One: profiles (user_id)

---

### 9. battle_history

**Purpose:** Record of player battles

```yaml
table: battle_history

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique battle ID"
    
  user_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  battle_type:
    type: VARCHAR(50)
    constraints: NOT NULL
    description: "Type of battle"
    values:
      - mission
      - challenge
      - event
      - pvp
      
  enemy_type:
    type: VARCHAR(100)
    constraints: NULLABLE
    description: "Enemy encountered"
    
  result:
    type: VARCHAR(20)
    constraints: NOT NULL
    description: "Battle outcome"
    values:
      - victory
      - defeat
      - draw
      
  difficulty:
    type: VARCHAR(20)
    constraints: NULLABLE
    values:
      - easy
      - medium
      - hard
      - epic
      
  energy_spent:
    type: INTEGER
    constraints: DEFAULT 0
    description: "Energy used"
    
  reward_coins:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Coins earned"
    
  reward_experience:
    type: BIGINT
    constraints: DEFAULT 0
    description: "XP earned"
    
  reward_artifact_id:
    type: UUID
    constraints: NULLABLE
    description: "Artifact awarded if any"
    
  duration_seconds:
    type: INTEGER
    constraints: NULLABLE
    description: "Battle duration"
    
  era:
    type: VARCHAR(50)
    constraints: NULLABLE
    description: "Era where battle occurred"
    
  mission_id:
    type: VARCHAR(100)
    constraints: NULLABLE
    description: "Mission reference if applicable"
    
  created_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_battle_history_user: "user_id"
  - idx_battle_history_result: "user_id, result"
  - idx_battle_history_date: "created_at DESC"
  - idx_battle_history_era: "user_id, era"
```

**Relationships:**
- Many-to-One: profiles (user_id)
- Many-to-One: artifacts (reward_artifact_id)

---

### 10. ads_history

**Purpose:** Track AdsGram ad views for analytics

**Important:** Players do NOT earn real money from ads. Ads only provide in-game bonuses.

```yaml
table: ads_history

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique record ID"
    
  user_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  ad_type:
    type: VARCHAR(50)
    constraints: NOT NULL
    description: "Type of ad shown"
    values:
      - rewarded_video
      - interstitial
      - daily_bonus
      - event_bonus
      
  ad_id:
    type: VARCHAR(255)
    constraints: NULLABLE
    description: "AdsGram ad identifier"
    
  reward_given:
    type: JSONB
    constraints: DEFAULT '{}'
    description: "In-game rewards provided"
    example:
      energy: 50
      coins: 100
      xp: 50
      
  watched:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Ad watched to completion"
    
  skipped:
    type: BOOLEAN
    constraints: DEFAULT false
    description: "Ad was skipped"
    
  watched_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    description: "When ad was shown"
```

**Indexes:**
```yaml
indexes:
  - idx_ads_history_user: "user_id"
  - idx_ads_history_date: "watched_at DESC"
  - idx_ads_history_type: "ad_type"
  - idx_ads_history_user_date: "(user_id, watched_at DESC)"
```

**Relationships:**
- Many-to-One: profiles (user_id)

**RLS Note:** Users can only see their own ad history. Analytics aggregations use service role.

---

### 11. notifications

**Purpose:** User notification preferences and history

```yaml
table: notifications

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique notification ID"
    
  user_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (profiles.id)
    description: "Recipient player"
    
  type:
    type: VARCHAR(50)
    constraints: NOT NULL
    description: "Notification type"
    values:
      - daily_reminder
      - energy_restored
      - quest_available
      - event_start
      - event_end
      - streak_milestone
      - comeback_reward
      - weekend_bonus
      - season_start
      - limited_mission
      - friend_activity
      - weekly_summary
      
  title:
    type: VARCHAR(255)
    constraints: NOT NULL
    description: "Notification title"
    
  text:
    type: TEXT
    constraints: NOT NULL
    description: "Notification message"
    
  data:
    type: JSONB
    constraints: DEFAULT '{}'
    description: "Additional payload"
    example:
      quest_id: "uuid"
      event_id: "uuid"
      streak_day: 7
      
  read:
    type: BOOLEAN
    constraints: DEFAULT false
    description: "User has read"
    
  sent_via:
    type: VARCHAR(20)
    constraints: DEFAULT 'telegram'
    description: "Delivery channel"
    
  sent_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "When notification was sent"
    
  read_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "When user read it"
    
  created_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_notifications_user: "user_id"
  - idx_notifications_unread: "user_id, read WHERE read = false"
  - idx_notifications_date: "created_at DESC"
  - idx_notifications_type: "type"
```

**Relationships:**
- Many-to-One: profiles (user_id)

---

### 12. events

**Purpose:** Master catalog of game events

```yaml
table: events

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique event ID"
    
  event_key:
    type: VARCHAR(100)
    constraints: UNIQUE, NOT NULL
    description: "Unique event identifier"
    
  title:
    type: VARCHAR(255)
    constraints: NOT NULL
    description: "Event display name"
    
  description:
    type: TEXT
    constraints: NULLABLE
    description: "Event description"
    
  type:
    type: VARCHAR(50)
    constraints: NOT NULL
    description: "Event category"
    values:
      - weekend
      - historical
      - seasonal
      - anniversary
      - community
      
  era_focus:
    type: VARCHAR(50)
    constraints: NULLABLE
    description: "Primary era if applicable"
    
  start_date:
    type: TIMESTAMPTZ
    constraints: NOT NULL
    description: "Event start"
    
  end_date:
    type: TIMESTAMPTZ
    constraints: NOT NULL
    description: "Event end"
    
  is_active:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Event enabled"
    
  community_goal_target:
    type: BIGINT
    constraints: NULLABLE
    description: "Community goal target if applicable"
    
  rewards:
    type: JSONB
    constraints: DEFAULT '{}'
    description: "Event reward configuration"
    
  banner_url:
    type: TEXT
    constraints: NULLABLE
    description: "Event banner image"
    
  created_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_events_active: "is_active"
  - idx_events_dates: "start_date, end_date"
  - idx_events_type: "type"
  - idx_events_current: "is_active, start_date, end_date" # Current events
```

**Relationships:**
- One-to-Many: user_events (via event_id)

---

### 13. user_events

**Purpose:** Player's event participation

```yaml
table: user_events

columns:
  id:
    type: UUID
    constraints: PRIMARY KEY, DEFAULT gen_random_uuid()
    description: "Unique record ID"
    
  user_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  event_id:
    type: UUID
    constraints: NOT NULL, FOREIGN KEY (events.id)
    description: "Event reference"
    
  progress:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Event progress"
    
  contribution:
    type: BIGINT
    constraints: DEFAULT 0
    description: "Contribution to community goal"
    
  rewards_claimed:
    type: BOOLEAN
    constraints: DEFAULT false
    description: "Event rewards collected"
    
  participated_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
    description: "First participation"
    
  completed_at:
    type: TIMESTAMPTZ
    constraints: NULLABLE
    description: "Event completion time"
```

**Unique Constraint:**
```yaml
unique:
  - "(user_id, event_id)"
```

**Indexes:**
```yaml
indexes:
  - idx_user_events_user: "user_id"
  - idx_user_events_event: "event_id"
  - idx_user_events_active: "user_id, rewards_claimed"
```

**Relationships:**
- Many-to-One: profiles (user_id)
- Many-to-One: events (event_id)

---

### 14. user_settings

**Purpose:** Player preferences

```yaml
table: user_settings

columns:
  user_id:
    type: UUID
    constraints: PRIMARY KEY, FOREIGN KEY (profiles.id)
    description: "Player reference"
    
  notifications_enabled:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Master notification toggle"
    
  notification_daily_reminder:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Daily reminder notifications"
    
  notification_time:
    type: TIME
    constraints: DEFAULT '10:00'
    description: "Preferred notification time"
    
  notification_event_start:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Event start notifications"
    
  notification_event_end:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Event end notifications"
    
  notification_friend_activity:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Friend activity notifications"
    
  notification_weekly_summary:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Weekly summary notifications"
    
  quiet_hours_enabled:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Quiet hours enabled"
    
  quiet_hours_start:
    type: TIME
    constraints: DEFAULT '22:00'
    description: "Quiet hours start"
    
  quiet_hours_end:
    type: TIME
    constraints: DEFAULT '08:00'
    description: "Quiet hours end"
    
  sound_enabled:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Sound effects"
    
  vibration_enabled:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Haptic feedback"
    
  language:
    type: VARCHAR(10)
    constraints: DEFAULT 'en'
    description: "Preferred language"
    
  timezone:
    type: VARCHAR(50)
    constraints: DEFAULT 'UTC'
    description: "User timezone"
    
  show_on_leaderboard:
    type: BOOLEAN
    constraints: DEFAULT true
    description: "Appear on public leaderboards"
    
  updated_at:
    type: TIMESTAMPTZ
    constraints: DEFAULT NOW()
```

**Indexes:**
```yaml
indexes:
  - idx_user_settings_language: "language"
```

**Relationships:**
- One-to-One: profiles (user_id)

---

## Row Level Security (RLS)

### RLS Overview

```yaml
rls_strategy:
  principle: "Users can only access their own data"
  enforcement: "ALL user-specific tables have RLS enabled"
  service_role: "Used only for admin operations"
  anon_key: "Limited to public data and authenticated user data"
```

### RLS Policies

#### profiles
```yaml
policies:
  - name: "Users can view own profile"
    command: SELECT
    using: "auth.uid() = id"
    
  - name: "Users can update own profile"
    command: UPDATE
    using: "auth.uid() = id"
    
  - name: "Public profiles for leaderboards"
    command: SELECT
    for: PUBLIC
    using: "true"
    columns: ["id", "username", "level", "experience"]
```

#### player_stats
```yaml
policies:
  - name: "Users can view own stats"
    command: SELECT
    using: "auth.uid() = user_id"
    
  - name: "Users can update own stats"
    command: UPDATE
    using: "auth.uid() = user_id"
    # Stats updated via backend/service role only
    except: ["total_clicks", "total_battles"] # Immutable
```

#### artifacts (Read-only catalog)
```yaml
policies:
  - name: "Everyone can view artifacts"
    command: SELECT
    for: PUBLIC
    using: "true"
    
  - name: "Only service role can modify"
    command: ALL
    for: SERVICE ROLE
```

#### user_artifacts
```yaml
policies:
  - name: "Users can manage own artifacts"
    command: ALL
    using: "auth.uid() = user_id"
```

#### quests (Read-only catalog)
```yaml
policies:
  - name: "Everyone can view quests"
    command: SELECT
    for: PUBLIC
    using: "true"
```

#### user_quests
```yaml
policies:
  - name: "Users can manage own quests"
    command: ALL
    using: "auth.uid() = user_id"
```

#### daily_rewards
```yaml
policies:
  - name: "Users can view own rewards"
    command: SELECT
    using: "auth.uid() = user_id"
    
  - name: "Users can update own rewards"
    command: UPDATE
    using: "auth.uid() = user_id"
    # Only service role can insert (prevents cheating)
```

#### daily_login_log
```yaml
policies:
  - name: "Users can view own login history"
    command: SELECT
    using: "auth.uid() = user_id"
    
  - name: "Only service role can insert"
    command: INSERT
    for: SERVICE ROLE
```

#### battle_history
```yaml
policies:
  - name: "Users can view own battle history"
    command: SELECT
    using: "auth.uid() = user_id"
    
  - name: "Only service role can insert"
    command: INSERT
    for: SERVICE ROLE
```

#### ads_history
```yaml
policies:
  - name: "Users can view own ad history"
    command: SELECT
    using: "auth.uid() = user_id"
    
  - name: "Only service role can insert"
    command: INSERT
    for: SERVICE ROLE
```

#### notifications
```yaml
policies:
  - name: "Users can manage own notifications"
    command: ALL
    using: "auth.uid() = user_id"
```

#### events (Read-only catalog)
```yaml
policies:
  - name: "Everyone can view active events"
    command: SELECT
    for: PUBLIC
    using: "is_active = true"
```

#### user_events
```yaml
policies:
  - name: "Users can manage own event participation"
    command: ALL
    using: "auth.uid() = user_id"
```

#### user_settings
```yaml
policies:
  - name: "Users can manage own settings"
    command: ALL
    using: "auth.uid() = user_id"
```

---

## Index Recommendations

### Critical Indexes (Performance)

```yaml
critical_indexes:
  - table: "profiles"
    index: "idx_profiles_telegram_id"
    reason: "Login lookups by telegram ID"
    
  - table: "user_artifacts"
    index: "idx_user_artifacts_user"
    reason: "User inventory queries"
    
  - table: "user_quests"
    index: "idx_user_quests_user"
    reason: "Quest progress queries"
    
  - table: "battle_history"
    index: "idx_battle_history_user"
    reason: "Battle history queries"
    
  - table: "ads_history"
    index: "idx_ads_history_user_date"
    reason: "Ad analytics queries"
```

### Analytics Indexes

```yaml
analytics_indexes:
  - table: "profiles"
    index: "idx_profiles_experience_desc"
    columns: "experience DESC"
    reason: "Leaderboard queries"
    
  - table: "player_stats"
    index: "idx_player_stats_streak_desc"
    columns: "daily_streak DESC"
    reason: "Top streak leaderboard"
    
  - table: "battle_history"
    index: "idx_battle_history_user_result"
    columns: "(user_id, result)"
    reason: "Win/loss statistics"
```

### Maintenance Indexes

```yaml
maintenance_indexes:
  - table: "user_quests"
    index: "idx_user_quests_expires"
    columns: "expires_at WHERE completed = false"
    reason: "Cleanup expired quests"
    
  - table: "daily_login_log"
    index: "idx_daily_login_user_date"
    columns: "(user_id, login_date DESC)"
    reason: "Streak calculation"
```

---

## Scalability Considerations

### Table Partitioning (Future)

```yaml
partitioning_strategy:
  
  battle_history:
    method: "RANGE by month"
    retention: "12 months online, older archived"
    reason: "High write volume, historical queries"
    
  ads_history:
    method: "RANGE by month"
    retention: "6 months online, older aggregated"
    reason: "Analytics data, large volume"
    
  notifications:
    method: "RANGE by month"
    retention: "3 months online, older deleted"
    reason: "High volume, low long-term value"
```

### Connection Pooling

```yaml
supabase_connection_pool:
  max_connections: 100
  pool_mode: "transaction"
  default_pool_size: 10
  
  recommendation: |
    Use connection pooler for production.
    Supabase Pro provides built-in pooler.
```

### Caching Strategy

```yaml
cache_layers:
  
  realtime:
    tables: ["user_artifacts", "player_stats"]
    reason: "Instant sync across devices"
    
  application:
    cache_profile: "5 minutes TTL"
    cache_quests: "1 hour TTL"
    cache_events: "15 minutes TTL"
    
  cdn:
    static_assets: "artifacts, cosmetics, avatars"
    cache_ttl: "1 week"
```

---

## Data Integrity Rules

### Constraints

```yaml
constraints:
  
  positive_values:
    - "energy >= 0"
    - "max_energy >= 0"
    - "level >= 1"
    - "experience >= 0"
    - "coins >= 0"
    - "time_shards >= 0"
    
  streak_limits:
    - "current_day BETWEEN 1 AND 7"
    - "daily_streak >= 0"
    - "longest_streak >= 0"
    
  rarity_bounds:
    - "artifact copies >= 1"
    - "user_artifact level BETWEEN 1 AND 5"
```

### Triggers

```yaml
triggers:
  
  updated_at:
    tables: ["profiles", "player_stats", "user_settings"]
    function: "update_updated_at_column"
    
  quest_completion:
    function: "check_quest_completion"
    event: "AFTER UPDATE OF progress ON user_quests"
    
  daily_streak:
    function: "update_daily_streak"
    event: "AFTER INSERT ON daily_login_log"
    
  stat_aggregation:
    function: "update_player_stats"
    event: "AFTER INSERT ON battle_history"
```

---

## Future Extensibility

### Planned Tables

```yaml
future_tables:
  
  guilds:
    purpose: "Guild/clan system
    estimated: "Phase 2"
    
  guild_members:
    purpose: "Guild membership
    estimated: "Phase 2"
    
  leaderboard_entries:
    purpose: "Weekly/monthly leaderboards
    estimated: "Phase 2"
    
  friend_requests:
    purpose: "Social friend system
    estimated: "Phase 2"
    
  chat_messages:
    purpose: "In-game chat
    estimated: "Phase 3"
    
  trades:
    purpose: "Item trading (future)
    estimated: "Phase 4"
```

### Migration Strategy

```yaml
migration_approach:
  versioning: "Timestamp-based (YYYYMMDDHHMMSS)"
  location: "/supabase/migrations/"
  naming: "001_description.sql"
  
  workflow:
    1. "Create migration file"
    2. "Test in development"
    3. "Review in pull request"
    4. "Apply in staging"
    5. "Apply in production"
    
  rollback:
    - "Always include down migration"
    - "Test rollback procedures"
    - "Document breaking changes"
```

---

## Security Checklist

- [ ] All tables have RLS enabled
- [ ] Service role has minimal necessary access
- [ ] Anon key cannot modify user data
- [ ] Telegram ID is not exposed publicly
- [ ] Email/password auth disabled (Telegram only)
- [ ] API rate limiting configured
- [ ] Audit logging for sensitive operations
- [ ] No PII in client-side storage
- [ ] HTTPS enforced
- [ ] Input validation on all endpoints

---

## Documentation References

Related Documents:
- `agents/database.md` — Database Agent responsibilities
- `knowledge/economy.md` — Currency system
- `knowledge/notifications.md` — Notification system
- `knowledge/retention.md` — Retention mechanics
- `system.md` — Overall system architecture

---

*Good database design is invisible to the user but essential to the developer.*
