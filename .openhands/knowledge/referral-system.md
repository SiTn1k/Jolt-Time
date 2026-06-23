# Jolt Time — Referral System and Viral Growth

## Overview

The Referral System is designed to encourage organic growth and community expansion by rewarding players who invite friends to join Jolt Time. The system emphasizes **mutual benefit** — both referrer and referee receive valuable rewards that enhance their gameplay experience without creating pay-to-win advantages.

> The system must encourage organic growth and community expansion, never incentivizing fake accounts or spam.

---

## 1. Personal Referral Links

### 1.1 Referral Link Format

Every player receives a unique referral link with their personalized code:

| Format | Example |
|--------|---------|
| **Deep Link** | `https://t.me/jolttimebot?start=ref_ABC123XYZ` |
| **Short Code** | `ref_ABC123XYZ` |
| **Invite URL** | `https://t.me/jolttimebot?start=ref_ABC123XYZ` |

### 1.2 Player Referral Dashboard

Each player has access to a comprehensive referral statistics screen:

```
┌─────────────────────────────────────────┐
│  👥 YOUR REFERRALS                       │
├─────────────────────────────────────────┤
│                                         │
│  Your Invite Code:                      │
│  ┌─────────────────────────────────┐    │
│  │  ref_ABC123XYZ                  │    │
│  │  [📋 Copy] [🔗 Share Link]      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  STATISTICS:                            │
│  ────────────────────────────           │
│  Total Invited:     12 players         │
│  Active Referrals:   8 players (67%)   │
│  Lifetime Rewards:   2,450 Dust        │
│                    50 Shards           │
│                                         │
│  YOUR POSITION:                         │
│  #42 on Weekly Leaderboard              │
│  Top 15% of all inviters!              │
│                                         │
│  [👥 View Referral List]                │
│  [🏆 Referral Leaderboard]              │
│  [🎁 Milestone Rewards]                 │
│                                         │
└─────────────────────────────────────────┘
```

### 1.3 Referral Link Generation

```typescript
interface ReferralCode {
  code: string;           // Unique 10-character code
  playerId: string;       // Owner's user ID
  createdAt: Date;        // When code was created
  totalUses: number;      // Total successful referrals
  activeUses: number;     // Currently active referrals
  lifetimeRewards: {
    dust: number;
    shards: number;
    boosts: number;
  };
}
```

### 1.4 Share Options

Players can share their referral link through multiple channels:

| Channel | Method | Integration |
|---------|--------|-------------|
| **Telegram Direct** | Share button | Opens Telegram share sheet |
| **Telegram Group** | Share to group | Pre-formatted group message |
| **Telegram Story** | Share to story | Photo + link overlay |
| **External Copy** | Copy to clipboard | Manual sharing |
| **QR Code** | Generate QR | Offline sharing |

---

## 2. Rewards for Invited Players (Referees)

### 2.1 Welcome Bonus Structure

New players who join via referral receive a generous starter package:

| Reward Type | Amount | Description |
|-------------|--------|-------------|
| **Chrono Dust** | 100 | Starter upgrade currency |
| **Time Energy** | +50 max capacity | Temporary 7-day boost |
| **Time Shards** | 5 | Premium currency for cosmetics |
| **Free Capsule** | 1 | Common capsule to start collection |
| **Tutorial Completion** | Bonus: 25 Dust | Extra reward for finishing |

### 2.2 Referee Bonus Progression

The referee receives escalating bonuses based on their activity:

| Milestone | Bonus Reward | Condition |
|-----------|--------------|-----------|
| **Day 1 Login** | +50 Chrono Dust | Account created |
| **Tutorial Complete** | +1 Free Capsule | Finish tutorial |
| **Level 5 Reached** | +25 Chrono Dust | First progression goal |
| **First Mission** | +15 Chrono Dust | Core action completed |
| **First Artifact** | +10 Chrono Dust | Collection started |
| **3-Day Streak** | +50 Chrono Dust | Habit formed |

### 2.3 Referee Reward Summary

```
NEW PLAYER STARTER PACK:
┌─────────────────────────────────────────┐
│  🎁 WELCOME TO JOLT TIME!              │
│                                         │
│  Thanks to your friend, you've received │
│  a Welcome Package!                     │
│                                         │
│  🎁 Your Welcome Bonus:                  │
│  • 100 Chrono Dust                     │
│  • 5 Time Shards                        │
│  • +50 Max Energy (7 days)              │
│  • 1 Free Common Capsule                │
│                                         │
│  Complete tutorial for +25 bonus!       │
│                                         │
│  [CLAIM WELCOME PACKAGE]               │
└─────────────────────────────────────────┘
```

---

## 3. Rewards for Inviter (Referrer)

### 3.1 Per-Referral Rewards

For every successfully referred player who meets eligibility criteria:

| Reward Type | Amount | Notes |
|-------------|--------|-------|
| **Chrono Dust** | 100 | Immediate reward |
| **Time Shards** | 5 | Premium currency |
| **2x XP Boost** | 1 hour | Temporary gameplay boost |
| **2x Dust Boost** | 1 hour | Temporary upgrade boost |
| **Energy Refill** | Full | One-time energy restore |

### 3.2 Reward Delivery

```
REFERRAL COMPLETED:
┌─────────────────────────────────────────┐
│  🎉 You Earned a Referral Reward!        │
│                                         │
│  [Player Name] just joined Jolt Time!   │
│                                         │
│  Your Rewards:                           │
│  • 100 Chrono Dust                     │
│  • 5 Time Shards                        │
│  • 1 Hour 2x XP Boost                  │
│  • 1 Hour 2x Dust Boost                │
│  • Full Energy Refill                  │
│                                         │
│  [CLAIM REWARDS]                        │
│                                         │
│  Total Referrals: 13                    │
│  Next Milestone: 15 (Rare Capsule)      │
└─────────────────────────────────────────┘
```

### 3.3 Boost Activation

Temporary boosts are automatically applied to the referrer's account:

```
BOOSTS ACTIVE:
┌─────────────────────────────────────────┐
│  ⚡ YOUR ACTIVE BOOSTS                  │
│                                         │
│  2x XP Boost                            │
│  ████████████████░░░░ 45:23 remaining  │
│                                         │
│  2x Chrono Dust Boost                   │
│  ██████████████████░ 1:15:00 remaining │
│                                         │
│  [View All Boosts]                      │
└─────────────────────────────────────────┘
```

---

## 4. Milestone Rewards

### 4.1 Milestone Tier System

| Milestone | Total Referrals | Rewards Unlocked |
|-----------|-----------------|------------------|
| **Tier 1** | 1 | Base referral rewards |
| **Tier 2** | 5 | Bronze Friend badge |
| **Tier 3** | 10 | Silver Friend badge + 50 Shards |
| **Tier 4** | 25 | Gold Friend badge + 100 Shards + Bronze Frame |
| **Tier 5** | 50 | Platinum Friend badge + 150 Shards + Silver Frame |
| **Tier 6** | 100 | Diamond Friend badge + 250 Shards + Gold Frame |
| **Tier 7** | 500 | Legendary Friend badge + 500 Shards + "Viral" title |
| **Tier 8** | 1000 | Mythic Friend badge + 1000 Shards + "Legendary Influencer" title + Exclusive Avatar |

### 4.2 Milestone Reward Details

| Milestone | Badge | Frame | Title | Shards | Special |
|-----------|-------|-------|-------|--------|---------|
| 1 referral | — | — | — | — | — |
| 5 referrals | Bronze Friend | — | — | — | — |
| 10 referrals | Silver Friend | Bronze | — | 50 | — |
| 25 referrals | Gold Friend | Silver | — | 100 | — |
| 50 referrals | Platinum Friend | Gold | — | 150 | — |
| 100 referrals | Diamond Friend | Gold | "Influencer" | 250 | — |
| 500 referrals | Legendary Friend | — | "Viral" | 500 | — |
| 1000 referrals | Mythic Friend | — | "Legendary Influencer" | 1000 | Exclusive Avatar |

### 4.3 Milestone Progress Display

```
┌─────────────────────────────────────────┐
│  🏆 REFERRAL MILESTONES                  │
├─────────────────────────────────────────┤
│                                         │
│  YOUR PROGRESS: 13 / 25                 │
│  ████████████████░░░░░░░░ 52%         │
│                                         │
│  CURRENT TIER: Silver Friend             │
│  NEXT UNLOCK: Gold Friend               │
│                                         │
│  ───────────────────────────────────    │
│                                         │
│  ✓ 5 Referrals — Bronze Friend         │
│  ✓ 10 Referrals — Silver Friend        │
│  → 25 Referrals — Gold Friend          │
│    └─ 12 more referrals needed         │
│  → 50 Referrals — Platinum Friend      │
│  → 100 Referrals — Diamond Friend      │
│  → 500 Referrals — Legendary Friend    │
│  → 1000 Referrals — Mythic Friend      │
│                                         │
│  [SHARE TO UNLOCK NEXT TIER]           │
│                                         │
└─────────────────────────────────────────┘
```

### 4.4 Exclusive Rewards Preview

```
TIER 100 — DIAMOND FRIEND:
┌─────────────────────────────────────────┐
│  💎 Diamond Friend Badge                 │
│  "Referred 100 players to Jolt Time"    │
│                                         │
│  🏆 Diamond Referral Frame              │
│  "Community Champion"                   │
│                                         │
│  👤 Title: "Influencer"                │
│  "Your influence spans civilizations"   │
│                                         │
│  💰 +250 Time Shards                    │
│                                         │
└─────────────────────────────────────────┘

TIER 1000 — MYTHIC FRIEND:
┌─────────────────────────────────────────┐
│  🌈 Mythic Friend Badge                 │
│  "Referred 1000 players — LEGENDARY"   │
│                                         │
│  👤 Title: "Legendary Influencer"      │
│  "A force of temporal nature"          │
│                                         │
│  🎭 Exclusive Avatar: "Time Lord"       │
│  Animated avatar with temporal effects  │
│                                         │
│  💰 +1000 Time Shards                  │
│                                         │
│  🏛️ Hall of Fame Induction             │
│  Permanent display in community hall    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Anti-Abuse Protection

### 5.1 Abuse Prevention Matrix

| Abuse Type | Prevention Method |
|------------|------------------|
| **Self-referral** | Telegram user ID matching, device fingerprinting |
| **Fake accounts** | Telegram auth validation, behavioral analysis |
| **Reward farming** | Activity requirements before reward activation |
| **Sybil attacks** | IP rate limiting, phone verification |
| **Scripted referrals** | CAPTCHA on signup, human detection |

### 5.2 Eligibility Requirements

Rewards activate only after the referee completes these requirements:

| Requirement | Threshold | Purpose |
|-------------|-----------|---------|
| **Tutorial Complete** | 100% | Confirms real engagement |
| **Minimum Level** | Level 3 | Proves continued interest |
| **Session Count** | 3 sessions | Ensures active user |
| **Days Active** | 2 days | Eliminates throwaway accounts |
| **Mission Completed** | 1 mission | Confirms gameplay |

### 5.3 Reward Activation Flow

```
Referral Completed:
     │
     ▼
┌─────────────────────────────────────┐
│  CHECK ELIGIBILITY                   │
│                                     │
│  □ Tutorial 100% complete?          │
│  □ Level >= 3?                      │
│  □ 3+ sessions logged?              │
│  □ 2+ days active?                   │
│  □ 1+ mission completed?            │
└─────────────────────────────────────┘
     │
     │  ALL PASS
     ▼
┌─────────────────────────────────────┐
│  AWARD REFERRAL REWARDS              │
│                                     │
│  To Referrer:                        │
│  • 100 Chrono Dust                  │
│  • 5 Time Shards                    │
│  • Boosts activated                 │
│                                     │
│  To Referee:                         │
│  • Welcome package unlocked          │
│                                     │
└─────────────────────────────────────┘
     │
     │  FAIL
     ▼
┌─────────────────────────────────────┐
│  PENDING STATUS                      │
│                                     │
│  Rewards held until requirements     │
│  are met. Tracked for 30 days.      │
│  After 30 days, rewards expire.     │
└─────────────────────────────────────┘
```

### 5.4 Detection Systems

```typescript
interface AbuseDetection {
  // Self-referral prevention
  selfReferralCheck: {
    sameTelegramId: boolean;
    sameDeviceId: boolean;
    samePhoneNumber: boolean;
  };
  
  // Fake account detection
  fakeAccountCheck: {
    accountAge: number;          // Must be > 1 minute
    sessionDuration: number;     // Must be > 30 seconds
    tutorialCompleted: boolean;  // Must be true
    behavioralScore: number;    // Must be > threshold
  };
  
  // Rate limiting
  rateLimitCheck: {
    referralsPerHour: number;    // Max 5/hour
    referralsPerDay: number;    // Max 20/day
    referralsPerWeek: number;    // Max 50/week
  };
  
  // Geographic clustering
  geoClusterCheck: {
    sameIPCount: number;         // Max 2 per IP
    sameCityCount: number;       // Max 3 per city
    vpnDetected: boolean;        // Reject VPN
  };
}
```

### 5.5 Penalty System

| Violation | Consequence |
|-----------|------------|
| **First abuse detected** | Rewards confiscated, warning issued |
| **Repeat offense** | Account flagged, rewards frozen 30 days |
| **Severe abuse** | Account suspended, referral stats cleared |
| **Coordinated attack** | All accounts terminated, IP banned |

---

## 6. Referral Leaderboard

### 6.1 Leaderboard Tiers

| Timeframe | Update | Rewards |
|-----------|--------|---------|
| **Weekly** | Every Monday | Top 10 get bonus rewards |
| **Monthly** | 1st of month | Top 50 featured in game |
| **Lifetime** | Always | Hall of Fame permanent |

### 6.2 Weekly Leaderboard

```
┌─────────────────────────────────────────┐
│  🏆 WEEKLY REFERRAL LEADERS             │
│  Week of June 16-22, 2026              │
├─────────────────────────────────────────┤
│                                         │
│  🥇 #1: TimeKeeper_Mike                │
│     └─ 47 referrals this week          │
│     └─ 2,350 Chrono Dust earned        │
│                                         │
│  🥈 #2: AncientExplorer                 │
│     └─ 38 referrals this week          │
│     └─ 1,900 Chrono Dust earned        │
│                                         │
│  🥉 #3: ChronoMaster                    │
│     └─ 31 referrals this week          │
│     └─ 1,550 Chrono Dust earned        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Your Position: #42                     │
│  8 referrals this week                  │
│  400 Chrono Dust earned                │
│                                         │
│  [VIEW FULL RANKINGS]                   │
│  [YOUR STATS]                           │
│                                         │
└─────────────────────────────────────────┘
```

### 6.3 Weekly Rewards

| Rank | Reward |
|------|--------|
| #1 | 500 Chrono Dust + 25 Shards + Gold Frame (7 days) |
| #2 | 300 Chrono Dust + 15 Shards + Silver Frame (7 days) |
| #3 | 200 Chrono Dust + 10 Shards + Bronze Frame (7 days) |
| #4-10 | 100 Chrono Dust + 5 Shards |
| #11-50 | 50 Chrono Dust |
| Top 100 | +50% referral bonus for week |

### 6.4 Monthly Leaderboard

```
┌─────────────────────────────────────────┐
│  👑 MONTHLY REFERRAL CHAMPIONS          │
│  June 2026                             │
├─────────────────────────────────────────┤
│                                         │
│  👑 Monthly Champion:                    │
│  [Avatar] TimeKeeper_Mike               │
│  156 referrals                          │
│  "The temporal empire builder"          │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  FEATURED TOP 10:                       │
│  [Avatars displayed in scrolling list]  │
│                                         │
│  #2  - AncientExplorer - 134 refs      │
│  #3  - ChronoMaster - 121 refs         │
│  #4  - EgyptQueen - 98 refs            │
│  #5  - RomeRuler - 87 refs             │
│  ...                                    │
│                                         │
│  [VIEW FULL MONTHLY RANKINGS]           │
│                                         │
└─────────────────────────────────────────┘
```

### 6.5 Lifetime Hall of Fame

```
┌─────────────────────────────────────────┐
│  🏛️ REFERRAL HALL OF FAME               │
│  Legendary Community Builders            │
├─────────────────────────────────────────┤
│                                         │
│  🌟 TOP REFERRERS OF ALL TIME           │
│                                         │
│  #1  ChronoKing — 2,847 referrals      │
│      "The community chose him"          │
│      Member since: March 2024          │
│                                         │
│  #2  TemporalQueen — 2,156 referrals   │
│      "Building empires across time"    │
│      Member since: April 2024          │
│                                         │
│  #3  HistoryHunter — 1,923 referrals   │
│      "Every era, a new friend"         │
│      Member since: April 2024          │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  YOUR LIFETIME STATS:                    │
│  Total Referrals: 47                    │
│  Your Rank: #156                        │
│                                         │
│  [SUBMIT YOUR STORY]                    │
│  Top referrers may be featured!         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. Social Sharing

### 7.1 Share Integration

| Platform | Method | Pre-populated Content |
|----------|--------|----------------------|
| **Telegram Direct** | Share button | "Join me in Jolt Time!" + link |
| **Telegram Group** | Share to group | Group invite message |
| **Telegram Channel** | Share to channel | Channel promotion message |
| **Telegram Story** | Photo + link | Branded story template |
| **Copy Link** | Clipboard | Manual sharing anywhere |

### 7.2 Share Message Templates

#### Direct Message
```
Join me in Jolt Time! 🕐

Travel through history, collect amazing artifacts,
and restore the timeline!

Use my link to get a Welcome Bonus:
https://t.me/jolttimebot?start=ref_ABC123XYZ

I'll get rewards when you join too! 🎁
```

#### Group Message
```
Time Travelers Wanted! 🏛️

I've been playing Jolt Time and it's amazing!
Collect artifacts from ancient civilizations,
complete missions, and climb the leaderboards.

Join with my link for a bonus:
https://t.me/jolttimebot?start=ref_ABC123XYZ

Who else wants to be a Time Keeper? ⏳
```

#### Story Template
```
📸 Image: Jolt Time branded visual with temporal effects
📝 Caption: "Join me on a temporal adventure! 🕐
            Use my link for Welcome Bonus 🎁
            https://t.me/jolttimebot?start=ref_ABC123XYZ"
```

### 7.3 Share UI Design

```
┌─────────────────────────────────────────┐
│  📤 SHARE YOUR LINK                     │
│                                         │
│  Your Code: ref_ABC123XYZ               │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  [📱 Telegram]                  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  [👥 Telegram Group]            │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  [📸 Telegram Story]            │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  [📋 Copy Link]                 │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  [🔗 Generate QR Code]           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  CUSTOMIZE MESSAGE:                     │
│  ┌─────────────────────────────────┐    │
│  │ Join me in Jolt Time! 🕐...    │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Special Referral Campaigns

### 8.1 Campaign Types

| Campaign | Duration | Bonus | Description |
|----------|----------|-------|-------------|
| **Double Referral Rewards** | 3-7 days | 2x Dust/Shards | All referrals earn double |
| **Weekend Warrior** | Fri-Sun | +50% Dust | Weekend referrals bonus |
| **Milestone Flash** | 48 hours | 3x Shards | One milestone tier boosted |
| **Friend Rush** | 1 week | +1 shard per referral | Extra shard on every referral |
| **Community Goal** | 7 days | Pool reward | Collective referral target |

### 8.2 Double Rewards Campaign

```
🎉 DOUBLE REFERRAL REWARDS EVENT!

For the next 7 days, all referrals earn DOUBLE!

Your Rewards When Friend Joins:
• 200 Chrono Dust (2x from 100)
• 10 Time Shards (2x from 5)
• 2 Boosts (instead of 1)

Your Friend Gets:
• 200 Chrono Dust Welcome Bonus
• 10 Time Shards
• Extended boosts

Share now and multiply your rewards!
[SHARE LINK] →

Time Remaining: 6d 14h 23m
```

### 8.3 Community Referral Goal

```
🌍 COMMUNITY REFERRAL CHALLENGE!

This Week's Goal: 10,000 Referrals

Progress: ████████████░░░░ 7,234 / 10,000

If reached, everyone gets:
• +100 Chrono Dust bonus
• "Community Builder" badge
• Celebration in-game event

Current Top Contributors:
#1 TimeKeeper_Mike - 156 refs
#2 AncientExplorer - 134 refs
#3 ChronoMaster - 121 refs

Help us reach the goal! Share your link!
[SHARE NOW] →
```

### 8.4 Seasonal Referral Events

```
🏛️ HISTORICAL WEEK: EGYPT EDITION

Special referral bonus for Egypt Week!

Refer a friend during Egypt Week:
• +150 Chrono Dust (bonus)
• "Nile Companion" badge
• Egyptian-themed frame

Your friend gets:
• Egyptian Starter Pack
• +1 bonus Time Shard

Limited to 10 bonus referrals.
[REFER NOW] →
```

---

## 9. Future Expansion

### 9.1 Guild Invitations

Preparing infrastructure for guild-based referrals:

```yaml
guild_invitations:
  features:
    - guild_leader_can_create_invite_link
    - members_can_share_guild_invite
    - guild_referral_tracking
    - guild_bonus_for_referrals
  
  rewards:
    referrer_gets: "guild_points + personal rewards"
    referee_gets: "guild_welcome_pack + personal rewards"
    guild_gets: "recruitment_contribution_score"
  
  tracking:
    - who_invited_whom
    - referral_channel (personal vs guild)
    - guild_membership_duration
```

### 9.2 Ambassador Programs

Structured program for top community builders:

```yaml
ambassador_program:
  tiers:
    bronze_ambassador:
      requirement: "100+ referrals, active community"
      benefits:
        - "Exclusive ambassador badge"
        - "Direct feedback channel to devs"
        - "Ambas

sador-only events"
        - "Discord role: Ambassador"
    
    silver_ambassador:
      requirement: "500+ referrals, content creation"
      benefits:
        - "All Bronze benefits"
        - "Beta access to new features"
        - "Featured in community spotlight"
        - "Exclusive cosmetic: Ambassador Frame"
    
    gold_ambassador:
      requirement: "1000+ referrals, active content"
      benefits:
        - "All Silver benefits"
        - "Invitation to annual event"
        - "Custom referral link with name"
        - "Exclusive cosmetic: Ambassador Aura"
        - "Swag package (physical rewards)"
```

### 9.3 Creator Partnerships

Integration for content creators and influencers:

```yaml
creator_partnerships:
  features:
    - custom_tracked_referral_links
    - creator_dashboard
    - audience_referral_stats
    - unique_creator_codes
  
  partnership_levels:
    micro:
      followers: "1K-10K"
      benefits:
        - "Custom creator code"
        - "5% bonus on referrals"
        - "Creator profile badge"
    
    mid:
      followers: "10K-100K"
      benefits:
        - "All Micro benefits"
        - "10% bonus on referrals"
        - "Featured on partner page"
        - "Exclusive creator cosmetics"
    
    macro:
      followers: "100K+"
      benefits:
        - "All Mid benefits"
        - "Co-branded events"
        - "Revenue share on referrals"
        - "Priority support"
        - "Direct dev access"
```

### 9.4 Influencer Campaign Infrastructure

```
INFLUENCER INTEGRATION:
┌─────────────────────────────────────────┐
│  CREATOR DASHBOARD                      │
├─────────────────────────────────────────┤
│                                         │
│  Your Stats:                            │
│  • Total Clicks: 15,234                │
│  • Signups: 1,847                      │
│  • Conversion Rate: 12.1%              │
│                                         │
│  Your Earnings:                         │
│  • Base Referrals: 1,847               │
│  • Bonus (10%): 184.7 equivalents      │
│  • Total Impact: 2,031.7              │
│                                         │
│  [PROMO TOOLS]                          │
│  [YOUR CONTENT LINKS]                   │
│  [PARTNER SUPPORT]                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 10. Referral Flow Summary

### 10.1 Complete Referral Journey

```
REFERER FLOW:
────────────────────────────────────────────
1. Player views referral dashboard
       ↓
2. Generates/shares unique link
       ↓
3. Friend clicks link → /start ref_XXX
       ↓
4. Friend creates account
       ↓
5. Friend completes tutorial
       ↓
6. Friend reaches Level 3, 3 sessions
       ↓
7. System validates eligibility
       ↓
8. Referrer receives rewards
       ↓
9. Both see celebration message
       ↓
10. Progress tracked in leaderboard
────────────────────────────────────────────

REFEREE FLOW:
────────────────────────────────────────────
1. Clicks referral link
       ↓
2. Joins Jolt Time via Telegram
       ↓
3. Sees "Referred by [Name]" message
       ↓
4. Receives Welcome Package
       ↓
5. Completes tutorial
       ↓
6. Reaches eligibility threshold
       ↓
7. Referrer rewards activated
       ↓
8. Referee sees thank-you message
       ↓
9. Encouraged to share own code
────────────────────────────────────────────
```

---

## 11. Complete Reward Tables

### 11.1 Referrer Rewards Summary

| Trigger | Chrono Dust | Time Shards | Boosts |
|---------|-------------|-------------|--------|
| Per Referral (base) | 100 | 5 | 1hr 2x XP, 1hr 2x Dust |
| Milestone 5 | — | — | Bronze Friend Badge |
| Milestone 10 | — | 50 | Silver Friend Badge, Bronze Frame |
| Milestone 25 | — | 100 | Gold Friend Badge, Silver Frame |
| Milestone 50 | — | 150 | Platinum Friend Badge, Gold Frame |
| Milestone 100 | — | 250 | Diamond Friend Badge, Gold Frame, Title |
| Milestone 500 | — | 500 | Legendary Friend Badge, "Viral" Title |
| Milestone 1000 | — | 1000 | Mythic Friend Badge, "Legendary Influencer", Avatar |

### 11.2 Referee Rewards Summary

| Trigger | Chrono Dust | Time Shards | Other |
|---------|-------------|-------------|-------|
| Welcome Package | 100 | 5 | +50 Max Energy (7 days), 1 Capsule |
| Tutorial Complete | 25 | — | — |
| Level 5 Reached | 25 | — | — |
| 3-Day Streak | 50 | — | — |
| **Total Potential** | **200** | **5** | **Energy Boost, Capsule** |

### 11.3 Leaderboard Rewards

| Period | Rank | Reward |
|--------|------|--------|
| Weekly | #1 | 500 Dust, 25 Shards, Gold Frame (7d) |
| Weekly | #2 | 300 Dust, 15 Shards, Silver Frame (7d) |
| Weekly | #3 | 200 Dust, 10 Shards, Bronze Frame (7d) |
| Weekly | #4-10 | 100 Dust, 5 Shards |
| Weekly | #11-50 | 50 Dust |
| Monthly | #1 | Featured Champion + 1000 Dust |
| Lifetime | Hall of Fame | Permanent display |

---

## 12. Anti-Abuse Strategy

### 12.1 Multi-Layer Defense

```
LAYER 1: SIGNUP VALIDATION
├── Telegram auth validation
├── Account age verification (>1 min)
├── Phone number verification (optional)
└── CAPTCHA on suspicious signups

LAYER 2: BEHAVIOR ANALYSIS
├── Session duration monitoring
├── Action pattern detection
├── Tutorial completion rate
└── Mission engagement tracking

LAYER 3: IDENTITY VERIFICATION
├── Device fingerprinting
├── IP address clustering
├── Phone number matching
└── Telegram ID validation

LAYER 4: REWARD GATING
├── Eligibility requirements (Level 3, 3 sessions)
├── 48-hour holding period
├── Progressive reward release
└── Activity verification

LAYER 5: MONITORING & RESPONSE
├── Real-time anomaly detection
├── Automated investigation
├── Manual review escalation
└── Graduated penalty system
```

### 12.2 Eligibility Requirements Detail

| Requirement | Value | Validation Method |
|-------------|-------|-------------------|
| Tutorial | 100% complete | System flag |
| Player Level | ≥ Level 3 | XP threshold |
| Sessions | ≥ 3 distinct | Session tracking |
| Active Days | ≥ 2 days | Login timestamps |
| Missions | ≥ 1 completed | Mission log |
| Holding Period | 48 hours | Timestamp check |

### 12.3 Detection Thresholds

| Behavior | Threshold | Action |
|----------|-----------|--------|
| Same IP multiple signups | >2 | Review + hold rewards |
| Rapid-fire referrals | >5/hour | Temp block + review |
| Short session duration | <30 sec | Flag for analysis |
| Tutorial abandonment | >50% | Flag for analysis |
| Suspected bot activity | Score <0.7 | CAPTCHA + review |

### 12.4 Penalty Enforcement

| Violation | First Offense | Repeat | Severe |
|-----------|---------------|--------|--------|
| Self-referral | Confiscate rewards | 30-day freeze | Permanent ban |
| Fake accounts | Delete fake accounts | Account suspension | IP ban |
| Scripted activity | Rewards void | 7-day lock | Permanent ban |
| Bought referrals | All rewards void | + 30-day lock | Permanent ban |

---

## 13. Long-Term Growth Vision

### 13.1 Viral Growth Mechanics

```
GROWTH FLYWHEEL:

More Players
    ↓
More Community Activity
    ↓
More Social Proof
    ↓
More Referrals
    ↓
More Players (cycle continues)

SUPPORTING ELEMENTS:
├── Engaging core gameplay (retention)
├── Shareable achievements (organic sharing)
├── Social features (community)
├── Referral rewards (incentive)
└── Ambassador program (champions)
```

### 13.2 Growth Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| **K-Factor** | >1.2 | Each user refers >1.2 others |
| **Viral Coefficient** | >0.5 | Organic growth multiplier |
| **Referral Conversion** | >15% | Clicks → signups |
| **Referral Retention** | >60% | D7 retention of referred |
| **Cost Per Acquisition** | <$0.10 | Via AdsGram revenue |

### 13.3 Community Building Focus

> The system must encourage organic growth and community expansion.

```
ORGANIC GROWTH PRINCIPLES:
✅ Rewards for genuine invitations
✅ Community recognition for top referrers
✅ Ambassador program for super-inviters
✅ Creator partnerships for external reach
✅ Guild invitations for group growth
✅ Shareable achievements that spread naturally

ORGANIC GROWTH AVOIDS:
❌ Buying referrals
❌ Spam invitations
❌ Fake account farms
❌ Manipulative prompting
❌ Pressure tactics
```

### 13.4 Sustainable Growth Model

```
SUSTAINABLE GROWTH CYCLE:

Phase 1: SEED
├── Initial player base via Telegram organic
├── Core gameplay polished
└── Early ambassadors identified

Phase 2: NURTURE
├── Referral system launched
├── Rewards calibrated for balance
└── Community features expanded

Phase 3: SCALE
├── Ambassador program introduced
├── Creator partnerships activated
└── Seasonal referral campaigns

Phase 4: MATURE
├── Organic growth self-sustaining
├── Community drives new player acquisition
└── Quality over quantity focus
```

---

## 14. Technical Implementation Notes

### 14.1 Data Models

```typescript
interface Referral {
  id: string;
  referrerId: string;      // Who invited
  refereeId: string;       // Who joined
  code: string;            // Referral code used
  status: 'pending' | 'eligible' | 'rewarded';
  eligibilityProgress: {
    tutorialComplete: boolean;
    level: number;
    sessionCount: number;
    activeDays: number;
    missionsCompleted: number;
  };
  rewards: {
    referrerAwarded: boolean;
    refereeAwarded: boolean;
    awardTimestamp?: Date;
  };
  createdAt: Date;
  eligibilityMetAt?: Date;
}

interface ReferralCode {
  code: string;            // Unique code (e.g., ref_ABC123XYZ)
  playerId: string;
  totalClicks: number;
  totalSignups: number;
  totalRewarded: number;
  activeReferrals: number;
  lifetimeRewards: {
    dust: number;
    shards: number;
    boosts: number;
  };
  milestoneTier: number;
  createdAt: Date;
}
```

### 14.2 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/referral/code` | GET | Get player's referral code |
| `/api/referral/stats` | GET | Get referral statistics |
| `/api/referral/referrals` | GET | List all referrals |
| `/api/referral/rewards` | GET | Get reward history |
| `/api/referral/leaderboard` | GET | Get leaderboard |
| `/api/referral/claim/:id` | POST | Claim referral reward |
| `/api/referral/validate` | POST | Validate referral eligibility |

### 14.3 Event Triggers

| Event | Action |
|-------|--------|
| User clicks referral link | Create pending referral record |
| User completes signup | Link to referrer |
| User completes tutorial | Update eligibility progress |
| User reaches Level 3 | Check eligibility, award if complete |
| Rewards claimed | Update stats, trigger notifications |
| Milestone reached | Award milestone rewards, notify |

---

*The referral system is a bridge between players. Build it with trust, reward it with generosity, and guard it with vigilance.*
