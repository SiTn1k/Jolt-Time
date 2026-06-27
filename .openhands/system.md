# Jolt Time — System Documentation

## Project Overview

**Project Name:** Jolt Time
**Type:** Telegram Mini App
**Theme:** Time Travel and World History
**Design Style:** Premium Dark Futuristic

## Core Identity

Jolt Time is a Telegram-first, mobile-first educational entertainment experience where players travel through time to discover historical anomalies, collect artifacts, and restore the timeline. The game combines rich historical content with futuristic technology aesthetics.

## Technical Foundation

### Platform
- **Primary Platform:** Telegram Mini App
- **User Experience:** Mobile-first design
- **Target Devices:** Smartphones (iOS/Android via Telegram), Desktop (web fallback)

### Design Language
- **Visual Style:** Premium dark futuristic
- **Background:** #0A0E17
- **Cards:** #131B2E
- **Primary Color:** #00D9FF (Cyan glow)
- **Accent Color:** #00FFE5 (Mint glow)
- **Premium Color:** #FFD700 (Gold)
- **Typography:** Inter
- **Effects:** Soft glow, smooth animations

### Architecture Principles
1. **Clean Architecture** — Separation of concerns at all layers
2. **TypeScript Strict Mode** — Full type safety
3. **Reusable Components** — DRY principle
4. **No Code Duplication** — Single source of truth
5. **Production-Ready Code** — No shortcuts, no temporary solutions
6. **Performance First** — All features must preserve performance
7. **Premium UX** — Every interaction feels polished

## Master Index

The Master Index is the official starting point for understanding the entire Jolt Time ecosystem. It provides a unified navigation structure connecting all documentation.

**See:** `.openhands/knowledge/master-index.md` for the complete master index.

### Global Documentation Structure

- **Core Gameplay** — Energy, progression, quests, achievements, eras, story, Prestige System Architecture, Prestige Progression Framework, Prestige Rewards, Prestige Analytics, Prestige Governance, Global Historical Map Architecture, Exploration Framework, Civilization Framework, Historical Region Framework, Exploration Analytics, Historical Campaigns Architecture, Campaign Progression Framework, Historical Mission Framework, Educational Content Framework, Campaign Analytics, Dynamic Missions Architecture, Mission Generation Framework, Adaptive Mission Systems, Mission Analytics, Mission Governance, Endgame Content Architecture, Mastery Framework, Legacy Systems, Endgame Progression, Endgame Analytics, Retention Systems Architecture, Retention Framework, Re-Engagement Systems, Habit Formation, Notification Integration
- **Economy Systems** — Currencies, marketplace, inventory, wallet
- **Museum Systems** — Artifacts, collections, evolution, museum design, Artifact Fusion Architecture, Collection Progression Framework, Fusion Progression Systems, Artifact Economy Framework, Fusion Analytics, Museum Expansion Architecture, Hall Expansion Framework, Exhibition Framework, Museum Prestige Systems, Museum Analytics
- **Social Features** — Friends, guilds, leaderboards, referrals, Guild Wars Architecture, Territory Systems, Guild Progression Framework, Guild Competition Systems, Guild Analytics, World Bosses Architecture, Cooperative Event Framework, Contribution Systems, Boss Reward Systems, World Boss Analytics
- **PvP Systems** — Arena, tournaments, expeditions, battle pass, Seasons 2.0 Architecture, Seasonal Progression, Seasonal Rewards, Season Lifecycle Management, Seasonal Analytics, LiveOps Strategy Architecture, Campaign Management Framework, Content Operations Framework, LiveOps Governance, LiveOps Analytics
- **Monetization** — Monetization Balancing Architecture, Revenue Governance Framework, Pay-to-Win Prevention Standards, Monetization Analytics, Revenue Diversification Systems, AdsGram Optimization Architecture, Ad Placement Framework, Rewarded Ad Systems, Monetization Governance, AdsGram Analytics, Premium Subscription Architecture, Premium Benefits Framework, Subscription Governance, Premium Analytics, Recurring Revenue Systems, Telegram Stars Economy Architecture, Stars Consumption Framework, Stars Pricing Governance, Monetization Balance Framework, Stars Analytics, Telegram Stars, subscriptions
- **Infrastructure** — API, database, Telegram integration
- **Security** — Authentication, data protection, fraud prevention
- **Analytics** — Metrics, tracking, retention analysis, Retention Systems Architecture, Retention Framework, Re-Engagement Systems, Retention Analytics, Lifetime Value Optimization, Revenue Intelligence Dashboard Architecture, KPI Governance Framework, Business Intelligence Systems, Revenue Analytics, Executive Reporting Systems, Telegram Analytics Layer, Acquisition Analytics, Community Analytics, Monetization Analytics, AdsGram Analytics, Telegram Intelligence Framework
- **DevOps** — Deployment, backup, admin tooling
- **Organic Growth Systems** — Growth Loops Architecture, Viral Growth Framework, Growth Funnel Systems, Growth Analytics, Organic Scaling Framework, Referral Rewards Economy Architecture, Referral Progression Framework, Referral Governance, Referral Analytics, Viral Sharing Architecture, Referral System Architecture, User Acquisition Flows Architecture
- **Documentation** — Standards, project vision, roadmap, testing
- **Future Concepts** — Creator Economy Architecture, Creator Progression Framework, Creator Governance, Creator Analytics, Community Leadership Systems, Creator ecosystem, Web3, educational partnerships
- **Narrative & Lore** — Lore Bible, Universe Encyclopedia, Narrative Standards, Historical Timeline

**See:** `.openhands/knowledge/master-index.md#documentation-categories`

### Documentation Navigation

**For Developers:**
- Start with API Architecture for backend
- Database Schema for data models
- Telegram Architecture for platform integration
- Security System for security considerations

**For Designers:**
- UI Style for design system
- Screens for specifications
- Navigation for user flows
- Accessibility for inclusive design

**For Product Managers:**
- Project Vision for mission and principles
- Roadmap for phases and milestones
- Economy System for balance and currencies
- Monetization for revenue strategy

**See:** `.openhands/knowledge/master-index.md#navigation-structure`

### Architecture Overview

- **Frontend** — Telegram Mini App (TypeScript, React, CSS)
- **Backend** — Supabase (PostgreSQL, Edge Functions, Auth, Realtime)
- **Bot** — Telegram Bot (Node.js, Bot API)
- **Integrations** — AdsGram, Telegram Stars, TON (optional)

**See:** `.openhands/knowledge/master-index.md#architecture-overview`

### Folder Architecture

The Jolt Time codebase follows a comprehensive folder architecture designed for scalability, maintainability, and predictability.

#### Top-Level Structure

| Directory | Purpose |
|-----------|---------|
| `src/` | Frontend application source code |
| `public/` | Static public assets |
| `docs/` | External documentation |
| `scripts/` | Build and deployment scripts |
| `tests/` | Cross-cutting test files |
| `supabase/` | Backend configuration and migrations |
| `assets/` | Global shared assets |
| `.openhands/` | Agent knowledge and system docs |

#### Frontend Structure (`src/`)

| Directory | Purpose |
|-----------|---------|
| `app/` | App-level setup and providers |
| `pages/` | Route-level page components |
| `features/` | Feature-based self-contained modules |
| `components/` | Shared UI components |
| `hooks/` | Custom React hooks |
| `services/` | External service integrations |
| `repositories/` | Data access layer (Supabase) |
| `stores/` | Zustand state management |
| `utils/` | Utility functions |
| `types/` | TypeScript type definitions |
| `constants/` | Application constants |

#### Feature-Based Architecture

Features are self-contained modules that encapsulate all related functionality:

```
src/features/{feature-name}/
├── index.ts
├── components/
├── hooks/
├── services/
├── stores/
├── types/
├── utils/
└── constants/
```

Core features include: museum, events, pvp, profile, economy, guilds, marketplace, social, rewards, quests, world-map, battle-pass.

#### Component Architecture

| Layer | Components |
|-------|------------|
| UI Primitives | Button, Input, Card, Badge, Avatar, Progress |
| Layout | PageLayout, Section, Grid, Container, Flex, Stack |
| Form | TextField, Select, Checkbox, Slider, Toggle |
| Game | ArtifactCard, CurrencyDisplay, EnergyBar, MissionCard |
| Social | FriendCard, GuildCard, LeaderboardEntry |
| Navigation | BottomNav, Header, Tabs, Breadcrumbs |

#### Service Layer Structure

```
src/services/
├── telegram/     # Telegram platform services
├── ads/          # AdsGram integration
├── analytics/   # Analytics services
├── api/          # API service layer
└── notification/# Notification services
```

#### Store Structure

| Store | Module | Persistence |
|-------|--------|-------------|
| Player Store | `player/` | Full sync |
| Economy Store | `economy/` | Full sync |
| Museum Store | `museum/` | Full sync |
| Events Store | `events/` | Partial |
| PvP Store | `pvp/` | Real-time only |
| Social Store | `social/` | Partial |
| Settings Store | `settings/` | Full sync |
| UI Store | `ui/` | Session only |

#### Backend Structure

```
supabase/
├── functions/     # Edge Functions
├── migrations/     # Database migrations
├── seeds/          # Database seeds
├── rpc/            # RPC Function definitions
├── triggers/       # Database triggers
└── views/          # Database views
```

#### Naming Standards

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ArtifactCard.tsx` |
| Hooks | `use` prefix | `usePlayer.ts` |
| Services | camelCase | `telegramBot.ts` |
| Stores | `Store` suffix | `playerStore.ts` |
| Utils | camelCase | `formatCurrency.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ENERGY.ts` |

#### Scaling Philosophy

- **10 Features:** Baseline feature modules
- **50 Features:** Extended feature set with domain grouping
- **100+ Features:** Enterprise structure with domain groups

**See:** `.openhands/knowledge/folder-architecture.md` for complete folder architecture specification.

### System Relationships

- Economy ↔ Marketplace — Currency generation and sinks
- Battle Pass ↔ Events ↔ Economy — Seasonal content integration
- Analytics ↔ Monetization — Data-driven revenue optimization
- Notifications ↔ Telegram Bot — Push delivery and engagement
- Progression ↔ Energy ↔ Daily Systems — Core loop interconnection

**See:** `.openhands/knowledge/master-index.md#system-relationships**

## Project Phases

### Phase 1: Foundation
- Core game mechanics
- First historical era (Mesopotamia)
- Basic shard collection system
- Telegram authentication

### Phase 2: Expansion
- Additional eras (Egypt, Greece, Rome)
- Social features (friends, leaderboards)
- Guild system
- Seasonal events

### Phase 3: Multiplayer
- Cooperative gameplay
- Competitive modes
- Real-time features
- Community building

### Phase 4: Ecosystem
- Cross-platform support
- Educational partnerships
- API ecosystem
- Physical merchandise

### Automated Event Generator
Dynamic event systems support content production through automated generation and scheduling:

- **Event Categories:** Seasonal, Historical, Community, Weekend, Limited-Time events
- **Event Generation Workflow:** Templates, reward pools, mission pools, content schedules
- **Event Rotation Systems:** Seasonal rotations, event calendars, recurring activities
- **Event Scheduling:** Annual, seasonal, monthly, weekly planning horizons

**See:** `.openhands/knowledge/event-generator.md` for complete automated event generator specification.

## Monetization Strategy

### Primary Revenue: AdsGram
The main monetization for the project is **Telegram AdsGram advertisements**. This is the primary revenue source that sustains the project's development.

**AdsGram Monetization Model:**
- Players watch ads and receive in-game rewards (Time Shards, Chrono Coins, Event Tokens, Energy)
- Revenue (real money) flows entirely to the project — players do NOT earn money
- All ad rewards are purely in-game currencies and bonuses
- Ads are never required for gameplay progression

**Key Revenue Streams:**
1. Rewarded video ads (high CPM, player-initiated)
2. Interstitial ads (medium CPM, natural breaks only)
3. Event-based ads (premium rates during events)
4. Daily bonus ads (high engagement, enhanced rewards)

**AdsGram Compliance:**
- Player-respecting ad experience
- Strict frequency caps (max 5 rewarded ads/day, 8 interstitials/hour)
- Skip options on all non-rewarded ads
- No ads during active gameplay
- GDPR-ready, privacy-first approach

**See:** `.openhands/knowledge/adsgram.md` for complete AdsGram specification.

### Secondary Revenue: User Purchases
- Cosmetic items only
- Optional premium subscription
- Battle pass (future)

### Telegram Stars Architecture
Native Telegram Stars payment integration for Jolt Time monetization:
- **Purchase Categories:** Direct purchases (Time Shards, Dust), Premium features (Plus subscription), Seasonal (Season Pass, Event Pass), Cosmetic (profiles, museum), Progression (XP boosts, skips), Supporter (badges, emotes)
- **Architecture Layers:** Purchase Layer (invoice creation, Telegram API), Validation Layer (signature verification, idempotency), Reward Layer (item granting, inventory), Analytics Layer (events, metrics), Security Layer (fraud prevention, duplicate detection)
- **Purchase Security:** HMAC signature validation, receipt idempotency, fraud pattern detection, duplicate purchase prevention
- **Premium Features:** Jolt Time Plus (5 Stars/month or 45 Stars/year), exclusive cosmetics, quality-of-life features, ad-free option

**See:** `.openhands/knowledge/telegram-stars-architecture.md` for complete Stars specification.

### Stars Purchase Framework
Purchase types and pricing structure for Telegram Stars:
- **One-Time Purchases:** Micro (1-5 Stars), Small (10-25 Stars), Medium (50-100 Stars), Large (250-500 Stars), Premium (1000+ Stars)
- **Premium Bundles:** Starter Bundle, Value Bundle, Collection Bundle, Event Bundle
- **Seasonal Bundles:** Limited availability, themed content, exclusive cosmetics
- **Special Offers:** Flash sales, first purchase discounts, milestone offers, return offers
- **Season Pass:** 10 Stars (free + premium tracks), 8-12 week seasons, 50 levels

**See:** `.openhands/knowledge/telegram-stars-architecture.md#purchase-architecture`

### Premium Systems
Premium subscriptions and exclusive features:
- **Jolt Time Plus:** Monthly (5 Stars) or Annual (45 Stars, 25% savings), enhanced daily rewards, premium badge, emotes, priority support, ad-free option, extended friend list
- **Quality-of-Life:** Larger inventory capacity, advanced filters, custom notifications, idle timeout extension
- **Exclusive Cosmetics:** Premium frames, animated backgrounds, achievement badges, profile animations
- **Premium Conveniences:** Quick actions, auto-management, enhanced trading, priority event access

**See:** `.openhands/knowledge/telegram-stars-architecture.md#premium-features-architecture`

### Monetization Governance
Economic balance and fair monetization principles:
- **Fair Progression:** Core content accessible without purchase, no paywalls on story, competitive integrity maintained
- **Healthy Monetization:** Value-based pricing, no dark patterns, clear refund policies, no manipulation
- **AdsGram + Stars Balance:** AdsGram for passive engagement, Stars for active premium, no overlap, different user segments
- **Pay-to-Win Prevention:** No gameplay power via purchase, no direct win conditions, cosmetics and convenience only

**See:** `.openhands/knowledge/telegram-stars-architecture.md#economic-balance-philosophy`

### Purchase Security Standards
Security measures for Stars transactions:
- **Transaction Validation:** HMAC signature verification, receipt ID uniqueness, user/item validation, price matching
- **Fraud Prevention:** Rapid purchase detection, pattern anomaly alerts, refund tracking, user suspension
- **Duplicate Prevention:** Receipt ID idempotency, subscription double-charge prevention, limited item ownership check
- **Integrity Measures:** Server-side processing only, complete audit trail, automatic retry on failure, 24h refund processing

**See:** `.openhands/knowledge/telegram-stars-architecture.md#security-architecture`

### Critical Rules
- **NEVER implement pay-to-win mechanics**
- User monetization must NEVER dominate gameplay
- Never design the game around aggressive monetization
- Always preserve player experience quality
- Focus on high retention and long-term growth

### Economy and Currency System
The game uses a comprehensive multi-currency economy designed around fairness, sustainability, and player respect:

**Main Currencies:**
- **Time Shards** — Primary progression currency, used for acceleration and upgrades
- **Chrono Coins** — Workhorse currency for pack opening and everyday purchases
- **Prestige Points** — Rewarded for long-term mastery and collection milestones
- **Event Tokens** — Limited-time currency for seasonal event content

**Premium Currencies:**
- **Jolt Crystals** — Purchasable premium currency for cosmetics and convenience only

**Soft Currencies:**
- **Research Points** — Earned through educational activities, unlocks study features
- **Museum Points** — Earned through museum progression, unlocks museum cosmetics

**Core Principles:**
- No pay-to-win mechanics — no currency purchases gameplay power
- All currencies earnable through gameplay
- Sustainable sinks prevent long-term inflation
- Clear caps and limits maintain economy health

**Premium Subscription: Jolt Time Plus**
- Optional monthly subscription ($2.99-$9.99/month)
- Benefits: extra inventory slots, additional quests, exclusive cosmetics, reduced cooldowns
- NO gameplay advantages — all benefits are cosmetic or convenience

**Anti-Inflation Controls:**
- Spending sinks for every currency
- Balancing rules with regular monitoring
- Reward limitations (daily/weekly/monthly caps)
- Event economy controls with seasonal resets

**See:** `.openhands/knowledge/economy-system.md` for complete economy and currency specification.

### Marketplace System
The player-to-player marketplace enables buying, selling, and trading of artifacts, cosmetics, and collectibles:

- **Marketplace Categories:** Artifact Market, Cosmetic Market, Event Collectibles, Museum Decorations, Limited Items
- **Supported Currencies:** Chrono Coins (primary), Event Tokens (limited items), TON (future)
- **Listing System:** Duration options (24h, 3d, 7d, 14d), price range per rarity tier, single and multi-quantity listings
- **Search and Filter:** Filter by rarity, era, category, price range; sort by price, recently listed, ending soon
- **Marketplace Statistics:** Total trades, most traded items, rarest collectibles, marketplace activity metrics
- **Telegram Bot Notifications:** Sale completion, purchase completion, expired listings — max 3/day, fully customizable

**See:** `.openhands/knowledge/marketplace.md` for complete marketplace specification.

### Trading Economy
The trading economy provides legitimate channels for item exchange while maintaining economic balance:

- **Trading Philosophy:** Completely optional participation; no gameplay progression requires trading
- **Economy Strengthening:** Additional Chrono Coins and Event Token sinks; enables collectors to complete sets
- **Marketplace Fees:** Percentage-based fees per transaction; scaled by item value; supports project development
- **Anti-Inflation Controls:** Price ceilings per rarity tier; marketplace cooling periods; supply monitoring

**See:** `.openhands/knowledge/marketplace.md` for complete trading economy specification.

### Transaction History
Players have complete visibility into their marketplace activities:

- **Purchased Items:** Item name, rarity, seller ID, price, date, item provenance (future)
- **Sold Items:** Item name, rarity, buyer ID, price, date, marketplace fee deducted
- **Total Earnings:** Gross/net earnings by period (daily, weekly, monthly, all-time); breakdown by category
- **Export Features:** Transaction history export; tax reporting summaries (future)

**See:** `.openhands/knowledge/marketplace.md` for complete transaction history specification.

### Marketplace Protection
Comprehensive safeguards maintain marketplace integrity and prevent abuse:

- **Duplicate Item Prevention:** Ownership verification, listing locks, one-item-one-sale enforcement
- **Suspicious Transaction Detection:** Price anomaly detection, rapid trading pattern monitoring, account linking detection
- **Exploit Abuse Prevention:** Listing exploits, currency exploits, inventory manipulation, race condition protection
- **Artificial Inflation Control:** Price ceilings, marketplace cooling, supply/demand monitoring, anti-manipulation algorithms

**See:** `.openhands/knowledge/marketplace.md` for complete marketplace protection specification.

### NFT System
The NFT system provides true digital ownership for collectibles through optional TON blockchain integration:

- **NFT Categories:** Historical Artifacts, Cosmetic Items, Limited Collections, Anniversary Collectibles, Founder Items
- **Ownership Philosophy:** Players own their collectibles, trade freely, preserve collections long-term
- **Minting Philosophy:** Optional minting for in-game items; no gameplay item requires blockchain
- **Limited Collections:** Founder, anniversary, and collaboration NFTs remain mostly cosmetic
- **Museum Integration:** NFT items display with provenance tracking and blockchain verification badges

**See:** `.openhands/knowledge/nft-system.md` for complete NFT system specification.

### TON Integration
Future TON blockchain connectivity for Web3-enhanced experiences:

- **Wallet Connection:** Future Telegram TON wallet integration via Telegram Passport
- **TON Payments:** Potential purchase of Jolt Crystals and premium items using TON
- **NFT Marketplace:** In-app TON marketplace for blockchain-verified item trading
- **Technical Approach:** TON Connect SDK, NFT metadata standards, smart contract patterns

**See:** `.openhands/knowledge/nft-system.md` for complete TON integration specification.

### Digital Ownership
Blockchain-verified ownership for players who want verifiable asset control:

- **Verifiable Ownership:** Immutable blockchain proof independent of game servers
- **Provenance Tracking:** Complete ownership history for collected items
- **Collection Preservation:** Mirrored database ensures items persist if blockchain unavailable
- **Cross-Platform Potential:** Future item portability between compatible platforms

**See:** `.openhands/knowledge/nft-system.md` for complete digital ownership specification.

### Optional Web3 Features
All blockchain features are entirely optional; Web2 players enjoy complete game experience:

- **No Mandatory Adoption:** No gameplay content locked behind NFT ownership
- **Equal Gameplay:** All progression achievable without any Web3 engagement
- **Fairness Philosophy:** No pay-to-win; Web2 and Web3 players compete equally
- **AdsGram Separation:** NFT systems are tertiary revenue; never replace AdsGram primary revenue

**See:** `.openhands/knowledge/nft-system.md` for complete optional Web3 features specification.

### Wallet System
The wallet system provides optional payment infrastructure for players who want to support the project:

- **Wallet Features:** Connect/disconnect wallet, wallet status display, transaction history
- **Payment Categories:** Battle Pass, cosmetics, subscriptions, event bundles, future NFT transactions
- **Security:** Encrypted connections, no private key storage, fraud detection, PCI compliance
- **Transaction History:** Purchase history, rewards received, completed payments, export options (future)

**See:** `.openhands/knowledge/wallet-system.md` for complete wallet system specification.

### Payment Infrastructure
Comprehensive payment processing supporting multiple payment methods:

- **Supported Systems:** Telegram Stars (current), TON Wallet (future), TON Connect (future), additional providers (future)
- **Purchase Flow:** Select purchase → Choose payment method → Process transaction → Grant rewards → Confirm
- **Security Architecture:** Encrypted transactions, secure storage, audit logging, fraud detection
- **Performance:** Purchase completion < 3s, wallet connection < 5s, transaction history load < 2s

**See:** `.openhands/knowledge/wallet-system.md` for complete payment infrastructure specification.

### Telegram Stars Support
Telegram Stars serve as the primary payment currency for in-app purchases:

- **Purchase Categories:** Premium cosmetics, subscriptions, convenience items, event bundles, Battle Pass
- **Stars Integration:** Native Telegram payment API, instant delivery, receipt storage via Telegram
- **Usage Principles:** Stars never create pay-to-win advantages; cosmetics and convenience only
- **AdsGram Separation:** Distinct revenue streams; no conversion between Stars and AdsGram rewards

**See:** `.openhands/knowledge/wallet-system.md` for complete Telegram Stars specification.

### TON Connect Support
Future TON blockchain wallet connection via TON Connect protocol:

- **Wallet Connection:** Future Telegram TON wallet integration via TON Connect SDK
- **Future Transactions:** TON transfers, NFT minting fees, marketplace transactions
- **Technical Approach:** TON Connect SDK, wallet session management, secure token refresh
- **Implementation Timeline:** TON integration is future work; no current timeline set

**See:** `.openhands/knowledge/wallet-system.md` for complete TON Connect specification.

### Subscription System
Jolt Time Plus premium subscription rewards loyal players with convenience and cosmetic benefits:

- **Subscription Types:** Monthly ($2.99-$4.99) and Yearly ($24.99-$39.99) with Telegram Stars
- **Exclusive Benefits:** Profile frames, cosmetic rewards, monthly bonuses, museum decorations, premium titles
- **Daily Premium:** Daily Chrono Coins, cosmetic gifts, collector rewards (no combat advantages)
- **Cancellation:** Cancel anytime; keep earned cosmetics; no core progression lost

**See:** `.openhands/knowledge/subscription-system.md` for complete subscription specification.

### Jolt Time Plus
Premium membership tier providing comfort without pay-to-win:

- **Convenience Features:** +20 inventory slots, +2 quest capacity, 10% cooldown reduction, priority support
- **Cosmetic Rewards:** Exclusive frames, badges, titles, sticker packs, subscriber cosmetics
- **Monthly Resources:** Chrono Coins bonus, Museum Points, free energy refill
- **Balance Rules:** No XP multipliers, no drop rate increases, no competitive advantages

**See:** `.openhands/knowledge/subscription-system.md` for complete Jolt Time Plus specification.

### Premium Rewards
Ongoing rewards for Jolt Time Plus subscribers:

- **Daily Bonuses:** Chrono Coins (10-25/day), cosmetic gifts, collector rewards
- **Monthly Cosmetics:** One exclusive cosmetic item per month
- **Subscriber Badge:** Visible premium status indicator
- **Display Slots:** Temporary additional showcase slots

**See:** `.openhands/knowledge/subscription-system.md` for complete premium rewards specification.

### Loyalty Rewards
Long-term subscriber recognition and appreciation:

- **Milestone Badges:** 1 month (Bronze), 3 months (Silver), 6 months (Gold), 12 months (Platinum), 24 months (Diamond), 60 months (Mythic)
- **Anniversary Cosmetics:** Exclusive frame and badge at 1-year anniversary, annual limited items
- **Long-Term Appreciation:** Early access to features, subscriber events, Hall of Fame recognition
- **Preserved on Cancellation:** All earned badges and cosmetics retained

**See:** `.openhands/knowledge/subscription-system.md` for complete loyalty rewards specification.

### Creator System
The creator system recognizes and celebrates community members who contribute to Jolt Time:

- **Creator Categories:** Lore creators, event creators, community artists, historians, content creators
- **Contribution Types:** Fan art, historical articles, community events, educational content, museum concepts
- **Recognition:** Creator badges (Bronze to Diamond), special titles, contributor pages, community spotlights
- **Rewards:** Profile cosmetics, exclusive badges, anniversary recognition — all cosmetic, no gameplay advantages

**See:** `.openhands/knowledge/creator-system.md` for complete creator system specification.

### Community Contributions
Jolt Time encourages creativity, community participation, and educational contributions:

- **World Expansion:** Creators help grow the Jolt Time universe through diverse contributions
- **Inclusivity:** All players can become creators; multiple paths to recognition
- **Quality Guidelines:** Content should respect history, avoid harmful material, support positive communities
- **Non-Commercial:** Recognition and appreciation are primary rewards; no direct revenue sharing (future potential)

**See:** `.openhands/knowledge/creator-system.md` for complete community contributions specification.

### Creator Recognition
Comprehensive recognition celebrates creator contributions without gameplay advantages:

- **Creator Badges:** Contributor, Creator, Expert Creator, Master Creator, Legendary Creator tiers
- **Profile Titles:** Lore Keeper, Event Master, Community Artist, Historian, Content Creator, Legendary Contributor
- **Community Spotlights:** Weekly and monthly features on official channels and in-game boards
- **Non-Material Rewards:** Social media features, direct communication with dev team, early access invitations

**See:** `.openhands/knowledge/creator-system.md` for complete creator recognition specification.

### Future Creator Economy
Future systems may introduce creator compensation and collaboration tools:

- **Creator Collections:** Quality creators propose branded items (future)
- **Creator Events:** Player-organized community tournaments and showcases (future)
- **Revenue Sharing:** Percentage of sales from creator items (future, aspirational)
- **Collaboration Tools:** Creator matching, project boards, mentorship programs (future)

**See:** `.openhands/knowledge/creator-system.md` for complete future creator economy specification.

### Admin Panel
Internal administrative interface for managing Jolt Time operations:

- **Admin Roles:** Super Admin, Administrator, Moderator, Support Team with hierarchical permissions
- **Player Management:** View profiles, review reports, investigate suspicious activity, apply sanctions
- **Moderation Actions:** Warnings, temporary restrictions, temporary bans, permanent bans with escalation philosophy
- **Privacy Principles:** Access only necessary information, respect player privacy, avoid unnecessary data exposure

**See:** `.openhands/knowledge/admin-panel.md` for complete admin panel specification.

### Moderation Tools
Comprehensive tools for maintaining community standards:

- **Moderation Actions:** Progressive discipline from warnings to permanent bans
- **Escalation Path:** First offense → repeated offense → severe offense → continued violations
- **Support Tools:** Review tickets, investigate issues, assist players with account recovery
- **Report Processing:** Automated triage, evidence review, action decision, outcome communication

**See:** `.openhands/knowledge/admin-panel.md` for complete moderation tools specification.

### Support Systems
Tools enabling support team to assist players effectively:

- **Ticket Management:** Queue, priority triage, category routing, SLA tracking
- **Investigation Tools:** Account diagnostics, transaction lookup, progress verification
- **Compensation:** Item grants, currency adjustments, refund processing (all logged)
- **Escalation Path:** Route complex issues to specialists

**See:** `.openhands/knowledge/admin-panel.md` for complete support systems specification.

### Audit Logs
Comprehensive logging ensures administrative accountability:

- **Administrator Actions:** User modifications, sanctions, item grants, economy adjustments
- **Moderation History:** Warnings, restrictions, bans, appeals with evidence preservation
- **Security Events:** Login attempts, permission escalations, data access, role changes
- **Critical Actions:** Permanent bans, data exports, rollbacks require enhanced documentation

**See:** `.openhands/knowledge/admin-panel.md` for complete audit logs specification.

### Daily Rewards System
The daily rewards system provides consistent engagement through a 30-day calendar:
- **30-Day Calendar:** Progressive rewards with special milestones on days 7, 14, 21, and 30
- **Special Reward Days:** Rare/Epic/Legendary packs on key milestones
- **Visual Calendar:** Pulsing animations, claim tracking, streak indicators
- **Daily Capsules:** Guaranteed rarity tiers based on day of week
- **Weekend Bonuses:** Double XP, reduced energy costs, enhanced drops

**See:** `.openhands/knowledge/daily-systems.md` for complete daily rewards specification.

### Login Streak System
Streak system rewards consistent engagement with escalating benefits:
- **Streak Counter:** Tracks consecutive days, grace period scales with streak length
- **Streak Milestones:** Benefits at days 3, 7, 14, 30, 60, 100
- **Streak Benefits:** XP bonus (+5% to +40%), energy bonus, milestone capsules
- **Streak Protection:** Temporal Shields extend grace periods, recovery options available
- **Compassionate Design:** Preserved bonuses after loss, no shame messaging

**See:** `.openhands/knowledge/daily-systems.md` for complete streak system specification.

### Mission System
Structured objectives that guide player progression:
- **Daily Missions:** 3 missions per day (1 Easy, 1 Medium, 1 Hard), auto-refresh at UTC midnight, 10-20 min to complete
- **Weekly Missions:** 5 missions per week, larger rewards, reset Monday, medium to hard difficulty
- **Mission Chains:** Multi-step objectives (2-5 steps) with bonus rewards upon completion
- **Mission Refresh:** 1 free refresh daily, premium refreshes via Jolt Crystals, balance philosophy
- **Streak System:** Consecutive daily/weekly/monthly engagement tracking, grace periods, temporal shields, escalating benefits (+5% to +40% XP)
- **Reward Types:** XP, Chrono Coins, Time Shards, Battle Pass XP, cosmetics, event currency — no P2W
- **Casual-Friendly:** Multiple sessions supported, no mandatory grinding, 60-100% rewards based on engagement level
- **Telegram Notifications:** Daily reset, chain completion, streak milestones, weekly rewards — max 4/day
- **AdsGram Optional:** Mission refresh boost, reward boost, XP boost — never mandatory
- **Future Expansions:** Monthly missions, guild missions, co-op missions, world missions (documented only)

**See:** `.openhands/knowledge/missions.md` for complete mission system specification.

### Comeback Rewards
Returning players receive generous welcome-back bonuses:
- **Inactivity Thresholds:** 1-3 days (1.5x), 4-7 days (2x + Free Capsule), 8-14 days (2.5x + Rare), 30+ days (3x + Legendary)
- **Preserved Progress:** All artifacts, collection, museum, and streak bonus level maintained
- **Welcome Back Chest:** Accumulated daily rewards converted to catch-up package

**See:** `.openhands/knowledge/daily-systems.md` for complete comeback rewards specification.

### Push Notifications
Telegram Bot notifications designed for re-engagement without spam:
- **Maximum 4 notifications per day** — never exceeded
- **Value-First Messaging:** Every notification provides genuine value
- **User Control:** Granular settings, quiet hours, one-click disable
- **Notification Types:** Daily reminders, energy restored, quest available, events, streak milestones
- **Anti-Spam Rules:** No fear tactics, no streak threats, no manipulative language

**See:** `.openhands/knowledge/daily-systems.md` and `.openhands/knowledge/notifications.md` for complete notification specification.

### Retention Philosophy
Jolt Time is designed to be fair, grind-friendly, and non-predatory:
- **Reward Active Players:** Daily rewards, streak bonuses, milestone celebrations
- **Avoid Addiction Mechanics:** No artificial urgency, no FOMO manipulation
- **Avoid Punishment Systems:** Soft streak reset, preserved bonuses, generous comebacks
- **Healthy Sessions:** 5-20 minute optimal play sessions, break reminders
- **No Pay-to-Win:** All currencies earnable through gameplay, cosmetics optional

**See:** `.openhands/knowledge/daily-systems.md` for complete retention philosophy.

### Achievement System
Comprehensive goal-setting framework providing long-term motivation:
- **8 Achievement Categories:** Collection, Battles, Progression, Economy, Social, AdsGram, Activity, Special
- **4 Rarity Tiers:** Common (Easy), Rare (Medium), Epic (Hard), Legendary (Very Hard)
- **125 Total Achievements** with multi-stage progress tracking
- **Reward Types:** XP, Chrono Dust, Badges, Frames, Titles, Exclusive Cosmetics
- **Hidden Achievements:** Discoverable through natural gameplay, special titles and cosmetics
- **Achievement Showcase:** Display up to 4 badges + frame + title on profile
- **Statistics Integration:** Lifetime stats, progress tracking, completion percentages
- **Long-Term Goals:** Designed for 1+ years of progression (First Week → First Year → Endgame)

**See:** `.openhands/knowledge/achievements.md` for complete achievement specification.

### Player Titles
Cosmetic rewards for achievement milestones:
- **Collection Titles:** "Time Explorer", "Artifact Hunter", "Collector", "Master Collector"
- **Battle Titles:** "Battle Legend", "Untouchable", "Unstoppable"
- **Era Titles:** "World Traveler", "Guardian of Time"
- **Special Titles:** "Time Traveler", "Jolt Master", "Historian", "Museum Curator"
- **Titles Display:** Shown under player name in profile and leaderboards
- **One Active Title:** Players choose which title to display

**See:** `.openhands/knowledge/achievements.md` for complete titles specification.

### Collection Goals
Milestone-based objectives for long-term progression:
- **Artifact Collection:** 10, 50, 100, 200, all 82 artifacts milestones
- **Era Completion:** Per-era 100% completion with milestone rewards
- **Set Completion:** 1, 3, 6, all artifact sets
- **Rarity Completion:** All Common, Uncommon, Rare, Epic, Legendary, Mythic
- **Multi-Stage Progress:** Visible progress bars, stage rewards at each tier
- **Collection Statistics:** Real-time tracking of owned/total by era, rarity, category

**See:** `.openhands/knowledge/achievements.md` for complete collection goals specification.

### Completion Tracking
Visual progress toward complete game mastery:
- **Total Achievements:** X/125 completed (percentage)
- **Achievement Score:** Cumulative points from all achievements
- **Collection Completion:** 67/82 artifacts (82%)
- **Era Progress:** Per-era percentage with visual progress bars
- **Rarity Breakdown:** Artifacts by rarity tier
- **Statistics Dashboard:** Battles, economy, social, activity lifetime stats
- **Achievement Gallery:** Filterable view of all achievements by category/rarity/status

**See:** `.openhands/knowledge/achievements.md` for complete completion tracking specification.

### Telegram Ecosystem
Complete Telegram integration architecture:
- Telegram Bot: Commands, notifications, re-engagement
- Telegram Mini App: Game UI and gameplay
- Backend API: Business logic and processing
- Supabase: Data storage and real-time

**See:** `knowledge/telegram-architecture.md` for ecosystem details.

### Telegram SDK Architecture
Centralized bridge between Mini App and Telegram platform:
- **SDK Categories:** User, Theme, Navigation, Device, Sharing, Storage, Monetization
- **Architecture Layers:** SDK Layer (raw API), Service Layer (business logic), Hook Layer (React), UI Layer (components)
- **User Integration:** Telegram user/chat/session/identity with secure verification
- **Theme Integration:** Detection, dark mode, color sync, dynamic updates
- **Navigation Integration:** Back button, closing confirmation, navigation state, deep links
- **Device Integration:** Viewport, safe areas, capabilities, orientation handling
- **Storage Integration:** Cloud storage for preferences, settings, cross-device sync
- **Error Handling:** Availability failures, unsupported features, degraded mode, recovery

**See:** `.openhands/knowledge/telegram-sdk-architecture.md` for complete SDK specification.

### Telegram Integration Layer
Core integration points between Mini App and Telegram platform:
- **SDK Initialization:** Telegram.WebApp initialization, ready signal, expand viewport
- **User Data:** initData extraction, secure verification, session management
- **Theme Sync:** themeParams observer, color scheme detection, CSS variable injection
- **Navigation:** BackButton control, confirmClose dialogs, viewport events
- **Sharing:** share_url for invitations, achievements, museum, campaigns
- **Storage:** cloudStorage API for persistent user data

**See:** `.openhands/knowledge/telegram-sdk-architecture.md#sdk-architecture-layers`

### Theme Integration
Synchronization between Telegram theme and Jolt Time appearance:
- **Theme Detection:** Telegram.themeParams, colorScheme detection
- **Color Mapping:** Telegram colors → Jolt Time CSS variables
- **Dark Mode:** Full dark theme support with automatic switching
- **Dynamic Updates:** Real-time theme change observation via onEvent
- **Fallback:** Default Jolt Time colors if Telegram theme unavailable

**See:** `.openhands/knowledge/telegram-sdk-architecture.md#theme-integration-architecture`

### Navigation Integration
Back button and navigation control through Telegram SDK:
- **Back Button:** showBackButton/hideBackButton, onBackButtonClick handler
- **Closing Confirmation:** showConfirmClose/hideConfirmClose for unsaved work
- **Navigation State:** Track screen history, back stack management
- **Deep Link Navigation:** Extract start_param, route to appropriate screen
- **Viewport Events:** onEvent('viewport_changed') for resize handling

**See:** `.openhands/knowledge/telegram-sdk-architecture.md#navigation-integration-architecture`

### Telegram UX Standards
User experience standards for Telegram Mini App platform:
- **Haptic Feedback:** Impact (light/medium/heavy/rigid), notification (success/warning/error), selection
- **Main Button:** Dynamic text, loading state, disabled state, context-aware actions
- **Safe Areas:** Content padding for notch/home indicator, env() CSS functions
- **Loading States:** Skeleton screens, spinner indicators, progressive loading
- **Error Handling:** User-friendly messages, recovery suggestions, graceful degradation

**See:** `.openhands/knowledge/telegram-sdk-architecture.md#haptic-feedback-architecture`

### Telegram Bot System
Centralized bot ecosystem for player communication and engagement:
- **Bot Responsibilities:** Send notifications, deep link navigation, deliver rewards, remind inactive players, announce events, provide support, track referrals
- **Bot Commands:** `/start`, `/help`, `/profile`, `/settings`, `/rewards`, `/referral`, `/news`, `/support`, `/stats`, `/plus`, `/showcase`
- **Deep Link System:** Standard start, referral tracking, profile/missions/events/museum/battle/shop navigation, artifact-specific links, guild invites
- **Notification Categories:** Daily reminders, event notifications, energy restored, expedition completed, arena rewards, mission resets, battle pass reminders, seasonal announcements
- **User Settings:** Master toggle, category enable/disable, quiet hours (10PM-8AM), timezone-aware delivery, quick mute options
- **Anti-Spam Rules:** Maximum 4 notifications/day, no repeats, no quiet hours delivery, friendly non-aggressive tone, value-first messaging
- **Referral Integration:** Link generation, milestone tracking, reward delivery notifications

**See:** `.openhands/knowledge/telegram-bot.md` for complete bot system specification.

### Bot Commands Architecture
Comprehensive command system for Telegram Bot interaction:
- **Command Categories:** Core (start, help, app, menu), Player (profile, stats, achievements), Museum (museum, artifacts, collections), Event (events, missions, leaderboard), Social (referral, invite, guild), Support (support, faq, feedback), Administrative (announce, mod, broadcast)
- **Command Architecture:** Command Layer (parsing), Routing Layer (handler resolution), Service Layer (business logic), Analytics Layer (usage tracking)
- **Command Routing:** Pattern matching, subcommand support, alias resolution, fallback handling
- **Permission System:** Guest (Level 0), Player (Level 2), Moderator (Level 3), Administrator (Level 4), System (Level 5)

**See:** `.openhands/knowledge/bot-commands-architecture.md` for complete command specification.

### Command Routing
Centralized routing system for bot command processing:
- **Routing Standards:** Command parsing (/command subcommand --flag value), exact match priority, alias resolution, fallback to /help
- **Subcommand Support:** /profile stats, /event list, /museum artifacts
- **Validation:** Command existence, permission level, argument types, rate limits
- **Error Handling:** Unknown commands (suggest similar), missing args (show usage), permission denied (explain access)

**See:** `.openhands/knowledge/bot-commands-architecture.md#command-routing-standards`

### Command Permissions
Role-based permission system for bot commands:
- **Permission Levels:** Guest (basic commands only), Player (authenticated), Moderator (view/warn/mute), Administrator (full access), System (automated)
- **Player Commands:** All standard player commands, guild access (if member), support tickets, social features
- **Moderator Commands:** /mod subcommands, user information view, warning/suspension, escalation
- **Administrator Commands:** /announce, /broadcast, /diagnose, user management, configuration changes

**See:** `.openhands/knowledge/bot-commands-architecture.md#permission-architecture`

### Mini App Command Integration
Bot commands as gateway to Mini App experience:
- **Mini App Launching:** /app opens Mini App, /app {screen} opens specific screen (museum, battle, events, profile)
- **Contextual Navigation:** Bot generates deep links with context (artifact ID, event ID), Mini App receives and renders appropriate screen
- **Deep Link Routing:** t.me/jolttimebot?start=screen_{name} for direct navigation, start_param carries routing context
- **Onboarding Integration:** /start triggers onboarding flow for new users, returning users directed to home with context

**See:** `.openhands/knowledge/bot-commands-architecture.md#mini-app-integration-standards`

### Command Analytics
Tracking and measurement for bot command performance:
- **Usage Analytics:** Command frequency, unique users per command, command sequences, session patterns
- **Success Metrics:** Success rate per command, average response time, failure categorization (user error, permission, service unavailable)
- **Conversion Tracking:** Command-to-Mini-App launch rate, Mini-App-to-registration rate, retention correlation
- **Engagement Impact:** Session frequency from bot, commands per session, return rate after command

**See:** `.openhands/knowledge/bot-commands-architecture.md#analytics-architecture`

### Push Notifications
Timely, relevant alerts that enhance player experience without becoming spam:
- **Daily Reminders:** 20+ hour inactive triggers, daily reward/energy/mission status, streak protection
- **Event Notifications:** Event start/end, seasonal announcements, historical festivals, community events
- **Progress Notifications:** Level ups, achievement unlocks, artifact discoveries, battle pass tier completion
- **Reward Notifications:** Expedition completions, arena season rewards, event rewards, referral bonuses
- **AdsGram Alerts:** Optional bonus opportunities, seasonal double-reward weekends, enhanced pack availability
- **Frequency Control:** Maximum 4/day, one per category per 12 hours, priority queue when at cap
- **Timing:** User timezone-aware, optimal engagement windows (10AM, 6PM), quiet hours bypass only for critical

**See:** `.openhands/knowledge/notifications.md` for complete notification specification.

### Reminder System
Friendly re-engagement system for inactive players with compassionate design:
- **Inactivity Tiers:** 20-24h (gentle), 24-48h (friendly), 3-7d (value), 7-14d (welcome back), 14-30d (grand return), 30+d (legendary)
- **Message Philosophy:** Always welcoming, never accusatory, focus on future not past, preserve benefits when possible
- **Comeback Rewards:** Small/medium/large chests based on absence, streak protection, XP multipliers (50-150%)
- **Welcome Back Packages:** Missed daily rewards, event rewards (free track), exclusive returner cosmetics
- **Never Do:** Threaten lost progress, guilt-trip about absence, use manipulative tactics, send excessive reminders

**See:** `.openhands/knowledge/telegram-bot.md` for complete reminder specification.

### Deep Links
Notification-borne links that open specific Mini App screens with context:
- **Link Formats:** `/start` (main), `/start ref_{id}` (referral), `/start event_{id}` (event), `/start profile/missions/museum/battle/shop` (screens), `/start guild_{id}` (guild)
- **Deep Link Processing:** Parse parameters, validate tokens, verify authentication, route to appropriate handler, pass context to Mini App
- **Notification Integration:** Every notification includes relevant deep link, inline keyboard buttons for one-tap navigation
- **Mini App Context:** Links pass parameters (ref, screen, event, guild) as URL query params for seamless routing

**See:** `.openhands/knowledge/telegram-bot.md` for complete deep link specification.

### Deep Link Ecosystem
Strategic platform capability for user acquisition, retention, and viral expansion:
- **Deep Link Categories:** Referral, Campaign, Event, Museum, Social Sharing, Re-engagement, Administrative
- **Architecture Layers:** Link Generation, Link Processing, Routing, Analytics
- **Link Processing:** URL parsing, parameter extraction, type resolution, context building
- **Routing Standards:** Pattern matching, route registry, fallback handling, invalid link handling
- **Security:** HMAC signatures, parameter validation, rate limiting, fraud prevention
- **Scalability:** Millions of links, billions of clicks, large campaign volumes

**See:** `.openhands/knowledge/deep-link-ecosystem.md` for complete ecosystem specification.

### Referral System Architecture
Comprehensive referral system as primary user acquisition engine:
- **Referral Categories:** User (friend invitations), Campaign (marketing), Guild (recruitment), Event (participation), Influencer (creator), Partner (affiliate)
- **Architecture Layers:** Referral Generation, Tracking, Attribution, Reward, Analytics
- **Referral Lifecycle:** Invitation creation → delivery → acquisition → validation → eligibility → distribution
- **Reward Tiers:** Signup (50 Dust), Tutorial (25 Dust), Level 5 (Capsule), Level 10 (Rare Capsule), Level 20 (Epic Capsule)
- **Fraud Prevention:** Duplicate detection, self-referral prevention, fake account detection, abuse monitoring

**See:** `.openhands/knowledge/referral-system-architecture.md` for complete referral specification.

### Referral Attribution
Determining referral ownership and reward assignment:
- **First-Touch Attribution:** Marketing/campaign effectiveness, stored at first click
- **Last-Touch Attribution:** Reward assignment, last click before signup
- **Attribution Window:** 7-day conversion window from click to signup
- **Attribution Validation:** Window check, duplicate detection, self-referral check, device fingerprint, behavioral analysis
- **Ownership Rules:** First valid click owns referral, locked after conversion, non-transferable

**See:** `.openhands/knowledge/referral-system-architecture.md#referral-attribution-standards`

### Referral Rewards
Reward structure for referral participants:
- **Inviter Rewards:** Signup (50 Dust), Tutorial (25 Dust), Level 5 (Common Capsule), Level 10 (Rare Capsule), Level 20 (Epic Capsule), Day 7 retention (+50% bonus)
- **Invited Player Rewards:** 100 Chrono Dust, 5 Time Shards, +50 Max Energy (7 days), 1 Free Common Capsule
- **Milestone Rewards:** 3/5/10/25/50/100 referrals unlock tier rewards (Capsules, badges, cosmetics, VIP titles)
- **Quality Bonuses:** High-quality referrals (top 25%) get +25% bonus; Exceptional (top 10%) get +50% bonus

**See:** `.openhands/knowledge/referral-system-architecture.md#reward-architecture`

### Referral Fraud Prevention
Multi-layered fraud detection and prevention:
- **Duplicate Detection:** Same Telegram ID, phone number, device fingerprint, IP range, timing patterns
- **Self-Referral Prevention:** Same device fingerprint, IP address, Telegram ID, geographic location, creation timing
- **Fake Account Detection:** Bot-like patterns, no Mini App activity, suspicious referral sources, rapid account creation
- **Abuse Monitoring:** Real-time detection, batch pattern analysis, user reports, community trust signals, automated responses

**See:** `.openhands/knowledge/referral-system-architecture.md#fraud-prevention-architecture`

### Referral Analytics
Comprehensive tracking and measurement:
- **Conversion Analytics:** CTR, signup conversion, activation rate, overall conversion, time to conversion
- **Quality Analytics:** Day 1/7/30 retention, session duration, sessions per week, progression speed
- **Efficiency Analytics:** Cost per referral (CPR), cost per activated user (CPA), revenue per referral, viral coefficient (K-factor)
- **Retention Analytics:** Cohort analysis by referral month/type/source, retention curves, quality tier analysis

**See:** `.openhands/knowledge/referral-system-architecture.md#analytics-architecture

### Campaign Architecture
Marketing-driven deep link system for user acquisition and re-engagement:
- **Campaign Types:** Marketing, Seasonal, Promotional, Influencer
- **Seasonal Campaigns:** Christmas, Summer, Halloween, Anniversary, Lunar New Year
- **Promotional Codes:** One-time, Limited, Unlimited, Exclusive variants
- **Influencer Tracking:** Per-handle performance, conversion quality, payout tracking
- **AdsGram Integration:** Monetization campaigns, reward campaigns, acquisition tracking, conversion attribution

**See:** `.openhands/knowledge/deep-link-ecosystem.md#campaign-deep-link-architecture`

### Deep Link Analytics
Comprehensive tracking and measurement system for deep link performance:
- **Link Creation Analytics:** Type, creator, parameters, campaign, timestamp
- **Link Usage Analytics:** Clicks, users, platform, device, location
- **Conversion Funnel:** Click → Open → Signup → Tutorial → First Mission → Retention
- **Campaign Metrics:** CPA, ROI, quality score, cohort analysis
- **A/B Testing:** Link format, landing page, reward structure, copy variations

**See:** `.openhands/knowledge/deep-link-ecosystem.md#analytics-architecture`

### Growth Link Standards
Standards for deep links as primary growth channel:
- **Viral Expansion:** Achievement sharing, collection showcases, referral rewards, leaderboard ranks
- **User Journey:** First-time (context-aware onboarding), Returning (resume/context), Referred (enhanced bonus), Campaign (goal tracking)
- **Future Expansions:** AI experiences, Creator economy, Web3 campaigns, NFT campaigns, Esports tournaments
- **Long-term Philosophy:** Growth engine, viral coefficient > 1.0, CAC reduction, engagement optimization

**See:** `.openhands/knowledge/deep-link-ecosystem.md#long-term-philosophy`

### Artifacts System
The heart of Jolt Time - historical artifact collection:
- 6 rarity tiers (Common to Mythic) with distinct colors, drop rates, visual effects, and multipliers
- 10 historical eras (Prehistoric to Modern Era) spanning 10,000+ years of history
- 8 artifact categories (Weapons, Documents, Jewelry, Ancient Tools, Relics, Military Objects, Royal Objects, Scientific Artifacts)
- Artifact progression system: Level 1-100 cap, stats scale with level (2% per level), Mythic artifacts evolve visually at levels 25/50/75/100
- Collection percentage tracking with milestone rewards
- Museum display mechanics
- Full artifact data structure: id, name, description, era, civilization, rarity, power, luck, knowledge, level, experience, image_url, is_discovered, is_equipped, created_at

**See:** `.openhands/knowledge/artifact-system.md` for complete artifact specification.

### Artifact Evolution System
Deep progression mechanics for collected artifacts:
- **Artifact Levels:** Level 1-70 (by rarity), 2% stat increase per level, XP from battles/expeditions, level milestones unlock visual upgrades
- **Artifact Evolution:** Rarity progression (Common→Uncommon→Rare→Epic→Legendary→Mythic), requires duplicates + resources, 100% power increase per tier, permanent upgrades
- **Artifact Fusion:** Combine two same-type artifacts for specialized variants, trait inheritance (up to 2 traits), stat optimization, set completion flexibility
- **Visual Progression:** Glow intensity, particle effects, animated borders, aura effects, prestige visuals (Golden, Prismatic, Chrono), cosmetic only
- **Artifact Traits:** Passive bonuses (Ancient Wisdom, Battle Spirit, Explorer Bonus, Museum Value, Lucky Charm), innate + acquired, no P2W advantages
- **Special Variants:** Golden (rarity mastery), Event Edition (limited events), Anniversary Edition (annual), Founder Edition (pre-launch)
- **Resource Economy:** Chrono Coins, Time Shards, fragments, Mythic Essence, balanced costs preventing excessive grinding
- **Collection Philosophy:** Short/medium/long-term goals, anti-frustration measures, no pay-to-win, progression pacing over months
- **Statistics Tracking:** Total upgrades, levels gained, highest level, evolutions, fusions, traits, variants
- **Telegram Notifications:** Evolution success, legendary upgrades, rare fusions, visual unlocks, max 4/day, anti-spam
- **AdsGram Optional:** XP boost, fragment bonus, evolution discounts, level skip — never mandatory, purely convenience

**See:** `.openhands/knowledge/artifact-evolution.md` for complete artifact evolution specification.

### Inventory System
Player-facing artifact management system:
- Artifact storage with virtualized grid/list view for 1000+ items
- 6 sorting methods: By Rarity, By Era, By Power, By Level, By Newest, By Oldest
- 5 filter types: Era (multi-select), Civilization (multi-select), Category (multi-select), Rarity (multi-select), Level Range (slider)
- Real-time search with 300ms debounce, partial match, case-insensitive
- Favorites system: max 20 artifacts, star/unstar, dedicated view
- Equipped artifacts: up to 5 slots, equipped badge, filter view
- Quick actions: View Details, Favorite, Share, View in Museum, Equip/Unequip
- Duplicate management: auto-convert to fragments, count badge, conversion notification
- Capacity: 100 initial slots, 1000 max, expansion via gameplay rewards/premium/achievements

**See:** `.openhands/knowledge/inventory-system.md` for complete inventory specification.

### Collection System
Tracks player progress across all artifacts:
- Total collection completion: percentage and count (e.g., 67/82 = 82%)
- Era completion: 9 eras tracked individually with percentages
- Rarity completion: 6 rarity tiers tracked individually
- Category completion: 8 artifact categories tracked individually
- Set completion: multiple artifact sets per era with bonus previews
- Milestone rewards: 25% → 200 Dust + Bronze Badge, 50% → 500 Dust + Silver Frame, 75% → 1,000 Dust + Gold Frame, 100% → 5,000 Dust + Chrono Aura + Mythic Artifact
- Era/Rarity/Category-specific completion rewards

**See:** `.openhands/knowledge/inventory-system.md` for complete collection specification.

### Museum System
Personal museum featuring historical wings and educational exhibits:
- **Personal Museum:** Player's own museum displaying collected artifacts, completed collections, favorite exhibits, curator level
- **Historical Wings:** 6 wings (Egypt, Greece, Rome, Viking, Medieval, Renaissance) unlocking by player level progression, unique atmosphere per era
- **Artifact Donations:** Permanently donate artifacts for museum score (+10-500 by rarity), XP, collection completion — irreversible but rewarding
- **Collection Sets:** Era-themed artifact sets (Rosetta Stone, Pharaoh's Mask, etc.) with completion rewards (badges, frames, titles)
- **Museum Levels:** Curator progression from Novice to Legendary (Level 1-30+), unlocking rooms, decorations, visual upgrades, cosmetics
- **Museum Prestige:** Cosmetic-only prestige system at Level 30+, resets display for Chrono/Prismatic decorations — purely visual
- **Museum Statistics:** Exhibits, level, score, collections, rare artifacts, donation counts, streaks — comprehensive tracking
- **Museum Leaderboards:** Rankings for level, collection completion, rare count, score — weekly and all-time tracking
- **Visitor System (Future):** Friends visiting museums, likes/reactions, popularity rankings — documented for future expansion
- **Educational Focus:** Every exhibit teaches real history with authentic facts, significance, current location, related topics
- **Telegram Notifications:** Collection completion, level ups, rare donations, wing unlocks — max 4/day, anti-spam
- **AdsGram Optional:** Exhibit XP boost, collection hints, score bonus — never mandatory, purely convenience

**See:** `.openhands/knowledge/museum-system.md` for complete museum specification.

### Prestige System
Rewards long-term dedication and collection mastery:
- Prestige score calculated from: Museum Collections (+25-100/era), Completed Eras (+50/era), Mythic Artifacts (+500/each), Legendary Artifacts (+100/each), Epic Artifacts (+25/each), Achievements (+5-500 each)
- 10 prestige levels: Novice Collector (0) → Master of Time (100,000)
- Prestige benefits: profile borders (Bronze→Silver→Gold→Platinum→Prismatic), inventory slots (+10 to +100), Chrono Aura at max level
- Enter Prestige after Level 100 with 50%+ collection, preserves all progress except level

**See:** `.openhands/knowledge/inventory-system.md` for complete prestige specification.

### Player Profile System
Central hub for player identity and progression showcase:
- **Profile Display:** Avatar, nickname, Telegram username, level, title, join date, favorite artifact, collection %
- **Profile Tabs:** Profile, Stats, Cosmetics, Badges
- **Favorite Artifact:** Select any owned artifact to display publicly, change anytime
- **Visibility Controls:** Public, Friends Only, Private options
- **Share Profile:** Generate shareable profile card via Telegram

**See:** `.openhands/knowledge/player-profile.md` for complete profile specification.

### Account Level System
Progression from Level 1 to Level 100:
- **XP Curve:** Formula `base_xp * (level ^ 1.5)` for escalating requirements
- **XP Sources:** Battles (25-100), quests (100-750), achievements (200-5000), collection (10-50), events (200-1000)
- **Level Rewards:** Chrono Dust every 5 levels, cosmetic badges at 10/25/50/75, frames at 50/75/100
- **Unlocks:** New eras, features, and content gated by level milestones

**See:** `.openhands/knowledge/player-profile.md` for complete level system specification.

### Story Mode and Narrative System
Story Mode is the narrative heart of Jolt Time, transforming artifact collection into an epic journey through human history. Players become Time Explorers investigating temporal anomalies and protecting history's integrity.

**Main Lore:**
- **Jolt Time:** A hidden network of temporal waypoints across history, protected by the Jolt Archive
- **Temporal Anomalies:** Fractures in reality appearing throughout history, expelling artifacts from their native eras
- **First Disturbance:** Cataclysmic future event whose ripple effects cascade backward through time
- **Time Explorers:** Players recruited by the Archive to investigate anomalies and recover artifacts

**Main Factions:**
- **Jolt Archive** — "History is humanity's greatest treasure" — Primary ally, focuses on preservation and knowledge
- **Time Keepers** — "If history changes, humanity suffers" — Vigilantes protecting timeline integrity
- **Lost Historians** — "Every story deserves to be told" — Scholars stranded across time, chronicling history
- **Chrono Raiders** — "Time is the ultimate commodity" — Antagonists stealing and selling artifacts

**Story Chapters:**
- **Chapter 1: The First Disturbance** — Introduction to Jolt Time, first expedition to Mesopotamia
- **Chapter 2: Ancient Echoes** — Investigation deepens, journey to Ancient Egypt, first major confrontation
- **Chapter 3: Rise of the Chrono Raiders** — Full Raider threat revealed, Classical Greece and Rome
- **Chapter 4: Secrets of the Timeline** — Chronoscope fragments gathered, First Disturbance truth emerges
- **Future Chapters:** Structure documented for easy expansion (Chapters 5-8 outlined)

**Story Missions:**
- Expeditions (time-limited era journeys)
- Artifact recoveries (find and return displaced artifacts)
- Historical investigations (research clues, puzzle-solving)
- Boss encounters (multi-phase strategic battles)

**Historical Characters:**
- Guide characters (mysterious Archive recruiter, Curator Mira as mentor)
- Faction allies (Lost Historian Scribe Emeka, Time Keeper Sevris)
- Antagonists (Captain Vex, The Clockmaker, The Collector)
- Historical figure echoes (respectful appearances in context)

**Story Rewards (Cosmetic Only, Non P2W):**
- Titles: "Time Initiate", "Echo Seeker", "Chrono Striker", "Timeline Guardian"
- Profile Frames: Bronze temporal, Silver anomaly, Gold clockwork, Platinum chronoscope
- Museum Decorations: Chapter-themed displays
- Badges and achievements for completion

**Story Statistics:**
- Chapters completed, missions completed, progress percentage
- Favorite chapter, lore entries discovered, historical facts learned

**Lore Library:**
- "Archive Vault" in-game name, accessible from main menu
- Categories: Chapter Lore, Character Profiles, Era Knowledge, World Lore
- Features: Reading progress, search, optional audio narration

**Telegram Notifications:**
- Maximum 2 story notifications per week
- Triggers: New chapter release, major mission complete, important discoveries
- User controls: Enable/disable, frequency settings, quiet hours

**Narrative Philosophy:**
- Inspire curiosity about history
- Celebrate human achievement across all eras
- Encourage exploration and discovery
- Create emotional attachment to the world
- Mysterious but optimistic tone

**Lore Bible Authority:**
- All narrative content must comply with the Lore Bible
- Story Mode and Narrative System align with established universe canon
- Historical accuracy and educational value are primary concerns
- Character and faction details must remain consistent

**See:** `.openhands/knowledge/lore-bible.md` for the complete Lore Bible (single source of truth for all narrative decisions).

**Future Features (Documented Only):**
- Branching storylines with meaningful choices
- Faction reputation system
- Player choices with permanent consequences
- World-changing events based on collective action

**See:** `.openhands/knowledge/story-mode.md` for complete story mode specification.

### Boss Battle System
Boss Battles are the most challenging encounters in Jolt Time—epic confrontations that punctuate the player's journey through history. Bosses are never historical figures from real history, but rather temporal threats, corrupted artifacts, and faction antagonists.

**Boss Categories:**
- **Story Bosses** — Primary antagonists of each chapter, appear at key narrative moments
- **Era Bosses** — Guard the depths of each historical era with era-themed mechanics
- **Expedition Bosses** — Available during time-limited expedition events with enhanced rewards
- **Event Bosses** — Seasonal and special event bosses with unique mechanics
- **World Bosses** — Community-wide challenges (future feature, documented only)

**Elite Enemy Types:**
- **Chrono Raiders** — Criminal operatives exploiting temporal anomalies (Scout, Brute, Sapper, Tech, Captain variants)
- **Timeline Corruptors** — Entities born from temporal anomalies (Fracture Leech, Paradox Wisp, Time Scar, Echo Stalker)
- **Temporal Guardians** — Ancient protectors corrupted by temporal energy (Sentinel of Ages, Era Wardens, Keeper Remnants)
- **Lost Collectors** — Independent artifact collectors with neutral-to-hostile intentions

**Boss Difficulty Levels:**
- **Normal** — Accessible to casual players, clear patterns, 3-5 minute encounters
- **Elite** — Faster patterns, additional mechanics, 5-8 minute encounters, requires 75% recommended power
- **Legendary** — Aggressive patterns, complex multi-phase, 8-15 minute encounters, requires 100% power

**Historical Encounter Philosophy:**
- Real historical figures are NEVER villains (appear as allies/guides/echoes only)
- Bosses focus on temporal phenomena, corrupted artifacts, and faction antagonists
- No real figures portrayed disrespectfully
- Timeline anomalies are neutral threats, not evil forces

**Boss Rewards (Cosmetic Only, Non P2W):**
- Titles (Legendary completion): "Shadowslayer", "Titanbreaker"
- Profile Frames (Elite/Legendary): Boss-themed borders
- Badges: Defeat badges per boss
- Museum Decorations: Boss-themed trophies
- Rare Artifacts: Boss-specific drops with lore
- Lore Entries: Origin and context revealed on defeat

**Boss Statistics:**
- Total bosses defeated, by difficulty, attempts per boss
- Fastest/average victory times, damage dealt/taken
- Favorite boss, completion percentages
- Unique cosmetics and lore entries collected

**Story Integration:**
- Chapter bosses appear at narrative climaxes
- Era bosses conclude each historical era
- Boss encounters tied to major revelations and milestones

**Replay Philosophy:**
- First victory grants story progression and full rewards
- Repeat victories grant reduced rewards (20% of first clear)
- Daily/weekly caps on boss rewards
- Leaderboard competition for speed/damage records

**Telegram Notifications:**
- Maximum 2 boss notifications per week
- Triggers: New boss available, achievements, event warnings
- User controls for enable/disable, filters, quiet hours

**Future Features (Documented Only):**
- Raid bosses (multi-phase, 8-16 players)
- Guild world bosses (coordinated guild combat)
- Cooperative encounters (multiplayer infrastructure)
- Seasonal bosses (limited-time events)
- Mythical timeline bosses (post-story ultimate challenges)

**See:** `.openhands/knowledge/boss-battles.md` for complete boss battle specification.

### Battle Pass and Seasonal Progression System
The Battle Pass provides structured seasonal goals with 10-week seasons, dual reward tracks, and meaningful progression milestones while respecting player time.

**Battle Pass Structure:**
- **Free Track:** Available to all players, provides essential progression rewards (currency, fragments, boosters)
- **Premium Track:** Requires one-time purchase per season ($4.99-$9.99), unlocks exclusive cosmetic rewards
- **Shared Progression:** Both tracks share the same XP bar and level progression (50 levels per season)
- **Season Duration:** 10 weeks (70 days) — enough for casual players, urgent without pressure

**Seasonal Progression:**
- Each season has a distinct historical theme (Age of Egypt, Roman Chronicles, Viking Horizons, Renaissance Awakening)
- 50 levels total per season with increasing XP requirements
- Season events (3-4 major) provide bonus XP and limited-time rewards
- Legacy system: Past season cosmetics become permanent "Legacy" items

**XP Sources (Natural Progression):**
- Daily missions (50-200 XP), Weekly missions (200-500 XP)
- Battle victories (25-100 XP), Boss defeats (100-500 XP)
- Artifact collection (10-50 XP), Story chapter completion (500-1000 XP)
- Events provide catch-up XP, not required grinding

**Reward Types:**
- Free Track: Chrono Coins, Time Shards, Fragments, Boosters
- Premium Track: Cosmetic-only (skins, frames, badges, emotes, museum decorations)
- **Critical:** Premium never provides combat advantages, only visual prestige

**Anti-FOMO Philosophy:**
- Casual players (1-2 hrs/day) reach 70-80% of rewards naturally
- No daily login requirements to stay competitive
- Events provide catch-up without excessive grinding
- Legacy items remain forever — no permanently lost content

**Season Archive:**
- Players access past seasons to view earned rewards
- Legacy items (past premium items) remain usable
- Future legacy rewards possible for dedicated players

**AdsGram Integration:**
- Optional rewards: Bonus XP, progression boosts, additional daily progress
- Never required for season access or rewards
- Maximum 3 rewarded ads per week, clearly labeled optional

**Future Features (Documented Only):**
- Elite Battle Pass (higher tier premium tier)
- Legacy season rewards (multi-season achievements)
- Collaborative season events (community-wide)
- Guild season challenges (guild competition)

**See:** `.openhands/knowledge/battle-pass.md` for complete Battle Pass specification.

### Guild System
The Guild System transforms Jolt Time into a community experience with shared goals, cooperative missions, and seasonal guild wars.

**Guild Creation:**
- Requires Level 10+, 500 Chrono Coins, unique name
- Member limits scale with guild level (10→100)
- Public (searchable) or Private (invite-only) options

**Guild Roles & Permissions:**
- **Leader:** Full control (kick, promote, disband, transfer)
- **Officer:** Invite members, manage missions, coordinate wars
- **Member:** Participate in missions, donate, chat

**Guild Progression:**
- Guild XP earned through member activity (level ups, missions, wars)
- Levels 1-7 with increasing member limits (10→100)
- **Cosmetic rewards only:** Banners, emblems, trophies, badges, frames

**Guild Missions:**
- Daily missions (3/day), Weekly missions (5/week), Seasonal missions (10/season)
- Categories: Battle, Collection, Activity, Progression
- Shared progress across all guild members

**Guild Wars:**
- Seasonal format (4-week seasons aligned with Battle Pass)
- Matchmaking by guild level and season points (fair, no P2W)
- Minimum 50% member participation required
- Rewards: Trophies, frames, badges, coins (cosmetic-only)

**Guild Leaderboards:**
- Categories: Guild Level, Total XP, Season Points, War Win Rate
- Weekly and seasonal rankings
- Filters: All, Season, War

**Guild History:**
- Member roster and former leaders
- Achievement timeline and war history
- Milestone records

**Community Philosophy:**
- Promotes teamwork and healthy competition
- No mandatory time commitments
- Rewards participation over victory
- Casual players welcome, no exclusion by power level

**Future Features (Documented Only):**
- Guild Raids (cooperative PvE encounters)
- Guild Museums (shared achievement display)
- Guild Chat (in-game communication)
- Guild Alliances (inter-guild cooperation)
- Cooperative Expeditions (guild-wide events)

**See:** `.openhands/knowledge/guild-system.md` for complete guild specification.

### PvP Arena and Ranked League System
The PvP Arena brings competitive gameplay to Jolt Time, offering players opportunities to test skills, strategies, and collections against others.

**PvP Modes:**
- **Casual Arena:** Relaxed play, no ranking consequences, quick matches
- **Ranked Arena:** Competitive matches affecting league ranking, best-of-3 format
- **Seasonal Competitions:** Limited-time events with unique rewards
- **Practice Mode:** Offline AI practice (future feature)

**League Structure (7 Tiers):**
- Bronze → Silver → Gold → Platinum → Diamond → Master → Chrono Legend
- Each tier has 3 divisions (I, II, III)
- Points-based progression (win +15-25, loss -15)
- Demotion protection within divisions

**Matchmaking Philosophy:**
- Matches players by rank points, recent performance, win rate
- Skill over spending—artifact power is one factor, not dominant
- New players protected from smurfing
- Fair matches prioritized over quick finds

**Seasonal Rankings:**
- 10-week seasons (aligned with Battle Pass)
- End-of-season rewards based on final rank
- Top 100 get placement matches for new season

**PvP Rewards (Cosmetic-Only for Competitive):**
- Ranked: Coins, XP, Season Tokens per match
- Weekly: Bonus coins and fragments for participation
- Seasonal: Badges, frames, titles based on league
- **No pay-to-win:** All competitive advantages from skill, not purchases

**Casual Player Support:**
- 10-match daily cap for full rewards
- Demotion protection, no mandatory daily play
- Casual mode available for pressure-free fun
- Rewards accumulate over time without grinding

**Anti-Toxicity:**
- Sportsmanship endorsements and rewards
- Progressive penalties for reports (warning → ban → permanent)
- Chat filtering and spam detection
- Fair play enforcement and cheat detection

**Future Features (Documented Only):**
- Practice Mode (offline AI)
- Battle History (match records)
- Replay System (watch recorded matches)
- Spectator Mode (watch live matches)
- World Championships, Esports Events, Guild Tournaments

**See:** `.openhands/knowledge/pvp-system.md` for complete PvP specification.

### Tournament and Championship System
The Tournament System creates a layered competitive ecosystem from daily events to legendary championships.

**Tournament Categories:**
- **Daily Tournaments** — Single elimination, quick (30-60 min), free entry with daily ticket
- **Weekly Tournaments** — Double elimination, weekend events, better rewards
- **Seasonal Championships** — Group stage + knockout, top 100 qualify, premium rewards
- **Community Tournaments** — Player-organized events (8-512+ participants)
- **Invitational Events** — Elite competitions for top-ranked players (Chrono Legends, Master Masters)

**Tournament Formats:**
- Single Elimination (one loss = out) — Daily tournaments
- Double Elimination (two losses = out) — Weekly tournaments
- Group Stage + Knockout — Seasonal championships
- League Format (round-robin) — Future/esports

**Entry Philosophy:**
- Entry pathways: Normal participation, seasonal qualification, ranking requirements
- No pay-to-enter (always free)
- Fair brackets based on ranking
- Anti-abuse: smurf detection, account linking

**Championship Titles:**
- Arena Champion, Daily Victor, Weekly Champion
- Seasonal Legend, Chrono Master, Grand Historian
- Time Conqueror (10 championship wins), Chrono Legend (invitational wins)

**Tournament Rewards (Cosmetic-Only):**
- Badges (unique per tournament), Profile frames, Animated effects
- Chrono Coins, Fragments, Tournament Tickets
- Titles: "[Season] Champion", "Time Conqueror", etc.

**Seasonal Championships:**
- Qualification Phase: Top 100 seasonal rankings qualify
- Finals Phase: Top 32 → Quarterfinals → Semifinals → Finals
- Regional competitions (future)

**Spectator Features (Future):**
- Live Viewing (in-game spectator mode)
- Battle Replays (recorded match playback)
- Match History (comprehensive records)

**Community Philosophy:**
- Sportsmanship first, fair competition
- Multiple paths to glory (daily grinders, casuals, skilled players)
- Anti-toxicity: progressive penalties, fair play enforcement

**Future Features (Documented Only):**
- World Championships (annual global tournament)
- Esports Support (professional competitive circuit)
- Creator Tournaments (influencer-hosted events)
- Guild Championships (guild-vs-guild events)

**See:** `.openhands/knowledge/tournaments.md` for complete tournament specification.

### Statistics System
Comprehensive lifetime player tracking:
- **Play Time:** Total hours, average per day, most active period
- **Battles:** Won/lost/win rate, best streak, weekly count
- **Collection:** Total artifacts, by rarity, by era, completion %
- **Quests:** Daily/weekly completed, total
- **Economy:** Dust earned/spent, shards earned
- **Streaks:** Current, longest, total login days
- **Privacy:** Full stats visible to player only; others see simplified view

**See:** `.openhands/knowledge/player-profile.md` for complete statistics specification.

### Cosmetics and Badges System
Purely cosmetic profile customization:
- **Profile Frames:** Bronze (L10), Silver (L25), Gold (L50), Platinum (L75), Prismatic (L100)
- **Animated Borders:** Fire, Water, Electric, Chrono effects from events/prestige
- **Backgrounds:** Era-themed and abstract patterns from season pass/events
- **Auras:** Chrono Glow, Golden, Prismatic unlocked via prestige milestones
- **Badge Showcase:** 3 slots unlocked at 10/30/50 achievements
- **Anti-P2W:** All cosmetics purely visual, no gameplay advantages

**See:** `.openhands/knowledge/player-profile.md` for complete cosmetics specification.

### Leaderboards and Rankings
Comprehensive ranking and competitive systems:
- **Global Leaderboards:** All-time rankings for level, artifact collection, achievement score, museum contribution, and battle victories (never reset)
- **Seasonal Leaderboards:** 12-week seasonal competitions tracking seasonal XP, battles, quests, and event participation
- **Regional Rankings:** Global, country-specific, and friends-only leaderboard views
- **Weekly Challenges:** Short-term goals reset every Monday (Battle Champion, Quest Master, Artifact Hunter, etc.)
- **Competitive Philosophy:** Encourages participation, rewards effort, avoids toxicity, supports casual players
- **Anti-Abuse Rules:** Server-side validation, exploit detection, suspicious activity review, leaderboard integrity enforcement
- **Telegram Notifications:** Rank promotions, season endings, leaderboard rewards — maximum 4 notifications per day

**See:** `.openhands/knowledge/leaderboards.md` for complete leaderboard and ranking specification.

### Arena Ranks
Competitive PvP ranking system with cosmetic recognition:
- **Ranks:** Bronze → Silver → Gold → Platinum → Diamond → Master → Grandmaster → Time Legend (each with V, IV, III, II, I subdivisions)
- **Rating Range:** 0 (Bronze) to 7000+ (Time Legend)
- **Seasonal Soft Reset:** End of season rating reduced by 15%
- **Rewards:** Rank-specific profile frames, badges, titles, and currency rewards (all cosmetic or minor currency only)
- **Fair Matchmaking:** Rating-based matching within ±200 rating range

**See:** `.openhands/knowledge/pvp-arena.md` for complete arena rank specification.

### PvP Arena System
Comprehensive competitive battle system:
- **Battle Modes:** Casual (practice), Ranked (rating), Seasonal Arena (limited-time events), Special Event Arena (themed competitions)
- **Matchmaking:** Rating-based (±200 range), account level, recent performance, with 60s expansion
- **Rank Promotion:** Rating thresholds + promotional series (best of 3-5), 200-point demotion buffer
- **Arena Streaks:** Win streak bonuses (+10% to +150% coins), streak protection, best streak records
- **Arena Statistics:** Total wins/losses, win rate, peak rating, seasonal records, match history
- **Anti-Abuse:** Server-side validation, behavioral analysis, exploit prevention, suspicious activity review
- **Spectator (Future):** Replay system, battle history, friend spectating planned

**See:** `.openhands/knowledge/pvp-arena.md` for complete PvP Arena specification.

### Seasonal Competitions
Time-limited competitive events driving engagement:
- **Season Duration:** 12 weeks (4 seasons per year: Spring, Summer, Autumn, Winter themed)
- **Season Transition:** 3-day grace period with double rewards, fresh leaderboards, new cosmetics
- **Seasonal Rewards:** Profile frames, badges, titles, cosmetics, and currency — distributed across all participation levels
- **Seasonal Reset Rules:** Seasonal scores zero, permanent scores preserved
- **Hall of Fame Integration:** Season winners permanently enshrined

**See:** `.openhands/knowledge/leaderboards.md` for complete seasonal competition specification.

### Battle Pass System
Seasonal progression system rewarding engagement:
- **Season Duration:** 30 days per season, 12 seasons per year
- **Progression Levels:** 50 levels (10 bonus levels for premium)
- **XP Sources:** Daily quests (25-50 XP), weekly quests (100-200 XP), battles (10-20 XP), events (50-100 XP)
- **Free Track:** Season frames (Bronze/Silver/Gold), Chrono Coins (~10,000), Chrono Dust (~200), Event Tokens (~1,500)
- **Premium Pass (99 Jolt Crystals):** Animated frames, auras, backgrounds, exclusive titles — cosmetic only, no combat advantages
- **Catch-Up Mechanics:** 2x XP weekends, event boosts, grace period for new players, miss-day forgiveness
- **Bonus Levels:** 10 additional levels (51-60) for premium holders with repeatable rewards
- **Season Themes:** Each season has unique theme (Egyptian Gold, Viking, Roman Empire, Renaissance) influencing cosmetics and events
- **Season Archive:** Past seasons preserved with rewards, top finishers, and theme history

**See:** `.openhands/knowledge/battle-pass.md` for complete Battle Pass specification.

### Hall of Fame System
Permanent records of legendary achievements:
- **Categories:** Season Winners, Event Champions, Top Collectors, Museum Masters, Battle Legends, Achievement Hunters
- **Display:** Portrait + stats for champions, milestone-based entries for collectors
- **Permanent Records:** Hall of Fame data never resets
- **Privacy:** Players can opt out of public Hall of Fame display
- **Anti-Fraud:** Subject to same anti-abuse rules as all competitive systems

**See:** `.openhands/knowledge/leaderboards.md` for complete Hall of Fame specification.

### Gacha System (Pack Opening)
Artifact acquisition through pack opening:
- 7 pack types: Basic (free/50 dust), Ancient (100 dust, era-specific), Premium (150 dust), Legendary (500 dust), Event (free/event currency), Seasonal (pass/200 dust), Mystery (75 dust)
- Drop rates by pack: Basic (Common 85%, Uncommon 15%) → Legendary (Rare 50%, Epic 35%, Legendary 13%, Mythic 2%)
- Pity system: 10 opens → Uncommon+, 25 opens → Rare+, 50 opens → Epic+, 100 opens → Legendary, 500 opens → Mythic
- Pity shared across non-event packs, never resets unfairly
- First-open bonuses: Welcome bundle (3 free packs + guaranteed Rare + 200 dust), beginner pity (10 → Uncommon+, 20 → Rare+)
- Daily free pack: 24-hour timer, streak bonuses at days 3/7/14/30, grace period protection
- Opening animations scaled by rarity (2s Common → 5s Mythic), with particle effects, sounds, and screen flashes
- Duplicate protection: auto-convert to fragments, Mythic duplicates give special rewards (500 dust + Legendary Pack)

**See:** `.openhands/knowledge/gacha-system.md` for complete gacha specification.

### Pack Economy
Fair progression economy ensuring no pay-to-win:
- All artifacts obtainable through gameplay (free daily pack, AdsGram ads, quest rewards, events)
- Optional purchases are cosmetic/convenience only (Season Pass, cosmetic bundles, ad-free subscription)
- Chrono Dust earned through gameplay, not purchased with real money (except optional bundles)
- Drop rates always visible before opening; pity progress always shown
- Free player progression: ~2-4 packs/day, complete Common/Uncommon in 2-4 weeks, Rare in 2-4 months
- Premium currency (Time Shards) for cosmetics only; no direct artifact purchases

**See:** `.openhands/knowledge/gacha-system.md` for complete economy specification.

### AdsGram Reward System
Primary revenue model via Telegram AdsGram SDK:
- Rewarded video ads: player-initiated, 5/day max, earn packs/currency/boosters, 1-hour cooldown between ads
- Interstitial ads: automatic at natural breaks, 1 per 3 minutes, skip after 5 seconds, no gameplay interruption
- Enhanced daily pack ad: 1/day, upgrades Basic Pack to Rare Pack equivalent
- Event bonus ads: 1/day during events, upgrades Event Pack to include Epic guarantee
- Reward preview always shown before ad; player choice to watch or continue free
- Never mandatory for gameplay progression; ads always feel optional

**See:** `.openhands/knowledge/adsgram.md` for complete AdsGram specification.

### Quest System
Structured objectives driving player engagement:
- 6 quest categories: Main Story, Daily, Weekly, Achievement, Event, Era
- 4 difficulty tiers: Easy, Medium, Hard, Legendary
- Reward types: Coins, Energy, Fragments, XP, Premium Currency, Event Tokens
- Daily streak system with bonus multipliers
- Push notifications via Telegram bot (max 4/day)
- Optional AdsGram integration (never forced)

**Connected Systems:**
- Battles: Win tracking, PvP milestones, era-specific battles
- Artifact Collection: New artifact detection, set completion, power thresholds
- Events: Seasonal quests, collaboration missions, limited-time objectives

**See:** `knowledge/quests.md` for detailed quest design.

### Energy System
Comprehensive energy and resource pacing system:
- **Main Energy:** Maximum 100 (base), regenerates 1 per 3 minutes, level-based increases up to 260
- **Arena Tickets:** 5 max, regenerates daily at midnight UTC
- **Expedition Keys:** 3 max, regenerates 1 per 8 hours
- **Event Tokens:** Season-specific, 500 max, earned through events
- **Level Scaling:** Energy capacity increases from 100 (Lv.1) to 260 (Lv.100)
- **Offline Progress:** Energy continues regenerating, capped at 2x normal gain
- **Overflow Protection:** Resources cap at maximum, no waste of earned rewards
- **AdsGram Optional:** Bonus energy from ads, never mandatory

**Connected Systems:**
- Quests: Quest rewards include energy restoration
- Battles: Energy gate for all battle types
- Artifact Progression: Fragments from rewards upgrade artifacts

**See:** `.openhands/knowledge/energy-system.md` for complete energy system specification.

### Timers and Cooldowns
Activity pacing through strategic cooldown design:
- **PvP Arena Cooldowns:** 30s after win, 10s after loss, 5-minute break after 5 consecutive losses
- **Expedition Timers:** Short (30 min), Long (2 hours), Special (4 hours), Boss (24 hours)
- **Weekly Boss Cooldowns:** Era Boss (7 days), World Boss (3 days), Challenge Boss (24 hours)
- **Cooldown Reduction:** Premium subscription (-20%), AdsGram ads (-50% next cooldown)
- **Seasonal Soft Reset:** Arena rating reduced 15% at season end
- **Daily Limits:** 10 free PvP battles, unlimited story battles, 20 event battles
- **Weekly Caps:** Competitive points (10,000), fragments from battles (500)

**See:** `.openhands/knowledge/energy-system.md` for complete timer and cooldown specification.

### Activity Limits
Healthy engagement caps promoting balanced gameplay:
- **Daily Battle Limits:** PvP (10 free), Story (unlimited, energy-gated), Event (20)
- **Session Guidelines:** Quick (5-15 min), Standard (15-30 min), Extended (30-60 min), Weekend (60-120 min)
- **Anti-Addiction Measures:** No forced break timers, no streak threats, no loss aversion messaging
- **Weekly Caps:** Prevents excessive grinding, maintains collection pacing
- **Overflow Prevention:** Resources queue or convert at cap, never lost
- **Offline Rewards:** Accumulated while away, claimed on return

**See:** `.openhands/knowledge/energy-system.md` for complete activity limits specification.

### Museum and Encyclopedia System
Signature educational feature combining collection with history education:
- 7 era sections: Ancient World, Classical, Middle Ages, Renaissance, Industrial, Modern, Future Archive
- 165+ museum entries with historical context, facts, and significance
- Completion tracking with milestone rewards (25%, 50%, 75%, 100%)
- Encyclopedia search by era, country, civilization, rarity, type
- Favorites system (max 20 artifacts)
- Future: audio narration, video content, premium themes

**Connected Systems:**
- Artifacts: Every collected artifact unlocks museum entry
- Quests: Museum visit quests and collection milestones
- Rewards: Completion bonuses and era-specific rewards
- Progression: 75% completion unlocks Future Archive

**See:** `knowledge/museum.md` for detailed museum design.

### Social System
Community features leveraging Telegram's native social ecosystem:
- **Friends System:** Add/remove friends (100 max), view profiles, view favorite artifacts, online status
- **Friends Activity Feed:** Level ups, new artifacts, achievements, museum milestones, event participation
- **Friend Bonuses:** Daily gifts (10-50 coins), collection bonuses, streak bonuses — small and fair
- **Referral System:** Personal invite links, milestone rewards (cosmetic only), anti-abuse protection
- **Founder Program:** Legendary Founder badge, exclusive frame, "Founder" title for early players
- **Gift System:** Daily limits (5 coin/3 energy per friend), abuse protection, cosmetic gifts
- **Social Achievements:** First Friend, Popular, Community Builder, Time Ambassador
- **Telegram Bot Integration:** Friend requests, gifts, referral rewards, community events
- **Leaderboards:** Level, Collection, Museum, Achievements, Battles (optional competition)

**Community Philosophy:**
- Encourage friendship, promote healthy competition, avoid toxicity
- All social features cosmetic-only — no pay-to-win advantages
- AdsGram remains primary revenue source; referrals support organic growth

**See:** `.openhands/knowledge/social-system.md` for complete social systems specification.

### Guild System
Community-building features for cooperative gameplay:
- **Guild Creation:** Level 15+ requirement, 5,000 Chrono Coins, unique name/tag, preset icons
- **Guild Roles:** Leader (1), Officer (up to 5), Member (up to 44) with distinct permissions
- **Guild Levels:** XP from member activity (quests, battles, events), unlocks cosmetics and features up to Level 30
- **Guild Missions:** Daily/weekly cooperative objectives with shared rewards for all active members
- **Guild Wars:** Bi-weekly 3-day wars, 5v5 format, separate war rating, free entry (no energy cost)
- **Guild Leaderboards:** Track guild level, activity score, war performance, seasonal champions
- **Guild Chat:** Real-time messaging with moderation rules and anti-toxicity guidelines
- **Guild Rewards:** Guild frames, banners, badges, titles — all cosmetic only, no combat advantages
- **Guild Achievements:** Founding, activity, combat, collection, and event achievements
- **AdsGram Optional:** Bonus guild mission attempts, contribution boosts — never mandatory

**See:** `.openhands/knowledge/guilds.md` for complete guild system specification.

### Expedition System
Time-traveling historical exploration with risk/reward decisions:
- **Era System:** 6 historical eras (Ancient Egypt, Greece, Rome, Viking Age, Medieval Europe, Renaissance) with unique atmospheres, artifacts, and educational content
- **Expedition Duration Types:** 15 minutes (quick), 1 hour (daily), 4 hours (evening), 8 hours (overnight), 12 hours (special) with proportional reward scaling
- **Resource Costs:** Expedition Energy (50 max, +1/30 min) or Expedition Keys (3 max, +1/8 hrs) with distinct risk/reward profiles
- **Risk System:** Standard (guaranteed), Risky (+50% rewards, 15% fail), Perilous (+100% rewards, 30% fail) — fair failure with no harsh penalties
- **Rare Discoveries:** Legendary artifacts, hidden stories, historical documents, secret collections — exciting but never required for progression
- **Era Progression:** Unlock requirements based on level and collection completion; new eras become available through gameplay
- **Historical Education:** Pre-expedition briefings, post-expedition learning, museum integration — every expedition teaches something real
- **Telegram Notifications:** Expedition completion, rare discoveries, era unlocks — maximum 4 per day, never spammy
- **Statistics Tracking:** Completed expeditions, success rate, rare discoveries, favorite era, expedition history
- **AdsGram Optional:** Speed boosts, reward bonuses, energy restoration — never mandatory, purely convenience
- **Future Expansions:** Co-op expeditions, guild expeditions, world events, special boss expeditions (documented, not planned)

**See:** `.openhands/knowledge/expeditions.md` for complete expedition system specification.

### World Map System
Central navigation hub representing humanity's timeline as an explorable journey through history:
- **World Map Philosophy:** The map embodies Jolt Time's identity as a time-traveling educational experience; players feel the weight of millennia and excitement of discovering civilizations
- **Main Historical Eras:** 9 eras spanning from Ancient Egypt (3100 BCE) to Future Era — each with unique atmosphere, visual identity, artifact themes, and easy future expansion
- **Era Structure:** Each era contains expeditions, artifact collections, museum sets, story chapters, special events, and regional nodes
- **Era Progression Rules:** Clear unlock requirements (player level + total artifacts + collection progress), gradual revelation creating anticipation, multiple progression paths
- **Region Nodes:** Specific historical locations within each era (e.g., Giza, Alexandria, Valley of the Kings for Egypt) with unique activities and unlock conditions
- **Era Completion System:** Partial (30%), Standard (60%), Full (100%), and Mastery tiers with cosmetic rewards — badges, frames, auras, titles
- **Era Statistics:** Exploration progress, favorite era, regions visited, artifacts collected, achievement tracking
- **Educational Philosophy:** Every era teaches history, encourages curiosity, presents civilizations respectfully; museum entries provide factual information
- **Telegram Notifications:** Era unlocks, region availability, completion milestones — never spam, respect daily caps
- **AdsGram Optional:** Extra exploration energy, bonus expedition attempts, temporary boosts — always optional

**See:** `.openhands/knowledge/world-map.md` for complete world map and era navigation specification.

### Shop System
Comprehensive in-game store providing cosmetic purchases and optional convenience items:
- **Shop Categories:** Featured Offers, Cosmetics, Profile Decorations, Museum Decorations, Event Shop, Resource Shop, Special Bundles
- **Featured Offers:** Daily/weekly featured bundles, flash sales, seasonal promotions, starter packs, welcome back offers
- **Cosmetics:** Profile frames, animated borders, backgrounds, badges, titles, visual effects — all purely visual, no gameplay advantages
- **Profile Decorations:** Avatar accessories, name effects, level badges, animated frames, themed backgrounds
- **Museum Decorations:** Museum themes (Ancient Temple, Classical Gallery, Medieval Castle, etc.), display cases, lighting, pedestals
- **Event Shop:** Exchange event currencies (Event Tokens, Festival Coins) for exclusive cosmetics, titles, badges, limited collectibles
- **Resource Shop:** Chrono Coins for convenience items (inventory expansion, mission refresh, daily boosts) and cosmetic bundles
- **Purchase Currencies:** Telegram Stars, TON (crypto), Chrono Coins (earned gameplay), Event Tokens (earned gameplay)
- **Daily Rotation:** Featured items refresh every 24 hours, weekly spotlight on new categories, flash sales 2-3x per week
- **Purchase History:** Full visibility into subscriptions, past purchases, owned cosmetics with easy restoration
- **Telegram Bot Notifications:** Flash sale alerts, new arrivals, event start/ending, seasonal bundles — max 4/day, anti-spam
- **Fair Monetization Philosophy:** No pay-to-win, players never required to spend, cosmetics-only focus, long-term sustainability over aggressive monetization

**See:** `.openhands/knowledge/shop-system.md` for complete shop system specification.

### Cosmetic Economy
Player expression through visual customization with zero gameplay impact:
- **Profile Cosmetics:** Frames (Bronze→Prismatic), animated borders (Nebula, Flame, Frost, Storm), backgrounds (era-themed, animated)
- **Badge System:** Achievement badges, collection badges, event badges, seasonal badges — all cosmetic recognition
- **Title System:** Traveler, Explorer, Collector, Scholar, Legendary, Event Master, Time Keeper, Founding Member
- **Visual Effects:** Particle auras, gradient borders, holograms, constellation backgrounds, lightning effects, chrono swirls
- **Museum Themes:** Complete museum visual overhauls (Ancient Temple, Classical Gallery, Renaissance Salon, Future Archive)
- **Anti-P2W Guarantee:** All cosmetics purely visual expression, no stat bonuses, no gameplay advantages, competitive integrity maintained
- **Chrono Coins Earning:** Daily missions (50-200 coins), weekly achievements (500), event participation (200-500), streak milestones (100-500)
- **Chrono Coins Spending:** Basic cosmetics (50-150), premium cosmetics (200-400), convenience items (100-500) — all earnable through play

**See:** `.openhands/knowledge/shop-system.md` for complete cosmetic economy specification.

### Jolt Time Plus
Optional premium subscription providing cosmetic bonuses and quality-of-life improvements:
- **Subscription Tiers:** Monthly ($2.99), Quarterly ($7.99), Annual ($24.99)
- **Cosmetic Bonuses:** 2 extra cosmetic loadout slots (5 total), Plus-exclusive badge monthly, Plus-only profile frames, exclusive color options
- **Profile Customization:** Animated profile backgrounds, custom nameplate styles, profile sound effects
- **Museum Exclusives:** Plus-exclusive museum theme, premium display case styles, artifact showcase rotation
- **Quality of Life:** +1 daily mission refresh, extended login grace period (48h→72h), priority support queue, no interstitial ads
- **Subscription Exclusions:** Never provides Time Energy advantages, Chrono Dust bonuses, artifact acquisition boosts, battle advantages, gacha luck, competitive power
- **Trial Period:** 7-day free trial before conversion to paid subscription

**See:** `.openhands/knowledge/shop-system.md` for complete subscription specification.

### Telegram Stars Support
Native Telegram payment integration for premium purchases:
- **Payment Method:** Telegram Stars balance for in-app purchases
- **Purchase Flow:** Seamless integration via Telegram payment API
- **Supported Items:** All Jolt Crystals packs (50, 150, 500, 1500 stars)
- **Regional Pricing:** Auto-adjusted by Telegram based on user location
- **Refund Handling:** Via standard Telegram refund policy
- **Security:** Full Telegram payment security and buyer protection

**See:** `.openhands/knowledge/shop-system.md` for complete Telegram Stars specification.

### TON Payments
Cryptocurrency payment option via The Open Network integration:
- **Payment Method:** TON wallet connection through Telegram
- **Supported Assets:** TON coin and supported Telegram stars tokens
- **Use Cases:** Premium bundles, Jolt Crystals packs, special offers
- **Security:** Secure wallet connection via Telegram's native integration
- **Pricing:** Dynamic conversion based on market rates at time of purchase
- **Advantages:** Fast transactions, low fees, permissionless

**See:** `.openhands/knowledge/shop-system.md` for complete TON payment specification.

### AdsGram Reward System
Primary revenue source providing optional player rewards:
- **Rewarded Video Ads:** Player-initiated, 5/day max, +50-100 Chrono Coins, extra packs, boosts — 1-hour cooldown
- **Interstitial Ads:** Automatic at natural breaks, 1 per 3 minutes, skip after 5 seconds, never interrupts gameplay
- **Enhanced Daily Pack:** 1/day, upgrades Basic Pack to Rare Pack equivalent when watched
- **Event Bonus Ads:** 1/day during events, upgrades Event Pack with Epic guarantee
- **Premium Event Ads:** Special events with themed ad experiences and premium rates
- **Reward Preview:** Always shown before ad, player chooses to watch or continue free
- **Never Mandatory:** All rewards optional, gameplay progression never requires watching ads
- **Frequency Caps:** Maximum 24 interstitials/day, 5 rewarded/day, strict cooldown enforcement
- **Player Respect:** No guilt-tripping for skipping, clear value proposition, thank players for watching

**See:** `.openhands/knowledge/adsgram.md` for complete AdsGram specification.

## Technical Stack

### Frontend
- TypeScript (strict mode)
- React or Vue.js
- Telegram WebApp SDK
- CSS-in-JS or Tailwind

### Backend
- Node.js / TypeScript
- Express.js or Fastify
- WebSocket for real-time

### Database
- Supabase (PostgreSQL)
- Redis for caching

### Infrastructure
- GitHub for version control
- CI/CD via GitHub Actions
- Vercel or Railway for hosting
- Cloudflare for CDN

## Quality Standards

### Code Quality
- TypeScript strict mode enabled
- ESLint + Prettier
- 80%+ test coverage
- No `any` types without justification
- Comprehensive error handling

### Performance
- First load < 3 seconds
- API response < 200ms
- 60fps animations
- Bundle size < 250KB gzipped

### UX Quality
- Touch targets minimum 44px
- Accessible contrast ratios
- Smooth transitions (300ms standard)
- Loading states for all async operations
- Graceful error handling

### Event System
Comprehensive temporary event and seasonal content system:
- **Event Categories:** Daily, Weekly, Monthly, Seasonal, Holiday, Community, Anniversary, Collaboration
- **Major Seasonal Events:** Spring Blossom Festival, Summer Solstice, Autumn Harvest Moon, Winter Wonderland (14-16 days each)
- **Seasonal Themes:** Four seasons with unique visual themes, rewards, and storylines
- **Holiday Events:** New Year, Valentine's, Easter, Halloween, Christmas with themed decorations and cosmetics
- **Historical Events:** Era-focused weeks (Mesopotamia, Egypt, Greece, Rome, Vikings, Renaissance) reinforcing educational identity, includes historical facts and museum integration
- **Collaboration Events:** Museum partnerships, creator showcases, educational institution events
- **Event Currency:** Event Tokens (2,000 max, 14-day expiration) and Festival Coins (500 max, 30-day expiration)
- **Event Missions:** Daily objectives, weekly objectives, milestone rewards with Collection, Battle, Social, Discovery, Expedition, Story mission types
- **Event Rewards:** Profile frames, badges, titles, auras, artifact skins, museum decorations, collectibles, anniversary items — all cosmetic only, no pay-to-win
- **Event Shop:** Exchange event currencies for exclusive cosmetics, decorations, collectibles, and anniversary items
- **Event Statistics:** Participation rates, rewards claimed, completed missions, event popularity tracking
- **Event Archive:** Past events documented with themes, rewards, leaderboard history, historical rewards viewable by future players
- **Event Philosophy:** Creates excitement, rewards participation, avoids excessive grinding, supports casual players
- **Future Features:** Global events, guild events, live community events, creator events (documented for future implementation)

**See:** `.openhands/knowledge/events.md` for complete event system specification.

### Limited-Time Content System
Comprehensive framework for exclusive content that creates excitement without punishing late joiners:
- **Limited-Time Content Categories:** Seasonal Rewards, Anniversary Rewards, Founder Rewards, Collaboration Rewards, Historical Event Rewards
- **Anniversary Events:** Year 1 (Chrono Origins), Year 2 (Temporal Evolution), Major Milestone Celebrations with 30-day durations
- **Founder Rewards:** Founding Member Badge, Chrono Pioneer Title, Temporal Guardian Frame — cosmetic-only, based on early participation
- **Legacy Collections:** View past events, historical rewards, old seasons with Heritage alternatives available
- **Returning Content Philosophy:** Recolored variants, anniversary editions, rerun events ensure players can obtain similar rewards
- **Heritage Shop:** Permanent shop for past limited-time items using Festival Coins and Anniversary Tokens
- **Anti-FOMO Philosophy:** Respects player time, avoids unhealthy urgency, celebrates participation over exclusivity
- **Fair Play Promise:** All limited rewards cosmetic-only, missed events return, tokens convert to permanent currency

**See:** `.openhands/knowledge/limited-content.md` for complete limited-time content specification.

## Security

### Security System
Comprehensive protection framework for Jolt Time:
- **Account Protection:** Telegram identity as primary account system, session management with JWT tokens (7-day expiration), concurrent session limits (3 max), impossible travel detection
- **Anti-Bot Protection:** Impossible activity speed detection, automated pattern recognition, abnormal resource generation monitoring, exploit attempt detection with 5-level response (monitor → challenge → restrict → suspend → ban)
- **Rate Limiting:** API requests (100/min standard, 200/min authenticated), reward claims (daily caps enforced server-side), referral limits (100 max per user), gift system limits (10/day, 5/friend/day)
- **Anti-Spam Rules:** Friend request limits (20/day, 100 pending max), guild invitation limits (30/day), notification caps (4/day max), quiet hours (10PM-8AM), no repeat messages
- **Economy Protection:** Duplicate reward prevention with idempotency keys, exploit abuse detection, suspicious transaction monitoring, currency inflation prevention with per-player caps
- **Violation Categories:** Level 1 (warning), Level 2 (restriction 1-24h), Level 3 (suspension 1-7 days), Level 4 (permanent ban) with escalation rules
- **Logging & Privacy:** Security event logging, 90-day retention, sensitive data protection, GDPR-ready practices, minimal data collection (Telegram ID only)

**See:** `.openhands/knowledge/security-system.md` for complete security specification.

### Anti-Bot Protection
Automated detection systems for bot and automation:
- **Activity Speed Detection:** Normal 1-5 actions/min, suspicious 6-15, likely bot 16-30, confirmed bot 30+
- **Pattern Recognition:** Same action sequences (70-90%+ repetition), 24/7 activity, perfect timing
- **Technical Detection:** Multiple IPs (10+/day suspicious), device fingerprint anomalies, emulator detection
- **Response Framework:** Monitor → CAPTCHA challenge → Restriction → Suspension → Permanent Ban
- **Fair Play:** Manual review before severe penalties, clear evidence required, appeal process available

### Anti-Spam Rules
Protection against spam and abusive behavior:
- **Friend Requests:** 20 outgoing/day, 100 pending max, auto-decline threshold for same user
- **Guild Invitations:** 30/day for leaders, 20/day for recipients, recruitment spam detection
- **Notifications:** Maximum 4 per 24 hours, one per category per 12 hours, quiet hours respected
- **Guild Chat (Future):** 10 messages/min, flood detection (5 identical messages), content filtering
- **Never Sent:** Duplicate notifications, notifications to inactive users (>30 days), excessive sequences

### Economy Protection
Safeguards for game economy integrity:
- **Duplicate Prevention:** Server-side claim tracking, idempotency keys, cooldown enforcement
- **Exploit Detection:** Clock manipulation, modified client, replay attacks, state manipulation
- **Transaction Monitoring:** Currency flow anomalies, rapid accumulation, cross-account transfers
- **Inflation Prevention:** Total supply monitoring, per-player caps (Coins 1M, Dust 500K), sink rate analysis
- **AdsGram Protection:** Timing pattern detection, automated farming detection, fake reward prevention

### Privacy Philosophy
Minimal data collection with maximum protection:
- **Data Minimization:** Only Telegram ID required, game progress and state stored, technical data minimal
- **Never Collect:** Phone numbers, email addresses, location data, contacts
- **Player Rights:** Right to know (privacy policy), right to access (view data), right to delete (30 days), right to rectify
- **Third-Party:** No user data to advertisers, anonymized stats only, Telegram auth standard flow

### Fraud Prevention
Anti-fraud and abuse protection:
- **Referral Protection:** Fake account detection (behavioral, technical), self-referral prevention (same ID, IP, device), farming detection (mass referrals, coordinated patterns)
- **AdsGram Abuse:** Timing pattern analysis, automated farming detection, exploit prevention via SDK validation
- **Payment Fraud (Future):** Payment velocity monitoring, geographic anomaly detection, device risk scoring

### Incident Response
Security incident handling procedures:
- **P1 Critical:** Active exploitation, data breach, service down — immediate 24/7 response
- **P2 High:** Confirmed exploit abuse, large-scale botting — within 4 hours
- **P3 Medium:** Suspected abuse, anomaly detected — within 24 hours
- **P4 Low:** False positive investigation, minor violation — within 72 hours
- **Emergency Controls:** Account isolation, economy freezes, point-in-time recovery capability

## Analytics System

### Product Metrics
Core user activity and engagement tracking:
- **User Activity:** DAU/WAU/MAU tracking, daily trends, cohort analysis
- **Session Metrics:** Average session length (target 8-15 min casual), sessions per day (target 1.5-3), play time distribution by hour
- **Growth Tracking:** New registrations, activation rate, acquisition funnel, day-over-day/week-over-week/month-over-month growth rates

**See:** `.openhands/knowledge/analytics.md` for complete metrics specification.

### Analytics Categories
Comprehensive tracking across all game systems:
- **Player Analytics:** DAU, MAU, retention rates, session length, progression statistics
- **Economy Analytics:** Currency generation, spending, inflation risks, item circulation
- **Event Analytics:** Participation rates, reward claims, event popularity, mission completion
- **Monetization Analytics:** Subscription activity, Telegram Stars purchases, premium conversion rates
- **AdsGram Analytics:** Impressions, completed views, reward claims, average revenue, participation rates
- **Retention Analytics:** Cohort analysis, churn prediction, return rates, player lifecycle

### Retention Metrics
Player retention and churn analysis:
- **Cohort Analysis:** Users grouped by signup date, tracked through Day 0/1/7/14/30 retention
- **Key Metrics:** D1 retention (target >30%), D7 (target >12%), D30 (target >6%)
- **Churn Segments:** At-risk (3-6 days), Churned (7-29 days), Dormant (30-89 days), Reactivated
- **Reactivation:** Return rates, time to return, returning player value

**See:** `.openhands/knowledge/analytics.md` for complete retention tracking specification.

### Gameplay Metrics
In-game activity and progression tracking:
- **Battle Analytics:** Total battles, win rates, rating progression, rank distribution, skill progression
- **Expedition Metrics:** Success rates, era popularity, risk preference distribution, completion time
- **Collection Analytics:** Artifact acquisition rate, rarity distribution, duplicate rate, era completion
- **Mission Tracking:** Completion rates by difficulty, progression pacing, Battle Pass tier distribution

**See:** `.openhands/knowledge/analytics.md` for complete gameplay metrics specification.

### Economy Monitoring
In-game economy health and balance tracking:
- **Currency Flow:** Chrono Coin generation sources, sink destinations, generation/sink ratio (target 1.0-1.2)
- **Resource Tracking:** Time Shard generation, usage patterns, conversion rates
- **Inflation Prevention:** Supply growth monitoring, per-player caps, sink efficiency
- **Health Indicators:** Supply metrics, flow velocity, alert thresholds (green/yellow/red)

**See:** `.openhands/knowledge/analytics.md` for complete economy monitoring specification.

### AdsGram Analytics
Ad performance and revenue tracking (primary revenue system):
- **Impression Metrics:** Total impressions, fill rate (target >95%), viewability rate (target >70%)
- **Completion Metrics:** Completion rate, skip rate, average watch time, rewarded vs interstitial distribution
- **Revenue Metrics:** Daily revenue, RPM, effective CPM, revenue per DAU (target >$0.04)
- **Engagement Profiles:** Non-viewers, light (1-2/day), regular (3-5/day), power (5+/day) segments

**See:** `.openhands/knowledge/adsgram.md` for complete AdsGram specification.

### Monetization Analytics
Purchase and revenue tracking:
- **Conversion Metrics:** Payer rate (target 1-3% of DAU), ARPU, ARPPU, LTV by cohort
- **Purchase Breakdown:** Telegram Stars distribution, TON adoption, Battle Pass upgrade rate, subscription metrics
- **Revenue Streams:** AdsGram (60-70%), Stars, TON, Battle Pass, Subscriptions
- **Cohort Revenue:** 7/30/90-day revenue per signup cohort, LTV by acquisition source

**See:** `.openhands/knowledge/analytics.md` for complete monetization analytics specification.

### Event Metrics
Event participation and effectiveness tracking:
- **Participation:** Total participants, participation rate, active vs highly active
- **Seasonal Tracking:** Active players, average tier reached, completion rate, premium adoption
- **Completion Analysis:** Challenge completion rate, time to complete, reward redemption rates, popular items
- **Event Effectiveness:** ROI per event, engagement depth, return visitor rate

**See:** `.openhands/knowledge/events.md` for complete event system specification.

### Marketplace Metrics
Marketplace activity and trade analytics:
- **Trade Volume:** Total trades, trade value, average trade size, trade velocity by category and rarity
- **Active Listings:** Current listings, new listings, expired listings, sold listings, relisting rates
- **Item Popularity:** Most traded items, highest value items, fastest selling, search volume
- **Transaction Analytics:** Daily transactions, peak trading hours, marketplace fees collected

**See:** `.openhands/knowledge/marketplace.md` for complete marketplace specification.

### PvP Metrics
Player-versus-player battle analytics:
- **Battle Counts:** Total battles, battles per DAU, battle distribution (casual/ranked/event)
- **Win Rates:** Overall win rate, win rate by rank and era, average battle duration
- **League Distribution:** Player distribution across league tiers, league progression, demotion rates
- **Seasonal Participation:** Season-active players, season battle counts, season completion rates

**See:** `.openhands/knowledge/pvp-arena.md` for complete PvP specification.

### Notification Metrics
Push notification performance tracking:
- **Delivery:** Sent, delivered, failed, bounced, delivery rate (target >98%)
- **Engagement:** Open rate (target 35-50%), click rate (target 15-25%), deep link success
- **Reactivation:** Return within 24h rate, sustained return rate, cost-benefit analysis
- **Preferences:** Opt-out rate (target <10%), category opt-outs, quiet hours usage

**See:** `.openhands/knowledge/notifications.md` for complete notification specification.

### Player Segments
Behavioral player categorization:
- **New Players (Day 0-7):** Focus on onboarding, early engagement hooks
- **Active Players:** Any activity in 24 hours, content freshness focus
- **Collectors:** >70% collection, rare finds, museum depth focus
- **PvP Players:** >50% sessions include battles, competitive balance focus
- **Social Players:** High friend count/guild activity, social features focus
- **Returning Players:** Previously churned (7+ days), welcome back experience focus

**See:** `.openhands/knowledge/analytics.md` for complete segment analysis.

### Dashboard Philosophy
Analytics visualization principles:
- **Executive Dashboard:** Growth metrics, revenue overview, retention curves, key milestones
- **Game Health:** Economy metrics, content engagement, balance indicators, feature usage
- **Technical Stability:** API response times (P50/P95/P99), error rates, server load, uptime (>99.9%)
- **Business Intelligence:** Revenue streams, ad performance, purchase funnel, cohort analysis
- **Privacy:** Minimal data collection, aggregated insights over individual tracking, GDPR compliance

### Future Analytics Features
Planned advanced analytics capabilities:
- **A/B Testing Framework:** Feature flags, statistical significance calculator, multi-variant testing (Phase 2+)
- **Predictive Analytics:** LTV prediction, churn risk scoring, content preference prediction (Phase 3+)
- **Churn Prediction:** Risk score per player, intervention recommendations, effectiveness tracking (Phase 2+)
- **Recommendation System:** Personal content suggestions, optimal timing, friend activity insights (Phase 3+)

## Security System

### Security Categories
Comprehensive protection across all game systems:
- **Account Security:** Player identities, sessions, account ownership, recovery
- **Economy Security:** Duplicated rewards prevention, currency exploits, item duplication, inflation abuse
- **Anti-Cheat Systems:** Impossible progression, automated farming, abnormal activity, exploit abuse detection
- **Transaction Security:** Payment protection, refund abuse prevention, fraud detection
- **Admin Security:** Administrator accounts, permissions, internal tools protection
- **Database Protection:** Backup, redundancy, access controls, audit logging

**See:** `.openhands/knowledge/security-system.md` for complete security specification.

### Anti-Cheat Protection
Detection and prevention of unfair advantages:
- **Impossible Progression:** Speed analysis, pattern detection, statistical anomalies
- **Automated Farming:** Bot behavior patterns, uniform timing, 24/7 activity detection
- **Abnormal Activity:** Unusual resource generation, impossible achievements, anomalous patterns
- **Exploit Abuse:** Client modification detection, invalid state transitions, race condition exploitation
- **False Positive Prevention:** Manual review before severe penalties, grace periods, whitelist system

**See:** `.openhands/knowledge/security-system.md` for complete anti-cheat specification.

### Economy Security
Protecting in-game economy integrity:
- **Reward Protection:** Duplicate prevention, server-side validation, transaction integrity
- **Currency Exploits:** Generation limits, sink monitoring, inflation detection
- **Item Duplication:** Atomic transactions, ownership verification, cross-server checks
- **Inflation Monitoring:** Supply tracking, value indicators, sink efficiency analysis

**See:** `.openhands/knowledge/security-system.md` for complete economy security specification.

### AdsGram Protection
Protecting primary revenue system from abuse:
- **Fake Ad Completions:** Completion validation, timestamp analysis, device correlation
- **Automated Reward Farming:** Bot detection on reward claims, pattern recognition
- **Multiple Account Abuse:** Cross-account detection, device fingerprinting, coordinated abuse
- **Exploit Attempts:** Reward manipulation detection, timing exploitation prevention

**See:** `.openhands/knowledge/adsgram.md` for complete AdsGram specification.

### Moderation Escalation
Progressive response to violations:
- **Level 1 - Warning:** Minor infractions, monitoring only
- **Level 2 - Temporary Restriction:** Feature restrictions, 1-24 hours
- **Level 3 - Temporary Suspension:** Account suspended, 1-7 days
- **Level 4 - Permanent Ban:** Account terminated, appeal available

### Recovery Systems
Disaster recovery and business continuity:
- **Database Failures:** Backup strategy, point-in-time recovery, replication
- **Rollback Procedures:** Scope assessment, approval process, communication protocols
- **Recovery Scenarios:** Minor corruption, feature failure, database failure, security breach, economy exploitation

**See:** `.openhands/knowledge/security-system.md` for complete disaster recovery specification.

## Localization System

### Multi-Language Support
International-first localization architecture:
- **Supported Languages:** Ukrainian (uk), English (en), Polish (pl), German (de), Spanish (es), French (fr) at launch
- **Translation Architecture:** Centralized JSON files per language, namespace organization (common, profile, battle, museum, notification, bot, event, historical, error, adsgram)
- **String Key Design:** Format {screen}.{component}.{element}.{variant}, no hardcoded text ever
- **Plural Forms:** Language-specific plural rules (English 2 forms, Ukrainian 3 forms, Polish 3 forms, German 2 forms, French 2 forms, Spanish 2 forms)
- **Fallback Chain:** User Language → English (en) → System Default, never show untranslated keys

**See:** `.openhands/knowledge/localization.md` for complete localization specification.

### Regional Adaptation
Locale-aware formatting and cultural adaptation:
- **Date Formats:** DD.MM.YYYY (Ukrainian/Polish/German), MM/DD/YYYY (English), DD/MM/YYYY (Spanish/French)
- **Time Formats:** 24-hour default with 12-hour option based on Telegram locale preference
- **Number Formatting:** Locale-aware decimal/thousands separators (1,234.56 US vs 1.234,56 German)
- **Currency Formatting:** Locale-aware symbol placement and decimal handling
- **Time Zone:** Display in user's local timezone, UTC reference for server times

**See:** `.openhands/knowledge/localization.md` for complete regional adaptation specification.

### Telegram Bot Localization
Bot messages and commands in all supported languages:
- **Language Detection:** User preference (database) → Telegram locale → Default (English)
- **Command Localization:** Commands universal (/start, /help), response content localized
- **Inline Keyboard:** Text buttons translated, icons universal
- **Notification Templates:** All notification categories translated with variable placeholders
- **AdsGram Messages:** Reward descriptions translated, SDK handles ad content

**See:** `.openhands/knowledge/localization.md` for complete bot localization specification.

### Historical Content Localization
Educational content translation preserving meaning and accuracy:
- **Translation Rules:** Human translation required, native speaker review, historical consultant verification
- **Cultural Adaptation:** Idioms adapted naturally, cultural context provided, proper nouns preserved
- **Quality Standards:** B1-B2 reading level target, technical terms explained or contextualized
- **Content Examples:** Artifact descriptions maintain historical authenticity while remaining accessible

**See:** `.openhands/knowledge/localization.md` for complete historical content specification.

### Player Language Settings
User control over language preferences:
- **Language Picker:** Available in settings, instant preview, immediate application
- **Auto-Detection:** Uses Telegram locale on first login if supported, falls back to English
- **Manual Override:** Available anytime, change takes effect immediately without reload
- **Preview System:** Shows key UI elements in new language before confirming

**See:** `.openhands/knowledge/localization.md` for complete settings specification.

### Accessibility Philosophy
Clear, understandable language for all players worldwide:
- **Simple Language:** B1-B2 reading level target, clear sentence structures, avoid idioms
- **Screen Reader Compatible:** Proper heading hierarchy, aria labels, correct language attributes
- **Cultural Sensitivity:** Avoid stereotypes, respect cultural differences in historical content
- **Transparency:** Players always understand game text and notifications

### Future Localization Features
Planned language system expansions:
- **RTL Language Support:** Arabic and Hebrew with full RTL mirroring and typography (Phase 3+)
- **Asian Languages:** Japanese, Korean, Chinese with proper character support and vertical text option (Phase 3+)
- **Regional Variants:** Spanish (LatAm vs Spain), English (US vs UK), Portuguese (Brazil vs Portugal) (Phase 2+)
- **Community Translation:** Volunteer translation program with native speaker review workflow (Phase 2+)

## Settings System

### Settings Architecture
Jolt Time provides comprehensive settings across multiple categories:
- **General Settings** — Core application behavior, audio, display, data management
- **Notification Settings** — Full control over push notifications with category toggles and quiet hours
- **Language Settings** — Interface language, regional preferences, audio language options
- **Accessibility Settings** — Text size, contrast, motion reduction, screen reader support
- **Privacy Settings** — Profile visibility, analytics participation, data control
- **Visual Settings** — Animation intensity, haptics, battery saving, quality presets

All settings are persisted per user in Supabase and apply across both Telegram Mini App and Telegram Bot.

**See:** `.openhands/knowledge/settings.md` for complete settings specification.

### Settings Persistence
- **Real-time Sync** — Settings changes apply immediately across all sessions
- **Platform Independent** — Settings apply to both Mini App and Bot
- **Offline Capable** — Core settings cached locally, sync when online
- **Reset Options** — Per-section and global reset to defaults available

**See:** `.openhands/knowledge/settings.md` for complete settings persistence specification.

## Accessibility Features

### Accessibility Philosophy
Jolt Time is committed to remaining comfortable for all players:
- **Universal Comfort** — No forced experience; players always have choices
- **Graceful Degradation** — Core gameplay accessible even with all options enabled
- **Device Inclusivity** — Support both flagship and budget devices
- **Independence** — All features playable without requiring precise timing
- **Color-Friendly Design** — Never rely on color alone; pair with icons, shapes, text
- **No Visual Overload** — Progressive disclosure, priority hierarchy, readable typography

### Accessibility Settings
Player-configurable accessibility options:
- **Text Size** — Larger text mode (+25%), fine-grained slider (80%-150%)
- **Color & Contrast** — High contrast mode, dark/light theme, reduce transparency
- **Motion Controls** — Reduce animations, disable all animations, pause background effects
- **Screen Reader Support** — ARIA labels, heading hierarchy, focus indicators, live regions

### Supporting Different Play Styles
| Play Style | Supported Through |
|------------|-------------------|
| Casual | Quick sessions, flexible timers, forgiving mechanics |
| Dedicated | Deep content, achievement systems, collection tracking |
| Competitive | Leaderboards, fair matching, transparent mechanics |
| Social | Friends, guilds, shared experiences |
| Exploratory | Museum, lore, historical content depth |

### Future Accessibility Features
Planned accessibility expansions:
- **Enhanced Screen Reader** — Comprehensive narration of visual content
- **Advanced Color Themes** — Custom accent colors, preset themes
- **Customizable Layouts** — Drag-and-drop dashboard, widget selection
- **Cognitive Support** — Task breakdown, visual guides, simplified mode
- **Input Alternatives** — Voice control, controller support, switch access

**See:** `.openhands/knowledge/settings.md` for complete accessibility specification.

## Privacy Settings

### Privacy Architecture
Player control over data and visibility:
- **Notification Privacy** — Online status, activity status, last seen controls
- **Analytics Participation** — Voluntary opt-in to anonymous gameplay analytics
- **Connected Services** — View and manage Telegram profile links, third-party connections
- **Data Rights** — GDPR-compliant data export, account deletion with grace period

### Profile Visibility
Players choose who can see their profile:
- **Public Profile** — Visible to all players, shown on leaderboards
- **Friends Only** — Visible to approved friends, hidden from public
- **Private Profile** — Only visible to self, all stats hidden

Granular visibility controls for leaderboards, collection progress, museum level, achievements, activity status, and friend requests.

### Privacy Compliance
- **GDPR Ready** — Full data export and deletion capabilities
- **Minimal Collection** — Aggregated insights over individual tracking
- **Consent Management** — Clear opt-in/opt-out for all data uses
- **Transparency** — Clear privacy policy with version history

**See:** `.openhands/knowledge/settings.md` for complete privacy specification.

## Personalization

### Profile Customization
Players personalize their Jolt Time identity:
- **Display Name** — Customizable nickname
- **Avatar Frame** — Achievement-based decorative frames
- **Bio/About** — Optional personal description
- **Favorite Color** — Theme accent preference
- **Time Traveler Title** — Gameplay-earned titles displayed on profile

### Content Personalization
- **Favorite Artifact Display** — Pin artifacts to showcase
- **Favorite Historical Era** — Set preferred era for quick access and notifications
- **Museum Showcase** — Customize display order, exhibition focus, tour guide mode
- **Dashboard Customization** — Quick access widgets, pinned quests, activity feed

### Visual Personalization
- **Animation Intensity** — Full / Reduced / Minimal / None
- **Haptic Feedback** — Full / Light / Minimal / None
- **Theme Accents** — Era-specific theme options (future)
- **Reduced Effects Mode** — Single toggle for comprehensive effect reduction

### Personalization Philosophy
- Comfort and identity expression over competitive advantage
- Settings affect personal experience only, never relative power
- Optional features that enhance without limiting

**See:** `.openhands/knowledge/settings.md` for complete personalization specification.

## Quality of Life

### QoL Design Principles
- **Comfort Over Speed** — Quality of life > marginal time savings
- **Optional Only** — No mandatory accessibility requirements
- **No Competitive Advantage** — Settings affect personal experience only
- **Performance Preservation** — Visual settings respect device capabilities
- **Battery Awareness** — Power-saving options for mobile devices

### What Settings Should NOT Affect
To maintain competitive integrity:
- Progression speed (no XP or currency acceleration)
- Resource availability (no increased drops or rewards)
- Combat balance (no battle outcome manipulation)
- Leaderboard standing (no unfair advantages)
- Collection probability (no gacha/capsule odds changes)

### What Settings CAN Affect
- Visual experience (animations, effects, themes)
- Audio experience (sounds, music, haptics)
- Notification frequency (push notification preferences)
- Interface layout (dashboard customization, quick access)
- Accessibility features (text size, contrast, motion)
- Privacy (profile visibility, data sharing)

**See:** `.openhands/knowledge/settings.md` for complete quality of life philosophy.

## Friends System

### Friends Architecture
The friends system enables positive social connections between players:
- **Friend Management** — Send requests, accept/decline, remove friends
- **Friends List** — Organized display with nickname, level, favorite era, online status
- **Favorite Friends** — Mark important friends (Best Friends, Guild Friends, Real-Life Friends)
- **Social Statistics** — Friendship metrics, referral tracking, interaction counts

### Friend Management
- **Request Methods:** Username search, QR code, Telegram contact sync, in-game actions
- **Request Handling:** Accept, decline (silent), decline & block options
- **Removal:** No notification to removed friend, can re-request immediately

### Friend Limits
- **Base Limit:** 100 friends (Free), 200 (Jolt Time Plus), 500 (Premium)
- **At Limit Handling:** Clear UX for managing existing friends
- **Future Expansion:** Friendship tiers, guild integration, social score unlocks

### Friendly Interactions
- **Greetings** — Daily greetings with preset messages, no gameplay rewards
- **Achievement Reactions** — Celebrate friend milestones with emoji reactions
- **Gift-Giving** — Daily free gifts, random coin amounts, no pressure mechanics
- **Museum Milestones** — Visit, celebrate, share interactions

### Privacy Controls
- **Request Filters:** Everyone / Friends of Friends / No One
- **Profile Visibility:** Friend-only information (online status, museum progress, collections)
- **Interaction Controls:** Granular controls for each action type
- **Blocking:** Silent block, no notification to blocked player

**See:** `.openhands/knowledge/friends-system.md` for complete friends system specification.

### Social Statistics
- **Friendship Metrics:** Total friends, longest friendship, mutual friends
- **Referral Tracking:** Referrals joined, active referrals, pending rewards
- **Interaction Stats:** Gifts sent/received, battles, celebrations

**See:** `.openhands/knowledge/friends-system.md` for complete social statistics specification.

## Social Features

### Social Philosophy
Jolt Time social features are designed around positive interactions:
- **Optional Participation** — No social feature mandatory for progression
- **Positive Framing** — Celebration of progress, no shame mechanics
- **Privacy First** — Players control all visibility and interaction settings
- **Cooperation Over Competition** — Group goals, shared achievements

### Positive Community Design
- **Encouraging Kindness:** Positive language, gift-giving is beneficial not mandatory
- **Avoiding Toxicity:** No public shame, no negative leaderboard highlighting
- **Supporting Cooperation:** Asynchronous options, no real-time voice requirements

### Friend Interactions
- **Greetings System:** Daily greetings, preset messages, no gameplay rewards
- **Achievement Reactions:** Celebrate milestones with emoji reactions
- **Gift-Giving:** Daily free gifts between friends, surprise coin values

### Anti-Toxicity Measures
- No public leaderboard shame (bottom scorers not highlighted)
- Battle results shown privately, not broadcast
- Competitive balance without punitive matchmaking
- Graduated consequences for community violations

**See:** `.openhands/knowledge/social-system.md` for complete social system overview.

## Friend Requests

### Request Flow
- **Sending:** Username search, QR code, contact sync, in-game buttons
- **Accepting:** Notification, dedicated tab, immediate connection
- **Declining:** Silent decline option, no notification to sender
- **Removing:** Confirmation required, no notification to removed friend

### Request Privacy
- Requests expire after 30 days
- Declined players can re-send after 7 days
- Blocked players cannot send requests
- Privacy settings control who can send requests

### Request Notifications
- Push notification when request received
- Bot notification when Mini App closed
- Maximum 3 friend notifications per day per category
- Quiet hours respected

**See:** `.openhands/knowledge/friends-system.md` for complete friend request specification.

## Privacy Controls

### Profile Privacy
Player-controlled visibility of personal information:
- **Public:** Display name, level, avatar frame, title
- **Friends Only:** Online status, favorite era, museum progress, achievements
- **Private Mode:** Hide all non-public information

### Interaction Privacy
Granular control over who can perform each action:
- View full profile, send requests, send gifts, challenge to battle
- All actions have "Everyone / Friends Only / Nobody" options

### Data Privacy
- Blocked players cannot see any profile information
- Blocking is silent (no notification)
- Report feature for inappropriate behavior
- GDPR-compliant data export and deletion

**See:** `.openhands/knowledge/friends-system.md` for complete privacy controls specification.

## Future Social Features

Planned social system expansions (documented only, not implemented):
- **Direct Messages** — Private 1-on-1 messaging with history
- **Friend Activity Feed** — Unified feed of friend activities
- **Shared Expeditions** — Cooperative expeditions with team rewards
- **Friend Challenges** — Weekly non-zero-sum challenges

### Future Recommendations
- **Guild Recommendations** — Based on Telegram group membership
- **Mutual Friends** — "You have 5 mutual friends with @player"
- **Event Teammates** — Matched by past event participation

**See:** `.openhands/knowledge/friends-system.md` for future social features specification.

## Gifts System

### Gifts Architecture
Daily gift exchange between friends to strengthen community bonds:
- **Gift Types:** Chrono Coins (10-50), Energy (5-20), Expedition Keys (rare), Social Tokens (rare)
- **Daily Gifts:** One gift per friend per day, reset at UTC midnight
- **Gift Categories:** Daily, Event, Anniversary, Friendship Rewards

### Daily Gift Limits
- **Free Players:** 20 gifts per day, 1 per friend
- **Jolt Time Plus:** 50 gifts per day, 1 per friend
- **Receiving:** Unlimited (10 unclaimed max)
- **Anti-Abuse:** Minimum Level 5, 7-day account age required

### Gift Categories
- **Daily Gifts:** Standard random contents, available every day
- **Event Gifts:** Enhanced contents during seasonal events
- **Anniversary Gifts:** Special gifts on friendship milestones (7/30/100/365 days)
- **Friendship Rewards:** Cosmetic badges and titles for positive interactions

### Gift History
- Complete record of sent and received gifts
- Filterable by type (sent/received/milestones)
- Milestone timeline with anniversary dates
- Stats summary (total gifts, longest friendship, most exchanges)

**See:** `.openhands/knowledge/gifts-system.md` for complete gifts system specification.

## Social Rewards

### Active Friendship Rewards
Weekly bonuses for maintaining active friendships:
- **Criteria:** Both players active (gift/greeting) in past 7 days, both Level 10+
- **Rewards:** 50-500 coins + 3-10 Social Tokens based on active friend count

### Helping Friends Rewards
- **Help Quests:** Help friend complete quests → Both benefit
- **Rewards:** 5-50 coins + 1-5 Social Tokens per help
- **Weekly Cap:** 3 helps per week

### Long-Term Interaction Rewards
- **6 Month Loyalty:** 500 coins + Epic Fragment
- **1 Year Loyalty:** 1000 coins + Legendary Fragment
- **2+ Years:** 2000 coins + Exclusive Badge

### Reward Balance Philosophy
- Cosmetic rewards preferred over competitive advantages
- No gameplay power from social rewards
- Helpers and recipients both benefit

**See:** `.openhands/knowledge/gifts-system.md` for complete social rewards specification.

## Friendship Milestones

### Time-Based Milestones
| Days | Title | Reward |
|------|-------|--------|
| 7 | New Friend | 25 coins + badge |
| 30 | Friend | 50 coins + badge |
| 100 | Good Friend | 100 coins + badge |
| 365 | Best Friend | 500 coins + badge |
| 730 | Old Friend | 1000 coins + badge |

### Interaction Milestones
- **10 Gifts Sent:** "Generous" badge
- **50 Gifts Sent:** "Philanthropist" badge
- **100 Gifts Received:** "Popular" badge
- **500 Achievements Reacted:** "Encourager" badge

### Milestone Rewards Philosophy
- Badges and titles preferred over currency
- Recognition over compensation
- Maximum 1000 coins per milestone year
- No Legendary+ artifacts as milestone rewards

**See:** `.openhands/knowledge/gifts-system.md` for complete milestone specification.

## Gift History

### History Features
- **Sent Gifts:** Recipient, date, contents for all sent gifts
- **Received Gifts:** Sender, date, contents, claim status
- **Milestone Timeline:** Chronological list of all milestones
- **Stats Summary:** Total sent/received, longest friendship, most exchanges

### History Privacy
- Only sender/receiver can view gift details
- No public gift history
- Exportable for personal records

**See:** `.openhands/knowledge/gifts-system.md` for complete gift history specification.

## Anti-Abuse Systems

### Abuse Prevention
- **Fake Accounts:** Telegram account age check, profile completion, bot detection
- **Self-Gifting:** Cannot gift self, cross-account detection
- **Automated Loops:** Max 2 gifts per pair per day, burst detection

### Rate Limiting
- Maximum 5 gifts to same friend per week
- Burst: 10 gifts in 1 hour → 1 hour cooldown
- Daily cap enforcement regardless of client

### Penalties
- First offense: Warning
- Second offense: 24-hour gift suspension
- Third offense: 7-day suspension + review

**See:** `.openhands/knowledge/gifts-system.md` for complete anti-abuse specification.

## Referral System

### Referral Architecture
Organic growth through player recommendations with mutual benefits:
- **Personal Codes:** Unique 10-character referral code per player (JOLT_XXXXXXXX)
- **Invite Links:** Telegram deep links (https://t.me/JoltTimeBot?start=REF_XXX)
- **Share Options:** Copy link, Telegram share, QR code generation

### Referral Rewards
Both inviter and invited receive rewards at milestones:
- **Signup:** Inviter 50 Coins + 20 Energy, Invited 100 Coins + 50 Energy
- **Level 5:** Inviter 100 Coins + 5 Fragments, Invited 150 Coins
- **Level 10:** Inviter 200 Coins + Rare Fragment, Invited 250 Coins + 10 Fragments
- **Level 20:** Inviter 300 Coins + Epic Fragment, Invited 500 Coins

### Referral Milestones
Milestone-based rewards for referral counts:
| Invited Count | Title | Badge | Bonus |
|---------------|-------|-------|-------|
| 1 | First Friend | Connector | 50 Coins |
| 5 | Scout | Scout | 100 Coins + 5 Fragments |
| 10 | Ambassador | Ambassador | 250 Coins + Rare Fragment |
| 25 | Advocate | Advocate | 500 Coins + 2 Rare Fragments |
| 50 | Champion | Champion | 1000 Coins + Epic Fragment |
| 100 | Legend | Legend | 2000 Coins + Epic Fragment + Badge |

### Activation Rules
Rewards activate only when referred player meets requirements:
- Tutorial 100% complete
- Level 3+ threshold
- 3+ sessions logged
- 2+ days active
- 1+ mission completed

### Referral Statistics
- Total invited, active referrals, conversion rate
- Pending and lifetime rewards earned
- Referral dashboard with share options
- Attribution persists for 30 days

**See:** `.openhands/knowledge/referral-system.md` for complete referral system specification.

## Invite Links

### Link Structure
- **Format:** `https://t.me/JoltTimeBot?start=REF_JOLT_XXXXXXXX`
- **Code Format:** `REF_JOLT_XXXXXXXX` (10 characters)
- **Attribution:** Stored for 30 days, applies to first conversion

### Bot Commands
- `/start REF_XXX` — Join via referral
- `/invite` — Open referral dashboard
- `/mycode` — Display personal referral code
- `/referrals` — View referral statistics

### Share Methods
- Copy link button
- Share to Telegram chat
- QR code generation
- Native Telegram share sheet

**See:** `.openhands/knowledge/referral-system.md` for complete invite link specification.

## Referral Rewards

### Reward Distribution
- **Immediate:** Signup rewards claimed instantly
- **Milestone:** Progression rewards claimed when threshold reached
- **Pending:** Rewards held 30 days if not claimed

### Reward Caps
- Maximum 5000 Chrono Coins from referrals per month
- Maximum 50 fragments from referrals per month
- Excess rewards roll over to next month

### Quality Milestones
Active referral bonuses for engaged referred players:
- 5 Active: 100 Coins (5 referred reach Level 10+)
- 10 Active: 250 Coins + Rare Fragment
- 25 Active: 500 Coins + Epic Fragment

**See:** `.openhands/knowledge/referral-system.md` for complete reward specification.

## Growth Systems

### Growth Philosophy
Organic growth through genuine player recommendations:
- **Primary Channels:** Friends, communities, Telegram sharing, positive experiences
- **Avoided:** Spam, misleading claims, pressure tactics, fake urgency

### Referral Leaderboards
Friendly competition without toxicity:
- **Weekly:** Updated Monday, top 10 get bonus rewards
- **Monthly:** 1st of month, featured in game
- **Lifetime:** Hall of Fame permanent display
- **Non-Toxic:** No shame for low counts, celebration over pressure

### Anti-Abuse for Referrals
- Self-referral prevention (Telegram ID, device, phone matching)
- Fake account detection (account age, bot patterns, behavioral analysis)
- Rate limiting (max 10/day, 50/month)
- Pattern detection for coordinated abuse

### AdsGram vs. Referrals
Referral systems must NOT replace AdsGram:
- **Referrals:** Organic growth through player recommendations
- **AdsGram:** Primary revenue for project sustainability
- Both serve different purposes

**See:** `.openhands/knowledge/referral-system.md` for complete growth systems specification.

## Achievement System

### Achievement Categories
Eight achievement categories covering all gameplay aspects:
- **Collection** — Artifact gathering, set completion, rarity collection
- **Battles** — Combat wins, streaks, era-specific, boss battles
- **Progression** — Level milestones, feature unlocks
- **Economy** — Currency earning, spending, marketplace
- **Social** — Friends, gift-giving, guilds, referrals
- **AdsGram** — Ad engagement achievements (all optional)
- **Activity** — Login streaks, daily completions, missions, events
- **Special** — Hidden discoveries, seasonal events, anniversaries

### Achievement Rarity Tiers
| Rarity | Difficulty | Reward Multiplier | Examples |
|--------|------------|-------------------|----------|
| Common | Very Easy | 1.0x | First artifact, first battle |
| Rare | Easy | 1.5x | 50 artifacts, 50 battles |
| Epic | Medium | 2.0x | 200 artifacts, 500 battles |
| Legendary | Hard | 3.0x | All artifacts, 1000 battles |

Total: 125 achievements (43 Common, 41 Rare, 32 Epic, 9 Legendary)

### Achievement Rewards
| Rarity | XP Range | Dust Range | Cosmetics |
|--------|----------|------------|----------|
| Common | 25-100 | 10-50 | — |
| Rare | 100-300 | 50-150 | Badge |
| Epic | 500-1500 | 250-750 | Badge + Frame |
| Legendary | 2000-5000 | 1000-2500 | Badge + Frame + Title |

### Hidden Achievements
Secret achievements discovered through natural gameplay:
- Lucky Find (first Mythic artifact)
- First Legendary, Serendipity (Epic duplicate)
- Market Windfall, Perfectionist, Scholar, Explorer
- Time Traveler (play at midnight on New Year)

### Achievement Statistics
- Total achievements completed
- Progress per category
- Rare achievements earned
- Highest achievement tier
- Multi-stage progress tracking

**See:** `.openhands/knowledge/achievements.md` for complete achievement specification.

## Title System

### Available Titles
Titles earned through achievements, displayed on player profiles:
- **Time Explorer** — World Traveler achievement (all eras unlocked)
- **Artifact Hunter** — Expert Collector achievement (100 artifacts)
- **Museum Curator** — Complete all museum sets
- **Battle Veteran** — 500 battle wins
- **Historian** — Read all museum entries
- **Guild Commander** — Become guild leader
- **Chrono Master** — Level 50 achievement
- **Collector** — Legendary Collector (all 82 artifacts)
- **Battle Legend** — 1000 battle wins
- **Economy Master** — Earn/spend 100,000 dust

### Title Display
- One active title at a time
- Select from all earned titles
- Displayed below player name on profile
- Visible in leaderboards and friend lists

**See:** `.openhands/knowledge/achievements.md` for complete title specification.

## Badge Collection

### Badge Categories
Collectible achievement badges organized by type:
- **Milestone Badges** — Reaching specific counts (10, 50, 100 wins)
- **Event Badges** — Participation in special events
- **Anniversary Badges** — Game anniversary celebrations
- **Limited-Time Badges** — Seasonal and promotional events
- **Rare Badges** — Hidden achievements, special discoveries

### Badge Display
- Players collect earned badges in Gallery
- Filter by category, rarity, earned status
- Sort by recent, rarity, name
- Badge showcase slots on profile (4 slots)

### Badge Rarity
| Rarity | Color | Examples |
|--------|-------|----------|
| Common | Gray | First Find, First Victory |
| Rare | Blue | Battle Veteran, 30-day streak |
| Epic | Purple | Expert Collector, Boss Crusher |
| Legendary | Gold | All artifacts, 1000 battles |

**See:** `.openhands/knowledge/achievements.md` for complete badge specification.

## Player Showcase

### Profile Showcase
Players display achievements in their profile:
- **Featured Title** — Selected from earned titles
- **Showcase Badges** — Up to 4 badges displayed
- **Active Frame** — Decorative profile border
- **Achievement Progress** — Total count and percentage

### Showcase Slots
| Slot | Unlocked By | Items Allowed |
|------|-------------|---------------|
| Badge Slot 1 | Default | Any badge |
| Badge Slot 2 | 10 achievements | Any badge |
| Badge Slot 3 | 30 achievements | Any badge |
| Badge Slot 4 | 50 achievements | Any badge |
| Frame | Epic achievement | Achievement frames |
| Title | Legendary achievement | Achievement titles |

### Achievement Gallery
- Complete list of all achievements
- Filter: All, Earned, Locked
- Sort: Recent, Rarity, Name
- Progress bar per category
- Multi-stage progress tracking

**See:** `.openhands/knowledge/achievements.md` for complete showcase specification.

## Achievement Long-Term Motivation

### Motivation Philosophy
Achievements provide long-term motivation without forcing grinding:
- **Reward Dedication** — Recognize sustained engagement
- **Celebrate Milestones** — Every accomplishment feels special
- **Encourage Exploration** — Guide players to discover features
- **Avoid Excessive Grinding** — Maximum caps prevent unhealthy patterns

### Goal Timelines
| Player Type | Goals | Retention Mechanism |
|-------------|-------|---------------------|
| Casual | Common/Rare, early milestones | Quick wins, daily engagement |
| Regular | Rare/Epic, mid milestones | Weekly/monthly goals |
| Hardcore | Epic/Legendary, late milestones | Long-term mastery |
| Collector | All collection achievements | Completionist drive |

### Anti-Burnout Guidelines
- No repetitive grinds beyond 100 actions
- Multiple paths to earn achievements
- Achievements align with natural play patterns
- Flexible completion requirements

**See:** `.openhands/knowledge/achievements.md` for complete philosophy specification.

## Support System

The Jolt Time support ecosystem provides players with accessible, responsive, and respectful assistance whenever they need help.

### Support Categories

- **Technical Issues** — App crashes, loading problems, feature malfunctions, connectivity
- **Account Problems** — Login difficulties, account recovery, profile updates, security concerns
- **Payment Questions** — Transaction confirmations, refund requests, subscription changes
- **Bug Reports** — Gameplay bugs, glitches, reward errors, UI issues
- **Gameplay Questions** — Feature explanations, progression guidance, strategy tips
- **Report Player** — Cheating, offensive content, abuse, suspicious activity
- **Suggestions and Feedback** — Feature ideas, quality-of-life requests, community feedback
- **AdsGram Support** — Missing ad rewards, reward discrepancies, advertising questions

### Ticket System

Players can create support requests, view history, receive status updates, and review solved cases. Tickets progress through statuses: Open → In Review → Waiting for Response → Resolved → Closed.

### Player Reports

Structured reporting for violations including cheating, offensive nicknames, abuse, suspicious activity, and inappropriate behavior. Simple evidence requirements (screenshots, descriptions, timestamps) balance thorough investigation with player convenience.

### Feedback Center

Players submit ideas, suggestions, and quality-of-life requests. All feedback receives acknowledgment and consideration. Contributors are credited when ideas are implemented.

### Support Statistics

- Total tickets (daily, weekly, monthly with trends)
- Average response time (target: under 4 hours first response)
- Solved cases with resolution rates
- Common issues identification for proactive solutions

### FAQ Philosophy

Frequently asked questions reduce support load while helping players find answers quickly. Categories include lost progress, login issues, reward problems, and event questions.

### Telegram Bot Notifications

Players receive notifications for ticket updates, solved requests, and important support responses. Maximum three support notifications per day. Never promotional. Players control notification preferences.

### Privacy Principles

Support staff access only necessary information, respect player privacy, and avoid unnecessary data exposure. Players maintain rights over their data.

**See:** `.openhands/knowledge/support-system.md` for complete support system specification.

## Backup System

Jolt Time maintains comprehensive backup infrastructure to protect player progress and ensure business continuity.

### Backup Philosophy

- **Protect Player Progress** — Every player achievement, collected artifact, and progression milestone must be preservable
- **Prevent Accidental Loss** — Implement safeguards against human error during maintenance operations
- **Support Recovery Procedures** — Document clear, tested recovery procedures for various failure scenarios

### Backup Categories

- **Database Backups** — Player accounts, inventories, museum collections, economy data, event progress, social data, quest progress, subscription records
- **Configuration Backups** — Game configuration, event configuration, economy configuration, system settings, Telegram bot settings, AdsGram configuration
- **Event Data Backups** — Active events, event history, seasonal content, tournament records
- **Analytics Backups** — Player analytics, economy analytics, AdsGram analytics, system performance metrics
- **Logs and Audit Backups** — Transaction logs, security logs, admin audit logs, deployment logs

### Backup Frequency

- **Daily Backups** — Full database snapshots, configuration captures, incremental logs (30-day retention minimum)
- **Weekly Backups** — Weekly full backups, analytics aggregation, economy and security audits (90-day retention minimum)
- **Long-Term Archives** — Monthly and yearly snapshots for historical preservation (7-year retention for financial data)

### Recovery Priorities

1. Player Accounts (highest priority)
2. Inventories
3. Museum Collections
4. Economy Data
5. Event Progress (lowest priority)

**See:** `.openhands/knowledge/backup-system.md` for complete backup system specification.

## Disaster Recovery

Jolt Time maintains disaster recovery capabilities to minimize player impact from system failures.

### Recovery Scenarios

- **Database Corruption** — Detection, isolation, clean backup restoration, transaction log application, integrity verification
- **Accidental Deletion** — Immediate response, backup restoration, reconciliation of missing transactions
- **Infrastructure Failures** — Failure assessment, service continuity activation, component recovery, verification
- **Deployment Issues** — Issue detection, rollback decision framework, version rollback, monitoring

### Recovery Procedures

All recovery procedures follow documented steps with verification checkpoints. Recovery operations require multiple team member verification. Post-recovery validation confirms system health before returning to service.

**See:** `.openhands/knowledge/backup-system.md` for complete disaster recovery specification.

## Rollback Procedures

Critical systems support safe, controlled rollback capabilities.

### Rollback Philosophy

- **Database Schema Changes** — Full rollback capability with up/down migration scripts tested before production
- **Configuration Changes** — Versioned configurations with instant rollback support and full audit trail
- **Economy Changes** — Rollback support for economy configurations with pre-change snapshots preserved
- **Feature Releases** — Feature flag rollback without code deployment, previous stable version maintained

### Version History

- All changes maintain complete version history
- Configuration versions are immutable once deployed
- Database migrations preserve previous states
- Rollback always returns to verified working state

**See:** `.openhands/knowledge/backup-system.md` for complete rollback specification.

## Data Protection

Jolt Time prioritizes data protection as a core operational principle.

### Protection Principles

- **Player Information Security** — Backups secured with restricted access, encryption at rest and in transit
- **Avoid Unnecessary Exposure** — Backups not used for analytics without sanitization, test environments use synthetic data
- **Respect Data Security** — GDPR-ready compliance, secure deletion of expired backups, regular security audits

### Protected Data Categories

- **Player Progress** — Accounts, inventories, collections, achievements, and progression
- **Economy Data** — Currency balances, transactions, marketplace records
- **AdsGram Records** — Reward history, ad completion records, monetization statistics
- **Telegram Bot Settings** — Notification schedules, reminder preferences, message templates
- **Audit Records** — Transaction logs, security logs, administrative action records

### Privacy Philosophy

- Personally identifiable information minimized in non-essential contexts
- Backup retention periods enforced automatically
- Cross-border data transfers subject to appropriate safeguards

**See:** `.openhands/knowledge/backup-system.md` for complete data protection specification.

## DevOps Infrastructure

Jolt Time maintains comprehensive DevOps infrastructure for reliable and efficient operations.

### Infrastructure Categories

- **Frontend Infrastructure** — Telegram Mini App hosting, static assets, CDN distribution, build artifacts
- **Backend Infrastructure** — API servers, business logic services, authentication, webhooks, background workers
- **Database Infrastructure** — Supabase PostgreSQL, connection pooling, query optimization, schema management
- **Telegram Bot Infrastructure** — Bot server, notification delivery, scheduled tasks, webhook integration
- **Monitoring Systems** — Application monitoring, infrastructure monitoring, alerting, dashboards

### Environment Structure

- **Development Environment** — Local development, relaxed constraints, frequent resets
- **Staging Environment** — Pre-production testing, mirrors production configuration, synthetic data
- **Production Environment** — Live game serving all players, restricted access, enhanced monitoring

**See:** `.openhands/knowledge/devops.md` for complete DevOps infrastructure specification.

## Deployment Systems

Jolt Time deployment practices prioritize stability and player experience.

### Deployment Philosophy

- **Minimize Downtime** — Rolling updates, backward-compatible migrations, health checks
- **Support Rollback Procedures** — Every deployment reversible, quick rollback capability (< 15 minutes)
- **Avoid Breaking Player Progress** — Schema changes never destroy data, backward-compatible APIs

### Deployment Safety

- Deployments during low-traffic windows when possible
- Staged rollouts across player segments
- Feature flags enable quick disable without redeployment
- Post-deployment monitoring for anomalies

**See:** `.openhands/knowledge/devops.md` for complete deployment systems specification.

## Monitoring Systems

Jolt Time monitors infrastructure and application health continuously.

### Monitoring Categories

- **Server Health** — Uptime, resource utilization, network metrics, process monitoring
- **API Performance** — Response times (P50, P95, P99), request volume, endpoint analysis, error rates
- **Database Performance** — Query performance, connection pool usage, storage metrics, backup status
- **Error Rate Monitoring** — Error classification, trend analysis, player impact assessment

### Logging Philosophy

- **Application Logs** — Request logging, error logging, business events, security events
- **Deployment Logs** — Deployment events, configuration changes, infrastructure changes
- **Critical Failures** — System crashes, data issues, security incidents, revenue impact

**See:** `.openhands/knowledge/devops.md` for complete monitoring systems specification.

## CI/CD Philosophy

Jolt Time uses continuous integration and deployment for efficient, safe releases.

### Pipeline Architecture

**Automated Testing:**
- Unit testing with 80%+ coverage for critical paths
- Integration testing with test database
- Smoke testing post-deployment

**Build Pipelines:**
- TypeScript compilation with strict mode
- Dependency verification and security scanning
- Docker image building for applicable services

**Deployment Pipelines:**
- Automated staging deployment on merge
- Canary release to initial player segment
- Progressive rollout with monitoring
- Automated rollback on failure detection

**See:** `.openhands/knowledge/devops.md` for complete CI/CD specification.

## Scalability Support

Jolt Time infrastructure designed for growth and expansion.

### Scalability Principles

- **Player Growth Support** — Horizontal scaling, database connection pooling, caching strategy, load balancing
- **Future Expansion Support** — Modular design, API gateway ready, event-driven architecture
- **Horizontal Growth** — Stateless services, shared nothing architecture, distributed caching, read replicas

### Supabase Scalability

- Automatic failover and high availability
- Connection handling and query optimization
- Regional deployment options for latency optimization

**See:** `.openhands/knowledge/devops.md` for complete scalability specification.

## API Architecture

Jolt Time maintains a robust API architecture for frontend-backend communication and third-party integrations.

### API Categories

- **Internal APIs** — Frontend API, Backend Services API, Bot API, Admin API, Webhook Handlers
- **External APIs** — Telegram Bot API, Telegram Mini Apps API, AdsGram API, Payment Provider APIs
- **Telegram APIs** — Bot API, Mini Apps API, Login Widget, Payments API, Passport API
- **Payment APIs** — Telegram Stars API, TON Connect API (future), Payment Webhooks, Subscription Management
- **Analytics APIs** — In-Game Analytics, AdsGram Analytics, Economy Analytics, Performance Analytics

### API Communication

- **Frontend-Backend** — RESTful API calls with Telegram initData authentication
- **Backend-Database** — Supabase client with connection pooling and transaction support
- **Backend-Bot** — Message queue for notifications, shared state for context
- **Bot-Telegram** — Direct Bot API calls, webhook receivers, file handling

**See:** `.openhands/knowledge/api-architecture.md` for complete API architecture specification.

## External Integrations

Jolt Time integrates with multiple external services for platform functionality.

### Integration Partners

- **Telegram Bot API** — Notifications, commands, callbacks, payments
- **Telegram Mini Apps** — In-game experience, user data, purchases, sharing
- **AdsGram** — Rewarded video ads, reward callbacks, completion verification, analytics
- **Supabase** — Database, authentication, real-time subscriptions, file storage
- **Telegram Stars** — In-app purchases, refunds, receipts, subscription management
- **TON Connect** — Future wallet integration, blockchain transactions, NFT support

### Integration Security

- All external API communication uses secure protocols (HTTPS)
- Webhook payloads verified for authenticity
- Rate limiting protects against external service abuse
- Comprehensive logging for integration debugging

**See:** `.openhands/knowledge/api-architecture.md` for complete external integrations specification.

## API Security

Jolt Time protects all API endpoints against common vulnerabilities and attacks.

### Security Measures

- **Request Protection** — HTTPS only, input validation, injection prevention, CSRF protection
- **Authentication Security** — Telegram initData validation, timestamp checks, session tokens
- **Sensitive Operations** — Additional verification for payments, account changes, destructive actions
- **Rate Limiting** — Abuse prevention, spam prevention, overload protection

### Authentication Architecture

- **Telegram Authentication** — initData validation with hash verification
- **Session Management** — Token-based sessions with expiration and refresh
- **Future Accounts** — Support for multi-platform login and account linking

**See:** `.openhands/knowledge/api-architecture.md` for complete API security specification.

## Service Communication

Jolt Time services communicate through well-defined interfaces for maintainability.

### Communication Patterns

- **Synchronous Communication** — Direct API calls for real-time responses
- **Asynchronous Communication** — Message queues for notifications and background tasks
- **Event-Driven Communication** — Game events trigger downstream processing
- **Shared State Access** — Services access shared data through Supabase

### Versioning and Responses

- **Versioning** — URL-based versioning for major versions, backward compatibility required
- **Response Format** — Consistent success/error format with predictable structure
- **Error Handling** — Categorized errors (400, 401, 403, 404, 429, 500) with recovery guidance

**See:** `.openhands/knowledge/api-architecture.md` for complete service communication specification.

## API Monitoring

Jolt Time monitors API health for optimal player experience.

### Monitoring Metrics

- **Response Times** — P50, P95, P99 latency per endpoint (< 200ms target for P95)
- **Failure Rates** — Error tracking by endpoint, type distribution, player impact
- **Endpoint Usage** — Request volumes, usage trends, optimization insights

### Performance Targets

- API responses < 200ms for P95
- Critical endpoints < 100ms for P95
- Database queries < 50ms for P95
- Slow query alerts for > 1s queries

**See:** `.openhands/knowledge/api-architecture.md` for complete API monitoring specification.

## Database Schema

Jolt Time maintains a comprehensive database architecture designed for scalability, maintainability, and long-term growth. The database is one of the most critical parts of the project.

**See:** `.openhands/knowledge/database-schema.md` for the complete Database Schema Master Plan.

### Database Categories

The Jolt Time database is organized into eight distinct categories:

- **Player Tables** — Core player identity, progression, settings, and statistics
- **Economy Tables** — Currencies, inventories, transactions, and marketplace systems
- **Museum Tables** — Artifacts, collections, evolution, and display systems
- **Event Tables** — Time-limited events, participation, and reward tracking
- **PvP Tables** — Battle history, rankings, tournaments, and ratings
- **Social Tables** — Friends, guilds, chats, and leaderboards
- **Analytics Tables** — Player metrics, monetization tracking, and AdsGram statistics
- **Administration Tables** — Audit logging, moderation, and system configuration

### Table Architecture

The database architecture follows these core principles:

- **Logical Separation** — Each category has distinct access patterns, retention policies, and scaling requirements
- **Reference Tables** — Static data (catalogs, definitions) separated from player-specific data
- **Immutable Ledgers** — Transaction tables never change — they only grow
- **Soft Deletes** — No data destruction — only deactivation via is_active flags
- **Extensibility** — JSONB columns enable optional data without schema changes

### Relationship Standards

Clear relationships prevent data anomalies and simplify queries:

- **One-to-One** — Primary key of parent is also the foreign key in child (e.g., profiles → player_stats)
- **One-to-Many** — Foreign key on the "many" side referencing the parent (e.g., profiles → player_artifacts)
- **Many-to-Many** — Junction table with two foreign keys (e.g., friendships, guild_memberships)

### Migration Philosophy

Migrations are first-class artifacts with full version control and rollback support:

- **Versioning** — Timestamp-based migration files (YYYYMMDDHHMMSS)
- **Safety Rules** — Always include DOWN migration, use CONCURRENTLY for large indexes, test before production
- **Zero-Downtime** — Multi-phase migrations: add nullable, backfill, add constraints
- **Verification** — Rollback procedures tested before production deployment

### Future Expansion

The schema supports future systems without major refactoring:

- **Sharding** — Horizontal partitioning for tables exceeding 100 million rows
- **Archival Tables** — Hot/warm/cold storage tiers with appropriate retention policies
- **Data Warehouses** — External analytics via BigQuery, ClickHouse, or S3 archival
- **Historical Snapshots** — Point-in-time state tracking for rollback and analysis

**See:** `.openhands/knowledge/database-schema.md` for complete database architecture specification.

## Supabase Tables

Jolt Time maintains comprehensive table specifications documenting every database table used by the project.

**See:** `.openhands/knowledge/supabase-tables.md` for the complete Supabase Tables reference.

## Realtime Architecture

Jolt Time leverages Supabase Realtime to provide live updates across the application. The Realtime Architecture defines how changes in the database are propagated to clients in real-time.

**See:** `.openhands/knowledge/realtime-architecture.md` for the complete Realtime Architecture specification.

### Realtime Categories

The Realtime system is organized into seven distinct categories:

- **Player Realtime** — Profile updates, progression, achievements, rewards
- **Museum Realtime** — Artifact discoveries, collection progress, exhibitions
- **Event Realtime** — Mission progress, event participation, seasonal updates
- **PvP Realtime** — Battle results, rankings, leaderboards, promotions
- **Guild Realtime** — Guild activity, progression, announcements, events
- **Notification Realtime** — Reward notifications, mission completion, system events
- **Analytics Realtime** — Session tracking, engagement metrics, retention events

### Architecture Layers

The Realtime Architecture consists of four distinct layers:

- **Client Layer** — Websocket connections, channel subscriptions, event filtering
- **Subscription Layer** — Channel management, permission validation, routing
- **Event Processing Layer** — Event transformation, prioritization, queuing
- **Database Event Layer** — PostgreSQL triggers, NOTIFY/pg_notify, event capture

### Subscription Management

Subscription management ensures efficient use of realtime infrastructure:

- **Lifecycle** — Pending, Active, Reconnecting, Paused, Terminated states
- **Creation** — Triggers based on user context and game state
- **Cleanup** — Automatic cleanup on disconnect, logout, or channel exit
- **Reconnection** — Exponential backoff with missed event replay

### Event Processing

Event processing ensures reliable and efficient event delivery:

- **Validation** — Authenticity, schema, permissions, rate limits, deduplication
- **Distribution** — Direct (1:1), Broadcast (1:N), Guild (1:M), Global (1:ALL)
- **Prioritization** — Critical (< 50ms), High (< 100ms), Medium (< 500ms), Low (< 2s)

### Realtime Security

Realtime security ensures data privacy and prevents abuse:

- **RLS Compatibility** — Row-Level Security policies apply to subscriptions
- **Permission Validation** — Authentication and access validation for all events
- **Event Isolation** — User, guild, event, and system event isolation

### Realtime Scalability

The architecture supports scaling from thousands to millions of users:

- **10K Users** — Basic Supabase Pro, minimal infrastructure
- **100K Users** — Horizontal scaling, subscription sharding, multi-region
- **1M+ Users** — Enterprise deployment, global CDN, distributed infrastructure

**See:** `.openhands/knowledge/realtime-architecture.md` for complete realtime architecture specification.

### Table Documentation

Every table is documented with:

- **Purpose** — What the table stores and why it exists
- **Primary Key Philosophy** — Key selection rationale
- **Relationships** — All foreign key connections
- **Important Fields** — Key columns with types and purposes

### Player Tables

- `profiles` — Primary player identity
- `player_stats` — Aggregated lifetime statistics
- `player_settings` — User preferences
- `player_progression` — Era and story progress
- `player_daily_state` — Daily reset state
- `player_achievements` — Unlocked achievements

### Economy Tables

- `currencies` — Currency definitions
- `player_currencies` — Per-player balances
- `transactions` — Immutable economic ledger
- `marketplace_listings` — Active marketplace
- `marketplace_transactions` — Completed trades
- `pack_definitions` — Purchasable pack templates

### Museum Tables

- `artifacts` — Artifact catalog
- `artifact_evolution_trees` — Evolution paths
- `player_artifacts` — Player inventory
- `museum_collections` — Collection definitions
- `player_museum_collections` — Collection progress
- `museum_displays` — Display slot definitions
- `player_museum_displays` — Museum layout

### Event Tables

- `events` — Event definitions
- `player_events` — Participation progress
- `event_rewards` — Reward tier definitions
- `player_event_rewards` — Claimed rewards
- `battle_pass_seasons` — Season definitions
- `player_battle_pass` — Season progress

### PvP Tables

- `battle_history` — Match records
- `player_rankings` — Current rank info
- `leagues` — League definitions
- `leaderboards` — Leaderboard configurations
- `leaderboard_snapshots` — Historical snapshots
- `tournaments` — Tournament definitions
- `player_tournaments` — Tournament participation

### Social Tables

- `friendships` — Friend relationships
- `friend_requests` — Pending requests
- `guilds` — Guild data
- `guild_members` — Membership records
- `guild_ranks` — Rank definitions
- `guild_applications` — Pending applications
- `chat_rooms` — Chat room definitions
- `chat_messages` — Chat history

### Analytics Tables

- `player_session_logs` — Session tracking (DAU)
- `player_retention_events` — Retention milestones
- `revenue_events` — Purchase events
- `ads_views` — AdsGram view records
- `ads_statistics` — Aggregated ad metrics
- `user_ad_settings` — Ad preferences
- `economy_snapshots` — Periodic economy state

### Admin Tables

- `admin_audit_log` — Sensitive operation audit
- `moderation_actions` — Moderation actions
- `system_settings` — Feature flags
- `data_exports` — GDPR export requests
- `bot_users` — Telegram bot users
- `bot_logs` — Bot operation logs
- `notification_cooldowns` — Rate limiting
- `notification_queue` — Deferred notifications
- `cron_job_status` — Job tracking

### Row-Level Security Philosophy

Every table follows RLS principles:

- **Player Access** — Players can only access their own data via `auth.uid() = user_id`
- **Admin Access** — Service role bypasses RLS for administrative operations
- **Protected Tables** — `transactions`, `ads_views`, `battle_history` only accept service role inserts
- **Public Tables** — Reference tables (`currencies`, `artifacts`, `events`) are publicly readable

### Database Reference

**Related Documentation:**
- `knowledge/database-schema.md` — Database architecture philosophy
- `knowledge/supabase-tables.md` — Complete table specifications
- `knowledge/adsgram.md` — AdsGram integration
- `knowledge/backup-system.md` — Backup procedures

## Localization System

Jolt Time is designed for international players with comprehensive localization support.

### Localization Categories

- **Interface Localization** — Navigation, buttons, forms, tooltips, error messages, settings
- **Story Localization** — Historical narratives, character dialogues, artifact lore, museum descriptions
- **Event Localization** — Event names, rules, rewards, achievements, leaderboard labels
- **Notification Localization** — Daily reminders, event alerts, achievement messages, streak reminders
- **Educational Content Localization** — Historical facts, cultural context, era backgrounds, biographies

### Translation Philosophy

- **Preserve Meaning** — Semantic equivalence, contextual accuracy, educational value maintained
- **Natural Language** — Idioms appropriate to target language, cultural adaptation, native expression
- **Avoid Machine-Like Wording** — Human review, native speaker validation, consistent voice

**See:** `.openhands/knowledge/localization.md` for complete localization system specification.

## Internationalization Support

Jolt Time supports multiple languages with consistent quality and cultural sensitivity.

### Supported Languages

**Initial Languages:**
- Ukrainian (uk) — Primary market, full localization
- English (en) — Global fallback, full localization
- Polish, German, Spanish, French — Secondary languages

**Future Languages:**
- Portuguese, Italian, Japanese, Korean, Chinese Simplified
- Arabic, Hebrew — RTL language support planned

### Language Architecture

- Modular translation file structure per language
- Consistent key naming conventions across all translations
- Fallback chain support (missing → English)
- Easy language addition through established pipeline

**See:** `.openhands/knowledge/localization.md` for complete internationalization specification.

## Multi-Language Infrastructure

Jolt Time's infrastructure supports language detection, preference storage, and dynamic content localization.

### Language Infrastructure

- **Language Detection** — Telegram user language, player profile preference, browser settings
- **Preference Storage** — Language stored in Supabase user profile, respects player choice
- **Dynamic Content** — All bot notifications in player language, dates/times localized

### Date and Time Localization

- **Time Zones** — Player time zone stored, all times in local time, auto-detection available
- **Regional Formats** — Date formats (US/EU/ISO), number formatting, currency display
- **Standards Compliance** — Unicode, CLDR locale data, ISO date/time standards

**See:** `.openhands/knowledge/localization.md` for complete multi-language infrastructure specification.

## Accessibility System

Jolt Time is designed to be comfortable for as many players as possible. Accessibility improvements benefit all users, not only specific groups.

### Accessibility Categories

- **Visual Accessibility** — Scalable text, high contrast themes, clear iconography, color-blind friendly design
- **Text Accessibility** — Readable fonts, consistent terminology, simple language, 4.5:1+ contrast ratios
- **Input Accessibility** — 44x44px minimum touch targets, tap alternatives to swipes, keyboard navigation
- **Cognitive Accessibility** — Clear progression, gradual mechanic introduction, memory aids, undo support
- **Notification Accessibility** — Concise messages (160 char max), frequency caps, plain language, user control

**See:** `.openhands/knowledge/accessibility.md` for complete accessibility specification.

### Inclusive UX

Jolt Time prioritizes clarity, welcome, and accessibility-first design:

- **Universal Design** — Design for the majority; accommodate the margins
- **Clear Navigation** — Consistent patterns, obvious hierarchy, breadcrumb trails
- **Understandable Layouts** — Visual grouping, progressive disclosure, adequate white space
- **Simple Language** — Plain English default, explained jargon, consistent terminology
- **Mobile Accessibility** — One-handed usage, touch-friendly elements, responsive layouts
- **Optional Features** — Larger text scaling (125%/150%/200%), reduced animations, simplified beginner mode

### Accessibility Settings

Player-configurable accessibility options:

- **Theme Selection** — Dark (default), light, system-follow options
- **Text Scaling** — 100%, 125%, 150%, 200% with live preview
- **Reduced Motion** — Toggle to disable decorative animations
- **High Contrast Mode** — Enhanced contrast for bright environments
- **Simplified Interface** — Beginner mode with hidden complexity
- **Notification Preferences** — Per-category controls, quiet hours, digest option

### Mobile Accessibility

Telegram Mini App mobile-first accessibility:

- **One-Handed Usage** — Bottom navigation, thumb-reachable actions, easy back navigation
- **Touch-Friendly** — 48px minimum primary buttons, extended tap areas, gesture alternatives
- **Responsive** — Adapts to all Telegram-supported screens, respects safe areas, supports orientation

**See:** `.openhands/knowledge/accessibility.md` for complete mobile accessibility specification.

## Regional Expansion

Jolt Time plans for future international growth and regional customization.

### Future Expansion

- **Regional Events** — Local holiday events, cultural celebrations, regional historical themes
- **Local Partnerships** — Educational institutions, cultural organizations, historical societies
- **Country-Specific Campaigns** — Targeted marketing, local influencers, regional press

### Accessibility Philosophy

- **Readable Text** — Clear fonts, appropriate sizes, sufficient contrast, scalable options
- **Understandable Language** — Simple sentence structure, explained jargon, consistent terminology
- **Inclusive Terminology** — Cultural inclusivity, gender-neutral language, respectful representation

### Historical Content Philosophy

- **Respectful Representation** — Cultural sensitivity, balanced perspectives, inclusive language
- **Avoid Cultural Bias** — Multiple viewpoints, non-Eurocentric focus, diverse contributions
- **Preserve Educational Value** — Accurate information, expert verification, source attribution

**See:** `.openhands/knowledge/localization.md` for complete regional expansion specification.

## Performance Optimization

Jolt Time should feel fast, responsive, and stable on both modern and older mobile devices. Performance always has higher priority than unnecessary visual complexity.

### Loading Systems

- **Progressive Loading** — Show meaningful content immediately, skeleton screens within 100ms
- **Feedback During Loading** — Loading indicators, progress bars, optimistic UI
- **Avoiding Blank Screens** — Cached content, fallback content, error recovery
- **Startup Speed** — Minimal bootstrap JS, preconnect to Telegram CDN, signal ready quickly

**See:** `.openhands/knowledge/performance.md` for complete loading systems specification.

### Caching Philosophy

- **Local Caching** — Service worker for static assets, local storage for preferences, memory cache for frequently accessed data
- **API Caching** — Response caching with ETag support, stale-while-revalidate, cache-control headers
- **Asset Caching** — Immutable assets with long-term cache, image caching, bundle splitting

**See:** `.openhands/knowledge/performance.md` for complete caching architecture specification.

### Mobile Performance

- **Older Device Support** — Target 2018-era mid-range devices, graceful degradation, feature detection
- **Low Memory Handling** — Stay under 150MB RAM typical, 200MB maximum, stream large data
- **Unstable Connections** — Offline capability, retry logic, queue operations, incremental loading
- **60fps Target** — Maintain smooth frame rate, GPU-accelerated animations, no layout thrashing

**See:** `.openhands/knowledge/performance.md` for complete mobile performance specification.

### Performance Metrics

- **Loading Times** — FCP under 1.5s, LCP under 2.5s, TTI under 3.5s, CLS under 0.1
- **API Response Times** — Median under 100ms, 95th percentile under 200ms, error rate under 0.1%
- **Rendering Speed** — 60fps target, frame time 16.67ms, paint under 8ms
- **Continuous Monitoring** — Real user monitoring, synthetic monitoring, regression prevention

**See:** `.openhands/knowledge/performance.md` for complete performance metrics specification.

### Telegram Mini App Performance

- **Mini App Launch** — Full initialization under 2 seconds, early hints, streaming HTML
- **Navigation Speed** — Instant navigation with skeletons, prefetch routes, keep-alive state
- **User Interactions** — Touch response within 100ms, haptic feedback, smooth scrolling

**See:** `.openhands/knowledge/performance.md` for complete Telegram Mini App optimization specification.

### AdsGram Performance

- **Reliable Loading** — Preload ads in reward flow, parallel loading, timeout handling, fallback ads
- **Non-Blocking** — Background loading, instant reward grant, clear skip option
- **Graceful Recovery** — Auto-retry with backoff, grant reward if ad fails, fallback content

**See:** `.openhands/knowledge/performance.md` for complete AdsGram performance specification.

### Failure Handling

- **Slow Connections** — Fixed timeout budgets, progress indication, quality reduction
- **API Failures** — Graceful degradation, circuit breakers, fallback data, clear error messages
- **Temporary Outages** — Offline mode, queue operations, read-only fallback, auto-recovery

**See:** `.openhands/knowledge/performance.md` for complete failure handling specification.

### Future Performance Expansion

- **CDN Support** — Edge caching, geographic distribution, origin shield (future)
- **Advanced Caching** — Predictive cache, ML-based prefetching, user profiles (future)
- **Offline Mode** — Full offline core, background sync, conflict resolution (future)
- **Predictive Loading** — Behavior analysis, route prefetching, dynamic bundles (future)

**See:** `.openhands/knowledge/performance.md` for complete future expansion specification.

## Offline Support

Jolt Time is primarily an online experience. However, temporary internet interruptions should not create a frustrating user experience.

### Offline Mode

- **Temporary Offline** — Seamless transition within 2-3 seconds, non-intrusive status indicator, core gameplay continues
- **Cached Data** — Player profile, museum data, settings, previously loaded content available offline
- **Read-Only Access** — View collections, browse content, review progress during offline
- **Action Queuing** — All player actions saved to local queue immediately for later sync

**See:** `.openhands/knowledge/offline-system.md` for complete offline mode specification.

### Synchronization System

- **Safe Sync** — Sequential processing, server validation, failure isolation
- **Duplicate Prevention** — Idempotency keys, server-side deduplication, reward locks
- **Conflict Resolution** — Server authority, last-write-wins default, merge strategy
- **Rollback Support** — Ability to rollback failed sync operations

**See:** `.openhands/knowledge/offline-system.md` for complete synchronization specification.

### Connection Recovery

- **Auto Reconnection** — Network detection, heartbeat checks, quick retry with backoff
- **Retry Mechanisms** — Exponential backoff with jitter, maximum retry limits, circuit breaker
- **Recovery Notifications** — Connection restored toast, sync progress, completion confirmation
- **Partial Sync** — Sync incrementally as data becomes available

**See:** `.openhands/knowledge/offline-system.md` for complete connection recovery specification.

### Cached Data Philosophy

- **Local Cache** — Service worker for static assets, localStorage for preferences, IndexedDB for structured data
- **Cache Integrity** — Verify cache contents before use, handle stale data gracefully
- **Cache Management** — Respect browser storage quotas, allow user cache clearing
- **Content Distribution** — Previously loaded historical content, images, UI components cached

**See:** `.openhands/knowledge/offline-system.md` for complete cached data philosophy.

### Data Integrity

- **Inventory Protection** — Server authority, ownership verification, atomic transactions
- **Currency Protection** — Balance validation, negative prevention, concurrent update safety
- **Progression Protection** — XP validation, level verification, anti-exploit measures

**See:** `.openhands/knowledge/offline-system.md` for complete data integrity specification.

### Telegram Mini App Limitations

- **Requires Internet** — Real-time gameplay, AdsGram ads, multiplayer, marketplace, purchases
- **Unavailable Offline** — New artifact collection, quest progression, live events, guild activities
- **Available Offline** — Browse cached content, view collections, review progress, edit settings

**See:** `.openhands/knowledge/offline-system.md` for complete limitations documentation.

### Future Offline Expansion

- **Offline Collections** — Enhanced catalog browsing, collection management, wishlist editing
- **Advanced Local Storage** — IndexedDB migration, structured data, query capability
- **Background Synchronization** — Service worker sync, periodic sync, push sync
- **Partial Offline Gameplay** — Single-player mode, offline quests, practice mode

**See:** `.openhands/knowledge/offline-system.md` for complete future expansion specification.

## Testing Strategy

Quality should always have higher priority than release speed. Player trust depends on stability and reliability.

### Testing Categories

- **Unit Testing** — Component isolation, pure function testing, edge case coverage, 80%+ coverage for critical paths
- **Integration Testing** — API integration, service integration, database operations, Telegram/Supabase integration
- **UI Testing** — User flows, form validation, navigation, state management, responsive design
- **Regression Testing** — Feature parity, API compatibility, database migrations, cross-browser/platform testing
- **Manual QA** — Gameplay review, edge cases, usability, localization verification, exploratory testing
- **Load Testing** — Baseline performance, stress/spike/soak testing, concurrency testing

**See:** `.openhands/knowledge/testing.md` for complete testing categories specification.

### QA Systems

- **Quality Philosophy** — Prioritize stability, reduce bugs, protect player progress
- **Test Environments** — Development (local), Staging (production mirror), Production (canary deployment)
- **Bug Severity** — Critical (data loss, exploits), High (major features broken), Medium (workarounds exist), Low (minor issues)
- **Test Metrics** — Discovered/resolved bugs, release quality, regression frequency

**See:** `.openhands/knowledge/testing.md` for complete QA systems specification.

### Regression Protection

Protect critical player systems from regressions:

- **Inventory Protection** — Item operations, quantity changes, concurrent access, audit trail
- **Economy Protection** — Currency operations, balance limits, transaction atomicity, rate limiting
- **Reward Protection** — Delivery verification, duplicate prevention, reward limits, rollback recovery
- **Progression Protection** — XP/level calculations, prestige, achievements, progress persistence

**See:** `.openhands/knowledge/testing.md` for complete regression protection specification.

### Release Validation

- **Major Systems Review** — Architecture, security, performance, accessibility, migration, integration reviews
- **Critical Bug Resolution** — Zero critical bugs, zero high bugs on main path before release
- **Rollback Procedures** — Automated rollback, database rollback, feature flag rollback, communication plan
- **Release Criteria** — Clear criteria must be met before any release

**See:** `.openhands/knowledge/testing.md` for complete release validation specification.

### Performance Testing

- **Loading Speed** — FCP under 1.5s, TTI under 3.5s, LCP under 2.5s, bundle size budget
- **API Performance** — Median under 100ms, P95 under 200ms, query optimization
- **Stability Under Load** — Concurrent users, sustained load, memory/CPU stability, graceful degradation

**See:** `.openhands/knowledge/testing.md` for complete performance testing specification.

### AdsGram QA

- **Reward Delivery** — Successful reward grant, correct amounts, currency update, idempotency verification
- **Callback Validation** — Signature verification, server-side validation, replay prevention, fraud detection
- **Failed Ad Recovery** — Retry mechanism, user notification, skip option, fallback content

**See:** `.openhands/knowledge/testing.md` for complete AdsGram QA specification.

### Telegram Bot Testing

- **Notifications** — Message delivery, correct content, timing, user preferences, format validation
- **Scheduled Events** — Event triggering, timezone handling, concurrent events, missed event handling
- **Reminder Systems** — Reminder delivery, snooze/dismiss handling, quiet hours

**See:** `.openhands/knowledge/testing.md` for complete Telegram bot testing specification.

### Future QA Expansion

- **Automated UI Tests** — End-to-end automation, cross-platform testing, visual comparison, CI integration
- **AI-Assisted Testing** — Bug prediction, test generation, flaky test detection, log analysis
- **Visual Regression Testing** — Screenshot comparison, responsive/theme/localization testing
- **Continuous Quality Monitoring** — Real-time monitoring, alerting, trend analysis, quality dashboards

**See:** `.openhands/knowledge/testing.md` for complete future QA expansion specification.

## Documentation Standards

Documentation is one of the most valuable assets of the project. Good documentation simplifies development, onboarding, and long-term maintenance.

### Documentation Philosophy

- **Clarity** — Simple language, active voice, short sentences, concrete examples
- **Organization** — Logical structure, consistent format, clear hierarchy, cross-references
- **Future Support** — Context-rich, decision history, assumptions documented, troubleshooting included

**See:** `.openhands/knowledge/documentation.md` for complete documentation philosophy.

### Knowledge Base Structure

- **Feature Documents** — Overview, specifications, user flows, technical design, API reference, testing notes
- **Architecture Documents** — System overview, component specs, data flow, integration, decisions
- **Guides** — Getting started, setup, deployment, troubleshooting, contributing, style guide
- **Reference Materials** — API reference, database schema, configuration, glossary, cheatsheets

**See:** `.openhands/knowledge/documentation.md` for complete knowledge base structure.

### Documentation Categories

- **Game Design** — Game concept, feature specs, user flows, balance rules, content specs
- **Technical** — Architecture, components, data flow, security, performance, code organization
- **API** — Endpoints, examples, authentication, rate limits, errors, versioning
- **Database** — Schema, tables, relationships, migrations, data dictionary
- **DevOps** — Deployment, configuration, monitoring, incident response, scaling
- **Business** — Analytics, monetization, AdsGram infrastructure, legal compliance

**See:** `.openhands/knowledge/documentation.md` for complete category specifications.

### Writing Standards

- **Consistent Terminology** — Single glossary, same term for same concept, defined abbreviations
- **Avoid Ambiguity** — Specific not general, concrete not abstract, complete sentences
- **Easy to Understand** — 6th grade reading level, short paragraphs, headers for navigation

**See:** `.openhands/knowledge/documentation.md` for complete writing standards.

### Documentation Versioning

- **Updates** — Living documents, update responsibility, review cycles, staleness prevention
- **Change History** — Revision log, change dates/authors/reasons, major changes highlighted
- **Future Revisions** — Review triggers, deprecation notices, archive process, feedback loop

**See:** `.openhands/knowledge/documentation.md` for complete versioning philosophy.

### Developer Onboarding

- **Project Architecture** — System components, data flow, technology stack, external services
- **Folder Structure** — Root organization, naming conventions, code organization, assets
- **Core Systems** — Getting started, key abstractions, common patterns, debugging tips

**See:** `.openhands/knowledge/documentation.md` for complete onboarding documentation.

### Cross-Reference Philosophy

- **Related Systems** — Explicit links, dependency notes, interaction patterns
- **Dependencies** — External/internal dependencies, version requirements, fallback behavior
- **Future Features** — Planned features, extensibility points, known limitations

**See:** `.openhands/knowledge/documentation.md` for complete cross-reference philosophy.

### Documentation Metrics

- **Coverage** — Feature coverage, API coverage, critical path documentation
- **Staleness** — Tracking, thresholds, automated detection
- **Update Frequency** — Update rate, response time, update quality

**See:** `.openhands/knowledge/documentation.md` for complete metrics specification.

### Future Documentation Expansion

- **Auto Generation** — Code comments to docs, API spec generation, schema documentation
- **AI Assistant** — Chat interface, search enhancement, doc completeness suggestions
- **Contributor Portal** — Community wiki, discussion forums, contribution workflow
- **Interactive Knowledge Base** — Runnable examples, interactive diagrams, searchable

**See:** `.openhands/knowledge/documentation.md` for complete future expansion specification.

## Project Roadmap

Roadmaps provide direction without restricting future creativity. The project evolves gradually and sustainably.

### Development Phases

- **Phase 1 — Core Gameplay** — Core loop, first era (Mesopotamia), Telegram integration, basic UI, shard system
- **Phase 2 — Social Systems** — Friends, guilds, leaderboards, daily systems, notifications, community events
- **Phase 3 — Competitive Features** — PvP arena, tournaments, guild battles, expeditions, ranked seasons
- **Phase 4 — Economy Expansion** — Battle pass, artifact evolution, museum system, marketplace, premium cosmetics
- **Phase 5 — Global Ecosystem** — Creator system, global events, educational partnerships, cross-platform, API ecosystem

**See:** `.openhands/knowledge/roadmap.md` for complete development phases specification.

### Milestone Planning

- **Realistic Goals** — Honest assessment, buffer time, scope control, risk awareness
- **Quality Priority** — No rushing, testing standards, performance budgets, bug standards
- **Long-Term Growth** — Technical debt management, scalability, flexibility, team health

**See:** `.openhands/knowledge/roadmap.md` for complete milestone philosophy.

### Priority Categories

- **Critical Systems** — Core loop, Telegram Mini App, database, authentication, basic economy, error handling
- **Core Features** — Era progression, artifact collection, daily systems, UI, notifications, leaderboards
- **Quality-of-Life** — Settings, tutorial, help system, accessibility, offline support, performance
- **Experimental** — New ideas needing validation before promotion
- **Future Vision** — Web3, creator tools, educational programs, cross-platform, global events

**See:** `.openhands/knowledge/roadmap.md` for complete priority categories.

### Feature Classification

- **Implemented** — Fully functional, tested, documented, supported, stable, monitored
- **Planned** — Specifications written, scope defined, resources considered, priority set
- **In Development** — Active work, testing, documentation, review, iteration, stabilization
- **Future Vision** — Exploratory, validated need, rough direction, no commitment, flexibility

**See:** `.openhands/knowledge/roadmap.md` for complete feature classification.

### Release Philosophy

- **No Rushing** — Feature freeze, buffer time, scope adjustment over rushing
- **Stability Priority** — Testing requirements, performance thresholds, rollback plan, gradual rollout
- **Player Trust** — Transparency, data safety, reward integrity, fair play, consistency

**See:** `.openhands/knowledge/roadmap.md` for complete release philosophy.

### Community Feedback

- **Player Feedback** — Listening channels, sentiment analysis, specific requests, response
- **Analytics** — Usage metrics, funnel analysis, engagement, retention, monetization
- **Project Goals** — Vision alignment, strategic fit, resource efficiency, long-term view

**See:** `.openhands/knowledge/roadmap.md` for complete community feedback philosophy.

### Success Metrics

- **Player Growth** — DAU/MAU, new users, growth rate, geographic distribution
- **Retention** — Day 1/7/30 retention, churn rate, engagement trend, session duration
- **Feature Adoption** — Feature usage, engagement, retention, drop-off points
- **Community** — Social mentions, in-game social, content creation, NPS score

**See:** `.openhands/knowledge/roadmap.md` for complete success metrics.

### Future Vision

- **Global Events** — Cross-time events, community goals, real-time events, cultural celebrations
- **Creator Ecosystem** — Custom artifacts, story content, event creation, guide creation
- **Web3 Features** — NFT artifacts, true ownership, trading platform, provenance (optional)
- **Partnerships** — Museum partners, educational institutions, cultural organizations
- **Educational Programs** — Curriculum integration, museum programs, teacher resources

**See:** `.openhands/knowledge/roadmap.md` for complete future vision specification.

### Business Growth

- **AdsGram** — Integration maintenance, reward integrity, user experience, revenue optimization
- **Subscriptions** — Jolt Time Plus, value proposition, subscriber experience, retention
- **Telegram Stars** — Purchase flow, product catalog, pricing strategy, transaction handling

**See:** `.openhands/knowledge/roadmap.md` for complete business growth specification.

### Technical Growth

- **Scalability** — Horizontal scaling, database scaling, CDN usage, caching layers, queues
- **Maintainability** — Clean code, documentation, testing, code review, technical debt
- **Modular Architecture** — Service boundaries, loose coupling, API contracts, feature flags

**See:** `.openhands/knowledge/roadmap.md` for complete technical growth specification.

## AI Systems

Jolt Time approaches AI as a future enhancement layer designed to improve player experience without replacing player agency.

### AI Philosophy

- **Assist, Don't Replace:** AI enhances experience while preserving player creativity and achievement
- **Improve UX, Don't Manipulate:** AI optimizes for satisfaction, not psychological manipulation
- **Support Developers:** AI reduces manual work for routine operational tasks
- **Transparency:** Players know when AI is involved in decisions

### AI Systems Architecture

Jolt Time's AI ecosystem consists of multiple specialized AI systems working together:

**See:** `.openhands/knowledge/ai-ecosystem-master-plan.md` for the complete AI ecosystem master plan.

- **AI Ecosystem Master Plan** — Unified architecture connecting all AI systems
- **AI Governance Framework** — Standards, auditing, safety, and review processes
- **AI Safety Framework** — Hallucination mitigation, integrity, and quality controls
- **AI Intelligence Layer** — Analytics, revenue intelligence, and predictive systems
- **AI Expansion Roadmap** — Future AI system integration roadmap
- **AI Platform Vision** — Long-term AI strategy for Jolt Time

### AI Systems (Cycles 151-160)

**See:** `.openhands/knowledge/ai-historian-architecture.md` for complete AI Historian architecture.

- **AI Historian Architecture** — Historical knowledge companion (Cycle 151)
- **Historical Knowledge Framework** — Educational AI Systems
- **Educational AI Systems** — Learning systems and content
- **AI Safety Standards** — Safety and quality standards for historical AI

**See:** `.openhands/knowledge/ai-museum-guide-architecture.md` for complete AI Museum Guide architecture.

- **AI Museum Guide Architecture** — Museum navigation and collection guidance (Cycle 152)
- **Museum Recommendation Framework** — Personalized exhibit and collection suggestions
- **Museum Personalization Systems** — Collection interest tracking and adaptation
- **Museum AI Safety Standards** — Museum AI quality and accuracy standards
- **AI Museum Analytics** — Museum AI engagement and effectiveness tracking

**See:** `.openhands/knowledge/ai-content-generator-architecture.md` for complete AI Content Generator architecture.

- **AI Content Generator Architecture** — Central content generation engine (Cycle 153)
- **Content Validation Framework** — Quality assurance for generated content
- **AI Content Governance** — Approval pipelines and review processes
- **Historical Content Generation Systems** — Historical fact and narrative generation
- **AI Content Analytics** — Content generation metrics and performance

**See:** `.openhands/knowledge/ai-event-designer-architecture.md` for complete AI Event Designer architecture.

- **AI Event Designer Architecture** — Intelligent LiveOps assistance (Cycle 154)
- **Event Generation Framework** — Event objective, reward, and progression generation
- **AI Event Governance** — Event quality and safety controls
- **LiveOps AI Systems** — Event optimization and campaign intelligence
- **Event Analytics** — Event performance and engagement metrics

**See:** `.openhands/knowledge/ai-support-assistant-architecture.md` for complete AI Support Assistant architecture.

- **AI Support Assistant Architecture** — First-line player support system (Cycle 155)
- **Support Escalation Framework** — Human escalation and complex issue routing
- **AI Support Governance** — Support quality and consistency standards
- **Knowledge Management Systems** — Support documentation and knowledge bases
- **Support Analytics** — Support volume, resolution, and satisfaction metrics

**See:** `.openhands/knowledge/ai-moderation-architecture.md` for complete AI Moderation architecture.

- **AI Moderation Architecture** — Community safety and health monitoring (Cycle 156)
- **Community Safety Framework** — Toxicity and abuse detection
- **AI Moderation Governance** — Moderation quality and fairness controls
- **Human Moderator Integration** — AI-assisted human moderation workflows
- **Moderation Analytics** — Moderation volume and community health metrics

**See:** `.openhands/knowledge/ai-analytics-architecture.md` for complete AI Analytics architecture.

- **AI Analytics Architecture** — Comprehensive analytics platform (Cycle 157)
- **Predictive Intelligence Framework** — Forecasting and risk detection
- **AI Insight Generation Systems** — Automated insight and anomaly detection
- **AI Analytics Governance** — Analytics quality and validation standards
- **Ecosystem Intelligence Layer** — Cross-system intelligence integration

**See:** `.openhands/knowledge/ai-personalization-architecture.md` for complete AI Personalization architecture.

- **AI Personalization Architecture** — Adaptive experience layer (Cycle 158)
- **Adaptive Experience Framework** — Player-adaptive content and recommendations
- **Recommendation Engine Systems** — Content, event, and progression recommendations
- **Personalization Governance** — Fairness, transparency, and privacy controls
- **Personalization Analytics** — Recommendation effectiveness and engagement metrics

**See:** `.openhands/knowledge/ai-quest-generator-architecture.md` for complete AI Quest Generator architecture.

- **AI Quest Generator Architecture** — Dynamic mission generation engine (Cycle 159)
- **Quest Validation Framework** — Quality, educational, and gameplay validation
- **Quest Balancing Systems** — Difficulty and reward balancing
- **AI Quest Governance** — Quest approval and quality controls
- **Quest Analytics** — Quest completion and engagement metrics

### AI Assistant

In-app AI assistant helping players with:

- Tutorial guidance and FAQs
- Museum and event explanations
- Troubleshooting and support
- Historical knowledge and educational content

Interface: Chat-style within app, accessible from help menu.

### Recommendation Systems

Personalized suggestions for:

- Missions aligned with player progress
- Events matching player interests
- Museum improvements and educational content
- Collection development and artifact acquisition

Principles: Player-first recommendations, transparent logic, non-invasive delivery.

### AI Analytics

Operational intelligence supporting game development:

- Balance analysis and anomaly detection
- Retention pattern identification
- Trend detection across player segments
- Revenue forecasting and optimization
- Player behavior prediction

All analytics use aggregated data; individual player privacy preserved.

### AI Moderation

Community safety support with human oversight:

- Spam detection and suspicious behavior flagging
- Report prioritization for faster response
- Pre-screening of user-generated content

Human moderators review all AI flags; appeals always involve humans.

**See:** `.openhands/knowledge/ai-systems.md` for complete AI system specifications.

## Project Vision

This document describes what Jolt Time stands for and why the project exists. It serves as a reference for all future decisions.

**Core Philosophy:** Jolt Time exists to make history exciting, accessible, and fun for everyone. Learning about the past should feel like an adventure, not a chore.

### Mission Statement

- **Why Jolt Time Exists** — Spark curiosity about history, democratize knowledge, build lasting memories
- **Value Provided** — Engaging historical experiences, collection satisfaction, social connections, educational value
- **What Makes It Unique** — Time travel framework, collectible depth, social experience, universal appeal

**See:** `.openhands/knowledge/project-vision.md` for complete mission statement.

### Core Principles

- **Accessibility** — Everyone deserves to play; mobile-first, free-to-play, multiple languages
- **Fairness** — No pay-to-win; cosmetics only; equal opportunity
- **Educational Value** — Accurate history, inspire curiosity, teach cause and effect
- **Long-Term Sustainability** — Sustainable monetization, regular content, stable infrastructure
- **Respect for Players** — No dark patterns, honest communication, genuine appreciation

**See:** `.openhands/knowledge/project-vision.md` for complete core principles.

### Player Philosophy

- **Reward Curiosity** — Hidden content, historical facts, achievements encourage exploration
- **Encourage Collecting** — Artifacts tell stories, collections have goals, rarity creates excitement
- **Promote Positive Communities** — Guilds foster teamwork, events bring players together, no toxic mechanics

**See:** `.openhands/knowledge/project-vision.md` for complete player philosophy.

### Historical Philosophy

- **Respectful** — Cultures portrayed with nuance, sensitivity readers review content
- **Educational Value** — Verified facts, context, primary sources inspire research
- **Avoid Misinformation** — Corrections addressed promptly, expert consultants review content

**See:** `.openhands/knowledge/project-vision.md` for complete historical philosophy.

## Historical Content Pipeline

Jolt Time maintains rigorous standards for historical content creation and review.

### Content Categories

| Category | Purpose | Priority |
|----------|---------|----------|
| **Historical Artifacts** | Real artifacts with accurate descriptions | Highest |
| **Historical Events** | Real events in engaging presentation | Highest |
| **Educational Articles** | In-depth historical context | Medium |
| **Museum Descriptions** | Concise summaries for collected items | High |

### Content Creation Workflow

```
Research → Drafting → Review → Publication → Maintenance
```

- **Research:** Source identification, verification, cultural sensitivity review
- **Drafting:** Initial creation, lore integration, accessibility formatting
- **Review:** Historical review, editorial review, cultural review, gameplay review
- **Publication:** QA pass, localization prep, asset integration
- **Maintenance:** Accuracy monitoring, player feedback, periodic audits

**See:** `.openhands/knowledge/historical-content.md` for complete content pipeline specifications.

### Educational Content Standards

- **Accuracy Over Speed:** New eras release only when content is verified
- **Quality Over Quantity:** Fewer well-crafted artifacts beats many shallow ones
- **Learning Over Gating:** Historical context enhances rather than blocks progress
- **Source Requirements:** Primary sources preferred, peer-reviewed for controversial topics

### Historical Review Process

All content undergoes multi-layer review:

| Review Type | Focus | Reviewers |
|-------------|-------|-----------|
| Historical Review | Factual accuracy | Historical consultants |
| Editorial Review | Writing quality | Content editors |
| Cultural Review | Sensitivity | Cultural advisors |
| Gameplay Review | Integration | Game designers |

### Museum Content Guidelines

Descriptions follow strict guidelines:

- **Length:** 50-150 words
- **Structure:** Hook → Context → Significance
- **Tone:** Engaging but informative
- **Reading Level:** 13+

**See:** `.openhands/knowledge/historical-content.md` for museum content standards.

### Monetization Philosophy

- **Core Principle** — Monetization enhances but never gate-keeps; no pay-to-win ever
- **AdsGram** — Rewarded ads optional, generous rewards, frequency caps, no gameplay interruption
- **Telegram Stars** — Premium cosmetics, battle pass, event content
- **Subscriptions** — Jolt Time Plus comfort/convenience only, no competitive advantages

**See:** `.openhands/knowledge/project-vision.md` for complete monetization philosophy.

### Community Philosophy

- **Cooperation** — Guilds require teamwork, community goals celebrated together
- **Creativity** — Customization options, museum display creativity, multiple playstyles
- **Healthy Competition** — Leaderboards inspire without hostility, sportsmanship rewarded

**See:** `.openhands/knowledge/project-vision.md` for complete community philosophy.

### Technical Philosophy

- **Maintainability** — Well-documented, consistent patterns, modular architecture
- **Scalability** — Horizontal scaling, CDN, caching, graceful traffic handling
- **Reliability** — 99.9%+ uptime, automatic failover, data integrity guarantees

**See:** `.openhands/knowledge/project-vision.md` for complete technical philosophy.

### Content Philosophy

- **Consistent Universe** — Time travel logic consistent, era authenticity maintained
- **Preserve Quality** — Every new feature meets standards, UI consistency
- **Avoid Feature Overload** — New features serve clear purposes, core loop understandable

**See:** `.openhands/knowledge/project-vision.md` for complete content philosophy.

### Growth Philosophy

- **Grow Gradually** — Phased rollout, lessons learned, sustainable pace
- **Quality Over Speed** — No rushing, testing takes time, polish distinguishes good from great
- **Protect Trust** — Promises kept, transparency, consistent quality

**See:** `.openhands/knowledge/project-vision.md` for complete growth philosophy.

### Future Vision

- **Global Communities** — Worldwide events, cultural exchange, regional celebrations
- **Educational Partnerships** — Museum collaborations, school curriculum, teacher resources
- **Creator Ecosystems** — Custom artifacts, community content, strategy guides
- **Web3 Features** — NFT artifacts, true ownership, optional participation (future)

**See:** `.openhands/knowledge/project-vision.md` for complete future vision.

### Decision-Making Philosophy

- **Player Feedback** — Multiple channels, sentiment analysis, community managers
- **Analytics** — Usage patterns, funnel analysis, retention signals
- **Long-Term Health** — Technical debt weighed, feature bloat avoided, sustainability prioritized

**See:** `.openhands/knowledge/project-vision.md` for complete decision-making philosophy.

### Legacy Philosophy

- **Memorable** — Unique experiences, emotional connections, friendships formed
- **Educational** — Curiosity sparked, facts remembered, appreciation for cultures
- **Sustainable** — Stable foundation, loyal community, business sustainability

**See:** `.openhands/knowledge/project-vision.md` for complete legacy philosophy.

### Guiding Questions

When facing difficult decisions, Jolt Time asks:
- Does this serve the player?
- Does this respect the player's time?
- Does this maintain trust?
- Does this preserve quality?
- Does this fit the vision?

**See:** `.openhands/knowledge/project-vision.md` for complete guiding questions.

## State Management Architecture

Jolt Time uses Zustand for state management with a modular, domain-driven architecture.

### Zustand Stores

| Store | File | Responsibility |
|-------|------|----------------|
| Player Store | `src/stores/playerStore.ts` | Profile, statistics, progression, status |
| Economy Store | `src/stores/economyStore.ts` | Currencies, inventory, rewards, marketplace |
| Museum Store | `src/stores/museumStore.ts` | Collections, artifacts, decorations |
| Event Store | `src/stores/eventStore.ts` | Active events, missions, event progress |
| PvP Store | `src/stores/pvpStore.ts` | Arena, tournaments, rankings |
| Social Store | `src/stores/socialStore.ts` | Friends, guilds, leaderboards, referrals |
| Settings Store | `src/stores/settingsStore.ts` | Game, display, and account settings |
| UI Store | `src/stores/uiStore.ts` | Modals, loading, notifications, temporary states |

**See:** `.openhands/knowledge/state-management.md` for complete architecture specification.

### Persistent State Philosophy

- **Persistent Data:** Player, Economy, Museum, and Settings stores sync to Supabase on meaningful changes
- **Temporary Data:** UI and matchmaking states exist only during the session
- **Session Data:** Form drafts, expanded sections survive navigation but not app restart

### UI State Management

The UI Store handles all ephemeral presentation state:

- **Modals:** Type-safe modal stack with props passthrough
- **Loading States:** Hierarchical loading (global, screen, operation)
- **Notifications:** Toast queue with auto-dismiss and manual dismissal
- **Temporary Selections:** Item selections, drag state, form drafts

## Component Library

Jolt Time maintains a comprehensive React component library for consistent UI implementation.

### UI Architecture

| Layer | Responsibility |
|-------|----------------|
| Base Components | Primitives (Button, Input, Card, Badge, Avatar, Progress) |
| Layout Components | Page structure (PageLayout, Section, Grid, Container) |
| Form Components | User input (TextField, Select, Checkbox, Slider, Toggle) |
| Game Components | Game UI (ArtifactCard, MissionCard, BattleCard, CurrencyDisplay) |
| Social Components | Social features (FriendCard, GuildCard, LeaderboardEntry) |
| Modal Components | Overlays (ConfirmModal, RewardPopup, InfoModal) |
| Navigation Components | App navigation (BottomNav, Header, Tabs, Breadcrumbs) |

**See:** `.openhands/knowledge/component-library.md` for complete component specifications.

### Reusable Components

All components follow consistent patterns:

- **Composability** — Small components combine into larger ones
- **Single Responsibility** — Each component does one thing well
- **TypeScript Types** — Full type safety with documented prop interfaces
- **CSS Variables** — Theme integration via design tokens

### Design Consistency Standards

- **Visual Language:** Premium dark futuristic with cyan (#00D9FF) primary, mint (#00FFE5) accent, gold (#FFD700) premium
- **Glow Effects:** Soft glow on interactive elements, consistent shadow system
- **Animation:** Standard timings (150ms/250ms/400ms) with ease-out easing
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, screen reader support

**See:** `.openhands/knowledge/ui-style.md` for complete design standards.

## React Hooks Architecture

Jolt Time uses a comprehensive React hooks architecture to bridge components with business logic, state management, and platform integrations.

### Hook Categories

| Category | Purpose | Location | Examples |
|----------|---------|----------|----------|
| **Data Hooks** | Fetch domain data | `hooks/data/` | `usePlayer`, `useMuseum`, `useEvents` |
| **Feature Hooks** | Feature business logic | `features/*/hooks/` | `useBattle`, `useGuild`, `useMarketplace` |
| **Telegram Hooks** | Platform integration | `hooks/telegram/` | `useTelegramUser`, `useTelegramTheme`, `useTelegramBackButton` |
| **UI Hooks** | UI state management | `hooks/ui/` | `useModal`, `useToast`, `useForm`, `usePagination` |
| **Analytics Hooks** | Tracking and metrics | `hooks/analytics/` | `useAnalytics`, `useEventTracking`, `useAdsTracking` |
| **Utility Hooks** | Generic utilities | `hooks/utils/` | `useDebounce`, `useLocalStorage`, `useCountdown` |

### Data Hooks

Data hooks provide access to domain data through Zustand stores and Supabase:

| Hook | Store | Purpose |
|------|-------|---------|
| `usePlayer` | Player Store | Player profile and progression |
| `useMuseum` | Museum Store | Museum and collections |
| `useInventory` | Economy Store | Inventory and items |
| `useEvents` | Event Store | Active events and missions |
| `useLeaderboard` | Social Store | Rankings and scores |
| `useEnergy` | Player Store | Energy state and management |
| `useCurrency` | Economy Store | Currency balances |
| `useGuild` | Social Store | Guild membership |
| `useFriends` | Social Store | Friends list |

### Telegram Hooks

Telegram hooks provide access to the Telegram Web App SDK:

| Hook | Purpose |
|------|---------|
| `useTelegramUser` | Access Telegram user information |
| `useTelegramTheme` | Theme and color scheme |
| `useTelegramViewport` | Viewport dimensions and changes |
| `useTelegramBackButton` | Back button control |
| `useTelegramShare` | Share functionality |
| `useTelegramHaptic` | Haptic feedback |
| `useTelegramMainButton` | Main button control |
| `useTelegramStorage` | Telegram storage access |

### Analytics Hooks

Analytics hooks support tracking and monetization monitoring:

| Hook | Purpose |
|------|---------|
| `useAnalytics` | Central tracking interface |
| `useEventTracking` | Game event participation tracking |
| `useAdsTracking` | AdsGram ad views and revenue tracking |
| `useScreenTracking` | Screen view tracking |
| `useMonetizationTracking` | Revenue and conversion tracking |

### Hook Standards

| Standard | Pattern |
|----------|---------|
| **Naming** | `use{Entity}` or `useTelegram{Feature}` or `use{UIElement}` |
| **State** | Always expose `isLoading`, `error`, `isError` |
| **Actions** | Always expose `refetch`, `retry` for async hooks |
| **Types** | Export full TypeScript types for all hooks |

### Hook Philosophy

- **Single Responsibility** — Each hook does one thing well
- **Composability** — Hooks compose with other hooks
- **Predictability** — Same inputs produce same outputs
- **Testability** — Every hook is testable in isolation

**See:** `.openhands/knowledge/react-hooks.md` for complete hooks architecture specification.

## Services Layer Architecture

The Services Layer is the business logic core of Jolt Time, acting as the intermediary between UI/hooks and data/external systems.

### Service Architecture

| Category | Services | Purpose |
|---------|----------|---------|
| **Player Services** | ProfileService, ProgressionService, SettingsService, StatisticsService | Player identity and progression |
| **Economy Services** | CurrencyService, RewardService, InventoryService, MarketplaceService | In-game economy |
| **Museum Services** | ArtifactService, CollectionService, ExhibitionService, MuseumExpansionService | Museum and artifacts |
| **Event Services** | EventService, MissionService, RewardDistributionService, SeasonalEventService | Events and missions |
| **PvP Services** | BattleService, TournamentService, RankingService, MatchmakingService | Competitive gameplay |
| **Social Services** | FriendsService, GuildService, ReferralService, LeaderboardService | Social features |
| **Telegram Services** | TelegramUserService, TelegramNotificationService, TelegramDeepLinkService | Telegram integration |
| **Analytics Services** | AnalyticsService, RetentionService, MonetizationService, AdsGramAnalyticsService | Tracking and metrics |

### Business Logic Layer

```
Components → Hooks → Services → Repositories/External APIs
```

**Key Rules:**
- Components NEVER call Supabase, AdsGram, or Telegram directly
- All business logic flows through services
- Services use repositories for data access
- Services use external APIs for platform integration

### Service Communication

| From | To | Communication |
|------|-----|---------------|
| Hook | Service | Method call |
| Service | Repository | Interface call |
| Service | External API | SDK call |
| Service | Other Service | Limited cross-calls |

### Transaction Management

Services manage atomic operations:

| Operation Type | Transaction Required |
|---------------|---------------------|
| Currency transfer | Yes (debit + credit) |
| Inventory update | Yes (remove + add) |
| Reward distribution | Yes (multi-currency) |
| Level up | Yes (XP + level + rewards) |
| Single read/update | No |

### Service Categories

- **Game Services:** Player, Economy, Museum, Events, PvP
- **Platform Services:** Social, Telegram, Analytics
- **Utility Services:** Common patterns, validators

**See:** `.openhands/knowledge/services-layer.md` for complete services architecture specification.

## Repository Pattern Architecture

The Repository Pattern establishes Jolt Time's **Data Access Layer** — the exclusive pathway for all database operations. This architectural decision ensures complete isolation between business logic and data persistence.

### Core Architecture

```
Components → Hooks → Services → Repositories → Supabase
```

**Key Rules:**
- Services MUST NEVER communicate directly with Supabase
- All database operations MUST pass through repositories
- Repositories encapsulate all data access logic
- Repositories hide database implementation details

### Repository Categories

| Category | Repositories | Domain |
|----------|-------------|--------|
| **Player Repositories** | ProfileRepository, StatisticsRepository, SettingsRepository, ProgressionRepository | Player identity and state |
| **Economy Repositories** | CurrencyRepository, InventoryRepository, TransactionRepository, MarketplaceRepository | In-game economy |
| **Museum Repositories** | ArtifactRepository, CollectionRepository, MuseumRepository, ExhibitionRepository | Museum and artifacts |
| **Event Repositories** | EventRepository, MissionRepository, RewardRepository, SeasonRepository | Event systems |
| **PvP Repositories** | BattleRepository, TournamentRepository, RankingRepository, MatchmakingRepository | Competitive gameplay |
| **Social Repositories** | FriendRepository, GuildRepository, LeaderboardRepository, ChatRepository | Social features |
| **Analytics Repositories** | AnalyticsRepository, RetentionRepository, MonetizationRepository, AdsRepository | Data and metrics |

### Folder Structure

```
src/
└── repositories/
    ├── base/                    # Base classes and interfaces
    │   ├── BaseRepository.ts
    │   └── RepositoryInterface.ts
    ├── player/                  # Player domain
    ├── economy/                 # Economy domain
    ├── museum/                  # Museum domain
    ├── events/                  # Events domain
    ├── pvp/                     # PvP domain
    ├── social/                 # Social domain
    ├── analytics/              # Analytics domain
    └── infrastructure/          # Cache and client infrastructure
```

### Repository Interface Standards

All repositories follow consistent patterns:

| Standard | Pattern |
|----------|---------|
| **Naming** | `{Entity}Repository` (e.g., `ProfileRepository`) |
| **Singleton** | Factory function `get{Entity}Repository()` |
| **Return Types** | `T \| null` for single, `T[]` for multiple, `boolean` for operations |
| **Error Handling** | Repositories handle errors and return safe defaults |
| **Data Mapping** | Private mapping methods transform database rows to domain objects |

### Data Access Layer

Repositories interact with Supabase through standardized patterns:

| Pattern | Usage |
|---------|-------|
| `select()` | Read operations with filtering |
| `insert()` | Create new records |
| `update()` | Modify existing records |
| `upsert()` | Create or update |
| `rpc()` | Complex business logic via stored procedures |
| Edge Functions | External API calls |

### Infrastructure Isolation

The Repository Layer provides complete infrastructure isolation:

| Benefit | Description |
|---------|-------------|
| **Database Independence** | Switch databases without rewriting services |
| **Schema Flexibility** | Evolve database without affecting business logic |
| **Performance Tuning** | Optimize queries without service changes |
| **Caching Support** | Add cache layer without modifying services |

### Error Handling

Repositories normalize database errors:

```typescript
// Standardized error handling pattern
async getById(id: string): Promise<Entity | null> {
  const { data, error } = await this.supabase
    .from(this.tableName)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Repository: Error fetching ${this.tableName}:`, error);
    return null;
  }

  return data ? this.mapRow(data) : null;
}
```

### Transaction Management

Repositories support atomic operations:

| Operation | Pattern |
|-----------|---------|
| Single operation | Direct query |
| Multi-step | `supabase.rpc()` with transaction |
| Cross-table | Database-level transactions |

### Testing Support

Repositories are designed for independent testing:

- **Dependency Injection:** Supabase client is injectable
- **Mock-Friendly:** Clear method contracts
- **Isolated:** No cross-dependencies between repositories

### Caching Philosophy

Repositories support future caching implementations:

- **Local Cache:** Browser localStorage support
- **Memory Cache:** Session-level caching
- **Distributed Cache:** Redis-based caching ready

**See:** `.openhands/knowledge/repository-pattern.md` for complete repository architecture specification.

## API Client Layer Architecture

The API Client Layer establishes Jolt Time's **External Communication Gateway** — a unified system for all requests to external services, databases, and third-party platforms.

### Core Architecture

```
Services → Repositories → API Clients → External Systems
```

**Key Rules:**
- Repositories and Services MUST NEVER directly construct raw requests
- All communication with external systems MUST pass through standardized API Clients
- API Clients centralize configuration, authentication, and error handling

### API Client Categories

| Category | Client | Purpose |
|----------|--------|---------|
| **Database Client** | SupabaseClient | PostgreSQL database access |
| **RPC Client** | RpcClient | Supabase RPC function execution |
| **Edge Client** | EdgeFunctionClient | Edge Function invocation |
| **Platform Client** | TelegramClient | Telegram Bot API integration |
| **Monetization Client** | AdsGramClient | AdsGram SDK communication |
| **Analytics Client** | AnalyticsClient | Event tracking and metrics |

### Folder Structure

```
src/
├── api/
│   ├── base/                    # Base classes and interfaces
│   │   ├── BaseClient.ts
│   │   ├── ClientConfig.ts
│   │   └── types.ts
│   ├── supabase/               # Database clients
│   ├── rpc/                    # RPC client
│   ├── edge-functions/         # Edge function client
│   ├── telegram/               # Telegram client
│   ├── adsgram/                # AdsGram client
│   └── analytics/              # Analytics client
```

### External Communication Layer

API Clients manage all external communications:

| Client | External System | Communication |
|--------|----------------|---------------|
| SupabaseClient | Supabase PostgreSQL | Database queries |
| RpcClient | Supabase RPC Functions | Stored procedures |
| EdgeFunctionClient | Supabase Edge Functions | Serverless functions |
| TelegramClient | Telegram Bot API | Bot messages, updates |
| AdsGramClient | AdsGram SDK | Ad requests, rewards |
| AnalyticsClient | Analytics Backend | Event tracking |

### Request Lifecycle

| Stage | Description |
|-------|-------------|
| **Request Creation** | Build request, add auth headers, serialize data |
| **Validation** | Validate parameters, check required fields |
| **Execution** | Apply retry policy, execute HTTP request |
| **Response Handling** | Parse response, normalize data format |
| **Result Return** | Return typed result, log, update metrics |

### Response Standards

All API Clients follow standardized response patterns:

| Response Type | Format |
|--------------|--------|
| **Success** | `{ success: true, data: T, metadata?: ResponseMetadata }` |
| **Error** | `{ success: false, error: { code, message, details } }` |
| **Paginated** | `{ items: T[], total, page, pageSize, hasMore }` |

### Authentication Philosophy

API Clients manage authentication consistently:

- **Session Management:** Token storage, refresh, and lifecycle
- **Token Handling:** JWT validation, refresh tokens
- **Secure Communications:** HTTPS-only, certificate validation

### Error Handling

All clients implement standardized error handling:

| Error Type | Code | Retryable |
|------------|------|-----------|
| NetworkError | NETWORK_ERROR | Yes |
| TimeoutError | TIMEOUT | Yes |
| AuthenticationError | AUTH_ERROR | No |
| RateLimitError | RATE_LIMIT | Yes |
| ApiError | API_ERROR | Depends |

### Performance Optimization

API Clients support performance optimization:

- **Request Deduplication:** Prevent duplicate simultaneous requests
- **Caching:** Local, memory, and distributed cache support
- **Request Batching:** Batch multiple requests into single call
- **Network Optimization:** Compression, connection pooling

**See:** `.openhands/knowledge/api-client-layer.md` for complete API client architecture specification.

## Error Handling System Architecture

The Error Handling System establishes Jolt Time's standardized approach to managing errors across all application layers.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Standardization** | All errors follow consistent patterns |
| **Predictability** | Errors are traceable and diagnostic |
| **User-Friendliness** | Players never see raw technical errors |
| **Recoverability** | Errors support appropriate recovery strategies |

### Error Categories

| Category | Layer | Description |
|----------|-------|-------------|
| **UI Errors** | Presentation | Component rendering issues |
| **Validation Errors** | Business Logic | Input validation failures |
| **Service Errors** | Service Layer | Business logic failures |
| **Repository Errors** | Data Layer | Data access failures |
| **API Errors** | External Layer | External service failures |
| **Database Errors** | Data Layer | Supabase failures |
| **Telegram Errors** | Platform Layer | Telegram API failures |
| **External Service Errors** | Integration Layer | Third-party failures |

### Error Severity Levels

| Level | Name | Behavior | Example |
|-------|------|----------|---------|
| **1** | Critical | Immediate alert, halt operation | Database crash |
| **2** | High | Alert logged, operation failed | Payment failure |
| **3** | Medium | Error logged, fallback activated | Cache miss |
| **4** | Low | Error logged, operation continued | Analytics miss |
| **5** | Informational | Logged for tracking | User action |

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| **Components** | Display error messages, provide retry options |
| **Hooks** | Transform errors, manage error state |
| **Stores** | Global error state, error boundaries |
| **Services** | Business rule validation, error translation |
| **Repositories** | Data access errors, DB error translation |
| **API Clients** | External errors, circuit breakers |

### Error Response Structure

```typescript
interface JoltError {
  id: string;              // Unique trace identifier
  code: string;           // Machine-readable error code
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: LocalizedMessage;  // User-friendly message
  recoverable: boolean;
  recoveryAction?: RecoveryAction;
  timestamp: Date;
  traceId: string;        // For log correlation
}
```

### Retry Strategy

| Strategy | When Used | Behavior |
|----------|-----------|----------|
| **Automatic Retry** | Transient failures | System retries with backoff |
| **Manual Retry** | After auto-retry exhausted | User clicks retry button |
| **No Retry** | Non-recoverable | Show error message |

### Network Error Handling

| State | Detection | Handling |
|-------|-----------|----------|
| **Online** | navigator.onLine | Normal operation |
| **Offline** | !navigator.onLine | Queue operations, show offline UI |
| **Slow** | High latency | Increase timeouts |
| **Unstable** | Frequent disconnects | Reduce requests, cache aggressively |

### Monitoring Philosophy

| Aspect | Purpose |
|--------|---------|
| **Logging** | Record all errors with context |
| **Tracking** | Error frequency and distribution |
| **Diagnostics** | Debug support with trace IDs |
| **Alerting** | Future threshold-based alerts |

**See:** `.openhands/knowledge/error-handling.md` for complete error handling system specification.

## Validation Layer Architecture

The Validation Layer is the centralized authority for validating all data entering or leaving the Jolt Time system.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Prevention** | Stop invalid operations before they affect game state |
| **Integrity** | Protect economic balance and data consistency |
| **UX Guidance** | Provide clear, actionable feedback to users |

### Validation Categories

| Category | Layer | Purpose |
|----------|-------|---------|
| **UI Validation** | Presentation | Real-time user input feedback |
| **Form Validation** | Presentation | Structured form submission validation |
| **Business Validation** | Service | Game-specific rules enforcement |
| **API Validation** | Integration | Client-server communication validation |
| **Database Validation** | Persistence | Entity and relationship integrity |
| **Security Validation** | Infrastructure | Permission, fraud, and abuse prevention |

### Business Validation

Game-specific validation rules govern player actions:

| Domain | Examples |
|--------|----------|
| **Economy** | Currency spending, earning caps, conversions |
| **Rewards** | Daily rewards, achievement claims, ad rewards |
| **Inventory** | Item add/remove, equip requirements, stack limits |
| **Progression** | Level gates, era unlocks, feature prerequisites |
| **Marketplace** | Listing creation, purchases, price bounds |

### Security Validation

| Check Type | Purpose |
|------------|---------|
| **Permission Checks** | Resource access authorization |
| **Role Checks** | Operation authorization by player role |
| **Fraud Prevention** | Speed cheating, macro detection, impossible actions |
| **Abuse Prevention** | Rate limiting, spam detection |

### Validation Standards

All validation follows consistent standards:

- **Results:** Standardized success/warning/failure/recovery outcomes
- **Naming:** Predictable validator and error code patterns
- **Testing:** Independently testable rules with edge case coverage
- **Logging:** All validation failures logged for diagnostics

### Telegram Platform Validation

| Validation | Purpose |
|------------|---------|
| **Init Data** | Telegram authentication verification |
| **Deep Links** | Direct navigation target validation |
| **Referrals** | Referral fraud prevention |
| **Sharing** | Share attribution and reward validation |

### AdsGram Monetization Validation

Revenue integrity validation for ad rewards:

- **Reward Validation:** Amount, type, eligibility verification
- **Callback Validation:** Cryptographic signature verification
- **Duplicate Prevention:** Database constraints, idempotency keys
- **Monetization Integrity:** View, impression, click validation

**See:** `.openhands/knowledge/validation-layer.md` for complete validation layer architecture specification.

## Data Integrity Rules

Data integrity is enforced at multiple layers:

| Layer | Enforcement |
|-------|-------------|
| **Database** | NOT NULL, UNIQUE, CHECK constraints; foreign keys |
| **Application** | Repository validation, business rule enforcement |
| **API** | Request/response schema validation, type safety |
| **Client** | UI validation, form validation |

**See:** `.openhands/knowledge/validation-layer.md` for complete data integrity rules.

## Shared Types Architecture

The Shared Types Architecture establishes TypeScript as the single source of truth for all data structures across the Jolt Time project.

### Type Categories

| Category | Purpose |
|----------|---------|
| **Domain Models** | Core business entities (Player, Artifact, Museum, Event, Guild, Season) |
| **DTOs** | Data Transfer Objects for layer communication |
| **API Contracts** | API response, RPC, Edge Function, Telegram integration types |
| **Database Types** | Table models, query results, database entities |
| **UI Types** | Forms, components, modals, navigation |
| **Shared Utility Types** | Pagination, sorting, filtering, metadata, status |

### Folder Structure

```
src/types/
├── domain/      # Core business entities
├── dto/         # Data Transfer Objects
├── api/         # API contract types
├── database/    # Database entity types
├── ui/          # Presentation layer types
└── shared/      # Cross-cutting utility types
```

### Type Standards

| Standard | Description |
|----------|-------------|
| **Predictability** | Consistent naming, structure, and behavior |
| **Safety** | Strict mode, no implicit any, exhaustive checks |
| **Maintainability** | Single source of truth, clear documentation |

### Domain Models

Core business entities following standardized patterns:

| Domain | Models |
|--------|--------|
| **Player** | Player, PlayerStats, PlayerPreferences |
| **Artifact** | Artifact, ArtifactDefinition, ArtifactSet |
| **Museum** | Museum, DisplaySlot, Collection |
| **Economy** | Currency, Transaction, Wallet |
| **Event** | GameEvent, Season, Tournament |
| **Guild** | Guild, GuildMember, GuildRole |

### API Contracts

Standardized response wrappers:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}
```

### DTO Standards

| DTO Type | Purpose |
|----------|---------|
| **Request DTOs** | Client → Server data transfer |
| **Response DTOs** | Server → Client data transfer |
| **Payload DTOs** | Service → Service communication |
| **Transport DTOs** | External system communication |

### AdsGram Types

Monetization types for revenue system:

- **Reward Events:** AdRewardEvent, AdRewardClaimed
- **Monetization Tracking:** MonetizationEvent, MonetizationSummary
- **Ad Responses:** AdShowResponse, AdRewardResponse
- **Reward Verification:** RewardVerificationRequest, RewardVerificationResult

**See:** `.openhands/knowledge/shared-types.md` for complete shared types architecture specification.

## Feature Module Structure

The Feature Module Architecture organizes Jolt Time around independent business domains.

### Module Categories

| Module | Purpose |
|--------|---------|
| **Player Module** | Profile, progression, achievements, statistics |
| **Museum Module** | Artifacts, collections, exhibitions, museum expansion |
| **Economy Module** | Currencies, inventory, rewards, transactions |
| **Event Module** | Missions, events, seasons, event rewards |
| **PvP Module** | Battles, rankings, leagues, seasons |
| **Guild Module** | Guild management, members, activities, progression |
| **Marketplace Module** | Listings, purchases, sales, analytics |
| **Settings Module** | Preferences, notifications, privacy, account |

### Standard Module Structure

```
src/features/{module}/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # Business logic services
├── repositories/   # Data access layer
├── stores/         # Zustand state management
├── types/          # TypeScript type definitions
├── pages/          # Page components
├── utils/          # Module-specific utilities
└── constants/      # Module-specific constants
```

### Module Standards

| Standard | Description |
|----------|-------------|
| **Ownership** | Modules own their complete business logic |
| **Isolation** | Minimize cross-module dependencies |
| **Scalability** | Modules scale independently |

### Dependency Rules

| Rule | Implementation |
|------|---------------|
| **Allowed** | Shared resources, domain types, utilities |
| **Forbidden** | Direct module-to-module imports |
| **Communication** | Event-based, service facades, shared state |

### Module Scalability

| Scale | Approach |
|-------|----------|
| **10 modules** | Single `features/` directory |
| **50 modules** | Domain grouping (social/, combat/) |
| **100+ modules** | Independent npm packages |

### AdsGram Integration

Modules support optional monetization:

- **Reward Hooks:** `useAdReward()` per module
- **Analytics:** Monetization event tracking
- **Validation:** Server-side reward verification

**See:** `.openhands/knowledge/feature-modules.md` for complete feature module architecture specification.

## Frontend Coding Standards

The Frontend Coding Standards establish official guidelines for all frontend development in Jolt Time.

### Standards Categories

| Category | Purpose |
|----------|---------|
| **React Standards** | Component structure, responsibilities, composition |
| **TypeScript Standards** | Strict typing, interfaces, type safety |
| **Component Standards** | Reusable, feature, and shared components |
| **Hook Standards** | Logic encapsulation, reusability |
| **State Management Standards** | Zustand stores, selectors, persistence |
| **Styling Standards** | Design system, responsive layouts, accessibility |
| **Testing Standards** | Unit, component, integration tests |

### Coding Philosophy

| Principle | Description |
|-----------|-------------|
| **Readable** | Code expresses intent clearly |
| **Maintainable** | Easy to understand and modify |
| **Scalable** | Supports feature growth |
| **Predictable** | Consistent patterns throughout |

### TypeScript Standards

| Requirement | Implementation |
|-------------|----------------|
| **Strict Mode** | TypeScript strict mode enabled |
| **No Implicit Any** | All types explicitly defined |
| **Interface Usage** | Interfaces for object shapes |
| **Type Guards** | Runtime type validation |

### Component Standards

| Type | Location | Responsibility |
|------|----------|----------------|
| **UI Components** | `components/ui/` | Design system primitives |
| **Feature Components** | `features/{feature}/components/` | Feature-specific UI |
| **Shared Components** | `components/shared/` | Cross-feature components |

### State Management

| Pattern | Standard |
|---------|----------|
| **Store Access** | `useStore(state => state.property)` |
| **Persistence** | Zustand persist middleware |
| **Updates** | Immutable state updates |

### Service Layer

Components communicate through hooks and services:

```
Component → Hook → Service → Repository
```

Components MUST NOT access repositories directly.

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PlayerCard` |
| Hooks | use prefix | `usePlayer` |
| Services | PascalCase | `PlayerService` |
| Types | PascalCase | `Player` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ENERGY` |

### Performance Standards

| Technique | When to Use |
|-----------|-------------|
| **useCallback** | Callbacks in dependency arrays |
| **useMemo** | Computed values from state |
| **React.memo** | Pure components with props |
| **Lazy Loading** | Heavy pages and components |

### Error Handling

| Pattern | Standard |
|---------|----------|
| **User Errors** | User-friendly messages |
| **Recovery** | Provide recovery actions |
| **Boundaries** | Graceful degradation |

**See:** `.openhands/knowledge/frontend-coding-standards.md` for complete frontend coding standards.

## Design System

The Jolt Time design system establishes visual language and global standards ensuring consistency across all application surfaces.

### UI Tokens

| Token Category | Examples | Implementation |
|----------------|----------|----------------|
| **Colors** | `--primary: #00D9FF`, `--bg-card: #131B2E` | CSS custom properties |
| **Typography** | `--font-size-h1: 28px`, `--line-height-body: 1.5` | CSS custom properties |
| **Spacing** | `--space-4: 16px`, `--space-8: 32px` | 8px base unit system |
| **Border Radius** | `--radius-md: 12px`, `--radius-lg: 16px` | Consistent corner scales |
| **Shadows** | `--shadow-md`, `--shadow-glow` | Elevation levels |
| **Animation** | `--duration-normal: 250ms`, `--ease-out` | Standardized timing |

**See:** `.openhands/knowledge/design-system.md` for complete token specifications.

### Theme Support

The design system supports multiple themes:

- **Dark Theme (Default):** Premium dark futuristic with deep blue-black backgrounds
- **Light Theme (Future):** Optional implementation with adjusted contrast
- **Seasonal Themes (Future):** Limited-time event visual treatments
- **Premium Themes (Future):** Subscriber-exclusive visual upgrades

Theme implementation uses CSS custom properties with `[data-theme]` attribute selector.

### Visual Standards

| Standard | Value | Usage |
|----------|-------|-------|
| **Primary Color** | #00D9FF (Cyan) | Interactive elements, key actions |
| **Accent Color** | #00FFE5 (Mint) | Secondary accents, achievements |
| **Premium Color** | #FFD700 (Gold) | Rare items, premium features |
| **Card Radius** | 16px | Consistent card appearance |
| **Button Height** | 48px | Standard button sizing |
| **Touch Target** | 44x44px minimum | All interactive elements |

**See:** `.openhands/knowledge/design-system.md` for complete visual standards.

## UX Architecture

Jolt Time delivers a cohesive Telegram Mini App experience optimized for mobile-first usage.

### Navigation Structure

| Area | Access | Content |
|------|--------|---------|
| **Home** | Bottom nav | Daily quests, active events, currency display, quick actions |
| **Museum** | Bottom nav | Museum display, artifact collection, chronicle wall |
| **Events** | Bottom nav | Current events, leaderboards, season pass |
| **Profile** | Bottom nav | Statistics, achievements, settings, premium |

**See:** `.openhands/knowledge/navigation.md` for complete navigation specifications.

### UX Design Principles

- **Intuitive Movement:** Bottom navigation with instant tab switching, push navigation for depth
- **Minimal Friction:** Maximum 3 taps to any feature, one-handed usage optimized
- **Touch-Friendly:** 44x44px minimum touch targets, bottom-third primary actions

### Reward Experience

Rewards follow consistent patterns for satisfaction and clarity:

- **Celebration Animation:** Reward type determines presentation (currency, artifact, achievement)
- **Clear Communication:** Item name, quantity, and rarity immediately visible
- **Quick Dismiss:** Clear next action with minimal wait times

**See:** `.openhands/knowledge/ux-architecture.md` for complete reward UX specifications.

### Mobile Interaction Standards

| Standard | Value | Implementation |
|----------|-------|----------------|
| **Touch Target** | 44x44px minimum | All interactive elements |
| **Button Height** | 48px standard | Full-width on mobile |
| **Transitions** | 250-300ms | ease-out easing |
| **Skeleton Loading** | Shimmer animation | Content placeholders |

**See:** `.openhands/knowledge/component-library.md` for loading state specifications.

## Compliance

- Telegram Mini App guidelines compliance
- AdsGram policy compliance
- GDPR-ready data handling
- Privacy-first design

## Database Migration Strategy

Jolt Time employs a comprehensive database migration system for evolving the Supabase PostgreSQL database safely across all environments.

### Migration Governance

| Aspect | Standard |
|--------|----------|
| **File Location** | `src/database/migrations/` |
| **Naming Pattern** | `{number}_{category}_{description}.sql` |
| **Execution Order** | Sequential numbering (001, 002, ...) |
| **Version Tracking** | `schema_migrations` table |

### Migration Categories

| Category | Purpose |
|----------|---------|
| **Schema Migrations** | Table creation, updates, relationships, constraints |
| **Data Migrations** | Data transformation, normalization, correction, backfills |
| **Index Migrations** | Index creation, updates, removal for performance |
| **Security Migrations** | RLS policies, permissions, role management |
| **Performance Migrations** | Partitioning, materialized views, query optimization |

### Migration Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Repeatable** | Idempotent operations with IF NOT EXISTS / IF EXISTS |
| **Traceable** | Numbered files, author documentation, ticket references |
| **Reversible** | Forward/backward pairs where possible |
| **Production-Safe** | CONCURRENTLY for indexes, batching for large ops |

### Environment Workflow

| Environment | Trigger | Validation |
|-------------|---------|------------|
| **Local** | Manual via Supabase CLI | Developer testing |
| **Staging** | PR merge to main | Automated tests |
| **Production** | Manual promotion | Health checks + approval |

**See:** `.openhands/knowledge/database-migrations.md` for complete migration strategy documentation.

## Migration Lifecycle

The migration lifecycle defines how database changes progress from planning through verification.

### Lifecycle Stages

| Stage | Activities | Output |
|-------|------------|--------|
| **Planning** | Define problem, assess impact, plan approach | Migration specification |
| **Development** | Write migration SQL, create rollback, update types | Migration files |
| **Testing** | Local test, integration test, performance validation | Test results |
| **Deployment** | Apply to target environment with monitoring | Deployed migration |
| **Verification** | Validate schema, data, performance, functionality | Deployment report |

### Planning Requirements

| Requirement | Description |
|-------------|-------------|
| **Impact Analysis** | Assess effect on existing data and queries |
| **Rollback Planning** | Document reversal procedure before deployment |
| **Timeline Estimate** | Project development and testing effort |
| **Review Approvals** | Technical lead for architecture, security for access |

### Deployment Gates

| Gate | Requirement |
|------|-------------|
| **Staging** | All tests passing, integration validated |
| **Production** | Staging verified, backup confirmed, team notified |

## Rollback Standards

Rollback procedures enable recovery from failed or problematic migrations.

### Rollback Planning Requirements

| Migration Type | Rollback Documentation |
|-----------------|------------------------|
| **Schema Changes** | SQL to reverse structural changes |
| **Data Migrations** | Backup strategy or restoration procedure |
| **Index Changes** | Index recreation DDL |
| **Security Changes** | Previous policy/permission state |

### Reversibility Limitations

| Operation | Reversibility |
|-----------|---------------|
| ALTER TABLE ADD COLUMN | Fully reversible |
| CREATE INDEX | Fully reversible (DROP INDEX) |
| Data UPDATE/DELETE | Only via backup restore |
| DROP TABLE | Only via backup restore |
| TRUNCATE | Not reversible |

### Emergency Recovery

| Step | Action |
|------|--------|
| 1 | Assess failure scope and safety |
| 2 | Determine rollback vs. forward fix |
| 3 | Execute recovery procedure |
| 4 | Notify team and document incident |
| 5 | Plan corrective migration |

## Schema Evolution

Schema evolution manages changes to the database structure over time.

### Table Creation Standards

| Requirement | Implementation |
|-------------|----------------|
| **Primary Key** | UUID with gen_random_uuid() |
| **Timestamps** | created_at, updated_at with TIMESTAMPTZ |
| **Naming** | snake_case for all identifiers |
| **Indexes** | Index on foreign keys and common queries |

### Table Update Standards

| Change Type | Approach |
|-------------|----------|
| **Add Column** | ADD COLUMN IF NOT EXISTS, nullable first |
| **Remove Column** | DROP COLUMN IF EXISTS |
| **Rename Column** | Add new, copy data, deprecate old |
| **Change Type** | Add new column, transform data, remove old |

### Backward Compatibility

| Strategy | When to Use |
|----------|-------------|
| **Nullable Columns** | New non-required fields |
| **Separate Columns** | Data type changes with transformation |
| **Views** | Hide schema changes from applications |
| **Versioned APIs** | Major structural changes |

### Relationship Standards

| Pattern | Implementation |
|---------|----------------|
| **Foreign Key** | REFERENCES with ON DELETE CASCADE |
| **Unique Constraint** | UNIQUE on business keys |
| **Check Constraint** | CHECK for data validation |
| **Partial FK** | Partial index + trigger validation |

## Migration Governance

Migration governance ensures consistent, safe database evolution through review and approval processes.

### Review Requirements

| Change Type | Required Review |
|-------------|-----------------|
| **Schema Changes** | Technical lead |
| **Data Migrations** | Technical lead + data team |
| **Security Changes** | Security team |
| **Performance Changes** | Technical lead + DBA |

### Approval Workflow

| Environment | Approval Required |
|-------------|-------------------|
| **Local** | Developer self-approval |
| **Staging** | PR approval |
| **Production** | Manual approval + backup verification |

### Documentation Requirements

| Element | Required For |
|---------|--------------|
| **Migration Purpose** | All migrations |
| **Author** | All migrations |
| **Ticket Reference** | Feature-related migrations |
| **Rollback Plan** | Data and schema migrations |
| **Test Results** | Production migrations |

## Supabase RPC Architecture

RPC Functions serve as Jolt Time's **Database Business Logic Layer**, centralizing complex operations inside the database for consistency, security, and performance.

### RPC Categories

| Category | Purpose | Examples |
|----------|---------|---------|
| **Player RPCs** | Profile, progression, achievements, statistics | update_profile, calculate_progression |
| **Economy RPCs** | Currency, rewards, inventory, marketplace | process_currency, distribute_reward |
| **Museum RPCs** | Artifact acquisition, collections, exhibitions | acquire_artifact, update_collection |
| **Event RPCs** | Missions, participation, seasons, leaderboards | complete_mission, update_leaderboard |
| **PvP RPCs** | Battle resolution, rankings, matches | resolve_battle, update_ranking |
| **Guild RPCs** | Guild management, progression, rewards | create_guild, process_guild_reward |
| **Analytics RPCs** | Reporting, aggregation, metrics | record_event, calculate_retention |

### RPC Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Centralize Operations** | Complex logic executes in database, not client |
| **Reduce Client Logic** | Clients focus on presentation; server handles rules |
| **Improve Consistency** | Same rules enforced for all platforms |
| **Improve Performance** | Database-level execution with indexes and optimization |

### Folder Organization

| Domain | Location | Purpose |
|--------|----------|---------|
| Player | `functions/player/` | Profile and progression operations |
| Economy | `functions/economy/` | Currency and inventory operations |
| Museum | `functions/museum/` | Artifact and collection operations |
| Events | `functions/events/` | Mission and season operations |
| PvP | `functions/pvp/` | Battle and ranking operations |
| Guilds | `functions/guilds/` | Guild management operations |
| Analytics | `functions/analytics/` | Metrics and reporting operations |

**See:** `.openhands/knowledge/supabase-rpc-architecture.md` for complete RPC architecture documentation.

## Database Business Logic Layer

The RPC Architecture establishes the Database Business Logic Layer — the authoritative location for all business rules affecting data.

### Layer Architecture

```
Client Request → Repository → RPC Function → Database
                    ↓
              Business Rules
              Validation Logic
              Transaction Management
```

### Layer Responsibilities

| Layer | Responsibility | Scope |
|-------|----------------|-------|
| **RPC (Database)** | Business rules, validation, transactions | All data operations |
| **Repository** | Data access, RPC invocation, data mapping | Supabase interaction |
| **Service** | Presentation logic, UI formatting | Client integration |

### RPC-Repository Integration

| Pattern | Description |
|---------|-------------|
| **RPC Invocation** | Repository methods call RPC functions for business operations |
| **Result Mapping** | Repository maps RPC results to domain objects |
| **Error Propagation** | Repository converts RPC errors to domain exceptions |

**See:** `.openhands/knowledge/supabase-rpc-architecture.md#13-repository-integration-standards`

## Transaction Operations

RPC Functions execute as atomic units of work with full transactional support.

### Transaction Guarantees

| Guarantee | Description |
|-----------|-------------|
| **Atomicity** | All operations succeed or all fail |
| **Consistency** | Database transitions between valid states |
| **Isolation** | Concurrent transactions don't interfere |
| **Durability** | Committed changes persist |

### Transaction Patterns

| Pattern | Use Case |
|---------|----------|
| **Single Statement** | Simple operations (balance update) |
| **Multi-Statement** | Complex operations (purchase with inventory) |
| **Escrow** | Marketplace transactions with payment hold |
| **Saga** | Distributed transactions across systems |

### Rollback Safety

| Requirement | Implementation |
|-------------|----------------|
| **No Side Effects** | External calls outside transaction scope |
| **Deterministic Rollback** | Clear failure path for all errors |
| **Error Propagation** | Errors surface to client with context |

**See:** `.openhands/knowledge/supabase-rpc-architecture.md#9-transaction-philosophy`

## RPC Security Standards

RPC security ensures business logic executes only for authorized users with valid inputs.

### Security Layers

| Layer | Protection |
|-------|------------|
| **Authentication** | Supabase auth.uid() for user identity |
| **RLS Compatibility** | Policies evaluated with caller context |
| **Permission Checks** | Role and ownership validation |
| **Abuse Prevention** | Rate limiting and anomaly detection |
| **Fraud Prevention** | Advisory locks and duplicate detection |

### RLS Integration

| Pattern | Usage |
|---------|-------|
| **SECURITY DEFINER** | Execute with function owner's privileges |
| **auth.uid()** | Reference calling user in logic |
| **SET search_path** | Prevent schema injection |
| **Service Role** | Admin operations only |

### Abuse Prevention Measures

| Measure | Implementation |
|---------|----------------|
| **Rate Limiting** | Maximum calls per user per time period |
| **Input Validation** | Strict format and range checking |
| **Idempotency Keys** | Prevent duplicate operations |
| **Anomaly Detection** | Flag unusual patterns for review |

**See:** `.openhands/knowledge/supabase-rpc-architecture.md#10-security-standards`

## RPC Governance

RPC governance ensures consistent, safe RPC development through standards and review processes.

### RPC Development Standards

| Standard | Requirement |
|----------|-------------|
| **Naming** | Verb_Noun pattern (update_profile, process_currency) |
| **Documentation** | Header comment with purpose, parameters, returns |
| **Validation** | Input validation before any operation |
| **Error Handling** | Standardized error responses |
| **Audit Logging** | Log all state-changing operations |

### Response Standards

| Response Type | Structure |
|--------------|-----------|
| **Success** | `{ success: true, data: result, timestamp }` |
| **Validation Error** | `{ success: false, error: VALIDATION_ERROR, details }` |
| **Transaction Error** | `{ success: false, error: TRANSACTION_FAILED, reason }` |
| **Security Error** | `{ success: false, error: ACCESS_DENIED, message }` |

### Review Requirements

| RPC Type | Required Review |
|----------|-----------------|
| **Player Operations** | Technical lead |
| **Economy Operations** | Technical lead + security |
| **Monetization Operations** | Security team |
| **Admin Operations** | Admin + audit |

### Performance Standards

| Standard | Target |
|----------|--------|
| **Response Time** | < 100ms for simple operations |
| **Batch Operations** | < 500ms for bulk operations |
| **Concurrent Users** | Support 10x peak load |
| **Database Efficiency** | Use indexes, avoid full scans |

## Edge Functions Architecture

Edge Functions serve as Jolt Time's **External Integration Layer**, handling server-side logic, external integrations, and background workflows.

### Edge Function Categories

| Category | Purpose | Examples |
|----------|---------|---------|
| **Telegram Functions** | Platform integration | Webhook processing, user sync, deep links |
| **AdsGram Functions** | Revenue integration | Reward validation, fraud detection |
| **Analytics Functions** | Event processing | Event ingestion, retention calculations |
| **Notification Functions** | Message delivery | Scheduled notifications, reminders |
| **Integration Functions** | Third-party APIs | Partner webhooks, content sync |
| **Scheduled Functions** | Recurring tasks | Daily resets, leaderboard refresh |

### Edge Function Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Isolate Server Logic** | Business logic in Edge Functions, not clients |
| **Secure Integrations** | API keys never exposed, validation required |
| **Reduce Client Complexity** | Clients focus on presentation |
| **Support Scaling** | Auto-scaling with demand |

### Folder Organization

| Domain | Location | Purpose |
|--------|----------|---------|
| Telegram | `functions/telegram/` | Telegram platform integration |
| AdsGram | `functions/adsgram/` | Revenue system integration |
| Analytics | `functions/analytics/` | Event processing and metrics |
| Notifications | `functions/notifications/` | Message delivery |
| Integrations | `functions/integrations/` | External service proxies |
| Scheduled | `functions/scheduled/` | Automated recurring tasks |

**See:** `.openhands/knowledge/edge-functions-architecture.md` for complete Edge Functions documentation.

## External Integration Layer

The External Integration Layer provides a secure gateway for all communications between Jolt Time and external systems.

### Layer Architecture

```
Client → Edge Functions → External Services
                ↓
         Repositories/RPCs
                ↓
            Database
```

### Integration Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| **Secret Management** | API keys stored in Supabase Vault |
| **Request Validation** | Signature and schema validation |
| **Error Handling** | Standardized error responses |
| **Rate Limiting** | Per-user request limits |

### External Integrations

| Service | Integration Type | Functions |
|---------|-----------------|-----------|
| **Telegram** | Platform API | Webhooks, bot messages |
| **AdsGram** | Revenue API | Reward callbacks, conversion tracking |
| **Partner APIs** | Webhooks | Inbound event processing |

**See:** `.openhands/knowledge/edge-functions-architecture.md#8-integration-function-architecture`

## Scheduled Operations

Scheduled Operations handle recurring tasks that run automatically without user interaction.

### Scheduled Function Types

| Type | Schedule | Examples |
|------|----------|----------|
| **Maintenance** | Daily/Weekly | Database cleanup, log archival |
| **Refresh** | Hourly | Leaderboard updates, metrics aggregation |
| **Reset** | Daily | Daily missions, daily rewards |
| **Batch** | Every 5 min | Reward queue processing |

### Scheduling Patterns

| Schedule | Cron Expression | Use Case |
|----------|----------------|----------|
| Every 5 minutes | `*/5 * * * *` | Batch processing |
| Hourly | `0 * * * *` | Leaderboard refresh |
| Daily midnight | `0 0 * * *` | Daily reset |
| Weekly Sunday | `0 0 * * 0` | Weekly cleanup |

### Execution Guarantees

| Guarantee | Implementation |
|-----------|----------------|
| **At-least-once** | Retry on failure with idempotent operations |
| **Exclusive execution** | Advisory locks for single-instance tasks |
| **Failure recovery** | Queue failed jobs for retry |

**See:** `.openhands/knowledge/edge-functions-architecture.md#9-scheduled-function-architecture`

## Edge Function Security

Edge Function security ensures safe execution and protects against abuse.

### Security Layers

| Layer | Protection |
|-------|------------|
| **Authentication** | Supabase auth for user-facing functions |
| **Signature Validation** | Webhook signature verification |
| **Secret Storage** | Supabase Vault for sensitive data |
| **Rate Limiting** | Per-user request throttling |

### Request Validation

| Validation | Purpose |
|------------|---------|
| **Signature Check** | Verify request authenticity |
| **Schema Validation** | Ensure valid request structure |
| **Authorization** | Verify user permissions |
| **Rate Limit** | Prevent abuse |

### Abuse Prevention

| Measure | Implementation |
|---------|----------------|
| **Rate Limiting** | Maximum requests per user per minute |
| **Idempotency** | Duplicate request detection |
| **Input Sanitization** | Escape user inputs |
| **Output Sanitization** | Mask sensitive data |

**See:** `.openhands/knowledge/edge-functions-architecture.md#10-security-standards`

## Server-Side Workflows

Server-Side Workflows handle complex operations that require coordination between Edge Functions, RPCs, and external services.

### Workflow Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Request-Response** | Synchronous request/response | Simple API calls |
| **Webhook Processing** | Async event handling | Telegram updates |
| **Batch Processing** | High-volume async operations | Analytics aggregation |
| **Callback Chaining** | Multi-step async flows | Reward processing |

### Workflow Examples

| Workflow | Components | Purpose |
|----------|------------|---------|
| **Reward Processing** | Validate → RPC → Notify | Ad reward distribution |
| **Referral Flow** | Sync → Credit → Notify | Referral bonus award |
| **Season End** | Calculate → Distribute → Reset | Season transition |

### Error Handling

| Error Type | Handling |
|------------|----------|
| **Transient** | Retry with exponential backoff |
| **Validation** | Return error to client |
| **External Service** | Queue for retry, alert |
| **Security** | Reject, log, alert |

### Monitoring

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Error Rate** | < 1% | > 1% |
| **Latency p99** | < 500ms | > 2s |
| **Timeout Rate** | < 1% | > 5% |

**See:** `.openhands/knowledge/edge-functions-architecture.md#12-error-handling-standards`

## Database Indexing Strategy

The Database Indexing Strategy establishes standards for creating and maintaining indexes that support long-term performance and scalability.

### Index Categories

| Category | Purpose | Examples |
|---------|---------|----------|
| **Primary Indexes** | Entity identity, fast lookups | Primary key on `id` |
| **Foreign Key Indexes** | JOIN optimization, referential integrity | `idx_orders_customer_id` |
| **Search Indexes** | Text and pattern matching | trigram, full-text GIN |
| **Composite Indexes** | Multi-column query optimization | `(owner_id, era_id)` |
| **Analytics Indexes** | Aggregation optimization | `(user_id, created_at)` |
| **Performance Indexes** | Specific bottleneck resolution | Targeted indexes |

### Indexing Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Improve Performance** | Indexes demonstrably speed up queries |
| **Support Scalability** | B-tree scales logarithmically |
| **Avoid Overhead** | Balance read benefit against write cost |

### Scaling Targets

| User Scale | Index Count | Index Storage |
|------------|-------------|--------------|
| **10,000 users** | 20-30 indexes | < 100MB |
| **100,000 users** | 40-60 indexes | < 1GB |
| **1,000,000+ users** | 80-120 indexes | < 10GB |

**See:** `.openhands/knowledge/database-indexing.md` for complete indexing strategy.

## Query Performance Standards

Query performance standards ensure consistent, fast database operations across all Jolt Time systems.

### Performance Targets

| Query Type | Target | Critical Threshold |
|------------|--------|-------------------|
| **Primary key lookup** | < 1ms | < 5ms |
| **Foreign key JOIN** | < 5ms | < 20ms |
| **Indexed range query** | < 20ms | < 100ms |
| **Aggregation (indexed)** | < 100ms | < 500ms |
| **Full table scan** | Avoid | Fail if > 1s |

### Query Optimization Rules

| Rule | Description |
|------|-------------|
| **Use indexes** | All frequent queries must have indexes |
| **Avoid SELECT *** | Fetch only required columns |
| **Prefer equality** | Equality conditions before ranges |
| **Limit results** | Use LIMIT for pagination |

### Slow Query Handling

| Threshold | Action |
|-----------|--------|
| **Warning** | Log and monitor |
| **Critical** | Alert and prioritize fix |
| **Breaking** | Immediate optimization required |

**See:** `.openhands/knowledge/database-indexing.md#13-monitoring-standards`

## Index Governance

Index governance ensures indexes remain effective, efficient, and aligned with query patterns.

### Creation Standards

| Standard | Requirement |
|----------|-------------|
| **Justification** | Query evidence required |
| **Naming** | `idx_{table}_{columns}` pattern |
| **Documentation** | Purpose and query patterns documented |
| **Testing** | Performance improvement verified |

### Review Requirements

| Review Type | Frequency | Owner |
|-------------|-----------|-------|
| **Utilization review** | Weekly | DBA |
| **Slow query review** | Weekly | Development |
| **Unused index review** | Monthly | DBA |
| **Performance audit** | Quarterly | Team lead |

### Cleanup Standards

| Trigger | Action |
|---------|--------|
| **Zero scans for 30 days** | Drop index |
| **Duplicate index** | Drop duplicate |
| **Redundant index** | Drop redundant |

**See:** `.openhands/knowledge/database-indexing.md#14-maintenance-philosophy`

## Search Optimization

Search optimization enables efficient text-based queries across artifacts, players, and content.

### Search Index Types

| Type | Use Case | Performance |
|------|----------|-------------|
| **B-tree (LIKE)** | Prefix matching | < 5ms |
| **pg_trgm** | Fuzzy matching | < 20ms |
| **GIN Full-text** | Text search | < 50ms |

### Searchable Domains

| Domain | Search Type | Index |
|--------|-------------|-------|
| **Artifacts** | Name, description | trigram + full-text |
| **Players** | Username, display name | trigram |
| **Content** | Quest titles, lore | full-text |
| **Guilds** | Guild names | trigram |

### Optimization Strategies

| Strategy | When to Use |
|----------|-------------|
| **Covering index** | Query touches indexed columns only |
| **Partial index** | Query filters to data subset |
| **Expression index** | Computed column queries |

**See:** `.openhands/knowledge/database-indexing.md#11-search-optimization-philosophy`

## Scaling Readiness

Scaling readiness ensures the database can grow from thousands to millions of users without performance degradation.

### Scaling Milestones

| Scale | Primary Focus | Advanced Focus |
|-------|--------------|----------------|
| **10K users** | Primary/foreign key indexes | Common query patterns |
| **100K users** | Composite indexes | Partial indexes |
| **1M+ users** | Table partitioning | Expression indexes, compression |

### Scaling Strategies

| Strategy | Trigger | Implementation |
|----------|---------|----------------|
| **Add composite index** | Multi-column filters | Composite covering index |
| **Add partial index** | Data subset queries | Partial index on active rows |
| **Partition table** | > 10M rows | Range partitioning by date |
| **Add expression index** | Computed columns | Expression index |

### Partitioning Considerations

| Table Type | Partition Key | Local Index Strategy |
|------------|--------------|---------------------|
| **Transactions** | created_at | Composite with partition key |
| **Events** | start_time | Composite with partition key |
| **Sessions** | started_at | Composite with partition key |

**See:** `.openhands/knowledge/database-indexing.md#15-scaling-philosophy`

## Audit Logs System

Jolt Time maintains a comprehensive Audit Logs System that serves as the authoritative source of historical system activity. Every critical action is traceable through the audit infrastructure.

**See:** `.openhands/knowledge/audit-logs-system.md` for the complete Audit Logs System Architecture specification.

### Audit Categories

The Audit Logs System is organized into nine distinct categories:

- **Player Activity Logs** — Account creation, profile changes, progression, achievements
- **Economy Logs** — Currency transactions, inventory changes, marketplace operations
- **Museum Logs** — Artifact acquisitions, collections, exhibitions, expansions
- **Event Logs** — Mission completion, event participation, season progression
- **PvP Logs** — Battle outcomes, ranking changes, tournament activities
- **Guild Logs** — Guild activities, member management, guild rewards
- **Monetization Logs** — Purchases, subscriptions, revenue events
- **Administrative Logs** — Moderation actions, manual adjustments, configuration changes
- **Security Logs** — Suspicious activity, permission violations, fraud detection

### Architecture Layers

The Audit Logs System consists of four distinct layers:

- **Event Generation Layer** — Captures actions from applications, RPCs, Edge Functions, and database triggers
- **Audit Processing Layer** — Transforms, enriches, and validates audit events
- **Audit Storage Layer** — Persists events in append-only tables with tiered retention
- **Audit Query Layer** — Provides access for investigations, analytics, and reporting

### Audit Record Standards

Every audit event follows standardized record formats:

- **Event Identifier** — Unique ID format: `aud_{timestamp}_{random_suffix}`
- **Timestamp** — Millisecond precision, UTC timezone
- **Actor** — Identifies initiator (user, system, admin, api_key)
- **Action** — Standardized format: `{CATEGORY}_{VERB}`
- **Entity** — The object acted upon with type and identifier
- **Result** — Status (SUCCESS/FAILURE/PARTIAL) with error details
- **Metadata** — Correlation IDs, additional context, environment info

### Activity Tracking

Activity tracking captures all significant player and system actions:

- **Player Actions** — Account lifecycle, profile changes, progression, achievements
- **Economy Actions** — Currency movements, inventory updates, reward distributions
- **Game Actions** — Museum activities, event participation, PvP battles, guild operations
- **System Actions** — Administrative changes, configuration updates, security events

### Security Logging

Security logging tracks security-relevant events for threat detection:

- **Authentication Events** — Login attempts, session management, token refresh
- **Permission Events** — Authorization checks, violations, access denials
- **Anomaly Detection** — Unusual patterns, suspicious activity, fraud indicators
- **Investigation Support** — Complete event trails, correlation data, evidence preservation

### Audit Governance

Audit governance ensures data integrity and appropriate access:

- **Immutability** — Append-only tables with INSERT-only permissions
- **Access Control** — Tiered access (Operational, Investigative, Administrative, Executive)
- **Access Auditing** — All audit access is logged and monitored
- **Privacy Compliance** — Data minimization, PII handling, retention policies

### Audit Retention Standards

Audit logs follow tiered retention policies based on business needs:

- **Short-Term (90 days)** — Player activity, economy transactions, session logs
- **Medium-Term (1 year)** — Administrative actions, security events, moderation logs
- **Long-Term (7+ years)** — Account creation, security incidents, payment records

**See:** `.openhands/knowledge/audit-logs-system.md` for complete audit logging specification.

## Database Archiving Strategy

Jolt Time maintains a Database Archiving Strategy that ensures historical data remains accessible while maintaining database performance. The database should remain fast and efficient as historical data grows.

**See:** `.openhands/knowledge/database-archiving.md` for the complete Database Archiving Strategy specification.

### Archiving Categories

The archiving system addresses seven distinct data categories:

- **Player Historical Data** — Progression history, achievements, museum history, account activity
- **Seasonal Data** — Completed seasons, leaderboards, rewards, statistics
- **Event Data** — Completed events, mission history, participation records, rankings
- **Audit Logs** — Player activity, economy transactions, administrative actions, security events
- **Analytics Data** — Retention analytics, engagement metrics, historical reports, trends
- **Monetization Data** — AdsGram rewards, revenue events, fraud investigation records
- **System Data** — Configuration history, deployment records, performance logs

### Data Lifecycle Management

Data moves through four distinct lifecycle stages:

- **Active Data** — Current data for daily operations (hot storage)
- **Warm Data** — Recent history (90 days to 1 year, warm storage)
- **Archived Data** — Historical records (1 to 7 years, cold storage)
- **Long-Term Storage** — Critical records for compliance (7+ years, WORM storage)

### Historical Data Standards

Historical data archiving preserves complete platform history:

- **Progression Archives** — Level history, era progression, milestone records
- **Achievement Archives** — Unlock records, completion statistics, rarity tracking
- **Event Archives** — Season records, mission history, participation tracking
- **Economic Archives** — Transaction history, balance snapshots, economy trends

### Archive Governance

Archive governance ensures data integrity and appropriate access:

- **Archive Protection** — Encryption at rest and in transit, access logging
- **Access Control** — Tiered access (Operations, Analysts, Security, Compliance)
- **Historical Integrity** — Immutable archives, chain of custody, integrity verification
- **Retention Policies** — Automated enforcement, compliance verification, legal hold support

### Archive Retention Policies

Archive retention follows tiered policies based on data importance:

- **Short-Term (90 days)** — Recent activity, session logs, transient data
- **Medium-Term (1 year)** — Seasonal data, analytics aggregates, reports
- **Long-Term (7+ years)** — Payment records, security incidents, compliance data
- **Permanent** — Account creation records, legal holds

**See:** `.openhands/knowledge/database-archiving.md` for complete database archiving specification.

## Production Database Operations

Jolt Time maintains Production Database Operations that define how the production database is operated, monitored, maintained, and protected. The operations framework serves as the operational handbook for database reliability and scalability.

**See:** `.openhands/knowledge/production-database-operations.md` for the complete Production Database Operations specification.

### Operational Governance

Database operations are organized into seven categories:

- **Deployment Operations** — Migration deployment, schema changes, release validation, rollback procedures
- **Monitoring Operations** — Database health, query performance, connection usage, storage growth
- **Backup Operations** — Automated backups, backup verification, retention policies, disaster recovery
- **Recovery Operations** — Accidental deletion, data corruption, service outage, disaster recovery
- **Maintenance Operations** — Index maintenance, archive maintenance, performance reviews, storage optimization
- **Security Operations** — Access reviews, credential management, permission audits, anomaly detection
- **Incident Operations** — Severity levels, escalation procedures, investigation workflows, resolution workflows

### Environment Governance

Standards for each deployment environment:

- **Development** — Per-developer instances, synthetic data, rapid iteration, lightweight documentation
- **Staging** — Shared production-like environment, anonymized data, full regression testing
- **Production** — Maximum security, restricted access, controlled releases, 24/7 monitoring

### Backup Strategy

Comprehensive backup protection:

- **Automated Backups** — Continuous WAL archiving, daily snapshots, weekly and monthly archives
- **Backup Verification** — Daily checks, weekly restore tests, monthly full recovery drills
- **Retention Policies** — 7 days (WAL), 30 days (daily), 12 months (weekly), 7 years (financial)
- **Disaster Recovery** — Cross-region replication, tested runbooks, quarterly recovery drills

### Recovery Strategy

Recovery procedures for various scenarios:

- **Accidental Deletion** — Point-in-time recovery, record restoration, integrity validation
- **Data Corruption** — Corruption detection, isolation, restore from last known good
- **Service Outage** — Restart, failover to replica, full restore as needed
- **Disaster Recovery** — DR site activation, cross-region failover, full recovery workflow

### Incident Management

Structured incident response:

- **Severity Levels** — Critical (immediate), High (30min), Medium (2hr), Low (24hr)
- **Escalation Path** — On-Call DBA → Senior DBA → Engineering Manager → Director/VP
- **Investigation Workflow** — Detection → Triage → Investigation → Resolution → Follow-up
- **Resolution Workflow** — Immediate actions → Long-term fix → Closure → Post-mortem

### Database Reliability Standards

Operational KPIs for database reliability:

- **Uptime** — 99.95% target, RTO < 30 minutes, RPO < 5 minutes
- **Performance** — Average query < 50ms, P95 < 200ms, P99 < 500ms
- **Backup** — 100% success rate, weekly verification, quarterly drills
- **Recovery** — Tested quarterly, documented procedures, trained team

**See:** `.openhands/knowledge/production-database-operations.md` for complete operational specification.

## Data Warehouse Strategy

Jolt Time maintains a Data Warehouse Strategy that serves as the central intelligence center for business intelligence, LiveOps analysis, growth analysis, and strategic decision making. Operational databases and analytical databases have different responsibilities.

**See:** `.openhands/knowledge/data-warehouse-strategy.md` for the complete Data Warehouse Strategy specification.

### Analytics Architecture

The analytics system addresses eight distinct analytical categories:

- **Player Analytics** — Acquisition, progression, engagement, churn analysis
- **Economy Analytics** — Currency generation, spending, rewards, balance monitoring
- **Museum Analytics** — Artifact collection rates, museum progression, exhibition popularity
- **Event Analytics** — Participation rates, mission completion, seasonal engagement
- **PvP Analytics** — Battle participation, ranking distribution, competitive retention
- **Guild Analytics** — Guild engagement, member activity, social health
- **Monetization Analytics** — AdsGram performance, reward engagement, revenue reporting
- **Retention Analytics** — D1/D7/D30 retention, cohort analysis, lifetime value

### ETL Standards

ETL (Extract, Transform, Load) processes move data from operational systems to the warehouse:

- **Extraction** — Scheduled data retrieval from operational DB, audit logs, realtime events, monetization systems
- **Transformation** — Data cleaning, business rule application, aggregation, quality validation
- **Loading** — Atomic warehouse loads with transactional integrity and audit trail
- **Validation** — Schema validation, data validation, completeness checks, anomaly detection

### Business Intelligence Layer

The BI layer provides multiple reporting interfaces:

- **Operational Dashboards** — Real-time game health monitoring, player status, economy metrics
- **Executive Dashboards** — Daily strategic overview, revenue, retention, growth trajectory
- **LiveOps Dashboards** — Event performance, content engagement, operational metrics
- **Growth Dashboards** — Acquisition funnels, activation rates, retention cohorts, LTV analysis

### Reporting Governance

Reporting governance ensures data quality and appropriate access:

- **Data Quality** — Consistency checks, anomaly detection, completeness validation
- **Access Controls** — Role-based access, analytical permissions, PII protection
- **Metric Standards** — Consistent definitions, standardized calculations, unified reporting
- **Security** — Sensitive data protection, export restrictions, audit logging

**See:** `.openhands/knowledge/data-warehouse-strategy.md` for complete data warehouse specification.

## Query Optimization Strategy

The Query Optimization Strategy establishes standards for writing efficient queries that scale across all Jolt Time systems.

### Query Categories

| Category | Frequency | Optimization Focus |
|----------|-----------|-------------------|
| **Read Queries** | Very High | Index utilization, minimal columns |
| **Write Queries** | High | Transaction safety, atomic operations |
| **Aggregation Queries** | Medium | Pre-computation, covering indexes |
| **Analytics Queries** | Low | Partition pruning, batch processing |
| **Search Queries** | Medium | Text indexes, result limiting |
| **Realtime Queries** | Very High | Caching, efficient polling |

### Optimization Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Minimize Database Load** | Select only needed columns, limit results |
| **Minimize Latency** | < 20ms for reads, < 100ms for writes |
| **Maximize Scalability** | Index utilization, O(log n) complexity |
| **Avoid Complexity** | Simple queries, prefer JOINs over subqueries |

**See:** `.openhands/knowledge/query-optimization.md` for complete query optimization documentation.

## Read Query Standards

Read queries retrieve data efficiently while minimizing database load.

### Profile Retrieval

| Pattern | Standard |
|---------|----------|
| Get by ID | Primary key lookup with explicit columns |
| Get by telegram_id | Unique index with LIMIT |
| Search by name | trigram index with result limit |

### Artifact Retrieval

| Pattern | Standard |
|---------|----------|
| Get player's artifacts | Composite index (owner_id, era_id) with LIMIT |
| Get artifact details | Primary key JOIN with related data |
| Get collection progress | Aggregation with cached value |

### Inventory Retrieval

| Pattern | Standard |
|---------|----------|
| Get inventory items | Composite index with pagination |
| Get currency balances | Direct lookup from player record |
| Get recent transactions | Covering index (user_id, created_at DESC) |

### Event and Leaderboard Retrieval

| Pattern | Standard |
|---------|----------|
| Get active events | Partial index (status = 'active') |
| Get top leaderboard | Composite index with LIMIT |
| Get player's rank | Covering index for position |

**See:** `.openhands/knowledge/query-optimization.md#3-read-query-standards`

## Write Query Standards

Write queries modify database state efficiently while ensuring data integrity.

### Progression Updates

| Standard | Implementation |
|----------|----------------|
| Atomic increment | `experience = experience + $1` |
| Level up check | Conditional UPDATE with RETURNING |
| Achievement unlock | INSERT with ON CONFLICT DO NOTHING |

### Reward Processing

| Standard | Implementation |
|----------|----------------|
| Credit currency | Atomic UPDATE with balance check |
| Grant item | UPSERT with quantity increment |
| Multiple rewards | Batch INSERT with ON CONFLICT |

### Inventory and Marketplace

| Standard | Implementation |
|----------|----------------|
| Add item | UPSERT with quantity |
| Remove item | UPDATE with quantity check |
| Marketplace listing | INSERT with item lock |

**See:** `.openhands/knowledge/query-optimization.md#4-write-query-standards`

## Pagination Standards

Pagination enables efficient access to large datasets without overwhelming clients or databases.

### Pagination Patterns

| Pattern | Use Case | Performance |
|---------|----------|-------------|
| **Cursor pagination** | Large datasets, deep pages | Constant time |
| **LIMIT/OFFSET** | Small datasets, known size | Degrades with OFFSET |
| **Keyset pagination** | Time-ordered lists | O(log n) |

### Cursor Pagination

| Element | Implementation |
|---------|----------------|
| Cursor | Encoded position (typically base64) |
| Query | `WHERE created_at < $cursor ORDER BY created_at DESC` |
| Response | Include next cursor if more results |

### Pagination Rules

| Rule | Limit |
|------|-------|
| Default page size | 20-50 items |
| Maximum page size | 100 items |
| Search results | 50 items |
| Analytics exports | 10,000 items |

### Infinite Scroll Implementation

| Phase | Action |
|-------|--------|
| Initial load | Fetch first page immediately |
| Scroll threshold | Prefetch next page |
| Pull to refresh | Fetch first page, replace cache |

**See:** `.openhands/knowledge/query-optimization.md#12-pagination-philosophy`

## Performance Governance

Performance governance ensures consistent, efficient database operations through standards and monitoring.

### Performance Targets

| Query Type | Target | Critical Threshold |
|------------|--------|-------------------|
| **Simple read** | < 20ms | < 50ms |
| **Indexed read** | < 10ms | < 20ms |
| **Write operation** | < 50ms | < 200ms |
| **Aggregation** | < 100ms | < 500ms |

### Anti-Patterns Prohibited

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| **N+1 queries** | One query per item | JOIN or batch |
| **SELECT *** | Excessive data | Explicit columns |
| **No LIMIT** | Memory exhaustion | Always limit |
| **Unindexed JOIN** | Full table scan | Add index |

### Monitoring Standards

| Metric | Frequency | Owner |
|--------|-----------|-------|
| Slow queries (> 100ms) | Daily | DBA |
| Query frequency | Weekly | Development |
| Index utilization | Monthly | DBA |
| Buffer cache hit rate | Weekly | DBA |

### Query Review Process

| Phase | Requirement |
|-------|-------------|
| **Development** | Follow query standards |
| **PR Review** | Performance review for complex queries |
| **Staging** | EXPLAIN ANALYZE verification |
| **Production** | Monitoring and optimization |

**See:** `.openhands/knowledge/query-optimization.md#13-monitoring-standards`

## Push Notification Architecture

Jolt Time's Push Notification System serves as the primary retention and re-engagement engine. The architecture emphasizes value-first notifications that respect user time while maximizing engagement and retention.

### Notification Categories

The system supports seven notification categories:

| Category | Purpose | Frequency Cap |
|----------|---------|---------------|
| **Retention Notifications** | Bring players back and maintain engagement | 1/week (lapsed) |
| **Event Notifications** | Announce and remind about game events | Per event |
| **Mission Notifications** | Daily and weekly mission updates | 2/day |
| **Reward Notifications** | Reward availability and claims | Per reward |
| **Social Notifications** | Guild, friend, and community updates | 4/day |
| **Monetization Notifications** | Premium offers and special bundles | 2/week |
| **Administrative Notifications** | System updates and security alerts | As needed |

### Notification Philosophy

```
VALUE-FIRST PRINCIPLES:
├── Every notification provides genuine benefit
├── Notifications inform, celebrate, or enable action
├── Value is immediate and clear upon reading
├── Never send notifications that exist only for our benefit
└── Focus on quality over quantity

QUALITY MESSAGES:
• "Your daily capsule is ready to open!"
• "Egypt Week begins today — explore new artifacts!"
• "Your friend Marcus sent you an energy gift!"

NEVER SEND:
• "YOUR STREAK ENDS IN 2 HOURS!!!"
• "You haven't played in 5 days!"
• "Come back or lose your progress!"
```

**See:** `.openhands/knowledge/push-notification-architecture.md` for complete notification architecture specification.

## Notification Personalization

The personalization layer adapts notification content and timing to individual players for maximum relevance and engagement.

### Player Segmentation

```
SEGMENTATION MODEL:
├── Activity Segments — Active, Regular, Casual, Lapsing, Churned
├── Progression Segments — New, Learning, Established, Veteran, Returning
├── Engagement Segments — Social, Collector, Competitor, Explorer
└── Monetization Segments — Free, Light Spender, Regular, VIP
```

### Behavioral Targeting

| Targeting Type | Implementation |
|----------------|----------------|
| **Time Optimization** | Send based on player's typical active hours |
| **Content Matching** | Match content to player's feature engagement |
| **Frequency Adaptation** | Adjust based on notification responsiveness |
| **Progression Context** | Tailor based on current game progression |

### Personalization Standards

- **Dynamic Messages** — Variables adapt to player state
- **Timezone Awareness** — Delivery respects user timezone
- **Quiet Hours** — Automatic respect for user-set quiet times
- **Preference Respect** — Category toggles fully honored

**See:** `.openhands/knowledge/push-notification-architecture.md#10-personalization-standards`

## Notification Analytics

The notification analytics layer tracks performance metrics to enable continuous optimization of notification strategy.

### Core Analytics Metrics

| Metric Category | Measurements |
|-----------------|--------------|
| **Delivery Metrics** | Sent, delivered, failed, bounced rates |
| **Open Metrics** | Open rates, tap rates, click-through rates |
| **Engagement Metrics** | Deep link follow-through, session initiation |
| **Conversion Metrics** | Reward claims, purchases, feature activations |

### Analytics Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Delivery Rate | > 98% | < 95% |
| Push Open Rate | 15-30% | < 10% |
| Click-Through Rate | > 50% | < 30% |
| Conversion Rate | > 5% | < 2% |

### Health Monitoring

- **Opt-out rates** — Track and minimize notification disable rates
- **Block rates** — Monitor bot blocking incidents
- **Report spam rates** — Track complaint rates
- **Feedback signals** — Collect user feedback on notifications

**See:** `.openhands/knowledge/push-notification-architecture.md#13-analytics-architecture`

## Retention Campaign Standards

Retention campaigns use the notification system to re-engage lapsed players while maintaining trust and providing value.

### Comeback Campaign Structure

```
CAMPAIGN ELIGIBILITY:
├── 7+ days since last session
├── Previously active (3+ sessions)
├── Has not opted out of notifications
└── Has not blocked the bot

CAMPAIGN OFFER:
├── Welcome Back chest with preserved progress rewards
├── Double XP weekend
├── New content highlight since last visit
└── No purchase required

CAMPAIGN FREQUENCY:
├── One initial message
├── One follow-up (3 days later, optional)
└── Pause if user returns
```

### Return Player Experience

```
WELCOME BACK MESSAGE CONTENT:
├── "Welcome back, Time Keeper!"
├── Progress is safe and preserved
├── What's new since they left
├── Catch-up chest (if applicable)
└── No mention of days missed

TONE:
├── Excited and positive
├── Forward-looking
├── No guilt or pressure
└── Celebration of return
```

### Anti-Predatory Design

- **Never threaten** streak loss or progress penalties
- **Never create artificial urgency** through countdown pressure
- **Never use FOMO manipulation** to drive returns
- **Always respect** if user has muted notifications

**See:** `.openhands/knowledge/retention.md` for complete retention system specification.

## Notification Governance

Notification governance ensures all notifications meet quality standards while respecting user preferences and maintaining trust.

### Frequency Limits

| Channel | Daily Limit | Category Limit |
|---------|-------------|----------------|
| Push Notifications | 3/day | Varies by category |
| Bot Messages | Unlimited (within reason) | Respects preferences |
| In-App Notifications | Unlimited within session | Respects preferences |

### Anti-Spam Rules

```
COOLDOWN RULES:
├── Same notification: 24 hours
├── Similar notification: 12 hours
├── Minimum 1 hour between notifications
├── Quiet hours = no delivery
└── Maximum 5 notification triggers per day

PRIORITY SYSTEM:
├── Critical — Immediate delivery, bypass limits (security, account)
├── High — Within 1 hour (events, rewards)
├── Normal — User's preferred time (daily, missions)
└── Low — Batch processing (reminders)
```

### User Control Standards

| Control Type | Implementation |
|--------------|----------------|
| **Category Toggles** | Individual on/off for each notification category |
| **Timing Controls** | Preferred notification time, quiet hours |
| **Volume Controls** | Minimal, Normal, Frequent, Off |
| **Timezone Awareness** | Automatic timezone detection and respect |

### Trust Protection

- **Transparency** — Users can see all settings and notification frequency
- **Respect** — Always honor opt-out requests immediately
- **Value Commitment** — Every notification provides genuine value
- **Quality** — Consistent quality builds long-term trust

**See:** `.openhands/knowledge/push-notification-architecture.md#16-user-experience-standards` and `.openhands/knowledge/push-notification-architecture.md#17-anti-spam-philosophy`

## Viral Sharing Architecture

Jolt Time's Viral Sharing System transforms players into advocates by creating share-worthy moments naturally embedded in the gameplay experience. The architecture emphasizes organic growth through genuine excitement rather than artificial manipulation.

### Sharing Categories

The system supports seven sharing categories:

| Category | Purpose | Share Triggers |
|----------|---------|----------------|
| **Achievement Sharing** | Major accomplishments | Level milestones, rare achievements, seasonal accomplishments |
| **Museum Sharing** | Museum displays | Museum snapshots, collection completions, exhibitions |
| **Artifact Sharing** | Artifact discoveries | Rare finds, legendary discoveries, collection completions |
| **Event Sharing** | Event participation | Event joins, victories, leaderboard achievements |
| **Guild Sharing** | Guild activities | Guild victories, progression, milestones |
| **Referral Sharing** | Invitation campaigns | Referral links, achievements, milestones |
| **Social Milestone Sharing** | Social accomplishments | Friend milestones, community participation |

### Viral Growth Philosophy

```
SHARING PRINCIPLES:
├── Organic Growth — Create moments players want to share naturally
├── Social Proof — Visible accomplishments attract new players
├── Engagement Depth — Sharing deepens personal investment
└── Community Building — Shared experiences strengthen bonds

SHAREABLE MOMENTS:
• "I just discovered a Legendary artifact!"
• "My Egypt collection is finally complete!"
• "We won the guild battle!"

NEVER FORCE:
• Don't pressure players to share
• Don't punish those who don't share
• Don't make sharing mandatory for progress
• Don't incentivize low-quality shares
```

**See:** `.openhands/knowledge/viral-sharing-architecture.md` for complete viral sharing architecture specification.

## Social Sharing Systems

Social sharing systems enable players to share achievements, progress, and experiences with friends and the broader community.

### Sharing Architecture Layers

```
LAYER ARCHITECTURE:
├── Content Generation — Create visually appealing shareable content
├── Sharing Layer — Handle sharing to Telegram and other platforms
├── Attribution Layer — Track shares for analytics and rewards
└── Analytics Layer — Measure and optimize viral performance
```

### Content Types

| Content Type | Purpose | Format |
|--------------|---------|--------|
| Achievement Cards | Milestone celebrations | Visual card with badge |
| Collection Displays | Museum showcases | Grid layout with progress |
| Artifact Cards | Discovery highlights | High-quality artifact image |
| Event Badges | Participation markers | Event-themed badge |
| Leaderboard Cards | Ranking displays | Position and stats |

### Telegram Integration

```
TELEGRAM SHARING:
├── Telegram Chats — Direct sharing to individuals
├── Telegram Groups — Sharing to group conversations
├── Telegram Channels — Public channel posts
└── Deep Links — Attribution-tracked invite links
```

**See:** `.openhands/knowledge/viral-sharing-architecture.md#11-telegram-integration-standards`

## Sharing Analytics

The sharing analytics layer tracks viral performance metrics for continuous optimization.

### Core Analytics Metrics

| Metric Category | Measurements |
|-----------------|--------------|
| **Share Frequency** | Volume by type, patterns, trends |
| **Share Conversion** | CTR, signup rate, activation rate |
| **Viral Coefficient** | K factor, viral cycle, reach |
| **Engagement Impact** | Session quality, retention, LTV |

### Viral Coefficient Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Viral Coefficient (K) | > 0.3 | < 0.1 |
| Click-Through Rate | > 10% | < 5% |
| Conversion Rate | > 5% | < 2% |
| Share Quality Score | > 80% | < 60% |

### Health Monitoring

- **Share frequency** — Track and optimize sharing volume
- **Conversion funnel** — Monitor share-to-signup pipeline
- **Abuse detection** — Identify spam and manipulation
- **User sentiment** — Monitor sharing experience quality

**See:** `.openhands/knowledge/viral-sharing-architecture.md#14-analytics-architecture`

## Viral Growth Standards

Viral growth standards ensure sharing systems drive organic growth while maintaining integrity and user trust.

### Content Quality Standards

```
QUALITY REQUIREMENTS:
├── Visually Attractive — Mobile-optimized, brand-consistent graphics
├── Immediately Understandable — Clear at a glance
├── Genuinely Share-Worthy — Celebrates real accomplishment
├── Value for Recipient — Provides interest to viewers
└── Telegram-Native — Feels natural on the platform
```

### Reward Philosophy

| Reward Type | Purpose | Balance |
|-------------|---------|--------|
| Social Recognition | Badges, leaderboards, profiles | Primary incentive |
| Sharing Bonuses | XP, currency for milestones | Secondary, limited |
| Referral Rewards | Both parties benefit | Quality-focused |

### Anti-Abuse Rules

```
SPAM PREVENTION:
├── Rate Limiting — Maximum shares per user per day
├── Quality Gates — Minimum account age for rewards
├── Detection Systems — Pattern recognition for abuse
└── Reward Reversal — Fraudulent rewards revoked

SHARING INTEGRITY:
├── Authenticity Required — Real actions, not bots
├── Value Required — Genuine shares only
├── No Manipulation — No fake engagement
└── Quality Over Quantity — Natural sharing encouraged
```

**See:** `.openhands/knowledge/viral-sharing-architecture.md#16-anti-abuse-standards`

## Sharing Governance

Sharing governance ensures viral mechanics remain healthy, authentic, and aligned with long-term project values.

### Governance Framework

```
GOVERNANCE PILLARS:
├── Quality Control — Maintain share content standards
├── Fraud Prevention — Detect and prevent abuse
├── User Trust — Preserve authentic sharing experience
├── Sustainable Growth — Balance growth with integrity
```

### Monitoring Standards

| Area | Metrics | Alerts |
|------|---------|--------|
| **Share Volume** | Daily shares, shares/user | Anomaly detection |
| **Conversion Funnel** | CTR, signup, activation | Drop-off alerts |
| **Viral Coefficient** | K factor, cycle time | Below-threshold warning |
| **Abuse Rate** | Flagged shares, reversals | Spike detection |

### Policy Enforcement

- **Content Moderation** — Review flagged share content
- **Abuse Handling** — Graduated penalties for violations
- **Reward Integrity** — Verify and reverse fraudulent rewards
- **User Communication** — Clear explanation of policies

**See:** `.openhands/knowledge/viral-sharing-architecture.md#16-anti-abuse-standards` and `.openhands/knowledge/viral-sharing-architecture.md#17-future-expansion-notes`

## Telegram Communities Architecture

Jolt Time's Telegram Communities Integration transforms Telegram groups and channels into strategic layers of the game ecosystem. Communities serve as extensions of the game experience where players connect, collaborate, compete, and deepen their relationship with the game and each other.

### Community Categories

| Category | Purpose | Management |
|----------|---------|------------|
| **Official Communities** | Announcements and support | Community team |
| **Guild Communities** | Guild communication | Guild leaders |
| **Event Communities** | Event participation | Event team |
| **Museum Communities** | Collection sharing | Community curators |
| **Regional Communities** | Language/region support | Regional ambassadors |
| **Creator Communities** | Content creator support | Creator team |
| **Support Communities** | Player feedback and help | Community volunteers |

### Community Philosophy

```
COMMUNITY PRINCIPLES:
├── Engagement Driver — Deeper connection beyond gameplay
├── Retention Tool — Social bonds encourage return visits
├── Support Network — Player-to-player assistance
├── Growth Engine — Organic recruitment through members
└── Brand Building — Community pride and advocacy

GAME INTEGRATION:
├── Guild chats connected to in-game guilds
├── Event groups tied to game events
├── Community challenges linked to game rewards
└── Collection sharing powered by museum system
```

**See:** `.openhands/knowledge/telegram-communities-architecture.md` for complete community architecture specification.

## Community Integration Layer

The community integration layer connects Telegram communities to game systems and features.

### Integration Architecture

```
INTEGRATION LAYER:
├── Game Integration — Bot, Mini App, notifications, deep links
├── Feature Integration — Guild, Event, Museum, Referral systems
└── Data Integration — Activity sync, achievements, rewards
```

### Integration Points

| System | Community Integration |
|--------|----------------------|
| **Guild System** | Guild chats auto-created with membership |
| **Event System** | Event communities for participation |
| **Museum System** | Collection groups for sharing |
| **Referral System** | Community recruitment channels |
| **Support System** | Help groups for player assistance |

### Telegram Features

```
TELEGRAM INTEGRATION:
├── Groups — Guild chats, support groups, discussion groups
├── Channels — Announcements, leaderboards, tips
├── Discussion Groups — Feature feedback, bug reports
└── Community Entry Points — In-app browser, deep links
```

**See:** `.openhands/knowledge/telegram-communities-architecture.md#3-community-architecture-layers` and `.openhands/knowledge/telegram-communities-architecture.md#11-telegram-integration-standards`

## Community Engagement Standards

Community engagement mechanisms drive participation and strengthen social bonds.

### Engagement Mechanisms

| Mechanism | Purpose | Example |
|-----------|---------|---------|
| **Community Challenges** | Collaborative goals | "Complete 1000 missions together" |
| **Achievement Alerts** | Milestone celebrations | "Guild reached Level 10!" |
| **Leaderboards** | Competitive ranking | Community contribution rankings |
| **Recognition** | Value acknowledgment | Featured curator badges |

### Participation Incentives

```
INCENTIVE STRUCTURE:
├── In-Game Rewards — Currency, XP, items for participation
├── Status Rewards — Badges, titles, special roles
├── Access Rewards — Early features, exclusive content
└── Recognition Rewards — Featured highlights, spotlight posts

BALANCE:
├── Meaningful without pay-to-win
├── Active participation over passive membership
├── Quality over quantity
└── Community health over metrics manipulation
```

### Engagement Standards

- **Announcements** — Structured, valuable, not spammy
- **Challenges** — Collaborative, achievable, rewarding
- **Recognition** — Deserved, visible, motivating
- **Participation** — Accessible, inclusive, valued

**See:** `.openhands/knowledge/telegram-communities-architecture.md#12-community-engagement-architecture`

## Community Analytics

Community analytics track health, growth, and impact on game metrics.

### Core Analytics Metrics

| Metric Category | Measurements |
|-----------------|--------------|
| **Community Growth** | Member count, growth rate, churn rate |
| **Participation Rates** | Active rate, message frequency, event participation |
| **Engagement Levels** | Message engagement, content engagement, depth |
| **Retention Impact** | D7/D30 retention, LTV correlation |

### Health Metrics

| Health Indicator | Target | Warning | Critical |
|------------------|--------|---------|----------|
| **Active Rate** | 20-40% | < 15% | < 5% |
| **Churn Rate** | < 5%/month | > 10% | > 20% |
| **Sentiment Score** | > 70% | < 50% | < 30% |

### Retention Correlation

```
RETENTION IMPACT:
├── Community members retained longer than non-members
├── Active participants have highest retention
├── Core community members have highest LTV
└── Social bonds increase player commitment
```

**See:** `.openhands/knowledge/telegram-communities-architecture.md#13-analytics-architecture`

## Community Governance

Community governance ensures healthy, safe, and thriving community environments.

### Governance Framework

```
GOVERNANCE PILLARS:
├── Community Safety — Zero tolerance for harassment
├── Moderation Workflows — Structured, fair, consistent
├── Abuse Prevention — Proactive detection and prevention
├── Healthy Discussion — Constructive, respectful engagement
```

### Moderation Standards

| Layer | Function | Responsibility |
|-------|----------|----------------|
| **Automated** | Bot filters, spam detection | Prevent spam, flag issues |
| **Community** | Member reporting | Surface problems |
| **Volunteers** | Trusted members | First response |
| **Staff** | Community managers | Final decisions |

### Safety Standards

```
COMMUNITY SAFETY:
├── Clear community guidelines
├── Reporting mechanisms
├── Swift action on violations
├── Appeal process for decisions

PROHIBITED CONTENT:
├── Hate speech and discrimination
├── Harassment and bullying
├── Spam and unauthorized advertising
├── Scams and fraud
└── Personal information sharing
```

### Health Monitoring

- **Growth metrics** — Monitor for artificial inflation
- **Engagement patterns** — Detect manipulation
- **Sentiment analysis** — Track community mood
- **Moderation activity** — Ensure timely response

**See:** `.openhands/knowledge/telegram-communities-architecture.md#14-moderation-philosophy` and `.openhands/knowledge/telegram-communities-architecture.md#15-adsgram-integration-notes`

## User Acquisition Architecture

Jolt Time's User Acquisition System treats acquisition as a complete lifecycle, not just user registration. The architecture covers the full journey from discovery through activation, retention, and monetization, optimizing conversion at every stage.

### Acquisition Categories

| Category | Channels | Attribution |
|----------|----------|-------------|
| **Organic** | Telegram search, shares, discovery | Direct |
| **Referral** | Invitations, campaigns, guild invites | Referral tracking |
| **Community** | Groups, channels, campaigns | Community attribution |
| **AdsGram** | Paid ads, retargeting | Campaign tracking |
| **Influencer** | Creator campaigns, ambassadors | Creator attribution |
| **Campaign** | Marketing initiatives, partnerships | UTM tracking |

### Acquisition Philosophy

```
LIFECYCLE OPTIMIZATION:
Discover → Trial → Activate → Engage → Retain → Monetize

PRINCIPLES:
├── Maximize conversion at every stage
├── Improve activation speed and quality
├── Build retention before habits fade
├── Monetize engaged, retained users
└── Quality over quantity always

VALUE CHAIN:
Discovery quality → Trial quality
Trial experience → Activation rate
Activation depth → Engagement level
Engagement value → Retention strength
```

**See:** `.openhands/knowledge/user-acquisition-flows.md` for complete acquisition architecture specification.

## Acquisition Funnels

The acquisition funnel tracks users from discovery through conversion.

### Funnel Stages

```
FUNNEL STAGES:
┌─────────────────────────────────────────────────────────┐
│  DISCOVER → TRIAL → REGISTER → ACTIVATE → RETAIN     │
│                                                          │
│  Discover: User finds Jolt Time                       │
│  Trial: User enters Mini App                        │
│  Register: Account created                           │
│  Activate: First success moment completed             │
│  Retain: User returns for second session              │
└─────────────────────────────────────────────────────────┘
```

### Funnel Metrics

| Stage | Key Metric | Target | Critical |
|-------|------------|--------|----------|
| Discovery → Trial | Click-through rate | > 10% | < 5% |
| Trial → Register | Registration rate | > 50% | < 30% |
| Register → Activate | Activation rate | > 40% | < 20% |
| Activate → Retain | D1 retention | > 40% | < 25% |

**See:** `.openhands/knowledge/user-acquisition-flows.md#3-acquisition-architecture-layers`

## Activation Framework

The activation framework guides users from first visit to active engagement.

### Activation Stages

```
ACTIVATION FLOW:
First Launch → Tutorial → First Action → First Success → Second Session

KEY MOMENTS:
├── First artifact discovered
├── First mission completed
├── First reward claimed
├── First social connection
└── First return visit
```

### First Success Moments

| Success Type | Timing | Celebration |
|-------------|--------|--------------|
| First Artifact | Tutorial end | Collection animation + share prompt |
| First Mission | Day 1 | Mission complete animation |
| First Reward | Day 1 | Reward highlight + excitement |
| Level Up | Day 1-2 | Achievement celebration |

**See:** `.openhands/knowledge/user-acquisition-flows.md#9-onboarding-architecture` and `.openhands/knowledge/user-acquisition-flows.md#10-activation-architecture`

## Retention Flows

Retention flows ensure users return and establish lasting habits.

### Retention Stages

| Stage | Objective | Key Actions |
|-------|-----------|-------------|
| **D1** | Second session | Daily rewards, mission reset |
| **D7** | Habit formation | Weekly missions, social bonds |
| **D30** | Investment building | Season participation, community |
| **D90+** | Long-term loyalty | Mastery, prestige, community |

### Re-Engagement

```
COMEBACK FLOW:
Lapse Detection → Intervention → Comeback Campaign → Return

INTERVENTIONS:
├── 3+ days: Optional reminder
├── 7+ days: "We miss you" message
├── 14+ days: Special comeback offer
└── Progress preserved (positive framing)
```

**See:** `.openhands/knowledge/user-acquisition-flows.md#11-retention-flow-architecture`

## Acquisition Analytics

Acquisition analytics track performance across the user lifecycle.

### Core Metrics

| Category | Metrics | Purpose |
|----------|---------|---------|
| **Acquisition** | New users, source distribution | Measure volume and quality |
| **Activation** | Activation rate, time to activate | Measure onboarding success |
| **Retention** | D1/D7/D30, cohort analysis | Measure stickiness |
| **Monetization** | ARPU, conversion rate, LTV | Measure revenue |
| **Quality** | LTV/CAC, retention by source | Measure efficiency |

### Attribution Tracking

```
ATTRIBUTION MODEL:
├── First-touch — Initial discovery source
├── Last-touch — Final interaction before conversion
├── Multi-touch — Distributed credit
└── Time-decay — Recent touches weighted higher
```

### Cohort Analysis

Track user cohorts by:
- Acquisition source (organic, paid, referral)
- Acquisition campaign
- Activation path
- Behavior patterns

**See:** `.openhands/knowledge/user-acquisition-flows.md#13-attribution-standards` and `.openhands/knowledge/user-acquisition-flows.md#14-analytics-architecture`

---

## Production Progress

Implementation tracking for production-ready module development.

### Module Status

| Module | Status | Task |
|--------|--------|------|
| Core Infrastructure | ✅ Complete | - |
| Database Layer | ✅ Complete | - |
| Authentication | ✅ Complete | #164 |
| Telegram Core | ✅ Complete | #165 |
| **User Domain** | **✅ Foundation Complete** | **P-166.1** |

### Current Implementation

**P-166.1 — User Domain Foundation**

- ✅ Entity: User with factory methods (fromTelegram, fromDatabase, copyWith)
- ✅ Value Objects: UserId, TelegramId, Username, LanguageCode, UserPhotoUrl
- ✅ Types: UserStatus, UserRole, UserLanguage, UserMetadata, UserPermissions
- ✅ DTOs: CreateUserDto, UpdateUserDto, UserResponseDto, UserSummaryDto
- ✅ Interfaces: IUser, IUserRepository
- ✅ Validators: UserValidator, UsernameValidator, LanguageValidator
- ✅ Mapper: UserMapper (entity-DTO conversion)
- ✅ Events: UserCreated, UserUpdated, UserDeleted (event definitions)
- ✅ Repository: SupabaseUserRepository skeleton (NotImplementedError stubs)
- ✅ DI Registration: registerUserDependencies, setupUserDomain
- ✅ Documentation: README.md, system.md updated

**Not Implemented (P-166.2):**
- Database queries
- Business workflows
- Registration flow
- Telegram synchronization

**Next Task:** P-166.2 — User Domain Implementation

---

*Building the future through the lens of the past.*
