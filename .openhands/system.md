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
- 6 rarity tiers (Common to Mythic) with distinct colors, drop rates, visual effects, and multipliers
- 10 historical eras (Prehistoric to Modern Era) spanning 10,000+ years of history
- 8 artifact categories (Weapons, Documents, Jewelry, Ancient Tools, Relics, Military Objects, Royal Objects, Scientific Artifacts)
- Artifact progression system: Level 1-100 cap, stats scale with level (2% per level), Mythic artifacts evolve visually at levels 25/50/75/100
- Collection percentage tracking with milestone rewards
- Museum display mechanics
- Full artifact data structure: id, name, description, era, civilization, rarity, power, luck, knowledge, level, experience, image_url, is_discovered, is_equipped, created_at

**See:** `.openhands/knowledge/artifact-system.md` for complete artifact specification.

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
Special artifact designation system:
- Museum artifacts: permanently retained, cannot be sold, cannot convert to fragments
- Auto-promotion: first artifact of each rarity automatically becomes museum piece
- Manual promotion: player can promote additional artifacts within capacity limits
- Museum capacity: 20 base + 5 per era completed (e.g., 5 eras complete = 45 slots)
- Museum score: each museum artifact contributes to prestige calculation
- Cosmetic unlocks: era-specific frames and badges based on museum completeness
- Museum sections: Hall of Ages, Rarity Gallery, Category Hall, Favorites, Recently Added

**See:** `.openhands/knowledge/inventory-system.md` for complete museum specification.

### Prestige System
Rewards long-term dedication and collection mastery:
- Prestige score calculated from: Museum Collections (+25-100/era), Completed Eras (+50/era), Mythic Artifacts (+500/each), Legendary Artifacts (+100/each), Epic Artifacts (+25/each), Achievements (+5-500 each)
- 10 prestige levels: Novice Collector (0) → Master of Time (100,000)
- Prestige benefits: profile borders (Bronze→Silver→Gold→Platinum→Prismatic), inventory slots (+10 to +100), Chrono Aura at max level

**See:** `.openhands/knowledge/inventory-system.md` for complete prestige specification.

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
