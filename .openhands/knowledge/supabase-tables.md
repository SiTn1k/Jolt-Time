# Jolt Time — Supabase Tables Complete Specification

## Overview

This document provides a complete audit and specification of all Supabase tables used by Jolt Time. It serves as the primary reference for database development, complementing the architecture philosophy defined in `database-schema.md`.

Each table is documented with its purpose, key design decisions, relationships, and important fields. This specification ensures consistent development and clear understanding across the team.

**Related Documents:**
- `database-schema.md` — Database architecture philosophy
- `knowledge/adsgram.md` — AdsGram integration details
- `knowledge/economy-system.md` — Economy specifications

---

## Player Tables

Player tables form the core identity and state management system.

### profiles

**Purpose:** Primary player identity and core state.

**Primary Key Philosophy:** UUID primary key with telegram_id as the natural unique identifier. Telegram ID is the business key; UUID is the technical key.

**Relationships:**
- One-to-One: `player_stats` (user_id FK)
- One-to-One: `player_settings` (user_id FK)
- One-to-One: `player_daily_state` (user_id FK)
- One-to-One: `player_progression` (user_id FK)
- One-to-Many: `player_currencies` (user_id FK)
- One-to-Many: `player_artifacts` (user_id FK)
- One-to-Many: `player_quests` (user_id FK)
- One-to-Many: `player_events` (user_id FK)
- One-to-Many: `transactions` (user_id FK)
- One-to-Many: `battle_history` (user_id FK)
- One-to-Many: `friendships` (requester_id, addressee_id FK)
- One-to-Many: `guild_members` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Internal primary key |
| telegram_id | BIGINT | Telegram user ID (unique, indexed) |
| username | VARCHAR | Telegram username |
| first_name | VARCHAR | Display name |
| level | INTEGER | Current progression level (denormalized for leaderboards) |
| experience | BIGINT | Total XP (denormalized for leaderboards) |
| current_era | VARCHAR | Unlocked era key |
| is_premium | BOOLEAN | Jolt Time Plus subscriber |
| is_banned | BOOLEAN | Account status |
| created_at | TIMESTAMPTZ | Account creation |
| last_login_at | TIMESTAMPTZ | Session tracking |

---

### player_stats

**Purpose:** Aggregated lifetime statistics for fast access.

**Primary Key Philosophy:** Same user_id as profiles, avoiding joins for stat queries.

**Relationships:**
- One-to-One: `profiles` (user_id PK and FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| user_id | UUID | FK to profiles (PK) |
| total_clicks | BIGINT | Immutable lifetime counter |
| total_energy_spent | BIGINT | Immutable lifetime counter |
| total_battles | INTEGER | PvP matches played |
| battles_won | INTEGER | PvP victories |
| artifacts_collected | INTEGER | Unique artifacts owned |
| quests_completed | INTEGER | Total quests finished |
| events_participated | INTEGER | Events joined |
| ads_watched | INTEGER | Total ads viewed |
| currency_spent | JSONB | Lifetime spending per currency |

---

### player_settings

**Purpose:** User preferences and configuration.

**Primary Key Philosophy:** Same user_id as profiles for direct lookup.

**Relationships:**
- One-to-One: `profiles` (user_id PK and FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| user_id | UUID | FK to profiles (PK) |
| notifications_enabled | BOOLEAN | Master notification toggle |
| notification_types | JSONB | Granular notification preferences |
| sound_enabled | BOOLEAN | Audio preferences |
| music_enabled | BOOLEAN | Audio preferences |
| vibration_enabled | BOOLEAN | Haptic feedback |
| language_preference | VARCHAR | UI language code |
| timezone | VARCHAR | Event scheduling |
| privacy_show_profile | BOOLEAN | Leaderboard visibility |
| privacy_show_stats | BOOLEAN | Profile stats public |
| theme_mode | VARCHAR | dark/light/system |
| chat_enabled | BOOLEAN | In-game chat toggle |
| marketing_opt_in | BOOLEAN | External communications |

---

### player_progression

**Purpose:** Era and story progression tracking.

**Primary Key Philosophy:** Same user_id as profiles.

**Relationships:**
- One-to-One: `profiles` (user_id PK and FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| user_id | UUID | FK to profiles (PK) |
| unlocked_eras | JSONB | Array of era keys |
| completed_stories | JSONB | Story completion records |
| tutorial_step | INTEGER | Tutorial progress |
| tutorial_completed_at | TIMESTAMPTZ | Tutorial completion |
| world_position | JSONB | Map navigation state |

---

### player_daily_state

**Purpose:** Daily reset state management (streaks, energy refills, daily claims).

**Primary Key Philosophy:** Same user_id as profiles.

**Relationships:**
- One-to-One: `profiles` (user_id PK and FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| user_id | UUID | FK to profiles (PK) |
| daily_streak | INTEGER | Current login streak |
| longest_streak | INTEGER | Historical best |
| last_login_date | DATE | Streak calculation |
| energy_last_refill | TIMESTAMPTZ | Energy regeneration base |
| daily_quests_reset_at | TIMESTAMPTZ | Quest reset time |
| daily_rewards_claimed | INTEGER | Calendar position (1-7) |

---

### player_achievements

**Purpose:** Unlocked achievements with timestamps.

**Primary Key Philosophy:** UUID primary key, composite unique on (user_id, achievement_key).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `achievements` (achievement_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| achievement_id | UUID | FK to achievements catalog |
| unlocked_at | TIMESTAMPTZ | Achievement timestamp |

---

## Economy Tables

Economy tables handle currencies, transactions, and marketplace.

### currencies

**Purpose:** Currency definitions catalog (reference table).

**Primary Key Philosophy:** UUID primary key with currency_key as unique business identifier.

**Relationships:**
- One-to-Many: `player_currencies` (currency_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| currency_key | VARCHAR | Business identifier (e.g., "chrono_coins") |
| name | VARCHAR | Display name |
| type | VARCHAR | soft/premium/event |
| icon_url | TEXT | Currency icon |
| is_active | BOOLEAN | Available in game |
| decimals | INTEGER | Display precision |

---

### player_currencies

**Purpose:** Per-player currency balances.

**Primary Key Philosophy:** Composite key (user_id, currency_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `currencies` (currency_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| user_id | UUID | FK to profiles (PK composite) |
| currency_id | UUID | FK to currencies (PK composite) |
| balance | BIGINT | Current balance |
| lifetime_earned | BIGINT | Audit trail |
| lifetime_spent | BIGINT | Audit trail |
| last_transaction_at | TIMESTAMPTZ | Reconciliation |

---

### transactions

**Purpose:** Immutable economic ledger for all currency movements.

**Primary Key Philosophy:** UUID primary key with transaction_key for idempotency.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `currencies` (currency_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| transaction_key | VARCHAR | Idempotency key (unique) |
| user_id | UUID | FK to profiles |
| currency_id | UUID | FK to currencies |
| amount | BIGINT | Positive=credit, negative=debit |
| balance_after | BIGINT | Point-in-time balance |
| transaction_type | VARCHAR | earned/spent/reward/purchase |
| source_type | VARCHAR | quest/battle/ads/shop/system |
| source_id | UUID | Related entity reference |
| metadata | JSONB | Additional context |
| created_at | TIMESTAMPTZ | Immutable timestamp |

---

### marketplace_listings

**Purpose:** Active player-to-player marketplace listings.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (seller_id FK)
- Many-to-One: `artifacts` or `cosmetics` (item_id FK polymorphic via type)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| seller_id | UUID | FK to profiles |
| item_type | VARCHAR | artifact/cosmetic/item |
| item_id | UUID | Reference to item |
| price_amount | BIGINT | Price in Chrono Coins |
| status | VARCHAR | active/sold/cancelled |
| expires_at | TIMESTAMPTZ | Auto-cancel deadline |
| created_at | TIMESTAMPTZ | Listing time |

---

### marketplace_transactions

**Purpose:** Completed marketplace trades.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `marketplace_listings` (listing_id FK)
- Many-to-One: `profiles` (seller_id, buyer_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| listing_id | UUID | FK to marketplace_listings |
| seller_id | UUID | FK to profiles |
| buyer_id | UUID | FK to profiles |
| price_paid | BIGINT | Actual sale price |
| platform_fee | BIGINT | Jolt Time fee |
| seller_net | BIGINT | Seller proceeds |
| completed_at | TIMESTAMPTZ | Transaction time |

---

### pack_definitions

**Purpose:** Purchasable pack templates (reference table).

**Primary Key Philosophy:** UUID primary key with pack_key as unique business identifier.

**Relationships:**
- One-to-Many: `player_pack_purchases` (pack_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| pack_key | VARCHAR | Business identifier |
| name | VARCHAR | Display name |
| description | TEXT | Pack description |
| price_stars | INTEGER | Price in Telegram Stars |
| contents | JSONB | Pack contents definition |
| is_active | BOOLEAN | Available for purchase |

---

### player_pack_purchases

**Purpose:** Player pack purchase history.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `pack_definitions` (pack_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| pack_id | UUID | FK to pack_definitions |
| stars_spent | INTEGER | Telegram Stars paid |
| contents_received | JSONB | Actual contents awarded |
| purchased_at | TIMESTAMPTZ | Purchase timestamp |

---

## Museum Tables

Museum tables manage artifacts, collections, and museum displays.

### artifacts

**Purpose:** Artifact catalog (reference table).

**Primary Key Philosophy:** UUID primary key with artifact_key as unique business identifier.

**Relationships:**
- One-to-Many: `player_artifacts` (artifact_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| artifact_key | VARCHAR | Business identifier |
| name | VARCHAR | Display name |
| description | TEXT | Historical description |
| era | VARCHAR | Historical era |
| rarity | VARCHAR | common/uncommon/rare/epic/legendary |
| category | VARCHAR | weapon/tool/jewelry/document/art |
| base_power | INTEGER | Combat power |
| bonus_type | VARCHAR | energy_regen/click_power/battle_bonus |
| bonus_value | INTEGER | Bonus magnitude |
| image_url | TEXT | Artifact artwork |
| historical_fact | TEXT | Educational content |
| is_active | BOOLEAN | Available in game |

---

### artifact_evolution_trees

**Purpose:** Artifact evolution prerequisites and paths.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `artifacts` (artifact_id FK)
- Many-to-One: `artifacts` (evolves_into_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| artifact_id | UUID | FK to artifacts |
| evolves_into_id | UUID | FK to artifacts |
| required_copies | INTEGER | Copies needed |
| required_xp | INTEGER | XP investment needed |
| unlock_era | VARCHAR | Era required to unlock |

---

### player_artifacts

**Purpose:** Player artifact inventory.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, artifact_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `artifacts` (artifact_id FK)
- Self-referential: `player_artifacts` (evolved_from_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| artifact_id | UUID | FK to artifacts |
| level | INTEGER | Upgrade level (1-100) |
| experience | BIGINT | XP toward next level |
| copies | INTEGER | Duplicate count for evolution |
| is_equipped | BOOLEAN | Active in loadout |
| evolved_from_id | UUID | Previous evolution form |
| acquired_at | TIMESTAMPTZ | Acquisition time |

---

### museum_collections

**Purpose:** Collection definitions (reference table).

**Primary Key Philosophy:** UUID primary key with collection_key as unique identifier.

**Relationships:**
- One-to-Many: `player_museum_collections` (collection_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| collection_key | VARCHAR | Business identifier |
| name | VARCHAR | Display name |
| description | TEXT | Collection description |
| era | VARCHAR | Associated era |
| required_artifacts | JSONB | Artifact IDs required |
| reward_type | VARCHAR | Reward when completed |
| reward_amount | BIGINT | Reward magnitude |
| is_active | BOOLEAN | Available in game |

---

### player_museum_collections

**Purpose:** Player collection completion tracking.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, collection_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `museum_collections` (collection_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| collection_id | UUID | FK to museum_collections |
| artifacts_collected | JSONB | Artifact IDs acquired |
| completion_percent | INTEGER | Completion percentage |
| is_completed | BOOLEAN | Collection complete |
| completed_at | TIMESTAMPTZ | Completion timestamp |

---

### museum_displays

**Purpose:** Museum display slot definitions (reference table).

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- One-to-Many: `player_museum_displays` (display_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| slot_key | VARCHAR | Business identifier |
| slot_type | VARCHAR | pedestal/wall/showcase/vault |
| required_era | VARCHAR | Era required |
| unlock_requirement | VARCHAR | How to unlock |
| is_active | BOOLEAN | Available |

---

### player_museum_displays

**Purpose:** Player museum layout configuration.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, display_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `museum_displays` (display_id FK)
- Many-to-One: `player_artifacts` (artifact_id FK nullable)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| display_id | UUID | FK to museum_displays |
| artifact_id | UUID | FK to player_artifacts (nullable) |
| position_x | INTEGER | Display position |
| position_y | INTEGER | Display position |
| configured_at | TIMESTAMPTZ | Last configuration time |

---

## Event Tables

Event tables manage time-limited events and battle passes.

### events

**Purpose:** Event definitions (reference table).

**Primary Key Philosophy:** UUID primary key with event_key as unique business identifier.

**Relationships:**
- One-to-Many: `player_events` (event_id FK)
- One-to-Many: `event_rewards` (event_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| event_key | VARCHAR | Business identifier |
| title | VARCHAR | Display name |
| description | TEXT | Event details |
| type | VARCHAR | seasonal/limited/community/challenge |
| era | VARCHAR | Associated era |
| start_date | TIMESTAMPTZ | Event start |
| end_date | TIMESTAMPTZ | Event end |
| participation_reward | JSONB | Guaranteed rewards |
| tier_rewards | JSONB | Rank-based rewards |
| leaderboard_enabled | BOOLEAN | Competitive leaderboard |
| max_participants | INTEGER | Optional cap |
| requirements | JSONB | Prerequisites |
| is_active | BOOLEAN | Available in game |

---

### player_events

**Purpose:** Player event participation and progress.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, event_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `events` (event_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| event_id | UUID | FK to events |
| progress | BIGINT | Current point score |
| rank | INTEGER | Leaderboard rank |
| status | VARCHAR | active/completed/expired |
| joined_at | TIMESTAMPTZ | First participation |
| completed_at | TIMESTAMPTZ | Event completion |
| rewards_claimed | BOOLEAN | Final rewards collected |

---

### event_rewards

**Purpose:** Event reward tier definitions (reference table).

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `events` (event_id FK)
- One-to-Many: `player_event_rewards` (reward_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| event_id | UUID | FK to events |
| tier | INTEGER | Tier number |
| threshold | BIGINT | Points needed |
| rewards | JSONB | {coins, items, cosmetics} |
| is_claimable | BOOLEAN | Active for claiming |

---

### player_event_rewards

**Purpose:** Claimed event rewards.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, reward_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `events` (event_id FK)
- Many-to-One: `event_rewards` (reward_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| event_id | UUID | FK to events |
| reward_id | UUID | FK to event_rewards |
| tier | INTEGER | Tier claimed |
| claimed_at | TIMESTAMPTZ | Claim timestamp |

---

### event_participation_history

**Purpose:** Historical event participation for analytics.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `events` (event_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| event_id | UUID | FK to events |
| final_rank | INTEGER | Ending rank |
| total_progress | BIGINT | Final point score |
| rewards_received | JSONB | All rewards obtained |
| duration_seconds | INTEGER | Event duration |
| participated_at | TIMESTAMPTZ | Event time |

---

### battle_pass_seasons

**Purpose:** Battle pass season definitions (reference table).

**Primary Key Philosophy:** UUID primary key with season_key as unique identifier.

**Relationships:**
- One-to-Many: `battle_pass_tiers` (season_id FK)
- One-to-Many: `player_battle_pass` (season_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| season_key | VARCHAR | Business identifier |
| name | VARCHAR | Season name |
| description | TEXT | Season description |
| start_date | TIMESTAMPTZ | Season start |
| end_date | TIMESTAMPTZ | Season end |
| premium_price | INTEGER | Telegram Stars cost |
| xp_multiplier | DECIMAL | Premium bonus |
| is_active | BOOLEAN | Available |

---

### battle_pass_tiers

**Purpose:** Battle pass tier definitions (reference table).

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `battle_pass_seasons` (season_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| season_id | UUID | FK to battle_pass_seasons |
| tier | INTEGER | Tier number |
| xp_required | INTEGER | XP to reach tier |
| free_rewards | JSONB | Rewards for all players |
| premium_rewards | JSONB | Premium-only rewards |
| is_bonus | BOOLEAN | Bonus tier |

---

### player_battle_pass

**Purpose:** Player battle pass progress.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, season_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `battle_pass_seasons` (season_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| season_id | UUID | FK to battle_pass_seasons |
| current_xp | INTEGER | Current season XP |
| current_tier | INTEGER | Current tier reached |
| is_premium | BOOLEAN | Premium purchased |
| free_tier_claimed | INTEGER | Last claimed free tier |
| premium_tier_claimed | INTEGER | Last claimed premium tier |
| purchased_at | TIMESTAMPTZ | Premium purchase time |

---

## PvP Tables

PvP tables handle competitive play, rankings, and tournaments.

### battle_history

**Purpose:** Historical record of PvP battles.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `profiles` (opponent_id FK nullable, for AI battles)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| opponent_id | UUID | FK to profiles (nullable for AI) |
| battle_type | VARCHAR | arena/tournament/raid/practice |
| result | VARCHAR | victory/defeat/draw |
| player_power | INTEGER | Player power at battle time |
| opponent_power | INTEGER | Opponent power at battle time |
| rounds | INTEGER | Battle duration |
| rewards | JSONB | {coins, xp, tokens} |
| artifacts_damaged | JSONB | Artifact damage taken |
| created_at | TIMESTAMPTZ | Battle time |

---

### player_rankings

**Purpose:** Current player rank information per league.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, league_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `leagues` (league_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| league_id | UUID | FK to leagues |
| current_rank | INTEGER | Current rank (1-10) |
| current_rating | INTEGER | ELO/mmr rating |
| highest_rank | INTEGER | Historical best |
| matches_played | INTEGER | Total matches |
| matches_won | INTEGER | Total wins |
| last_match_at | TIMESTAMPTZ | Last match time |

---

### leagues

**Purpose:** League definitions (reference table).

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- One-to-Many: `player_rankings` (league_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| name | VARCHAR | League name |
| tier | INTEGER | League tier |
| min_rank | INTEGER | Minimum rank |
| max_rank | INTEGER | Maximum rank |
| season_reset_points | INTEGER | Points lost per season |

---

### leaderboards

**Purpose:** Leaderboard configurations (reference table).

**Primary Key Philosophy:** UUID primary key with board_key as unique identifier.

**Relationships:**
- One-to-Many: `leaderboard_snapshots` (leaderboard_id FK)
- One-to-Many: `player_rankings` (leaderboard_id FK via board_key)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| board_key | VARCHAR | Business identifier |
| name | VARCHAR | Display name |
| type | VARCHAR | weekly/monthly/all_time |
| metric | VARCHAR | experience/wins/artifacts |
| reset_at | TIMESTAMPTZ | Next reset |
| duration_days | INTEGER | Period length |
| is_active | BOOLEAN | Available |

---

### leaderboard_snapshots

**Purpose:** Periodic leaderboard snapshots for historical tracking.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `leaderboards` (leaderboard_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| leaderboard_id | UUID | FK to leaderboards |
| period_start | TIMESTAMPTZ | Snapshot period start |
| period_end | TIMESTAMPTZ | Snapshot period end |
| snapshot_data | JSONB | [{rank, user_id, value}] |
| created_at | TIMESTAMPTZ | Snapshot time |

---

### tournaments

**Purpose:** Tournament definitions (reference table).

**Primary Key Philosophy:** UUID primary key with tournament_key as unique identifier.

**Relationships:**
- One-to-Many: `player_tournaments` (tournament_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| tournament_key | VARCHAR | Business identifier |
| name | VARCHAR | Tournament name |
| description | TEXT | Details |
| format | VARCHAR | single_elim/double_elim/round_robin |
| max_participants | INTEGER | Participant cap |
| entry_fee | JSONB | Entry cost |
| prizes | JSONB | Prize structure |
| start_date | TIMESTAMPTZ | Tournament start |
| end_date | TIMESTAMPTZ | Tournament end |
| is_active | BOOLEAN | Available |

---

### player_tournaments

**Purpose:** Player tournament participation.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, tournament_id).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `tournaments` (tournament_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| tournament_id | UUID | FK to tournaments |
| status | VARCHAR | registered/eliminated/finished |
| current_round | INTEGER | Tournament round |
| matches_played | INTEGER | Matches in tournament |
| matches_won | INTEGER | Wins in tournament |
| final_placement | INTEGER | Final position |
| prizes_won | JSONB | Prizes received |
| registered_at | TIMESTAMPTZ | Registration time |

---

## Social Tables

Social tables handle friends, guilds, and community features.

### friendships

**Purpose:** Established friend relationships.

**Primary Key Philosophy:** UUID primary key with two records per friendship (A→B and B→A).

**Relationships:**
- Many-to-One: `profiles` (requester_id FK)
- Many-to-One: `profiles` (addressee_id FK)
- Self-referential: `friendships` (related_friendship_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| requester_id | UUID | FK to profiles |
| addressee_id | UUID | FK to profiles |
| status | VARCHAR | accepted/blocked |
| related_friendship_id | UUID | Reverse relationship |
| created_at | TIMESTAMPTZ | Relationship creation |

---

### friend_requests

**Purpose:** Pending friend requests.

**Primary Key Philosophy:** UUID primary key with unique constraint on (requester_id, addressee_id) for pending status.

**Relationships:**
- Many-to-One: `profiles` (requester_id FK)
- Many-to-One: `profiles` (addressee_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| requester_id | UUID | FK to profiles |
| addressee_id | UUID | FK to profiles |
| message | TEXT | Optional greeting |
| status | VARCHAR | pending/accepted/declined |
| expires_at | TIMESTAMPTZ | Auto-expiry |
| created_at | TIMESTAMPTZ | Request time |
| responded_at | TIMESTAMPTZ | Response time |

---

### guilds

**Purpose:** Guild/clan data.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- One-to-Many: `guild_members` (guild_id FK)
- One-to-Many: `guild_ranks` (guild_id FK)
- Many-to-One: `profiles` (leader_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| name | VARCHAR | Guild name |
| tag | VARCHAR | Short tag (3-5 chars) |
| description | TEXT | Guild description |
| leader_id | UUID | FK to profiles |
| level | INTEGER | Guild level |
| experience | BIGINT | Guild XP |
| icon_url | TEXT | Guild emblem |
| banner_url | TEXT | Guild banner |
| settings | JSONB | Configuration |
| is_recruiting | BOOLEAN | Recruitment status |
| max_members | INTEGER | Member cap |
| created_at | TIMESTAMPTZ | Creation time |

---

### guild_members

**Purpose:** Guild membership records.

**Primary Key Philosophy:** UUID primary key with unique constraint on (guild_id, user_id).

**Relationships:**
- Many-to-One: `guilds` (guild_id FK)
- Many-to-One: `profiles` (user_id FK)
- Many-to-One: `guild_ranks` (rank_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| guild_id | UUID | FK to guilds |
| user_id | UUID | FK to profiles |
| rank_id | UUID | FK to guild_ranks |
| joined_at | TIMESTAMPTZ | Join time |
| contributed_this_week | BIGINT | Weekly contribution |
| total_contributed | BIGINT | Lifetime contribution |

---

### guild_ranks

**Purpose:** Guild rank definitions (per-guild).

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `guilds` (guild_id FK)
- One-to-Many: `guild_members` (rank_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| guild_id | UUID | FK to guilds |
| name | VARCHAR | Rank name |
| position | INTEGER | Sort order (1=leader) |
| permissions | JSONB | {can_invite, can_kick, etc} |

---

### guild_applications

**Purpose:** Pending guild applications.

**Primary Key Philosophy:** UUID primary key with unique constraint on (guild_id, applicant_id) for pending status.

**Relationships:**
- Many-to-One: `guilds` (guild_id FK)
- Many-to-One: `profiles` (applicant_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| guild_id | UUID | FK to guilds |
| applicant_id | UUID | FK to profiles |
| message | TEXT | Application message |
| status | VARCHAR | pending/accepted/declined |
| expires_at | TIMESTAMPTZ | Auto-expiry |
| created_at | TIMESTAMPTZ | Application time |

---

### chat_rooms

**Purpose:** In-game chat rooms (future).

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- One-to-Many: `chat_messages` (room_id FK)
- Many-to-One: `guilds` (guild_id FK nullable)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| type | VARCHAR | guild/direct/global |
| guild_id | UUID | FK to guilds (nullable) |
| name | VARCHAR | Room name |
| settings | JSONB | Room configuration |
| created_at | TIMESTAMPTZ | Creation time |

---

### chat_messages

**Purpose:** In-game chat messages (future).

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `chat_rooms` (room_id FK)
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| room_id | UUID | FK to chat_rooms |
| user_id | UUID | FK to profiles |
| content | TEXT | Message content |
| attachments | JSONB | Media, reactions |
| edited_at | TIMESTAMPTZ | Edit time |
| deleted_at | TIMESTAMPTZ | Soft delete |
| created_at | TIMESTAMPTZ | Message time |

---

## Analytics Tables

Analytics tables track player metrics, monetization, and AdsGram data.

### player_session_logs

**Purpose:** Session start/end events for DAU and retention tracking.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| session_id | UUID | Groups start/end events |
| event_type | VARCHAR | session_start/session_end |
| platform | VARCHAR | mini_app/bot |
| client_version | VARCHAR | App version |
| device_info | JSONB | Device characteristics |
| session_duration | INTEGER | Seconds (from end event) |
| created_at | TIMESTAMPTZ | Event timestamp |

---

### player_retention_events

**Purpose:** Retention milestone events (D1, D7, D30, etc.).

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, milestone).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| milestone | VARCHAR | D1/D7/D30/custom |
| milestone_date | DATE | Date milestone achieved |
| user_lifetime_days | INTEGER | Days since registration |
| created_at | TIMESTAMPTZ | Event time |

---

### revenue_events

**Purpose:** Purchase and subscription events.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| event_type | VARCHAR | subscription/purchase/refund |
| provider | VARCHAR | telegram_stars/adsgram |
| amount_usd | DECIMAL(10,2) | Revenue in USD |
| currency_amount | BIGINT | In-game currency awarded |
| product_id | VARCHAR | SKU identifier |
| transaction_id | VARCHAR | Provider reference |
| created_at | TIMESTAMPTZ | Event time |

---

### ads_views

**Purpose:** Individual ad view records for AdsGram analytics.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| ad_type | VARCHAR | rewarded/interstitial/banner |
| ad_provider | VARCHAR | adsgram/admob |
| ad_id | VARCHAR | Provider's ad identifier |
| reward_type | VARCHAR | energy/coins/shards |
| reward_amount | BIGINT | Amount awarded |
| session_id | VARCHAR | Session tracking |
| placement | VARCHAR | In-game placement |
| watched_duration_ms | INTEGER | Actual watch time |
| completed | BOOLEAN | Full view vs partial |
| error_code | VARCHAR | If view failed |
| created_at | TIMESTAMPTZ | Completion timestamp |

---

### ads_statistics

**Purpose:** Aggregated daily ad statistics.

**Primary Key Philosophy:** UUID primary key with unique constraint on (date, ad_type, ad_provider).

**Relationships:**
- None (aggregated data)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| date | DATE | Aggregation date |
| ad_type | VARCHAR | rewarded/interstitial/banner |
| ad_provider | VARCHAR | adsgram/admob |
| total_views | INTEGER | Count of views |
| completed_views | INTEGER | Count of completed |
| total_reward_amount | BIGINT | Sum of rewards |
| estimated_revenue_usd | DECIMAL | Estimated revenue |
| created_at | TIMESTAMPTZ | Record creation |

---

### user_ad_settings

**Purpose:** Player ad preferences.

**Primary Key Philosophy:** Same user_id as profiles.

**Relationships:**
- One-to-One: `profiles` (user_id PK and FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| user_id | UUID | FK to profiles (PK) |
| ads_enabled | BOOLEAN | Opt-out toggle |
| daily_ad_limit | INTEGER | Personal cap |
| preferred_ad_types | JSONB | Allowed types |
| blocked_hours | JSONB | Times when no ads |
| updated_at | TIMESTAMPTZ | Last update |

---

### economy_snapshots

**Purpose:** Periodic economy state for analytics and rollback.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| snapshot_date | DATE | Snapshot date |
| total_balance | JSONB | {currency_key: balance} |
| total_lifetime | JSONB | Lifetime earnings |
| active_artifacts | INTEGER | Artifacts count |
| level | INTEGER | Player level |
| created_at | TIMESTAMPTZ | Snapshot time |

---

## Admin Tables

Admin tables handle system configuration, moderation, and audit logging.

### admin_audit_log

**Purpose:** Sensitive operation audit trail.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (admin_user_id FK nullable)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| admin_user_id | UUID | FK to profiles (nullable) |
| action_type | VARCHAR | schema_change/user_ban/currency_mod |
| target_type | VARCHAR | Table/entity type |
| target_id | UUID | Affected entity ID |
| old_value | JSONB | Previous state |
| new_value | JSONB | New state |
| ip_address | VARCHAR | Request IP |
| user_agent | TEXT | Request user agent |
| created_at | TIMESTAMPTZ | Action time |

---

### moderation_actions

**Purpose:** User and content moderation actions.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (moderator_id FK)
- Many-to-One: `profiles` (target_user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| moderator_id | UUID | FK to profiles |
| target_user_id | UUID | FK to profiles |
| action_type | VARCHAR | warn/mute/ban/kick |
| reason | TEXT | Moderation reason |
| duration | INTEGER | Duration in seconds (null=permanent) |
| status | VARCHAR | active/resolved/expired |
| created_at | TIMESTAMPTZ | Action time |

---

### system_settings

**Purpose:** Feature flags and configuration.

**Primary Key Philosophy:** UUID primary key with setting_key as unique business identifier.

**Relationships:**
- None

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| setting_key | VARCHAR | Business identifier |
| value | JSONB | Setting value |
| description | TEXT | Setting description |
| is_active | BOOLEAN | Enable/disable |
| updated_at | TIMESTAMPTZ | Last update |

---

### data_exports

**Purpose:** GDPR data export requests.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, status) for pending exports.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| status | VARCHAR | pending/processing/completed/failed |
| export_data | JSONB | Compressed export |
| requested_at | TIMESTAMPTZ | Request time |
| completed_at | TIMESTAMPTZ | Completion time |
| expires_at | TIMESTAMPTZ | Download expiry |

---

### bot_users

**Purpose:** Telegram bot user tracking.

**Primary Key Philosophy:** UUID primary key with telegram_id as unique.

**Relationships:**
- Many-to-One: `profiles` (user_id FK nullable)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| telegram_id | BIGINT | Telegram user ID |
| username | VARCHAR | Telegram username |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| language_code | VARCHAR | Language preference |
| is_bot | BOOLEAN | Is bot user |
| created_at | TIMESTAMPTZ | First interaction |
| last_seen_at | TIMESTAMPTZ | Last activity |

---

### bot_logs

**Purpose:** Bot operation logs.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `bot_users` (user_id FK nullable)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to bot_users (nullable) |
| command | VARCHAR | Bot command |
| message_id | BIGINT | Telegram message ID |
| chat_id | BIGINT | Telegram chat ID |
| parameters | JSONB | Command parameters |
| result | TEXT | Command result |
| error | TEXT | Error message |
| created_at | TIMESTAMPTZ | Log time |

---

### notification_cooldowns

**Purpose:** Notification rate limiting.

**Primary Key Philosophy:** UUID primary key with unique constraint on (user_id, notification_type).

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| notification_type | VARCHAR | Type identifier |
| last_sent_at | TIMESTAMPTZ | Last notification time |
| cooldown_seconds | INTEGER | Cooldown duration |
| created_at | TIMESTAMPTZ | Record creation |
| updated_at | TIMESTAMPTZ | Last update |

---

### notification_queue

**Purpose:** Deferred notification delivery.

**Primary Key Philosophy:** UUID primary key.

**Relationships:**
- Many-to-One: `profiles` (user_id FK)

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| user_id | UUID | FK to profiles |
| type | VARCHAR | Notification type |
| title | VARCHAR | Notification title |
| body | TEXT | Notification message |
| data | JSONB | Deep link payload |
| priority | INTEGER | Delivery priority |
| scheduled_for | TIMESTAMPTZ | Scheduled delivery |
| sent_at | TIMESTAMPTZ | Actual delivery |
| expires_at | TIMESTAMPTZ | Notification expiry |
| created_at | TIMESTAMPTZ | Queue time |

---

### cron_job_status

**Purpose:** Scheduled job tracking.

**Primary Key Philosophy:** UUID primary key with job_key as unique business identifier.

**Relationships:**
- None

**Important Fields:**

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| job_key | VARCHAR | Job identifier |
| status | VARCHAR | running/completed/failed |
| last_run_at | TIMESTAMPTZ | Last execution |
| last_completed_at | TIMESTAMPTZ | Last completion |
| next_run_at | TIMESTAMPTZ | Next scheduled |
| error_message | TEXT | Last error |
| run_count | INTEGER | Total runs |
| success_count | INTEGER | Successful runs |

---

## Naming Convention Standards

### Singular vs Plural Philosophy

**Tables:** Always plural (`profiles`, `player_stats`, `transactions`)
- Rationale: Tables represent collections of entities

**Reference Tables:** Plu

ral catalog names (`currencies`, `artifacts`, `events`)
- Rationale: They define collections of possible values

**Junction Tables:** Combine both table names (`player_artifacts`, `guild_members`)
- Rationale: Clear indication of participating entities

### Field Naming Standards

| Pattern | Example | Usage |
|---------|---------|-------|
| `snake_case` | `user_id`, `created_at` | All column names |
| `_id` suffix | `profile_id` | Foreign keys |
| `_at` suffix | `created_at`, `updated_at` | Timestamp columns |
| `_count` suffix | `view_count` | Numeric aggregates |
| `is_` prefix | `is_active`, `is_premium` | Boolean flags |
| `has_` prefix | `has_notifications` | Boolean flags |
| `total_` prefix | `total_clicks` | Lifetime accumulators |
| `current_` prefix | `current_rank` | Current state values |
| `max_` prefix | `max_energy` | Maximum limits |

### Timestamp Standards

| Suffix | Example | Usage |
|--------|---------|-------|
| `_at` | `created_at`, `updated_at` | Full timestamp with timezone |
| `_date` | `login_date`, `snapshot_date` | Date only |
| `_time` | `login_time` | Time only (rare) |

### Reserved Fields

Every table should have:
- `id` — UUID primary key
- `created_at` — Record creation
- `updated_at` — Last modification (optional, for mutable tables)

---

## Row-Level Security Philosophy

### Player Access

Players can only access their own data.

```
-- Read own data
USING (auth.uid() = user_id)

-- Insert own data
WITH CHECK (auth.uid() = user_id)
```

### Admin Access

Service role bypasses RLS for administrative operations.

```
-- Admin tables use service_role
FOR ALL USING (true)
TO service_role
```

### Protected Tables

Certain tables only allow service role access:

| Table | Reason |
|-------|--------|
| `admin_audit_log` | Sensitive operations |
| `transactions` | Prevents balance manipulation |
| `ads_views` | Prevents ad reward fraud |
| `battle_history` | Prevents match manipulation |
| `revenue_events` | Prevents revenue fraud |

### Public Read Tables

Reference tables are publicly readable:

| Table | Access |
|-------|--------|
| `currencies` | Public read |
| `artifacts` | Public read |
| `events` | Public read (active only) |
| `quests` | Public read |
| `leaderboards` | Public read |

---

## Future Expansion Notes

### NFT System Tables (Future)

```
nft_contracts           — NFT contract definitions
nft_tokens              — Token metadata
player_nft_balances     — Player NFT ownership
nft_transactions        — NFT transfers
```

### Creator System Tables (Future)

```
creator_profiles        — Creator information
creator_content         — User-generated content
content_reactions       — Likes, shares
content_earnings         — Revenue tracking
```

### Esports Tables (Future)

```
esports_tournaments     — Official tournaments
esports_teams           — Team definitions
esports_matches         — Match results
esports_prizes          — Prize distributions
```

### Web3 Integration Tables (Future)

```
wallet_connections      — User wallets
token_swaps             — Exchange history
nft_minting_requests    — Mint queue
cross_chain_transactions — Bridge transactions
```

---

## Long-Term Philosophy

### Understandable Tables

- **Self-documenting names** — Table and column names describe their purpose
- **Consistent patterns** — Same patterns used across all tables
- **Clear relationships** — Foreign keys clearly indicate connections
- **Documented constraints** — Business rules encoded where possible

### Future Growth Support

- **JSONB extensibility** — New data without schema changes
- **Partition-ready design** — High-volume tables designed for partitioning
- **Soft deletes** — is_active flags preserve data
- **Timestamp everything** — Full audit trail maintained

### Simplified Maintenance

- **Single responsibility** — Each table has one purpose
- **Minimal coupling** — Tables reference others sparingly
- **Predictable patterns** — Same structure reused consistently
- **Documented behavior** — This specification serves as reference

---

## Documentation References

| Document | Purpose |
|----------|---------|
| `knowledge/database-schema.md` | Database architecture philosophy |
| `knowledge/adsgram.md` | AdsGram integration |
| `knowledge/economy-system.md` | Economy specifications |
| `knowledge/social-system.md` | Social features |
| `knowledge/events.md` | Event system |
| `knowledge/pvp-arena.md` | PvP specifications |
| `knowledge/backup-system.md` | Backup procedures |
| `agents/database.md` | Database Agent |

---

*Well-documented tables are the foundation of maintainable systems.*
