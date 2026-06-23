# Jolt Time — Telegram Bot Communication System

## Overview

The Telegram Bot serves as Jolt Time's primary external touchpoint, functioning as the main entry point into the game ecosystem. The bot must feel **useful and premium, never annoying** — providing genuine value while respecting user attention and time.

---

## 1. Bot Responsibilities

### 1.1 Main Entry Point

The Telegram Bot is the primary gateway for all player interactions outside the Mini App.

| Responsibility | Description |
|---------------|-------------|
| **Game Launch** | One-tap access to Mini App via Launch button |
| **Quick Commands** | Fast access to game stats, settings, and rewards |
| **Notifications** | Timely, valuable alerts about game events |
| **Support** | Help commands and issue resolution |
| **Re-engagement** | Return player campaigns |

### 1.2 Launch Mini App Button

Every bot message includes a prominent "Launch" action when relevant.

```
┌─────────────────────────────────────────┐
│  🕐 Welcome to Jolt Time!                │
│                                         │
│  Time Keeper, your temporal journey     │
│  awaits across civilizations.           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     🚀 LAUNCH JOLT TIME         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  /help — Commands                       │
│  /profile — Your stats                  │
└─────────────────────────────────────────┘
```

### 1.3 Deep Links

The bot processes deep links for navigation and attribution.

| Deep Link | Format | Purpose |
|------------|--------|---------|
| **Standard Start** | `/start` | New user onboarding |
| **Referral** | `/start ref_{userId}` | Track referred players |
| **Event** | `/start event_{eventId}` | Direct to specific event |
| **Guild** | `/start guild_{guildId}` | Join specific guild |
| **Quest** | `/start quest_{questId}` | Jump to specific quest |
| **Artifact** | `/start artifact_{artifactId}` | View specific artifact |

#### Deep Link Processing Flow

```
User clicks deep link:
     │
     ▼
┌─────────────────────────────────────┐
│  PARSE LINK PARAMETERS              │
│                                     │
│  1. Extract command and payload     │
│  2. Validate token/signature        │
│  3. Check user exists               │
│  4. Route to appropriate handler    │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  REFERRAL FLOW                      │
│  If payload = ref_{userId}:        │
│  • Credit referrer                  │
│  • Apply signup bonus               │
│  • Track attribution                │
│  • Show welcome message             │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  MINI APP LAUNCH                    │
│  Open Mini App with context:        │
│  • ?ref=xxx (referral tracking)     │
│  • ?event=xxx (event context)       │
│  • ?guild=xxx (guild context)       │
└─────────────────────────────────────┘
```

### 1.4 Referral Links

Referral system integrated with bot for tracking and rewards.

```
Referral Flow:
1. Existing user generates link via /referral
2. New user clicks link → /start ref_{userId}
3. New user completes tutorial
4. Both users receive referral rewards
5. Rewards tracked in database

Referral Rewards:
• Referrer: 100 Chrono Dust + 1 Free Capsule
• Referee: 50 Chrono Dust + 1 Free Capsule
• Milestone bonuses at 5, 10, 25, 50 referrals
```

### 1.5 Help Commands

Comprehensive help system accessible via commands.

| Command | Description | Response |
|---------|-------------|----------|
| `/help` | General help | Command list + Mini App link |
| `/start` | Restart game | Fresh welcome flow |
| `/profile` | View profile | Player stats summary |
| `/settings` | Notification settings | Preferences menu |
| `/rewards` | View rewards | Reward history |
| `/referral` | Invite friends | Referral link + stats |
| `/news` | Latest updates | News/announcements |
| `/support` | Get help | Support options |

---

## 2. Notification Categories

All notifications are carefully crafted to provide genuine value. Each category follows the core principle: **never annoying, always useful**.

### 2.1 Daily Notifications

Triggered by daily game rhythms and reset cycles.

#### Daily Reward Available

```
┌─────────────────────────────────────────┐
│  🎁 Your Temporal Dividend is Ready!    │
│                                         │
│  Day 7 Streak Bonus Active!             │
│                                         │
│  Today's Reward:                        │
│  • +150 XP                              │
│  • +30 Chrono Dust                      │
│  • 1 Rare Capsule                       │
│                                         │
│  ⏰ Resets in 45 minutes                │
│                                         │
│  [Claim Reward] → Launch Jolt Time      │
└─────────────────────────────────────────┘
```

#### Energy Restored

```
┌─────────────────────────────────────────┐
│  ⚡ Time Energy Fully Restored!          │
│                                         │
│  Your temporal reserves are replenished.│
│  The timeline awaits your return.       │
│                                         │
│  Current Energy: ████████████ 100/100   │
│                                         │
│  [Continue Journey] → Launch Jolt Time  │
└─────────────────────────────────────────┘
```

#### New Missions

```
┌─────────────────────────────────────────┐
│  📜 New Daily Quests Ready!             │
│                                         │
│  Today's Challenges:                     │
│  ○ Collect 3 artifacts → +75 XP        │
│  ○ Complete 2 missions → +100 XP        │
│  ○ Visit Museum → +50 XP                │
│                                         │
│  Progress: 0/3 Complete                 │
│                                         │
│  [View Quests] → Launch Jolt Time       │
└─────────────────────────────────────────┘
```

### 2.2 Progress Notifications

Celebrate player achievements and milestones.

#### Level Up

```
┌─────────────────────────────────────────┐
│  🎉 LEVEL UP!                           │
│                                         │
│  Congratulations, Time Keeper!           │
│  You've reached Level 25!               │
│                                         │
│  🆕 New Unlocks:                        │
│  • Rome Era access                      │
│  • Epic missions available              │
│  • Guild system preview                │
│                                         │
│  [View Achievements] → Launch          │
└─────────────────────────────────────────┘
```

#### Achievement Unlocked

```
┌─────────────────────────────────────────┐
│  🏆 Achievement Unlocked!                │
│                                         │
│  "Cradle of Civilization"               │
│  Complete all Mesopotamia artifacts     │
│                                         │
│  Reward: +500 XP                        │
│  Badge: "Mesopotamian Scholar"          │
│                                         │
│  Your journey through time continues.   │
│                                         │
│  [View Collection] → Launch            │
└─────────────────────────────────────────┘
```

#### New Artifact Obtained

```
┌─────────────────────────────────────────┐
│  🏺 Temporal Discovery!                │
│                                         │
│  A rare artifact has manifested:         │
│                                         │
│  ✨ Egyptian Scarab                      │
│     Epic • Ancient Egypt               │
│                                         │
│  "Symbol of rebirth and protection..."  │
│                                         │
│  Fragment: 1/5 collected                │
│                                         │
│  [View Artifact] → Launch Jolt Time     │
└─────────────────────────────────────────┘
```

### 2.3 Social Notifications

Connect players through social interactions.

#### Friend Joined

```
┌─────────────────────────────────────────┐
│  👥 Your Friend Joined!                  │
│                                         │
│  Alex_Traveler just started their       │
│  temporal journey!                      │
│                                         │
│  Send a welcome gift to strengthen      │
│  your timeline connection!              │
│                                         │
│  [Send Gift] → Launch Jolt Time         │
└─────────────────────────────────────────┘
```

#### Referral Reward Received

```
┌─────────────────────────────────────────┐
│  🎁 Referral Reward!                    │
│                                         │
│  Welcome! Your friend Alex joined        │
│  Jolt Time using your link!             │
│                                         │
│  Rewards Earned:                        │
│  • +100 Chrono Dust                     │
│  • +1 Free Capsule                      │
│                                         │
│  Total Referrals: 5                     │
│  Next Bonus: 10 referrals → Legendary   │
│                                         │
│  [View Referral Stats] → Launch         │
└─────────────────────────────────────────┘
```

#### Guild Invitation

```
┌─────────────────────────────────────────┐
│  ⚔️ Guild Invitation!                   │
│                                         │
│  "Temporal Guardians" guild invites you  │
│  to join their ranks.                   │
│                                         │
│  Members: 42 | Level: 15                │
│  Focus: Artifact Collection            │
│                                         │
│  [Accept Invitation] → Launch          │
│  [View Guild Details] → Launch          │
└─────────────────────────────────────────┘
```

### 2.4 Event Notifications

Alert players about limited-time opportunities.

#### Seasonal Events

```
┌─────────────────────────────────────────┐
│  📅 NEW SEASON: "Rise of Civilizations"│
│                                         │
│  8 Weeks of Historical Adventures!      │
│                                         │
│  🎁 FREE Track:                         │
│  • New artifacts                        │
│  • Chrono Dust                          │
│  • Exclusive frames                     │
│                                         │
│  💎 Premium ($4.99):                    │
│  • Legendary cosmetics                  │
│  • +20% Season XP                       │
│                                         │
│  Season starts: NOW!                    │
│  [Enter Season] → Launch Jolt Time     │
└─────────────────────────────────────────┘
```

#### Limited-Time Artifact Banners

```
┌─────────────────────────────────────────┐
│  🔮 LIMITED TIME: Egyptian Artifacts!   │
│                                         │
│  For 7 days only:                       │
│  • 3x Epic artifact drop rate          │
│  • Special "Pharaoh's Seal" badge      │
│  • +50% Chrono Dust on duplicates      │
│                                         │
│  ⏰ 5 days, 14 hours remaining          │
│                                         │
│  [Enter Event] → Launch Jolt Time      │
└─────────────────────────────────────────┘
```

#### Special Promotions

```
┌─────────────────────────────────────────┐
│  🌟 SPECIAL OFFER!                      │
│                                         │
│  Weekend Double Rewards!                │
│                                         │
│  Sat-Sun Only:                          │
│  • 2x XP on all activities             │
│  • +10% Capsule luck                   │
│  • -25% Energy costs                   │
│  • Double fragments!                   │
│                                         │
│  Enjoy your weekend, Time Keeper!       │
│                                         │
│  [Start Now] → Launch Jolt Time        │
└─────────────────────────────────────────┘
```

### 2.5 Economy Notifications

Keep players informed about marketplace and trading activity.

#### Marketplace Sale Completed

```
┌─────────────────────────────────────────┐
│  💰 Sale Completed!                     │
│                                         │
│  Your item sold:                        │
│  • Egyptian Scarab (Epic)               │
│  • Price: 500 Chrono Dust               │
│                                         │
│  Funds added to your balance!           │
│  New Balance: 2,450 Chrono Dust        │
│                                         │
│  [View Marketplace] → Launch            │
└─────────────────────────────────────────┘
```

#### Auction Won

```
┌─────────────────────────────────────────┐
│  🏆 Auction Won!                        │
│                                         │
│  Congratulations, Time Keeper!           │
│  You won the auction for:               │
│                                         │
│  ✨ Spartan Shield (Rare)                │
│  Winning Bid: 750 Chrono Dust           │
│                                         │
│  Item added to your inventory!          │
│                                         │
│  [View Inventory] → Launch            │
└─────────────────────────────────────────┘
```

#### Item Sold

```
┌─────────────────────────────────────────┐
│  📦 Your Item Has a Buyer!              │
│                                         │
│  Roman Helmet (Rare) listed at          │
│  Marketplace: SOLD for 600 Dust         │
│                                         │
│  [View Transactions] → Launch          │
└─────────────────────────────────────────┘
```

### 2.6 AdsGram Notifications

Alert players about rewarded ad opportunities.

#### Extra Ads Available

```
┌─────────────────────────────────────────┐
│  📺 Bonus Rewards Available!             │
│                                         │
│  Watch a short ad to unlock:            │
│  • +50% XP for next mission            │
│  • Free energy refill                   │
│  • 2x artifact fragment drop           │
│                                         │
│  This is optional — play at your pace!  │
│                                         │
│  [Watch Ad] → Unlock Bonus             │
│  [Maybe Later] → Continue Playing      │
└─────────────────────────────────────────┘
```

#### Bonus Rewards Available

```
┌─────────────────────────────────────────┐
│  🎁 Extra Reward Ready!                  │
│                                         │
│  As a thanks for being a Time Keeper,   │
│  you can watch a brief ad for bonus:    │
│                                         │
│  • +25 Chrono Dust                      │
│  • +1 Rare Fragment                    │
│                                         │
│  Takes only 15 seconds. Optional!       │
│                                         │
│  [Watch for Bonus]                      │
│  [No Thanks]                            │
└─────────────────────────────────────────┘
```

---

## 3. Anti-Spam Rules

### 3.1 Core Limit: Maximum 2 Notifications Per Day

By default, players receive **no more than 2 notifications per day**.

```
Daily Notification Budget: 2
├── Must be high-value notifications
├── No repeat messages
└── No low-priority alerts
```

### 3.2 Notification Selection Priority

When multiple notifications are queued, priority determines send order:

| Priority | Category | Example |
|----------|----------|---------|
| **Critical** | Security, Account | "Verify your email" |
| **High** | Daily Rewards, Streaks | "Daily reward ready" |
| **Medium** | Events, Achievements | "New event started" |
| **Low** | Social, Economy | "Friend sent gift" |
| **None** | Marketing, Promos | Never sent via bot |

### 3.3 Player Notification Preferences

Players choose from predefined notification profiles:

| Profile | Description | Notifications/Day |
|---------|-------------|------------------|
| **All** | Everything enabled | 2 |
| **Important Only** | Daily, Progress, Events | 2 |
| **Economy Only** | Rewards, Sales, Auctions | 1 |
| **Social Only** | Friends, Guilds, Gifts | 1 |
| **Disabled** | No notifications | 0 |

#### Notification Settings Menu

```
┌─────────────────────────────────────────┐
│  🔔 NOTIFICATION SETTINGS               │
│                                         │
│  Current Profile: [Important Only ▼]    │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  DAILY:                                 │
│  [✓] Daily reward reminder              │
│  [✓] Energy restored                    │
│  [✓] New quests available              │
│                                         │
│  PROGRESS:                              │
│  [✓] Level up                           │
│  [✓] Achievement unlocked              │
│  [✓] New artifact obtained             │
│                                         │
│  EVENTS:                                │
│  [✓] Event start                       │
│  [ ] Event ending warnings              │
│                                         │
│  SOCIAL:                                │
│  [ ] Friend activity                   │
│  [ ] Guild invitations                 │
│                                         │
│  ECONOMY:                               │
│  [✓] Marketplace sales                 │
│  [ ] Auction updates                   │
│                                         │
│  QUIET HOURS: [22:00 - 08:00]          │
│                                         │
│  [SAVE]                                 │
└─────────────────────────────────────────┘
```

### 3.4 Never Send Rules

The following notification types are **never** sent under any circumstances:

```
🚫 NEVER SEND:
• "Your streak ends in X hours!"
• "You're losing your progress!"
• "Your friends are ahead of you!"
• "Come back or lose everything!"
• "You haven't played in X days!"
• Repeat notifications for same event
• More than 2 notifications per day
• Any notification between 22:00-08:00 local
```

### 3.5 Message Quality Standards

Every notification must pass these checks:

| Standard | Requirement |
|----------|------------|
| **Value** | Provides genuine information or benefit |
| **Honesty** | No exaggerated claims or false urgency |
| **Actionability** | Clear next step when relevant |
| **Brevity** | Under 300 characters |
| **Tone** | Respectful, never guilt-tripping |

---

## 4. Quiet Hours

Players configure quiet hours during which **no notifications are sent**.

### 4.1 Configuration Options

| Setting | Default | Options |
|---------|---------|---------|
| **Start Hour** | 22:00 (10 PM) | 0-23 |
| **End Hour** | 08:00 (8 AM) | 0-23 |
| **Timezone** | Auto-detected | All timezones |
| **Enabled** | On | On/Off |

### 4.2 Quiet Hours Behavior

```
┌─────────────────────────────────────────┐
│  Quiet Hours: 22:00 - 08:00             │
│                                         │
│  DURING QUIET HOURS:                    │
│  • No notifications sent                │
│  • Messages queued for delivery          │
│  • Queued messages sent at 08:00        │
│  • Emergency overrides for critical      │
│                                         │
│  EXAMPLES:                              │
│  • Daily reward ready at 21:00 → Sent   │
│  • Daily reward ready at 22:30 → Queue  │
│  • Queued message at 07:55 → Sent at 08 │
└─────────────────────────────────────────┘
```

### 4.3 Emergency Override

Critical notifications bypass quiet hours:

| Notification Type | Bypass Quiet Hours |
|-------------------|-------------------|
| Security Alert | ✅ Always |
| Account Issue | ✅ Always |
| Subscription Expiry | ✅ 24h before only |

---

## 5. Re-engagement Scenarios

Returning players receive welcoming, never punishing messages. The strategy focuses on **what's new** rather than **what was missed**.

### 5.1 Inactivity Escalation

| Days Inactive | Message Theme | Tone |
|---------------|---------------|------|
| **1 day** | "Your energy is full" | Informational |
| **3 days** | "New rewards are waiting" | Inviting |
| **7 days** | "Limited bonus for returning" | Rewarding |
| **14 days** | "Welcome back package" | Celebrating |
| **30 days** | "Special comeback event" | Grand return |

### 5.2 Message Templates

#### 1 Day Inactive

```
┌─────────────────────────────────────────┐
│  🕐 Time Keeper, Your Energy is Full!   │
│                                         │
│  Your Time Energy has completely         │
│  regenerated while you were away.       │
│                                         │
│  Current: ████████████ 100/100         │
│                                         │
│  Ready to explore again?                 │
│                                         │
│  [Continue Journey] → Launch            │
└─────────────────────────────────────────┘
```

#### 3 Days Inactive

```
┌─────────────────────────────────────────┐
│  ✨ New Rewards Waiting!                 │
│                                         │
│  Time Keeper, we've been saving things   │
│  for you:                               │
│                                         │
│  • 3 days of daily capsules            │
│  • New artifacts discovered             │
│  • Egypt Week event completed           │
│                                         │
│  Your streak (12 days) is safe!         │
│                                         │
│  [Claim Welcome Back] → Launch          │
└─────────────────────────────────────────┘
```

#### 7 Days Inactive

```
┌─────────────────────────────────────────┐
│  🎁 Limited Bonus for Returning!         │
│                                         │
│  We missed you, Time Keeper!            │
│  As a thank you for returning:          │
│                                         │
│  • 7-day comeback bonus active         │
│  • +100% XP for 48 hours               │
│  • Free Legendary capsule              │
│  • All missed daily rewards saved      │
│                                         │
│  This bonus expires in 24 hours!        │
│                                         │
│  [Claim Bonus] → Launch Jolt Time      │
└─────────────────────────────────────────┘
```

#### 14 Days Inactive

```
┌─────────────────────────────────────────┐
│  👋 Welcome Back Package!                 │
│                                         │
│  The timeline has missed its guardian.   │
│                                         │
│  Welcome Back Chest includes:            │
│  • 14 Daily Capsules                    │
│  • 1,000 Chrono Dust                   │
│  • 3 Rare Artifacts (choice)           │
│  • +150% XP (72 hours)                 │
│                                         │
│  Plus, your streak bonus (+25% XP)      │
│  is still intact!                       │
│                                         │
│  [Return to Timeline] → Launch         │
└─────────────────────────────────────────┘
```

#### 30+ Days Inactive

```
┌─────────────────────────────────────────┐
│  🌟 SPECIAL COMEBACK EVENT!              │
│                                         │
│  Time Keeper, a grand welcome awaits!   │
│                                         │
│  30-Day Return Celebration:              │
│  • All missed rewards converted         │
│  • Legendary Welcome Back Chest         │
│  • Exclusive "Eternal Guardian" title   │
│  • 2-week premium streak protection     │
│  • Access to all new eras               │
│                                         │
│  The civilizations need you back!       │
│                                         │
│  [Grand Return] → Launch Jolt Time     │
└─────────────────────────────────────────┘
```

### 5.3 Re-engagement Rules

```
RULES FOR RETURNING PLAYERS:
✅ Always welcoming, never punishing
✅ Focus on new content, not missed content
✅ Preserve streak bonuses up to 30 days
✅ Convert missed rewards to catch-up chest
✅ No guilt-tripping language
❌ Never mention "lost" progress
❌ Never threaten streak loss
❌ Never use fear-based messaging
```

---

## 6. Support Commands

### 6.1 Command Reference

| Command | Description | Response Time |
|---------|-------------|---------------|
| `/help` | List all commands | Instant |
| `/profile` | View player stats | Instant |
| `/settings` | Notification preferences | Instant |
| `/rewards` | Reward history | Instant |
| `/referral` | Invite friends | Instant |
| `/news` | Latest announcements | Instant |
| `/support` | Contact support | 24 hours |
| `/faq` | Frequently asked questions | Instant |

### 6.2 Profile Command

```
┌─────────────────────────────────────────┐
│  👤 YOUR PROFILE                         │
│                                         │
│  Name: Time Keeper Alex                 │
│  Level: 32                              │
│  Member since: March 2024               │
│                                         │
│  📊 STATS:                              │
│  • Streak: 15 days (1.5x XP bonus)     │
│  • Artifacts: 67/82 (82%)              │
│  • Missions: 342 completed             │
│  • Era: Rome (Level 3)                  │
│                                         │
│  💰 RESOURCES:                          │
│  • 2,450 Chrono Dust                   │
│  • 100 Time Energy                     │
│  • 5 Free Capsules                     │
│                                         │
│  [View Full Profile] → Launch          │
└─────────────────────────────────────────┘
```

### 6.3 Rewards Command

```
┌─────────────────────────────────────────┐
│  🎁 YOUR REWARDS                         │
│                                         │
│  AVAILABLE:                             │
│  • Daily Capsule (Day 7 - 1 available) │
│  • Comeback Chest (1 available)        │
│  • Level 32 Bonus (1 available)        │
│                                         │
│  RECENTLY CLAIMED:                      │
│  • Day 32 Login — 150 XP               │
│  • Achievement: Rome Explorer — 500 XP  │
│  • Event: Egypt Week — 3 Fragments     │
│                                         │
│  [Claim All Available] → Launch        │
└─────────────────────────────────────────┘
```

### 6.4 News Command

```
┌─────────────────────────────────────────┐
│  📰 JOLT TIME NEWS                       │
│                                         │
│  🆕 SEASON 5 NOW LIVE!                  │
│  "Rise of Civilizations" begins!        │
│  New artifacts, missions, rewards.      │
│  [Read More]                           │
│                                         │
│  ⚔️ GUILD WARS STARTING                  │
│  Join the competition! Registration     │
│  open until Friday.                     │
│  [Learn More]                          │
│                                         │
│  🏛️ EGYPT WEEK EXTENDED                  │
│  Due to popularity, 3 more days!       │
│  [Enter Event]                         │
│                                         │
│  [View All News]                        │
└─────────────────────────────────────────┘
```

### 6.5 FAQ Command

```
┌─────────────────────────────────────────┐
│  ❓ FREQUENTLY ASKED QUESTIONS           │
│                                         │
│  1. How do I earn Chrono Dust?          │
│     → Complete missions, daily rewards, │
│       sell items in marketplace         │
│                                         │
│  2. Why did my streak reset?            │
│     → Streaks reset if you don't log   │
│       in within 24 hours. Grace period  │
│       available for premium users.      │
│                                         │
│  3. How do I get rare artifacts?        │
│     → Complete missions, open capsules, │
│       participate in events.            │
│                                         │
│  [View Full FAQ] → Launch              │
│  [Contact Support]                     │
└─────────────────────────────────────────┘
```

---

## 7. Localization Support

### 7.1 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| **Ukrainian** | uk | ✅ Required |
| **English** | en | ✅ Default |

### 7.2 Localization Architecture

```yaml
localization:
  primary_languages:
    - uk  # Ukrainian
    - en  # English
  
  detection_priority:
    1: Telegram language setting
    2: User preference in settings
    3: IP-based geolocation
    4: Default to English
  
  message_format:
    template_engine: true
    variables: {name}, {count}, {date}
    pluralization: true
    gender: false  # Not needed for bot
  
  fallbacks:
    missing_key: "Return to English"
    missing_emoji: "Use text alternative"
```

### 7.3 Message Template Examples

#### English
```
🎁 Your Temporal Dividend is Ready!

Day {streak} Streak Bonus Active!

Today's Reward:
• +{xp} XP
• +{dust} Chrono Dust
• 1 {rarity} Capsule

[Claim Reward] → Launch Jolt Time
```

#### Ukrainian
```
🎁 Ваша часова дивіденд готова!

Бонус серії {streak} днів активний!

Нагорода сьогодні:
• +{xp} XP
• +{dust} Хроно Пилу
• 1 {rarity} Капсула

[Отримати нагороду] → Запустити Jolt Time
```

### 7.4 RTL Support Preparation

Future expansion ready for right-to-left languages:

```yaml
rtl_preparation:
  message_structure:
    avoid_fixedAlign: true
    useFlexbox: true
    iconsOnCorrectSide: true
  
  text_direction:
    telegram_handles: true
    mini_app_handles: true
```

---

## 8. Future Expansion

### 8.1 AI Assistant Inside Bot

Preparing architecture for conversational AI support.

```yaml
ai_assistant:
  features:
    - Natural language queries
    - Game guidance
    - Historical facts
    - Artifact information
    - Strategy tips
  
  implementation:
    - OpenAI integration ready
    - Conversation context storage
    - Multi-turn dialogue support
    - Personality: Friendly temporal guide
  
  safety:
    - No game-breaking information
    - No exploit discussion
    - Family-friendly responses
    - Escalation to human support
```

### 8.2 Event Announcements

Structured event announcement system.

```yaml
event_announcements:
  scheduled:
    - season_start: "Monday 00:00 UTC"
    - season_end: "Sunday 23:59 UTC"
    - weekend_bonus: "Friday 18:00 UTC"
  
  templates:
    event_start:
      - "{event_name} has begun!"
      - "Duration: {duration}"
      - "{reward_preview}"
    
    event_mid:
      - "Halfway through {event_name}!"
      - "{progress}% complete"
      - "{time_remaining} remaining"
    
    event_end:
      - "{event_name} ending soon!"
      - "{time_remaining} left to claim rewards"
```

### 8.3 Personalized Messages

Machine learning-ready personalization system.

```yaml
personalization:
  data_points:
    - play_style: "casual|medium|hardcore"
    - favorite_era: "based on activity"
    - completion_level: "beginner|intermediate|advanced"
    - engagement_pattern: "morning|afternoon|evening"
  
  message_variants:
    casual_player:
      - "Take your time, no rush!"
      - "Quick sessions welcome!"
    
    hardcore_player:
      - "New challenge awaits!"
      - "Test your skills!"
```

### 8.4 VIP Notifications

Premium tier notification features.

```yaml
vip_notifications:
  eligibility:
    - season_pass_holder
    - lifetime_value_threshold
    - beta_tester
  
  exclusive_notifications:
    - early_access_to_events
    - pre-release_content
    - direct_dev_responses
    - special_vip_rewards
  
  delivery:
    priority_queue: true
    unique_vip_badge: true
    exclusive_rewards: true
```

---

## 9. Complete Notification List

### Summary Table

| ID | Category | Notification | Default | Priority |
|----|----------|--------------|---------|----------|
| 1 | Daily | Daily reward ready | On | High |
| 2 | Daily | Energy fully restored | On | Medium |
| 3 | Daily | New quests available | On | Medium |
| 4 | Progress | Level up | On | High |
| 5 | Progress | Achievement unlocked | On | Medium |
| 6 | Progress | New artifact obtained | On | Medium |
| 7 | Social | Friend joined via referral | On | Low |
| 8 | Social | Referral reward received | On | Medium |
| 9 | Social | Guild invitation | On | Medium |
| 10 | Social | Friend activity | Off | Low |
| 11 | Events | Season started | On | High |
| 12 | Events | Event started | On | Medium |
| 13 | Events | Limited-time banner | On | Medium |
| 14 | Events | Weekend bonus active | On | Medium |
| 15 | Economy | Marketplace sale completed | On | Low |
| 16 | Economy | Auction won | On | Medium |
| 17 | Economy | Item sold | On | Low |
| 18 | AdsGram | Extra ads available | On | Low |
| 19 | AdsGram | Bonus rewards ready | On | Low |
| 20 | Re-engage | Return player (1 day) | On | Medium |
| 21 | Re-engage | Return player (7 days) | On | High |
| 22 | Re-engage | Return player (14 days) | On | High |
| 23 | Re-engage | Return player (30 days) | On | High |

---

## 10. Message Frequency Rules

### 10.1 Frequency Limits

| Limit Type | Value | Notes |
|------------|-------|-------|
| **Daily Maximum** | 2 | Default, never exceeded |
| **Per Category/Day** | 1 | One notification per category max |
| **Quiet Hours** | 0 | No messages during configured hours |
| **Repeat Messages** | 0 | Never repeat same message |
| **Marketing Messages** | 0 | Never sent via bot |

### 10.2 Optimal Send Times

| Category | Primary Time | Secondary Time |
|----------|--------------|----------------|
| Daily Reward | 10:00 local | 18:00 local |
| Energy | When triggered | — |
| Quests | 00:00 local | User wake time |
| Events | 09:00 local | 19:00 local |
| Progress | When triggered | — |
| Social | When triggered | — |
| Re-engage | 10:00 local | — |

### 10.3 Notification Queue Priority

When daily budget is reached, messages are queued by:

1. **Urgency** — Time-sensitive first
2. **Value** — Higher player value first
3. **Recency** — Older messages first

```
Queue Processing:
1. Check daily sent count
2. If count < 2, send immediately
3. If count = 2, queue remaining
4. Queue processed at next send window
5. Oldest queued sent first
```

---

## 11. Return Player Strategy

### 11.1 Strategy Overview

| Inactivity | Strategy | Goal |
|------------|----------|------|
| 1-2 days | Informational | Gentle reminder |
| 3-6 days | Value proposition | Show what's new |
| 7-14 days | Reward bonus | Compensate return |
| 14-30 days | Grand welcome | Full celebration |
| 30+ days | Special event | Re-activation |

### 11.2 Key Principles

```
RETURN PLAYER MESSAGING:
✅ Always welcoming, never accusatory
✅ Focus on future, not past absence
✅ Preserve earned benefits (streaks, bonuses)
✅ Convert missed content to catch-up rewards
✅ Provide exclusive welcome-back value
✅ Respect player's decision to return or not
```

### 11.3 Streak Preservation

| Inactivity | Streak Status |
|------------|---------------|
| 1-2 days | Fully intact |
| 3-7 days | Protected by grace period |
| 7-14 days | Premium protection available |
| 14-30 days | Welcome back bonus replaces |
| 30+ days | Celebration package provided |

---

## 12. Bot Architecture Summary

### 12.1 System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     TELEGRAM BOT ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐ │
│  │   Telegram    │     │    Jolt Time   │     │   Supabase    │ │
│  │     Bot       │────▶│    Backend     │────▶│   Database    │ │
│  │               │     │    API         │     │               │ │
│  └───────┬───────┘     └───────┬───────┘     └───────────────┘ │
│          │                    │                               │
│          │                    ▼                               │
│          │            ┌───────────────┐                       │
│          │            │ Notification  │                       │
│          │            │   Service     │                       │
│          │            │               │                       │
│          │            │ • Scheduling │                       │
│          │            │ • Templates  │                       │
│          │            │ • Throttling │                       │
│          │            └───────────────┘                       │
│          │                    │                               │
│          │                    ▼                               │
│          │            ┌───────────────┐                       │
│          └───────────▶│   Message     │                       │
│                         │   Queue      │                       │
│                         │               │                       │
│                         │ • Priority   │                       │
│                         │ • Delivery   │                       │
│                         │ • Tracking   │                       │
│                         └───────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Data Models

```typescript
// User notification preferences
interface UserNotificationSettings {
  userId: string;
  profile: 'all' | 'important' | 'economy' | 'social' | 'disabled';
  quietHoursEnabled: boolean;
  quietHoursStart: number; // Hour 0-23
  quietHoursEnd: number;   // Hour 0-23
  timezone: string;
  language: 'en' | 'uk';
  enabledCategories: NotificationCategory[];
}

// Notification queue item
interface QueuedNotification {
  id: string;
  userId: string;
  category: NotificationCategory;
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
  linkType: 'ref' | 'event' | 'guild' | 'quest' | 'artifact';
  payload: string;
  clickedAt: Date;
  convertedAt?: Date;
}
```

### 12.3 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bot/webhook` | POST | Telegram webhook handler |
| `/api/bot/send` | POST | Send notification to user |
| `/api/bot/settings/{userId}` | GET/PUT | Get/update user settings |
| `/api/bot/deep-link/{code}` | GET | Resolve deep link |
| `/api/bot/queue/status` | GET | Queue monitoring |

### 12.4 Key Integrations

| Service | Integration | Purpose |
|---------|-------------|---------|
| Telegram Bot API | sendMessage, editMessage | Message delivery |
| Telegram Login Widget | WebApp auth | Mini App authentication |
| Supabase | PostgreSQL, Realtime | Data persistence |
| Redis | Message queue | Notification scheduling |

---

## 13. Premium Bot Experience Guidelines

### 13.1 Design Principles

```
BOT EXPERIENCE STANDARDS:
✅ Instant responses to commands
✅ Rich, formatted messages
✅ Clear call-to-action buttons
✅ Consistent temporal/time theme
✅ Respectful notification frequency
✅ Helpful, never pushy messaging
✅ Beautiful emoji usage
✅ Smooth Mini App transitions
```

### 13.2 Quality Checklist

```
BEFORE DEPLOYING ANY BOT MESSAGE:
□ Does it provide genuine value?
□ Is it under 300 characters?
□ Does it include actionable next step?
□ Is the tone respectful?
□ Does it respect quiet hours?
□ Does it respect user preferences?
□ Is it localized?
□ Would I want to receive this?
```

---

## 14. Security & Privacy

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

### 14.2 Anti-Abuse

```
SECURITY MEASURES:
• Command rate limiting (10/min/user)
• Deep link token validation
• Referral abuse detection
• Notification spam prevention
• Bot token rotation
• Admin broadcast approval workflow
```

---

*The Telegram Bot is the bridge between players and Jolt Time. Keep it helpful, respectful, and premium.*
