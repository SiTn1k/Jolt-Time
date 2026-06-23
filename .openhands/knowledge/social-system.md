# Jolt Time — Social Systems and Community

## Overview

The Social Systems transform Jolt Time from a solo experience into a community journey. Leveraging Telegram's native social features, players connect with friends, share achievements, compete on leaderboards, and grow together. All social features emphasize **mutual benefit**, **healthy competition**, and **community building** without pay-to-win advantages.

> AdsGram remains the **primary revenue source** for the project. Social systems enhance community but never replace or compete with AdsGram monetization.

---

## 1. Friends System

### 1.1 Core Features

Friends enable players to track each other's progress, send gifts, and share achievements.

| Action | Method | Limit |
|--------|--------|-------|
| Add Friend | Username search, QR code, Telegram link | 100 friends max |
| Remove Friend | Friend profile menu | No limit |
| Block Player | Settings menu | No limit |
| View Online | Real-time status | Visible to friends |

### 1.2 Friend Profile Display

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                      FRIEND PROFILE                │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  ┌─────────┐                                               │
│  │  😊     │  TimeTraveler_42                             │
│  │  Lv.32  │  ⭐ "Battle Legend"                         │
│  └─────────┘                                               │
│                                                              │
│  📊 STATS                                                   │
│  ───────────────────────────────────────────────────────── │
│  Collection: 67/82 (82%)                                  │
│  Achievements: 45/125                                     │
│  Last Seen: 2 hours ago                                  │
│                                                              │
│  ❤️ FAVORITE ARTIFACT                                      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  🏺 Clay Tablet of Ur                               │ │
│  │  Level 15 • Legendary • Ancient Era                  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                              │
│  [Send Gift]              [View Full Profile]              │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Online Status

| Status | Indicator | Display |
|--------|-----------|---------|
| Online | Green dot | "Online now" |
| Away | Yellow dot | "Last seen X ago" |
| Offline | No dot | "Last seen X ago" |
| Privacy | Settings | Option to hide from non-friends |

---

## 2. Friends Activity Feed

### 2.1 Activity Types

The activity feed shows friends' notable accomplishments.

| Activity | Trigger | Display |
|----------|---------|---------|
| Level Up | Reach new level | "[@Name] reached Level X!" |
| New Artifact | Collect artifact | "[@Name] found a [Rarity] artifact!" |
| Achievement | Unlock achievement | "[@Name] earned [Achievement]!" |
| Museum Milestone | Complete era/set | "[@Name] completed [Era] collection!" |
| Event Participation | Join event | "[@Name] joined [Event]!" |
| Streak | Reach milestone | "[@Name] reached [X]-day streak!" |

### 2.2 Activity Feed Display

```
┌─────────────────────────────────────────────────────────────┐
│  👥 ACTIVITY FEED                              [All ▼]      │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  TODAY                                                     │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔥 @HistoryNerd reached Level 30!                   │   │
│  │    2 hours ago                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🏺 @ArtifactHunter found a Legendary artifact!    │   │
│  │    "Ankh of Nefertiti" — Ancient Egypt            │   │
│  │    5 hours ago                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🏆 @MuseumKeeper completed Ancient Era!             │   │
│  │    100% collection — 12/12 artifacts              │   │
│  │    Yesterday                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⭐ @ChronoMaster earned "Battle Legend"!          │   │
│  │    Yesterday                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Activity Rules

- Only positive achievements shown
- No negative events (losses, failures)
- Privacy respected (configurable)
- 50 most recent activities stored
- Filter by friend or global

---

## 3. Friend Bonuses

### 3.1 Daily Friendship Rewards

Friendship bonuses are small but meaningful.

| Bonus Type | Amount | Frequency |
|------------|--------|----------|
| Gift Sending | 10-50 Chrono Coins | 1 per friend per day |
| Gift Receiving | 10-50 Chrono Coins | Unlimited |
| Collection Bonus | +5% XP for 1 hour | When friend opens capsule |
| Streak Bonus | +1 day credited | When both players active same day |

### 3.2 Shared Social Bonuses

| Bonus | Description | Trigger |
|-------|-------------|---------|
| Friendship XP | +10% XP for 30 min | Both players online |
| Gift Chain | +5 Chrono Coins per consecutive gift | Send gifts 7 days straight |
| Collection Sync | +2% drop rate for 1 hour | Friend completes collection |

### 3.3 Social Achievements

| Achievement | Requirement | Reward |
|------------|-------------|--------|
| First Friend | Add 1 friend | 50 XP |
| Socializer | Add 5 friends | 100 XP, 50 Dust |
| Popular | Add 15 friends | 250 XP, 100 Dust, Bronze Badge |
| Social Butterfly | Add 30 friends | 500 XP, 200 Dust |
| Community Builder | Add 50 friends | 1000 XP, 400 Dust, "Social" Title |

> **Fairness Rule:** All friend bonuses are small and non-competitive. No gameplay power advantages.

---

## 4. Referral System

### 4.1 Personal Referral Links

Every player receives a unique referral link:

| Format | Example |
|--------|---------|
| Deep Link | `https://t.me/jolttimebot?start=ref_ABC123XYZ` |
| Short Code | `ref_ABC123XYZ` |

### 4.2 Referral Rewards

**For Referrer (Person Inviting):**

| Milestone | Reward | Type |
|-----------|--------|------|
| Per Referral | 100 Chrono Coins + 5 Time Shards | Immediate |
| 5 Referrals | Bronze Friend Badge | Cosmetic |
| 10 Referrals | Silver Friend Badge + 50 Shards | Cosmetic |
| 25 Referrals | Gold Friend Badge + 100 Shards | Cosmetic |
| 50 Referrals | Platinum Friend Badge + 150 Shards + Gold Frame | Cosmetic |
| 100 Referrals | Diamond Friend Badge + 250 Shards | Cosmetic |
| 500 Referrals | Legendary Friend Badge + 500 Shards + "Viral" Title | Cosmetic |
| 1000 Referrals | Mythic Friend Badge + 1000 Shards + "Legendary Influencer" | Cosmetic |

**For Referee (Person Joining):**

| Reward | Amount | Condition |
|--------|--------|----------|
| Welcome Package | 100 Chrono Coins + 5 Time Shards | New account |
| Energy Boost | +50 Max Energy (7 days) | Account created |
| Free Capsule | 1 Common Capsule | Account created |

### 4.3 Referral Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  👥 YOUR REFERRALS                        Your Code:      │
│                                              JOLT_ABC123   │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Share your code and earn rewards!                  │   │
│  │  [📋 COPY LINK]  [📤 SHARE TO CHAT]  [📱 QR]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  YOUR STATS:                                               │
│  Total Invited: 12                                        │
│  Active This Week: 3                                       │
│  Lifetime Rewards: 2,400 Coins, 50 Shards                  │
│                                                              │
│  PENDING: 850 Coins, 15 Fragments                         │
│                                                              │
│  TOP REFERRALS:                                           │
│  @FriendName1 → Level 15 ✓ Rewarded                       │
│  @FriendName2 → Level 8 ✓ Rewarded                        │
│  @FriendName3 → Level 3 ⏳ Pending                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.4 Referral Rules

- Referral rewards are cosmetic or minor bonuses only
- No premium currency rewards for referrals
- No power advantages for having many referrals
- Referral abuse (fake accounts) results in ban
- One device per real person only

---

## 5. Founder Program

### 5.1 Early User Recognition

Players who join during launch receive permanent recognition.

| Badge | Requirement | Rarity | Reward |
|-------|-------------|--------|--------|
| Founder | Joined during beta/launch | Legendary | Exclusive frame |
| Pioneer | First 1,000 players | Epic | Special badge |
| Early Adopter | First 10,000 players | Rare | Pioneer badge |

### 5.2 Founder Rewards

| Reward | Description | Type |
|--------|-------------|------|
| Founder Badge | "I was there at the beginning" | Permanent badge |
| Founder Frame | Exclusive bronze frame | Cosmetic |
| Founder Title | "Founder" | Permanent title |
| Early Access | Beta features | Exclusive access |

### 5.3 Display

```
┌─────────────────────────────────────────────────────────────┐
│  👤 @TimeKeeper_Mike                                        │
│  ⭐ Level 32 • "Battle Legend"                              │
│  🏆 FOUNDER                                                │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  "I was there when Jolt Time began."                        │
│                                                              │
│  Member since: January 15, 2026                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Community Features

### 6.1 Leaderboards

| Category | Update | Period |
|----------|--------|--------|
| Highest Level | Real-time | All-time |
| Top Collectors | Hourly | All-time |
| Museum Masters | Hourly | All-time |
| Achievement Hunters | Real-time | All-time |
| Battle Champions | Real-time | Season |
| Weekly Battles | Weekly | Current week |

### 6.2 Leaderboard Display

```
┌─────────────────────────────────────────────────────────────┐
│  🏆 LEADERBOARDS                      [Season ends in 6d] │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  [Level] [Collection] [Museum] [Achievements] [Battles]   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🥇 1. @ChronoMaster                                  │   │
│  │     Level 87 • 92% • 152 artifacts                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🥈 2. @TimeKeeper_Elite                             │   │
│  │     Level 82 • 88% • 145 artifacts                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🥉 3. @ArtifactQueen                                │   │
│  │     Level 78 • 85% • 138 artifacts                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Your Rank: #147 — Level 32                                │
│  Top 100 requires: Level 45                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Gift System

### 7.1 Gift Types

| Gift Type | Contents | Daily Limit |
|-----------|----------|-------------|
| Sticker Pack | 3 themed stickers | Unlimited |
| Small Coins | 10-50 Chrono Coins | 5 per friend |
| Energy Boost | 10-25 Energy | 3 per friend |
| Cosmetic Gift | Badge/Frame | 1 per week |
| Celebration | "Happy Birthday!" | Unlimited |

### 7.2 Gift Interface

```
┌─────────────────────────────────────────────────────────────┐
│  🎁 SEND GIFT TO @FriendName                 [X]          │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  SELECT GIFT:                                                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🪙 Small Coin Pack                     [SEND]        │   │
│  │     10-50 Chrono Coins • 0/5 today             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚡ Energy Boost                        [SEND]        │   │
│  │     10-25 Energy • 0/3 today                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🎫 Celebration                           [SEND]      │   │
│  │     Happy Birthday! • Unlimited                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🎨 Cosmetic Gift                       [SEND]        │   │
│  │     Send a badge or frame • 0/1 this week        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Gift Rules

| Rule | Limit | Enforcement |
|------|-------|-------------|
| Daily Coin Gifts | 5 per friend | Counter reset at UTC midnight |
| Daily Energy Gifts | 3 per friend | Counter reset at UTC midnight |
| Weekly Cosmetic Gifts | 1 per friend | Counter reset Monday |
| Abuse/Exploitation | Prohibited | Account suspension |

### 7.4 Abuse Protection

- **Rate Limiting:** Maximum gifts capped per day/week
- **Cooldown:** Cannot gift same friend more than once per day
- **Surveillance:** Unusual gift patterns flagged for review
- **No Real Money:** Gifts cannot be sold or traded for real currency
- **Account Linking:** Gifts only between Telegram friends

---

## 8. Social Achievements

### 8.1 Achievement Categories

| Achievement | Requirement | Reward | Rarity |
|------------|-------------|--------|--------|
| First Friend | Add 1 friend | 50 XP | Common |
| Socializer | Add 5 friends | 100 XP, 50 Dust | Common |
| Popular | Add 15 friends | 250 XP, 100 Dust, Bronze Badge | Rare |
| Social Butterfly | Add 30 friends | 500 XP, 200 Dust | Epic |
| Community Builder | Add 50 friends | 1000 XP, 400 Dust, "Social" Title | Epic |
| Generous Gifter | Send 100 gifts | 300 XP, 150 Dust | Rare |
| Gift Giver | Send 500 gifts | 750 XP, 400 Dust, "Generous" Title | Epic |
| Time Ambassador | Refer 10 players | 500 XP, 200 Dust, Silver Frame | Epic |
| Viral | Refer 100 players | 2500 XP, 1000 Dust, "Influencer" Title | Legendary |

### 8.2 Social Quests

| Quest | Objective | Reward |
|-------|-----------|--------|
| Make a Friend | Add 1 friend | 50 XP, 25 Dust |
| Social Hour | Send 3 gifts | 75 XP, 30 Dust |
| Referral Network | Share your code | 100 XP |

---

## 9. Telegram Bot Integration

### 9.1 Social Notifications

| Notification | Trigger | Message |
|--------------|---------|---------|
| Friend Request | Someone adds you | "@Name wants to be friends!" |
| Request Accepted | Friend accepts | "@Name accepted your friend request!" |
| Gift Received | Friend sends gift | "@Name sent you a gift! Tap to claim." |
| Referral Reward | Referee reaches milestone | "Your referral @Name reached Level 10! Claim reward." |
| Leaderboard Update | Season rankings posted | "New rankings available. You're #4!" |

### 9.2 Notification Frequency

- Social notifications count toward 4/day maximum
- Batch notifications when possible (e.g., "3 gifts waiting")
- Respect quiet hours setting
- Never spam or over-notify

### 9.3 Notification Settings

```
┌─────────────────────────────────────────────────────────────┐
│  🔔 SOCIAL NOTIFICATIONS                                   │
│  ───────────────────────────────────────────────────────── │
│                                                              │
│  [✓] Friend requests                                       │
│  [✓] Gifts received                                        │
│  [✓] Referral milestones                                   │
│  [ ] Leaderboard updates                                   │
│  [ ] Friend activity                                       │
│                                                              │
│  QUIET HOURS:                                              │
│  [✓] Enabled                                              │
│  From: 22:00 To: 08:00                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Community Philosophy

### 10.1 Core Values

**Encourage Friendship:**
- Easy friend finding via Telegram
- Meaningful gift exchanges
- Activity sharing

**Promote Healthy Competition:**
- Optional leaderboards
- No punishment for losing
- Personal best tracking

**Avoid Toxicity:**
- No negative feed events
- Privacy controls
- Block/ignore features
- Moderation

**Avoid Pay-to-Win:**
- Social features are cosmetic only
- No power advantages from friends
- No competitive edge from referrals
- Leaderboards are optional

### 10.2 Design Principles

```
COMMUNITY DESIGN RULES:
✅ Foster genuine connections
✅ Celebrate friends' achievements
✅ Encourage sharing and gifting
✅ Support organic growth
✅ Provide healthy competition
❌ No harassment or spam
❌ No pay-to-win social features
❌ No manipulative prompting
❌ No competitive disadvantages
```

### 10.3 Anti-Predatory Rules

| Prohibited | Allowed |
|------------|---------|
| Buying/selling accounts | Sharing achievements |
| Fake account farms | Genuine referrals |
| Spam invitations | Sharing with close friends |
| Harassment | Friendly competition |
| Pay-to-win social | Cosmetic rewards |

---

## 11. AdsGram and Social Systems

### 11.1 Revenue Model

> **AdsGram is the PRIMARY revenue source for Jolt Time.** Social systems complement but never replace AdsGram.

| Revenue Source | Type | Priority |
|---------------|------|----------|
| AdsGram Rewarded Ads | Primary | 1 |
| AdsGram Interstitials | Primary | 2 |
| Optional Purchases | Secondary | 3 |
| Referrals (growth) | Organic | 4 |

### 11.2 Social Ad Features (Optional)

| Feature | Description | Fairness |
|---------|-------------|----------|
| Gift Boost | +1 extra gift daily | Non-competitive |
| Share Bonus | 2x coins on next share | Cosmetic only |
| Friend Finder | Suggested friends | Quality of life |

### 11.3 Leaderboard Integrity

- No ads can boost leaderboard position
- No premium advantages in competitive modes
- Cosmetic purchases only
- All players compete equally

---

## 12. System Integration

### 12.1 Connected Systems

| System | Connection |
|--------|------------|
| Profile | Friends visible on profile |
| Achievements | Social achievements unlock |
| Quests | Social quests available |
| Events | Community events |
| Economy | Gift currency flow |

### 12.2 Data Flow

```
SOCIAL ECOSYSTEM:
Friends ←→ Activity Feed
   ↓            ↓
Gifts ←→ Notifications
   ↓            ↓
Referrals ←→ Leaderboards
   ↓            ↓
Community ←→ Achievements
```

---

## 13. Quick Reference

### 13.1 Limits Summary

| Feature | Limit |
|---------|-------|
| Friends | 100 max |
| Daily Coin Gifts | 5 per friend |
| Daily Energy Gifts | 3 per friend |
| Weekly Cosmetic Gifts | 1 per friend |
| Activity Feed Items | 50 stored |

### 13.2 Reward Summary

| Referral Milestone | Reward Type |
|-------------------|-------------|
| 1 | 100 Coins + 5 Shards |
| 5 | Bronze Friend Badge |
| 10 | Silver Friend Badge + 50 Shards |
| 25 | Gold Friend Badge + 100 Shards |
| 50 | Platinum + Gold Frame + 150 Shards |
| 100 | Diamond Badge + 250 Shards |
| 500 | Legendary Badge + "Viral" + 500 Shards |
| 1000 | Mythic Badge + "Legendary Influencer" + 1000 Shards |

---

*Jolt Time is better together. Build community, share the journey, grow with friends.*
