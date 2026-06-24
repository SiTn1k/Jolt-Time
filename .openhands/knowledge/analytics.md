# Jolt Time — Analytics and Product Metrics

## Overview

Jolt Time's analytics ecosystem provides actionable insights into player behavior, game health, and business performance. The system balances data-driven decision making with a strong commitment to player privacy. Analytics should illuminate opportunities to improve player experience, not exploit players.

**Core Philosophy:**
- Analytics serves player experience improvement, not exploitation
- Collect only necessary data for meaningful insights
- Privacy-first approach — no unnecessary tracking
- Real-time monitoring for game health and stability
- Actionable insights over raw data collection

---

## 1. Core Product Metrics

### 1.1 User Activity Metrics

```
USER ACTIVITY METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  DAILY ACTIVE USERS (DAU)                                       │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: Unique users who performed any action in 24h      │
│  Calculation: COUNT(DISTINCT user_id) WHERE date = yesterday  │
│  Update Frequency: Daily at 00:00 UTC                           │
│  Target Baseline: Industry benchmark 20-40% of MAU             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  WEEKLY ACTIVE USERS (WAU)                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: Unique users who performed any action in 7 days    │
│  Calculation: COUNT(DISTINCT user_id) WHERE date >= 7 days ago │
│  Update Frequency: Weekly on Monday                              │
│  Target Baseline: 40-60% of MAU                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  MONTHLY ACTIVE USERS (MAU)                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: Unique users who performed any action in 30 days  │
│  Calculation: COUNT(DISTINCT user_id) WHERE date >= 30 days ago │
│  Update Frequency: Monthly                                       │
│  Target Baseline: Total registered users - churned              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Engagement Metrics

```
SESSION METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  AVERAGE SESSION LENGTH                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: Mean duration from app open to close               │
│  Calculation: AVG(session_end - session_start)                  │
│  Update Frequency: Daily                                        │
│  Target: 8-15 minutes for casual, 20-30 for dedicated          │
│  Warning Thresholds: <5 min (engagement issue), >60 min (addiction concern)│
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SESSIONS PER DAY                                               │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: Average number of sessions per active user per day │
│  Calculation: SUM(sessions) / COUNT(DISTINCT users)              │
│  Update Frequency: Daily                                        │
│  Target: 1.5-3 sessions/day                                     │
│  Segments: New (<1.5), Regular (1.5-3), Power Users (>3)     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  DAILY PLAY TIME DISTRIBUTION                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Segments: Morning (6-12), Afternoon (12-18), Evening (18-24)  │
│  Peak Hours: Identify for event scheduling and maintenance       │
│  Off-Peak: Plan updates and deployments                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Growth Metrics

```
GROWTH METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  NEW USER ACQUISITION                                           │
│  ─────────────────────────────────────────────────────────────  │
│  New Registrations: Users creating first account                │
│  New Players: Users completing tutorial                         │
│  Activation Rate: New Players / New Registrations (target >70%)│
│                                                                 │
│  GROWTH RATE:                                                  │
│  Daily: (DAU_today - DAU_yesterday) / DAU_yesterday            │
│  Weekly: (WAU_this - WAU_last) / WAU_last                    │
│  Monthly: (MAU_this - MAU_last) / MAU_last                    │
│                                                                 │
│  FUNNEL ANALYSIS:                                              │
│  Bot Start → Mini App Open → Tutorial Complete → First Battle → │
│  First Artifact → Daily Return                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Retention Metrics

### 2.1 Retention Cohorts

```
RETENTION COHORT ANALYSIS:
┌─────────────────────────────────────────────────────────────────┐
│  RETENTION COHORT STRUCTURE                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Cohort Definition: Users grouped by first login date           │
│  Period: Daily, Weekly, Monthly cohorts                        │
│  Duration: Track up to 90 days                                 │
│                                                                 │
│  STANDARD COHORT TABLE:                                         │
│  ┌──────────┬───────┬───────┬───────┬───────┬───────┐        │
│  │ Cohort   │ Day 0 │ Day 1 │ Day 7 │ Day 14│ Day 30│        │
│  ├──────────┼───────┼───────┼───────┼───────┼───────┤        │
│  │ Jan 1   │ 1000  │ 400   │ 250   │ 200   │ 150   │        │
│  │ Jan 8   │ 1200  │ 480   │ 300   │ 240   │ —     │        │
│  │ Jan 15  │ 1100  │ 440   │ 275   │ —     │ —     │        │
│  └──────────┴───────┴───────┴───────┴───────┴───────┘        │
│                                                                 │
│  Day 0 = Day of registration (100% by definition)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Retention Indicators

```
RETENTION KPIs:
┌─────────────────────────────────────────────────────────────────┐
│  DAY 1 RETENTION (D1)                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: % of new users returning the next day              │
│  Industry Benchmark: 25-35% for casual games                   │
│  Jolt Time Target: >30%                                         │
│  Warning: <25% indicates onboarding issues                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  DAY 7 RETENTION (D7)                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: % of new users returning 7 days after signup       │
│  Industry Benchmark: 10-15% for casual games                   │
│  Jolt Time Target: >12%                                         │
│  Warning: <10% indicates engagement issues                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  DAY 30 RETENTION (D30)                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: % of new users returning 30 days after signup      │
│  Industry Benchmark: 5-8% for casual games                     │
│  Jolt Time Target: >6%                                          │
│  Warning: <5% indicates core game loop issues                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Churn and Returning Players

```
CHURN METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  CHURN DEFINITIONS                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  At-Risk: No login in 3-6 days                                 │
│  Churned: No login in 7-29 days                                │
│  Dormant: No login in 30-89 days                               │
│  Reactivated: Dormant user who returned                         │
│                                                                 │
│  CHURN RATE:                                                   │
│  Daily Churn = Users lost / Total users at start                │
│  Rolling 7-day or 30-day windows                               │
│                                                                 │
│  RETURNING PLAYER METRICS:                                     │
│  Reactivation Rate: Returning / Churned total                   │
│  Reactivation Time: Days from churn to return                   │
│  Reactivation Value: DAU contribution from reactivated           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Gameplay Metrics

### 3.1 PvP Battle Metrics

```
PVP ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  BATTLE COUNTS                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Total Battles: Daily/Weekly/Monthly counts                    │
│  Battles per DAU: Total battles / DAU                          │
│  Battle Distribution: Casual vs Ranked vs Event                │
│  Battle Trend: Battle count changes over time                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  WIN RATES                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Overall Win Rate: Wins / Total Battles                        │
│  Win Rate by Rank: Win rates across rank tiers                 │
│  Win Rate by Era: Win rates by artifact era                    │
│  Average Battle Duration: Mean seconds per battle               │
│  Turn Distribution: Turns per battle histogram                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  LEAGUE DISTRIBUTION                                            │
│  ─────────────────────────────────────────────────────────────  │
│  League Breakdown: % of players in each league tier             │
│  League Progression: Time to advance between leagues            │
│  Demotion Rate: Players dropping leagues per season             │
│  League Activity: Players participating in league battles       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SEASONAL PARTICIPATION                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Season Active Players: Players with any season activity        │
│  Season Battle Count: Total battles during season               │
│  Season Win Rate: Win rate during season                        │
│  Season Completion: % reaching final season tier                 │
│  Off-Season Activity: Battles during non-competitive periods    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Expedition Metrics

```
EXPEDITION ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  EXPEDITION PARTICIPATION                                        │
│  ─────────────────────────────────────────────────────────────  │
│  Total Expeditions: Daily/Weekly/Monthly                        │
│  Success Rate: Successful / Total expeditions                   │
│  Average Duration: Time from start to completion                 │
│                                                                 │
│  ERA POPULARITY:                                               │
│  Distribution: % of expeditions by era                         │
│  Completion Rates: Per-era success percentages                  │
│  Drop Rates: Artifact drops by era and rarity                   │
│                                                                 │
│  RISK PREFERENCE:                                              │
│  Standard vs Risky vs Perilous distribution                     │
│  Success rates by risk level                                   │
│  Reward optimization analysis                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Collection and Museum Metrics

```
COLLECTION ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  ARTIFACT ACQUISITION                                           │
│  ─────────────────────────────────────────────────────────────  │
│  Total Collected: Artifacts per user distribution               │
│  Collection Rate: Artifacts acquired per active day             │
│  Rarity Distribution: Common through Mythic percentages          │
│  Duplicate Rate: Duplicates / Total acquisitions                │
│                                                                 │
│  ERA COMPLETION:                                               │
│  Average Completion: % of total artifacts per player            │
│  Era Progress: Distribution of completion percentages            │
│  Missing Artifacts: Most desired/unobtained                    │
│                                                                 │
│  MUSEUM ENGAGEMENT:                                            │
│  Museum Visits: Per user per day/week                           │
│  Donations: Total artifacts donated                             │
│  Wing Unlocks: Progression through museum                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Mission and Progression Metrics

```
MISSION ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  DAILY MISSION COMPLETION                                       │
│  ─────────────────────────────────────────────────────────────  │
│  Completion Rate: Completed / Available                        │
│  Difficulty Distribution: Easy/Medium/Hard completion %         │
│  Average Time: Time to complete each difficulty                 │
│  Refresh Usage: Free vs Premium refresh rates                   │
│                                                                 │
│  BATTLE PASS PROGRESSION:                                       │
│  Tier Distribution: % of players at each tier                   │
│  Progression Rate: Tiers per week                             │
│  Free vs Premium: Track conversion points                        │
│  Season Completion: % reaching max tier                         │
│                                                                 │
│  LEVEL PROGRESSION:                                            │
│  Level Distribution: Bell curve analysis                        │
│  XP Sources: Breakdown by activity type                         │
│  Time to Level: Average days between levels                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Economy Metrics

### 4.1 Currency Flow Analysis

```
CURRENCY METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  CHRONO COIN ECONOMY                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Generation Sources:                                             │
│  • Daily missions: Total earned per day                         │
│  • Achievements: Total earned per day                          │
│  • Events: Total earned per day                                │
│  • Referrals: Total earned per day                             │
│  • Other: Total earned per day                                 │
│                                                                 │
│  Sink Destinations:                                            │
│  • Shop purchases: Total spent per day                         │
│  • Resource shop: Total spent per day                          │
│  • Convenience items: Total spent per day                       │
│                                                                 │
│  HEALTH INDICATORS:                                            │
│  Generation/Sink Ratio: Target 1.0-1.2 (slight net positive)   │
│  Per-Capita Balance: Average player balance                     │
│  Cap Proximity: % of players near cap                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Resource Generation

```
GENERATION METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  TIME SHARD GENERATION                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Sources:                                                       │
│  • Mission rewards: Daily average                               │
│  • Battle rewards: Daily average                               │
│  • Event rewards: Daily average                                │
│  • Achievement milestones: Daily average                       │
│                                                                 │
│  Usage Patterns:                                                │
│  • Capsule purchases: Daily average                             │
│  • Evolution materials: Daily average                           │
│  • Conversion rates: Shards to other currencies                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  INFLATION MONITORING                                           │
│  ─────────────────────────────────────────────────────────────  │
│  Supply Growth: Month-over-month currency increase              │
│  Value指標: Purchase power of currency over time                │
│  Sink Efficiency: % of generated currency being spent           │
│  Risk Alerts: >20% monthly inflation triggers review          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Economy Health Dashboard

```
ECONOMY HEALTH KPIs:
┌─────────────────────────────────────────────────────────────────┐
│  SUPPLY METRICS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Total in Circulation: Sum of all player balances              │
│  Daily Net Change: Generation - Sinks                          │
│  Per-Player Average: Total / Active Players                     │
│  Median vs Mean: Detect distribution skew                       │
│                                                                 │
│  FLOW METRICS                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Average Daily Generation: Per active player                    │
│  Average Daily Sinks: Per active player                        │
│  Sink Ratio: Sinks / Generation                                 │
│  Velocity: Transactions per unit of currency                   │
│                                                                 │
│  ALERT THRESHOLDS:                                             │
│  Green: Sink ratio 0.9-1.1                                     │
│  Yellow: Sink ratio 0.8-0.9 or 1.1-1.2                         │
│  Red: Sink ratio <0.8 or >1.2 (action required)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. AdsGram Metrics

### 5.1 Ad Performance Metrics

```
ADSGRAM PERFORMANCE:
┌─────────────────────────────────────────────────────────────────┐
│  IMPRESSION METRICS                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Total Impressions: Daily/Weekly/Monthly                       │
│  Fill Rate: Impressions / Requests (target >95%)                │
│  Viewability Rate: % meeting viewability standard (>70%)       │
│  Impression Distribution: By ad type (rewarded/interstitial)    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  COMPLETION METRICS                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Completion Rate: Completed views / Started views                │
│  Skip Rate: Skips / Total started (interstitial)               │
│  Average Watch Time: Mean seconds per ad                       │
│  Rewarded vs Interstitial: Distribution of completions         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  REWARD METRICS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Reward Claims: Total rewards claimed per day                   │
│  Claim Rate: Claims / Completions (target >95%)               │
│  Reward Distribution: By reward type                           │
│  Ad-Triggered Actions: Post-ad engagement                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Revenue Metrics

```
ADSGRAM REVENUE:
┌─────────────────────────────────────────────────────────────────┐
│  REVENUE METRICS                                                │
│  ─────────────────────────────────────────────────────────────  │
│  Daily Revenue: Actual earnings per day                         │
│  Revenue per DAU: Daily Revenue / DAU (target >$0.04)          │
│  Revenue per 1000 Impressions (RPM): Revenue * 1000 / Impressions│
│  Effective CPM: Revenue * 1000 / Completed Views               │
│                                                                 │
│  TRENDS:                                                        │
│  Day-over-Day: % change                                        │
│  Week-over-Week: % change                                       │
│  Month-over-Month: % change                                    │
│                                                                 │
│  SEGMENTATION:                                                  │
│  By ad type (rewarded vs interstitial)                         │
│  By country/region                                             │
│  By device type                                                 │
│  By player segment                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Player Ad Engagement

```
AD ENGAGEMENT PROFILES:
┌─────────────────────────────────────────────────────────────────┐
│  AD VIEWING SEGMENTS                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Non-Viewers: Never watch ads (opt-out or no interest)         │
│  Light Users: 1-2 ads per day                                  │
│  Regular Users: 3-5 ads per day                                │
│  Power Users: 5+ ads per day                                   │
│                                                                 │
│  BEHAVIORAL METRICS:                                           │
│  Average ads per DAU: Total ads / DAU                          │
│  Ad Intent Rate: Rewarded / Total opportunities                │
│  Session Ad Ratio: Ads per session                              │
│                                                                 │
│  CONVERSION FUNNEL:                                           │
│  Ad Shown → Watched >50% → Completed → Reward Claimed          │
│  Drop-off analysis at each step                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Monetization Metrics

### 6.1 Purchase Funnel

```
PURCHASE ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  CONVERSION METRICS                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Payers: Unique users who made any purchase                    │
│  Payer Rate: Payers / DAU (target 1-3%)                        │
│  Average Revenue Per User (ARPU): Total Revenue / DAU          │
│  Average Revenue Per Paying User (ARPPU): Total Revenue / Payers│
│                                                                 │
│  PURCHASE FUNNEL:                                              │
│  Shop Visit → Purchase Intent → Checkout Started → Completed    │
│  Conversion rates at each stage                                │
│  Drop-off reasons (where available)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Purchase Categories

```
PURCHASE BREAKDOWN:
┌─────────────────────────────────────────────────────────────────┐
│  TELEGRAM STARS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Pack Distribution: % choosing each pack tier                 │
│  Average Order Value: Stars per purchase                       │
│  Purchase Frequency: Purchases per payer per month             │
│  Repeat Rate: % of payers making 2+ purchases                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  TON PURCHASES                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Adoption Rate: TON buyers / Total buyers                       │
│  Average Order Value: TON equivalent                             │
│  Volume: Total TON processed                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  BATTLE PASS SALES                                              │
│  ─────────────────────────────────────────────────────────────  │
│  Season Pass Rate: Premium / Free ratio                        │
│  Upgrade Rate: Free → Premium conversion %                      │
│  Renewal Rate: Repeat season purchases                          │
│  Bundle Adoption: % choosing bundle vs pass alone              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  JOLT TIME PLUS SUBSCRIPTIONS                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Subscriber Count: Active subscriptions                        │
│  Conversion Rate: Visitors → Subscribers                       │
│  Churn Rate: Cancellations / Subscribers                      │
│  Renewal Rate: Month-over-month retention                       │
│  Tier Distribution: Monthly vs Annual                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Revenue Metrics

```
REVENUE BREAKDOWN:
┌─────────────────────────────────────────────────────────────────┐
│  REVENUE STREAMS                                                │
│  ─────────────────────────────────────────────────────────────  │
│  AdsGram: Primary revenue (target 60-70% of total)            │
│  Telegram Stars: Secondary revenue                              │
│  TON: Tertiary (growing)                                        │
│  Battle Pass: Episodic revenue                                 │
│  Subscriptions: Recurring revenue                              │
│                                                                 │
│  LIFETIME VALUE:                                               │
│  LTV (Ads): Revenue per user over 90 days                     │
│  LTV (Payers): Average revenue from paying users               │
│  LTV by Acquisition Source: Organic vs Referrals vs Paid       │
│                                                                 │
│  COHORT REVENUE:                                               │
│  Revenue by signup cohort                                       │
│  7-day, 30-day, 90-day revenue per cohort                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Event Metrics

### 7.1 Event Participation

```
EVENT ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  PARTICIPATION METRICS                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Total Participants: Unique players engaging with event         │
│  Participation Rate: Participants / Eligible players            │
│  Active Participants: Those completing at least 1 action        │
│  Highly Active: Those completing 50%+ of event content          │
│                                                                 │
│  ENGAGEMENT DEPTH:                                             │
│  Average Actions per Participant                                │
│  Distribution of completions                                   │
│  Completionists: Players finishing all content                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Seasonal Event Tracking

```
SEASONAL EVENT METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  SEASON TRACKING                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Active Players: Those with any season activity                 │
│  Average Tier Reached: Progression depth                        │
│  Completion Rate: % reaching final tier                        │
│  Premium Adoption: % upgrading to paid track                   │
│                                                                 │
│  SEASON TRANSITION:                                            │
│  Pre-Season: Sign-ups and anticipation                         │
│  Mid-Season: Engagement and progression                        │
│  End-Season: Final push and rewards                            │
│  Post-Season: Archive views and nostalgia                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Event Completion Analysis

```
COMPLETION METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  CHALLENGE COMPLETION                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Completion Rate: Finished / Started challenges                 │
│  Average Completions per Player                                 │
│  Time to Complete: Days from start to finish                   │
│  Difficulty Analysis: Completion by challenge tier             │
│                                                                 │
│  REWARD REDEMPTION:                                            │
│  Tokens Earned: Total across all players                        │
│  Tokens Spent: Total redeemed in shop                          │
│  Unspent Rate: Tokens not spent (risk of waste perception)     │
│  Popular Items: Most redeemed rewards                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Marketplace Metrics

### 8.1 Trade Volume Analytics

```
MARKETPLACE ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  TRADE VOLUME                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  Total Trades: Daily/Weekly/Monthly transaction counts           │
│  Trade Value: Total Chrono Coins exchanged                       │
│  Average Trade Size: Coins per transaction                       │
│  Trade Velocity: Trades per listed item                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  CATEGORY BREAKDOWN                                            │
│  ─────────────────────────────────────────────────────────────  │
│  By Category: Artifact Market, Cosmetic Market, Event items       │
│  By Rarity: Common through Mythic distribution                  │
│  By Era: Trade volume by historical era                          │
│  Seasonal Items: Limited event item trades                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Active Listings Analytics

```
LISTING ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  LISTING METRICS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Active Listings: Currently available items                       │
│  New Listings: Items listed in last 24h/7d/30d                 │
│  Expired Listings: Items reaching end date                       │
│  Sold Listings: Items successfully traded                        │
│  Cancelled Listings: Listings removed before sale                │
│                                                                 │
│  LISTING BEHAVIOR:                                             │
│  Average Listing Duration: Time to sell                         │
│  Relisting Rate: Items relisted after expiry                    │
│  Price Adjustment Frequency: Sellers adjusting prices            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Item Popularity Analytics

```
ITEM POPULARITY:
┌─────────────────────────────────────────────────────────────────┐
│  POPULAR ITEMS                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Most Traded: Items with highest trade frequency               │
│  Highest Value: Items with highest average sale price           │
│  Fastest Selling: Items with shortest time-to-sell              │
│  Search Volume: Search terms and item queries                  │
│                                                                 │
│  RARITY DISTRIBUTION:                                          │
│  Trades by Rarity: Volume and value by rarity tier             │
│  Rare Item Activity: Mythic and Legendary trade patterns        │
│  Common Item Volume: Bulk trading of common items              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Transaction Analytics

```
TRANSACTION ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  TRANSACTION COUNTS                                              │
│  ─────────────────────────────────────────────────────────────  │
│  Daily Transactions: Completed trades per day                   │
│  Transaction Rate: Trades as % of active players               │
│  Peak Trading Hours: When trades most frequently occur         │
│  Weekend vs Weekday: Trading pattern differences               │
│                                                                 │
│  TRANSACTION VALUE:                                            │
│  Average Transaction Size: Coins per trade                      │
│  Total Marketplace Volume: All-time coins traded               │
│  Fee Revenue: Marketplace fees collected                        │
│  Buyer vs Seller: Ratio of marketplace participants            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Notification Metrics

### 9.1 Delivery Metrics

```
NOTIFICATION DELIVERY:
┌─────────────────────────────────────────────────────────────────┐
│  DELIVERY STATISTICS                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Sent: Total notifications dispatched                           │
│  Delivered: Successfully delivered to Telegram                 │
│  Failed: Delivery failures                                      │
│  Bounced: Invalid recipient / blocked user                     │
│                                                                 │
│  DELIVERY RATE: Delivered / Sent (target >98%)                 │
│  Failure Analysis: By failure reason                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Engagement Metrics

```
NOTIFICATION ENGAGEMENT:
┌─────────────────────────────────────────────────────────────────┐
│  OPEN RATES                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Open Rate: Opens / Delivered (target 35-50%)                   │
│  Click Rate: Button clicks / Opens (target 15-25%)              │
│  Deep Link Success: Successful Mini App opens                   │
│                                                                 │
│  BY CATEGORY:                                                   │
│  • Daily Reminder: Target 30-40%                              │
│  • Event Notification: Target 45-55%                          │
│  • Reward Available: Target 50-60%                            │
│  • Re-engagement: Target 20-30%                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  REACTIVATION SUCCESS                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Reactivation Rate: Returns within 24h / Sent                 │
│  Sustained Return: Returns and plays 3+ days                  │
│  Cost Benefit: Revenue from reactivated / notification cost    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Opt-Out Metrics

```
NOTIFICATION PREFERENCES:
┌─────────────────────────────────────────────────────────────────┐
│  OPT-OUT TRACKING                                               │
│  ─────────────────────────────────────────────────────────────  │
│  Opt-Out Rate: Users disabling notifications (target <10%)     │
│  Category Opt-Outs: By notification type                        │
│  Quiet Hours Usage: % enabling quiet hours                      │
│                                                                 │
│  SATISFACTION:                                                 │
│  Complaints: User-reported issues via /support                 │
│  Negative Feedback: Users marking as spam                       │
│  Target: <1% complaint rate                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Player Segments

### 10.1 Segment Definitions

```
PLAYER SEGMENTS:
┌─────────────────────────────────────────────────────────────────┐
│  NEW PLAYERS (Day 0-7)                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: First 7 days after registration                  │
│  Key Metrics: Tutorial completion, D1/D7 retention, early ARPPU │
│  Focus: Onboarding, early engagement hooks                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ACTIVE PLAYERS (Daily Active)                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: Any activity in last 24 hours                      │
│  Key Metrics: Session length, retention, engagement depth       │
│  Focus: Content freshness, reason to return                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  COLLECTORS                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: >70% collection completion, high expedition activity│
│  Key Metrics: Artifact acquisition rate, museum visits          │
│  Focus: Rare finds, completion rewards, museum depth            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  PVP PLAYERS                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: >50% of sessions include battles, high battle count│
│  Key Metrics: Win rate, rating progression, arena activity       │
│  Focus: Competitive balance, rank rewards, skill expression     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  SOCIAL PLAYERS                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: High friend count, guild activity, gift sending   │
│  Key Metrics: Friend interactions, guild contribution           │
│  Focus: Social features, guild depth, friend activities         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  RETURNING PLAYERS                                              │
│  ─────────────────────────────────────────────────────────────  │
│  Definition: Previously churned (7+ days), now active          │
│  Key Metrics: Reactivation rate, comeback retention            │
│  Focus: Welcome back experience, catch-up mechanics            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Segment Analysis

```
SEGMENT METRICS:
┌─────────────────────────────────────────────────────────────────┐
│  SEGMENT DISTRIBUTION                                           │
│  ─────────────────────────────────────────────────────────────  │
│  Size: Number of players in segment                            │
│  DAU Contribution: % of total DAU from segment                 │
│  Revenue Contribution: % of total revenue from segment         │
│  Growth/Decline: Segment size change over time                  │
│                                                                 │
│  SEGMENT BEHAVIOR:                                             │
│  Typical session length                                        │
│  Preferred activities                                          │
│  Spending patterns                                             │
│  Retention rates                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Dashboard Philosophy

### 11.1 Executive Dashboard

```
EXECUTIVE OVERVIEW:
┌─────────────────────────────────────────────────────────────────┐
│  GROWTH DASHBOARD                                                │
│  ─────────────────────────────────────────────────────────────  │
│  DAU/WAU/MAU with trends                                       │
│  New user acquisition funnel                                    │
│  Revenue overview (all streams)                                 │
│  Key milestones and targets                                     │
│                                                                 │
│  RETENTION DASHBOARD                                            │
│  ─────────────────────────────────────────────────────────────  │
│  D1/D7/D30 retention curves                                    │
│  Cohort comparison (current vs previous periods)                │
│  Churn rate trends                                             │
│  Reactivation rates                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Game Health Dashboard

```
GAME HEALTH MONITORING:
┌─────────────────────────────────────────────────────────────────┐
│  ECONOMY HEALTH                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  Currency generation vs sinks                                  │
│  Per-player balance distribution                                │
│  Inflation indicators                                           │
│  Economy alerts and anomalies                                   │
│                                                                 │
│  CONTENT ENGAGEMENT                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Activity distribution across features                          │
│  Feature usage heatmaps                                         │
│  Content completion rates                                       │
│  Popular vs unpopular content                                   │
│                                                                 │
│  BALANCE METRICS                                                │
│  ─────────────────────────────────────────────────────────────  │
│  Win rate distribution (target 45-55%)                         │
│  Expedition success rates                                       │
│  Drop rate distributions                                        │
│  Progression pacing                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 Technical Stability Dashboard

```
TECHNICAL MONITORING:
┌─────────────────────────────────────────────────────────────────┐
│  PERFORMANCE METRICS                                             │
│  ─────────────────────────────────────────────────────────────  │
│  API Response Times: P50, P95, P99                             │
│  Error Rates: By endpoint and type                              │
│  Server Load: CPU, Memory, Database                             │
│  Uptime: Availability percentage (target >99.9%)               │
│                                                                 │
│  USER IMPACT METRICS                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Failed Actions: By type and frequency                          │
│  Support Tickets: Volume and categories                         │
│  User-Reported Issues: Crash reports, bugs                     │
│                                                                 │
│  ALERT SYSTEM                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  P1 Alerts: Immediate notification + on-call                   │
│  P2 Alerts: Within 4 hours                                     │
│  P3 Alerts: Daily review                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.4 Business Intelligence Dashboard

```
MONETIZATION DASHBOARD:
┌─────────────────────────────────────────────────────────────────┐
│  REVENUE ANALYTICS                                              │
│  ─────────────────────────────────────────────────────────────  │
│  Revenue by stream (AdsGram, Stars, TON, Pass, Subs)           │
│  Revenue per user metrics (ARPU, ARPPU, LTV)                   │
│  Payer conversion and retention                                  │
│  Cohort revenue analysis                                         │
│                                                                 │
│  ADSGRAM PERFORMANCE                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Daily revenue and impressions                                  │
│  Fill rates and viewability                                     │
│  Revenue per thousand (RPM)                                     │
│  Player ad engagement segments                                   │
│                                                                 │
│  PURCHASE ANALYTICS                                             │
│  ─────────────────────────────────────────────────────────────  │
│  Purchase funnel conversion                                     │
│  Product performance (packs, pass, subs)                        │
│  Pricing optimization opportunities                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Privacy Philosophy

### 12.1 Data Collection Principles

```
PRIVACY-FIRST ANALYTICS:
┌─────────────────────────────────────────────────────────────────┐
│  MINIMAL COLLECTION                                             │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ Collect only data needed for meaningful insights            │
│  ✓ Aggregate data where individual data not needed            │
│  ✓ Anonymize where possible                                     │
│  ✓ Delete data when no longer needed                           │
│                                                                 │
│  NEVER COLLECT:                                                 │
│  ✗ Personal information beyond Telegram ID                     │
│  ✗ Message content (only metadata)                             │
│  ✗ Location data                                               │
│  ✗ Contact lists                                               │
│  ✗ Device identifiers for tracking                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Data Handling

```
DATA MANAGEMENT:
┌─────────────────────────────────────────────────────────────────┐
│  DATA RETENTION                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Session Data: 90 days                                         │
│  Aggregated Metrics: Indefinite                                │
│  User-Level Analytics: 90 days, then aggregated               │
│  Financial Records: 7 years (legal requirement)              │
│  Violation Records: Duration of ban + 1 year                   │
│                                                                 │
│  ACCESS CONTROLS:                                              │
│  Role-based access to analytics platforms                       │
│  No individual user data to third parties                       │
│  Audit log of data access                                       │
│                                                                 │
│  COMPLIANCE:                                                   │
│  GDPR-compliant data handling                                   │
│  User data export available on request                          │
│  Account deletion removes personal data                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Future Analytics Features

### 13.1 A/B Testing Framework

```
FUTURE: A/B TESTING PLATFORM

Description:
System for running controlled experiments to test game changes
before full rollout.

Potential Features:
• Feature flag system
• Random assignment engine
• Statistical significance calculator
• Multi-variant testing support
• Result visualization dashboard

Use Cases:
• Test new mission designs before full release
• Compare onboarding flows
• Test pricing strategies
• Optimize notification timing
• Evaluate UI/UX changes

Requirements:
• Infrastructure for feature flags
• Statistical tooling
• Traffic allocation system
• Result analysis pipeline

Timeline: Phase 2+
Status: Design consideration only
```

### 13.2 Predictive Analytics

```
FUTURE: PREDICTIVE ANALYTICS

Description:
Machine learning models to predict player behavior and outcomes.

Potential Features:
• Player lifetime value prediction
• Churn risk scoring
• Content preference prediction
• Optimal intervention timing
• Resource need forecasting

Applications:
• Identify at-risk players for retention campaigns
• Predict which players will convert to paying
• Recommend personalized content
• Forecast economy demand
• Anticipate capacity needs

Requirements:
• Historical data accumulation
• ML platform infrastructure
• Feature engineering
• Model training and deployment pipeline
• Interpretability for game designers

Timeline: Phase 3+
Status: Research/planning only
```

### 13.3 Churn Prediction

```
FUTURE: CHURN PREDICTION SYSTEM

Description:
Identify players likely to churn before they become inactive,
enabling proactive retention interventions.

Potential Features:
• Risk score per player (updated daily)
• Risk factor breakdown (why likely to churn)
• Intervention recommendations
• Intervention effectiveness tracking

Risk Indicators:
• Declining session frequency
• Decreasing session length
• Skipped daily rewards
• No progression milestones
•好友 inactivity correlation

Intervention Options:
• Targeted notifications
• Catch-up rewards
• Personalized re-engagement content
• Human outreach for high-value players

Timeline: Phase 2+
Status: Requires baseline data first
```

### 13.4 Recommendation System

```
FUTURE: PERSONALIZED RECOMMENDATIONS

Description:
AI-driven recommendations for content, activities, and purchases
based on player behavior and preferences.

Potential Features:
• "Next Best Action" suggestions
• Artifact recommendation for collection completion
• Expedition timing optimization
• Friend activity insights
• Event participation recommendations

Recommendation Types:
• Content recommendations (what to play next)
• Social recommendations (who to connect with)
• Economic recommendations (when to spend/save)
• Progression recommendations (what to upgrade)

Requirements:
• Player behavior data
• Content catalog
• ML recommendation engine
• A/B testing for recommendation quality
• Feedback loop for improvement

Timeline: Phase 3+
Status: Design consideration only
```

---

## 14. Analytics Architecture

### 14.1 Data Flow

```
ANALYTICS PIPELINE:
┌─────────────────────────────────────────────────────────────────┐
│  DATA SOURCES                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  • Game Events: Player actions, game state changes             │
│  • Business Events: Purchases, subscriptions, referrals        │
│  • Ad Events: Impressions, completions, rewards                 │
│  • Technical Events: API calls, errors, performance            │
│  • User Events: Logins, sessions, notifications                 │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  EVENT COLLECTION                                               │
│  ─────────────────────────────────────────────────────────────  │
│  • Server-side event capture                                    │
│  • Batch or real-time streaming                                │
│  • Event schema validation                                      │
│  • Anonymous user identification (Telegram ID)                  │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  DATA PROCESSING                                               │
│  ─────────────────────────────────────────────────────────────  │
│  • Real-time: Stream processing for immediate metrics          │
│  • Batch: Daily aggregation and analysis                       │
│  • Long-term: Archival and trend analysis                      │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  ANALYTICS STORAGE                                             │
│  ─────────────────────────────────────────────────────────────  │
│  • Supabase: User data, game state                             │
│  • Time-series DB: Metrics, events                             │
│  • Data Warehouse: Aggregated analytics                        │
│                                                                 │
│  ↓                                                              │
│                                                                 │
│  VISUALIZATION & TOOLS                                          │
│  ─────────────────────────────────────────────────────────────  │
│  • Dashboards: Grafana, Supabase Studio, custom               │
│  • Ad-hoc Analysis: SQL access (restricted)                   │
│  • Alerts: Automated monitoring and notifications              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 Key Events Schema

```
CORE EVENT TYPES:
┌─────────────────────────────────────────────────────────────────┐
│  GAMEPLAY EVENTS                                               │
│  ─────────────────────────────────────────────────────────────  │
│  • session_start / session_end                                │
│  • battle_start / battle_end / battle_result                  │
│  • expedition_start / expedition_complete                      │
│  • artifact_collected / artifact_upgraded                      │
│  • mission_started / mission_completed                          │
│  • daily_reward_claimed                                        │
│                                                                 │
│  ECONOMY EVENTS                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  • currency_gained (amount, source, type)                      │
│  • currency_spent (amount, destination, type)                   │
│  • item_purchased / item_used                                  │
│  • reward_claimed (type, source)                                │
│                                                                 │
│  BUSINESS EVENTS                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • purchase_initiated / purchase_completed (type, amount)     │
│  • subscription_started / subscription_cancelled              │
│  • referral_completed                                           │
│                                                                 │
│  AD EVENTS                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  • ad_requested / ad_started / ad_completed / ad_skipped       │
│  • reward_earned / reward_claimed                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15. Quality Standards

### 15.1 Data Quality

```
QUALITY CHECKS:
┌─────────────────────────────────────────────────────────────────┐
│  ACCURACY                                                        │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ Validate event schemas at ingestion                         │
│  ✓ Cross-reference with known truths                           │
│  ✓ Monitor for data drift                                       │
│  ✓ Reconciliation with financial records                        │
│                                                                 │
│  COMPLETENESS                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ Monitor event coverage                                       │
│  ✓ Fill rate tracking                                          │
│  ✓ Missing data alerting                                        │
│                                                                 │
│  TIMELINESS                                                     │
│  ─────────────────────────────────────────────────────────────  │
│  ✓ Real-time metrics: <5 min latency                           │
│  ✓ Daily metrics: Available by 01:00 UTC                       │
│  ✓ Alert latency: <1 min for critical metrics                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 Metric Definitions

```
METRIC GOVERNANCE:
┌─────────────────────────────────────────────────────────────────┐
│  DEFINITION STANDARDS                                           │
│  ─────────────────────────────────────────────────────────────  │
│  • Every metric has documented definition                     │
│  • Calculation methodology clearly stated                       │
│  • Update frequency specified                                   │
│  • Owner/team responsible for accuracy                         │
│                                                                 │
│  VERSION CONTROL                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • Metric definitions versioned                                 │
│  • Changes communicated before taking effect                     │
│  • Historical data recalculated when definition changes        │
│                                                                 │
│  DOCUMENTATION                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  • Metric name and description                                  │
│  • Formula or calculation method                                │
│  • Data source and freshness                                   │
│  • Known limitations or caveats                                │
│  • Related metrics                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Project Philosophy

### 16.1 Data-Driven Decision Making

```
DECISION-MAKING FRAMEWORK:
┌─────────────────────────────────────────────────────────────────┐
│  ANALYTICS-FIRST APPROACH                                        │
│  ─────────────────────────────────────────────────────────────  │
│  Jolt Time makes decisions based on:                            │
│  • Player Feedback — Direct player input and suggestions        │
│  • Analytics — Behavioral data and metrics trends               │
│  • Healthy Growth — Sustainable long-term project health        │
│                                                                 │
│  DECISION PRIORITY:                                            │
│  1. Player Experience — Never compromise player trust           │
│  2. Data Evidence — Decisions backed by analytics               │
│  3. Sustainability — Long-term health over short-term gains     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 16.2 Balanced Perspective

```
BALANCED DECISIONS:
┌─────────────────────────────────────────────────────────────────┐
│  AVOIDING EXTREMES                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • Not analytics-over-everything — Player voice matters         │
│  • Not just player complaints — Look at actual behavior        │
│  • Not short-term revenue — Build for long-term trust          │
│  • Not data harvesting — Minimal collection, maximum insight    │
│                                                                 │
│  HEALTHY GROWTH INDICATORS:                                     │
│  • Improving retention reflects healthy product                │
│  • Rising engagement shows genuine value                        │
│  • Sustainable revenue supports project longevity               │
│  • Player trust is the ultimate metric                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*Analytics should illuminate the path to better player experiences, not create surveillance. Trust through transparency, insight through respect.*
