# Jolt Time — Referral System Architecture

## Overview

The Referral System Architecture provides a comprehensive framework for viral growth through strategic referral mechanics. The architecture positions referrals as a primary user acquisition engine while maintaining integrity through fraud prevention, quality-focused rewards, and deep Telegram ecosystem integration.

> **Philosophy:** Referrals are not just rewards — they are the foundation of organic community growth, transforming players into ambassadors who bring quality users who stay.

---

## 1. Referral Categories

### 1.1 User Referrals

Standard player-to-player referral invitations.

| Type | Purpose | Tracking |
|------|---------|----------|
| **Friend Invitations** | Personal invites to friends | Direct attribution |
| **Direct Referrals** | Any referred user | Standard conversion |
| **Social Shares** | Shares to public channels | Extended attribution |
| **Group Invites** | Invites to Telegram groups | Group detection |

### 1.2 Campaign Referrals

Marketing-driven referral programs for user acquisition.

| Type | Purpose | Tracking |
|------|---------|----------|
| **Marketing Campaigns** | Brand awareness referrals | UTM + campaign ID |
| **Seasonal Campaigns** | Holiday-themed referrals | Seasonal flag |
| **Promotional Campaigns** | Limited-offer referrals | Promo code |
| **Acquisition Campaigns** | Paid acquisition tracking | Source tracking |

### 1.3 Guild Referrals

Guild-related invitation and recruitment system.

| Type | Purpose | Tracking |
|------|---------|----------|
| **Guild Invites** | Invite to specific guild | Guild ID |
| **Recruitment Links** | Guild recruitment sharing | Recruiter ID |
| **Guild Growth Rewards** | Incentives for guild growth | Guild cohort |

### 1.4 Event Referrals

Event-specific referral mechanics.

| Type | Purpose | Tracking |
|------|---------|----------|
| **Event Sharing** | Share event participation | Event ID |
| **Tournament Referrals** | Competitive event invites | Tournament ID |
| **Limited Event Referrals** | Time-limited event invites | Event expiry |

### 1.5 Influencer Referrals

Creator and influencer partnership referrals.

| Type | Purpose | Tracking |
|------|---------|----------|
| **Influencer Links** | Per-creator tracking links | Creator ID |
| **Content Creator** | Content-based referrals | Content ID |
| **Ambassador Links** | Ambassador program links | Ambassador tier |

### 1.6 Partner Referrals

Third-party partnership referral programs.

| Type | Purpose | Tracking |
|------|---------|----------|
| **Partner Links** | Partner-specific tracking | Partner ID |
| **Affiliate Links** | Affiliate program referrals | Affiliate ID |
| **Cross-Promotion** | Cross-platform referrals | Promotion ID |

---

## 2. Referral Philosophy

### 2.1 Core Principles

The referral system embodies four fundamental principles:

**Encourage Organic Growth**
- Reward genuine recommendations
- Make sharing easy and natural
- Provide share-worthy content
- Foster authentic enthusiasm
- Enable community building

**Reward Quality Users**
- Reward users who bring engaged players
- Focus on retention over raw volume
- Quality metrics in reward calculations
- Encourage long-term relationships
- Discourage volume-focused behavior

**Prevent Abuse**
- Detect and block fake accounts
- Prevent self-referral schemes
- Monitor for coordinated abuse
- Implement rate limiting
- Regular fraud pattern analysis

**Support Long-Term Retention**
- Reward sustained engagement
- Progressive reward structures
- Multi-stage reward unlocks
- Cohort-based retention tracking
- Long-tail reward attribution

### 2.2 Strategic Positioning

```
REFERRAL SYSTEM VALUE:
├── Growth Engine — Primary organic acquisition channel
├── Community Builder — Transforms players into ambassadors
├── Quality Filter — Attracts engaged users through incentives
├── Retention Tool — Rewards sustained engagement
├── Viral Loop — Compound growth through networks
└── Data Source — Quality signals from referral patterns
```

---

## 3. Referral Architecture Layers

The referral architecture follows a five-layer processing pipeline:

### 3.1 Referral Generation Layer

Creates and manages referral links and codes.

```
┌─────────────────────────────────────────────────────────┐
│                REFERRAL GENERATION LAYER                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Link Generation:                                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │  generateReferralLink(params)                    │    │
│  │  ├── type: 'user' | 'campaign' | 'guild' | ...  │    │
│  │  ├── owner_id: string                            │    │
│  │  ├── campaign_id?: string                        │    │
│  │  ├── metadata?: object                           │    │
│  │  └── returns: { link, code, deep_link }          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Code Generation:                                        │
│  ├── Unique code format: ref_{12-char alphanumeric}     │
│  ├── HMAC signature for tamper prevention               │
│  ├── Expiration settings                                │
│  ├── Usage limits                                       │
│  └── Owner association                                  │
│                                                          │
│  Link Types:                                             │
│  ├── Personal referral links (user-owned)               │
│  ├── Campaign links (admin-created)                     │
│  ├── Event links (auto-generated)                       │
│  └── One-time use links (high-value rewards)            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Referral Tracking Layer

Monitors and records referral link interactions.

```
┌─────────────────────────────────────────────────────────┐
│                  REFERRAL TRACKING LAYER                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Click Tracking:                                         │
│  ├── Record click with timestamp                        │
│  ├── Capture source platform                            │
│  ├── Capture device fingerprint                         │
│  ├── Capture geographic location                        │
│  └── Associate with potential user                      │
│                                                          │
│  Impression Tracking:                                    │
│  ├── Link shown to user                                 │
│  ├── Share channel used                                 │
│  ├── Share context (chat, group, channel)               │
│  └── Creative variant (if A/B testing)                  │
│                                                          │
│  Conversion Tracking:                                    │
│  ├── User installed/registered                          │
│  ├── Attribution window start                           │
│  ├── Attributed referral link                           │
│  └── Conversion quality metrics                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Attribution Layer

Determines referral ownership and validates attributions.

```
┌─────────────────────────────────────────────────────────┐
│                     ATTRIBUTION LAYER                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Attribution Rules:                                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Attribution Decision Flow:                      │    │
│  │                                                  │    │
│  │  User clicks referral link                       │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  Check attribution window (7 days)               │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  First-click attribution stored                  │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  User converts (signs up)                        │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  Last-click attribution for reward               │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  Validate no fraud signals                       │    │
│  │         │                                        │    │
│  │         ▼                                        │    │
│  │  Award referral credit                           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Attribution Models:                                     │
│  ├── First-click (marketing attribution)                │
│  ├── Last-click (reward attribution)                    │
│  ├── Multi-touch (complex journeys)                     │
│  └── Time-decay (recent interactions weighted)          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Reward Layer

Calculates and distributes referral rewards.

```
┌─────────────────────────────────────────────────────────┐
│                      REWARD LAYER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Reward Calculation:                                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │  calculateRewards(referral, quality_score)       │    │
│  │                                                  │    │
│  │  Returns:                                        │    │
│  │  ├── inviter_rewards: Reward[]                   │    │
│  │  ├── invited_rewards: Reward[]                   │    │
│  │  ├── milestone_bonuses: Reward[]                 │    │
│  │  └── quality_bonus: number                       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Reward Types:                                           │
│  ├── Instant rewards (on signup)                        │
│  ├── Stage rewards (milestone completions)              │
│  ├── Retention rewards (sustained engagement)           │
│  └── Bonus rewards (high-quality referrals)             │
│                                                          │
│  Distribution:                                           │
│  ├── Immediate crediting                                │
│  ├── Notification delivery                              │
│  ├── Reward claim (if applicable)                       │
│  └── History logging                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 3.5 Analytics Layer

Comprehensive tracking and reporting of referral performance.

```
┌─────────────────────────────────────────────────────────┐
│                    ANALYTICS LAYER                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Event Types:                                            │
│  ├── referral_link_created                              │
│  ├── referral_link_clicked                              │
│  ├── referral_link_shared                               │
│  ├── referral_converted                                 │
│  ├── referral_reward_earned                             │
│  ├── referral_reward_claimed                            │
│  └── referral_fraud_detected                            │
│                                                          │
│  Metrics:                                               │
│  ├── Conversion rate (clicks → signups)                 │
│  ├── Activation rate (signups → active)                 │
│  ├── Retention rate (active → retained)                 │
│  ├── Revenue per referral                               │
│  ├── Viral coefficient (K-factor)                       │
│  └── Referral quality score                             │
│                                                          │
│  Reporting:                                             │
│  ├── Real-time dashboard                                │
│  ├── Cohort analysis                                    │
│  ├── Campaign performance                               │
│  ├── User-level tracking                                │
│  └── Fraud detection alerts                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Referral Lifecycle

### 4.1 Invitation Creation

```
INVITATION CREATION FLOW:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  1. User requests referral link                          │
│         │                                                │
│         ▼                                                │
│  2. System generates unique referral code                │
│         │                                                │
│         ▼                                                │
│  3. Link created with metadata:                          │
│     ├── Owner ID                                         │
│     ├── Link type                                        │
│     ├── Creation timestamp                               │
│     ├── Expiration (if applicable)                       │
│     └── HMAC signature                                   │
│         │                                                │
│         ▼                                                │
│  4. Link stored in referral_links table                  │
│         │                                                │
│         ▼                                                │
│  5. Deep link generated:                                 │
│     t.me/jolttimebot?start=ref_{code}                   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Invitation Delivery

```
INVITATION DELIVERY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Delivery Channels:                                      │
│  ├── Telegram direct message                             │
│  ├── Telegram group message                              │
│  ├── Telegram channel post                               │
│  ├── External sharing (copy link)                        │
│  ├── QR code generation                                  │
│  └── Social media (via external apps)                    │
│                                                           │
│  Share Content:                                          │
│  ├── Pre-formatted message with link                     │
│  ├── Rich preview card (Open Graph)                      │
│  ├── Mini App preview                                    │
│  └── Inline keyboard with quick actions                  │
│                                                           │
│  Tracking:                                               │
│  ├── Share event recorded                                │
│  ├── Channel type captured                               │
│  └── Link ready for clicks                               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 4.3 User Acquisition

```
USER ACQUISITION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Acquisition Flow:                                       │
│                                                           │
│  Potential User clicks link                              │
│         │                                                │
│         ▼                                                │
│  Telegram opens Mini App with start_param                │
│         │                                                │
│         ▼                                                │
│  Mini App reads referral code                            │
│         │                                                │
│         ▼                                                │
│  New user onboarding initiated                           │
│         │                                                │
│         ▼                                                │
│  User completes registration                             │
│         │                                                │
│         ▼                                                │
│  Referral conversion event fired                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 4.4 Attribution Validation

```
ATTRIBUTION VALIDATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Validation Checks:                                       │
│  ├── Attribution window active (7 days)                  │
│  ├── No duplicate account detected                       │
│  ├── No self-referral detected                           │
│  ├── Device fingerprint unique                           │
│  ├── No fraud signals detected                           │
│  └── IP address pattern normal                           │
│                                                           │
│  If validation passes:                                    │
│  ├── Referral credited                                   │
│  ├── Rewards calculated                                  │
│  └── Analytics updated                                   │
│                                                           │
│  If validation fails:                                     │
│  ├── Referral marked as fraud                            │
│  ├── Rewards withheld                                    │
│  ├── Fraud flag set                                      │
│  └── Logged for review                                   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 4.5 Reward Eligibility

```
REWARD ELIGIBILITY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Eligibility Triggers:                                   │
│  ├── Signup completed                                    │
│  ├── Tutorial completed                                  │
│  ├── First mission completed                             │
│  ├── Level 5 reached                                     │
│  ├── Level 10 reached                                    │
│  ├── Level 20 reached                                    │
│  └── Sustained activity (7 days)                         │
│                                                           │
│  Milestone-Based Rewards:                                │
│  ├── Instant: Signup bonus                               │
│  ├── Day 3: First milestone reward                       │
│  ├── Day 7: Retention bonus                              │
│  ├── Level 5: Quality confirmation                       │
│  ├── Level 10: Sustained engagement                      │
│  └── Level 20: High-value user                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 4.6 Reward Distribution

```
REWARD DISTRIBUTION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Distribution Flow:                                       │
│                                                           │
│  Milestone reached                                       │
│         │                                                │
│         ▼                                                │
│  Check reward eligibility                                │
│         │                                                │
│         ▼                                                │
│  Calculate reward amounts                                │
│         │                                                │
│         ▼                                                │
│  Credit inviter's account                                │
│         │                                                │
│         ▼                                                │
│  Credit invited user's account                           │
│         │                                                │
│         ▼                                                │
│  Send notification to both parties                       │
│         │                                                │
│         ▼                                                │
│  Log reward in history                                   │
│         │                                                │
│         ▼                                                │
│  Update referral statistics                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 5. User Referral Architecture

### 5.1 Friend Invitations

```
FRIEND INVITATION SYSTEM:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Invitation Flow:                                        │
│  ├── User accesses referral section in Mini App         │
│  ├── User clicks "Invite Friends"                        │
│  ├── System generates unique referral link               │
│  ├── User shares via Telegram or external               │
│  ├── Friend clicks link and joins                        │
│  └── Both parties receive rewards                        │
│                                                           │
│  Share Options:                                          │
│  ├── Telegram direct message                             │
│  ├── Telegram group                                      │
│  ├── Telegram story                                      │
│  ├── Copy link                                           │
│  └── QR code                                             │
│                                                           │
│  Reward Structure:                                        │
│  ├── Referrer: 50 Dust on signup                        │
│  ├── Referee: 100 Dust + 5 Shards on signup             │
│  ├── Referrer: 1 Common Capsule at Level 5              │
│  └── Referrer: 1 Rare Capsule at Level 10               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Direct Referrals

```
DIRECT REFERRAL TRACKING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Referral Data Model:                                    │
│  {                                                       │
│    referral_id: UUID,                                    │
│    referrer_id: user_id,                                 │
│    referee_id: user_id,                                  │
│    referral_code: string,                                │
│    clicked_at: timestamp,                                │
│    signed_up_at: timestamp,                              │
│    tutorial_completed_at: timestamp,                     │
│    level_5_reached_at: timestamp,                        │
│    rewards_earned: number,                               │
│    status: 'pending' | 'active' | 'fraud' | 'expired',  │
│    quality_score: number                                 │
│  }                                                       │
│                                                           │
│  Status Transitions:                                      │
│  pending → active (signup confirmed)                     │
│  pending → expired (7 days without signup)               │
│  pending → fraud (abuse detected)                        │
│  active → inactive (30 days no activity)                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Referral Progression Tracking

```
REFERRAL PROGRESSION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Milestone Tracking:                                      │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Milestone          │ Referrer │ Referee        │     │
│  │  ───────────────────────────────────────────────│     │
│  │  Signup             │ 50 Dust  │ 100 Dust+5Shrd │     │
│  │  Tutorial Complete  │ 25 Dust  │ 25 Dust        │     │
│  │  Level 5            │ Capsule  │ —              │     │
│  │  Level 10           │ Capsule  │ —              │     │
│  │  Level 20           │ Capsule  │ —              │     │
│  │  Day 7 Active       │ +50% Dust│ —              │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Progression Visibility:                                  │
│  ├── Referral dashboard shows pending milestones         │
│  ├── Push notifications at each milestone                │
│  ├── Leaderboard for top referrers                       │
│  └── Achievement badges for referral milestones          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.4 Referral History

```
REFERRAL HISTORY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  History Tracking:                                        │
│  ├── All referral interactions logged                    │
│  ├── Reward history per referral                         │
│  ├── Referee activity timeline                           │
│  ├── Share activity history                              │
│  └── Reward claim history                                │
│                                                           │
│  User Dashboard:                                          │
│  ├── Total referrals invited                             │
│  ├── Active vs inactive referrals                        │
│  ├── Lifetime rewards earned                             │
│  ├── Pending rewards (unlocked but not claimed)          │
│  ├── Referral leaderboard position                       │
│  └── Referral achievement badges                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Campaign Referral Architecture

### 6.1 Marketing Campaigns

```
MARKETING CAMPAIGN REFERRALS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Campaign Structure:                                      │
│  ├── Campaign ID for tracking                            │
│  ├── UTM parameters for analytics                        │
│  ├── Target audience criteria                            │
│  ├── Budget allocation                                   │
│  └── Success metrics                                     │
│                                                           │
│  Link Format:                                            │
│  t.me/jolttimebot?start=campaign_{id}                   │
│                                                           │
│  Attribution:                                            │
│  ├── First-click attribution to campaign                 │
│  ├── Last-click for reward                               │
│  ├── Campaign ID in all analytics                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Seasonal Campaigns

```
SEASONAL CAMPAIGN REFERRALS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Seasonal Variants:                                      │
│  ├── Christmas referral bonuses                          │
│  ├── Summer event referrals                              │
│  ├── Halloween special rewards                           │
│  ├── Anniversary celebration referrals                   │
│  └── Lunar New Year themed links                         │
│                                                           │
│  Link Format:                                            │
│  t.me/jolttimebot?start=seasonal_{name}_{year}          │
│                                                           │
│  Special Features:                                       │
│  ├── Double referral rewards during season               │
│  ├── Seasonal-themed share content                       │
│  ├── Limited-time bonus milestones                       │
│  └── Seasonal leaderboard rankings                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Promotional Campaigns

```
PROMOTIONAL CAMPAIGN REFERRALS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Promo Code System:                                      │
│  ├── Admin-created promo codes                           │
│  ├── One-time or multi-use                               │
│  ├── Expiration dates                                    │
│  ├── Reward tier configuration                           │
│                                                           │
│  Link Format:                                            │
│  t.me/jolttimebot?start=promo_{code}                    │
│                                                           │
│  Use Cases:                                              │
│  ├── Launch promotions                                   │
│  ├── Influencer exclusives                               │
│  ├── Partner offers                                      │
│  └── Flash sale campaigns                                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 6.4 Acquisition Campaigns

```
ACQUISITION CAMPAIGN REFERRALS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Acquisition Funnel:                                     │
│  ├── Ad viewed → Click → Signup → Activation             │
│                                                           │
│  Attribution to AdsGram:                                 │
│  ├── Track click_id through referral                     │
│  ├── Link conversion to AdsGram ad                       │
│  ├── Revenue per acquired user                           │
│  └── ROI calculation per campaign                        │
│                                                           │
│  Quality Metrics:                                        │
│  ├── Day 1 retention                                     │
│  ├── Day 7 retention                                     │
│  ├── Average session duration                            │
│  └── Revenue per user                                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Guild Referral Architecture

### 7.1 Guild Recruitment

```
GUILD RECRUITMENT SYSTEM:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Recruitment Links:                                       │
│  ├── Generated by guild officers/admins                  │
│  ├── Tied to specific guild                              │
│  ├── Guild info pre-populated on click                   │
│  ├── Optional recruiter tracking                         │
│                                                           │
│  Link Format:                                            │
│  t.me/jolttimebot?start=guild_{guildId}                 │
│                                                           │
│  Recruitment Flow:                                        │
│  ├── Officer generates recruitment link                  │
│  ├── Link shared in Telegram or externally               │
│  ├── Potential member clicks link                        │
│  ├── Guild preview shown in Mini App                     │
│  ├── User joins guild (if eligible)                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Guild Invitations

```
GUILD INVITATION FLOW:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Direct Invitation:                                      │
│  ├── Guild member sends invite to friend                 │
│  ├── Friend clicks link → Guild preview                  │
│  ├── Join confirmation                                   │
│  ├── Both inviter and invitee rewarded                   │
│                                                           │
│  Reward Structure:                                        │
│  ├── Inviter: Guild contribution points                  │
│  ├── Invitee: Bonus Dust + guild welcome package         │
│  └── Guild: Growth metrics + leaderboard position        │
│                                                           │
│  Requirements:                                            │
│  ├── Inviter must be guild officer or admin              │
│  ├── Invitee must not already be in guild                │
│  ├── Invitee must meet guild requirements (if any)       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Guild Growth Incentives

```
GUILD GROWTH INCENTIVES:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Tiered Rewards:                                          │
│  ├── 3 referrals: Small guild bonus                      │
│  ├── 5 referrals: Medium guild bonus                     │
│  ├── 10 referrals: Large guild bonus                     │
│  └── 25 referrals: Guild milestone reward                │
│                                                           │
│  Guild Bonuses:                                          │
│  ├── Guild bank contributions                             │
│  ├── Guild experience points                              │
│  ├── Guild milestone unlocks                              │
│  └── Guild leaderboard boost                              │
│                                                           │
│  Leaderboard:                                            │
│  ├── Top recruiting guilds                                │
│  ├── Weekly/Monthly rankings                              │
│  ├── Recruitment achievement badges                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Event Referral Architecture

### 8.1 Event Participation Referrals

```
EVENT PARTICIPATION REFERRALS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Event Share Flow:                                        │
│  ├── User participating in event                         │
│  ├── User shares event with friends                      │
│  ├── Friends join via referral link                      │
│  ├── Both parties receive event-specific rewards         │
│                                                           │
│  Link Format:                                            │
│  t.me/jolttimebot?start=event_{eventId}                 │
│                                                           │
│  Event-Specific Rewards:                                  │
│  ├── Referrer: Event points or bonus                     │
│  ├── Referee: Event entry bonus                          │
│  ├── Both: Limited-time event cosmetics                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Event-Specific Rewards

```
EVENT-SPECIFIC REWARD STRUCTURE:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Reward Tiers by Event Type:                             │
│                                                           │
│  Battle Events:                                          │
│  ├── Referrer: Battle points bonus                       │
│  └── Referee: Extra battle attempts                      │
│                                                           │
│  Collection Events:                                       │
│  ├── Referrer: Artifact drop bonus                       │
│  └── Referee: Guaranteed rare artifact                   │
│                                                           │
│  Tournament Events:                                       │
│  ├── Referrer: Tournament points                         │
│  └── Referee: Entry fee discount                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 8.3 Viral Event Growth

```
VIRAL EVENT GROWTH:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Viral Mechanics:                                        │
│  ├── Shareable event achievements                        │
│  ├── Leaderboard position sharing                        │
│  ├── Event milestone celebrations                        │
│  └── Limited-time exclusive rewards                      │
│                                                           │
│  Growth Loop:                                            │
│  1. User enjoys event                                    │
│  2. User shares event achievement                        │
│  3. Friends join to compete                              │
│  4. More players = more competition                      │
│  5. Original user shares again                           │
│                                                           │
│  Metrics:                                                │
│  ├── Viral coefficient per event                         │
│  ├── Share-to-join conversion                            │
│  └── Event-driven organic growth                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 9. Referral Attribution Standards

### 9.1 First-Touch Attribution

```
FIRST-TOUCH ATTRIBUTION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Purpose: Marketing and campaign effectiveness           │
│                                                           │
│  Rules:                                                  │
│  ├── First referral link clicked is attributed           │
│  ├── Attribution stored at first click                   │
│  ├── Persists through conversion window (7 days)         │
│  ├── Used for campaign ROI calculation                   │
│                                                           │
│  Use Cases:                                              │
│  ├── Which campaign drove awareness                      │
│  ├── Which creative performed best                       │
│  ├── Which channel is most effective                     │
│  └── Marketing spend optimization                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Acquisition Attribution

```
ACQUISITION ATTRIBUTION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Purpose: Reward assignment and referral credit          │
│                                                           │
│  Rules:                                                  │
│  ├── Last referral link before signup is attributed      │
│  ├── Subject to fraud validation                         │
│  ├── Used for reward distribution                        │
│                                                           │
│  Use Cases:                                              │
│  ├── Determine who gets referral credit                  │
│  ├── Calculate referral rewards                          │
│  ├── Track referral quality                              │
│  └── Identify top referrers                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 9.3 Referral Ownership

```
REFERRAL OWNERSHIP:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Ownership Rules:                                        │
│  ├── Referral belongs to first valid click               │
│  ├── Ownership locked after conversion                   │
│  ├── Ownership cannot be transferred                     │
│  ├── Fraudulent referrals have ownership revoked         │
│                                                           │
│  Conflict Resolution:                                     │
│  ├── Multiple clicks from same user → First click wins   │
│  ├── Multiple clicks from different users → Each tracked │
│  ├── Self-referral attempt → Ownership denied            │
│  └── Fake account detected → Ownership revoked           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 9.4 Attribution Validation

```
ATTRIBUTION VALIDATION RULES:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Validation Steps:                                       │
│  1. Check attribution window (7 days)                    │
│  2. Verify no duplicate user (same Telegram ID)          │
│  3. Verify no self-referral (same device/IP)             │
│  4. Check device fingerprint uniqueness                  │
│  5. Analyze click pattern for bot behavior               │
│  6. Verify geographic consistency                        │
│                                                           │
│  Validation Results:                                      │
│  ├── PASS → Referral credited                            │
│  ├── FAIL_SELF_REFER → Self-referral blocked             │
│  ├── FAIL_DUPLICATE → Duplicate account blocked          │
│  ├── FAIL_SUSPICIOUS → Flagged for review                │
│  └── FAIL_BOT → Automated fraud blocked                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Reward Architecture

### 10.1 Inviter Rewards

```
INVITER REWARD STRUCTURE:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Reward Tiers:                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Milestone          │ Reward                    │     │
│  │  ───────────────────────────────────────────────│     │
│  │  Signup             │ 50 Chrono Dust            │     │
│  │  Tutorial Complete  │ 25 Chrono Dust            │     │
│  │  Level 5 Reached    │ 1 Common Artifact Capsule │     │
│  │  Level 10 Reached   │ 1 Rare Artifact Capsule   │     │
│  │  Level 20 Reached   │ 1 Epic Artifact Capsule   │     │
│  │  Day 7 Retention    │ +50% all Dust rewards     │     │
│  └─────────────────────────────────────────────────┘     │
│                                                           │
│  Quality Bonus:                                          │
│  ├── High-quality referral: +25% bonus                   │
│  ├── Exceptional referral: +50% bonus                    │
│  └── Quality based on Day 7 retention + spending         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Invited Player Rewards

```
INVITED PLAYER REWARD STRUCTURE:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Welcome Package:                                        │
│  ├── 100 Chrono Dust                                     │
│  ├── 5 Time Shards                                       │
│  ├── +50 Max Energy (7-day boost)                        │
│  └── 1 Free Common Capsule                               │
│                                                           │
│  Progressive Bonuses:                                    │
│  ├── Tutorial complete: 25 Dust bonus                    │
│  ├── Level 5 reached: Small energy boost                 │
│  └── Level 10 reached: Rare artifact hint                │
│                                                           │
│  Philosophy:                                             │
│  └── Rewards enhance experience without pay-to-win       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 10.3 Milestone Rewards

```
MILESTONE REWARD SYSTEM:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Milestone Definitions:                                   │
│  ├── Referral count milestones: 1, 3, 5, 10, 25, 50, 100│
│  ├── Each milestone unlocks tier reward                  │
│  ├── Cumulative bonuses at higher tiers                  │
│  └── Achievement badges at key milestones                │
│                                                           │
│  Milestone Rewards:                                       │
│  ├── 3 referrals: 1 Common Capsule + title              │
│  ├── 5 referrals: 1 Rare Capsule + badge                │
│  ├── 10 referrals: 1 Epic Capsule + exclusive cosmetic  │
│  ├── 25 referrals: Legendary Capsule + premium badge     │
│  └── 50/100 referrals: Mythic rewards + VIP title       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 10.4 Retention Rewards

```
RETENTION REWARD SYSTEM:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Retention Milestones:                                   │
│  ├── Day 1 retention: Inviter notified                   │
│  ├── Day 3 retention: Small bonus credited               │
│  ├── Day 7 retention: Main retention bonus               │
│  ├── Day 14 retention: Loyalty bonus                     │
│  └── Day 30 retention: VIP tier qualification           │
│                                                           │
│  Reward Calculation:                                      │
│  ├── Base retention reward                               │
│  ├── Multiplied by referral quality score                │
│  ├── Bonus for sustained referrals                       │
│  └── Cumulative for multiple retained referrals          │
│                                                           │
│  Notification:                                           │
│  ├── Inviter notified of referee's retention             │
│  ├── Celebration of successful referral                  │
│  └── Encouragement for future referrals                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 11. Fraud Prevention Architecture

### 11.1 Duplicate Account Detection

```
DUPLICATE ACCOUNT DETECTION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Detection Signals:                                       │
│  ├── Same Telegram user ID                               │
│  ├── Same phone number                                   │
│  ├── Same device fingerprint                             │
│  ├── Similar account creation timing                     │
│  └── Same IP address range                               │
│                                                           │
│  Detection Methods:                                       │
│  ├── Hash-based fingerprint matching                     │
│  ├── Time-series anomaly detection                       │
│  ├── Pattern recognition for bulk creation               │
│  └── Cross-reference with known fraud patterns           │
│                                                           │
│  Response:                                                │
│  ├── Duplicate signup blocked                            │
│  ├── Referral credit denied                              │
│  ├── Account flagged for review                          │
│  └── Inviter notified of failed validation               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 11.2 Self-Referral Prevention

```
SELF-REFERRAL PREVENTION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Detection Signals:                                       │
│  ├── Same device fingerprint                             │
│  ├── Same IP address                                     │
│  ├── Same Telegram ID (obviously)                        │
│  ├── Accounts created within short timeframe             │
│  └── Same geographic location                            │
│                                                           │
│  Prevention Rules:                                        │
│  ├── Self-referral immediately invalidated                │
│  ├── Device fingerprint check before credit              │
│  ├── IP pattern analysis at signup                       │
│  ├── Behavioral analysis for suspicious patterns         │
│                                                           │
│  User Experience:                                        │
│  ├── Self-referral shows as "not eligible"              │
│  ├── No reward granted                                   │
│  ├── Clear messaging that self-referral is not allowed   │
│  │                                                      │
│  Note: Family members with separate accounts may still   │
│  refer each other legitimately                          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 11.3 Fake Account Detection

```
FAKE ACCOUNT DETECTION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Detection Signals:                                       │
│  ├── Bot-like account creation patterns                  │
│  ├── No Mini App activity after signup                   │
│  ├── No real engagement metrics                          │
│  ├── Accounts created in rapid succession                │
│  ├── Suspicious referral patterns (same source)          │
│                                                           │
│  Analysis Methods:                                       │
│  ├── Behavioral analysis (engagement patterns)           │
│  ├── Device fingerprint clustering                       │
│  ├── IP address clustering                               │
│  ├── Time-series pattern detection                       │
│  └── Machine learning anomaly detection                  │
│                                                           │
│  Response:                                                │
│  ├── Suspicious accounts flagged                         │
│  ├── Rewards withheld pending review                     │
│  ├── Bulk fraud detected → automatic action              │
│  └── Legitimate accounts unaffected                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 11.4 Abuse Monitoring

```
ABUSE MONITORING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Monitoring Systems:                                      │
│  ├── Real-time fraud detection                           │
│  ├── Batch analysis for patterns                          │
│  ├── User-reported abuse tracking                         │
│  ├── Community trust signals                             │
│                                                           │
│  Alert Thresholds:                                        │
│  ├── >10 referrals from same device → Alert              │
│  ├── >50% failed validations → Alert                     │
│  ├── Unusual referral burst → Alert                      │
│  ├── New fraud pattern detected → Alert                  │
│                                                           │
│  Response Actions:                                        │
│  ├── Individual: Warning or suspension                   │
│  ├── Coordinated: Bulk account review                    │
│  ├── Severe: Account termination + rewards clawback      │
│  └── Pattern: System rule update                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 12. Analytics Architecture

### 12.1 Referral Conversions

```
CONVERSION ANALYTICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Funnel Tracking:                                         │
│  Link Created → Link Clicked → Signed Up → Activated     │
│                                                           │
│  Metrics:                                                │
│  ├── Click-through rate (CTR)                            │
│  ├── Signup conversion rate                              │
│  ├── Activation rate (signup → active)                   │
│  ├── Overall conversion rate                             │
│  ├── Time to conversion                                  │
│  │                                                      │
│  Attribution:                                            │
│  ├── By referral type                                    │
│  ├── By campaign                                         │
│  ├── By referrer                                         │
│  └── By time period                                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 12.2 Referral Quality

```
REFERRAL QUALITY ANALYTICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Quality Metrics:                                         │
│  ├── Day 1/7/30 retention rate                           │
│  ├── Average session duration                            │
│  ├── Sessions per week                                   │
│  ├── Revenue per referral (if applicable)                │
│  ├── Progression speed (levels per week)                 │
│  │                                                      │
│  Quality Scoring:                                        │
│  ├── Tier 1 (Exceptional): Top 10%                       │
│  ├── Tier 2 (High): Top 25%                              │
│  ├── Tier 3 (Average): Middle 50%                        │
│  ├── Tier 4 (Low): Bottom 15%                            │
│  │                                                      │
│  Applications:                                           │
│  ├── Reward multiplier calculation                       │
│  ├── Referrer leaderboard                                │
│  ├── Fraud detection weighting                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 12.3 Acquisition Efficiency

```
ACQUISITION EFFICIENCY ANALYTICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Efficiency Metrics:                                      │
│  ├── Cost per referral (CPR)                             │
│  ├── Cost per activated user (CPA)                       │
│  ├── Revenue per referral                                │
│  ├── Referral ROI                                        │
│  │                                                      │
│  Viral Coefficient (K-factor):                           │
│  ├── K = Invites sent × Conversion rate                  │
│  ├── K > 1 = Viral growth                                │
│  ├── K < 1 = Non-viral                                   │
│  │                                                      │
│  Growth Analysis:                                        │
│  ├── Organic vs paid referral ratio                      │
│  ├── Referral contribution to total growth               │
│  ├── Referral cohort lifetime value                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 12.4 Referral Retention

```
RETENTION ANALYTICS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Retention Cohorts:                                       │
│  ├── By referral month                                   │
│  ├── By referral type                                    │
│  ├── By campaign source                                  │
│  └── By referrer quality tier                            │
│                                                           │
│  Retention Curves:                                        │
│  ├── Day 1/7/14/30/60/90 retention                       │
│  ├── Compared to non-referred users                      │
│  ├── By referral quality score                           │
│  │                                                      │
│  Insights:                                               │
│  ├── Which referral sources drive best retention         │
│  ├── Optimal reward timing                               │
│  ├── Quality vs quantity tradeoffs                       │
│  └── Retention program effectiveness                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 13. Deep Link Integration Standards

### 13.1 Referral Links

```
REFERRAL DEEP LINK STANDARDS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Link Format:                                            │
│  t.me/jolttimebot?start=ref_{referralCode}              │
│                                                           │
│  Components:                                             │
│  ├── ref_ prefix identifies referral type                │
│  ├── 12-character alphanumeric code                      │
│  ├── HMAC signature for tamper prevention                │
│  └── Optional UTM parameters                             │
│                                                           │
│  Mini App Handling:                                       │
│  ├── Parse start_param on load                           │
│  ├── Extract referral code                               │
│  ├── Validate and store for attribution                  │
│  └── Trigger onboarding flow with context                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 13.2 Campaign Links

```
CAMPAIGN DEEP LINK STANDARDS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Link Format:                                            │
│  t.me/jolttimebot?start=campaign_{campaignId}           │
│                                                           │
│  With UTM:                                               │
│  t.me/jolttimebot?start=campaign_{id}&utm_source=tg...  │
│                                                           │
│  Parameters:                                             │
│  ├── campaign_id for attribution                         │
│  ├── utm_source for channel tracking                     │
│  ├── utm_medium for medium tracking                      │
│  ├── utm_campaign for campaign tracking                  │
│  └── utm_content for creative tracking                   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 13.3 Attribution Tracking

```
ATTRIBUTION TRACKING IN LINKS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Link Parameters:                                         │
│  ├── start_param: Referral type and ID                   │
│  ├── utm_source: Traffic source                          │
│  ├── utm_medium: Marketing medium                        │
│  ├── utm_campaign: Campaign identifier                   │
│  └── utm_content: Creative variant                       │
│                                                           │
│  Storage:                                                │
│  ├── First-click stored in click tracking                │
│  ├── All parameters logged at click                      │
│  ├── Conversion links parameters to user                  │
│  │                                                      │
│  Analytics:                                             │
│  ├── Campaign attribution via utm_                       │
│  ├── Channel performance via utm_source                  │
│  └── Creative performance via utm_content                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 13.4 Conversion Tracking

```
CONVERSION TRACKING:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Conversion Events:                                       │
│  ├── referral_link_clicked                               │
│  ├── referral_signup_completed                           │
│  ├── referral_onboarding_completed                       │
│  ├── referral_milestone_reached                          │
│  └── referral_reward_claimed                             │
│                                                           │
│  Data Captured:                                          │
│  ├── Link ID                                             │
│  ├── Referrer ID                                         │
│  ├── Click timestamp                                     │
│  ├── Signup timestamp                                    │
│  ├── Conversion source                                   │
│  └── Attribution parameters                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 14. Telegram Integration Standards

### 14.1 Telegram Sharing

```
TELEGRAM SHARING INTEGRATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Share Methods:                                          │
│  ├── share_url API for native share                      │
│  ├── Inline keyboard buttons                             │
│  ├── Telegram message with deep link                     │
│  └── Story sharing with link overlay                     │
│                                                           │
│  Share Content:                                          │
│  ├── Pre-formatted invitation text                       │
│  ├── Open Graph preview card                             │
│  ├── Mini App preview (if supported)                     │
│  └── Inline keyboard with quick actions                  │
│                                                           │
│  Tracking:                                               │
│  ├── Share event logged                                  │
│  ├── Share channel captured                              │
│  └── Share recipient count (where available)             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 14.2 Invitation Flows

```
INVITATION FLOW INTEGRATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Flow Steps:                                             │
│  1. User taps "Invite Friends" in Mini App               │
│  2. System generates referral link                       │
│  3. Share UI presented with options                      │
│  4. User selects Telegram sharing method                 │
│  5. Telegram share sheet opens with pre-filled content   │
│  6. User confirms and sends                             │
│  7. Share event tracked                                  │
│                                                           │
│  Deep Link Generation:                                   │
│  ├── Link created with user context                      │
│  ├── Stored for attribution tracking                     │
│  ├── Expiration set (if applicable)                      │
│  └── HMAC signature applied                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 14.3 Mini App Onboarding

```
MINI APP ONBOARDING INTEGRATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Onboarding with Referral:                               │
│  1. User clicks referral link                            │
│  2. Mini App opens with start_param                      │
│  3. Onboarding detects referral context                  │
│  4. Welcome message shows referrer info (if available)   │
│  5. Enhanced signup bonus displayed                      │
│  6. Onboarding proceeds with referral tracking           │
│  7. Referral credited on signup                          │
│                                                           │
│  Context Display:                                        │
│  ├── "Your friend invited you!"                          │
│  ├── Referrer's name (if public)                         │
│  ├── Bonus rewards for signing up                        │
│  └── Expected shared rewards                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 14.4 Bot-Driven Referrals

```
BOT-DRIVEN REFERRAL FLOW:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Bot Commands for Referrals:                              │
│  ├── /referral — View referral status                    │
│  ├── /invite — Generate new referral link                │
│  ├── /rewards — View pending referral rewards            │
│  │                                                      │
│  Bot Notifications:                                      │
│  ├── Referral milestone reached                          │
│  ├── Referee signed up                                   │
│  ├── Referee reached Level 5                             │
│  └── Reward credited                                     │
│                                                           │
│  Mini App Deep Links from Bot:                           │
│  ├── Bot generates link with /app command                │
│  ├── User clicks → Mini App opens with context           │
│  └── Attribution preserved through the flow              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 15. AdsGram Integration Notes

### 15.1 Acquisition Campaigns

```
ADSGRAM + REFERRAL ACQUISITION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Integration Flow:                                       │
│  ├── AdsGram serves ad with referral tracking            │
│  ├── User clicks ad → Deep link activated                │
│  ├── User signs up via referral flow                     │
│  ├── Conversion tracked back to AdsGram                  │
│  ├── Revenue shared appropriately                        │
│                                                           │
│  Tracking Parameters:                                    │
│  ├── adsgram_campaign_id                                 │
│  ├── adsgram_click_id                                    │
│  ├── referral_code                                       │
│  └── conversion_timestamp                                │
│                                                           │
│  Attribution:                                           │
│  ├── AdsGram gets credit for acquisition                 │
│  ├── Referral system tracks downstream                   │
│  ├── Combined analytics for ROI                          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 15.2 Monetization Campaigns

```
ADSGRAM + REFERRAL MONETIZATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Reward Campaigns via Referrals:                         │
│  ├── "Watch ad to boost referral rewards"                │
│  ├── "Ad bonus doubles your referral earnings"           │
│  ├── "Watch ad to unlock premium referral tier"          │
│                                                           │
│  Integration:                                           │
│  ├── Referral dashboard shows ad bonus option            │
│  ├── User watches ad via AdsGram                         │
│  ├── Referral rewards multiplied                         │
│  ├── Analytics track ad-referral correlation             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 15.3 Conversion Optimization

```
CONVERSION OPTIMIZATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Referral + AdsGram Funnel:                             │
│                                                           │
│  Awareness → Ad View → Click → Signup → Activation       │
│                    ↑                                     │
│              Referral Link Created                       │
│                    ↓                                     │
│              User Shares → More Users                    │
│                                                           │
│  Optimization Points:                                    │
│  ├── Referral link on ad landing page                    │
│  ├── Share prompt after first session                    │
│  ├── Referral milestone notifications                    │
│  └── AdsGram integration for referral bonuses            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 15.4 Growth Analytics

```
GROWTH ANALYTICS INTEGRATION:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Combined Metrics:                                       │
│  ├── AdsGram cost + referral cost = total acquisition    │
│  ├── AdsGram users + referred users = total new users    │
│  ├── Revenue from both channels                          │
│  ├── Retention comparison                                │
│  │                                                      │
│  Reporting:                                             │
│  ├── Unified acquisition dashboard                       │
│  ├── Channel comparison                                  │
│  ├── Quality cohort analysis                             │
│  └── ROI by channel                                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 16. Scalability Philosophy

### 16.1 Thousands of Referrals

```
REFERRAL VOLUME SCALABILITY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Architecture Supports:                                  │
│  ├── Millions of referral codes                          │
│  ├── Efficient code lookup and validation                │
│  ├── Batch code generation for campaigns                 │
│  ├── Link pooling for high-traffic scenarios             │
│  │                                                      │
│  Storage Strategy:                                       │
│  ├── Indexed by code for O(1) lookup                     │
│  ├── Partitioned by creation date                        │
│  ├── Archived for old/expired links                      │
│  └── Cache hot links in Redis                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 16.2 Millions of Invitations

```
INVITATION VOLUME SCALABILITY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Click Processing:                                       │
│  ├── Async write for click events                        │
│  ├── Batch processing for analytics                      │
│  ├── Real-time attribution calculation                   │
│  ├── Horizontal scaling of processors                    │
│  │                                                      │
│  Performance Targets:                                    │
│  ├── <50ms click processing at P99                       │
│  ├── >10,000 clicks per second                           │
│  ├── 99.9% uptime for referral service                   │
│  │                                                      │
│  Database:                                              │
│  ├── Sharded by user_id for referral data                │
│  ├── Read replicas for analytics                         │
│  └── Time-series DB for click events                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 16.3 Large-Scale Campaigns

```
CAMPAIGN SCALABILITY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Campaign Support:                                       │
│  ├── Millions of links per campaign                      │
│  ├── Real-time campaign analytics                        │
│  ├── Dynamic link allocation                             │
│  ├── Campaign pause/resume                               │
│  │                                                      │
│  Limits:                                                │
│  ├── Max links per campaign: 10,000,000                  │
│  ├── Max clicks per link: Unlimited                      │
│  ├── Max concurrent campaigns: 100                       │
│  └── Max referral links per user: 1,000                  │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 17. Future Expansion Notes

> **Note:** The following are conceptual future expansions. Implementation not scheduled.

### 17.1 AI-Powered Referrals

```
AI-POWERED REFERRAL SYSTEM (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Features:                                     │
│  ├── Smart referral targeting (who to invite)            │
│  ├── Optimal timing suggestions (when to invite)         │
│  ├── Personalized share messages                         │
│  ├── Referral success prediction                         │
│  ├── Automated referral optimization                     │
│  │                                                      │
│  AI Integration:                                        │
│  ├── Analyze user network for potential invites          │
│  ├── Predict referral success probability                │
│  ├── Generate personalized invitation copy               │
│  └── Recommend referral rewards                          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.2 Creator Referral Programs

```
CREATOR REFERRAL PROGRAMS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Features:                                      │
│  ├── Creator-specific referral links                     │
│  ├── Creator dashboard with analytics                    │
│  ├── Revenue share for creators                          │
│  ├── Exclusive creator referral rewards                  │
│  │                                                      │
│  Link Format:                                            │
│  t.me/jolttimebot?start=creator_{creatorId}             │
│                                                           │
│  Creator Tools:                                          │
│  ├── Referral statistics                                 │
│  ├── Audience insights                                   │
│  ├── Content performance                                 │
│  └── Payout tracking                                     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.3 Web3 Referral Campaigns

```
WEB3 REFERRAL CAMPAIGNS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Features:                                      │
│  ├── Wallet-based referral tracking                      │
│  ├── Token-gated referral rewards                        │
│  ├── NFT rewards for successful referrals                │
│  ├── Smart contract referral distributions               │
│  │                                                      │
│  Integration:                                           │
│  ├── TON wallet verification                             │
│  ├── Token reward distribution                           │
│  ├── NFT airdrop for referrals                           │
│  └── Decentralized referral verification                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.4 NFT Referral Programs

```
NFT REFERRAL PROGRAMS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Features:                                      │
│  ├── NFT minted for each referral                        │
│  ├── Special NFT for high-volume referrers               │
│  ├── NFT-gated referral tiers                            │
│  ├── NFT trading rewards                                 │
│  │                                                      │
│  NFT Rewards:                                           │
│  ├── Bronze referrer NFT (3 referrals)                   │
│  ├── Silver referrer NFT (10 referrals)                  │
│  ├── Gold referrer NFT (25 referrals)                    │
│  └── Legendary referrer NFT (100 referrals)              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 17.5 Esports Ambassador Programs

```
ESPORTS AMBASSADOR PROGRAMS (Future):
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Potential Features:                                      │
│  ├── Ambassador tier system                              │
│  ├── Exclusive ambassador referral links                 │
│  ├── Tournament-specific referral campaigns              │
│  ├── Team/player ambassador programs                     │
│  │                                                      │
│  Ambassador Tiers:                                       │
│  ├── Bronze: 50 referrals                                │
│  ├── Silver: 200 referrals                               │
│  ├── Gold: 500 referrals                                 │
│  └── Platinum: 1000+ referrals                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 18. Long-Term Philosophy

### 18.1 Major Growth Engine

```
GROWTH ENGINE PHILOSOPHY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Strategic Position:                                     │
│  ├── Primary organic growth channel                      │
│  ├── Compound growth through networks                    │
│  ├── Quality-focused acquisition                         │
│  ├── Community-driven expansion                          │
│                                                           │
│  Success Metrics:                                        │
│  ├── Viral coefficient > 1.0                             │
│  ├── Referral contribution > 40% of new users            │
│  ├── Referral CAC < 50% of paid CAC                      │
│  └── Referral quality score > average                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 18.2 Acquisition Efficiency

```
ACQUISITION EFFICIENCY:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Efficiency Goals:                                       │
│  ├── Minimize cost per acquired user                     │
│  ├── Maximize quality per dollar spent                   │
│  ├── Optimize reward-to-value ratio                      │
│  ├── Balance volume vs quality                           │
│                                                           │
│  Optimization Areas:                                     │
│  ├── Reward structure efficiency                         │
│  ├── Fraud prevention (reduce waste)                     │
│  ├── Targeting efficiency                                │
│  └── Conversion funnel optimization                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 18.3 Retention Quality

```
RETENTION QUALITY FOCUS:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Quality Principles:                                     │
│  ├── Referred users retained at higher rates             │
│  ├── Quality referrals = engaged users                   │
│  ├── Reward quality, not just quantity                   │
│  ├── Long-term relationship building                     │
│                                                           │
│  Quality Metrics:                                        │
│  ├── Day 7 retention: 40%+ for referred users            │
│  ├── Day 30 retention: 25%+ for referred users           │
│  ├── Revenue per user: Higher for referred               │
│  └── Lifetime value: 50%+ higher for referred            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 18.4 Ecosystem Expansion

```
ECOSYSTEM EXPANSION SUPPORT:
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  Expansion Readiness:                                    │
│  ├── Scalable architecture for growth                    │
│  ├── Flexible reward system for new types                │
│  ├── Campaign infrastructure for initiatives             │
│  ├── Analytics for new programs                          │
│                                                           │
│  Future Integration Support:                             │
│  ├── Creator economy programs                            │
│  ├── Web3 and NFT initiatives                            │
│  ├── Esports and tournament systems                      │
│  ├── Educational partnerships                            │
│  │                                                      │
│  Platform Growth:                                        │
│  ├── Referral → Guild referrals                          │
│  ├── Guild → Community growth                            │
│  ├── Community → Viral content                           │
│  └── Viral → Organic acquisition                         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Summary

The Referral System Architecture provides Jolt Time with a comprehensive, fraud-resistant framework for viral growth. By implementing this layered architecture, the system achieves:

- **Organic Growth** — Natural community expansion through player advocacy
- **Quality Focus** — Reward structure that attracts and retains engaged users
- **Fraud Prevention** — Multi-layered detection and prevention systems
- **Deep Integration** — Seamless Telegram ecosystem and Mini App experience
- **Scalability** — Architecture designed for millions of referrals
- **Analytics** — Comprehensive tracking for data-driven optimization

This architecture document serves as the definitive reference for all referral functionality in Jolt Time, ensuring sustainable viral growth while maintaining system integrity.