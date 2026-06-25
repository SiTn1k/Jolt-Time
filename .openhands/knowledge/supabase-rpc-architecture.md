# Supabase RPC Architecture

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Project:** Jolt Time  
**Platform:** Telegram Mini App + Telegram Bot  
**Backend:** Supabase PostgreSQL  

---

## Table of Contents

1. [RPC Categories](#1-rpc-categories)
2. [RPC Philosophy](#2-rpc-philosophy)
3. [Folder and Organization Strategy](#3-folder-and-organization-strategy)
4. [Player RPC Architecture](#4-player-rpc-architecture)
5. [Economy RPC Architecture](#5-economy-rpc-architecture)
6. [Museum RPC Architecture](#6-museum-rpc-architecture)
7. [Event RPC Architecture](#7-event-rpc-architecture)
8. [PvP and Guild RPC Architecture](#8-pvp-and-guild-rpc-architecture)
9. [Transaction Philosophy](#9-transaction-philosophy)
10. [Security Standards](#10-security-standards)
11. [Performance Philosophy](#11-performance-philosophy)
12. [Error Handling Standards](#12-error-handling-standards)
13. [Repository Integration Standards](#13-repository-integration-standards)
14. [AdsGram RPC Notes](#14-adsgram-rpc-notes)
15. [Analytics RPC Notes](#15-analytics-rpc-notes)
16. [Future Expansion Notes](#16-future-expansion-notes)
17. [Long-Term Philosophy](#17-long-term-philosophy)

---

## 1. RPC Categories

RPC Functions serve as the **Database Business Logic Layer** in Jolt Time, executing complex operations atomically within the database. The RPC system is organized into seven primary categories.

### 1.1 Player RPCs

Player RPCs handle all player-related business logic that requires atomic database operations. These include profile updates, progression calculations, achievement processing, and statistics aggregation.

**Responsibilities:**
- Profile data modifications with validation
- Experience and level progression calculations
- Achievement unlock and tracking logic
- Cross-system statistic aggregations

**Characteristics:**
- User-scoped execution with RLS compatibility
- Require authentication via Supabase auth
- Return structured response objects with status

### 1.2 Economy RPCs

Economy RPCs manage the game's economic operations including currency transactions, reward distributions, inventory updates, and marketplace operations. These are among the most security-sensitive RPCs due to their direct impact on game economy integrity.

**Responsibilities:**
- Currency transfer and balance updates
- Reward credit and debit operations
- Inventory item acquisition and consumption
- Marketplace listing and transaction settlement

**Characteristics:**
- Require transaction wrapping for atomicity
- Include duplicate prevention logic
- Emit audit trail entries
- Validate against exploit patterns

### 1.3 Museum RPCs

Museum RPCs handle artifact acquisition, collection updates, exhibition calculations, and museum progression. These RPCs coordinate complex interactions between player inventory and museum display systems.

**Responsibilities:**
- Artifact acquisition from various sources
- Collection completion tracking
- Exhibition slot management
- Museum progression and unlock calculations

**Characteristics:**
- Coordinate multiple table updates
- Track collection completion percentages
- Manage exhibition slot assignments

### 1.4 Event RPCs

Event RPCs manage event participation, mission completion, season rewards, and leaderboard updates. These RPCs handle time-sensitive operations that affect large numbers of players simultaneously.

**Responsibilities:**
- Mission progress tracking and completion
- Event participation registration
- Season reward calculations and distribution
- Leaderboard score updates

**Characteristics:**
- Handle high concurrency during events
- Calculate rankings and tier distributions
- Manage event-specific timers and windows

### 1.5 PvP RPCs

PvP RPCs handle battle resolution, ranking updates, and competitive match processing. These RPCs must execute quickly and accurately under competitive conditions.

**Responsibilities:**
- Battle outcome calculation and recording
- Ranking point adjustments
- Elo or similar rating updates
- Match history archival

**Characteristics:**
- Require deterministic outcomes
- Must handle concurrent match processing
- Include anti-cheat validation

### 1.6 Guild RPCs

Guild RPCs manage guild progression, guild rewards, and guild member interactions. These RPCs coordinate between guild-level and player-level data changes.

**Responsibilities:**
- Guild creation and management
- Member recruitment and removal
- Guild treasury operations
- Guild-level progression calculations

**Characteristics:**
- Require guild-level permissions checks
- Coordinate member and guild data updates
- Handle guild disband and transfer scenarios

### 1.7 Analytics RPCs

Analytics RPCs handle reporting, aggregation, and metrics collection without impacting real-time gameplay performance. These RPCs typically process large datasets asynchronously.

**Responsibilities:**
- Session event aggregation
- Retention metric calculations
- Revenue and monetization tracking
- Performance metric collection

**Characteristics:**
- Often batch-oriented processing
- Read-heavy with minimal writes
- May use materialized views for efficiency

---

## 2. RPC Philosophy

RPC Functions represent a fundamental architectural shift toward centralizing business logic in the database layer. This approach provides significant advantages for data consistency, security, and performance.

### 2.1 Centralize Complex Operations

Complex operations that span multiple tables must execute atomically within the database. Moving this logic from the client to the database eliminates round-trip latencies and race conditions inherent in multi-step client-side execution.

**Benefits of Centralization:**
- Eliminates network round-trips between application and database
- Prevents race conditions through database-level locking
- Ensures all-or-nothing execution for related operations
- Simplifies client code by hiding complex logic

**Example Centralization Pattern:**
```
Client Request (before): 
  1. Fetch current balance
  2. Calculate new balance
  3. Validate transaction
  4. Update balance
  5. Insert transaction record
  (Race condition risk, multiple failure points)

Client Request (after):
  1. Call RPC with transaction parameters
  2. RPC executes atomically
  (Single failure point, no race conditions)
```

### 2.2 Reduce Client-Side Logic

The client application should focus on presentation and user interaction, not business logic. RPC Functions shift validation, calculation, and state management to the database layer.

**Client Responsibilities:**
- User input collection and formatting
- Response presentation
- Error message display
- Optimistic UI updates (where appropriate)

**Server (RPC) Responsibilities:**
- Business rule validation
- Data consistency enforcement
- Transaction management
- Fraud detection

### 2.3 Improve Consistency

When business rules execute in the database, all clients receive the same behavior regardless of platform, version, or implementation. This eliminates inconsistencies that arise from duplicating logic across different client implementations.

**Consistency Guarantees:**
- Same validation rules for all clients
- Atomic operations prevent partial states
- Centralized fraud detection
- Uniform audit trails

### 2.4 Improve Performance

Database-executed logic can leverage indexes, query optimization, and connection pooling that client-side code cannot access. Batch operations and complex aggregations execute more efficiently close to the data.

**Performance Advantages:**
- Direct access to indexes and statistics
- Reduced network payload (no large intermediate results)
- Connection pooling for concurrent requests
- Potential for query optimization hints

---

## 3. Folder and Organization Strategy

RPC Functions are organized logically by domain, following the same category structure used in the Repository Pattern.

### 3.1 Directory Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   ├── auth.ts              # Authentication helpers
│   │   ├── error.ts             # Error response builders
│   │   ├── validation.ts        # Shared validation utilities
│   │   └── types.ts             # Common RPC types
│   ├── player/
│   │   ├── update_profile/
│   │   ├── calculate_progression/
│   │   ├── process_achievement/
│   │   └── aggregate_statistics/
│   ├── economy/
│   │   ├── process_currency/
│   │   ├── distribute_reward/
│   │   ├── update_inventory/
│   │   └── settle_marketplace/
│   ├── museum/
│   │   ├── acquire_artifact/
│   │   ├── update_collection/
│   │   ├── calculate_exhibition/
│   │   └── process_museum_progression/
│   ├── events/
│   │   ├── complete_mission/
│   │   ├── join_event/
│   │   ├── calculate_season_rewards/
│   │   └── update_leaderboard/
│   ├── pvp/
│   │   ├── resolve_battle/
│   │   ├── update_ranking/
│   │   └── process_match_result/
│   ├── guilds/
│   │   ├── create_guild/
│   │   ├── update_guild/
│   │   ├── process_guild_reward/
│   │   └── update_member/
│   ├── analytics/
│   │   ├── record_event/
│   │   ├── calculate_retention/
│   │   ├── aggregate_metrics/
│   │   └── generate_report/
│   └── adsgram/
│       ├── validate_reward/
│       ├── distribute_ad_reward/
│       └── track_conversion/
```

### 3.2 Player Operations Organization

Player RPCs are grouped by operational domain:

| RPC Group | Functions | Purpose |
|-----------|-----------|---------|
| `player/profile/` | update_profile, get_profile | Profile data management |
| `player/progression/` | calculate_progression, check_level_up | Experience and level handling |
| `player/achievements/` | process_achievement, unlock_achievement | Achievement tracking |
| `player/statistics/` | aggregate_statistics, update_statistic | Stats aggregation |

### 3.3 Economy Operations Organization

Economy RPCs are grouped by transaction type:

| RPC Group | Functions | Purpose |
|-----------|-----------|---------|
| `economy/currency/` | process_currency, transfer_currency | Currency operations |
| `economy/rewards/` | distribute_reward, claim_reward | Reward handling |
| `economy/inventory/` | add_item, remove_item, use_item | Inventory management |
| `economy/marketplace/` | create_listing, settle_purchase | Marketplace operations |

### 3.4 Museum Operations Organization

Museum RPCs handle the complex interactions between artifacts and collections:

| RPC Group | Functions | Purpose |
|-----------|-----------|---------|
| `museum/artifacts/` | acquire_artifact, evolve_artifact | Artifact lifecycle |
| `museum/collections/` | update_collection, complete_set | Collection tracking |
| `museum/exhibitions/` | calculate_exhibition, update_display | Exhibition management |

### 3.5 Event Operations Organization

Event RPCs manage time-sensitive competitive and cooperative content:

| RPC Group | Functions | Purpose |
|-----------|-----------|---------|
| `events/missions/` | complete_mission, update_progress | Mission tracking |
| `events/participation/` | join_event, leave_event | Event registration |
| `events/rewards/` | calculate_season_rewards, claim_rewards | Reward distribution |
| `events/leaderboards/` | update_leaderboard, get_rankings | Ranking management |

---

## 4. Player RPC Architecture

Player RPCs handle all player-scoped business logic, ensuring consistent behavior across all client platforms.

### 4.1 Profile Updates

Profile update RPCs manage player identity data with appropriate validation and side effects.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.update_profile` | Update player profile fields | Validate input, update timestamps, trigger related recalculations |
| `rpc.update_display_name` | Change player display name | Check name availability, apply rate limiting, record history |
| `rpc.update_avatar` | Update profile avatar | Validate image URL, update reference, invalidate CDN cache |

**Responsibilities:**
- Validate input against format requirements
- Enforce rate limiting on frequent changes
- Maintain change history for audit purposes
- Update denormalized caches (leaderboards, guilds)
- Trigger dependent recalculations (achievement progress)

**Input Validation:**
- Display name: 3-30 characters, no special characters, no duplicates
- Avatar URL: Valid format, size limits, allowed domains
- Bio: Optional, max 500 characters, content filtering

### 4.2 Progression Calculations

Progression RPCs handle experience, levels, and related progression mechanics.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.calculate_progression` | Recalculate player level | Sum XP from all sources, determine level, apply rewards |
| `rpc.add_experience` | Add XP to player | Source validation, bonus calculation, level check |
| `rpc.process_level_up` | Handle level milestone | Award level rewards, update achievements, notify client |

**Progression Logic:**
```sql
-- Level thresholds follow exponential growth pattern
-- Level N requires: base_xp * (growth_rate ^ (N-1)) total XP
-- Level up RPCs atomically:
--   1. Add experience to player record
--   2. Calculate new level
--   3. If level changed, insert reward claims
--   4. Return new level and pending rewards
```

**Responsibilities:**
- Calculate total experience from multiple sources
- Determine level thresholds and caps
- Calculate partial progress to next level
- Award automatic level-up rewards
- Generate achievement progress events

### 4.3 Achievement Processing

Achievement RPCs track and award achievements with proper validation and notification.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.process_achievement` | Process potential achievement unlock | Check unlock conditions, award achievement, update stats |
| `rpc.claim_achievement_reward` | Claim pending achievement rewards | Validate claim, credit rewards, mark as claimed |
| `rpc.get_achievement_progress` | Get progress toward achievements | Calculate current/required values for all achievements |

**Achievement Processing Flow:**
1. Game event triggers achievement check
2. RPC evaluates all relevant conditions
3. Newly unlocked achievements are inserted
4. Reward entries are created for claiming
5. Statistics are updated
6. Notification event is queued

### 4.4 Statistics Aggregation

Statistics RPCs aggregate and retrieve player statistics across all game systems.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.aggregate_statistics` | Recalculate player statistics | Sum from source tables, update aggregated record |
| `rpc.get_player_stats` | Retrieve player statistics | Fetch current aggregates, calculate rankings |
| `rpc.update_cross_game_stat` | Update cross-game statistics | Combine stats from multiple game modes |

**Aggregation Strategy:**
- Real-time: Simple counters updated on each action
- Near-real-time: Background aggregation every 5 minutes
- Historical: Daily aggregation job for trends

---

## 5. Economy RPC Architecture

Economy RPCs manage the game's economic systems with emphasis on security, consistency, and fraud prevention.

### 5.1 Currency Transactions

Currency RPCs handle all currency-related operations with full transactional safety.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.process_currency` | Generic currency operation | Validate, update balance, record transaction |
| `rpc.transfer_currency` | Player-to-player transfer | Validate both players, atomic transfer, record both |
| `rpc.purchase_with_currency` | Spend currency for item/service | Validate balance, deduct, award item/service |

**Transaction Safety:**
```sql
-- All currency operations use advisory locks
-- to prevent race conditions
SELECT pg_advisory_xact_lock(user_id_hash);

-- Balance check and update in single statement
UPDATE player_balances
SET shard_balance = shard_balance - @amount
WHERE user_id = @user_id
AND shard_balance >= @amount
RETURNING shard_balance;

-- If no rows returned, insufficient balance
```

**Audit Requirements:**
- Every currency operation creates transaction record
- Transaction includes: user_id, amount, type, source, timestamp
- Transaction references linked entity (purchase, reward, etc.)
- Transactions are immutable once created

### 5.2 Reward Distribution

Reward RPCs handle the crediting of rewards from various game activities.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.distribute_reward` | Credit reward to player | Validate source, calculate bonus, credit currency/items |
| `rpc.batch_distribute_rewards` | Distribute to multiple players | Validate batch, process all atomically |
| `rpc.claim_pending_rewards` | Claim accumulated rewards | Validate claim eligibility, credit all pending |

**Reward Sources:**
| Source | Validation | Processing |
|--------|------------|------------|
| Daily Login | One claim per day | Auto-distribute at login |
| Mission Complete | Mission requirements met | Credit on completion |
| Achievement | Achievement unlocked | Credit on claim |
| Event | Event participation verified | Credit per event rules |
| Admin Grant | Admin authorization | Direct credit with reference |

### 5.3 Inventory Updates

Inventory RPCs manage player item possession with proper validation.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.add_item_to_inventory` | Acquire new item | Validate source, insert inventory record, update collection |
| `rpc.remove_item_from_inventory` | Consume or lose item | Validate possession, delete or decrement, trigger effects |
| `rpc.use_inventory_item` | Activate item effect | Validate usable, apply effect, decrement quantity |
| `rpc.move_item_to_storage` | Transfer to long-term storage | Validate capacity, move item record |

**Stack Management:**
- Stackable items: Increment quantity, max stack limit
- Non-stackable items: Insert new record per item
- Limited items: Check remaining quantity, track total earned

### 5.4 Marketplace Transactions

Marketplace RPCs handle player-to-player trading with escrow and validation.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.create_marketplace_listing` | List item for sale | Validate ownership, create listing record, lock item |
| `rpc.cancel_listing` | Remove listing | Validate ownership, unlock item, delete listing |
| `rpc.purchase_listing` | Buy listed item | Validate currency, escrow payment, transfer item, release funds |

**Escrow Flow:**
1. Buyer initiates purchase
2. Payment placed in escrow (locked)
3. Item ownership transferred to buyer
4. Funds released to seller
5. Transaction recorded for both parties

---

## 6. Museum RPC Architecture

Museum RPCs handle the acquisition, display, and evolution of artifacts within the museum system.

### 6.1 Artifact Acquisition

Artifact acquisition RPCs manage the complex process of obtaining new artifacts.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.acquire_artifact` | General artifact acquisition | Validate source, create inventory entry, update collections |
| `rpc.claim_daily_artifact` | Claim daily free artifact | Validate daily claim eligibility, random selection, award |
| `rpc.purchase_artifact` | Buy artifact from shop | Validate currency, deduct cost, acquire artifact |

**Acquisition Validation:**
- Source validation: Event active, quest completed, purchase verified
- Duplicate prevention: Check if player already owns artifact
- Rarity distribution: Apply probability weights for random acquisition
- Collection impact: Update completion percentages

### 6.2 Collection Updates

Collection tracking RPCs monitor and update artifact collection progress.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.update_collection_progress` | Track collection completion | Count owned/total, calculate percentage, check milestones |
| `rpc.process_collection_completion` | Handle full collection | Validate completion, award completion bonus, update achievements |
| `rpc.sync_collection_data` | Reconcile collection data | Fix inconsistencies, update derived values |

### 6.3 Exhibition Calculations

Exhibition RPCs manage how artifacts are displayed in the museum.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.calculate_exhibition_slots` | Determine available slots | Calculate based on level, purchased slots, event bonuses |
| `rpc.update_exhibition` | Change displayed artifact | Validate slot ownership, update display record |
| `rpc.swap_exhibition_artifacts` | Rearrange museum display | Validate ownership of both, swap positions |

### 6.4 Museum Progression

Museum progression RPCs handle museum-level advancement.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.calculate_museum_level` | Determine museum level | Sum artifact values, apply multipliers, determine tier |
| `rpc.process_museum_level_up` | Handle museum advancement | Apply tier unlocks, award bonuses, update visitors |

---

## 7. Event RPC Architecture

Event RPCs manage time-limited content including missions, seasons, and competitive leaderboards.

### 7.1 Mission Completion

Mission completion RPCs track and credit mission progress.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.update_mission_progress` | Record mission action | Validate mission eligibility, increment progress, check completion |
| `rpc.complete_mission` | Process mission completion | Validate completion, award rewards, update daily/weekly counters |
| `rpc.claim_mission_rewards` | Claim accumulated mission rewards | Validate completion, credit rewards, mark claimed |

**Progress Tracking:**
```sql
-- Mission progress updated atomically
-- Multiple progress types supported
INSERT INTO mission_progress (user_id, mission_id, progress_type, value)
VALUES (@user_id, @mission_id, @type, @value)
ON CONFLICT (user_id, mission_id, progress_type)
DO UPDATE SET value = mission_progress.value + @value,
              updated_at = NOW();

-- Completion check after each update
SELECT check_mission_completion(@user_id, @mission_id);
```

### 7.2 Event Participation

Event participation RPCs manage player registration and involvement in events.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.join_event` | Register for event | Validate eligibility, create participation record, award onboarding rewards |
| `rpc.leave_event` | Withdraw from event | Validate participation, forfeit progress, mark inactive |
| `rpc.get_event_status` | Retrieve player event state | Fetch progress, rank, eligibility status |

### 7.3 Season Rewards

Season reward RPCs calculate and distribute seasonal content rewards.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.calculate_season_final_rewards` | Determine end-of-season rewards | Calculate final standings, apply tier multipliers, generate claims |
| `rpc.claim_season_reward` | Claim seasonal reward | Validate claim eligibility, credit rewards, mark claimed |
| `rpc.prorate_season_rewards` | Handle mid-season rewards | Calculate partial rewards, credit proportionally |

### 7.4 Leaderboard Updates

Leaderboard RPCs manage competitive rankings with efficient updates.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.update_leaderboard_score` | Submit new score | Validate score, update record, recalculate rank |
| `rpc.get_leaderboard_rankings` | Retrieve rankings | Apply pagination, calculate ranks, fetch surrounding players |
| `rpc.process_leaderboard_ties` | Handle tied scores | Apply tiebreaker logic, adjust rankings |

**Ranking Calculation:**
- Scores updated in batches during off-peak hours
- Real-time rank queries use pre-calculated rankings
- Periodic full recalculation ensures accuracy

---

## 8. PvP and Guild RPC Architecture

### 8.1 Battle Resolution

Battle resolution RPCs determine match outcomes with fraud prevention.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.process_battle_result` | Record battle outcome | Validate participants, determine winner, update ratings |
| `rpc.process_battle_preview` | Preview battle outcome | Calculate expected result without recording |
| `rpc.cancel_battle` | Cancel pending battle | Validate cancellation eligibility, release queue slot |

**Anti-Cheat Validation:**
- Timestamp validation: Battle initiated and completed within time window
- Participant verification: Both players confirmed active
- Score validation: Results within expected range
- Rate limiting: Maximum battles per time period

### 8.2 Ranking Updates

Ranking RPCs manage player competitive standings.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.calculate_new_rankings` | Update all rankings | Recalculate based on recent results, apply decay |
| `rpc.get_player_rank` | Retrieve player rank | Fetch current rank, percentile, trend |
| `rpc.process_rank_rewards` | Award ranking tiers | Calculate tier, credit rewards, update badge |

### 8.3 Guild Progression

Guild progression RPCs handle collective advancement.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.process_guild_xp` | Add guild experience | Validate source, update guild level, check unlocks |
| `rpc.calculate_guild_level` | Determine guild level | Sum member contributions, apply bonuses, determine tier |
| `rpc.process_guild_level_up` | Handle guild advancement | Unlock perks, award rewards, update ranking |

### 8.4 Guild Rewards

Guild reward RPCs distribute rewards to guild members.

**Core RPCs:**

| RPC Function | Purpose | Key Operations |
|--------------|---------|----------------|
| `rpc.distribute_guild_reward` | Award guild-wide reward | Calculate per-member share, credit each member |
| `rpc.claim_guild_reward` | Claim individual reward | Validate eligibility, credit reward, mark claimed |
| `rpc.process_guild_bonus` | Apply guild bonuses | Calculate member bonuses, update affected systems |

---

## 9. Transaction Philosophy

RPC Functions must provide strong transactional guarantees to ensure data consistency.

### 9.1 Atomic Operations

Every RPC should execute as an atomic unit of work. Either all database changes succeed, or none do.

**Atomicity Patterns:**
```sql
-- Single transaction wrapper
BEGIN;
  -- All operations here
  UPDATE player_balance SET shards = shards - 100 WHERE user_id = @user_id;
  INSERT INTO inventory (user_id, item_id) VALUES (@user_id, @item_id);
  INSERT INTO transaction_log (user_id, type, amount) VALUES (@user_id, 'purchase', -100);
COMMIT;

-- If any statement fails, entire transaction rolls back
```

**Rollback Triggers:**
- Constraint violation
- Business rule violation
- Validation failure
- Concurrent modification detected

### 9.2 Rollback Safety

RPCs must be designed to safely roll back to pre-invocation state on failure.

**Rollback Safety Requirements:**
- No external side effects within transaction scope
- Deterministic rollback path for all failure modes
- Proper error propagation to client

### 9.3 Consistency Guarantees

RPCs must maintain database consistency, never leaving data in an invalid state.

**Consistency Patterns:**
- Pre-conditions validated before modifications
- Modifications applied in safe order
- Post-conditions verified after modifications
- Constraint violations prevented by design

---

## 10. Security Standards

RPC security ensures business logic executes only for authorized users with valid inputs.

### 10.1 RLS Compatibility

RPCs must work correctly with Supabase Row Level Security policies.

**RLS Integration:**
- RPC functions execute with caller context
- RLS policies evaluated for underlying table access
- Service role used only for admin operations
- User context preserved for audit trails

**Pattern:**
```sql
-- RPC executes with auth.uid() set
CREATE OR REPLACE FUNCTION update_profile(display_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- Executes with definer's privileges
SET search_path = public
AS $$
BEGIN
  -- RLS still applies based on calling user
  UPDATE profiles
  SET display_name = update_profile.display_name,
      updated_at = NOW()
  WHERE id = auth.uid();  -- References calling user
END;
$$;
```

### 10.2 Permission Checks

RPCs must verify caller has appropriate permissions for requested operations.

**Permission Categories:**
| Operation Type | Required Validation |
|----------------|--------------------|
| Self-only data | User matches resource owner |
| Guild operations | User is guild member/officer |
| Admin operations | User has admin role |
| Monetization | User verified, within limits |

**Permission Enforcement:**
- Check user attributes before any modification
- Validate guild membership and rank for guild operations
- Verify admin role for administrative functions
- Log all permission checks for audit

### 10.3 Abuse Prevention

RPCs must implement rate limiting and abuse detection.

**Abuse Prevention Measures:**
- Rate limiting: Maximum calls per user per time period
- Input validation: Strict format and range checking
- Duplicate prevention: Idempotency keys for critical operations
- Anomaly detection: Flag unusual patterns for review

### 10.4 Fraud Prevention

Economy RPCs implement specific fraud prevention measures.

**Fraud Prevention Patterns:**
- Advisory locks for balance operations
- Double-entry validation for currency transfers
- Source verification for rewards
- Duplicate transaction detection

---

## 11. Performance Philosophy

RPC performance directly impacts user experience. RPCs should be optimized for both latency and throughput.

### 11.1 Reduce Network Calls

Batching related operations into single RPC calls reduces network overhead.

**Batching Patterns:**
- Multiple inventory operations in single RPC
- Bulk reward distribution to multiple users
- Batch leaderboard updates
- Multi-record fetch with filtering

### 11.2 Minimize Database Load

Efficient queries and proper indexing minimize database resource consumption.

**Optimization Strategies:**
- Use covering indexes to avoid table lookups
- Avoid SELECT *; fetch only required columns
- Use efficient data types (avoid TEXT for fixed values)
- Batch inserts/updates where possible

### 11.3 Optimize Complex Calculations

Complex calculations should leverage database strengths.

**Calculation Patterns:**
- Use database functions for aggregations
- Pre-compute expensive calculations
- Materialize results for frequent queries
- Background processing for non-critical calculations

---

## 12. Error Handling Standards

Consistent error handling enables reliable client integration.

### 12.1 Standardized Responses

All RPCs return consistent response structures.

**Response Pattern:**
```sql
-- Success response
RETURN jsonb_build_object(
  'success', true,
  'data', result_data,
  'timestamp', NOW()
);

-- Error response
RETURN jsonb_build_object(
  'success', false,
  'error', error_code,
  'message', human_readable_message,
  'timestamp', NOW()
);
```

### 12.2 Validation Failures

Invalid inputs return structured validation errors.

**Validation Error Response:**
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input parameters",
  "details": [
    {"field": "amount", "reason": "must be positive integer"},
    {"field": "currency", "reason": "invalid currency type"}
  ]
}
```

### 12.3 Transaction Failures

Transaction failures include context for debugging.

**Transaction Error Response:**
```json
{
  "success": false,
  "error": "TRANSACTION_FAILED",
  "message": "Could not complete operation",
  "reason": "INSUFFICIENT_BALANCE",
  "details": {
    "required": 100,
    "available": 50
  }
}
```

### 12.4 Security Failures

Security failures return minimal information to prevent enumeration.

**Security Error Response:**
```json
{
  "success": false,
  "error": "ACCESS_DENIED",
  "message": "You do not have permission to perform this action"
}
```

---

## 13. Repository Integration Standards

Repositories invoke RPCs for complex operations, maintaining the clean architecture separation.

### 13.1 Repositories Invoke RPCs

Repository methods call RPC functions for business logic operations.

**Repository-RPC Pattern:**
```typescript
// Repository method calls RPC
class EconomyRepository {
  async purchaseItem(userId: string, itemId: string, quantity: number): Promise<PurchaseResult> {
    const { data, error } = await supabase.rpc('purchase_item', {
      p_user_id: userId,
      p_item_id: itemId,
      p_quantity: quantity
    });
    
    if (error) throw new EconomyError(error);
    return data;
  }
}
```

### 13.2 Services Consume Repository Results

Service layer receives repository results and applies presentation logic.

**Service-Repository Pattern:**
```typescript
// Service layer uses repository results
class PurchaseService {
  constructor(private economyRepo: EconomyRepository) {}
  
  async handlePurchase(userId: string, itemId: string): Promise<PurchaseResponse> {
    const result = await this.economyRepo.purchaseItem(userId, itemId, 1);
    
    return {
      success: result.success,
      newBalance: result.current_balance,
      item: await this.itemRepo.getItem(itemId)
    };
  }
}
```

### 13.3 Business Logic Isolation

RPCs contain all business logic; repositories handle data access; services handle presentation.

**Layer Responsibilities:**

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **RPC (Database)** | Business rules, validation, transactions | Check balance, deduct currency, record transaction |
| **Repository** | Data access, RPC invocation, data mapping | Call purchase_item RPC, map result to domain object |
| **Service** | Presentation logic, UI formatting, orchestration | Format purchase confirmation, trigger analytics event |

---

## 14. AdsGram RPC Notes

AdsGram RPCs handle reward validation, distribution, and fraud prevention for the primary revenue system.

### 14.1 Reward Validation

Reward validation ensures ad rewards are legitimate before distribution.

**Core RPCs:**

| RPC Function | Purpose |
|--------------|---------|
| `rpc.validate_ad_reward` | Verify reward eligibility |
| `rpc.verify_ad_completion` | Confirm ad watched to completion |
| `rpc.check_reward_cooldown` | Validate time since last reward |

**Validation Checks:**
- User exists and is active
- Ad was configured for this user
- Watch duration meets minimum requirement
- No duplicate reward claims
- Within daily/hourly reward limits

### 14.2 Reward Distribution

Reward distribution credits users for validated ad views.

**Core RPCs:**

| RPC Function | Purpose |
|--------------|---------|
| `rpc.distribute_ad_reward` | Credit reward after validation |
| `rpc.batch_distribute_ad_rewards` | Process multiple rewards |
| `rpc.claim_ad_rewards` | Claim accumulated ad rewards |

**Distribution Safety:**
- Validation must complete before distribution
- Reward amount determined by configuration
- Distribution creates audit trail entry
- Daily totals tracked for limits

### 14.3 Monetization Integrity

Monetization RPCs protect revenue by preventing exploitation.

**Integrity Measures:**
- Server-side reward amount calculation
- Configurable per-user reward limits
- Rate limiting on reward claims
- Anomaly detection for suspicious patterns
- Audit logging for all transactions

### 14.4 Duplicate Reward Prevention

Duplicate prevention ensures each ad view credits only once.

**Prevention Patterns:**
```sql
-- Use unique constraint on completion identifier
CREATE UNIQUE INDEX idx_ad_completions_completion_id 
ON ad_completions(completion_id);

-- RPC checks before insert
CREATE OR REPLACE FUNCTION distribute_ad_reward(p_completion_id TEXT)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_existing INTEGER;
BEGIN
  -- Check for duplicate
  SELECT COUNT(*) INTO v_existing 
  FROM ad_completions 
  WHERE completion_id = p_completion_id;
  
  IF v_existing > 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'DUPLICATE_REWARD');
  END IF;
  
  -- Process reward...
END;
$$;
```

---

## 15. Analytics RPC Notes

Analytics RPCs collect and aggregate data without impacting real-time performance.

### 15.1 Reporting

Reporting RPCs generate data for analytics dashboards.

**Core RPCs:**

| RPC Function | Purpose |
|--------------|---------|
| `rpc.generate_player_report` | Individual player analytics |
| `rpc.generate_event_report` | Event performance metrics |
| `rpc.generate_revenue_report` | Revenue aggregation |

### 15.2 Aggregation

Aggregation RPCs compute metrics from raw event data.

**Aggregation Strategy:**
- Real-time: Simple counters and flags
- Near-real-time: Pre-aggregated materialized views
- Historical: Daily/weekly/monthly rollups

### 15.3 Performance Metrics

Performance RPCs track game performance indicators.

**Metrics Tracked:**
- Session duration and frequency
- Feature engagement rates
- Progression velocity
- Retention cohort data

### 15.4 Retention Calculations

Retention RPCs calculate and report player retention.

**Retention Metrics:**
- Day 1, Day 7, Day 30 retention
- Session frequency distribution
- Churn probability scoring
- Re-engagement campaign targeting

---

## 16. Future Expansion Notes

Future RPC categories represent potential expansion areas for the Jolt Time ecosystem.

### 16.1 AI Systems RPCs

**Concept:** RPCs for AI-driven features and personalization.

**Potential Functions:**
- `rpc.get_personalized_recommendations`
- `rpc.process_ai_interaction`
- `rpc.generate_content_preview`

**Status:** Future concept only, not currently planned.

### 16.2 Creator Economy RPCs

**Concept:** RPCs supporting user-generated content and creator tools.

**Potential Functions:**
- `rpc.submit_creator_content`
- `rpc.review_creator_submission`
- `rpc.calculate_creator_payouts`

**Status:** Future concept only, not currently planned.

### 16.3 Web3 Systems RPCs

**Concept:** RPCs for blockchain integration and wallet management.

**Potential Functions:**
- `rpc.verify_wallet_ownership`
- `rpc.process_onchain_transaction`
- `rpc.sync_wallet_balance`

**Status:** Future concept only, not currently planned.

### 16.4 NFT Systems RPCs

**Concept:** RPCs for NFT minting, trading, and ownership tracking.

**Potential Functions:**
- `rpc.mint_artifact_nft`
- `rpc.initiate_nft_transfer`
- `rpc.verify_nft_ownership`

**Status:** Future concept only, not currently planned.

### 16.5 Esports Systems RPCs

**Concept:** RPCs for competitive gaming infrastructure.

**Potential Functions:**
- `rpc.register_team_for_tournament`
- `rpc.process_match_result`
- `rpc.calculate_tournament_standings`

**Status:** Future concept only, not currently planned.

---

## 17. Long-Term Philosophy

The RPC Architecture serves as the foundation for Jolt Time's database business logic layer.

### 17.1 Database Business Logic Layer

RPCs become the authoritative location for all business rules affecting data.

**Layer Benefits:**
| Benefit | Description |
|---------|-------------|
| Single Source of Truth | Business logic defined once, enforced everywhere |
| Consistent Enforcement | All clients receive same rules regardless of platform |
| Secure Execution | Logic runs with database-level protections |
| Performance | Complex operations execute close to data |

### 17.2 Improved Reliability

Centralized business logic improves system reliability.

**Reliability Improvements:**
- No inconsistent implementations across platforms
- Atomic operations prevent partial states
- Centralized error handling
- Comprehensive audit trails

### 17.3 Support Growth

The RPC architecture scales with Jolt Time's growth.

**Scalability Features:**
- Connection pooling for concurrent users
- Efficient query patterns reduce database load
- Modular organization supports team growth
- Clear ownership boundaries

### 17.4 Simplified Future Development

The architecture simplifies adding new features and systems.

**Development Simplifications:**
- New features add new RPCs without modifying existing logic
- Testing focuses on RPC contracts
- Client development simplified by server-side logic
- Security improvements apply universally

---

## Related Documentation

- **Repository Pattern:** `.openhands/knowledge/repository-pattern.md`
- **Database Migrations:** `.openhands/knowledge/database-migrations.md`
- **API Architecture:** `.openhands/knowledge/api-architecture.md`
- **Services Layer:** `.openhands/knowledge/services-layer.md`
- **AdsGram Integration:** `.openhands/knowledge/adsgram.md`

---

*Building the future through the lens of the past.*
