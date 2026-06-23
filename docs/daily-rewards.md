# Daily Rewards System

## Overview

The Daily Rewards system is a key retention mechanic in Jolt Time that provides players with daily incentives to return and engage with the game. Players receive rewards for logging in each day, with the reward cycle repeating every 7 days.

## Reward Calendar

The weekly reward calendar provides escalating rewards throughout the week:

| Day | Reward | Type | Description |
|-----|--------|------|-------------|
| 1 | 50 Energy | ⚡ Energy | Time Energy for gameplay |
| 2 | 100 Coins | 🪙 Coins | Chrono Dust currency |
| 3 | 1 Common Capsule | 📦 Capsule | Basic artifact capsule |
| 4 | 150 Coins | 🪙 Coins | Chrono Dust currency |
| 5 | 100 Energy | ⚡ Energy | Time Energy for gameplay |
| 6 | 1 Rare Capsule | 💎 Capsule | Premium artifact capsule |
| 7 | Chrono Chest | 🏆 Special | Special reward with bonus coins + energy |

### Special Reward (Day 7)

The Chrono Chest is a special reward that provides:
- **200 Coins** (bonus)
- **50 Energy** (bonus)
- **Premium glow effect** in UI
- **Exclusive badge** potential

## Claim Rules

### Core Rules

1. **Once Per Day**: Each reward can only be claimed once per calendar day (UTC timezone)
2. **No Progress Reset**: Missing a day does NOT reset the player's progress. Players continue from where they left off.
3. **Cycle Continuation**: After Day 7, the cycle starts again from Day 1
4. **Server Validation**: All claims are validated server-side to prevent cheating
5. **Double-Claim Prevention**: It is impossible to claim the same reward twice in one day

### Claim Flow

```
Player Opens App
        │
        ▼
┌─────────────────────────┐
│ Check Last Claim Date   │
│ (Server-side validation)│
└─────────────────────────┘
        │
        ├─── Same Day ────► Already Claimed
        │
        ▼
┌─────────────────────────┐
│ Can Claim Reward        │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Claim & Update State    │
│ - Add rewards to user   │
│ - Record in history     │
│ - Advance to next day  │
└─────────────────────────┘
```

### Progress Tracking

- **Current Day**: Tracked in `user_daily_rewards.current_day` (1-7)
- **Streak Count**: Increments with each claim, does NOT reset on missed days (per requirements)
- **Last Claim Date**: Stored in UTC for validation

## Database Structure

### Tables

#### `daily_rewards` (Template Table)

Defines the reward for each day in the cycle.

```sql
CREATE TABLE daily_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_number INTEGER NOT NULL CHECK (day_number >= 1),
    reward_type VARCHAR(50) NOT NULL,
    reward_amount INTEGER DEFAULT 0,
    coins_reward INTEGER DEFAULT 0,
    energy_reward INTEGER DEFAULT 0,
    capsule_type VARCHAR(20),
    is_special BOOLEAN DEFAULT false,
    booster_type VARCHAR(50),
    booster_amount INTEGER DEFAULT 0,
    event_id VARCHAR(50),
    is_premium_only BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(day_number, event_id)
);
```

#### `user_daily_rewards` (User Progress)

Tracks each user's progress through the reward cycle.

```sql
CREATE TABLE user_daily_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_day INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    last_claim_date DATE,
    total_claims INTEGER DEFAULT 0,
    highest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `daily_reward_history` (Claim History)

Records every reward claim for audit and analytics.

```sql
CREATE TABLE daily_reward_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_day INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    streak_at_claim INTEGER NOT NULL,
    coins_amount INTEGER DEFAULT 0,
    energy_amount INTEGER DEFAULT 0,
    capsule_type VARCHAR(20),
    is_special BOOLEAN DEFAULT false,
    total_value INTEGER DEFAULT 0,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_id VARCHAR(50)
);
```

### Indexes

```sql
-- Fast lookup of user's reward status
CREATE INDEX idx_user_daily_rewards_user_id ON user_daily_rewards(user_id);

-- Finding users who haven't claimed today
CREATE INDEX idx_user_daily_rewards_last_claim ON user_daily_rewards(last_claim_date);

-- User history lookups
CREATE INDEX idx_daily_reward_history_user_id ON daily_reward_history(user_id);

-- Date-based analytics
CREATE INDEX idx_daily_reward_history_claimed_at ON daily_reward_history(claimed_at DESC);

-- Reward type analytics
CREATE INDEX idx_daily_reward_history_reward_type ON daily_reward_history(reward_type);
```

## API Endpoints

### GET `/api/v1/daily-rewards/calendar`

Get the reward calendar with current status for a user.

**Request:**
```http
GET /api/v1/daily-rewards/calendar
x-user-id: {user_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "dayNumber": 1,
        "rewardType": "energy",
        "rewardAmount": 50,
        "label": "Energy",
        "icon": "⚡",
        "isSpecial": false,
        "description": "50 Energy"
      },
      ...
    ],
    "currentDay": 1,
    "canClaimToday": true,
    "streak": 0
  }
}
```

### GET `/api/v1/daily-rewards/can-claim`

Check if the user can claim their daily reward.

**Request:**
```http
GET /api/v1/daily-rewards/can-claim
x-user-id: {user_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "canClaim": true,
    "currentDay": 1,
    "currentStreak": 0,
    "nextClaimTime": "2026-06-24T00:00:00.000Z"
  }
}
```

### POST `/api/v1/daily-rewards/claim`

Claim the daily reward.

**Request:**
```http
POST /api/v1/daily-rewards/claim
x-user-id: {user_id}
Content-Type: application/json

{
  "multiplier": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dayNumber": 1,
    "streak": 1,
    "rewards": {
      "coins": 0,
      "energy": 50,
      "timeShards": 0,
      "totalValue": 50
    },
    "message": "Day 1 reward claimed: 50 energy"
  }
}
```

### GET `/api/v1/daily-rewards/history`

Get the user's reward claim history.

**Request:**
```http
GET /api/v1/daily-rewards/history?limit=30
x-user-id: {user_id}
```

### GET `/api/v1/daily-rewards/template` (Public)

Get the reward template without user-specific data.

**Response:**
```json
{
  "success": true,
  "data": {
    "rewards": [
      {
        "dayNumber": 1,
        "rewardType": "energy",
        "rewardAmount": 50,
        "label": "Energy",
        "icon": "⚡",
        "isSpecial": false,
        "description": "50 Energy",
        "capsuleType": null
      },
      ...
    ]
  }
}
```

## UI Component

### DailyRewardScreen

The premium reward screen component provides:

- **Horizontal Scrollable Cards**: All 7 days visible with horizontal scroll
- **Current Day Highlight**: Blue glow effect and "Today" badge
- **Claimed State**: Checkmark overlay on claimed days
- **Special Day Indicator**: Gold border and "⭐ Special" badge for Day 7
- **Animated Claim Button**: Gradient button with hover/press effects
- **Success Overlay**: Celebration modal when reward is claimed

### Visual Design

- **Background**: Dark gradient (#0A0E17 to #131B2E)
- **Primary Glow**: Cyan (#00D9FF) for current day
- **Special Glow**: Gold (#FFD700) for Day 7
- **Success Green**: (#00FF88) for claimed checkmarks
- **Typography**: Inter font family

### Animations

- **Card Hover**: translateY(-2px) with shadow increase
- **Current Day**: Pulsing glow animation (2s infinite)
- **Claim Button**: Scale on press, gradient shimmer
- **Success Modal**: Fade in + scale in (0.3s)

## Future Expansion Possibilities

### Seasonal Cycles

Support for 30-day monthly or 90-day seasonal reward cycles:

```typescript
interface RewardCycleConfig {
  cycleType: 'weekly' | 'monthly' | 'seasonal' | 'event';
  cycleLength: number;
  eventId?: string;
  multiplier: number;
}
```

### Event-Specific Rewards

Override base rewards during special events:

```sql
INSERT INTO daily_rewards (day_number, reward_type, reward_amount, event_id) VALUES
(1, 'event_currency', 100, 'summer_2026');
```

### Premium User Variants

Different reward tables for premium subscribers:

```sql
ALTER TABLE daily_rewards ADD COLUMN premium_reward_type VARCHAR(50);
```

### Streak Multipliers

Reward consistent players with bonus multipliers:

```typescript
const STREAK_MULTIPLIERS = {
  7: 1.1,   // 1 week: +10%
  14: 1.2,   // 2 weeks: +20%
  30: 1.5,   // 1 month: +50%
  100: 2.0   // 100 days: 2x
};
```

### Return Player Bonuses

Boost rewards for returning players:

```typescript
const RETURN_MULTIPLIERS = {
  '1_day': 1.0,
  '2_3_days': 1.5,
  '4_7_days': 2.0,
  '8_14_days': 2.5,
  '14_plus': 3.0
};
```

### Social Features

- **Gift Rewards**: Send daily rewards to friends
- **Streak Clubs**: Group streaks with other players
- **Streak Insurance**: Protect streaks with in-game items

## Implementation Files

- **Types**: `src/types/daily-rewards.ts`
- **Service**: `src/services/DailyRewardService.ts`
- **Repository**: `src/services/DailyRewardRepository.ts`
- **API**: `src/api/dailyRewards.ts`
- **UI**: `src/screens/DailyRewardScreen.tsx`
- **Migrations**:
  - `src/database/migrations/010_create_daily_rewards.sql`
  - `src/database/migrations/011_create_user_daily_rewards.sql`
  - `src/database/migrations/012_create_daily_reward_history.sql`
  - `src/database/migrations/017_update_daily_rewards_for_new_calendar.sql`

---

*Every day is a chance to discover something new in Jolt Time.*
