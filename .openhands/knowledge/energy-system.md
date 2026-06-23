# Energy Systems and Session Balance

## Overview

Jolt Time's energy and resource systems create a sustainable gameplay rhythm that respects player time while encouraging daily engagement. All systems are designed to promote healthy play sessions, prevent addiction, and ensure fairness between free and paying players. Energy acts as a pacing mechanism, not a paywall — players can progress meaningfully within free limits, with optional convenience enhancements through AdsGram.

---

## 1. Main Energy System

The primary energy resource governs core gameplay activities. Energy regenerates automatically over time, encouraging daily returns without punishing players who cannot play continuously throughout the day.

### Energy Specifications

| Property | Base Value | Description |
|----------|-----------|-------------|
| Maximum Capacity | 100 energy | Full energy tank |
| Regeneration Rate | 1 energy per 3 minutes | 20 energy per hour |
| Full Regeneration Time | 5 hours | Time to fill from empty |
| Starting Energy | 100 energy | Full tank on new account |

### Energy Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ ENERGY                                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ████████████████████░░░░░░░░░  80/100                          │
│                                                                 │
│  ⏱️ Full in: 1h 00m                                            │
│                                                                 │
│  Regenerates: +1 every 3 minutes                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Energy Usage by Activity

| Activity | Energy Cost | Notes |
|----------|------------|-------|
| Story Battle (Easy) | 5 energy | Early game content |
| Story Battle (Medium) | 10 energy | Mid game content |
| Story Battle (Hard) | 15 energy | Late game content |
| Story Battle (Legendary) | 20 energy | End game content |
| PvP Arena Battle | 15 energy | Competitive mode |
| Expedition (Short) | 8 energy | 30-minute expedition |
| Expedition (Long) | 15 energy | 2-hour expedition |
| Quest (Daily) | 0 energy | Free to attempt |
| Quest (Weekly) | 0 energy | Free to attempt |
| Special Event Battle | 10 energy | Varies by event |

### Level-Based Energy Increases

Player level increases maximum energy capacity, rewarding long-term progression:

| Player Level | Max Energy | Bonus Over Base |
|-------------|-----------|----------------|
| 1-10 | 100 | +0 |
| 11-20 | 110 | +10 |
| 21-30 | 125 | +25 |
| 31-40 | 140 | +40 |
| 41-50 | 160 | +60 |
| 51-60 | 180 | +80 |
| 61-70 | 200 | +100 |
| 71-80 | 220 | +120 |
| 81-90 | 240 | +140 |
| 91-100 | 260 | +160 |
| 100+ | 260 | Cap (no additional increase) |

### Energy Cost Scaling

As players progress, energy costs increase but so does capacity and regeneration efficiency:

- **Higher difficulty battles** cost more energy
- **Level-based bonuses** provide net positive energy efficiency for dedicated players
- **Weekend bonuses** reduce all energy costs by 20% (Saturday/Sunday)

---

## 2. Secondary Resources

Secondary resources complement the main energy system, providing specific access to game modes and limiting engagement in particular activities.

### Arena Tickets

Arena Tickets grant access to competitive PvP battles. They regenerate daily to ensure fair competitive access.

| Property | Value |
|----------|-------|
| Maximum Storage | 5 tickets |
| Daily Regeneration | 5 tickets (midnight UTC) |
| Cost per Battle | 1 ticket |
| Excess Handling | Old tickets preserved, cap prevents overflow |

```
┌─────────────────────────────────────────────────────────────────┐
│  🏟️ ARENA TICKETS                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ⚫ ⚫ ⚫ ⚫ ⚫          5/5 available                           │
│                                                                 │
│  ✦ Next ticket: Tomorrow at 00:00 UTC                          │
│                                                                 │
│  [ENTER ARENA]                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Expedition Keys

Expedition Keys unlock time-gated exploration activities. Keys regenerate on a slower schedule than energy.

| Property | Value |
|----------|-------|
| Maximum Storage | 3 keys |
| Regeneration Rate | 1 key per 8 hours |
| Full Regeneration | 24 hours (from empty) |
| Cost per Expedition | 1 key |
| Overflow Protection | Keys queue up to 1 bonus key beyond max |

### Event Tokens

Event Tokens are season-specific currencies earned through gameplay and spent on event content.

| Property | Value |
|----------|-------|
| Maximum Storage | 500 tokens |
| Earning Methods | Events, daily quests, achievements |
| Expiration | End of event/season |
| Overflow Handling | Converted to alternative reward at cap |

### Daily Special Currency

Limited daily resources that reset each day:

| Resource | Max | Regeneration | Purpose |
|----------|-----|--------------|---------|
| Free Battles | 10 | Midnight UTC | Encourage daily PvP |
| Free Quests | Unlimited | — | Core quests always free |
| Daily Challenge Tokens | 3 | Midnight UTC | Premium daily content |
| Friend Gifts | 5 per friend | Midnight UTC | Social engagement |

---

## 3. Daily Limits

Daily limits cap maximum engagement in specific activities, promoting healthy play sessions and preventing burnout.

### Daily Battle Limits

| Battle Type | Daily Limit | Energy Cost | Notes |
|-------------|------------|------------|-------|
| PvP Arena | 10 free | 15 energy | Encourages daily return |
| Story Battles | Unlimited | Energy-gated | No hard cap |
| Event Battles | 20 | 10 energy | Varies by event |
| Practice Battles | Unlimited | 0 energy | Training mode |

### Daily Limit Display

```
┌─────────────────────────────────────────────────────────────────┐
│  TODAY'S LIMITS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🏟️ Arena Battles          7/10 remaining                      │
│  ⚔️ Event Battles          20/20 available                    │
│  🎯 Daily Challenges        2/3 available                       │
│                                                                 │
│  ✦ Limits reset at 00:00 UTC                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Session Play Guidelines

**Maximum Recommended Daily Play:**
- **Core gameplay:** 30-60 minutes (energy-sufficient)
- **Full engagement:** 60-90 minutes (all activities)
- **Completionist play:** 90-120 minutes (all dailies + some extras)

**Anti-Addiction Measures:**
- No forced break timers (unlike some competitive games)
- Clear time display for regeneration
- "You've played enough today" prompt after 2 hours
- Suggestion to complete tomorrow's dailies after exhausting today's

### Weekly Caps

Some resources have weekly caps to prevent excessive grinding:

| Resource | Weekly Cap | Purpose |
|----------|-----------|---------|
| Competitive Points | 10,000 | Prevent rating farming |
| Artifact Fragments (from battles) | 500 | Maintain collection pacing |
| Museum Points | 2,000 | Sustainable progression |

---

## 4. Offline Progress Rules

When players are absent, Jolt Time continues to progress — energy regenerates, timers advance, and rewards accumulate within limits.

### Offline Energy Regeneration

| Offline Duration | Energy Restored | Notes |
|-----------------|----------------|-------|
| 1-8 hours | Full regeneration | Normal offline period |
| 8-24 hours | Full + bonus 20% | Extended absence bonus |
| 24-72 hours | Full + bonus 50% | Long-term absence |
| 72+ hours | Maximum offline bonus | Capped at 2x regeneration |

**Offline Bonus Formula:**
```
Offline Energy = min(MaxEnergy, (OfflineHours × 20) × BonusMultiplier)
BonusMultiplier: 1.0 (0-8h), 1.2 (8-24h), 1.5 (24-72h), 2.0 (72h+)
```

### Offline Timer Continuation

| Timer Type | Offline Behavior |
|-----------|-----------------|
| Energy Regeneration | Continues during offline |
| Expedition Completion | Completes on server, rewards queued |
| Daily Limits | Reset at UTC midnight regardless of login |
| Weekly Limits | Reset Monday 00:00 UTC regardless of login |
| Seasonal Timers | Continue during offline |
| Event Timers | Continue during offline (respect event end dates) |

### Offline Rewards Queue

When players return after being offline:

```
┌─────────────────────────────────────────────────────────────────┐
│  👋 WELCOME BACK, TIMETRAVELER!                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  While you were away:                                            │
│                                                                 │
│  ⚡ Energy restored: +80 (now 100/100)                           │
│  🏆 Daily rewards: Ready to claim!                              │
│  ⚔️ 2 Expeditions completed: 150 Coins + 3 Fragments            │
│  🎁 Daily streak: Preserved (Day 15)                            │
│                                                                 │
│  [CLAIM REWARDS]                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Offline Grace Period

| Feature | Grace Period | After Grace |
|---------|-------------|-------------|
| Daily Streak | 48 hours | Streak maintained, reduced bonus |
| Login Streak Protection | 24 hours | No penalty |
| Event Participation | Until event ends | Rewards forfeited |
| Seasonal Rewards | Until claimed | Auto-claimed after 7 days |

---

## 5. Bonus Energy Sources

Bonus energy sources provide supplementary energy beyond natural regeneration, encouraging engagement through various activities.

### Login Rewards

Energy bonus from daily login streak:

| Streak Day | Energy Bonus |
|-----------|-------------|
| 1-6 | +5 energy |
| 7-13 | +10 energy |
| 14-29 | +15 energy |
| 30-59 | +25 energy |
| 60-99 | +35 energy |
| 100+ | +50 energy |

### Achievement Bonuses

One-time achievement rewards include energy bonuses:

| Achievement | Energy Reward |
|------------|--------------|
| First Victory | +20 energy |
| 10 Battle Wins | +30 energy |
| Complete First Era | +50 energy |
| Reach Level 10 | +40 energy |
| 50 Quests Completed | +25 energy |

### Event Energy Boosts

During special events, energy bonuses may be active:

| Event Type | Energy Bonus |
|-----------|-------------|
| Holiday Events | +50% max energy |
| Weekend Events | +25% energy regeneration |
| Anniversary Event | +100 energy flat bonus |
| Community Goals | Variable bonuses |

### AdsGram Bonus Energy

Watching AdsGram ads provides optional energy bonuses:

| Ad Type | Energy Reward | Frequency |
|---------|--------------|----------|
| Standard Rewarded Ad | +20 energy | 5 per day |
| Enhanced Daily Pack Ad | +10 energy bonus | 1 per day |
| Event Bonus Ad | +30 energy | 1 per day |
| First Win of Day Ad | +50% battle energy back | 1 per battle |

**AdsGram Rules:**
- All ad rewards are optional and never required
- No ads required for meaningful progression
- Player-initiated only (never forced)
- Clear messaging: "Watch ad for bonus energy"
- One-click dismiss option always available

---

## 6. Cooldown Systems

Cooldowns prevent spam, create strategic decisions, and pace engagement. Different activities have different cooldown periods.

### PvP Arena Cooldowns

| Action | Cooldown | Notes |
|--------|---------|-------|
| After Battle (Win) | 30 seconds | Prevents battle-spam |
| After Battle (Loss) | 10 seconds | Encourages retry |
| After 5 consecutive losses | 5 minutes | Break reminder |
| Ticket regeneration | 24 hours | Full daily refresh |
| Season soft reset | 12 weeks | Rating reduction |

### Expedition Cooldowns

| Expedition Type | Duration | Cooldown Between Expeditions |
|----------------|----------|---------------------------|
| Short Expedition | 30 minutes | None (parallel allowed) |
| Long Expedition | 2 hours | None (parallel allowed) |
| Special Expedition | 4 hours | 1 hour before next |
| Boss Expedition | 24 hours | 24 hours between attempts |

### Special Boss Cooldowns

Weekly bosses and special encounters have longer cooldowns:

| Boss Type | Cooldown | Attempts per Week |
|-----------|---------|------------------|
| Era Boss | 7 days | 1 |
| World Boss | 3 days | 2 |
| Challenge Boss | 24 hours | 3 |
| Community Boss | Event-based | Event rules |

### Cooldown Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ ARENA BATTLE                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ⏱️ Cooldown: 00:28 remaining                                    │
│                                                                 │
│  Your last battle ended 32 seconds ago.                         │
│  Next battle available in 28 seconds.                           │
│                                                                 │
│  [WAIT]  [PRACTICE MODE]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cooldown Reduction

Certain bonuses can reduce cooldowns:

| Reduction Source | Effect |
|----------------|--------|
| Premium Subscription | -20% all cooldowns |
| Achievement Bonus | -10% specific cooldowns |
| Event Bonus | Variable (displayed in event) |
| AdsGram Ad | -50% next cooldown (1x daily) |

---

## 7. Overflow Protection

Overflow protection ensures players never lose rewards due to full storage. All resource types have overflow handling.

### Energy Overflow

| Scenario | Handling |
|---------|---------|
| Energy at max, time passes | Regeneration pauses, no waste |
| Energy at max, receive bonus | Bonus queued, applied when space available |
| Long offline, would exceed max | Capped at max, notified of lost time |

**No Energy Waste Policy:**
> Energy regeneration stops at maximum capacity. When you return, you'll have a full tank — no regeneration time is lost forever.

### Secondary Resource Overflow

| Resource | Overflow Handling |
|---------|------------------|
| Arena Tickets | Cap at 5, no regeneration until used |
| Expedition Keys | 1 bonus key overflow, then stop |
| Event Tokens | Convert to coins at 10% rate |
| Daily Tokens | Expire at midnight, no overflow |
| Weekly Rewards | Auto-claim or expire |

### Overflow Prevention UI

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ STORAGE ALMOST FULL                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Arena Tickets: 5/5                                             │
│  ⚠️ You've reached maximum. Use tickets to avoid waste.          │
│                                                                 │
│  Event Tokens: 480/500                                           │
│  ⚠️ Claim rewards soon to avoid overflow.                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Automatic Overflow Handling

| Resource Type | Automatic Action |
|--------------|----------------|
| Energy | Paused at cap, resumes when spent |
| Arena Tickets | No regeneration until used |
| Expedition Keys | 1 bonus overflow, then soft cap |
| Fragments | Converted to dust at exchange rate |
| Coins | Never overflow (unlimited storage) |
| XP | Overflow goes to next level bonus pool |

---

## 8. Session Philosophy

Jolt Time's resource systems embody a philosophy of respectful engagement: encourage daily play without demanding excessive time, reward dedication without punishing absence, and provide depth without creating addiction.

### Core Principles

#### Encourage Short Daily Sessions
- Core dailies completable in 15-30 minutes
- Energy naturally limits extended sessions
- Quick-play modes available for 5-minute sessions
- Automatic save/resume for longer content

#### Avoid Addictive Mechanics
- No loot box anxiety or fear-of-missing-out timers
- No "limited time only" pressure for core content
- No streak-breaking threats or panic mechanics
- No variable ratio rewards (gambling mechanics)
- No social pressure mechanics (friend leaderboard notifications)

#### Avoid Excessive Grinding
- Clear progression paths with defined goals
- Weekly caps prevent infinite farming
- Artifact collection bounded (165 total)
- Museum completion has clear endpoint
- Prestige system provides long-term reset

#### Respect Player Time
- Energy regenerates while away
- Offline progress accumulates
- No mandatory daily login (streak preserved with grace)
- Quick-catch-up mechanics for returning players
- No "walls" requiring waiting or spending

### Healthy Session Design

| Session Type | Recommended Duration | Energy/Resource Budget |
|-------------|---------------------|-----------------------|
| Quick Play | 5-15 minutes | 1-3 battles, dailies |
| Standard Session | 15-30 minutes | 5-8 battles, all dailies |
| Extended Session | 30-60 minutes | 10+ battles, extras |
| Weekend Deep Play | 60-120 minutes | Everything available |

### Anti-Addiction Safeguards

| Feature | Implementation |
|---------|---------------|
| No Loss Aversion | Streak loss shown neutrally, not punitively |
| No Social Pressure | Optional leaderboard visibility |
| No Forced Breaks | Players choose when to stop |
| No Spending Pressure | No flash sales or countdowns |
| No Gambling Mechanics | No randomized rewards without pity |

### Casual Player Support

| Player Type | Design Consideration |
|-------------|--------------------|
| Casual (5 min/day) | Can complete daily quests, maintain streak |
| Regular (15-30 min/day) | Full progression, competitive in casual modes |
| Dedicated (60+ min/day) | All content accessible, arena competitive |
| Completionist | Endgame depth through collection/museum |

---

## 9. Telegram Bot Notifications

Telegram bot notifications inform players about resource availability, cooldowns, and opportunities — without becoming spam.

### Notification Types

| Notification | Trigger | Message Example |
|--------------|---------|-----------------|
| Energy Full | Energy reaches maximum | "⚡ Your energy is fully restored! Ready for 5-10 battles." |
| Expedition Ready | Long expedition completes | "🗺️ Your 2-hour expedition is complete! Claim rewards." |
| Cooldown Finished | Arena cooldown ends | "🏟️ Arena cooldown complete. Ready for your next battle!" |
| Event Available | New event starts | "🎉 Spring Festival begins! Extra rewards await." |
| Ticket Regenerated | Arena tickets refresh | "🏟️ 5 new Arena tickets ready! Climb the rankings." |
| Key Regenerated | Expedition key ready | "🗝️ New expedition key available. Explore now!" |
| Resource Cap Warning | Near overflow | "⚠️ Arena tickets at max. Use them before reset!" |

### Notification Frequency Rules

| Resource | Maximum Frequency |
|----------|-----------------|
| Energy Full | 2 per day |
| Expedition Complete | 3 per day |
| Cooldowns | 2 per day |
| Event Alerts | 1 per event (max 2/week) |
| Resource Warnings | 1 per resource (max 3/day) |
| **Total Daily Cap** | **4 notifications** |

### Notification Display Examples

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ ENERGY FULL                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Your energy tank is full at 100/100!                            │
│  Ready for ~6 story battles or 7 arena battles.                 │
│                                                                 │
│  [PLAY NOW]  [Remind in 1h]  [Mute Energy]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────┐
│  🗺️ EXPEDITION COMPLETE                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Your long expedition to Ancient Egypt has returned!             │
│  Reward: 150 Chrono Coins + 2 Rare Fragments                     │
│                                                                 │
│  [CLAIM]  [SEND TO BATTLE]  [Mute Expeditions]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### User Control

- **Global Toggle:** Disable all resource notifications
- **Per-Type Toggle:** Enable/disable specific notification types
- **Quiet Hours:** Set time ranges with no notifications
- **Frequency Cap:** Hard cap of 4 total notifications per day enforced server-side
- **Batch Mode:** Combine similar notifications (e.g., "3 expeditions ready")

---

## 10. AdsGram Integration

AdsGram provides optional convenience bonuses. All ad rewards enhance but never gate gameplay progression.

### Ad Reward Structure

| Ad Type | Resource Bonus | Daily Limit | Mandatory |
|---------|---------------|------------|----------|
| Energy Boost | +20 energy | 5 ads | No |
| Key Boost | +1 expedition key | 2 ads | No |
| Ticket Boost | +3 arena tickets | 1 ad | No |
| Cooldown Skip | -50% next cooldown | 1 ad | No |
| Battle Reward | +50% battle rewards | 1 ad | No |
| Weekend Bonus | +25% all weekend rewards | 1 ad | No |

### AdsGram Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ WATCH & EARN                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Your energy is at 45/100. Watch a short video                  │
│  to restore +20 energy instantly!                               │
│                                                                 │
│  Today: 2/5 ads watched                                         │
│                                                                 │
│  [WATCH VIDEO]                           [MAYBE LATER]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Ad Reward Philosophy

- **Never Required:** All content playable without watching ads
- **Always Optional:** Clear dismiss option on all ad prompts
- **Player-Initiated:** Never auto-play or force viewing
- **Fair Value:** Ad rewards are convenience, not power
- **No Manipulation:** No countdown timers or pressure tactics

### AdsGram and Competitive Integrity

AdsGram bonuses never affect competitive rankings:
- No ads can increase arena rating
- No ads can boost leaderboard position
- No ads can unlock exclusive content
- No ads can bypass skill-based gates

---

## 11. Database Schema Overview

### Key Tables

| Table | Purpose |
|-------|---------|
| `player_energy` | Current energy, max energy, last_update timestamp |
| `player_tickets` | Arena tickets, expedition keys, current counts |
| `player_daily_limits` | Daily battle counts, reset timestamps |
| `player_weekly_caps` | Weekly resource caps, current amounts |
| `cooldowns` | Active cooldowns, expiration times |
| `offline_progress` | Cached offline calculations |
| `notification_preferences` | User notification settings |

### Energy Calculation Formula

```sql
-- Energy calculation (server-side)
current_energy = LEAST(
  max_energy,
  saved_energy + FLOOR((NOW() - last_update) / INTERVAL '3 minutes')
)
```

### Daily Limit Reset

```sql
-- Daily reset check
IF (current_date > last_reset_date) THEN
  reset_daily_limits()
  set_last_reset_date(current_date)
END IF
```

---

## 12. Technical Implementation Notes

### Real-Time Updates
- Energy display updates every 30 seconds via WebSocket
- Cooldowns update every second in active battle
- Daily limits update immediately on action

### Offline Calculation
- Server calculates offline gains on login
- Capped at reasonable maximums (no infinite accumulation)
- Clear breakdown shown on return

### Cross-Device Sync
- All resources synced to Supabase in real-time
- No advantage to multi-device play
- Cooldowns enforced server-side

### Performance Considerations
- Energy calculations cached, not recalculated on every query
- Batch updates for daily limit resets
- Background jobs for cooldown expiration
- Efficient indexing on timestamp columns

---

## 13. Session Balance Summary

### Resource Economics

| Activity | Energy Cost | Time Investment | Reward Value |
|----------|-----------|----------------|-------------|
| Quick Battle | 5-10 | 2-3 min | Low-Med |
| Standard Battle | 15 | 3-5 min | Medium |
| Expedition | 8-15 | 30-120 min wait | Medium-High |
| Daily Quests | 0 | 10-15 min | High |
| Weekly Quests | 0 | 20-30 min | Very High |
| Event Content | 10 | 5-10 min | Varies |

### Progression Pacing

| Player Level | Max Energy | Daily Battles | Weekly Progression |
|-------------|-----------|--------------|-------------------|
| 1-10 | 100 | ~20 | Fast learning |
| 11-20 | 110 | ~22 | Steady growth |
| 21-30 | 125 | ~25 | Building depth |
| 31-40 | 140 | ~28 | Mid-game |
| 41-50 | 160 | ~32 | Advanced |
| 51-60 | 180 | ~36 | Expert |
| 61-70 | 200 | ~40 | Master |
| 71-80 | 220 | ~44 | Elite |
| 81-90 | 240 | ~48 | Top tier |
| 91-100 | 260 | ~52 | Endgame |

### Balance Philosophy

Jolt Time's energy system ensures:
1. **Meaningful sessions** — Each battle matters, energy is valuable
2. **Healthy limits** — Natural stopping points, no forced marathon
3. **Fair access** — Free players progress well within daily limits
4. **Optional enhancement** — AdsGram helps but never required
5. **Respect for time** — Offline progress, no punishing absences

---

*Document Version: 1.0*  
*Last Updated: 2025-01-23*
