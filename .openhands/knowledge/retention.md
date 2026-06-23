# Jolt Time — Retention Systems

## Overview

Retention systems keep players engaged without being annoying. The goal is high retention through meaningful content, not aggressive notifications or manipulative mechanics.

---

## Retention Philosophy

### Core Principles

1. **Value Over Manipulation** — Rewards feel earned, not coerced
2. **Respect Time** — Players can enjoy game in short sessions
3. **Positive Framing** — Never punish players for breaks
4. **Content-Driven** — Interesting content keeps players, not tricks
5. **User Control** — Players choose their engagement level

### Anti-Predatory Design

❌ **Never Do:**
- Streak loss threats
- Artificial urgency
- Fear-of-missing-out manipulation
- Pay-to-continue mechanics
- Energy that blocks gameplay for hours

✅ **Always Do:**
- Welcoming return messages
- Catch-up mechanics for absentees
- Multiple engagement paths
- Meaningful rewards
- Player-controlled notifications

---

## Retention Mechanics

### 1. Push Notifications (Telegram Bot)

#### Notification Types

| Notification | Content | Frequency | User Control |
|--------------|---------|-----------|--------------|
| Daily Reminder | "Your daily reward is waiting!" | 1/day | On/Off |
| Streak at Risk | Never sent | — | — |
| Event Start | "New event begins today!" | Per event | On/Off |
| Event End Warning | "Event ends in 24h!" | 1/event | On/Off |
| Community Goal | "Goal reached! Claim reward" | Per milestone | On/Off |
| Friend Activity | "A friend sent you a gift!" | On activity | On/Off |
| New Content | "New artifacts available!" | Per content | On/Off |

#### Notification Philosophy

```
GOOD NOTIFICATIONS:
• "Your daily capsule is ready!"
• "Egypt Week starts today!"
• "Your friend sent you a gift!"
• "New artifact discovered!"

NEVER SEND:
• "YOUR STREAK IS ABOUT TO END!!!"
• "You haven't played in X days!"
• "Come back or lose everything!"
• "Your rivals are passing you!"
```

#### Notification Settings Screen

```
┌─────────────────────────────────────┐
│     🔔 NOTIFICATION SETTINGS        │
├─────────────────────────────────────┤
│                                     │
│  DAILY ENGAGEMENT:                   │
│  [✓] Daily reward reminder           │
│      Time: [08:00 ▼]                │
│                                     │
│  [✓] Weekend bonus alert            │
│                                     │
│  EVENTS:                             │
│  [✓] Event start notifications      │
│  [ ] Event end warnings              │
│                                     │
│  SOCIAL:                             │
│  [✓] Gift notifications             │
│  [ ] Friend milestone alerts        │
│                                     │
│  NEW CONTENT:                        │
│  [ ] New artifact alerts            │
│  [ ] Season update notices          │
│                                     │
│  QUIET HOURS:                        │
│  [✓] Enabled                         │
│  From: [22:00] To: [08:00]           │
│                                     │
│  [ SAVE SETTINGS ]                  │
└─────────────────────────────────────┘
```

---

### 2. Daily Rewards

**Purpose:** Give players a reason to return daily

**Design:**
- Streak-based rewards that increase over time
- Missing a day starts fresh but preserves bonus level
- Every 7th day is special (Rare Capsule)
- Return players get boosted rewards

**Reward Structure:**
```
Day 1-6:   Progressive XP + Chrono Dust
Day 7:     Bonus Capsule (Rare guaranteed)
Day 8+:    Cycle continues, bonus level preserved
```

---

### 3. Weekly Rewards

**Purpose:** Encourage mid-week engagement

**Friday Bonus:**
- Double weekend XP
- Enhanced capsule luck
- Free mission skip

**Weekly Capsule:**
- Available every Monday
- Based on previous week's activity
- Uncommon+ guaranteed

---

### 4. Streak Bonuses

**Purpose:** Reward consistent play

**Benefits by Streak Level:**
- XP bonus increases with streak
- Energy regeneration bonus
- Special capsules at milestones
- Exclusive badges and titles

**Streak Protection:**
- Grace periods scale with streak
- Temporal Shields available as safety net
- Recovery mechanics are forgiving

---

### 5. New Artifact Releases

**Purpose:** Give collectors reasons to return

**Release Cadence:**
- 5-10 new artifacts per season
- Preview before release
- Launch events accompany releases
- Collection events boost specific eras

**Marketing:**
- New artifact notifications (optional)
- Discovery moments celebrated
- Social sharing encouraged

---

### 6. Limited-Time Events

**Purpose:** Create urgency through exclusivity

**Event Types:**
- Weekend bonuses (every weekend)
- Historical events (monthly)
- Seasonal events (quarterly)
- Anniversary events (yearly)

**Design Principles:**
- All rewards are cosmetic
- Achievable without spending
- Multiple difficulty levels
- No FOMO pressure

---

### 7. Seasonal Content

**Purpose:** Major content updates that reset engagement

**Season Structure:**
```
8-Week Season:
├── Week 1-2: New content launch
├── Week 3-4: Event #1
├── Week 5-6: Event #2 + Mid-season
├── Week 7-8: Final event + Season end
└── Season Reset: New season begins
```

**Seasonal Rewards:**
- Season track with free + premium tiers
- Exclusive season cosmetics
- Competitive leaderboards
- Community goals

---

## Retention Metrics

### Key Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| D1 Retention | >50% | Players returning day 1 |
| D7 Retention | >25% | Players returning day 7 |
| D30 Retention | >10% | Players returning day 30 |
| Avg Session | >5 min | Average daily playtime |
| Sessions/Day | 1.5-2 | Average daily sessions |
| Streak Avg | >14 days | Average streak length |

### Retention Benchmarks

```
Industry Average:
- D1: 35-45%
- D7: 15-20%
- D30: 5-8%

Jolt Time Target:
- D1: 50%+
- D7: 25%+
- D30: 12%+
```

---

## Engagement Optimization

### Session Design

**Quick Session (< 5 min):**
- Collect daily reward
- Open free capsule
- Complete 1-2 daily missions
- Send/receive gifts

**Medium Session (5-15 min):**
- All of the above
- Explore an era
- Complete more missions
- Check event progress

**Long Session (15+ min):**
- All of the above
- Deep era exploration
- Collection management
- Social interaction

### Optimal Daily Touchpoints

```
Morning (Optional):
├── Notification: "Daily reward waiting"
└── Quick: 1-2 minutes

Afternoon (Optional):
├── Notification: "Weekend bonus active!"
└── Medium: 5-10 minutes

Evening (Optional):
├── Social: Gift exchange
└── Quick: 1-2 minutes
```

---

## Notification Strategy

### Smart Notification System

**Principles:**
1. **Value-First** — Notifications offer value, not threats
2. **Respectful** — Never manipulative or urgent
3. **Controllable** — Full user control always
4. **Limited** — Max 3 notifications per day
5. **Timing** — User-configurable delivery time

### Notification Triggers

| Trigger | Message | Priority |
|---------|---------|----------|
| Daily reset | "Your daily reward is ready!" | Normal |
| Weekend start | "Weekend bonuses are active!" | Normal |
| Event start | "New event: [Name]" | Normal |
| Event ending | "24 hours left in [Event]" | Low |
| Community goal | "Goal reached! Claim reward" | Normal |
| Friend gift | "[Friend] sent you a gift!" | Normal |
| New content | "New artifacts discovered!" | Normal |
| Season start | "New season begins!" | High |

### Do Not Send

```
🚫 NEVER:
• "Your streak ends in X hours!"
• "You're losing your progress!"
• "Your friends are ahead of you!"
• "You're missing out!"
• "Come back or else!"
• Countdown pressure notifications
```

---

## Return Player Experience

### Welcome Back Flow

```
Player Returns After 3+ Days:
     │
     ▼
┌─────────────────────────────────────┐
│  WELCOME BACK!                      │
│                                     │
│  You were missed, Time Keeper!      │
│                                     │
│  Your streak bonus (+25% XP)        │
│  is still intact!                   │
│                                     │
│  While you were away:               │
│  • Egypt Week happened              │
│  • New artifacts discovered        │
│  • Community goal reached!         │
│                                     │
│  [ CONTINUE ADVENTURE ]             │
└─────────────────────────────────────┘
```

### Catch-Up Mechanics

**For Extended Absences (7+ days):**
- Streak bonus preserved
- Missed daily rewards converted to "Welcome Back" chest
- New content highlighted
- No penalty or shame

---

## Anti-Churn Design

### Preventing Uninstalls

**Early Warning Signs:**
- Decreased daily sessions
- Shorter playtime
- Missed daily rewards
- No weekend login

**Intervention (Positive):**
```
Player shows warning signs:
     │
     ▼
┌─────────────────────────────────────┐
│  WE MISS YOU!                       │
│                                     │
│  Something new awaits you:          │
│  • Welcome Back Chest               │
│  • Double XP weekend               │
│  • New artifacts to discover       │
│                                     │
│  Your progress is safe.             │
│                                     │
│  [ COME BACK WHEN READY ]          │
└─────────────────────────────────────┘
```

**Note:** This notification is only sent after 7+ days of inactivity, not as pressure.

---

## Social Retention

### Friend Features

- **Gift Exchange:** Daily gift sending
- **Helper System:** Send energy to friends
- **Leaderboards:** Optional competitive view
- **Compare Progress:** See friend collections

### Community Features

- **Guild System:** Join guilds with goals
- **Community Goals:** Collective achievements
- **Global Events:** Everyone contributes
- **Shared Rewards:** Event bonuses unlocked together

---

## Retention Dashboard (Admin)

### Metrics to Monitor

```yaml
retention_dashboard:
  daily_active_users: DAU
  retention_curves: D1, D7, D30
  session_duration: avg_minutes
  sessions_per_user: avg_per_day
  notification_open_rate: percentage
  event_participation: percentage
  
  alerts:
    d1_below_40: warning
    d7_below_15: warning
    notification_opt_outs_increasing: warning
```

---

## Compliance & Ethics

### Player-First Principles

1. **No Dark Patterns**
   - No fake close buttons
   - No countdown timers pressuring purchases
   - No hidden subscription cancellations
   - No misleading "free" offers

2. **Transparent Systems**
   - Clear reward probabilities
   - Visible streak status
   - Honest event requirements

3. **Healthy Gaming**
   - Reminders to take breaks
   - No "infinite" loops
   - Session time awareness

4. **Data Privacy**
   - Notification preferences respected
   - No spam
   - Easy opt-out

---

## Technical Implementation

### Notification Service

```yaml
notification_service:
  delivery:
    telegram_bot: primary
    push_fallback: false
    
  rate_limiting:
    max_per_day: 3
    max_per_event: 5
    quiet_hours: respected
    
  personalization:
    based_on_playstyle: true
    based_on_era_progress: true
    based_on_friends: true
    
  tracking:
    sent: logged
    delivered: confirmed
    opened: tracked
    clicked: tracked
```

---

## Success Criteria

### Healthy Retention

```
✓ D1 Retention > 50%
✓ D7 Retention > 25%
✓ Average session > 5 minutes
✓ Notification opt-out < 10%
✓ Player-reported satisfaction > 4/5
✓ Zero predatory mechanics detected
```

### Warning Signs

```
⚠️ D1 Retention < 40%
⚠️ Notification open rate < 20%
⚠️ Player complaints about notifications
⚠️ Decreasing retention week-over-week
⚠️ High uninstall rate after events
```

---

*Retention is earned through respect, not manipulation. Give players reasons to return, never excuses to fear loss.*
