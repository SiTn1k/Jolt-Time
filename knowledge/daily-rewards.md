# Daily Rewards System Architecture

## Overview

The Daily Rewards system is a key retention mechanic in Jolt Time that provides players with daily incentives to return and engage with the game. Players receive rewards for logging in each day, with the reward cycle repeating every 7 days.

---

## 1. Purpose

The Daily Rewards system serves multiple objectives:

### 1.1 Retention Driver

- Encourage players to return every day
- Create a habitual login pattern
- Reward consistent engagement
- Build long-term player commitment

### 1.2 Onboarding Support

- Provide immediate value to new players
- Introduce game currencies gradually
- Accelerate early progression
- Reduce early-game frustration

### 1.3 Value Communication

- Demonstrate game generosity
- Show appreciation for player time
- Provide tangible daily goals
- Create anticipation for special rewards

---

## 2. Reward Cycle

### 2.1 Weekly 7-Day Cycle

The reward calendar follows a weekly cycle with escalating rewards:

| Day | Reward | Type | Value | Description |
|-----|--------|------|-------|-------------|
| 1 | 50 Energy | ⚡ Energy | Basic | Time Energy for gameplay |
| 2 | 100 Chrono Dust | 🪙 Currency | Small | Introduction to premium currency |
| 3 | 1 Common Capsule | 📦 Capsule | Medium | Basic artifact capsule |
| 4 | 150 Chrono Dust | 🪙 Currency | Small | Accumulation for later use |
| 5 | 100 Energy | ⚡ Energy | Medium | Refuel for continued play |
| 6 | 1 Rare Capsule | 💎 Capsule | Premium | Better chance at rare artifacts |
| 7 | Chrono Chest | 🏆 Special | Grand | Big weekly reward bundle |

### 2.2 Day 7 Chrono Chest Contents

The weekly grand prize contains:
- **300 Chrono Dust** (bonus)
- **100 Energy** (bonus)
- **1 Epic Capsule** (bonus)
- **Premium glow effect** in UI
- **Exclusive badge** eligibility

### 2.3 Cycle Continuation

- After Day 7, the cycle restarts at Day 1
- Progress does NOT reset between cycles
- Players continue accumulating streak bonuses
- Seasonal variations may override base rewards

---

## 3. Reward Types

### 3.1 Currency Rewards

| Currency | Purpose | Typical Amount |
|----------|---------|----------------|
| Chrono Dust | Premium currency for upgrades | 50-300 |
| Time Energy | Gameplay energy | 50-150 |

### 3.2 Item Rewards

| Item | Rarity | Drop Rate | Purpose |
|------|--------|-----------|---------|
| Common Capsule | Common | 100% | Basic artifact acquisition |
| Rare Capsule | Rare | Day 6+ | Better artifact chance |
| Epic Capsule | Epic | Day 7 bonus | Premium reward |

### 3.3 Boosters

| Booster | Duration | Activation |
|---------|----------|------------|
| 2x XP | 30 min | Auto-claim or manual |
| 2x Fragments | 30 min | Auto-claim or manual |
| Energy Efficiency | 1 hour | Auto-claim or manual |

### 3.4 Future Reward Types

| Type | Status | Description |
|------|--------|-------------|
| Artifact Fragments | Planned | Direct fragment rewards |
| Event Items | Planned | Limited-time currencies |
| Profile Cosmetics | Planned | Badges, frames, titles |
| Season Tokens | Future | Season-specific currency |

---

## 4. Streak System

### 4.1 Streak Mechanics

- **Streak Counter**: Increments with each daily claim
- **Streak Display**: Shown on reward calendar header
- **Streak Bonus**: Additional rewards at milestones

### 4.2 Streak Milestones

| Streak | Bonus | Reward |
|--------|-------|--------|
| 7 days | +10% | All rewards boosted |
| 14 days | +20% | Bonus capsule |
| 30 days | +50% | Legendary capsule |
| 100 days | +100% | Exclusive title + frame |

### 4.3 Streak Multipliers

```yaml
streak_bonuses:
  7:
    multiplier: 1.1
    bonus_type: "all_rewards"
    
  14:
    multiplier: 1.2
    bonus_type: "capsule_upgrade"
    
  30:
    multiplier: 1.5
    bonus_type: "legendary_capsule"
    
  100:
    multiplier: 2.0
    bonus_type: "title_frame"
```

---

## 5. Missed Days

### 5.1 Missed Day Behavior

- **Streak Reset**: Missing one day resets streak to 0
- **Progress Continuation**: Day progress does NOT reset
- **Recovery**: Players continue from their current cycle day
- **Notification**: Players notified of streak loss via Telegram

### 5.2 Streak Protection (Future)

Premium system to protect streaks:

| Protection Type | Cost | Effect |
|------------------|------|--------|
| Single Use | 50 Chrono Dust | Protects 1 missed day |
| Weekly Shield | 200 Chrono Dust | Protects entire week |
| Monthly Shield | 500 Chrono Dust | Full month protection |

### 5.3 Grace Period

- 24-hour grace period after missed day (configurable)
- Warning notification 2 hours before grace expires
- Streak shield prompt during grace period

---

## 6. First Day Experience

### 6.1 New Player Reward

New players immediately receive Day 1 reward upon:
- Completing tutorial
- First login (if tutorial skipped)
- Account creation

### 6.2 First Week Acceleration

| Day | New Player Bonus | Standard |
|-----|-----------------|----------|
| 1 | 100 Energy | 50 Energy |
| 2 | 200 Chrono Dust | 100 Chrono Dust |
| 3 | 2 Common Capsules | 1 Common Capsule |

### 6.3 Welcome Flow

```
New Player Login
        │
        ▼
┌─────────────────────────┐
│ Welcome Modal           │
│ "Your first reward!"    │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Claim Day 1 Reward      │
│ (Accelerated for new)   │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Show Reward Calendar    │
│ Highlight Day 2         │
└─────────────────────────┘
```

---

## 7. Notifications

### 7.1 Telegram Bot Integration

The Telegram bot sends reminder notifications:

| Notification | Timing | Content |
|--------------|--------|---------|
| Reward Available | 9:00 AM local | "Your daily reward is ready!" |
| Streak Warning | 8:00 PM local | "Don't forget to claim today!" |
| Grace Period | 11:00 PM local | "Last chance! Streak at risk." |
| Streak Lost | 12:00 AM | "Streak reset. Start fresh tomorrow!" |

### 7.2 Notification Preferences

Players can configure:
- Enable/disable notifications
- Preferred reminder time
- Notification frequency
- Sound/vibration settings

### 7.3 Push Notification Content

```
┌─────────────────────────────────────┐
│ 🏛️ Jolt Time                        │
│                                     │
│ ⚡ Your daily reward awaits!        │
│                                     │
│ Day 3: 1 Common Capsule            │
│ 🔥 Streak: 5 days                  │
│                                     │
│ [Claim Now]                         │
│                                     │
│ ─────────────────────────────       │
│ Tap to open • Mute                 │
└─────────────────────────────────────┘
```

---

## 8. AdsGram Integration

### 8.1 Business Model

Jolt Time uses **AdsGram** as the primary monetization platform:
- Rewarded video ads for bonus rewards
- Banner ads for free players
- Interstitial ads between sessions

### 8.2 Optional Ad Rewards

Daily rewards may include optional ad viewing for bonus:

| Standard Reward | With Ad Bonus | Ad Required |
|-----------------|---------------|-------------|
| 100 Chrono Dust | 200 Chrono Dust | Watch ad |
| 1 Common Capsule | 1 Rare Capsule | Watch ad |
| Day 7 Chest | Enhanced Chest | Watch ad |

### 8.3 Ad Placement Rules

- **Always Optional**: Watching ads is never required
- **No Pay-to-Claim**: Standard rewards always available
- **Fair Value**: Ad bonus ≈ 2x standard reward
- **Daily Limit**: Max 3 ad bonuses per day
- **Frequency Capping**: No more than 1 ad per hour

### 8.4 Ad Integration Flow

```
Reward Available
        │
        ▼
┌─────────────────────────┐
│ [Claim Reward]          │
│ [📺 Watch Ad for 2x]   │
└─────────────────────────┘
        │
        ├─── Claim Standard
        │       │
        │       ▼
        │   Reward Applied
        │
        ▼
┌─────────────────────────┐
│ Open AdsGram SDK        │
│ Play Rewarded Video     │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Bonus Applied           │
│ "2x Reward Claimed!"   │
└─────────────────────────┘
```

---

## 9. Future Support

### 9.1 Seasonal Reward Calendars

Extended cycles for seasonal events:

| Type | Duration | Rewards | Special |
|------|----------|---------|---------|
| Monthly | 30 days | Escalating | Unique currency |
| Seasonal | 8 weeks | Tiered | Season artifact |
| Anniversary | 14 days | Mega rewards | Exclusive items |

### 9.2 Event Calendars

Event-specific reward calendars:

```yaml
event_calendar:
  summer_event:
    duration: "July 1-31"
    base_rewards: true
    event_currency: "sun_coin"
    bonus_rewards:
      - day: 7
        reward: "Beach Artifact"
      - day: 14
        reward: "Ocean Artifact"
      - day: 30
        reward: "Summer Legend"
```

### 9.3 Premium Calendars

Subscriber-exclusive reward tiers:

| Tier | Base Rewards | Premium Bonus |
|------|--------------|---------------|
| Free | Standard | None |
| Premium | +25% all | +50% all |
| VIP | +50% all | +100% all |

### 9.4 Anniversary Rewards

Annual celebration rewards:

```
Day 1: Welcome Back Pack
Day 2: 3x Rare Capsules
Day 3: 500 Chrono Dust
Day 4: Exclusive Artifact
Day 5: 2x XP Booster (24h)
Day 6: 1000 Chrono Dust
Day 7: Mythic Capsule
```

### 9.5 Calendar Stacking

Multiple calendars can be active simultaneously:
- Base weekly calendar (always active)
- Seasonal calendar (temporary)
- Premium calendar (subscribers)
- Event calendar (temporary)

---

## 10. UI Requirements

### 10.1 Visual Design

Premium reward calendar design following ui-style.md:

```css
.reward-calendar {
  background: linear-gradient(180deg, #0A0E17 0%, #131B2E 100%);
  min-height: 100vh;
  padding: var(--space-4);
}

.calendar-header {
  text-align: center;
  padding: var(--space-6) 0;
}

.calendar-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.streak-display {
  font-size: 16px;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.streak-fire {
  animation: flicker 1s ease-in-out infinite;
}
```

### 10.2 Calendar Grid

```
┌─────────────────────────────────────┐
│         🏛️ DAILY REWARDS            │
│         🔥 Streak: 5 days           │
├─────────────────────────────────────┤
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│  │  1  │ │  2  │ │  3  │ │  4  │ │
│  │ ⚡  │ │ 🪙  │ │ 📦  │ │ 🪙  │ │
│  │ ✅  │ │ ✅  │ │ TODAY│ │ 🔒  │ │
│  └─────┘ └─────┘ └─────┘ └─────┘ │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│  │  5  │ │  6  │ │  7* │ │     │ │
│  │ ⚡  │ │ 💎  │ │ 🏆  │ │     │ │
│  │ 🔒  │ │ 🔒  │ │ 🔒  │ │     │ │
│  └─────┘ └─────┘ └─────┘ └─────┘ │
│                                     │
│  * Weekly Grand Prize               │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [📺 Watch Ad for 2x]              │
│                                     │
│  [ ⭐ CLAIM DAY 3 REWARD ]         │
│                                     │
└─────────────────────────────────────┘
```

### 10.3 Card States

| State | Visual | Interaction |
|-------|--------|-------------|
| Claimed | Checkmark overlay, dimmed | None, show badge |
| Available | Glow effect, pulsing | Claim button active |
| Locked | Silhouette, lock icon | Shows day number |
| Special | Gold border, star badge | Enhanced glow |

### 10.4 Claim Animation

```css
/* Claim button */
.claim-button {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  height: 56px;
  border-radius: var(--radius-lg);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px var(--primary-glow);
  }
  50% {
    box-shadow: 0 0 40px var(--primary-glow);
  }
}

/* Success state */
.claim-success {
  animation: celebrate 0.5s ease-out;
}

@keyframes celebrate {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```

### 10.5 Excitement Elements

- **Particle Effects**: On claim for special rewards
- **Sound Design**: Satisfying claim sound + milestone fanfares
- **Haptic Feedback**: Light vibration on claim
- **Progress Celebration**: Milestone animations at 7, 14, 30 days

---

## 11. Anti-Abuse Requirements

### 11.1 Server-Side Validation

All claims validated server-side:

```javascript
async function validateClaim(userId) {
  // 1. Check last claim timestamp
  const lastClaim = await getLastClaimDate(userId);
  if (isSameDay(lastClaim, now)) {
    throw new Error('ALREADY_CLAIMED');
  }
  
  // 2. Verify user exists and is active
  const user = await getUser(userId);
  if (!user || user.banned) {
    throw new Error('INVALID_USER');
  }
  
  // 3. Check for timezone manipulation
  const claimHistory = await getClaimHistory(userId);
  if (detectTimezoneAbuse(claimHistory)) {
    throw new Error('ABUSE_DETECTED');
  }
  
  return true;
}
```

### 11.2 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| GET /calendar | 60 | Per minute |
| POST /claim | 10 | Per minute |
| GET /history | 30 | Per minute |

### 11.3 Fraud Detection

- Multiple accounts from same device
- Suspicious claim timing patterns
- Timezone rapid changes
- VPN/proxy detection
- Automated claim attempts

### 11.4 Duplicate Prevention

```
Database Constraint:
UNIQUE(user_id, claim_date)
```

- Database-level unique constraint
- Race condition handling with transactions
- Optimistic locking on claim operations
- Rollback on duplicate detection

### 11.5 Audit Logging

Every claim logged with:
- Timestamp (UTC)
- User ID
- IP address
- Device fingerprint
- Reward claimed
- Streak at time of claim
- Server-side validation result

---

## 12. Data Schema

### 12.1 Reward Template

```json
{
  "dailyRewards": [
    {
      "dayNumber": 1,
      "rewards": [
        { "type": "energy", "amount": 50 }
      ],
      "isSpecial": false,
      "adBonus": { "type": "energy", "amount": 50 }
    }
  ]
}
```

### 12.2 User Progress

```json
{
  "userId": "string",
  "currentDay": 3,
  "currentStreak": 5,
  "highestStreak": 12,
  "lastClaimDate": "2026-06-23",
  "totalClaims": 45,
  "protectedDays": 0,
  "calendars": {
    "weekly": { "currentDay": 3 },
    "seasonal": { "day": 12, "active": false }
  }
}
```

### 12.3 Claim History Entry

```json
{
  "claimId": "string",
  "userId": "string",
  "dayNumber": 3,
  "calendarType": "weekly",
  "streakAtClaim": 5,
  "rewards": [
    { "type": "capsule", "rarity": "common", "count": 1 }
  ],
  "adBonusClaimed": false,
  "claimedAt": "2026-06-23T09:15:00Z"
}
```

---

## 13. API Endpoints

### 13.1 Get Calendar

```
GET /api/v1/daily-rewards/calendar

Response: {
  "calendarType": "weekly",
  "rewards": [...],
  "currentDay": 3,
  "canClaimToday": true,
  "streak": 5,
  "nextClaimTime": "2026-06-24T00:00:00Z"
}
```

### 13.2 Claim Reward

```
POST /api/v1/daily-rewards/claim

Body: { "watchAd": false }

Response: {
  "success": true,
  "rewards": [...],
  "newStreak": 6,
  "bonusApplied": false
}
```

### 13.3 Get History

```
GET /api/v1/daily-rewards/history?limit=30

Response: {
  "claims": [...]
}
```

---

## 14. Related Documents

- [Energy System](./energy-system.md) - Energy rewards
- [Quests](./quests.md) - Quest rewards
- [UI Style Guide](../.openhands/knowledge/ui-style.md) - Visual design system
- [Social System](./social-system.md) - Streak sharing features

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
