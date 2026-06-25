# Jolt Time — Data Warehouse Strategy

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Project:** Jolt Time  
**Platform:** Telegram Mini App + Telegram Bot  
**Backend:** Supabase PostgreSQL + External Data Warehouse  

---

## Table of Contents

1. [Warehouse Categories](#1-warehouse-categories)
2. [Data Warehouse Philosophy](#2-data-warehouse-philosophy)
3. [Warehouse Architecture](#3-warehouse-architecture)
4. [Data Sources Strategy](#4-data-sources-strategy)
5. [Player Analytics Architecture](#5-player-analytics-architecture)
6. [Economy Analytics Architecture](#6-economy-analytics-architecture)
7. [Museum Analytics Architecture](#7-museum-analytics-architecture)
8. [Event Analytics Architecture](#8-event-analytics-architecture)
9. [PvP and Guild Analytics Architecture](#9-pvp-and-guild-analytics-architecture)
10. [Monetization Analytics Architecture](#10-monetization-analytics-architecture)
11. [Retention Analytics Architecture](#11-retention-analytics-architecture)
12. [ETL Philosophy](#12-etl-philosophy)
13. [Reporting Standards](#13-reporting-standards)
14. [Data Quality Standards](#14-data-quality-standards)
15. [Security Standards](#15-security-standards)
16. [Future Expansion Notes](#16-future-expansion-notes)
17. [Long-Term Philosophy](#17-long-term-philosophy)

---

## 1. Warehouse Categories

The Data Warehouse organizes analytics into eight distinct categories, each serving different analytical needs.

### 1.1 Player Analytics

Player analytics tracks user acquisition, behavior, and lifecycle metrics.

**Components:**
- Acquisition metrics and source attribution
- Progression velocity and milestone tracking
- Engagement patterns and session analysis
- Churn prediction and retention drivers
- Lifetime value calculations

### 1.2 Economy Analytics

Economy analytics monitors the game economy's health and balance.

**Components:**
- Currency generation rates and sources
- Currency spending patterns and sinks
- Reward distribution efficiency
- Economic balance monitoring
- Inflation and deflation indicators

### 1.3 Museum Analytics

Museum analytics measures artifact collection and museum engagement.

**Components:**
- Artifact collection rates and rarity distribution
- Museum progression velocity
- Exhibition popularity and engagement
- Collection completion metrics
- Museum-related revenue impact

### 1.4 Event Analytics

Event analytics evaluates time-limited content performance.

**Components:**
- Participation rates and trends
- Mission completion analysis
- Seasonal engagement metrics
- Event effectiveness scoring
- Event ROI calculations

### 1.5 PvP Analytics

PvP analytics tracks competitive gameplay health.

**Components:**
- Battle participation rates
- Ranking distribution analysis
- Match quality metrics
- Competitive retention
- Skill progression tracking

### 1.6 Guild Analytics

Guild analytics measures social engagement and guild health.

**Components:**
- Guild formation and growth rates
- Member engagement metrics
- Guild activity patterns
- Guild retention analysis
- Social network metrics

### 1.7 Monetization Analytics

Monetization analytics evaluates revenue performance with AdsGram as the primary revenue system.

**Components:**
- AdsGram performance metrics
- Reward engagement analysis
- Monetization funnel conversion
- Revenue reporting and attribution
- Conversion analysis by segment

### 1.8 Retention Analytics

Retention analytics measures player stickiness and lifetime value.

**Components:**
- Day 1 (D1) retention
- Day 7 (D7) retention
- Day 30 (D30) retention
- Cohort analysis
- Lifetime value (LTV) analysis

---

## 2. Data Warehouse Philosophy

The Data Warehouse serves as the central intelligence center for Jolt Time, supporting business intelligence, LiveOps analysis, growth analysis, and strategic decision making.

### 2.1 Support Historical Analysis

The warehouse enables long-term trend analysis and pattern identification.

**Historical Analysis:**
- Track metrics over weeks, months, and years
- Compare performance across seasons and events
- Identify cyclical patterns and trends
- Support longitudinal research projects
- Preserve data beyond operational database limits

### 2.2 Avoid Impacting Operational Databases

Analytical workloads run separately from operational systems.

**Isolation Principles:**
- ETL processes extract data without impacting production
- Analytical queries run on warehouse, not operational DB
- Separate compute resources for analytics
- Scheduled jobs run during low-traffic windows
- Resource allocation prioritizes operational stability

### 2.3 Provide Business Insights

The warehouse transforms raw data into actionable intelligence.

**Insight Generation:**
- Pre-aggregated metrics for fast reporting
- Drill-down capability for detailed analysis
- Trend indicators and anomaly alerts
- Segment-based performance comparison
- ROI and effectiveness metrics

### 2.4 Support Long-Term Decision Making

The warehouse enables strategic planning through comprehensive data.

**Decision Support:**
- Season and event performance trends
- Player behavior evolution tracking
- Economy health indicators
- Monetization effectiveness analysis
- Growth and retention trajectory

---

## 3. Warehouse Architecture

The Data Warehouse architecture consists of five distinct layers, each with specific responsibilities.

### 3.1 Data Sources

Data sources feed the warehouse from multiple systems.

**Source Systems:**
```
Data Sources:
├── Operational Database (Supabase PostgreSQL)
│   ├── Player profiles and progression
│   ├── Economy transactions and balances
│   ├── Museum collections and artifacts
│   ├── Events and participation records
│   └── Social relationships and guilds
│
├── Audit Logs System
│   ├── Player activity logs
│   ├── Economy transaction logs
│   ├── Security event logs
│   └── Administrative action logs
│
├── Realtime Events Stream
│   ├── Session events
│   ├── Engagement events
│   └── Achievement events
│
├── Monetization Systems
│   ├── AdsGram ad views and completions
│   ├── Reward grants and verifications
│   └── Revenue events
│
└── Analytics Events
    ├── Feature usage events
    ├── Content engagement events
    └── Custom tracking events
```

### 3.2 Data Collection Layer

The data collection layer aggregates data from all sources.

**Collection Responsibilities:**
- Connect to source systems
- Extract data at scheduled intervals
- Handle incremental and full extracts
- Validate data completeness
- Route to transformation layer

**Collection Patterns:**
```
Collection Patterns:
├── Scheduled Extraction
│   ├── Daily full extracts (off-peak hours)
│   ├── Hourly incremental extracts
│   ├── Real-time event streaming
│   └── On-demand extracts for urgent needs
│
├── Change Data Capture (CDC)
│   ├── Database trigger-based CDC
│   ├── Log-based CDC (WAL)
│   ├── Timestamp-based incremental
│   └── Unique identifier-based incremental
│
└── Event Streaming
    ├── Realtime event collection
    ├── Batch event aggregation
    └── Event deduplication
```

### 3.3 Transformation Layer

The transformation layer processes raw data into analytical formats.

**Transformation Responsibilities:**
- Clean and standardize data
- Apply business rules and calculations
- Create derived metrics
- Aggregate for reporting
- Validate data quality

**Transformation Pipeline:**
```
Transformation Pipeline:
Stage 1: Data Cleaning
├── Remove duplicates
├── Handle missing values
├── Standardize formats
└── Validate data types

Stage 2: Business Logic
├── Apply game-specific calculations
├── Create derived fields
├── Encode categorical variables
└── Calculate aggregations

Stage 3: Quality Checks
├── Validate referential integrity
├── Check value ranges
├── Detect anomalies
└── Flag data issues

Stage 4: Enrichment
├── Join with reference data
├── Add temporal context
├── Calculate ratios and percentages
└── Create composite metrics
```

### 3.4 Storage Layer

The storage layer organizes data for efficient analytical access.

**Storage Components:**
```
Storage Architecture:
├── Raw Data Zone
│   ├── Staging tables (source replicas)
│   ├── Raw event tables
│   └── Log tables
│
├── Transformed Data Zone
│   ├── Dimension tables (players, items, events)
│   ├── Fact tables (transactions, sessions, events)
│   └── Aggregated tables (daily, weekly, monthly)
│
├── Analysis Zone
│   ├── Pre-built dashboards
│   ├── Common analytics queries
│   └── Shared analytical datasets
│
└── Archive Zone
    ├── Historical fact tables
    ├── Archived aggregations
    └── Long-term trend data
```

### 3.5 Reporting Layer

The reporting layer provides access to warehouse data.

**Reporting Interfaces:**
```
Reporting Interfaces:
├── Dashboard Tools
│   ├── Operational dashboards (real-time)
│   ├── Executive dashboards (daily)
│   ├── LiveOps dashboards (hourly)
│   └── Growth dashboards (weekly)
│
├── Query Tools
│   ├── SQL query interface
│   ├── Saved queries and views
│   ├── Parameterized reports
│   └── Ad-hoc analysis tools
│
├── API Access
│   ├── Internal API for applications
│   ├── Export API for partners
│   └── Reporting API for integrations
│
└── Alerting
    ├── Anomaly detection alerts
    ├── Threshold-based alerts
    └── Scheduled report delivery
```

---

## 4. Data Sources Strategy

The data sources strategy ensures comprehensive data collection without impacting operational systems.

### 4.1 Operational Database

The operational database is the primary source for core game data.

**Extracted Data:**
```
Operational Database Extraction:
├── Profiles and Identity
│   ├── Player profiles
│   ├── Player settings
│   ├── Authentication records
│   └── Telegram user mappings
│
├── Game State
│   ├── Player progression
│   ├── Currency balances
│   ├── Inventory items
│   ├── Museum collections
│   └── Quest states
│
├── Events and Activities
│   ├── Mission completions
│   ├── Battle history
│   ├── Event participation
│   └── Guild activities
│
└── Social Graph
    ├── Friendships
    ├── Guild memberships
    └── Leaderboard entries
```

### 4.2 Audit Logs

Audit logs provide complete activity history for analysis.

**Extracted Data:**
```
Audit Log Extraction:
├── Activity Records
│   ├── Player actions
│   ├── Economy transactions
│   ├── Progression changes
│   └── Achievement unlocks
│
├── Security Events
│   ├── Authentication events
│   ├── Permission violations
│   ├── Suspicious activity
│   └── Fraud indicators
│
└── Administrative Records
    ├── Moderation actions
    ├── Manual adjustments
    └── Configuration changes
```

### 4.3 Realtime Events

Realtime events provide streaming data for immediate analysis.

**Extracted Data:**
```
Realtime Event Extraction:
├── Session Events
│   ├── Session start/end
│   ├── Session duration
│   ├── Screen views
│   └── Feature access
│
├── Engagement Events
│   ├── Button clicks
│   ├── Feature usage
│   ├── Content views
│   └── Time on screen
│
└── Game Events
    ├── Level ups
    ├── Artifact acquisitions
    ├── Mission starts/completions
    └── Achievement unlocks
```

### 4.4 Monetization Systems

Monetization systems provide revenue and engagement data.

**Extracted Data:**
```
Monetization Data Extraction:
├── AdsGram Data
│   ├── Ad view records
│   ├── Ad completion records
│   ├── Reward verification records
│   └── Reward grant records
│
├── Revenue Events
│   ├── Impression events
│   ├── Click events
│   ├── Conversion events
│   └── Revenue attribution
│
└── User Monetization
    ├── Reward eligibility
    ├── Reward claim patterns
    ├── Premium conversions
    └── Purchase history
```

### 4.5 Analytics Events

Analytics events capture custom tracking data.

**Extracted Data:**
```
Analytics Event Extraction:
├── Custom Events
│   ├── Feature discovery
│   ├── Tutorial progression
│   ├── Onboarding steps
│   └── Custom funnels
│
├── Content Analytics
│   ├── Artifact views
│   ├── Exhibition visits
│   ├── Lore阅读
│   └── Content engagement
│
└── Experiment Data
    ├── A/B test assignments
    ├── Feature flag states
    └── Experiment outcomes
```

---

## 5. Player Analytics Architecture

Player analytics provides comprehensive understanding of user acquisition, behavior, and lifecycle.

### 5.1 Acquisition Analysis

Acquisition analysis tracks how players find and join Jolt Time.

**Metrics:**
```
Acquisition Metrics:
├── Source Attribution
│   ├── Bot start source
│   ├── Mini App launch source
│   ├── Referral source
│   └── Organic vs. paid
│
├── Acquisition Funnel
│   ├── Bot interaction → Mini App open
│   ├── Mini App open → Account created
│   ├── Account created → Tutorial started
│   └── Tutorial started → Tutorial completed
│
├── Acquisition Costs
│   ├── Cost per install (CPI)
│   ├── Cost per activated user
│   └── Cost per retained user
│
└── Source Performance
    ├── Volume by source
    ├── Quality by source (retention)
    ├── Revenue by source
    └── ROI by source
```

### 5.2 Progression Analysis

Progression analysis tracks player advancement through the game.

**Metrics:**
```
Progression Metrics:
├── Level Progression
│   ├── Level distribution
│   ├── Time to level
│   ├── Level velocity
│   └── Level progression funnel
│
├── Era Progression
│   ├── Era unlock rates
│   ├── Era completion rates
│   ├── Time in each era
│   └── Era progression bottlenecks
│
├── Content Completion
│   ├── Quest completion rates
│   ├── Side content engagement
│   ├── Optional content completion
│   └── Main story progression
│
└── Progression Velocity
    ├── XP per day
    ├── Levels per week
    ├── Content consumption rate
    └── Progression acceleration
```

### 5.3 Engagement Analysis

Engagement analysis measures player activity and involvement.

**Metrics:**
```
Engagement Metrics:
├── Session Metrics
│   ├── Sessions per user per day
│   ├── Session duration
│   ├── Sessions per week
│   └── Return frequency
│
├── Feature Engagement
│   ├── Feature adoption rate
│   ├── Feature usage frequency
│   ├── Feature retention
│   └── Feature discovery
│
├── Content Engagement
│   ├── Time in game modes
│   ├── Content consumption
│   ├── Replayability
│   └── Content preferences
│
└── Engagement Segments
    ├── Casual (< 5 min/day)
    ├── Regular (5-15 min/day)
    ├── Dedicated (15-30 min/day)
    └── Power users (> 30 min/day)
```

### 5.4 Churn Analysis

Churn analysis identifies players at risk of leaving.

**Metrics:**
```
Churn Metrics:
├── Churn Definition
│   ├── Day 1 churn (registered, no activity)
│   ├── Day 7 churn (no activity in 7 days)
│   ├── Day 30 churn (no activity in 30 days)
│   └── Behavioral churn (engagement decline)
│
├── Churn Indicators
│   ├── Session frequency decline
│   ├── Feature usage drop
│   ├── Spending reduction
│   └── Social connection loss
│
├── Churn Prediction
│   ├── Risk score model
│   ├── At-risk segments
│   ├── Churn probability
│   └── Recommended interventions
│
└── Churn Recovery
    ├── Win-back rates
    ├── Recovery interventions
    ├── Recovery cost vs. value
    └── Re-engagement success
```

---

## 6. Economy Analytics Architecture

Economy analytics monitors the game economy's health, balance, and sustainability.

### 6.1 Currency Generation

Currency generation tracks all sources of new currency entering the economy.

**Metrics:**
```
Currency Generation Metrics:
├── Generation Sources
│   ├── Daily rewards
│   ├── Quest rewards
│   ├── Event rewards
│   ├── PvP rewards
│   ├── AdsGram rewards
│   └── Admin grants
│
├── Generation Rates
│   ├── Total currency generated/day
│   ├── Per-user generation rate
│   ├── Generation by source
│   └── Generation velocity
│
├── Generation Balance
│   ├── F2P generation vs. P2P generation
│   ├── Free vs. premium currency
│   └── Generous vs. scarce currencies
│
└── Generation Trends
    ├── Week-over-week generation
    ├── Season-over-season generation
    ├── Event impact on generation
    └── Inflation indicators
```

### 6.2 Currency Spending

Currency spending tracks how players use their resources.

**Metrics:**
```
Currency Spending Metrics:
├── Spending Categories
│   ├── Energy refills
│   ├── Item purchases
│   ├── Gacha/loot boxes
│   ├── Upgrades and evolution
│   ├── Marketplace transactions
│   └── Guild donations
│
├── Spending Patterns
│   ├── Average spend per user
│   ├── Spend frequency
│   ├── Popular spending categories
│   └── Spend timing
│
├── Spending Balance
│   ├── Spending vs. generation ratio
│   ├── Sink efficiency
│   ├── Economic circulation
│   └── Exchange rates
│
└── Spending Trends
    ├── Week-over-week spending
    ├── Season-over-season spending
    ├── Event impact on spending
    └── Deflation indicators
```

### 6.3 Reward Distribution

Reward distribution analyzes how rewards are allocated across the player base.

**Metrics:**
```
Reward Distribution Metrics:
├── Reward Allocation
│   ├── Total rewards distributed
│   ├── Per-user reward average
│   ├── Reward distribution curve
│   └── Top reward recipients
│
├── Reward Sources
│   ├── Quest rewards
│   ├── Achievement rewards
│   ├── Daily rewards
│   ├── Event rewards
│   └── Compensation rewards
│
├── Reward Efficiency
│   ├── Engagement lift from rewards
│   ├── Retention impact of rewards
│   ├── Reward ROI by type
│   └── Optimal reward sizing
│
└── Reward Timing
    ├── Daily reward patterns
    ├── Weekly reward cycles
    ├── Event reward timing
    └── Optimal reward scheduling
```

### 6.4 Economic Balance Monitoring

Economic balance monitoring ensures sustainable economy health.

**Metrics:**
```
Economic Balance Metrics:
├── Balance Indicators
│   ├── Currency velocity
│   ├── Currency circulation
│   ├── Sink/source ratio
│   └── Economic growth rate
│
├── Distribution Health
│   ├── Wealth distribution curve
│   ├── Gini coefficient
│   ├── Top 1% holdings
│   └── Bottom 50% holdings
│
├── Sustainability
│   ├── Long-term currency stability
│   ├── Inflation risk indicators
│   ├── Deflation risk indicators
│   └── Economic equilibrium
│
└── Alert Thresholds
    ├── High inflation warning
    ├── Low circulation warning
    ├── Wealth concentration warning
    └── Sink imbalance warning
```

---

## 7. Museum Analytics Architecture

Museum analytics measures artifact collection engagement and museum progression.

### 7.1 Artifact Collection Rates

Artifact collection rates track how players acquire artifacts.

**Metrics:**
```
Artifact Collection Metrics:
├── Collection Velocity
│   ├── Artifacts acquired per day
│   ├── Time to first artifact
│   ├── Collection velocity by era
│   └── Collection acceleration
│
├── Rarity Distribution
│   ├── Common/Rare/Epic/Legendary ratio
│   ├── Rarity acquisition rates
│   ├── Rarity progression
│   └── Rarest artifacts held
│
├── Acquisition Sources
│   ├── Quest rewards
│   ├── Gacha pulls
│   ├── Marketplace purchases
│   ├── Event rewards
│   └── Trading
│
└── Collection Gaps
    ├── Missing artifacts by era
    ├── Collection completion rate
    ├── Time to complete set
    └── Acquisition priorities
```

### 7.2 Museum Progression

Museum progression tracks player advancement in museum systems.

**Metrics:**
```
Museum Progression Metrics:
├── Progression Metrics
│   ├── Museum level distribution
│   ├── Level-up velocity
│   ├── Progression milestones
│   └── Progression bottlenecks
│
├── Expansion Tracking
│   ├── Display slot usage
│   ├── Expansion purchases
│   ├── Expansion timing
│   └── Expansion motivations
│
├── Exhibition Management
│   ├── Exhibitions created
│   ├── Exhibition changes
│   ├── Popular exhibition layouts
│   └── Exhibition engagement
│
└── Progression Motivation
    ├── Drivers of museum play
    ├── Time spent in museum
    ├── Return frequency
    └── Museum vs. other activities
```

### 7.3 Exhibition Popularity

Exhibition popularity analyzes player engagement with displays.

**Metrics:**
```
Exhibition Metrics:
├── Layout Popularity
│   ├── Most used layouts
│   ├── Layout trends
│   ├── Custom vs. preset layouts
│   └── Layout effectiveness
│
├── Artifact Display
│   ├── Most displayed artifacts
│   ├── Display duration
│   ├── Display changes
│   └── Curator satisfaction
│
├── Visitor Metrics
│   ├── Visitors to public museums
│   ├── Visitor engagement
│   ├── Appreciation scores
│   └── Visitor feedback
│
└── Exhibition Effectiveness
    ├── Engagement lift from exhibitions
    ├── Retention impact
    ├── Social sharing
    └── Community trends
```

### 7.4 Collection Completion Metrics

Collection completion metrics track progress toward full collections.

**Metrics:**
```
Collection Completion Metrics:
├── Completion Rates
│   ├── Collection completion percentage
│   ├── Time to collection completion
│   ├── Completion by era
│   └── Completion difficulty
│
├── Completion Rewards
│   ├── Reward value by collection
│   ├── Reward timing
│   ├── Bonus completion rewards
│   └── Completion satisfaction
│
├── Completion Strategies
│   ├── Focused completion
│   ├── Broad collection
│   ├── Purchase vs. earn
│   └── Trading activity
│
└── Completion Trends
    ├── Season-over-season completion
    ├── Event impact on completion
    ├── Community completion rates
    └── Rare completions
```

---

## 8. Event Analytics Architecture

Event analytics evaluates the performance of time-limited content.

### 8.1 Participation Rates

Participation rates track how many players engage with events.

**Metrics:**
```
Participation Metrics:
├── Enrollment
│   ├── Total participants
│   ├── Participation rate (of eligible)
│   ├── Enrollment timing
│   └── Opt-in vs. auto-enroll
│
├── Participation Segments
│   ├── New player participation
│   ├── Returning player participation
│   ├── Power user participation
│   └── Churned player re-engagement
│
├── Participation Trends
│   ├── Year-over-year participation
│   ├── Season-over-season participation
│   ├── Event type comparison
│   └── Theme effectiveness
│
└── Non-Participation
    ├── Eligible non-participants
    ├── Dropout reasons
    └── Engagement barriers
```

### 8.2 Mission Completion

Mission completion analysis evaluates content difficulty and engagement.

**Metrics:**
```
Mission Completion Metrics:
├── Completion Rates
│   ├── Overall completion rate
│   ├── Per-mission completion rate
│   ├── Difficulty curve
│   └── Completion time
│
├── Completion Patterns
│   ├── First-attempt success
│   ├── Retry behavior
│   ├── Completion order
│   └── Skipped missions
│
├── Difficulty Calibration
│   ├── Expected vs. actual completion
│   ├── Difficulty complaints
│   ├── Assist/item usage
│   └── Difficulty adjustments
│
└── Completion Impact
    ├── Engagement lift from missions
    ├── Retention impact
    ├── Reward satisfaction
    └── Content pacing
```

### 8.3 Seasonal Engagement

Seasonal engagement tracks player activity across seasons.

**Metrics:**
```
Seasonal Engagement Metrics:
├── Season Participation
│   ├── Active participants
│   ├── Completion rate
│   ├── Engagement depth
│   └── Season satisfaction
│
├── Battle Pass Metrics
│   ├── Battle pass sales
│   ├── Tier reached distribution
│   ├── Free vs. premium engagement
│   └── Battle pass ROI
│
├── Season Progression
│   ├── Tier progression velocity
│   ├── XP sources breakdown
│   ├── Premium tier unlock rate
│   └── Season completion rate
│
└── Season Comparison
    ├── Participation vs. previous
    ├── Engagement vs. previous
    ├── Revenue vs. previous
    └── Improvement areas
```

### 8.4 Event Effectiveness

Event effectiveness measures ROI and impact of events.

**Metrics:**
```
Event Effectiveness Metrics:
├── Participation ROI
│   ├── Revenue per participant
│   ├── Engagement per participant
│   ├── Retention per participant
│   └── Cost per engagement
│
├── Revenue Impact
│   ├── Direct revenue (battle pass)
│   ├── Indirect revenue (engagement)
│   ├── Revenue by event day
│   └── Revenue lift vs. baseline
│
├── Engagement Impact
│   ├── Session increase
│   ├── Feature usage increase
│   ├── Social activity increase
│   └── Overall engagement lift
│
└── Effectiveness Comparison
    ├── Event type comparison
    ├── Theme comparison
    ├── Duration comparison
    └── Reward comparison
```

---

## 9. PvP and Guild Analytics Architecture

PvP and guild analytics measure competitive and social engagement health.

### 9.1 Battle Participation

Battle participation tracks competitive gameplay engagement.

**Metrics:**
```
Battle Participation Metrics:
├── Participation Rates
│   ├── Battle initiation rate
│   ├── Daily battle count
│   ├── Battle frequency
│   └── Battle mode preferences
│
├── Match Quality
│   ├── Match duration
│   ├── Match completion rate
│   ├── Rematch rate
│   └── Disconnect rate
│
├── Matchmaking
│   ├── Queue time distribution
│   ├── Rating spread
│   ├── Match quality score
│   └── Match fairness
│
└── Participation Trends
    ├── Week-over-week battles
    ├── Season-over-season battles
    ├── Mode popularity trends
    └── Competitive engagement
```

### 9.2 Ranking Distribution

Ranking distribution analyzes competitive stratification.

**Metrics:**
```
Ranking Metrics:
├── Distribution Analysis
│   ├── Player rating distribution
│   ├── League distribution
│   ├── Division distribution
│   └── Skill tier pyramid
│
├── Ranking Dynamics
│   ├── Promotions per day
│   ├── Demotions per day
│   ├── Rating volatility
│   └── Rank mobility
│
├── Top Players
│   ├── Top 100 leaderboard
│   ├── Leaderboard changes
│   ├── All-time records
│   └── Seasonal champions
│
└── Ranking Health
    ├── Skill balance indicators
    ├── Match fairness scores
    ├── Ranking system satisfaction
    └── Competitive integrity
```

### 9.3 Guild Engagement

Guild engagement tracks social group health.

**Metrics:**
```
Guild Metrics:
├── Formation
│   ├── Guilds created per day
│   ├── Guild size distribution
│   ├── Formation timing
│   └── Guild creation motivation
│
├── Activity
│   ├── Active guilds
│   ├── Daily active members
│   ├── Member contribution
│   └── Guild events participation
│
├── Member Engagement
│   ├── Member retention rate
│   ├── Activity frequency
│   ├── Contribution patterns
│   └── Leadership turnover
│
└── Guild Health
    ├── Guild satisfaction
    ├── Guild longevity
    ├── Guild achievement rates
    └── Guild vs. solo play
```

### 9.4 Competitive Retention

Competitive retention measures how PvP affects player stickiness.

**Metrics:**
```
Competitive Retention Metrics:
├── Retention by Activity
│   ├── Retention: PvP active vs. inactive
│   ├── Retention: ranked vs. casual
│   ├── Retention by rank tier
│   └── Retention by battle frequency
│
├── Competitive Engagement
│   ├── Sessions per battle
│   ├── Time in PvP modes
│   ├── Return rate after battles
│   └── Cross-mode engagement
│
├── Competitive Loyalty
│   ├── Repeat battle rate
│   ├── Season continuation
│   ├── Skill progression motivation
│   └── Community formation
│
└── Retention Recommendations
    ├── Optimal battle frequency
    ├── Ranked unlock timing
    ├── Competitive incentives
    └── Social competitive features
```

---

## 10. Monetization Analytics Architecture

Monetization analytics provides comprehensive revenue insights, with AdsGram as the primary revenue system.

### 10.1 AdsGram Performance

AdsGram performance tracks the primary revenue system's effectiveness.

**Metrics:**
```
AdsGram Performance Metrics:
├── Ad Views
│   ├── Daily ad views
│   ├── Views per user
│   ├── Fill rate
│   └── View completion rate
│
├── Ad Revenue
│   ├── Daily AdsGram revenue
│   ├── Revenue per thousand (RPM)
│   ├── Effective CPM
│   └── Revenue by ad type
│
├── User Engagement with Ads
│   ├── Ad view frequency
│   ├── View completion rate by user
│   ├── Reward eligibility rate
│   └── Reward claim rate
│
└── Ad Performance Trends
    ├── Week-over-week revenue
    ├── Season-over-season revenue
    ├── Fill rate trends
    └── CPM trends
```

### 10.2 Reward Engagement

Reward engagement analyzes how players interact with ad rewards.

**Metrics:**
```
Reward Engagement Metrics:
├── Reward Claims
│   ├── Daily reward claims
│   ├── Claims per user
│   ├── Claim timing
│   └── Claim frequency
│
├── Reward Eligibility
│   ├── Daily eligibility
│   ├── Eligibility utilization rate
│   ├── Limit hit timing
│   └── Bonus eligibility usage
│
├── Reward Value
│   ├── Average reward size
│   ├── Reward value by type
│   ├── Reward currency mix
│   └── Reward purchasing power
│
└── Engagement Segments
    ├── Heavy ad users
    ├── Light ad users
    ├── Non-ad users
    └── Ad-to-purchase converters
```

### 10.3 Monetization Funnels

Monetization funnels track conversion through engagement stages.

**Metrics:**
```
Monetization Funnels:
├── Awareness to Action
│   ├── Ad view → Reward eligibility
│   ├── Eligibility → Reward claim
│   ├── Claim → First reward
│   └── First reward → Regular usage
│
├── Engagement to Conversion
│   ├── Ad user → Premium user
│   ├── F2P → First purchase
│   ├── Light spender → Heavy spender
│   └── One-time → Repeat purchaser
│
├── Funnel Drop-off
│   ├── Drop-off identification
│   ├── Drop-off reasons
│   ├── Recovery opportunities
│   └── Funnel optimization
│
└── Segment Analysis
    ├── Funnel by acquisition source
    ├── Funnel by engagement level
    ├── Funnel by player type
    └── Funnel by cohort
```

### 10.4 Revenue Reporting

Revenue reporting provides comprehensive financial visibility.

**Metrics:**
```
Revenue Metrics:
├── Revenue Overview
│   ├── Total daily revenue
│   ├── Revenue by source
│   ├── Revenue by platform
│   └── Revenue by region
│
├── AdsGram Revenue
│   ├── Gross revenue
│   ├── Net revenue (after fees)
│   ├── Revenue by campaign
│   └── Revenue by ad format
│
├── Revenue Attribution
│   ├── Revenue by acquisition source
│   ├── Revenue by cohort
│   ├── Revenue by engagement level
│   └── Revenue by player segment
│
└── Revenue Forecasting
    ├── Daily projection
    ├── Weekly projection
    ├── Monthly projection
    └── Seasonal projection
```

### 10.5 Conversion Analysis

Conversion analysis measures how players move toward paying.

**Metrics:**
```
Conversion Metrics:
├── Conversion Rates
│   ├── Free to premium conversion
│   ├── Ad to purchase conversion
│   ├── First purchase conversion
│   └── Repeat purchase rate
│
├── Conversion Timing
│   ├── Time to first purchase
│   ├── Purchase frequency
│   ├── Purchase clustering
│   └── Conversion triggers
│
├── Conversion Value
│   ├── Average revenue per user (ARPU)
│   ├── Average revenue per paying user (ARPPU)
│   ├── Customer lifetime value (CLV)
│   └── Revenue per session
│
└── Conversion Optimization
    ├── Conversion by segment
    ├── Conversion drivers
    ├── Optimal pricing
    └── Offer effectiveness
```

---

## 11. Retention Analytics Architecture

Retention analytics measures player stickiness and long-term value.

### 11.1 D1 Retention

Day 1 retention measures initial engagement.

**Metrics:**
```
D1 Retention Metrics:
├── D1 Calculation
│   ├── Users who returned 1 day after registration
│   ├── Users who returned 1 day after tutorial
│   └── Users who returned 1 day after first activity
│
├── D1 Benchmarks
│   ├── Industry benchmark: 40-50%
│   ├── Target: > 50%
│   ├── Segment targets
│   └── Trend analysis
│
├── D1 Drivers
│   ├── First session experience
│   ├── Tutorial completion
│   ├── First artifact
│   └── First battle
│
└── D1 Optimization
    ├── Onboarding improvements
    ├── Day 1 interventions
    ├── Push notification impact
    └── Re-engagement tactics
```

### 11.2 D7 Retention

Day 7 retention measures week-one engagement.

**Metrics:**
```
D7 Retention Metrics:
├── D7 Calculation
│   ├── Users who returned 7 days after registration
│   ├── Users who returned 7 days after tutorial
│   └── Cohort-based D7 calculation
│
├── D7 Benchmarks
│   ├── Industry benchmark: 20-30%
│   ├── Target: > 30%
│   ├── Segment targets
│   └── Trend analysis
│
├── D7 Drivers
│   ├── Ongoing engagement
│   ├── Social connections
│   ├── Progression velocity
│   └── Content consumption
│
└── D7 Optimization
    ├── Week 1 engagement
    ├── Achievement unlock timing
    ├── Event timing
    └── Social features impact
```

### 11.3 D30 Retention

Day 30 retention measures month-one engagement.

**Metrics:**
```
D30 Retention Metrics:
├── D30 Calculation
│   ├── Users who returned 30 days after registration
│   ├── Cohort-based D30 calculation
│   └── Rolling D30 vs. static D30
│
├── D30 Benchmarks
│   ├── Industry benchmark: 10-15%
│   ├── Target: > 15%
│   ├── Segment targets
│   └── Trend analysis
│
├── D30 Drivers
│   ├── Habit formation
│   ├── Social investment
│   ├── Collection progress
│   └── Competitive engagement
│
└── D30 Optimization
    ├── Month 1 engagement
    ├── Content release timing
    ├── Season alignment
    └── Long-term incentives
```

### 11.4 Cohort Analysis

Cohort analysis enables comparative analysis across player groups.

**Metrics:**
```
Cohort Metrics:
├── Cohort Definition
│   ├── Registration date cohorts
│   ├── Acquisition source cohorts
│   ├── Onboarding cohort
│   └── Feature adoption cohorts
│
├── Retention Curves
│   ├── Daily retention curve
│   ├── Weekly retention curve
│   ├── Retention curve by segment
│   └── Retention curve comparison
│
├── Cohort Comparison
│   ├── Cohort vs. cohort retention
│   ├── Cohort performance drivers
│   ├── Best/worst cohorts
│   └── Cohort success factors
│
└── Cohort Applications
    ├── Campaign effectiveness
    ├── Feature impact analysis
    ├── Content impact analysis
    └── Strategic planning
```

### 11.5 Lifetime Value Analysis

Lifetime value analysis predicts and measures player value.

**Metrics:**
```
LTV Metrics:
├── LTV Calculation
│   ├── Historical LTV by cohort
│   ├── Projected LTV
│   ├── LTV by segment
│   └── LTV by acquisition source
│
├── LTV Components
│   ├── Revenue per user
│   ├── Engagement value
│   ├── Social value
│   └── Content value
│
├── LTV Modeling
│   ├── Prediction model
│   ├── Confidence intervals
│   ├── Model validation
│   └── Feature importance
│
└── LTV Applications
    ├── Acquisition budget allocation
    ├── Retention investment
    ├── Player segmentation
    └── Marketing personalization
```

---

## 12. ETL Philosophy

The ETL (Extract, Transform, Load) process moves data from operational systems to the warehouse.

### 12.1 Extraction

Extraction retrieves data from source systems.

**Extraction Principles:**
```
Extraction Principles:
├── Completeness
│   ├── Extract all required data
│   ├── Handle schema changes
│   ├── Capture deletes
│   └── Maintain referential integrity
│
├── Efficiency
│   ├── Incremental extraction where possible
│   ├── Parallel extraction
│   ├── Compressed transfer
│   └── Low-impact scheduling
│
├── Reliability
│   ├── Retry on failure
│   ├── Checkpoint recovery
│   ├── Data validation at source
│   └── Audit trail
│
└── Source Protection
│   ├── Read-only access
│   ├── Connection pooling
│   ├── Rate limiting
│   └── Off-peak scheduling
```

### 12.2 Transformation

Transformation processes raw data into analytical formats.

**Transformation Principles:**
```
Transformation Principles:
├── Consistency
│   ├── Standardized formats
│   ├── Consistent naming
│   ├── Consistent encoding
│   └── Consistent calculations
│
├── Accuracy
│   ├── Correct business rules
│   ├── Verified calculations
│   ├── Valid aggregations
│   └── Data type correctness
│
├── Completeness
│   ├── Handle missing values
│   ├── Fill derived fields
│   ├── Complete reference data
│   └── Ensure all records processed
│
└── Performance
│   ├── Batch processing
│   ├── Parallel transformations
│   ├── Incremental updates
│   └── Efficient algorithms
```

### 12.3 Loading

Loading writes transformed data to the warehouse.

**Loading Principles:**
```
Loading Principles:
├── Atomicity
│   ├── All-or-nothing loads
│   ├── Transaction-based loading
│   ├── Rollback on failure
│   └── Idempotent operations
│
├── Efficiency
│   ├── Bulk loading
│   ├── Parallel loading
│   ├── Incremental updates
│   └── Partition loading
│
├── Integrity
│   ├── Primary key preservation
│   ├── Foreign key validation
│   ├── Constraint enforcement
│   └── Index maintenance
│
└── Auditability
│   ├── Load timestamps
│   ├── Record counts
│   ├── Data lineage
│   └── Load monitoring
```

### 12.4 Validation

Validation ensures data quality throughout ETL.

**Validation Principles:**
```
Validation Principles:
├── Schema Validation
│   ├── Column existence
│   ├── Data types
│   ├── Length limits
│   └── Format compliance
│
├── Data Validation
│   ├── Range checks
│   ├── Pattern checks
│   ├── Reference validation
│   └── Business rule validation
│
├── Quality Checks
│   ├── Completeness checks
│   ├── Consistency checks
│   ├── Accuracy checks
│   └── Timeliness checks
│
└── Error Handling
│   ├── Reject invalid data
│   ├── Log validation errors
│   ├── Alert on anomalies
│   └── Quarantine bad data
```

---

## 13. Reporting Standards

Reporting provides actionable insights through standardized dashboards.

### 13.1 Operational Dashboards

Operational dashboards provide real-time game health monitoring.

**Contents:**
```
Operational Dashboard:
├── System Health
│   ├── Server status
│   ├── Database performance
│   ├── API latency
│   └── Error rates
│
├── Player Health
│   ├── Current online users
│   ├── Active sessions
│   ├── Real-time DAU
│   └── Engagement indicators
│
├── Economy Health
│   ├── Transaction rates
│   ├── Currency flow
│   ├── Marketplace activity
│   └── Economic alerts
│
└── Revenue Health
│   ├── Real-time revenue
│   ├── Ad view rates
│   ├── Revenue trends
│   └── Anomaly alerts
```

### 13.2 Executive Dashboards

Executive dashboards provide daily strategic overview.

**Contents:**
```
Executive Dashboard:
├── Key Metrics
│   ├── DAU/WAU/MAU
│   ├── Day-over-day changes
│   ├── Week-over-week changes
│   └── Month-over-month changes
│
├── Financial Overview
│   ├── Daily revenue
│   ├── Revenue by source
│   ├── Cost per acquisition
│   └── LTV:CAC ratio
│
├── Player Overview
│   ├── New registrations
│   ├── Retention rates (D1, D7, D30)
│   ├── Engagement metrics
│   └── Segment distribution
│
└── Strategic Health
│   ├── Growth trajectory
│   ├── Retention trends
│   ├── Monetization trends
│   └── Competitive positioning
```

### 13.3 LiveOps Dashboards

LiveOps dashboards support live operations decisions.

**Contents:**
```
LiveOps Dashboard:
├── Event Performance
│   ├── Current event participation
│   ├── Real-time engagement
│   ├── Event progress
│   └── Event pacing
│
├── Content Performance
│   ├── Feature usage
│   ├── Content engagement
│   ├── Popular content
│   └── Content gaps
│
├── Operational Metrics
│   ├── Server load
│   ├── Event queue depth
│   ├── Processing latency
│   └── System capacity
│
└── LiveOps Actions
    ├── Event adjustments
    ├── Push notifications
    ├── Feature promotions
    └── Content unlocks
```

### 13.4 Growth Dashboards

Growth dashboards support growth initiatives and analysis.

**Contents:**
```
Growth Dashboard:
├── Acquisition
│   ├── New users by source
│   ├── Acquisition funnel
│   ├── Source performance
│   └── Cost per acquisition
│
├── Activation
│   ├── Onboarding funnel
│   ├── Tutorial completion
│   ├── First experience
│   └── Activation rate
│
├── Retention
│   ├── Cohort retention curves
│   ├── Retention by segment
│   ├── Retention drivers
│   └── Churn analysis
│
└── Revenue
│   ├── Monetization funnel
│   ├── Revenue by segment
│   ├── LTV analysis
│   └── ROI by channel
```

---

## 14. Data Quality Standards

Data quality ensures reliable analytical outputs.

### 14.1 Consistency Checks

Consistency checks verify data integrity across systems.

**Checks:**
```
Consistency Checks:
├── Cross-System Consistency
│   ├── Warehouse vs. operational DB totals
│   ├── Audit log vs. fact table totals
│   ├── Realtime vs. batch aggregations
│   └── Multi-source record matching
│
├── Temporal Consistency
│   ├── Day-over-day changes合理性
│   ├── Week-over-week trends合理性
│   ├── Season-over-season changes合理性
│   └── No impossible values
│
├── Referential Consistency
│   ├── Foreign key validity
│   ├── Dimension table consistency
│   ├── Lookup table accuracy
│   └── Cross-table consistency
│
└── Business Logic Consistency
    ├── Revenue calculations
    ├── Currency balances
    ├── Engagement metrics
    └── Retention calculations
```

### 14.2 Anomaly Detection

Anomaly detection identifies unexpected data patterns.

**Detection:**
```
Anomaly Detection:
├── Statistical Anomalies
│   ├── Z-score outliers
│   ├── IQR outliers
│   ├── Distribution shifts
│   └── Trend breaks
│
├── Business Anomalies
│   ├── Impossible values
│   ├── Negative balances
│   ├── Unlikely patterns
│   └── Threshold violations
│
├── Pattern Anomalies
│   ├── Sudden drops
│   ├── Sudden spikes
│   ├── Unusual patterns
│   └── Missing data patterns
│
└── Alerting
    ├── Real-time alerts
    ├── Threshold-based alerts
    ├── Pattern-based alerts
    └── Anomaly investigation workflow
```

### 14.3 Completeness Validation

Completeness validation ensures all expected data is present.

**Validation:**
```
Completeness Validation:
├── Record Completeness
│   ├── Row count validation
│   ├── Expected record count
│   ├── Record source coverage
│   └── Duplicate detection
│
├── Field Completeness
│   ├── NULL value rates
│   ├── Required field coverage
│   ├── Default value usage
│   └── Missing data patterns
│
├── Time Completeness
│   ├── Continuous time series
│   ├── No missing time periods
│   ├── Processing lag monitoring
│   └── Data freshness
│
└── Coverage Completeness
    ├── Segment coverage
    ├── Geographic coverage
    ├── Platform coverage
    └── Source coverage
```

---

## 15. Security Standards

Warehouse security protects sensitive data while enabling analysis.

### 15.1 Access Controls

Access controls restrict data based on role and need.

**Controls:**
```
Access Controls:
├── Role-Based Access
│   ├── Analyst role (read-only)
│   ├── Admin role (read/write)
│   ├── Dashboard role (predefined queries)
│   └── Executive role (aggregated data)
│
├── Data-Level Access
│   ├── Row-level security
│   ├── Column-level masking
│   ├── Aggregate-only access
│   └── PII restrictions
│
├── Query-Level Access
│   ├── Allowed query patterns
│   ├── Query result limits
│   ├── Export restrictions
│   └── Rate limiting
│
└── Access Governance
    ├── Access request workflow
    ├── Access review process
    ├── Access revocation
    └── Access logging
```

### 15.2 Analytical Permissions

Analytical permissions define what analysis is permitted.

**Permissions:**
```
Analytical Permissions:
├── Aggregation Permissions
│   ├── Minimum group size
│   ├── Suppression rules
│   ├── Aggregate-only queries
│   └── No individual records
│
├── Export Permissions
│   ├── Export size limits
│   ├── Export format restrictions
│   ├── Export destination controls
│   └── Export approval workflow
│
├── Sharing Permissions
│   ├── Internal sharing only
│   ├── External sharing prohibited
│   ├── Anonymization required
│   └── Partner data restrictions
│
└── Compliance Permissions
    ├── GDPR compliance
    ├── Data retention limits
    ├── Right to be forgotten
    └── Data processing agreement
```

### 15.3 Sensitive Data Protection

Sensitive data receives enhanced protection.

**Protection:**
```
Sensitive Data Protection:
├── PII Protection
│   ├── Data masking
│   ├── Data tokenization
│   ├── Pseudonymization
│   └── Access restrictions
│
├── Financial Data
│   ├── Revenue data protection
│   ├── Transaction detail restrictions
│   ├── Payment data limits
│   └── Audit requirements
│
├── Game Data
│   ├── Individual player data restrictions
│   ├── Competitive data protection
│   ├── Trade secret protection
│   └── Proprietary algorithm protection
│
└── Compliance Data
    ├── GDPR compliance
    ├── Telegram platform requirements
    ├── Financial regulations
    └── Industry standards
```

---

## 16. Future Expansion Notes

Future analytics domains represent potential expansion areas. These are documented as concepts only.

### 16.1 AI Analytics

**Concept:** Analytics for AI-driven features and personalization.

**Metrics:**
- AI recommendation effectiveness
- Personalization engagement impact
- AI-driven content performance
- Player preference modeling

**Status:** Future concept only.

### 16.2 Creator Economy Analytics

**Concept:** Analytics for creator content and community features.

**Metrics:**
- Creator content engagement
- Creator revenue analytics
- Community growth metrics
- Content moderation effectiveness

**Status:** Future concept only.

### 16.3 Web3 Analytics

**Concept:** Analytics for blockchain and wallet operations.

**Metrics:**
- Wallet connection rates
- Token transaction volumes
- Blockchain integration usage
- Web3 conversion metrics

**Status:** Future concept only.

### 16.4 NFT Analytics

**Concept:** Analytics for NFT-related gameplay features.

**Metrics:**
- NFT minting activity
- NFT trading volumes
- NFT ownership distribution
- NFT marketplace engagement

**Status:** Future concept only.

### 16.5 Esports Analytics

**Concept:** Analytics for competitive gaming broadcasts.

**Metrics:**
- Tournament viewership
- Competitive player engagement
- Broadcast engagement
- Esports revenue streams

**Status:** Future concept only.

---

## 17. Long-Term Philosophy

The Data Warehouse serves as the intelligence center of Jolt Time.

### 17.1 Intelligence Center

The warehouse becomes the authoritative source for all analytical insights.

**Intelligence Benefits:**
- Single source of truth for metrics
- Consistent definitions across teams
- Comprehensive historical view
- Cross-functional visibility
- Data-driven culture foundation

### 17.2 Strategic Decision Support

The warehouse enables informed strategic planning.

**Strategic Benefits:**
- Season planning insights
- Feature investment prioritization
- Marketing campaign optimization
- Player experience improvements
- Long-term growth modeling

### 17.3 LiveOps Effectiveness

The warehouse improves operational decision making.

**LiveOps Benefits:**
- Real-time event monitoring
- Quick experiment analysis
- Content performance visibility
- Operational issue detection
- Agile response capabilities

### 17.4 Monetization Decisions

The warehouse optimizes revenue strategies.

**Monetization Benefits:**
- AdsGram performance optimization
- Pricing strategy insights
- Conversion funnel improvement
- Player value optimization
- Revenue growth modeling

### 17.5 Platform Growth Support

The warehouse scales with Jolt Time's growth.

**Growth Benefits:**
- Architecture supports millions of users
- Additional data domains easily added
- Performance maintained under scale
- New analytical capabilities enabled
- Competitive intelligence supported

---

## Related Documentation

- **Analytics:** `.openhands/knowledge/analytics.md`
- **Database Schema:** `.openhands/knowledge/database-schema.md`
- **Query Optimization:** `.openhands/knowledge/query-optimization.md`
- **Realtime Architecture:** `.openhands/knowledge/realtime-architecture.md`
- **Audit Logs System:** `.openhands/knowledge/audit-logs-system.md`
- **Database Archiving:** `.openhands/knowledge/database-archiving.md`
- **AdsGram Integration:** `.openhands/knowledge/adsgram.md`

---

*Building the future through the lens of the past.*
