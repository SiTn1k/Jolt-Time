# Jolt Time — Telegram Bot System

## Overview

The Telegram Bot serves as Jolt Time's primary external touchpoint, functioning as the main bridge between players and the game ecosystem. The bot provides notifications, support, deep links, and engagement features while respecting user attention and time.

**Core Philosophy:**
- The bot should feel like a helpful companion, not a spam machine
- Notifications improve the experience without dominating it
- Every message provides genuine value to the player
- Player preferences and privacy are always respected

**Primary Revenue:** AdsGram remains one of the primary revenue systems for Jolt Time. The bot may occasionally notify players about optional bonus rewards, AdsGram opportunities, and seasonal bonuses. All ads remain optional and never interrupt gameplay.

---

## 1. Bot Responsibilities

### 1.1 Core Responsibilities

The Telegram Bot handles essential player touchpoints outside the Mini App:

| Responsibility | Description | Priority |
|---------------|-------------|----------|
| **Send Notifications** | Timely, valuable alerts about game events | Critical |
| **Deep Link Navigation** | Route players to specific content in Mini App | Critical |
| **Deliver Rewards** | Inform players about completed activities and earned rewards | High |
| **Remind Inactive Players** | Friendly re-engagement without pressure | High |
| **Announce Events** | New seasons, limited events, historical festivals | Medium |
| **Provide Support** | Help commands and issue resolution | Medium |
| **Track Referrals** | Process referral links and deliver rewards | Medium |

### 1.2 Bot Command Set

```
STANDARD COMMANDS:
/start              — Launch game / new user onboarding
/help               — Show available commands and help
/profile            — View player stats summary
/settings           — Notification preferences
/rewards            — View reward history and pending rewards
/referral           — Get personal referral link
/news               — Latest game updates and announcements
/support            — Get help or report issues
/stats              — Detailed player statistics

PREMIUM COMMANDS (Jolt Time Plus):
/plus               — Subscription benefits and management
/showcase          — Featured cosmetics display
```

### 1.3 Bot Welcome Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  🕐 JOLT TIME                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Welcome, Time Keeper!                                          │
│                                                                 │
│  Your temporal journey spans civilizations,                      │
│  collecting artifacts and mastering history.                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │         🚀 LAUNCH JOLT TIME                            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Quick Actions:                                                 │
│  /profile — Your statistics                                     │
│  /rewards — Claim pending rewards                              │
│  /referral — Invite friends                                    │
│                                                                 │
│  🕐 Time awaits. History beckons.                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Deep Link System

Deep links enable notifications and external references to open specific Mini App screens.

### 2.1 Deep Link Formats

| Link Type | Format | Destination | Purpose |
|-----------|--------|-------------|---------|
| Standard Start | `/start` | Main screen | New user onboarding |
| Referral | `/start ref_{userId}` | Main screen | Track referred players |
| Profile | `/start profile` | Player profile | View own profile |
| Missions | `/start missions` | Daily missions | View current quests |
| Events | `/start event_{eventId}` | Specific event | Direct to event |
| Museum | `/start museum` | Museum screen | View artifacts |
| Battle | `/start battle` | Arena screen | Enter combat |
| Shop | `/start shop` | Shop screen | Browse purchases |
| Specific Artifact | `/start artifact_{id}` | Artifact detail | View artifact info |
| Guild | `/start guild_{guildId}` | Guild page | Join/view guild |

### 2.2 Deep Link Processing

```
USER CLICKS DEEP LINK
         │
         ▼
┌─────────────────────────────────────┐
│  PARSE LINK PARAMETERS              │
│                                     │
│  1. Extract command and payload     │
│  2. Validate token/signature        │
│  3. Verify user authentication      │
│  4. Route to appropriate handler    │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  MINI APP LAUNCH                    │
│  Open Mini App with context:        │
│  • ?ref=xxx (referral tracking)     │
│  • ?screen=profile (target screen)  │
│  • ?event=xxx (event context)       │
│  • ?guild=xxx (guild context)       │
└─────────────────────────────────────┘
```

### 2.3 Notification Deep Links

Every notification includes contextual deep links:

```
NOTIFICATION WITH DEEP LINKS:
┌─────────────────────────────────────────────────────────────────┐
│  📜 New Daily Quests Ready!                                      │
│                                                                 │
│  Today's Challenges:                                             │
│  ○ Collect 3 artifacts → +75 XP                                 │
│  ○ Complete 2 missions → +100 XP                                 │
│  ○ Visit Museum → +50 XP                                         │
│                                                                 │
│  [View Quests] → /start missions                                │
│  [Launch Game] → /start                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Notification Categories

Notifications are organized by type, each with specific triggers and value propositions.

### 3.1 Notification Category Matrix

| Category | Trigger | Value | Frequency | Default |
|----------|---------|-------|-----------|---------|
| Daily Reminders | 20+ hours inactive | Reward reminder | 1/day | ON |
| Event Notifications | Event start/end | Participation | Per event | ON |
| Energy Restored | Energy ≥20 after 0 | Play opportunity | Per cycle | ON |
| Expedition Completed | Expedition finishes | Reward delivery | Per completion | ON |
| Arena Rewards | Season ends | Rank rewards | Per season | ON |
| Mission Resets | Daily reset | New content | 1/day | ON |
| Battle Pass Reminders | Tier complete, ending | Progress rewards | Per season | ON |
| Seasonal Announcements | New season | Content reveal | Per season | ON |
| Achievement Unlocks | Milestone reached | Celebration | Per achievement | ON |
| Level Ups | Level gained | Progress celebration | Per level | ON |
| Friend Activity | Friend action | Social engagement | 3/day max | ON |
| AdsGram Opportunities | Ad available | Bonus rewards | Per ad | ON |
| Referral Updates | Friend joins/reward | Referral progress | Per action | ON |

### 3.2 Daily Reminders

**Trigger:** Player hasn't opened Mini App in 20+ hours

```
┌─────────────────────────────────────────────────────────────────┐
│  ⏰ Your Temporal Journey Awaits!                                │
│                                                                 │
│  Time Energy: ████████░░ 80/100                                │
│  Daily Reward: 🎁 Ready to claim!                               │
│  Streak: 🔥 Day 7 (2.0x bonus active!)                          │
│                                                                 │
│  Weekend Bonus: Active! 2x XP this weekend!                     │
│                                                                 │
│  [Continue Your Journey] → /start                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Event Notifications

**Trigger:** Event starts, reaches midpoint, or ending soon

```
EVENT START:
┌─────────────────────────────────────────────────────────────────┐
│  🎭 New Event: "Greek Olympics"                                 │
│                                                                 │
│  Join the ancient Games in Athens!                              │
│  🏛️ Compete in 5 historical challenges                        │
│  🏆 Earn exclusive "Olympic Champion" title                     │
│  🪙 Historical Tokens: 500 available                           │
│                                                                 │
│  Duration: 7 days remaining                                     │
│                                                                 │
│  [Enter Event] → /start event_greek_olympics                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

EVENT ENDING SOON (48h warning):
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ "Greek Olympics" — Final 48 Hours!                          │
│                                                                 │
│  Your Progress: 75%                                              │
│  To guarantee "Olympic Champion": Complete 2 more challenges    │
│                                                                 │
│  Leaderboard closes: Sunday midnight UTC                        │
│                                                                 │
│  [Race for the Title] → /start event_greek_olympics              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Energy Restored Notifications

**Trigger:** Energy restored to 20+ after being depleted

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ Time Energy Restored!                                        │
│                                                                 │
│  Your energy is back — ready for a mission?                      │
│  Current Energy: ████░░░░░░ 40/100                              │
│                                                                 │
│  [Quick Mission] → /start missions                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.5 Expedition Completed Notifications

**Trigger:** Player's expedition completes

```
┌─────────────────────────────────────────────────────────────────┐
│  🏺 Expedition Complete!                                          │
│                                                                 │
│  Your journey to Ancient Egypt has concluded.                    │
│                                                                 │
│  Discovered:                                                    │
│  • Egyptian Scarab (Epic Artifact)                              │
│  • 150 Chrono Dust                                              │
│  • 50 Event Tokens                                              │
│                                                                 │
│  [View Discoveries] → /start museum                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.6 Arena Rewards Notifications

**Trigger:** Arena season ends with rewards to claim

```
┌─────────────────────────────────────────────────────────────────┐
│  🏆 Arena Season Complete!                                       │
│                                                                 │
│  Season 7 Final Rank: Gold III                                    │
│  Peak Rating: 2,340                                              │
│                                                                 │
│  Rewards Earned:                                                │
│  • 500 Chrono Coins                                              │
│  • "Gold Champion" Frame                                         │
│  • Arena Badge                                                   │
│                                                                 │
│  [Claim Rewards] → /start battle                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.7 Mission Reset Notifications

**Trigger:** Daily missions refresh (UTC midnight)

```
┌─────────────────────────────────────────────────────────────────┐
│  📜 New Daily Missions Ready!                                     │
│                                                                 │
│  Today's Challenges:                                             │
│  ○ Collect 3 artifacts → +75 XP                                 │
│  ○ Complete 2 missions → +100 XP                                 │
│  ○ Visit Museum → +50 XP                                         │
│                                                                 │
│  Progress: 0/3 Complete                                          │
│                                                                 │
│  [View Missions] → /start missions                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.8 Battle Pass Reminders

**Trigger:** New tier reached, or season ending soon

```
TIER COMPLETE:
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ Battle Pass: Tier 15 Unlocked!                                │
│                                                                 │
│  New rewards ready to claim:                                    │
│  • 200 Chrono Coins                                              │
│  • Ancient Pyramid Background                                    │
│                                                                 │
│  Season Progress: 15/30 tiers                                   │
│  Days Remaining: 12                                             │
│                                                                 │
│  [Claim & Continue] → /start                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

SEASON ENDING:
┌─────────────────────────────────────────────────────────────────┐
│  📅 Season "Egyptian Gold" Ends in 3 Days!                       │
│                                                                 │
│  Your Progress: 23/30 tiers                                      │
│  Unclaimed: Level 24-25 rewards                                 │
│                                                                 │
│  [Finish Strong] → /start                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.9 Seasonal Announcements

**Trigger:** New season begins

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 NEW SEASON: "Renaissance Awakening"                          │
│                                                                 │
│  8 Weeks of Historical Adventures!                             │
│                                                                 │
│  🎁 FREE Track:                                                 │
│  • New artifacts from Renaissance era                          │
│  • Chrono Dust rewards                                          │
│  • Exclusive frames                                             │
│                                                                 │
│  💎 Premium Track ($4.99):                                       │
│  • Legendary cosmetics                                          │
│  • +20% Season XP boost                                         │
│  • Exclusive badge                                              │
│                                                                 │
│  [Enter Season] → /start                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Inactivity Reminders

Friendly, non-aggressive reminders to return to the game.

### 4.1 Inactivity Tier System

| Inactivity Duration | Message Tone | Focus | Example |
|--------------------|--------------|-------|---------|
| 20-24 hours | Gentle reminder | "Your energy is ready" | "Your expeditions are waiting" |
| 24-48 hours | Friendly nudge | "New content available" | "New rewards are available" |
| 3-7 days | Value reminder | "Here's what's new" | "You missed a great event" |
| 7-14 days | Welcome back | "We miss you" + bonus | "Welcome back package ready" |
| 14-30 days | Grand return | "Special reactivation" | "Legendary welcome back chest" |
| 30+ days | Celebration | "Fresh start" | "New era content awaits" |

### 4.2 Inactivity Message Templates

```
24 HOURS INACTIVE:
┌─────────────────────────────────────────────────────────────────┐
│  🕐 Your Expeditions Are Waiting!                               │
│                                                                 │
│  Time Keeper, your temporal journey continues.                  │
│  Your energy reserves have regenerated.                        │
│                                                                 │
│  [Return to Adventure] → /start                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

48 HOURS INACTIVE:
┌─────────────────────────────────────────────────────────────────┐
│  🎁 New Rewards Are Available!                                   │
│                                                                 │
│  While you were away:                                          │
│  • Weekend bonus event activated                               │
│  • New daily missions ready                                    │
│  • Friend activity waiting                                      │
│                                                                 │
│  [Catch Up] → /start                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

3-7 DAYS INACTIVE:
┌─────────────────────────────────────────────────────────────────┐
│  👋 We Miss You, Time Keeper!                                   │
│                                                                 │
│  A lot has happened in your absence:                           │
│  • Spring Festival concluded (exclusive rewards still claimable)│
│  • 5 new artifacts discovered                                   │
│  • Friend milestones reached                                   │
│                                                                 │
│  Welcome Back Bonus: +100% XP for 24 hours                      │
│                                                                 │
│  [Welcome Back] → /start                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

7-14 DAYS INACTIVE:
┌─────────────────────────────────────────────────────────────────┐
│  🌟 Welcome Back, Time Keeper!                                   │
│                                                                 │
│  Your temporal journey awaits!                                  │
│                                                                 │
│  🎁 Welcome Back Chest:                                         │
│  • 7 Daily Capsules                                             │
│  • 500 Chrono Dust                                             │
│  • Exclusive "Returner" Badge                                   │
│                                                                 │
│  Your streak protection held! (Day 12 bonus intact)            │
│                                                                 │
│  [Claim Welcome Back] → /start                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

30+ DAYS INACTIVE:
┌─────────────────────────────────────────────────────────────────┐
│  🏆 Legendary Welcome Back, Time Keeper!                        │
│                                                                 │
│  The timeline has shifted in your absence.                      │
│  New eras, new challenges, new glory await.                    │
│                                                                 │
│  🎁 Legendary Return Package:                                   │
│  • Epic Capsule                                                 │
│  • 1,000 Chrono Dust                                           │
│  • "Temporal Wanderer" Title                                     │
│  • All missed Battle Pass rewards (free track)                  │
│                                                                 │
│  Fresh start. New adventures. Same journey.                    │
│                                                                 │
│  [Return as a Legend] → /start                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Inactivity Message Principles

```
MESSAGE GUIDELINES:
✅ Always welcoming, never accusatory
✅ Focus on future, not past absence
✅ Preserve earned benefits when possible
✅ Provide value for returning
✅ Respect player's decision to return or not
✅ Never use manipulative language
✅ Never threaten lost progress
✅ Never guilt-trip about absence
```

---

## 5. User Notification Settings

Players maintain full control over their notification experience.

### 5.1 Settings Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  🔔 NOTIFICATION SETTINGS                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Master Toggle: [ON/OFF]                                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  DAILY REMINDERS                                                │
│  [✓] Daily reward reminder                                      │
│  [✓] New missions available                                     │
│  [ ] Energy restored                                            │
│                                                                 │
│  GAME EVENTS                                                    │
│  [✓] Event start/end notifications                              │
│  [✓] Seasonal announcements                                     │
│  [✓] Battle Pass updates                                        │
│                                                                 │
│  PROGRESS                                                       │
│  [✓] Level up notifications                                     │
│  [✓] Achievement unlocks                                        │
│  [✓] Expedition completed                                       │
│  [✓] Arena rewards                                              │
│                                                                 │
│  SOCIAL                                                         │
│  [✓] Friend activity                                            │
│  [✓] Referral updates                                           │
│  [ ] Friend requests                                            │
│                                                                 │
│  OPPORTUNITIES                                                  │
│  [✓] AdsGram bonus rewards                                      │
│  [ ] Flash sales and offers                                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  QUIET HOURS                                                    │
│  [ON] Enabled                                                   │
│  Start: 10:00 PM                                                │
│  End: 8:00 AM                                                   │
│                                                                 │
│  [SAVE SETTINGS]                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Granular Control Options

```yaml
notification_preferences:
  master_toggle:
    enabled: boolean
    description: "Enable/disable all notifications"
    
  daily_reminders:
    daily_reward:
      enabled: boolean
      time: "HH:MM"  # User's local time
    new_missions:
      enabled: boolean
    energy_restored:
      enabled: boolean
      
  events:
    event_start:
      enabled: boolean
    event_ending:
      enabled: boolean
      hours_before: [48, 24, 2]  # Warning times
    seasonal_announcements:
      enabled: boolean
      
  progress:
    level_up:
      enabled: boolean
    achievement:
      enabled: boolean
    expedition_complete:
      enabled: boolean
    arena_rewards:
      enabled: boolean
      
  social:
    friend_activity:
      enabled: boolean
      frequency_limit: 3  # Max per day
    referral_updates:
      enabled: boolean
    friend_requests:
      enabled: boolean
      
  opportunities:
    adsgram_bonus:
      enabled: boolean
    flash_sales:
      enabled: boolean
      
  quiet_hours:
    enabled: boolean
    start: "22:00"
    end: "08:00"
    timezone: "User's timezone"
```

### 5.3 Quick Actions in Notifications

Every notification includes quick settings access:

```
NOTIFICATION WITH SETTINGS:
┌─────────────────────────────────────────────────────────────────┐
│  📜 New Daily Quests Ready!                                      │
│                                                                 │
│  [View Quests] → /start missions                                │
│  [Settings] → /settings                                         │
│  [Mute 24h] → /mute 24                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Reward Delivery Messages

Notifications for completed activities and earned rewards.

### 6.1 Achievement Unlocked

```
┌─────────────────────────────────────────────────────────────────┐
│  🏆 Achievement Unlocked!                                         │
│                                                                 │
│  "Cradle of Civilization"                                       │
│  Complete all Mesopotamia artifacts                             │
│                                                                 │
│  Reward: +500 XP                                                │
│  Badge: "Mesopotamian Scholar"                                   │
│                                                                 │
│  Your journey through time continues.                          │
│                                                                 │
│  [View Collection] → /start museum                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Level Up

```
┌─────────────────────────────────────────────────────────────────┐
│  🎉 LEVEL UP!                                                   │
│                                                                 │
│  Congratulations, Time Keeper!                                   │
│  You've reached Level 25!                                       │
│                                                                 │
│  🆕 New Unlocks:                                                │
│  • Rome Era access                                              │
│  • Epic missions available                                       │
│  • Guild system preview                                         │
│                                                                 │
│  [View Achievements] → /start profile                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Artifact Obtained

```
┌─────────────────────────────────────────────────────────────────┐
│  🏺 Temporal Discovery!                                          │
│                                                                 │
│  A rare artifact has manifested:                                │
│                                                                 │
│  ✨ Egyptian Scarab                                             │
│     Epic • Ancient Egypt                                        │
│                                                                 │
│  "Symbol of rebirth and protection..."                         │
│                                                                 │
│  Fragment: 1/5 collected                                        │
│                                                                 │
│  [View Artifact] → /start artifact_egypt_scarab                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.4 Battle Pass Tier

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ Battle Pass: Tier 20 Reached!                               │
│                                                                 │
│  🆕 Gold Season Frame Unlocked!                                 │
│                                                                 │
│  Season Progress: 20/50 tiers                                   │
│  Days Remaining: 8                                             │
│                                                                 │
│  Next Reward: +300 Chrono Coins                                │
│                                                                 │
│  [View Season] → /start                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Event Rewards

```
┌─────────────────────────────────────────────────────────────────┐
│  🎭 Spring Festival Complete!                                    │
│                                                                 │
│  Your Event Rewards:                                           │
│  • Cherry Blossom Frame (Epic)                                 │
│  • "Eternal Spring" Title                                      │
│  • 500 Spring Tokens (refunded)                                │
│                                                                 │
│  Final Leaderboard: Top 15%                                   │
│                                                                 │
│  [View Rewards] → /start event_spring                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Event Announcements

Notifications for new content and limited-time events.

### 7.1 Event Types and Frequency

| Event Type | Frequency | Notice Lead Time | Notifications |
|------------|-----------|-------------------|---------------|
| New Season | 4x/year | 7 days preview | Start + Day 3 |
| Holiday Event | Per holiday | 3 days preview | Start + Ending |
| Historical Festival | 2-3x/season | 5 days preview | Start + Midpoint |
| Community Event | 2-3x/season | 3 days preview | Start + Goal alerts |
| Flash Event | As needed | 1 day | Start only |

### 7.2 Season Start Announcement

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 NEW SEASON: "Renaissance Awakening"                          │
│                                                                 │
│  The Age of Enlightenment begins!                               │
│                                                                 │
│  ⏰ Duration: 8 weeks                                           │
│  🎨 Theme: Art, Science, and Discovery                          │
│                                                                 │
│  What's New:                                                    │
│  • Renaissance era with 20+ artifacts                          │
│  • Florence Museum wing                                         │
│  • "Renaissance Master" title                                  │
│  • Exclusive Leonardo da Vinci cosmetics                        │
│                                                                 │
│  [Enter Season] → /start                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Limited Event Announcement

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ NEW: "Roman Engineering" Event                               │
│                                                                 │
│  Only available for 7 days!                                    │
│                                                                 │
│  🏟️ Complete challenging Rome missions:                        │
│  • Restore the Colosseum                                       │
│  • Build Roman Roads                                            │
│  • Win the Great Battle                                        │
│                                                                 │
│  Exclusive Rewards:                                             │
│  • "Roman Engineer" Title                                      │
│  • Epic Capsule                                                 │
│  • 1000 Chrono Dust                                             │
│                                                                 │
│  [Accept Challenge] → /start event_roman                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Historical Festival Announcement

```
┌─────────────────────────────────────────────────────────────────┐
│  📜 HISTORICAL FESTIVAL: "Egyptian Gold Week"                   │
│                                                                 │
│  🏺 Honor the wisdom of Ancient Egypt!                          │
│                                                                 │
│  Festival Activities:                                          │
│  • Special Egypt-themed expeditions                             │
│  • 2x artifact fragment drops                                  │
│  • Museum bonus XP                                              │
│                                                                 │
│  Festival Shop Items:                                           │
│  • Ankh Animated Frame                                          │
│  • "Pharaoh's Wisdom" Title                                     │
│  • Pyramid Aura                                                 │
│                                                                 │
│  Duration: 7 days                                              │
│                                                                 │
│  [Enter Festival] → /start event_egypt_week                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.5 Community Event Announcement

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 COMMUNITY EVENT: "Fragment Festival"                        │
│                                                                 │
│  All players unite to reach 1,000,000 fragments!               │
│                                                                 │
│  Community Goal:                                                │
│  ████████████░░░░░░░░░ 847,293 / 1,000,000                     │
│                                                                 │
│  Your Contribution: 342 fragments                               │
│  Contributors: 23,456 players                                    │
│                                                                 │
│  Rewards at Goal:                                               │
│  • All players: +100 Chrono Dust                               │
│  • Top 1000: "Festival Champion" Badge                          │
│                                                                 │
│  [Track Progress] → /start event_fragment                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Referral Messages

Notifications related to the referral system.

### 8.1 Friend Joined Notification

```
┌─────────────────────────────────────────────────────────────────┐
│  👋 Your Friend Joined!                                          │
│                                                                 │
│  @NewPlayer123 has joined Jolt Time using your link!            │
│                                                                 │
│  Referral Rewards Earned:                                       │
│  • +100 Chrono Dust                                             │
│  • +1 Free Capsule                                              │
│                                                                 │
│  Progress to Next Milestone: 4/5 referrals                      │
│  Next Bonus: "Explorer" Title                                   │
│                                                                 │
│  [Invite More Friends] → /referral                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Referral Milestone Completed

```
┌─────────────────────────────────────────────────────────────────┐
│  🎉 REFERRAL MILESTONE: 10 Friends!                              │
│                                                                 │
│  Congratulations, Time Keeper!                                   │
│                                                                 │
│  You've reached 10 successful referrals!                       │
│                                                                 │
│  Milestone Rewards:                                             │
│  • +500 Chrono Dust                                             │
│  • "Friend of Time" Title                                       │
│  • Exclusive "Founding Friend" Badge                            │
│                                                                 │
│  Next Milestone: 25 referrals                                   │
│  Next Reward: Legendary Artifact Capsule                        │
│                                                                 │
│  [View Referral Stats] → /referral                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Referral Rewards Delivered

```
┌─────────────────────────────────────────────────────────────────┐
│  🎁 Referral Rewards Delivered!                                  │
│                                                                 │
│  Your friend @ActivePlayer has reached Level 10!                 │
│                                                                 │
│  Bonus Earned:                                                 │
│  • +50 Chrono Dust                                             │
│                                                                 │
│  Keep playing together!                                        │
│                                                                 │
│  [Send Gift] → /start                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Anti-Spam Philosophy

Strict guidelines ensure notifications never become spam.

### 9.1 Core Anti-Spam Rules

```
NEVER:
❌ Send more than 4 notifications per day
❌ Repeat the same message
❌ Use aggressive or urgent language
❌ Threaten lost progress or streaks
❌ Use fear tactics ("Your account will be deleted!")
❌ Send between 10pm-8am local time (quiet hours)
❌ Send for users inactive more than 30 days
❌ Bundle multiple notifications together

ALWAYS:
✅ Provide genuine value in every message
✅ Include clear action path
✅ Respect user preferences
✅ Allow easy opt-out
✅ Use friendly, welcoming tone
✅ Be honest about timing and availability
✅ Include mute/delay options
```

### 9.2 Notification Frequency Limits

| Limit Type | Value | Enforcement |
|------------|-------|-------------|
| Daily Maximum | 4 per user | Hard cap, never exceeded |
| Per Category | 1 per 12 hours | Soft cap |
| Quiet Hours | 0 messages | Automatic during hours |
| Repeat Messages | 0 repeats | Never sent |
| Marketing | 0 via bot | Prohibited |

### 9.3 Message Quality Checklist

```
BEFORE SENDING ANY NOTIFICATION:
□ Does this provide genuine value?
□ Is it under 300 characters?
□ Does it include actionable next step?
□ Is the tone friendly and welcoming?
□ Does it respect quiet hours?
□ Does it respect user preferences?
□ Is it localized?
□ Would I want to receive this?
□ Does it avoid manipulative tactics?

If any answer is uncertain, reconsider sending.
```

### 9.4 Optimal Send Times

| Category | Primary Time | Secondary Time | Never Send |
|----------|--------------|-----------------|------------|
| Daily Reminder | 10:00 AM | 6:00 PM | Before 9AM, After 9PM |
| Event Start | 9:00 AM | 7:00 PM | Quiet hours |
| Event Ending | 9:00 AM | — | 8PM-9AM |
| Quest Reset | 12:00 AM | User wake time | After 10AM |
| Energy Restored | Immediate | — | Only if user active |
| Weekly Summary | Monday 9 AM | — | After 12PM |
| Re-engagement | 10:00 AM | — | After 8PM |

---

## 10. Reactivation Philosophy

Returning players are welcomed, not pressured.

### 10.1 Reactivation Principles

```
RETURN PLAYER PHILOSOPHY:
✅ Always welcoming, never accusatory
✅ Focus on future, not past absence
✅ Preserve earned benefits when possible
✅ Convert missed content to catch-up rewards
✅ Provide exclusive welcome-back value
✅ Respect player's decision to return or not
✅ Never use manipulative retention methods
✅ Never threaten lost progress
✅ Never guilt-trip about absence
```

### 10.2 Comeback Reward Structure

| Inactivity | Welcome Back | Streak Status | Bonus |
|------------|--------------|---------------|-------|
| 1-3 days | None needed | Intact | None |
| 3-7 days | Small chest | Protected | +50% XP 24h |
| 7-14 days | Medium chest | Grace period | +100% XP 24h |
| 14-30 days | Large chest | Reset | +150% XP 48h |
| 30+ days | Legendary chest | Reset | Full catch-up |

### 10.3 Reactivation Message Examples

```
SHORT ABSENCE (3-7 days):
┌─────────────────────────────────────────────────────────────────┐
│  👋 We Missed You!                                              │
│                                                                 │
│  Welcome back, Time Keeper!                                     │
│                                                                 │
│  🎁 Small Welcome Back Chest:                                   │
│  • 3 Daily Capsules                                             │
│  • 200 Chrono Dust                                             │
│                                                                 │
│  Your streak is protected — Day 5 bonus still active!          │
│                                                                 │
│  [Welcome Back] → /start                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

LONG ABSENCE (30+ days):
┌─────────────────────────────────────────────────────────────────┐
│  🏆 Legendary Welcome Back, Time Keeper!                         │
│                                                                 │
│  The timeline has shifted in your absence.                      │
│  New eras, new challenges, new glory await.                    │
│                                                                 │
│  🎁 Legendary Return Package:                                   │
│  • Epic Capsule                                                 │
│  • 1,000 Chrono Dust                                           │
│  • "Temporal Wanderer" Title                                     │
│  • All missed Battle Pass free-track rewards                    │
│                                                                 │
│  Fresh start. New adventures. Same journey.                    │
│                                                                 │
│  [Return as a Legend] → /start                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. AdsGram Notifications

Occasional notifications about optional AdsGram opportunities.

### 11.1 AdsGram Notification Principles

```
ADSGRAM NOTIFICATIONS:
✅ Always optional — player choice
✅ Never interrupt gameplay
✅ Provide genuine bonus value
✅ Never required for progression
✅ Never use pressure tactics
✅ Clear reward shown before watching
```

### 11.2 AdsGram Notification Templates

```
BONUS REWARD AVAILABLE:
┌─────────────────────────────────────────────────────────────────┐
│  🎬 Bonus Reward Available!                                      │
│                                                                 │
│  Watch a short ad to earn:                                      │
│  • +100 Chrono Coins                                            │
│  • 2x Daily Pack upgrade                                        │
│                                                                 │
│  Today's remaining: 2/3                                          │
│                                                                 │
│  [Watch & Earn] → In-app ad                                     │
│  [Maybe Later] → /start                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

SEASONAL ADSGRAM BONUS:
┌─────────────────────────────────────────────────────────────────┐
│  🔥 Double Reward Weekend!                                        │
│                                                                 │
│  This weekend only, watch ads for 2x rewards!                  │
│                                                                 │
│  • +200 Chrono Coins (instead of +100)                          │
│  • Epic Pack upgrade available                                   │
│                                                                 │
│  [Start Earning] → In-app ad                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 AdsGram Frequency

| Ad Type | Bot Notification | In-App Prompt | Daily Limit |
|---------|-----------------|---------------|------------|
| Rewarded Bonus | Optional alert | Always available | 5/day |
| Enhanced Pack | Optional alert | On daily claim | 1/day |
| Event Bonus | Event-specific | During events | 1/day |

---

## 12. Future Bot Features

Documented as aspirational features for future development.

### 12.1 AI Historian Assistant

```
FUTURE: AI HISTORIAN BOT

Description:
An AI-powered assistant that provides personalized historical facts,
answers questions about artifacts, and offers educational content.

Potential Features:
• Ask about any historical artifact or era
• Personalized fact recommendations based on collection
• Quiz mode for learning reinforcement
• "Historical Fact of the Day" via bot
• Artifact origin stories and significance

Implementation Notes:
• Use GPT or similar for natural language
• Curate factual database for accuracy
• Integrate with museum system
• Keep responses brief (Telegram-friendly)
• Never generate unverified historical claims

Timeline: Phase 3+ (Post-launch)
```

### 12.2 Historical Facts of the Day

```
FUTURE: DAILY HISTORICAL FACT

Description:
Daily notifications with fascinating historical facts related to
the player's collection or interests.

Potential Format:
┌─────────────────────────────────────────────────────────────────┐
│  📚 Did You Know?                                                │
│                                                                 │
│  The Rosetta Stone, which you've collected, was discovered      │
│  in 1799 by French soldiers during Napoleon's Egyptian         │
│  campaign. It contains the same text in three scripts and       │
│  unlocked the understanding of Egyptian hieroglyphs.            │
│                                                                 │
│  Related Artifact: Rosetta Stone                                 │
│                                                                 │
│  [Learn More] → /start museum                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Frequency: 1/day (optional)
Opt-in: Separate from main notifications
```

### 12.3 Personalized Recommendations

```
FUTURE: PERSONALIZED RECOMMENDATIONS

Description:
AI-driven suggestions for optimal gameplay activities based on
player history, goals, and patterns.

Potential Features:
• "Best next activity" suggestions
• Optimal expedition timing
• Collection completion path
• Event participation recommendations
• Friend activity insights

Examples:
• "Your Rome collection is 80% complete — finish with
   this 15-minute expedition!"
• "Weekend bonus in 2 hours — perfect for energy-heavy
   activities"
• "3 friends are online now — great time for social!"

Timeline: Phase 2+ (After baseline data)
```

### 12.4 Museum News and Updates

```
FUTURE: MUSEUM NEWS FEED

Description:
Updates about real-world museum exhibitions, artifact discoveries,
and historical news that relate to in-game content.

Potential Features:
• "New Discovery" alerts for real-world finds
• Museum exhibition information
• Historical anniversary reminders
• Academic paper summaries (simplified)
• Behind-the-scenes artifact stories

Example:
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Museum News: "Treasures of Petra" Exhibition                 │
│                                                                 │
│  A new exhibition at the British Museum showcases                │
│  Nabataean artifacts, including items similar to your            │
│  collection!                                                    │
│                                                                 │
│  📅 Until March 15, 2026                                        │
│  📍 British Museum, London                                      │
│                                                                 │
│  [View Related Artifacts] → /start museum                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Partnerships: Requires museum/educational institution agreements
Timeline: Phase 3+
```

### 12.5 Smart Reminder System

```
FUTURE: SMART REMINDERS

Description:
AI-powered reminder timing that learns from player behavior
to send notifications at optimal engagement moments.

Potential Features:
• Learn player's active hours
• Predict optimal reminder times
• Personalize based on play patterns
• Adapt to timezone changes
• Suggest preferred notification types

Example Logic:
• "Player typically plays at 7-9 PM on weekdays"
• "Send daily reminder at 6:30 PM on weekdays"
• "Don't send on days player has exceeded play cap"

Timeline: Phase 2+ (After behavior data)
```

---

## 13. Technical Architecture

### 13.1 Bot System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     TELEGRAM BOT ECOSYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐ │
│  │    Telegram   │     │   Jolt Time   │     │   Supabase    │ │
│  │      Bot      │────▶│    Backend    │────▶│   Database    │ │
│  │               │     │      API      │     │               │ │
│  └───────┬───────┘     └───────┬───────┘     └───────────────┘ │
│          │                    │                              │
│          │                    ▼                              │
│          │            ┌───────────────┐                      │
│          │            │ Notification  │                      │
│          │            │    Service    │                      │
│          │            │               │                      │
│          │            │ • Scheduling  │                      │
│          │            │ • Templates   │                      │
│          │            │ • Throttling  │                      │
│          │            └───────────────┘                      │
│          │                    │                              │
│          │                    ▼                              │
│          │            ┌───────────────┐                      │
│          └───────────▶│   Message     │                      │
│                        │    Queue     │                      │
│                        │               │                      │
│                        │ • Priority    │                      │
│                        │ • Delivery    │                      │
│                        │ • Tracking    │                      │
│                        └───────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Data Models

```typescript
// User notification preferences
interface UserNotificationSettings {
  userId: string;
  masterEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: number;  // Hour 0-23
  quietHoursEnd: number;    // Hour 0-23
  timezone: string;
  language: string;
  
  categories: {
    dailyReminders: boolean;
    events: boolean;
    energy: boolean;
    expeditions: boolean;
    arena: boolean;
    missions: boolean;
    battlePass: boolean;
    seasonal: boolean;
    achievements: boolean;
    levelUps: boolean;
    friendActivity: boolean;
    referral: boolean;
    adsgram: boolean;
  };
}

// Notification queue item
interface QueuedNotification {
  id: string;
  userId: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  templateKey: string;
  variables: Record<string, any>;
  scheduledAt: Date;
  sentAt?: Date;
  status: 'queued' | 'sent' | 'failed' | 'cancelled';
}

// Deep link tracking
interface DeepLinkClick {
  id: string;
  userId: string;
  referrerId?: string;
  linkType: 'ref' | 'event' | 'guild' | 'quest' | 'artifact' | 'profile' | 'battle' | 'shop';
  payload: string;
  clickedAt: Date;
  convertedAt?: Date;
}
```

### 13.3 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bot/webhook` | POST | Telegram webhook handler |
| `/api/bot/send` | POST | Send notification to user |
| `/api/bot/settings/{userId}` | GET/PUT | Get/update user settings |
| `/api/bot/deep-link/{code}` | GET | Resolve deep link |
| `/api/bot/queue/status` | GET | Queue monitoring |
| `/api/bot/mute/{userId}` | POST | Mute notifications temporarily |

---

## 14. Security and Privacy

### 14.1 Data Handling

```
BOT DATA PRACTICES:
• No sensitive data in messages
• User IDs stored securely
• Deep link tokens are single-use
• Rate limiting per user
• No third-party data sharing
• GDPR-compliant data handling
• User data deletion on request
```

### 14.2 Anti-Abuse Measures

```
SECURITY MEASURES:
• Command rate limiting (10/min/user)
• Deep link token validation
• Referral abuse detection
• Notification spam prevention
• Bot token rotation
• Admin broadcast approval workflow
• Deep link click validation
```

---

## 15. Quality Standards

### 15.1 Pre-Deployment Checklist

```
BEFORE ACTIVATING ANY BOT MESSAGE:
□ Does it provide genuine value to the player?
□ Is the message under 300 characters?
□ Does it include a clear action path?
□ Is the tone friendly and respectful?
□ Does it respect quiet hours settings?
□ Does it respect user notification preferences?
□ Is it properly localized?
□ Would I personally want to receive this?
□ Does it avoid manipulative tactics?
□ Does it comply with Telegram policies?

If any answer is uncertain, do not send.
```

### 15.2 Ongoing Monitoring

```
METRICS TO TRACK:
• Notification open rate (target: >35%)
• Click-through rate (target: >15%)
• Opt-out rate (target: <5%)
• User complaint rate (target: <1%)
• Notification-induced session rate
• Daily active notification recipients
• Quiet hours usage percentage
```

---

*The Telegram Bot is the bridge between players and Jolt Time. Keep it helpful, respectful, and never spammy. Every message should feel like a friend saying "Hey, thought you'd like to know this."*
