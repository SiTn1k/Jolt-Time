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
- **Event Categories:** Daily, Weekly, Monthly, Seasonal, Holiday, Community, Anniversary
- **Major Seasonal Events:** Spring Blossom Festival, Summer Solstice, Autumn Harvest Moon, Winter Wonderland (14-16 days each)
- **Holiday Events:** New Year, Valentine's, Easter, Halloween, Christmas with themed decorations and cosmetics
- **Historical Events:** Era-focused weeks (Egypt, Greece, Rome, Vikings, Renaissance) reinforcing educational identity
- **Event Currency:** Event Tokens (2,000 max, 14-day expiration) and Festival Coins (500 max, 30-day expiration)
- **Event Missions:** Collection, Battle, Social, Discovery, Expedition, Story missions with token rewards
- **Event Rewards:** Profile frames, badges, titles, auras, artifact skins — all cosmetic only, no pay-to-win
- **Event Archive:** Past events documented with themes, rewards, and leaderboard history
- **Event Philosophy:** Fresh content every 2-3 weeks, rewards participation, avoids grinding, respects player time

**See:** `.openhands/knowledge/events.md` for complete event system specification.

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

### Retention Tracking
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

## Compliance

- Telegram Mini App guidelines compliance
- AdsGram policy compliance
- GDPR-ready data handling
- Privacy-first design

---

*Building the future through the lens of the past.*
