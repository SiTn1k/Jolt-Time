# Jolt Time — Telegram Ecosystem Architecture

## Overview

This document describes the complete Telegram ecosystem architecture for Jolt Time, including the relationship between Telegram Bot, Telegram Mini App, Backend API, and Supabase Database.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              JOLT TIME ECOSYSTEM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                          ┌─────────────────────┐                            │
│                          │       USER          │                            │
│                          │   (Telegram App)    │                            │
│                          └──────────┬──────────┘                            │
│                                     │                                        │
│                    ┌────────────────┼────────────────┐                     │
│                    │                │                │                     │
│                    ▼                ▼                ▼                     │
│          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐      │
│          │   TELEGRAM      │ │  TELEGRAM       │ │   EXTERNAL      │      │
│          │   BOT           │ │  MINI APP       │ │   SERVICES      │      │
│          │                 │ │                 │ │                 │      │
│          │ • Commands      │ │ • Game UI       │ │ • AdsGram SDK   │      │
│          │ • Notifications │ │ • Gameplay      │ │ • Analytics     │      │
│          │ • Broadcasts    │ │ • Inventory     │ │ • CDN           │      │
│          │ • Re-engagement │ │ • Settings      │ │                 │      │
│          └────────┬────────┘ └────────┬────────┘ └────────┬────────┘      │
│                   │                   │                   │                 │
│                   │                   │                   │                 │
│                   ▼                   ▼                   ▼                 │
│          ┌─────────────────────────────────────────────────────────┐      │
│          │                    BACKEND API                          │      │
│          │                                                         │      │
│          │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │      │
│          │  │ Auth Module  │  │ Game Logic   │  │ Notification │ │      │
│          │  │              │  │              │  │ Service      │ │      │
│          │  │ • Telegram   │  │ • Battles    │  │              │ │      │
│          │  │   Auth       │  │ • Quests     │  │ • Scheduled  │ │      │
│          │  │ • Sessions   │  │ • Rewards    │  │ • Push       │ │      │
│          │  │ • Validation │  │ • Artifacts  │  │ • Templates  │ │      │
│          │  └──────────────┘  └──────────────┘  └──────────────┘ │      │
│          │                                                         │      │
│          │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │      │
│          │  │ Event System │  │ Economy      │  │ Leaderboard  │ │      │
│          │  │              │  │ Service      │  │ Service      │ │      │
│          │  │ • Scheduling │  │              │  │              │ │      │
│          │  │ • Triggers   │  │ • Currency   │  │ • Rankings   │ │      │
│          │  │ • Rewards    │  │ • Upgrades   │  │ • Scores     │ │      │
│          │  │ • Tracking   │  │ • Capsules   │  │ • History    │ │      │
│          │  └──────────────┘  └──────────────┘  └──────────────┘ │      │
│          └─────────────────────────────────────────────────────────┘      │
│                                       │                                      │
│                                       ▼                                      │
│          ┌─────────────────────────────────────────────────────────┐      │
│          │                    SUPABASE DATABASE                     │      │
│          │                                                         │      │
│          │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │      │
│          │  │   profiles   │  │player_stats  │  │user_settings │ │      │
│          │  │user_artifacts│  │   quests     │  │   events     │ │      │
│          │  │ battle_hist  │  │ ads_history  │  │notifications │ │      │
│          │  └──────────────┘  └──────────────┘  └──────────────┘ │      │
│          │                                                         │      │
│          │  ┌──────────────────────────────────────────────────┐  │      │
│          │  │              Realtime Subscriptions               │  │      │
│          │  │              Row Level Security                   │  │      │
│          │  └──────────────────────────────────────────────────┘  │      │
│          └─────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

### 1. User (Telegram App)

**Responsibilities:**
- Interact with Telegram Bot via commands
- Open and play Telegram Mini App
- Configure notification preferences
- Authenticate via Telegram

**User Flows:**
```
User → Bot Command → Mini App Opens
User → Bot Notification → Mini App Opens
User → Mini App → Gameplay
User → Mini App Settings → Preferences Updated
```

---

### 2. Telegram Bot

**Responsibilities:**
- Entry point for the game
- Command handling
- Push notifications
- Re-engagement campaigns
- Admin broadcasts
- No gameplay logic

**Commands:**
| Command | Description | Response |
|---------|-------------|----------|
| `/start` | Start the game | Welcome message + Mini App link |
| `/help` | Get help | Instructions and FAQ |
| `/profile` | View profile | User stats summary |
| `/daily` | Claim daily reward | Reward message + Mini App |
| `/settings` | Notification settings | Settings menu |
| `/events` | View active events | Event list |
| `/streak` | Check streak | Streak status |
| `/invite` | Invite friends | Referral link |

**Bot-Specific Features:**
- Inline keyboards for quick actions
- Callback queries for menu navigation
- Deep links to Mini App
- Message editing for live updates

---

### 3. Telegram Mini App

**Responsibilities:**
- All game UI and gameplay
- Battle system
- Inventory management
- Quest tracking
- Artifact upgrades
- User settings
- Local data caching

**Mini App-Specific Features:**
- WebApp-ready JavaScript SDK
- Haptic feedback
- Biometric authentication (future)
- Camera access for AR (future)
- Share functionality

**Screens/Features:**
```
┌─────────────────────────────────────┐
│           MINI APP SCREENS          │
├─────────────────────────────────────┤
│                                     │
│  Home         - Main hub             │
│  Missions     - Quest gameplay        │
│  Inventory    - Artifacts collection │
│  Battle       - Combat system        │
│  Capsule      - Gacha/opening        │
│  Events       - Limited-time events  │
│  Profile      - Stats & achievements │
│  Settings     - Preferences         │
│                                     │
└─────────────────────────────────────┘
```

**Critical Rule:**
> Bot should NEVER contain gameplay logic. Mini App handles all game mechanics.

---

### 4. Backend API

**Responsibilities:**
- Business logic
- Data validation
- Game state management
- Notification scheduling
- Event processing
- Leaderboard calculations
- Economy balancing

**Modules:**

#### Auth Module
```
• Telegram initData validation
• User session management
• Token generation
• Rate limiting
```

#### Game Logic Module
```
• Battle calculations
• Quest progress updates
• Artifact management
• Reward distribution
• Capsule opening (RNG)
```

#### Economy Module
```
• Currency transactions
• Upgrade processing
• Purchase validation
• Anti-cheat detection
```

#### Notification Service
```
• Scheduled notifications
• Template management
• Queue processing
• Delivery tracking
• User preference filtering
```

#### Event System
```
• Event scheduling
• Trigger evaluation
• Progress tracking
• Reward distribution
• Analytics collection
```

---

### 5. Supabase Database

**Responsibilities:**
- Persistent data storage
- Real-time subscriptions
- User authentication
- Access control (RLS)
- Data integrity

**Key Tables:**
```
profiles          - User accounts
player_stats      - Statistics
user_artifacts    - Inventory
user_quests      - Quest progress
battle_history   - Combat logs
notifications    - User notifications
events           - Event definitions
user_events      - Participation tracking
ads_history      - Ad analytics
```

---

## Data Flow

### User Authentication Flow

```
1. User sends /start to Bot
         ↓
2. Bot sends Mini App deep link
         ↓
3. User opens Mini App
         ↓
4. Mini App receives initData from Telegram
         ↓
5. Backend validates initData
         ↓
6. Backend creates/retrieves user in Supabase
         ↓
7. User session established
```

### Notification Flow

```
1. Scheduled job triggers notification check
         ↓
2. Query users meeting trigger conditions
         ↓
3. Filter by user preferences
         ↓
4. Generate personalized message
         ↓
5. Send via Telegram Bot API
         ↓
6. Track delivery status
         ↓
7. Log for analytics
```

### Game Action Flow

```
1. User performs action in Mini App
         ↓
2. Mini App sends request to Backend
         ↓
3. Backend validates action
         ↓
4. Backend processes game logic
         ↓
5. Backend updates Supabase
         ↓
6. Backend returns result to Mini App
         ↓
7. Mini App updates UI
         ↓
8. Realtime subscription notifies (optional)
```

---

## Push Notifications

### Notification Categories

| Category | Trigger | Message Example |
|----------|---------|-----------------|
| **1. Energy Full** | Energy reaches max | "⚡ Your time energy is fully restored!" |
| **2. Daily Reward Ready** | Daily reset | "🎁 Your daily reward is waiting!" |
| **3. Event Started** | New event begins | "🏛️ Ancient Egypt Week has begun!" |
| **4. Event Ending Soon** | 24h before end | "⏰ Egypt Week ends tomorrow!" |
| **5. Weekly Reward** | Monday reset | "📊 Your weekly summary is ready!" |
| **6. Battle Chest Available** | Chest ready | "📦 Your battle chest is ready to open!" |
| **7. New Artifact Available** | New content | "🏺 New Egyptian artifacts discovered!" |
| **8. Comeback Reward** | Return after absence | "👋 Welcome back! We missed you!" |
| **9. Seasonal Event** | Season change | "📅 New season: Rise of Civilizations!" |
| **10. Maintenance** | Server updates | "🔧 Scheduled maintenance in 1 hour" |

### Notification Rules

```yaml
limits:
  max_per_day: 4
  max_per_hour: 2
  min_interval: 30 minutes
  
timing:
  earliest_send: "08:00 local"
  latest_send: "22:00 local"
  quiet_hours: respected
  
filters:
  - user_preference_check
  - duplicate_prevention
  - priority_override
```

### Notification Template

```html
<b>Jolt Time</b>

{notification_title}

{notification_body}

{optional_action_button}

⏰ {timestamp}
```

### Notification Management

**User Controls:**
```
Settings Available:
• Master toggle (on/off)
• By category (10 options)
• Quiet hours (start/end time)
• Mute duration (1h, 4h, 24h)

Default: All enabled except maintenance
```

---

## Inactive User Strategy

### Comeback Rewards by Absence Duration

#### After 1 Day
```
Trigger: User misses daily login

Message: "You were missed! Your daily reward awaits."
Reward: Normal daily reward
Bonus: +1 Temporal Shield if streak was 7+ days
```

#### After 3 Days
```
Trigger: User absent for 3 days

Message: "Time keeps moving... Come back!"
Reward: 3x daily rewards (unclaimed)
Bonus: Welcome Back Chest (1 Common Capsule + 100 Dust)
Streak: Preserved at current level
```

#### After 7 Days
```
Trigger: User absent for 1 week

Message: "A week in time... A lot has happened!"
Reward: 7x daily rewards (unclaimed)
Bonus: Welcome Back Chest (3 Common Capsules + 300 Dust)
Streak: Preserved at current level
XP Boost: +50% XP for 24 hours
```

#### After 14 Days
```
Trigger: User absent for 2 weeks

Message: "Two weeks have passed... New discoveries await!"
Reward: 14x daily rewards (unclaimed)
Bonus: Welcome Back Chest (1 Uncommon Capsule + 500 Dust)
Streak: Preserved at current level
XP Boost: +100% XP for 48 hours
Content: New content summary
```

#### After 30 Days
```
Trigger: User absent for 1 month

Message: "Time waits for no one... But we waited for you!"
Reward: 30x daily rewards (unclaimed)
Bonus: Welcome Back Chest (1 Rare Capsule + 1000 Dust)
Streak: Reset to 1, but bonus level preserved
XP Boost: +200% XP for 72 hours
Content: Major updates summary
Event: Exclusive "Welcome Back" event (3 days)
```

### Comeback Flow

```
User Returns
     │
     ▼
┌─────────────────────────────────────┐
│  WELCOME BACK SCREEN                │
│                                     │
│  "We missed you, {username}!"       │
│                                     │
│  Summary of absence:                │
│  • X days missed                    │
│  • Y daily rewards saved            │
│  • Z events happened                │
│                                     │
│  Your bonuses intact:                │
│  ✓ +25% XP (streak bonus)          │
│  ✓ 4 Temporal Shields              │
│  ✓ Era: Egypt unlocked              │
│                                     │
│  Welcome Back Rewards:               │
│  • X Daily Capsules                │
│  • Welcome Back Chest               │
│  • 48h XP Boost                    │
│                                     │
│  [CLAIM REWARDS]                    │
└─────────────────────────────────────┘
```

### Re-Engagement Triggers

| Absence | Day | Message Type | Priority |
|---------|-----|--------------|----------|
| 1 day | Day 2 | Gentle reminder | Low |
| 3 days | Day 4 | Incentive offer | Medium |
| 7 days | Day 8 | Reward highlight | High |
| 14 days | Day 16 | Content update | High |
| 30 days | Day 31 | Special comeback | Critical |

---

## Bot Personality

### Core Characteristics

```
┌─────────────────────────────────────┐
│         BOT PERSONALITY              │
├─────────────────────────────────────┤
│                                     │
│  🕐 Friendly                        │
│     - Welcoming tone                 │
│     - Celebratory messages           │
│     - Encouraging language           │
│                                     │
│  🔮 Futuristic                      │
│     - Temporal terminology           │
│     - Tech-forward descriptions      │
│     - "Chrono" and "Temporal" usage  │
│                                     │
│  🌍 Mysterious                      │
│     - Historical hints              │
│     - Curiosity-inducing            │
│     - Discovery language            │
│                                     │
│  ⏳ Time-Travel Themed              │
│     - Timeline references            │
│     - Era-specific vocabulary        │
│     - Temporal mechanics terms      │
│                                     │
└─────────────────────────────────────┘
```

### Message Examples by Type

**Energy Restored:**
```
⚡ Temporal Sync Complete

Your time energy has been fully restored.
The timeline awaits your return.

[Continue Your Journey] →
```

**Daily Reward:**
```
🎁 Temporal Dividend Claimed!

+100 XP
+50 Chrono Dust
+1 Common Capsule

Your next dividend in: 23:45:32

🔥 Day 7 Streak: 2.0x bonus active!
```

**Event Started:**
```
🏛️ NEW TEMPORAL EVENT: Ancient Egypt Week

The sands of time reveal secrets from the Nile...

Discover Egyptian artifacts
Complete special missions
Earn the "Nile Guardian" badge

Duration: 7 days remaining

[Enter the Pyramid] →
```

**New Artifact:**
```
🏺 Temporal Discovery!

A new artifact has manifested in {Era}:

✨ {Artifact Name}
   {Rarity} • {Era}
   
   "Historical description..."

Collect fragments to unlock!

[Discover More] →
```

**Comeback:**
```
🕐 Time Keeper, You Return!

While you were away:
• 7 temporal cycles completed
• Egypt Week event occurred
• 3 new artifacts discovered
• Your streak (15 days) is intact!

Welcome Back Chest awaits:
• 7 Daily Capsules
• 500 Chrono Dust
• +50% XP (48h)

The timeline has missed you.

[Return to the Timeline] →
```

**Achievement:**
```
🏆 Temporal Milestone!

You've reached Level 20!

New unlocks:
• Rome Era access
• Guild system preview
• Epic missions available

Your journey through time continues.

[View Achievements] →
```

### Tone Guidelines

```yaml
DO:
✅ Use player's name naturally
✅ Reference their progress
✅ Be encouraging and positive
✅ Use temporal/history language
✅ Provide clear calls to action
✅ Respect player's time

DON'T:
❌ Use fear or pressure tactics
❌ Be overly dramatic
❌ Use excessive caps or emojis
❌ Send too frequently
❌ Be robotic or generic
❌ Make demands
```

---

## Admin Broadcasts

### Broadcast Types

| Type | Priority | Target | Template |
|------|----------|--------|----------|
| **Announcement** | Normal | All users | Standard |
| **Event Message** | High | Active players | Event-themed |
| **Maintenance** | Urgent | All users | Technical |
| **Emergency** | Critical | All users | Alert-style |
| **Marketing** | Low | Segmented users | Promotional |

### Broadcast Management

```yaml
broadcast_features:
  targeting:
    - by_language
    - by_activity_level
    - by_registration_date
    - by_era_progress
    - by_purchase_history
    
  scheduling:
    - immediate
    - scheduled
    - recurring
    
  testing:
    - test_to_admin
    - percentage_rollout
    - canary_release
    
  monitoring:
    - delivery_rate
    - open_rate
    - unsubscribe_rate
    - spam_reports
```

### Admin Panel Requirements

```
┌─────────────────────────────────────┐
│        ADMIN BROADCAST PANEL         │
├─────────────────────────────────────┤
│                                     │
│  Type: [Announcement ▼]             │
│                                     │
│  Title: [________________]          │
│                                     │
│  Message:                           │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │                             │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Target: [All Users ▼]               │
│                                     │
│  Schedule: [Now ▼]                  │
│                                     │
│  [Preview] [Send Test] [Broadcast]  │
│                                     │
└─────────────────────────────────────┘
```

### Safety Features

```
Broadcast Protections:
• Rate limiting per admin
• Message approval workflow
• Character limit (400 max)
• No external links by default
• Required opt-in for marketing
• Emergency approval chain
```

---

## Future Scalability

### Million-User Support

```yaml
horizontal_scaling:
  strategy:
    - stateless_backend
    - database_read_replicas
    - redis_clustering
    - cdn_for_static
    
  database:
    - connection_pooling
    - read_replicas
    - table_partitioning
    - archive_old_data
    
  caching:
    - redis_cache_layer
    - aggressive_caching
    - cache_invalidation
```

### Multi-Language Support

```yaml
i18n_architecture:
  supported_languages:
    - English (en)
    - Spanish (es)
    - Russian (ru)
    - Arabic (ar) [RTL]
    - Chinese (zh)
    - Japanese (ja)
    - German (de)
    - French (fr)
    - Portuguese (pt)
    - Turkish (tr)
    
  localization_scope:
    - bot_messages
    - mini_app_ui
    - notifications
    - push_templates
    - event_texts
    
  management:
    - translation_files
    - in_context_editing
    - language_detection
    - fallback_to_english
```

### Segmented Notifications

```yaml
segmentation:
  by_activity:
    - active (daily)
    - regular (3-6/week)
    - casual (1-2/week)
    - dormant (none)
    
  by_progress:
    - beginner (level 1-10)
    - intermediate (level 11-30)
    - advanced (level 31+)
    
  by_preferences:
    - notification_frequency
    - preferred_events
    - favorite_eras
    
  by_engagement:
    - ad_watchers
    - spenders
    - collectors
    - competitive
```

### Personalized Notifications

```yaml
personalization:
  content_personalization:
    - use_username
    - reference_progress
    - mention achievements
    - show relevant_eras
    
  timing_personalization:
    - based_on_timezone
    - based_on_activity_pattern
    - respect_quiet_hours
    - optimal_send_time
    
  frequency_personalization:
    - max_per_user
    - based_on_activity
    - based_on_preference
    - progressive_optimization
```

---

## Security Considerations

### Bot Security
```
• Bot token stored securely
• Command validation
• Rate limiting per user
• Anti-spam protection
• No sensitive data in messages
```

### Mini App Security
```
• initData validation
• HTTPS enforced
• CSP headers
• Input sanitization
• XSS prevention
```

### Data Privacy
```
• GDPR compliance
• User consent for notifications
• Data retention policies
• Right to deletion
• No third-party data sharing
```

---

## Technical Integration Points

### Telegram Bot API
```
Endpoints Used:
• sendMessage
• editMessageText
• answerCallbackQuery
• getChatMember
• setWebhook
• getWebhookInfo
```

### Telegram Mini App SDK
```
Features Used:
• initData validation
• ready()
• expand()
• close()
• sendData()
• onEvent()
```

### Supabase
```
Features Used:
• PostgreSQL
• Realtime
• Auth (Telegram)
• Edge Functions
• Storage
```

---

## Documentation References

Related Documents:
- `system.md` — Overall system architecture
- `knowledge/notifications.md` — Detailed notification types
- `knowledge/retention.md` — Retention mechanics
- `knowledge/database-schema.md` — Database architecture
- `knowledge/adsgram.md` — Ad integration

---

*The Telegram ecosystem is the bridge between players and the game. Keep it simple, responsive, and respectful.*
