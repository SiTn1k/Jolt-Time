# Jolt Time — Bot Commands Architecture

## Overview

The Telegram Bot Commands Architecture provides a comprehensive, scalable command system for Jolt Time's Telegram Bot. The architecture positions commands as strategic entry points into the ecosystem, driving engagement and Mini App usage while maintaining organizational clarity as the feature set expands.

> **Philosophy:** Commands are not just shortcuts — they are the conversation layer that bridges Telegram messaging with the rich Mini App experience.

---

## 1. Command Categories

### 1.1 Core Commands

Essential commands available to all users without prerequisites.

| Command | Purpose | Access |
|---------|---------|--------|
| **/start** | Initialize bot, trigger onboarding | All users |
| **/help** | Display command list and guidance | All users |
| **/app** | Launch Mini App | All users |
| **/menu** | Display inline command menu | All users |

### 1.2 Player Commands

Commands for managing personal player information and progression.

| Command | Purpose | Access |
|---------|---------|--------|
| **/profile** | View player profile overview | All users |
| **/stats** | View detailed player statistics | All users |
| **/achievements** | View achievements progress | All users |
| **/progress** | View progression summary | All users |
| **/level** | View current level and XP | All users |

### 1.3 Museum Commands

Commands for museum and artifact management.

| Command | Purpose | Access |
|---------|---------|--------|
| **/museum** | View museum overview | All users |
| **/artifacts** | List collected artifacts | All users |
| **/collections** | View collection progress | All users |
| **/exhibits** | View current exhibitions | All users |
| **/showcase** | Share museum publicly | All users |

### 1.4 Event Commands

Commands for event participation and information.

| Command | Purpose | Access |
|---------|---------|--------|
| **/events** | List current active events | All users |
| **/seasonal** | View seasonal content | All users |
| **/missions** | View mission status | All users |
| **/leaderboard** | View event leaderboards | All users |
| **/rewards** | View pending rewards | All users |

### 1.5 Social Commands

Commands for social interactions and community features.

| Command | Purpose | Access |
|---------|---------|--------|
| **/referral** | View referral information | All users |
| **/invite** | Generate invite link | All users |
| **/guild** | View guild information | Guild members |
| **/friends** | Manage friends list | All users |
| **/community** | Access community links | All users |

### 1.6 Support Commands

Commands for help and issue resolution.

| Command | Purpose | Access |
|---------|---------|--------|
| **/support** | Open support ticket | All users |
| **/faq** | View frequently asked questions | All users |
| **/feedback** | Submit feedback | All users |
| **/report** | Report issue or abuse | All users |
| **/settings** | Manage notification settings | All users |

### 1.7 Administrative Commands

Commands for moderation and operational management.

| Command | Purpose | Access |
|---------|---------|--------|
| **/announce** | Send announcement | Administrators |
| **/mod** | Moderation actions | Moderators |
| **/stats** | View system statistics | Administrators |
| **/broadcast** | Broadcast message | Administrators |
| **/diagnose** | Run diagnostics | Administrators |

---

## 2. Bot Command Philosophy

### 2.1 Core Principles

Commands serve as strategic touchpoints that drive ecosystem engagement:

**Be Discoverable**
- `/help` command always accessible
- Inline keyboard menu for quick access
- Command suggestions as user types
- Progressive disclosure of advanced commands
- Contextual hints about available commands

**Be Intuitive**
- Commands match user mental models
- Natural language where possible
- Consistent naming conventions
- Predictable command behavior
- Clear feedback on command execution

**Drive Engagement**
- Commands encourage Mini App usage
- Reward-related commands highlight value
- Event commands create urgency
- Social commands foster community
- Achievement commands celebrate progress

**Encourage Mini App Usage**
- Commands launch relevant Mini App screens
- Deep links carry context from bot conversations
- Bot serves as gateway, not destination
- Seamless transition from chat to app
- Rich media previews for Mini App content

### 2.2 Strategic Positioning

```
COMMAND SYSTEM VALUE:
├── Gateway — Entry point to full experience
├── Companion — Complementary to Mini App
├── Accessibility — Quick actions without app open
├── Engagement — Notifications with command actions
├── Support — Help without leaving Telegram
└── Community — Social features in familiar interface
```

---

## 3. Command Architecture

The command architecture follows a four-layer processing pipeline:

### 3.1 Command Layer

Raw command parsing and initial handling.

```
┌─────────────────────────────────────────────────────────┐
│                      COMMAND LAYER                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Command Parser:                                         │
│  ├── Extract command name (/command)                    │
│  ├── Parse arguments (arg1 arg2 --flag)                 │
│  ├── Handle aliases (shortcuts)                          │
│  └── Normalize input (lowercase, trim)                  │
│                                                          │
│  Command Registry:                                       │
│  ├── command_name → handler mapping                     │
│  ├── permission requirements                            │
│  ├── argument schema definitions                        │
│  └── command metadata (description, category)           │
│                                                          │
│  Input Normalization:                                    │
│  ├── Strip leading/trailing whitespace                  │
│  ├── Convert to lowercase for matching                  │
│  ├── Handle Unicode normalization                       │
│  └── Detect and parse flags (--option value)            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Routing Layer

Directs parsed commands to appropriate handlers.

```
┌─────────────────────────────────────────────────────────┐
│                      ROUTING LAYER                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Route Resolution:                                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Input: /profile achievements --compact          │    │
│  │                                                  │    │
│  │  Route:                                          │    │
│  │  ├── Command: profile                            │    │
│  │  ├── Subcommand: achievements                    │    │
│  │  ├── Flags: { compact: true }                    │    │
│  │  └── Handler: ProfileCommand.achievements()      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Routing Logic:                                          │
│  ├── Exact match priority                               │
│  ├── Partial match for subcommands                      │
│  ├── Alias resolution                                   │
│  ├── Permission check after routing                     │
│  └── Fallback to help or default                        │
│                                                          │
│  Subcommand Support:                                     │
│  ├── /profile stats — View statistics                   │
│  ├── /profile settings — Manage settings                │
│  ├── /event list — List events                          │
│  └── /event info {id} — Event details                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Service Layer

Business logic execution for commands.

```
┌─────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Command Services:                                       │
│  ├── ProfileService — User data retrieval               │
│  ├── MuseumService — Artifact and collection data       │
│  ├── EventService — Event information and status        │
│  ├── SocialService — Referrals, friends, guilds         │
│  ├── SupportService — Tickets and feedback              │
│  ├── AnalyticsService — Command tracking                │
│  └── MiniAppService — Deep link generation              │
│                                                          │
│  Service Responsibilities:                               │
│  ├── Data aggregation from multiple sources             │
│  ├── Business rule enforcement                          │
│  ├── Response formatting for Telegram                   │
│  ├── Error transformation to user messages              │
│  └── Logging and analytics integration                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Analytics Layer

Command usage tracking and performance measurement.

```
┌─────────────────────────────────────────────────────────┐
│                    ANALYTICS LAYER                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Event Types:                                            │
│  ├── command_executed — Command was run                 │
│  ├── command_failed — Command errored                   │
│  ├── command_completed — Command succeeded               │
│  ├── mini_app_launched — User opened Mini App           │
│  └── deep_link_used — Deep link activated               │
│                                                          │
│  Metrics:                                               │
│  ├── Command frequency (per command, per user)          │
│  ├── Command success rate                               │
│  ├── Average response time                              │
│  ├── Mini App launch conversion                         │
│  └── Engagement impact                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Core Commands Architecture

### 4.1 /start Command

**Responsibilities:**
- Initialize new user session
- Trigger user registration if new
- Process referral codes from start_param
- Show welcome message with quick actions
- Generate deep link for Mini App

**Flow:**
```
User sends /start
         │
         ▼
    Check start_param
         │
    ┌────┴────┐
    │         │
 Referral   No Referral
    │         │
    ▼         ▼
 Process  Show Welcome
 Referral    │
    │        ▼
    │    Show Quick Actions
    │
    ▼
Launch Mini App with Context
```

### 4.2 /help Command

**Responsibilities:**
- Display available commands grouped by category
- Show contextual help based on user permissions
- Provide search functionality for commands
- Link to detailed documentation
- Update based on user progress (show advanced later)

**Output Structure:**
```
📚 Jolt Time Commands

🔰 Getting Started
/start - Start your journey
/app - Open Mini App
/help - Show this help

👤 Your Profile
/profile - View your profile
/stats - Your statistics
/achievements - View achievements

🏛️ Museum
/museum - Your museum
/artifacts - Your artifacts
/collections - Collections

🎉 Events
/events - Current events
/missions - Your missions
/leaderboard - Rankings

👥 Social
/referral - Invite friends
/guild - Guild info
/friends - Friends list

❓ Support
/faq - Frequently asked
/support - Get help
/feedback - Send feedback
```

### 4.3 /app Command

**Responsibilities:**
- Generate deep link to Mini App
- Optionally specify screen destination
- Show Mini App preview card
- Track Mini App launch from bot

**Usage:**
- `/app` — Launch to home screen
- `/app museum` — Launch to museum
- `/app event` — Launch to current event

### 4.4 /menu Command

**Responsibilities:**
- Display inline keyboard with command shortcuts
- Provide quick access to frequent actions
- Update based on context and permissions
- Show dynamic content (pending rewards, active events)

**Keyboard Structure:**
```
┌─────────────────────────────────────┐
│ 🎮 Play Now    │  📊 Profile       │
├─────────────────────────────────────┤
│ 🏛️ Museum     │  🎁 Rewards       │
├─────────────────────────────────────┤
│ 🎉 Events     │  👥 Invite        │
└─────────────────────────────────────┘
```

---

## 5. Player Commands Architecture

### 5.1 /profile Command

**Responsibilities:**
- Display player profile overview
- Show avatar, name, level, XP progress
- Display member since date
- Show quick stats (artifacts, events, rank)
- Link to detailed profile in Mini App

**Response:**
```
👤 YOUR PROFILE

┌─────────────────────────────────────┐
│  🖼️ Avatar                          │
│  PlayerName                         │
│  ⭐ Level 42 — Time Traveler        │
│  ████████░░ 4,200/5,000 XP          │
└─────────────────────────────────────┘

📊 Quick Stats
• Artifacts: 156
• Events Won: 23
• Guild: Time Guardians

🏆 Top Achievement
Legendary Collector
{Show in Mini App button}
```

### 5.2 /stats Command

**Responsibilities:**
- Display detailed player statistics
- Gameplay metrics (battles, missions, etc.)
- Historical data (join date, play time)
- Comparative rankings
- Export data option

**Response:**
```
📊 YOUR STATISTICS

⏱️ Time Traveled
• Sessions: 342
• Total Time: 127 hours
• Avg Session: 22 min

🏆 Achievements
• Unlocked: 47/120
• Completion: 39%
• Rare Achievements: 5

🎮 Gameplay
• Battles: 89 (67% win rate)
• Missions: 234 completed
• Expeditions: 45 completed

💎 Economy
• Total Earned: 45,230 Dust
• Total Spent: 38,900 Dust
• Net: +6,330 Dust
```

### 5.3 /achievements Command

**Responsibilities:**
- List achievements with progress
- Show recently unlocked achievements
- Display locked achievements with hints
- Categorize by type/rarity
- Link to full achievement gallery in Mini App

**Response:**
```
🏆 ACHIEVEMENTS

Recently Unlocked 🔓
• Time Master (Yesterday)
• Artifact Hunter (3 days ago)

In Progress 📍
• Collector: 156/200 artifacts (78%)
• Explorer: 7/10 eras visited (70%)
• Battler: 45/50 wins (90%)

Locked 🔒
• Legendary Collector (200 artifacts)
• Guild Champion (Win guild event)
• Time God (Reach level 100)
```

### 5.4 /progress Command

**Responsibilities:**
- Display overall progression summary
- Era completion progress
- Current quest lines
- Battle pass progress
- Daily/weekly task status

---

## 6. Museum Commands Architecture

### 6.1 /museum Command

**Responsibilities:**
- Display museum overview
- Show collection percentage by era
- Display featured artifact
- Recent acquisitions
- Link to full museum in Mini App

**Response:**
```
🏛️ YOUR MUSEUM

Collection: 156/500 artifacts (31%)

Era Progress:
🪨 Prehistoric     ██████░░ 65%
🏺 Ancient         ████░░░░ 42%
⚔️ Medieval        ████████ 78%
🏰 Renaissance     ███░░░░░ 35%
🔬 Modern          ██░░░░░░ 18%

⭐ Featured: Excalibur (Legendary)
New: Roman Gladius acquired today!

[View Full Museum →]
```

### 6.2 /artifacts Command

**Responsibilities:**
- List recent artifacts
- Show artifact count by rarity
- Display newest acquisition
- Search/filter artifacts
- View specific artifact details

**Response:**
```
💎 YOUR ARTIFACTS

Total: 156 artifacts

By Rarity:
⭐ Mythic: 3
🔮 Legendary: 12
💜 Epic: 24
🔵 Rare: 47
⚪ Common: 70

Recent Acquisitions:
• Roman Gladius (Rare) - 2h ago
• Greek Amphora (Common) - 1d ago
• Viking Axe (Epic) - 3d ago

[Browse All →]
```

### 6.3 /collections Command

**Responsibilities:**
- Display collection progress
- Show completion percentages
- Highlight missing pieces
- Show collection rewards earned
- Link to collection management in Mini App

### 6.4 /exhibits Command

**Responsibilities:**
- List current exhibitions
- Show exhibit duration
- Display exhibit rewards
- Link to exhibit in Mini App
- Highlight rare/special exhibits

### 6.5 /showcase Command

**Responsibilities:**
- Generate shareable museum link
- Create public museum profile
- Display sharing options
- Track showcase views
- Enable comparison with friends

---

## 7. Event Commands Architecture

### 7.1 /events Command

**Responsibilities:**
- List all active events
- Show time remaining
- Display event types (battle, collection, seasonal)
- Highlight featured events
- Link to event details in Mini App

**Response:**
```
🎉 ACTIVE EVENTS

🔥 Featured
Battle Arena Championship
⏱️ Ends in 2d 14h | 1,247 participants
[Join Now →]

📦 Limited Time
Spring Collection Event
⏱️ Ends in 5d 8h | Collect Roman artifacts
[Participate →]

⚔️ Ongoing
Weekly Boss Battle
⏱️ Resets in 3d | Defeat the Dragon
[Enter Battle →]
```

### 7.2 /seasonal Command

**Responsibilities:**
- Display current seasonal content
- Show seasonal storyline progress
- List seasonal rewards
- Display seasonal challenges
- Link to seasonal area in Mini App

### 7.3 /missions Command

**Responsibilities:**
- List active missions
- Show mission progress
- Display mission rewards
- Highlight urgent deadlines
- Link to mission board in Mini App

**Response:**
```
📋 YOUR MISSIONS

🔥 Active
├── Main Quest: The Roman Discovery
│   Progress: 65% | Reward: 500 Dust
├── Daily: Complete 3 battles
│   Progress: 1/3 | Reward: 50 Dust
└── Event: Collect 10 Roman artifacts
    Progress: 7/10 | Reward: Epic Capsule

⏱️ Urgent
• Daily Mission expires in 4h
• Event ends in 1d 12h
```

### 7.4 /leaderboard Command

**Responsibilities:**
- Display relevant leaderboards
- Show user rank and nearby players
- Display top players
- Filter by event/type
- Link to full leaderboard in Mini App

**Response:**
```
🏆 LEADERBOARD
Battle Arena Championship

Your Rank: #127 of 1,247
┌─────────────────────────────────────┐
│ 🥇 @ChampionPlayer — 15,420 pts     │
│ 🥈 @TopGamer — 14,890 pts           │
│ 🥉 @BattleMaster — 14,200 pts       │
│ ...                                 │
│ 📍 You — 8,340 pts                  │
│ ...                                 │
│ #124 @NearbyPlayer1 — 8,410 pts     │
│ #125 @NearbyPlayer2 — 8,380 pts     │
└─────────────────────────────────────┘
[Full Rankings →]
```

---

## 8. Social Commands Architecture

### 8.1 /referral Command

**Responsibilities:**
- Display referral statistics
- Show referral link
- List recent referrals
- Display pending rewards
- Explain referral program

**Response:**
```
👥 YOUR REFERRALS

Your Invite Link:
t.me/jolttimebot?start=ref_ABC123XYZ
[Copy Link] [Share]

📊 Statistics
• Total Invited: 12 players
• Active: 8 (67%)
• Lifetime Rewards: 2,450 Dust

🎁 Pending Rewards
• 4 more referrals for Epic Capsule!

[Referral Leaderboard →]
```

### 8.2 /invite Command

**Responsibilities:**
- Generate fresh invite link
- Allow custom invite message
- Show share options
- Track invite performance
- Link to invite management in Mini App

### 8.3 /guild Command

**Responsibilities:**
- Display guild information (if member)
- Show guild roster
- Display guild statistics
- Show guild rankings
- Link to guild management in Mini App

**Response:**
```
⚔️ GUILD: Time Guardians

Rank: #23 Global | 47 members

👑 Leader: @GuildMaster
👔 Officers: 4
👥 Members: 42

📊 Guild Stats
• Total XP: 1.2M
• Weekly Contribution: 45K
• Events Won: 12

[View Members] [Guild Chat] [Settings]
```

### 8.4 /friends Command

**Responsibilities:**
- List friends
- Show friend activity
- Display friend statistics
- Send/receive friend requests
- Link to friend management in Mini App

### 8.5 /community Command

**Responsibilities:**
- Provide community links
- Show social media channels
- Display official group links
- List community guidelines
- Link to community hub

---

## 9. Support Commands Architecture

### 9.1 /support Command

**Responsibilities:**
- Open support ticket
- Categorize issue type
- Collect issue details
- Assign priority
- Provide ticket status

**Flow:**
```
User sends /support
         │
         ▼
    Select Issue Type
    (Bug/Question/Account/Other)
         │
         ▼
    Enter Issue Description
         │
         ▼
    Confirm & Submit
         │
         ▼
    Ticket Created
    Ticket ID: #12345
    Expected Response: 24h
```

### 9.2 /faq Command

**Responsibilities:**
- Display categorized FAQs
- Search functionality
- Show popular questions
- Link to detailed help articles
- Collect unresolved questions

**Response:**
```
❓ FREQUENTLY ASKED

🔰 Getting Started
• How do I play?
• What are artifacts?
• How do I earn rewards?

💎 Economy
• What is Chrono Dust?
• How do I get more artifacts?
• What are Time Shards for?

🎮 Gameplay
• How do battles work?
• What are expeditions?
• How do I level up?

🎁 Rewards
• How do referrals work?
• What are daily rewards?
• How do I watch ads?

[Search FAQs] [Contact Support]
```

### 9.3 /feedback Command

**Responsibilities:**
- Collect user feedback
- Categorize feedback type
- Allow feature suggestions
- Acknowledge submission
- Track feedback for product decisions

### 9.4 /report Command

**Responsibilities:**
- Report abuse or violations
- Categorize report type
- Collect evidence
- Ensure user safety
- Link to moderation team

### 9.5 /settings Command

**Responsibilities:**
- Manage notification preferences
- Update display settings
- Configure quiet hours
- Set language preference
- Manage privacy settings

**Response:**
```
⚙️ YOUR SETTINGS

🔔 Notifications
[✓] Daily Reminders
[✓] Event Alerts
[✓] Achievement Unlocks
[✓] Friend Activity
[ ] Marketing Messages

🌙 Quiet Hours
10:00 PM - 8:00 AM

🌐 Language
English

[Open Full Settings →]
```

---

## 10. Administrative Commands Architecture

### 10.1 /announce Command

**Responsibilities:**
- Send announcements to users
- Target specific user segments
- Include rich media
- Track delivery and engagement
- Schedule announcements

**Permissions:** Administrator only

**Usage:**
```
/announce --event "New Feature Release"
--segment all
--media image.jpg
--schedule 2024-12-25 10:00
```

### 10.2 /mod Command

**Responsibilities:**
- Moderate user content
- Warn/suspend users
- Remove inappropriate content
- View moderation logs
- Manage moderation queue

**Permissions:** Moderator only

**Subcommands:**
- `/mod warn {user_id} {reason}`
- `/mod suspend {user_id} {duration}`
- `/mod mute {user_id} {duration}`
- `/mod view {user_id}`

### 10.3 /stats Command (Admin)

**Responsibilities:**
- View system-wide statistics
- Monitor bot performance
- Track user growth
- Analyze command usage
- Generate reports

**Permissions:** Administrator only

**Response:**
```
📊 SYSTEM STATISTICS

👥 Users
• Total: 125,430
• Active (7d): 45,230 (36%)
• Active (30d): 78,900 (63%)

📨 Commands (24h)
• /start: 12,340
• /profile: 8,920
• /events: 6,540
• /museum: 5,230

🤖 Bot Health
• Uptime: 99.9%
• Avg Response: 145ms
• Errors: 0.02%
```

### 10.4 /broadcast Command

**Responsibilities:**
- Send messages to all users
- Target specific segments
- Track delivery statistics
- A/B test messages
- Schedule broadcasts

### 10.5 /diagnose Command

**Responsibilities:**
- Run system diagnostics
- Check service health
- Verify database connections
- Test API integrations
- Generate debug reports

---

## 11. Command Routing Standards

### 11.1 Command Parsing

```
PARSING RULES:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Input: /profile achievements --compact                  │
│                                                           │
│  Parsing Steps:                                          │
│  1. Extract command prefix (/)                           │
│  2. Split by whitespace                                  │
│  3. First token = command name                           │
│  4. Second token (if exists) = subcommand                │
│  5. Remaining tokens = arguments                         │
│  6. Parse flags (--key value)                            │
│                                                           │
│  Result:                                                 │
│  {                                                       │
│    command: 'profile',                                   │
│    subcommand: 'achievements',                           │
│    args: [],                                             │
│    flags: { compact: true }                              │
│  }                                                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 11.2 Routing

```
ROUTING RULES:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Route Resolution Order:                                 │
│  1. Check exact command match                            │
│  2. Check command + subcommand match                     │
│  3. Check alias match                                    │
│  4. Check partial match (prefix)                         │
│  5. Fallback to /help                                    │
│                                                           │
│  Aliases:                                                │
│  ├── /p → /profile                                       │
│  ├── /m → /museum                                        │
│  ├── /e → /events                                        │
│  ├── /a → /achievements                                  │
│  └── /i → /invite                                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 11.3 Validation

```
VALIDATION RULES:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Command Validation:                                     │
│  ├── Command exists in registry                          │
│  ├── User has required permissions                       │
│  ├── Required arguments provided                         │
│  ├── Argument types are correct                          │
│  ├── Arguments within valid ranges                       │
│  └── Rate limit not exceeded                             │
│                                                           │
│  Error Responses:                                        │
│  ├── Unknown command → Suggest similar commands          │
│  ├── Missing args → Show correct usage                   │
│  ├── Invalid args → Show valid options                   │
│  └── Permission denied → Explain required access         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 11.4 Fallback Handling

```
FALLBACK HANDLING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Fallback Scenarios:                                     │
│  ├── Unknown command → Suggest similar or show /help     │
│  ├── Command error → Show user-friendly error            │
│  ├── Service unavailable → Retry suggestion              │
│  ├── Rate limited → Explain cooldown                     │
│  └── Permission denied → Explain required level          │
│                                                           │
│  User Experience:                                        │
│  ├── Always helpful, never technical                     │
│  ├── Provide actionable next steps                       │
│  ├── Log for improvement tracking                        │
│  └── Suggest related commands                            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 12. Permission Architecture

### 12.1 Permission Levels

```
PERMISSION HIERARCHY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  SYSTEM (Level 5)                                        │
│  ├── System commands only                                │
│  ├── Infrastructure management                           │
│  └── Emergency actions                                   │
│                                                           │
│  ADMINISTRATOR (Level 4)                                 │
│  ├── /announce, /broadcast                               │
│  ├── /stats (admin), /diagnose                          │
│  ├── User management                                     │
│  └── Configuration changes                               │
│                                                           │
│  MODERATOR (Level 3)                                     │
│  ├── /mod commands                                       │
│  ├── View user information                               │
│  ├── Issue warnings/suspensions                          │
│  └── Access moderation logs                              │
│                                                           │
│  PLAYER (Level 2)                                        │
│  ├── All standard player commands                        │
│  ├── Guild commands (if member)                          │
│  ├── Support tickets                                     │
│  └── Social features                                     │
│                                                           │
│  GUEST (Level 1)                                         │
│  ├── /start, /help, /app, /menu                         │
│  ├── Basic information commands                          │
│  └── Cannot access personal data                         │
│                                                           │
│  PUBLIC (Level 0)                                        │
│  └── Limited to non-personalized content                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 12.2 Player Permissions

```
PLAYER PERMISSIONS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Standard Player (authenticated via Mini App):           │
│  ├── Access to all player commands                       │
│  ├── View own profile and statistics                     │
│  ├── Manage own settings                                 │
│  ├── Create support tickets                              │
│  ├── Access referral system                              │
│  └── Participate in events                               │
│                                                           │
│  Unauthenticated (start without Mini App):               │
│  ├── Limited profile access                              │
│  ├── Cannot view personal stats                          │
│  ├── Cannot create tickets                               │
│  └── Redirected to Mini App for full access              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 12.3 Moderator Permissions

```
MODERATOR PERMISSIONS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Moderator commands require role assignment              │
│                                                           │
│  View Permissions:                                       │
│  ├── View any user's public profile                      │
│  ├── View user's command history                         │
│  ├── View moderation logs                                │
│  ├── View reports queue                                  │
│                                                           │
│  Action Permissions:                                     │
│  ├── Issue warnings to users                             │
│  ├── Temporarily mute users                              │
│  ├── View user private data (for investigations)         │
│  └── Escalate to administrators                          │
│                                                           │
│  Restrictions:                                           │
│  ├── Cannot permanently ban                              │
│  ├── Cannot access admin commands                        │
│  ├── Cannot modify system configuration                  │
│  └── Actions logged and auditable                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 12.4 Administrator Permissions

```
ADMINISTRATOR PERMISSIONS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Full system access with accountability                  │
│                                                           │
│  User Management:                                        │
│  ├── Permanent bans                                      │
│  ├── Account recovery                                    │
│  ├── Permission modification                             │
│  └── Access recovery                                     │
│                                                           │
│  System Operations:                                      │
│  ├── Configuration changes                               │
│  ├── Feature flags                                       │
│  ├── Scheduled announcements                             │
│  └── Emergency shutdown                                  │
│                                                           │
│  Monitoring:                                             │
│  ├── Full statistics access                              │
│  ├── System diagnostics                                  │
│  ├── Log access                                          │
│  └── Performance metrics                                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 12.5 System Permissions

```
SYSTEM PERMISSIONS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Automated system commands (not human-initiated)         │
│                                                           │
│  Used For:                                               │
│  ├── Scheduled maintenance notifications                 │
│  ├── Automated alert broadcasts                          │
│  ├── System health checks                                │
│  └── Emergency protocols                                 │
│                                                           │
│  Characteristics:                                        │
│  ├── No user attribution                                 │
│  ├── Special system flag                                 │
│  ├── Fully logged                                        │
│  └── Limited to critical functions                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 13. Mini App Integration Standards

### 13.1 Mini App Launching

```
MINI APP LAUNCH COMMANDS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Standard Launch:                                        │
│  /app → Opens Mini App to home screen                   │
│                                                           │
│  Contextual Launch:                                      │
│  /app {screen} → Opens specific screen                  │
│  ├── /app museum → Museum screen                        │
│  ├── /app battle → Battle screen                        │
│  ├── /app events → Events screen                        │
│  └── /app profile → Profile screen                      │
│                                                           │
│  Deep Link Generation:                                   │
│  t.me/jolttimebot?start=screen_{screenName}             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 13.2 Contextual Navigation

```
CONTEXT PASSING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Bot → Mini App Context Flow:                            │
│                                                           │
│  User in Bot:                                            │
│  Views artifact via /artifacts                           │
│  Clicks "View in Mini App"                               │
│                                                           │
│  Deep Link Generated:                                    │
│  t.me/jolttimebot?start=artifact_{artifactId}           │
│                                                           │
│  Mini App Receives:                                      │
│  ├── Screen: artifact_detail                             │
│  ├── Artifact ID: {artifactId}                           │
│  └── Source: bot_command                                 │
│                                                           │
│  Mini App Renders:                                       │
│  Full artifact detail screen with context                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 13.3 Deep Link Routing

```
DEEP LINK ROUTING FROM BOT:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Supported Routes:                                       │
│  ├── /app → Home screen                                 │
│  ├── /app museum → Museum                               │
│  ├── /app artifact/{id} → Artifact detail               │
│  ├── /app event/{id} → Event detail                     │
│  ├── /app mission/{id} → Mission detail                 │
│  ├── /app battle → Battle screen                        │
│  ├── /app profile → Profile                             │
│  └── /app settings → Settings                           │
│                                                           │
│  Routing Implementation:                                 │
│  ├── Bot generates link with start_param                │
│  ├── Mini App reads start_param on load                 │
│  ├── Router parses and routes to screen                 │
│  └── Context passed to screen component                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 13.4 User Onboarding

```
ONBOARDING INTEGRATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  New User Flow:                                          │
│                                                           │
│  /start received                                         │
│         │                                                │
│         ▼                                                │
│  Check if new user (via start_param)                     │
│         │                                                │
│    ┌────┴────┐                                           │
│    │         │                                           │
│  New      Returning                                     │
│    │         │                                           │
│    ▼         ▼                                           │
│ Welcome   Personalized                                   │
│ Message   Message                                        │
│    │         │                                           │
│    ▼         ▼                                           │
│ /app onboarding → /app home (with context)              │
│                                                           │
│ Onboarding Mini App Flow:                                │
│ 1. Brief intro screens                                   │
│ 2. Create profile                                        │
│ 3. Select first era                                      │
│ 4. Collect first artifact                                │
│ 5. Complete first mission                                │
│ 6. Share achievement                                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 14. Analytics Architecture

### 14.1 Command Usage Tracking

```
COMMAND ANALYTICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Tracked Events:                                         │
│  ├── command_executed                                    │
│  │   ├── command_name                                    │
│  │   ├── user_id                                         │
│  │   ├── timestamp                                       │
│  │   ├── arguments (anonymized)                          │
│  │   └── session_id                                      │
│  │                                                      │
│  ├── command_completed                                   │
│  │   ├── command_name                                    │
│  │   ├── user_id                                         │
│  │   ├── duration_ms                                     │
│  │   └── success                                         │
│  │                                                      │
│  └── command_failed                                      │
│      ├── command_name                                    │
│      ├── user_id                                         │
│      ├── error_type                                      │
│      └── error_message (sanitized)                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 14.2 Command Success Rates

```
SUCCESS RATE METRICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Per-Command Metrics:                                    │
│  ├── Total executions                                    │
│  ├── Successful executions                               │
│  ├── Failed executions                                   │
│  ├── Success rate (%)                                    │
│  ├── Average response time                               │
│  └── P95 response time                                   │
│                                                           │
│  Failure Categories:                                     │
│  ├── User error (invalid input)                          │
│  ├── Permission denied                                   │
│  ├── Service unavailable                                 │
│  ├── Rate limited                                        │
│  └── System error                                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 14.3 Engagement Impact

```
ENGAGEMENT ANALYTICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Command → Mini App Conversion:                          │
│  ├── Users who ran /app command                          │
│  ├── Users who opened Mini App from bot                  │
│  ├── Conversion rate                                     │
│  │                                                      │
│  ├── Session duration after launch                       │
│  ├── Actions taken in Mini App                          │
│  └── Day 1 retention of launched users                   │
│                                                           │
│  Cross-Command Behavior:                                 │
│  ├── Commands per session                                │
│  ├── Command sequences                                   │
│  ├── Mini App launches per command                       │
│  └── Return rate after command                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 14.4 Conversion Impact

```
CONVERSION ANALYTICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Funnel Tracking:                                        │
│                                                           │
│  Command → Mini App → Registration → Retention           │
│                                                           │
│  Metrics:                                                │
│  ├── Command-to-Mini-App rate                            │
│  ├── Mini-App-to-registration rate                       │
│  ├── Registration-to-retained rate                       │
│  ├── Revenue per command user                            │
│  │                                                      │
│  Command Attribution:                                    │
│  ├── Which commands correlate with retention             │
│  ├── Which commands drive purchases                      │
│  ├── Which commands indicate high-value users            │
│  └── Optimal command sequences                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 15. AdsGram Integration Notes

### 15.1 Monetization Campaigns

```
ADSGRAM + BOT COMMANDS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Campaign Integration:                                   │
│  ├── /rewards command highlights ad opportunities        │
│  ├── /daily command shows daily ad bonus                 │
│  ├── Event commands mention ad-supported rewards         │
│  └── Profile shows "Watch Ad" quick action               │
│                                                           │
│  Bot Messaging for Ads:                                  │
│  ├── Notify users of double-reward weekends              │
│  ├── Highlight seasonal ad bonuses                       │
│  ├── Show ad earnings in /stats                          │
│  └── Recommend watching ads for specific goals           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 15.2 Reward Campaigns

```
REWARD CAMPAIGN SUPPORT:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Bot Role in Reward Campaigns:                           │
│  ├── Announce reward campaign start                      │
│  ├── Send reminders for bonus periods                    │
│  ├── Provide reward status via /rewards                  │
│  ├── Link to ad viewing in Mini App                      │
│  │                                                      │
│  Commands with Ad Integration:                           │
│  ├── /rewards — View pending rewards including ads      │
│  ├── /daily — Daily ad bonus status                     │
│  ├── /boost — Temporary boost from watching ad          │
│  └── /special — Limited-time ad rewards                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 15.3 Acquisition Campaigns

```
ACQUISITION CAMPAIGN SUPPORT:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Bot Commands for Acquisition:                           │
│  ├── /start with campaign parameter tracking             │
│  ├── /invite generates trackable referral links          │
│  ├── /share for viral content sharing                    │
│  │                                                      │
│  Tracking Integration:                                   │
│  ├── Campaign ID in start_param                         │
│  ├── Source tracking for analytics                      │
│  ├── Conversion attribution to campaign                  │
│  └── Revenue per acquired user by campaign               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 15.4 Engagement Campaigns

```
ENGAGEMENT CAMPAIGN SUPPORT:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Bot Commands for Engagement:                            │
│  ├── /events — Active event listing                      │
│  ├── /missions — Daily/weekly mission status            │
│  ├── /streak — Streak protection options                │
│  │                                                      │
│  Ad Integration for Engagement:                          │
│  ├── "Watch ad to extend streak" messaging              │
│  ├── "Watch ad to complete mission" option               │
│  ├── "Watch ad for extra attempts"                       │
│  └── Seasonal ad bonus announcements                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 16. Error Handling Standards

### 16.1 Invalid Commands

```
INVALID COMMAND HANDLING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Scenarios:                                              │
│  ├── Unknown command                                     │
│  ├── Misspelled command                                  │
│  ├── Wrong subcommand                                    │
│  └── Invalid argument format                             │
│                                                           │
│  Response Strategy:                                      │
│  ├── Show "Command not found" with suggestion            │
│  ├── Suggest similar commands                            │
│  ├── Show correct usage for similar command              │
│  └── Link to /help for all commands                      │
│                                                           │
│  Example:                                                │
│  "/profle" → "Did you mean /profile? Type /help for     │
│   all available commands."                               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 16.2 Permission Failures

```
PERMISSION FAILURE HANDLING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Scenarios:                                              │
│  ├── User not authenticated                              │
│  ├── Insufficient permission level                       │
│  ├── Command disabled for user                           │
│  └── Rate limit exceeded                                 │
│                                                           │
│  Response Strategy:                                      │
│  ├── Explain what access is needed                       │
│  ├── Provide path to gain access (if applicable)         │
│  ├── Never expose sensitive permission details           │
│  └── Log for security monitoring                         │
│                                                           │
│  Example:                                                │
│  "/mod ban" (non-mod) → "This command requires          │
│   moderator permissions. Type /help to see available     │
│   commands."                                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 16.3 Unavailable Features

```
FEATURE UNAVAILABLE HANDLING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Scenarios:                                              │
│  ├── Feature under maintenance                           │
│  ├── Feature not yet released                            │
│  ├── Feature disabled for user's region                  │
│  └── Feature requires subscription                       │
│                                                           │
│  Response Strategy:                                      │
│  ├── Explain feature is temporarily unavailable          │
│  ├── Provide ETA if known                                │
│  ├── Suggest alternative actions                         │
│  ├── Link to where to learn more                         │
│                                                           │
│  Example:                                                │
│  "/guild" (guild feature disabled) → "Guilds are        │
│   coming soon! Add your name to the waitlist: /waitlist  │
│   Your current progress is saved for when guilds launch."│
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 16.4 Graceful Recovery

```
GRACEFUL RECOVERY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Recovery Patterns:                                      │
│  ├── Retry transient failures automatically              │
│  ├── Cache frequently accessed data                      │
│  ├── Provide offline-friendly responses                  │
│  ├── Degrade gracefully when services unavailable        │
│                                                           │
│  User-Facing Recovery:                                   │
│  ├── Always provide actionable next steps                │
│  ├── Never show raw error messages                       │
│  ├── Suggest alternatives when primary fails             │
│  ├── Log detailed error for debugging                    │
│                                                           │
│  Example Recovery Flow:                                  │
│  User's profile fails to load                            │
│  → "Unable to load your profile right now. Your data     │
│     is safe. Please try again in a moment."              │
│  → Offer /help as alternative                           │
│  → Log error for team to investigate                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 17. Future Expansion Notes

> **Note:** The following are conceptual future expansions. Implementation not scheduled.

### 17.1 AI Assistant Commands

```
AI ASSISTANT COMMANDS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Commands:                                     │
│  ├── /ask {question} — Ask game-related questions        │
│  ├── /recommend — Get personalized recommendations      │
│  ├── /history {topic} — Learn historical facts          │
│  ├── /tip {situation} — Get gameplay tips               │
│  │                                                      │
│  Features:                                               │
│  ├── Natural language understanding                      │
│  ├── Context-aware responses                             │
│  ├── Personalized to user's progress                     │
│  └── Learning from user interactions                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.2 Creator Economy Commands

```
CREATOR ECONOMY COMMANDS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Commands:                                     │
│  ├── /creator {handle} — View creator profile           │
│  ├── /subscribe {creator} — Subscribe to creator        │
│  ├── /content — Browse creator content                  │
│  ├── /earnings — View creator earnings                  │
│  │                                                      │
│  Features:                                               │
│  ├── Creator verification                                │
│  ├── Content discovery                                   │
│  ├── Subscription management                             │
│  └── Revenue tracking                                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.3 Web3 Commands

```
WEB3 COMMANDS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Commands:                                     │
│  ├── /wallet — Connect wallet                           │
│  ├── /balance — View token balance                      │
│  ├── /send — Send tokens                                │
│  ├── /nft {id} — View NFT details                       │
│  │                                                      │
│  Features:                                              │
│  ├── TON wallet integration                             │
│  ├── NFT display and management                          │
│  ├── Token transactions                                  │
│  └── Blockchain verification                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.4 NFT Commands

```
NFT COMMANDS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Commands:                                     │
│  ├── /myNFTs — View NFT collection                      │
│  ├── /mint {type} — Mint new NFT                        │
│  ├── /trade {nft_id} — Trade NFT                        │
│  ├── /airdrop — Claim NFT airdrop                       │
│  │                                                      │
│  Features:                                              │
│  ├── NFT gallery display                                 │
│  ├── Minting interface                                   │
│  ├── Trading system                                      │
│  └── Airdrop claiming                                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.5 Esports Commands

```
ESPORTS COMMANDS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Commands:                                     │
│  ├── /tournament — View active tournaments              │
│  ├── /register {event} — Register for tournament        │
│  ├── /match {id} — View match details                   │
│  ├── /team {name} — Manage team                        │
│  │                                                      │
│  Features:                                              │
│  ├── Tournament registration                             │
│  ├── Match scheduling                                    │
│  ├── Team management                                     │
│  └── Live score tracking                                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 18. Long-Term Philosophy

### 18.1 Improve User Engagement

```
ENGAGEMENT PRINCIPLES:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Commands drive engagement by:                           │
│  ├── Providing value without Mini App                   │
│  ├── Creating habitual check-ins                        │
│  ├── Celebrating progress through bot                   │
│  ├── Notifying of opportunities                         │
│  ├── Connecting social features                         │
│                                                           │
│  Success Metrics:                                        │
│  ├── Command usage frequency                             │
│  ├── Unique users per command                           │
│  ├── Command → Mini App conversion                       │
│  ├── Session frequency from bot                         │
│  └── Long-term retention correlation                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 18.2 Improve Discoverability

```
DISCOVERABILITY PRINCIPLES:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Commands should be discoverable through:                │
│  ├── Clear /help command                                │
│  ├── Inline keyboard menu                               │
│  ├── Contextual suggestions                             │
│  ├── Command autocomplete                                │
│  └── Progressive disclosure                              │
│                                                           │
│  New User Experience:                                    │
│  ├── /start introduces core commands                    │
│  ├── /help shows all available                          │
│  ├── First-time commands highlighted                    │
│  ├── Advanced commands unlock with progress             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 18.3 Support Ecosystem Growth

```
GROWTH SUPPORT:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Commands support growth through:                        │
│  ├── Referral system (/invite, /referral)               │
│  ├── Viral sharing (/share, /showcase)                  │
│  ├── Community building (/guild, /friends)              │
│  ├── Event participation (/events, /missions)           │
│  └── Creator ecosystem (future)                         │
│                                                           │
│  Scalability:                                            │
│  ├── Command registry scales to hundreds                 │
│  ├── Subcommands provide organization                   │
│  ├── Categories prevent chaos                           │
│  └── Permissions manage complexity                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 18.4 Remain Scalable and Maintainable

```
SCALABILITY & MAINTAINABILITY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Architecture supports growth via:                       │
│  ├── Clear separation of concerns                        │
│  ├── Centralized command registry                        │
│  ├── Layered architecture (parse → route → execute)      │
│  ├── Permission-based access control                     │
│  ├── Comprehensive analytics for decisions               │
│                                                           │
│  Maintainability Features:                               │
│  ├── Self-documenting command structure                  │
│  ├── Consistent response formatting                      │
│  ├── Shared service layer for data access                │
│  ├── Testable command handlers                           │
│  └── Version-controlled command changes                  │
│                                                           │
│  Future-Proofing:                                        │
│  ├── Extension points for new command types              │
│  ├── Deprecation lifecycle for old commands              │
│  ├── A/B testing for command optimization                │
│  └── Migration support for command changes               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

The Bot Commands Architecture provides Jolt Time with a scalable, organized command system that serves as a strategic entry point to the ecosystem. By implementing this layered architecture, the bot achieves:

- **Organization** — Clear categories prevent command chaos as features expand
- **Scalability** — Registry-based routing supports hundreds of commands
- **Maintainability** — Layered architecture isolates concerns
- **Discoverability** — Multiple access points help users find commands
- **Integration** — Deep linking bridges bot and Mini App experiences
- **Analytics** — Comprehensive tracking enables data-driven decisions

This architecture document serves as the definitive reference for all Telegram Bot commands in Jolt Time, ensuring consistent implementation and sustainable growth of the bot ecosystem.