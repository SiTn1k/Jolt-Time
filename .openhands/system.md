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

## Monetization Strategy

### Primary Revenue: AdsGram
The main monetization for the project is **Telegram AdsGram advertisements**:
1. Rewarded video ads
2. Interstitial ads
3. Event-based ads
4. Daily bonus ads

**See:** `knowledge/adsgram.md` for detailed AdsGram integration.

### Secondary Revenue: User Purchases
- Cosmetic items only
- Optional premium subscription
- Battle pass (future)

### Critical Rules
- **NEVER implement pay-to-win mechanics**
- User monetization must NEVER dominate gameplay
- Never design the game around aggressive monetization
- Always preserve player experience quality
- Focus on high retention and long-term growth

### Game Economy
The game uses a multi-currency system:
- **Time Energy** — Primary gameplay resource
- **Chrono Dust** — Soft currency for upgrades
- **Time Shards** — Premium currency (paid only)
- **Experience** — Player level progression

**See:** `knowledge/economy.md` for detailed economy design.

### Retention Systems
- Daily login rewards with streak bonuses
- Comeback rewards for returning players
- Weekend bonus events
- Seasonal content updates
- Limited-time missions
- Push notifications via Telegram bot

**See:** `knowledge/retention.md` and `knowledge/notifications.md` for detailed retention systems.

### Notifications
Telegram bot push notifications are carefully designed:
- Maximum 4 notifications per day
- Value-first messaging
- Full user control
- Never spam or manipulative

**See:** `knowledge/notifications.md` for notification types and rules.

### Telegram Ecosystem
Complete Telegram integration architecture:
- Telegram Bot: Commands, notifications, re-engagement
- Telegram Mini App: Game UI and gameplay
- Backend API: Business logic and processing
- Supabase: Data storage and real-time

**See:** `knowledge/telegram-architecture.md` for ecosystem details.

### Artifacts System
The heart of Jolt Time - historical artifact collection:
- 6 rarity tiers (Common to Mythic)
- 6 historical eras (Ancient World to Modern Era)
- Upgrade system (Level 1-10 with fragment progression)
- 8 artifact types (Weapon, Armor, Document, Relic, Scientific Item, Royal Artifact, Military Artifact, Cultural Artifact)
- Collection percentage tracking with milestone rewards
- Museum display mechanics

**See:** `knowledge/artifacts.md` for detailed artifact design.

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

### Energy and Daily Reward System
Player pacing through energy management and daily reward progression:
- Maximum 100 energy, regenerates 1 per 3 minutes
- Energy consumed by: PvP battles (15), Story battles (5-20), Event battles (10)
- 30-day reward calendar with escalating rewards
- Daily streak system (up to 1.5x bonus at 100 days)
- Welcome rewards for Days 1-7 onboarding
- Optional AdsGram energy bonuses (never required)

**Connected Systems:**
- Quests: Quest rewards include energy restoration
- Battles: Energy gate for all battle types
- Artifact Progression: Fragments from rewards upgrade artifacts

**See:** `knowledge/energy-system.md` for detailed energy and reward design.

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
- Friend system: Add/remove friends, view profiles, send gifts, challenge
- Referral system: Unique codes, milestone rewards (coins, energy, fragments)
- Leaderboards: Player Level, Museum, Artifacts, PvP, Weekly, Seasonal
- Player profiles: Avatar, level, title, collection %, achievements
- Titles system: Cosmetic titles (Time Traveler, Museum Master, etc.)
- Activity feed: Discovery, level up, milestones, achievements
- Sharing: Artifact cards, milestones, profiles via Telegram

**Connected Systems:**
- Quests: Social quests, referral milestones, leaderboard challenges
- Museum: Guild contributions, friend comparison, shared progress
- Progression: Social achievements, title unlocks, activity celebrations
- Future: Guild system, guild wars, cooperative events, chat

**See:** `knowledge/social-system.md` for detailed social design.

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

## Security

- HTTPS only
- Input validation (client + server)
- Row Level Security in database
- Secure authentication via Telegram
- Rate limiting
- No sensitive data in client storage

## Compliance

- Telegram Mini App guidelines compliance
- AdsGram policy compliance
- GDPR-ready data handling
- Privacy-first design

---

*Building the future through the lens of the past.*
