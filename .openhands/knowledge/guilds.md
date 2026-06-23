# Guilds and Community Systems

## Overview

Jolt Time's Guild System creates a vibrant community experience where players unite to share knowledge, tackle challenges together, and compete in friendly rivalry. Guilds transform solo time travelers into a coordinated force, fostering friendships and providing social accountability. Every guild feature is designed to enhance the educational mission of Jolt Time while maintaining fair competition and avoiding pay-to-win dynamics.

---

## 1. Guild System

### Core Features

The Guild System enables players to form communities, collaborate on objectives, and participate in guild-exclusive activities.

### Creating a Guild

| Requirement | Specification |
|------------|---------------|
| Level Requirement | Level 15+ |
| Cost | 5,000 Chrono Coins |
| Name | 3-24 characters, unique |
| Tag | 2-5 characters (e.g., [TIME], [GOLD]) |
| Description | Optional, 10-100 characters |
| Icon | Select from preset guild icons |

### Joining a Guild

| Method | Description |
|--------|-------------|
| Invitation | Receive invite from guild member/officer |
| Search | Browse and request to join |
| Direct Join | Join if guild is public and has space |

### Guild Limits

| Aspect | Limit |
|--------|-------|
| Members per Guild | 50 |
| Officers per Guild | 5 |
| Guilds per Player | 1 |
| Applications Pending | 5 maximum |

### Guild Creation Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ✨ CREATE GUILD                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  GUILD NAME:                                                     │
│  [________________________] (3-24 characters)                    │
│                                                                 │
│  GUILD TAG:                                                      │
│  [____] (2-5 characters)                                       │
│                                                                 │
│  DESCRIPTION:                                                    │
│  [________________________________________________] (optional)  │
│                                                                 │
│  ICON:                                                           │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                     │
│  │ ⏳  │ │ 🏛️ │ │ ⚔️  │ │ 🎭  │ │ 🌟  │                     │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                     │
│                                                                 │
│  VISIBILITY:                                                     │
│  ○ Public (anyone can request to join)                          │
│  ● Private (invitation only)                                    │
│                                                                 │
│  COST: 5,000 Chrono Coins                                       │
│                                                                 │
│  [CREATE GUILD]                           [CANCEL]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Guild Profile

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ TEMPLE OF TIME 🏛️                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Tag: [TIME] | Level 12 | 42/50 Members                       │
│                                                                 │
│  "Ancient guardians protecting the timeline together"            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  LEADERS:                                                       │
│  👑 @TimeLegend (Leader)                                       │
│  👑 @ChronoMaster (Officer)                                   │
│                                                                 │
│  STATISTICS:                                                    │
│  Total Members: 42     Guild XP: 45,890                        │
│  Weekly Activity: 89%  War Record: 12-3                        │
│                                                                 │
│  RECENT ACTIVITY:                                              │
│  • @ArtifactHunter joined (2h ago)                             │
│  • Guild completed "Egyptian Week" mission (5h ago)             │
│  • Won vs [GLORY] in War (1d ago)                             │
│                                                                 │
│  [JOIN GUILD]  [SEND MESSAGE]  [VIEW ROSTER]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Guild Roles and Permissions

### Role Hierarchy

| Role | Count | Appointment | Removal |
|------|-------|------------|---------|
| Leader | 1 | Creator of guild | Self-demote or transfer |
| Officer | Up to 5 | Leader appoints | Leader or self-remove |
| Member | Up to 44 | Automatic | Self-leave or kick |

### Role Permissions

| Action | Leader | Officer | Member |
|--------|--------|---------|--------|
| Edit Guild Info | ✅ | ❌ | ❌ |
| Change Icon/Tag | ✅ | ❌ | ❌ |
| Kick Members | ✅ | ✅ (non-officers) | ❌ |
| Accept Applications | ✅ | ✅ | ❌ |
| Invite Players | ✅ | ✅ | ✅ |
| Promote to Officer | ✅ | ❌ | ❌ |
| Demote Officer | ✅ | ❌ | ❌ |
| Transfer Leadership | ✅ | ❌ | ❌ |
| Disband Guild | ✅ | ❌ | ❌ |
| Start Guild Wars | ✅ | ✅ | ❌ |
| Create Guild Missions | ✅ | ✅ | ❌ |
| Manage Guild Chat | ✅ | ✅ | ❌ |
| Pin Messages | ✅ | ✅ | ❌ |
| Participate in Guild Content | ✅ | ✅ | ✅ |

### Role Assignment Display

```
┌─────────────────────────────────────────────────────────────────┐
│  👑 MEMBER MANAGEMENT — TEMPLE OF TIME                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  👑 LEADERS (1/1)                                              │
│  ─────────────────────────────────────────────────────────────  │
│  @TimeLegend — Leader                                          │
│  [TRANSFER] [EDIT GUILD]                                       │
│                                                                 │
│  ⚔️ OFFICERS (3/5)                                             │
│  ─────────────────────────────────────────────────────────────  │
│  @ChronoMaster — Officer            [DEMOTE]                   │
│  @MuseumKeeper — Officer             [DEMOTE]                   │
│  @ArtifactHunter — Officer           [DEMOTE]                   │
│                                                                 │
│  SUGGEST PROMOTION:                                            │
│  @LoyalMember — Member                [PROMOTE TO OFFICER]     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  MEMBERS (38/50)                                               │
│  ─────────────────────────────────────────────────────────────  │
│  @ActivePlayer — Member                 [KICK]                  │
│  @CasualMember — Member                [KICK]                   │
│  @NewMember — Member (joined 1d ago)  [KICK]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Guild Levels

Guilds gain experience through collective activities, unlocking features and cosmetics as they grow.

### Guild XP Sources

| Activity | XP Earned | Source |
|----------|----------|--------|
| Member completes daily quest | 5-15 XP | Per member |
| Member wins battle | 1 XP | Per win |
| Member opens pack | 2 XP | Per open |
| Member completes achievement | 10-50 XP | Per achievement |
| Guild completes mission | 50-200 XP | Per mission |
| Guild war victory | 500 XP | Per win |
| Guild war participation | 100 XP | Per battle |
| Event participation | 25-100 XP | Per event |
| Museum entry completed | 3 XP | Per entry |
| New member joins | 25 XP | Per join |

### Guild Level Thresholds

| Level | Total XP | Unlocked Features |
|-------|----------|------------------|
| 1 | 0 | Basic features, 25 members |
| 2 | 1,000 | 30 members |
| 3 | 3,000 | Guild banner slot 1 |
| 4 | 6,000 | 35 members |
| 5 | 10,000 | Guild badge slot 1 |
| 6 | 15,000 | 40 members |
| 7 | 21,000 | Guild banner slot 2 |
| 8 | 28,000 | 45 members |
| 9 | 36,000 | Guild badge slot 2 |
| 10 | 45,000 | 50 members (max) |
| 11-20 | +15,000 per level | Additional cosmetic slots |
| 21-30 | +25,000 per level | Prestige cosmetics |

### Guild Level Display

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 GUILD LEVEL — TEMPLE OF TIME                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  LEVEL 12                          8,450 / 15,000 XP           │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░  56%             │
│                                                                 │
│  XP PROGRESS:                                                  │
│  This Week: +2,340 XP                                          │
│  This Month: +8,920 XP                                         │
│  Trend: ↑ 12% vs last month                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  UNLOCKED FEATURES:                                            │
│  ✓ 50 member capacity (Level 10)                               │
│  ✓ Guild Banner Slot 1 (Level 3)                              │
│  ✓ Guild Badge Slot 1 (Level 5)                               │
│  ✓ Guild War Access (Level 8)                                 │
│  → Guild Banner Slot 2 (Level 7) - 3,000 XP away              │
│  → Guild Badge Slot 2 (Level 9) - 7,000 XP away              │
│                                                                 │
│  NEXT UNLOCK: Level 13 - Additional cosmetics                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Guild Missions

Guild missions are cooperative objectives that reward all active members.

### Mission Types

| Type | Description | Duration | Reward |
|------|-------------|----------|--------|
| Daily Guild Quest | Complete with guild members | Daily reset | Guild XP + Individual rewards |
| Weekly Challenge | Collective battle/collection goal | Weekly reset | Guild XP + Cosmetics |
| Event Mission | Participate in current event | Event duration | Event Tokens + Guild XP |
| Story Mission | Complete era-specific objectives | One-time | Rare cosmetics |

### Mission Examples

| Mission | Objective | Reward |
|---------|-----------|--------|
| Guild Training Day | Win 500 battles as guild | 500 Guild XP + 50 Coins each |
| Museum Builders | Complete 100 museum entries | 300 Guild XP + Rare Fragment each |
| Artifact Hunters | Collect 200 artifacts total | 400 Guild XP + Artifact Capsule |
| Egyptian Week | Win 50 battles in Egypt era | 200 Guild XP + Egyptian Badge |
| War Preparation | Practice 100 guild battles | 300 Guild XP + War Token |

### Guild Mission Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ GUILD MISSIONS — TEMPLE OF TIME                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  DAILY MISSIONS (Reset in 4h 32m)                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🏋️ GUILD TRAINING                                            │
│  Win 50 battles as guild today                                  │
│  Progress: 38/50 battles                                        │
│  Reward: 100 Guild XP + 25 Coins each                          │
│  [BATTLE TO HELP]                                               │
│                                                                 │
│  🏛️ MUSEUM COLLECTIVE                                          │
│  Complete 25 museum entries as guild                            │
│  Progress: 12/25 entries                                        │
│  Reward: 150 Guild XP + Rare Fragment each                     │
│  [VISIT MUSEUM]                                                │
│                                                                 │
│  WEEKLY CHALLENGE                                               │
│  ─────────────────────────────────────────────────────────────  │
│  🏆 GUILD WARRIORS                                             │
│  Win 500 total guild battles this week                          │
│  Progress: 234/500 battles                                       │
│  Reward: 500 Guild XP + Bronze Guild Frame                     │
│  Time Left: 5d 18h                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mission Participation Rules

- **Minimum Participation:** Complete at least 3 daily missions to count
- **Contribution Tracking:** Individual contributions visible to guild
- **Reward Distribution:** All active members receive rewards
- **Absence Policy:** Members inactive 7+ days don't receive weekly rewards

---

## 5. Guild Wars

Guild Wars are competitive PvP events where guilds battle for ranking and rewards.

### War Structure

| Aspect | Specification |
|--------|---------------|
| Duration | 3 days per war |
| Frequency | Bi-weekly (every 2 weeks) |
| Format | 5v5 representative battles |
| Season | 4 war seasons per year |

### Matchmaking

| Factor | Weight | Description |
|--------|--------|-------------|
| Guild Level | 40% | Higher level = stronger opponent |
| Member Count | 20% | Active members weighted |
| Average Member Level | 25% | Progression indicator |
| War History | 15% | Recent war performance |

### War Format

```
GUILD WAR: ROUND 1
═══════════════════════════════════════════════════════

TEMPLE OF TIME vs ROYAL CHRONICLES

BATTLE 1: @TimeLegend + 4 vs @King + 4
BATTLE 2: @ChronoMaster + 4 vs @Queen + 4
BATTLE 3: @MuseumKeeper + 4 vs @Duke + 4
BATTLE 4: @ArtifactHunter + 4 vs @Baron + 4
BATTLE 5: @QuestMaster + 4 vs @Count + 4

SCORE: 3-2 (Lead: Temple of Time)

Each battle = 1 point
First to 3 points wins the round
Best of 3 rounds wins the war
```

### War Battle Rules

| Rule | Specification |
|------|---------------|
| Entry | Free (no resources required) |
| Energy Cost | Free during war |
| Battle Format | 5v5 simultaneous |
| Rating Impact | None (separate war rating) |
| Losses | Don't affect normal ranking |

### War Ranking System

| Rank | Title | Requirement |
|------|-------|-------------|
| Bronze | Bronze Legion | 0+ war points |
| Silver | Silver Guard | 500+ war points |
| Gold | Golden Vanguard | 1,500+ war points |
| Platinum | Platinum Elite | 3,000+ war points |
| Diamond | Diamond Warlords | 5,000+ war points |
| Champion | War Champions | Season winners |

### Fair Competition Rules

> **Guild War Fairness Pledge:**
> - No mercenary players (paid substitutes)
> - No smurf accounts (lower-level attackers)
> - No battle manipulation
> - No harassment of opponents
> - All battles recorded for dispute resolution

### War Rewards

| Placement | Guild Rewards | Individual Rewards |
|-----------|--------------|-------------------|
| War Winner | 1,000 Guild XP + War Trophy | 500 Coins + War Badge |
| War Loser | 300 Guild XP | 200 Coins |
| Round Winner | 500 Guild XP | 300 Coins |
| Round Loser | 100 Guild XP | 100 Coins |
| Participation | 50 Guild XP | 50 Coins |

---

## 6. Guild Leaderboards

Guild leaderboards track guild performance across multiple dimensions.

### Leaderboard Categories

| Category | Tracked Metric | Update |
|----------|---------------|--------|
| Guild Level | Total Guild XP | Real-time |
| Activity Score | Weekly member activity | Weekly |
| War Performance | War victories and rating | After each war |
| Season Champions | War season winners | Per season |
| Contribution | Top contributing guilds | Monthly |

### Guild Leaderboard Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🏆 GUILD LEADERBOARDS                    Season 7 War         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [Level] [Activity] [War] [Season]                              │
│                                                                 │
│  ══════════════════ TOP GUILDS ══════════════════             │
│                                                                 │
│  1. 🏛️ TEMPLE OF TIME                                       │
│     Level 15 • 89% activity • 45-12 war record                │
│                                                                 │
│  2. ⚔️ ROYAL CHRONICLES                                       │
│     Level 14 • 85% activity • 42-15 war record                │
│                                                                 │
│  3. 🎭 MYSTIC SOCIETY                                         │
│     Level 13 • 82% activity • 38-18 war record                │
│                                                                 │
│  ...                                                            │
│                                                                 │
│  47. 🌟 YOUR GUILD                                            │
│     Level 8 • 72% activity • 12-8 war record                   │
│     ↑ 3 positions this week                                    │
│                                                                 │
│  [VIEW TOP 100]  [VIEW REGIONAL]  [VIEW FRIENDS]              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Individual Contribution Tracking

| Metric | Description |
|--------|-------------|
| Weekly XP | XP earned this week |
| Mission Participation | Daily missions completed |
| War Battles | Battles fought in wars |
| Donation Points | Resources contributed |
| Activity Streak | Consecutive active days |

---

## 7. Guild Chat Philosophy

Guild chat creates a space for coordination, friendship, and community building.

### Chat Features

| Feature | Description |
|---------|-------------|
| Guild Chat | Real-time messaging for all members |
| Announcements | Leader/officer pinned messages |
| War Room | Private channel during wars |
| Direct Messages | 1v1 between members |

### Moderation Rules

| Rule | Enforcement |
|------|-------------|
| No Hate Speech | Immediate mute, repeat = kick |
| No Spam | Warning, then mute |
| No Personal Attacks | Warning, repeat = kick |
| No Advertising | Mute, repeat = kick |
| English Only (default) | Warning, repeat = mute |
| Respect All Members | Zero tolerance policy |

### Anti-Toxicity Principles

```
GUILD COMMUNITY GUIDELINES
═══════════════════════════════════════════════════════

CORE VALUES:
• Respect: Treat all members with dignity
• Support: Help newcomers learn and grow
• Positivity: Encourage, don't belittle
• Fairness: Play by the rules
• Inclusion: Welcome diverse perspectives

PROHIBITED:
• Discrimination or harassment
• Sharing personal information
• Toxic behavior or rage-quitting
• Cheating or exploitation
• Impersonating leaders or staff

ENFORCEMENT:
• First offense: Warning
• Second offense: 24-hour mute
• Third offense: 7-day mute
• Severe offense: Immediate kick

REPORTING:
Use /report to flag inappropriate content.
Reports are confidential and reviewed within 24 hours.
```

### Healthy Community Guidelines

| Guideline | Description |
|-----------|-------------|
| Welcome New Members | Greet and introduce |
| Share Knowledge | Help with quests and strategy |
| Celebrate Successes | Congratulate achievements |
| Support Struggles | Offer encouragement |
| Maintain Activity | Log in regularly to stay active |

---

## 8. Guild Rewards

Guild rewards are cosmetic items that showcase guild pride and accomplishments.

### Reward Categories

| Category | Examples | Acquisition |
|----------|---------|-------------|
| Guild Frames | Bronze/Silver/Gold Guild Frame | War victories |
| Guild Banners | Custom banner with guild name | Level milestones |
| Guild Badges | War Badge, Level Badge, Activity Badge | Various achievements |
| Titles | "Guild Founder", "War Veteran" | Tenure + achievements |
| Profile Decorations | Guild Emblem | Level 10+ |
| Chat Sticker Pack | Guild-themed stickers | Seasonal |

### Guild Cosmetic Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🏆 GUILD COSMETICS — TEMPLE OF TIME                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  UNLOCKED:                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  🏅 War Victory Badge — "45 Victories"                        │
│  📜 Level 10 Banner — Bronze with gold trim                   │
│  🎖️ War Veteran Frame — Silver border                        │
│  ⭐ Founding Guild Badge — "Est. Season 3"                    │
│                                                                 │
│  LOCKED:                                                        │
│  ─────────────────────────────────────────────────────────────  │
│  🔒 Level 15 Banner — Requires Level 15                       │
│  🔒 Diamond War Frame — 10 War Season Victories               │
│  🔒 Platinum Badge — 25 War Season Victories                  │
│  🔒 Champion Title — Win 1 Championship                       │
│                                                                 │
│  YOUR GUILD PROFILE DISPLAY:                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🏛️ TEMPLE OF TIME                                    │   │
│  │  [Bronze War Frame]                                    │   │
│  │  Level 12 • 45 War Victories                          │   │
│  │  "Ancient guardians protecting the timeline"           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Reward Distribution

| Reward Type | Distribution | Requirement |
|------------|--------------|-------------|
| War Frame | All members | Win war |
| Level Banner | All members | Reach guild level |
| War Badge | Participating members | Fight in war |
| Activity Badge | Active members | 80%+ weekly activity |
| Season Title | Top performers | End of season |

---

## 9. Guild Achievements

Cooperative achievements celebrate guild milestones and accomplishments.

### Achievement Categories

#### Founding Achievements

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| First Steps | Create or join a guild | Guild Member Badge |
| Guild Growth | Reach 10 members | +50 Guild XP |
| Established Guild | Reach 25 members | +200 Guild XP |
| Full House | Reach 50 members | +500 Guild XP |

#### Activity Achievements

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| Active Guild | 100% weekly activity for 4 weeks | Activity Aura |
| Consistent Contributors | 10 members with 7-day streak | Activity Badge |
| Returning Members | 5 inactive members rejoin | +100 Guild XP |

#### Combat Achievements

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| First Victory | Win first guild war | War Starter Badge |
| War Veterans | Win 10 wars | War Veteran Frame |
| Undefeated | Win 5 wars consecutively | Undefeated Title |
| Champion Guild | Win war season championship | Champion Frame |

#### Collection Achievements

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| Museum Builders | Complete 500 museum entries together | Museum Badge |
| Artifact Alliance | Collect 1,000 artifacts together | Collection Badge |
| Complete Collection | Fill one era together | Era Completion Frame |

#### Event Achievements

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| Event Warriors | Complete 100 event missions together | Event Badge |
| Festival Guild | Participate in 5 seasonal events | Festival Frame |
| Community Heroes | Complete 3 community goals together | Community Badge |

---

## 10. Telegram Bot Notifications

Guild notifications keep members informed about guild activities without becoming spam.

### Notification Types

| Notification | Trigger | Message |
|--------------|---------|---------|
| Guild Invite | Received invite | "@Player invites you to join [Guild]!" |
| Invite Accepted | Request approved | "@Player joined your guild!" |
| War Starting | 24h before war | "Guild War starts tomorrow! Prepare your team." |
| War Starting | 1h before war | "War vs [Enemy Guild] begins in 1 hour!" |
| War Result | After war ends | "[Guild] won the war 3-1! Congratulations!" |
| Mission Complete | Guild mission finished | "Guild mission complete! Rewards distributed." |
| Level Up | Guild levels up | "Your guild reached Level 12! New features unlocked." |
| Member Kicked | Removed by officer | "You were removed from [Guild]." |
| Achievement Unlocked | Guild achievement | "[Guild] earned 'War Veteran' achievement!" |
| Season Rewards | End of war season | "War Season complete! Check your rewards." |
| Inactivity Warning | 5 days inactive | "You haven't been active in [Guild]. Stay or leave?" |

### Notification Frequency Rules

| Notification Type | Maximum Frequency |
|-------------------|-----------------|
| Guild Invites | 1 per invite |
| War Alerts | 2 per war (24h + 1h) |
| Mission Complete | 2 per day |
| Level Up | 1 per level |
| Season Rewards | 1 per season |
| Activity Warnings | 1 per week |

### Total Cap

Guild notifications respect the **4 notifications per day** hard cap (combined with all other notification types).

### Notification Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ GUILD WAR ALERT                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  War begins in 24 hours!                                        │
│                                                                 │
│  TEMPLE OF TIME vs ROYAL CHRONICLES                            │
│                                                                 │
│  Your preparation:                                               │
│  • Guild Level: 12 (Strong)                                    │
│  • Active Members: 38/42                                       │
│  • War Rating: 2,450                                           │
│                                                                 │
│  RECOMMENDED:                                                   │
│  • Ensure 5 battle-ready members                                │
│  • Complete any pending guild missions                           │
│  • Review war strategy in Guild Chat                            │
│                                                                 │
│  [VIEW OPPONENT]  [PREPARE TEAM]  [SETTINGS]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. AdsGram Integration

Guild systems provide community engagement but do not replace AdsGram as the primary revenue system.

### Guild AdsGram Rewards

| Ad Type | Guild Bonus | Daily Limit | Purpose |
|---------|------------|------------|---------|
| Guild Mission Boost | +1 mission attempt | 2 per day | Catch-up help |
| Contribution Bonus | +25% guild XP | 1 per day | Progression boost |
| War Preparation | Extra practice battle | 1 per day | Strategy prep |
| Welcome Bonus | +50% first guild XP | 1 per week | New member boost |

### Guild AdsGram Display

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ GUILD SUPPORT                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Watch a short video to boost your guild:                      │
│  • +25% Guild XP for your next contribution                    │
│  • Help your guild level up faster!                            │
│                                                                 │
│  Today: 0/1 boost used                                         │
│                                                                 │
│  [WATCH VIDEO]                        [MAYBE LATER]            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Guild Monetization Philosophy

- **Guilds are free:** All core features available without purchase
- **Guild wars are free:** No entry fees or resource costs
- **AdsGram is optional:** No pressure to watch ads for guild success
- **No power advantages:** Spending doesn't make guilds stronger
- **Community over revenue:** Guilds exist for social engagement

---

## 12. Community Philosophy

Jolt Time's guild system embodies principles of teamwork, friendship, and healthy competition.

### Core Principles

#### Promote Teamwork
- Guild missions require coordination
- War battles depend on team composition
- Shared rewards encourage cooperation
- Knowledge sharing benefits all members

#### Encourage Friendships
- Guild chat facilitates connection
- Shared achievements build bonds
- Veteran members mentor newcomers
- Cross-guild events foster broader community

#### Avoid Toxic Competition
- No shame for losing wars
- No public leaderboard shame
- Focus on improvement over rankings
- Celebrate all participation

#### Support Casual Players
- No mandatory participation
- Passive rewards for being active
- Catch-up mechanics for inactive periods
- Leave guild without penalty

### Guild Member Journey

| Stage | Description | Support |
|-------|-------------|---------|
| New Member | Join and learn | Welcome message, buddy system |
| Active Member | Participate regularly | Mission reminders, activity tracking |
| Contributor | Help guild grow | Recognition, contribution badges |
| Leader/Officer | Guide community | Tool access, announcement privileges |
| Veteran | Long-term member | Special badges, tenure recognition |

### Anti-Toxicity Safeguards

| Concern | Solution |
|---------|----------|
| Guild Hopping | Cooldown before joining new guild |
| Inactive Members | Activity requirements for rewards |
| Leadership Abuse | Report system, leader review |
| War Trash Talk | Muted chat during wars |
| Recruitment Spam | Report button, monitoring |

---

## 13. Joining and Leaving Guilds

### Leaving a Guild

| Condition | Result |
|-----------|--------|
| Voluntary Leave | Member removed, no penalty |
| Kicked | 24-hour cooldown before joining |
| Guild Disbanded | Auto-join recruitment channel |
| Inactive 30+ days | Auto-leave, no cooldown |

### Guild Disbanding

| Condition | Requirement |
|-----------|-------------|
| Leader Disbands | Must transfer to another member first |
| Member Count < 3 | Auto-prompt to disband or merge |
| All Members Leave | Guild auto-disbands after 24h |

### Post-Leave Benefits

| Benefit | Retention |
|---------|----------|
| Earned Cosmetics | Keep all |
| Achieved Titles | Keep all |
| Guild Contributions | Lost |
| War Record | Personal record kept |

---

## 14. Technical Implementation

### Guild Data Structure

```yaml
guild:
  id: "uuid"
  name: "Temple of Time"
  tag: "TIME"
  description: "Ancient guardians..."
  leader_id: "player_uuid"
  level: 12
  xp: 45890
  member_count: 42
  max_members: 50
  war_rating: 2450
  war_wins: 45
  war_losses: 12
  created_at: "2025-01-15T00:00:00Z"
  season_id: 7
```

### Member Data Structure

```yaml
guild_member:
  guild_id: "uuid"
  player_id: "uuid"
  role: "member"  # leader, officer, member
  joined_at: "2025-03-01T00:00:00Z"
  contribution_points: 1250
  weekly_activity: 89
  war_participations: 23
  title: "Veteran Member"
```

### War Data Structure

```yaml
guild_war:
  id: "uuid"
  guild_a_id: "uuid"
  guild_b_id: "uuid"
  status: "active"  # pending, active, completed
  score_a: 2
  score_b: 1
  rounds: 3
  current_round: 2
  started_at: "2025-03-15T00:00:00Z"
  ends_at: "2025-03-18T00:00:00Z"
```

---

## 15. Season Integration

### Guild War Seasons

| Aspect | Specification |
|--------|---------------|
| Season Duration | 8 weeks (bi-weekly wars × 4) |
| Seasons per Year | 6 |
| Championship | Top guilds compete for title |
| Rewards | Season-based cosmetics and titles |

### Season Rewards

| Placement | Reward |
|-----------|--------|
| Season Champion | Champion Frame (permanent) + Title |
| Top 10 | Platinum War Frame |
| Top 25 | Gold War Frame |
| Top 50 | Silver War Frame |
| Participation | Bronze War Frame |

---

## 16. Quality Standards

### Guild Launch Checklist

- [ ] All member limits tested
- [ ] Role permissions verified
- [ ] XP calculation correct
- [ ] Mission distribution working
- [ ] War matchmaking balanced
- [ ] Chat moderation active
- [ ] Leaderboard updates accurate
- [ ] Achievement tracking correct
- [ ] Notification frequency capped
- [ ] Mobile UI responsive

### Guild Monitoring

| Metric | Target | Action if Low |
|--------|--------|---------------|
| Active Guilds | 1,000+ | Promote guild feature |
| Avg Members | 25+ | Encourage recruitment |
| War Participation | 60%+ | Send reminders |
| Chat Activity | Healthy | Moderate if needed |
| Member Retention | 80%+ | Review kick policies |

---

*Guilds should feel like home. Every member should feel valued, every contribution recognized, and every competition friendly.*
