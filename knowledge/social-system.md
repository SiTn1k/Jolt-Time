# Social System

## Overview

The social system transforms Jolt Time from a solo experience into a community journey. Leveraging Telegram's native social features, players can connect with friends, compete on leaderboards, share achievements, and grow together. Social systems drive organic growth through word-of-mouth while increasing retention through meaningful connections and friendly competition.

---

## 1. Friend System

### Core Features

Friends enable players to track each other's progress, send gifts, and compete directly.

### Friend Management

| Action | Method | Limit |
|--------|--------|-------|
| Add Friend | Username search or QR code | 100 friends max |
| Remove Friend | Friend profile menu | No limit |
| Block Player | Settings menu | No limit |
| View Online | Real-time status | Visible to friends |

### Friend Profile Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back                    FRIEND PROFILE                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────┐                                                   │
│  │  😊     │  TimeTraveler_42                                  │
│  │  Lv.25  │  ⭐ Legendary Collector                           │
│  └─────────┘                                                   │
│                                                                 │
│  📊 STATS                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Collection: 78%  (143/165 artifacts)                          │
│  Museum:     65%  (Ancient World 80%)                          │
│  PvP Rank:   Diamond III                                        │
│  Last Seen:  2 hours ago                                        │
│                                                                 │
│  ⭐ FAVORITE ARTIFACTS                                          │
│  ┌───────┐ ┌───────┐ ┌───────┐                                │
│  │ Ankh  │ │ Eagle │ │ Guten │                                │
│  │  ⭐    │ │  ⭐   │ │  ⭐   │                                │
│  └───────┘ └───────┘ └───────┘                                │
│                                                                 │
│  🎁 SEND GIFT                    📊 CHALLENGE                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Friend Features

| Feature | Description |
|---------|-------------|
| Progress Tracking | See friend's collection and level |
| Gift Sending | Send daily energy or coins |
| Challenge | 1v1 battle with entry fee |
| Compare | Side-by-side collection view |

### Online Status

- **Online:** Green dot, "Online now"
- **Away:** Yellow dot, "Last seen X ago"
- **Offline:** No dot, "Last seen X ago"
- **Privacy:** Option to hide last seen from non-friends

---

## 2. Referral System

### Referral Link Structure

Every player receives a unique referral link:
```
https://t.me/JoltTimeBot?start=REF_ABC123XYZ
```

### Referral Rewards

Rewards are granted at specific milestones to encourage quality referrals:

#### Referral Reward Table

| Milestone | Referrer Reward | Referred Reward | Condition |
|-----------|-----------------|-----------------|-----------|
| Sign Up | 50 Coins + 20 Energy | 100 Coins + 50 Energy | New player joins |
| Level 5 | 100 Coins + 5 Fragments | 150 Coins | Reach Level 5 |
| Level 10 | 200 Coins + Rare Fragment | 250 Coins + 10 Fragments | Reach Level 10 |
| Level 20 | 300 Coins + Epic Fragment | 500 Coins | Reach Level 20 |
| First Artifact | 50 Coins | 50 Coins | Collect first artifact |
| 25% Collection | 500 Coins | 500 Coins | Reach 25% museum |

### Referral Rules

**Fair Play Principles:**
- Referral rewards are cosmetic or minor bonuses only
- No premium currency rewards for referrals
- No power advantages for having many referrals
- Referral abuse (fake accounts) results in ban
- One device per real person only

### Referral Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  REFERRALS                                     Your Code:       │
│                                               JOLT_ABC123       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Share your code and earn rewards!                       │   │
│  │                                                          │   │
│  │  [📋 COPY LINK]  [📤 SHARE TO CHAT]  [📱 QR CODE]       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  YOUR REFERRALS: 12                                             │
│  Active This Week: 3                                            │
│                                                                 │
│  Pending Rewards: 850 Coins, 15 Fragments                      │
│  Earned to Date: 2,400 Coins, 45 Fragments                     │
│                                                                 │
│  TOP REFERRALS                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  @FriendName1 → Level 15  ✓ Rewarded                           │
│  @FriendName2 → Level 8   ✓ Rewarded                           │
│  @FriendName3 → Level 3   ⏳ Pending Level 5                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Gift-Giving (Social Feature)

Daily gift exchange between friends:
- **Daily Gift:** 1 free gift per friend per day
- **Gift Contents:** 10–50 coins or 5–20 energy
- **Random Selection:** Contents randomized for surprise
- **Collection Bonus:** Sending all gifts grants bonus

---

## 3. Leaderboards

### Leaderboard Categories

| Category | Update Frequency | Time Period |
|----------|-----------------|-------------|
| Player Level | Real-time | All-time |
| Museum Completion | Hourly | All-time |
| Artifact Count | Real-time | All-time |
| PvP Rating | Real-time | Season |
| Weekly Battles | Weekly | Current week |
| Seasonal Rankings | Weekly | Current season |

### Leaderboard Display

```
┌─────────────────────────────────────────────────────────────────┐
│  LEADERBOARDS                           [Season 1 ends in 6d]  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [Level] [Museum] [Artifacts] [PvP] [Weekly]                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🥇 1. @ProCollector                                    │   │
│  │     Level 45  •  92%  •  152 artifacts                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🥈 2. @TimeMaster                                       │   │
│  │     Level 42  •  88%  •  145 artifacts                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🥉 3. @HistoryNerd                                      │   │
│  │     Level 40  •  85%  •  140 artifacts                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │    4. @ArtifactHunter                                   │   │
│  │     Level 38  •  82%  •  135 artifacts                 │   │
│  │     ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  │   │
│  │     ▼ YOU                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │    5. @MuseumKeeper                                     │   │
│  │     Level 37  •  79%  •  130 artifacts                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  YOUR RANK: #4                                                  │
│  Points: 12,450  •  Next rank: 13,000 (550 to go)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Rank Tiers

| Tier | Visual | Requirements | Rewards |
|------|--------|--------------|---------|
| Bronze | Bronze badge | Top 50% | Minor cosmetic |
| Silver | Silver badge | Top 25% | Frame + badges |
| Gold | Gold badge | Top 10% | Frame + title |
| Platinum | Platinum badge | Top 5% | Premium frame + aura |
| Diamond | Diamond badge | Top 1% | Legendary badge + aura |
| Champion | Animated crown | #1 only | Mythic artifact |

### Leaderboard Rules

- **Fair Play:** Leaderboards exclude premium advantages
- **Ads Impact:** Ads never affect rankings
- **Seasonal Reset:** PvP and weekly boards reset
- **Anti-Cheat:** Suspicious activity flagged
- **Privacy:** Opt-out option available

---

## 4. Player Profiles

### Profile Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  YOUR PROFILE                               [✏️ Edit]           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────┐                                                   │
│  │  😊     │  TimeTraveler_42                                  │
│  │  Lv.25  │  ⭐ Legendary Collector                           │
│  └─────────┘                                                   │
│                                                                 │
│  📊 QUICK STATS                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Artifacts: 143/165    Museum: 78%                      │   │
│  │  Battles: 1,247        Win Rate: 62%                    │   │
│  │  Friends: 47           Referrals: 12                    │   │
│  │  Days Active: 89       Streak: 15 days                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🏆 ACHIEVEMENTS (24/50)                                        │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐           │
│  │ ✓ ✓ ✓ │ │ ✓ ✓ ✓ │ │ ✓ ✓ ○ │ │ ○ ○ ○ │ │ ○ ○ ○ │           │
│  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘           │
│                                                                 │
│  📜 TITLES                                                      │
│  Current: Time Traveler                                         │
│  Unlocked: Time Traveler, Artifact Hunter, Historian            │
│  [Change Title ▼]                                               │
│                                                                 │
│  🎨 COSMETICS                                                   │
│  Frame: Golden Era  |  Aura: Default  |  Badge: Platinum       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Profile Elements

| Element | Editable | Visible To |
|---------|----------|------------|
| Avatar | Yes | Everyone |
| Nickname | Yes (limited) | Everyone |
| Level | No | Everyone |
| Title | Yes (unlocked only) | Everyone |
| Bio | Yes (100 chars) | Friends |
| Collection % | No | Everyone |
| Achievements | No | Everyone |
| Cosmetics | Yes | Everyone |

### Profile Privacy Settings

| Setting | Options | Default |
|---------|---------|---------|
| Profile Visibility | Public / Friends / Private | Public |
| Show Online Status | On / Off | On |
| Show Collection | On / Off | On |
| Allow Challenges | On / Off | On |
| Allow Gifts | On / Off | On |

---

## 5. Titles System

### Title Categories

| Title | Requirement | Rarity |
|-------|-------------|--------|
| Time Traveler | Complete tutorial | Common |
| Artifact Hunter | Collect 50 artifacts | Common |
| Historian | Reach 50% museum | Uncommon |
| Museum Master | Reach 100% museum | Rare |
| Century Collector | Collect 100 artifacts | Uncommon |
| Legendary Collector | Collect 1 Mythic artifact | Epic |
| Battle Master | Win 1000 battles | Uncommon |
| PvP Champion | Reach Diamond rank | Rare |
| Social Butterfly | Add 50 friends | Uncommon |
| Community Leader | Refer 25 players | Rare |

### Title Display

```
┌─────────────────────────────────────────────────────────────────┐
│  AVAILABLE TITLES                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ⭐ LEGENDARY COLLECTOR                          [EQUIPPED]     │
│  Collect 1 Mythic artifact                                      │
│  ✓ Achieved: January 15, 2025                                   │
│                                                                 │
│  🏆 MUSEUM MASTER                               [EQUIP]         │
│  Reach 100% museum completion                                   │
│  Progress: 78%                                                  │
│                                                                 │
│  🔒 TIME ARCHITECT                                              │
│  Reach Level 50                                                 │
│  Progress: 25/50                                                │
│                                                                 │
│  🔒 ETERNAL HISTORIAN                                           │
│  Complete all era collections                                   │
│  Progress: 2/7 eras                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Title Rules

- Titles are **cosmetic only**
- One title equipped at a time
- Titles display on profile and leaderboards
- Locked titles show progress toward goal
- Special animated titles for major achievements

---

## 6. Activity Feed

### Activity Types

| Activity | Icon | Visibility |
|----------|------|------------|
| Artifact Discovery | 🆕 | Friends |
| Level Up | ⬆️ | Friends |
| Collection Milestone | 🎯 | Friends |
| Battle Win | ⚔️ | Friends |
| PvP Rank Up | 🏅 | Friends |
| Era Completion | 🏛️ | Friends |
| Rare Find | ✨ | Friends |
| Legendary Find | 🌟 | Public |
| Achievement Unlocked | 🏆 | Friends |
| Streak Milestone | 🔥 | Friends |

### Activity Feed Display

```
┌─────────────────────────────────────────────────────────────────┐
│  ACTIVITY FEED                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🌟 @ProCollector discovered Ankh of Nefertiti!          │   │
│  │    2 hours ago                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⬆️ @TimeMaster reached Level 40!                        │   │
│  │    5 hours ago                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏅 @HistoryNerd reached Diamond rank!                   │   │
│  │    Yesterday                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎯 @ArtifactHunter completed Ancient World!             │   │
│  │    Yesterday                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔥 @MuseumKeeper reached 30-day streak!                 │   │
│  │    2 days ago                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Activity Rules

- Only positive achievements shown
- No negative events (losses, failures)
- Privacy respected (configurable)
- 50 most recent activities stored
- Filter by friend or global

---

## 7. Sharing System

### Shareable Content

| Content | Platform | Includes |
|---------|----------|----------|
| Artifact Card | Telegram, Image | Artifact image, stats, rarity |
| Collection Milestone | Telegram | Progress %, unlocked rewards |
| Leaderboard Rank | Telegram | Rank, position, comparison |
| Profile Card | Telegram | Summary stats, achievements |
| Museum Entry | Telegram | Historical info, facts |

### Share Card Example

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  JOLT TIME                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✨ LEGENDARY FIND ✨                                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              [ANHK OF NEFERTITI]                        │   │
│  │                                                         │   │
│  │  Ancient Egypt • New Kingdom, 1350 BCE                  │   │
│  │                                                         │   │
│  │  "The ankh was the ancient Egyptian hieroglyphic        │   │
│  │   symbol for 'life'..."                                 │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  TimeTraveler_42 discovered this in Jolt Time!                 │
│  Play: https://t.me/JoltTimeBot                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Share Rewards

| Share Action | Reward |
|--------------|--------|
| Share Artifact | 5 coins |
| Share Milestone | 10 coins |
| Share First Time (daily) | 25 coins + 5 fragments |

---

## 8. Push Notifications

### Social Notification Types

| Notification | Trigger | Message |
|--------------|---------|---------|
| Gift Received | Friend sends gift | "@FriendName sent you a gift! Tap to claim." |
| Challenge Received | Friend challenges | "@FriendName challenges you! Accept or decline." |
| Referral Milestone | Referred player advances | "Your referral @Name reached Level 10! Claim reward." |
| Leaderboard Update | Season rankings posted | "New season rankings are available. You're #4!" |
| Friend Online | Friend returns | "@FriendName is back online!" |
| Milestone Shared | Friend hits milestone | "@FriendName reached 50% museum! Celebrate with them." |

### Notification Frequency

- Social notifications count toward 4/day maximum
- Batch notifications when possible (e.g., "3 gifts waiting")
- Respect quiet hours setting
- Never spam or over-notify

---

## 9. Future Systems

### Guild System (Phase 2)

```
GUILD FEATURES PLANNED
─────────────────────────────────────────────────
• Guild creation (50 member limit)
• Guild chat and announcements
• Guild leaderboards
• Guild challenges (weekly)
• Guild museum contributions
• Shared guild rewards
• Guild wars (PvP between guilds)
```

### Guild War System

| Feature | Description |
|---------|-------------|
| Matchmaking | Guilds paired by total power |
| Battle Format | 5v5 representative matches |
| Territory Control | Win zones for guild prestige |
| Rewards | Guild bank + personal rewards |
| Season Duration | 2 weeks per war season |

### Cooperative Events

| Event Type | Description |
|------------|-------------|
| Group Quests | Friends complete objectives together |
| Museum Contribution | Guild collectively fills eras |
| Artifact Trading | Exchange duplicates (no trades of unowned) |
| Help System | Request specific fragments from friends |

### Chat System

| Channel | Access | Features |
|---------|--------|----------|
| Global Chat | All players | Moderated, emoji support |
| Guild Chat | Guild members | Announcements + chat |
| Direct Messages | Friends only | Private 1v1 |
| Trade Chat | Friends only | Artifact exchange requests |

---

## 10. AdsGram Integration

### Social Feature Ad Rewards

AdsGram integration remains optional and fair:

| Ad Type | Social Reward | Fairness |
|---------|---------------|----------|
| Gift Boost | +1 extra gift daily | Non-competitive |
| Share Bonus | 2x coins on next share | Cosmetic only |
| Referral Boost | Faster milestone tracking | No power advantage |
| Friend Finder | Suggested friends list | Quality of life |

### Fair Play Enforcement

**Leaderboard Integrity:**
- No ads can boost leaderboard position
- No premium advantages in PvP
- No pay-to-win in competitive modes
- Cosmetic purchases only

**Anti-Exploitation:**
- One account per person enforced
- Referral abuse detection
- Bot/fake account prevention
- Leaderboard manipulation detection

### Ad Reward Examples

```
┌─────────────────────────────────────────────────────────────────┐
│  🎁 SOCIAL BONUS                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Watch a short video to boost your next share reward!          │
│                                                                 │
│  Current: 5 coins → After ad: 10 coins                         │
│                                                                 │
│  [WATCH VIDEO]                  [MAYBE LATER]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. System Integration

### Connected Systems

**Quest System:**
- Social quests: "Add 3 friends", "Send 5 gifts"
- Referral milestone quests
- Leaderboard position quests

**Museum System:**
- Guild museum contribution tracking
- Shared collection progress
- Friend museum comparison

**Progression:**
- Social achievements tied to level
- Title unlocks from milestones
- Activity feed celebrates progress

**Future Guilds:**
- Guild chat integration planned
- Guild war matchmaking
- Cooperative event system

### Retention Mechanics

| Social Feature | Retention Impact |
|----------------|------------------|
| Daily Gifts | 15% increase |
| Friend Battles | 25% increase |
| Leaderboard Competition | 30% increase |
| Referral Program | 40% increase in acquisition |

---

*Document Version: 1.0*  
*Last Updated: 2025-01-15*