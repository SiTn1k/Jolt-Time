# ⚡ Jolt Time

**A Telegram Mini App where players travel through time to discover historical anomalies, collect artifacts, and restore the timeline.**

[![Telegram](https://img.shields.io/badge/Telegram-Mini%20App-26A5E4?style=flat-square)](https://t.me)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3.0-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

---

## 🎮 About

**Jolt Time** is an educational entertainment Telegram Mini App that combines time travel gameplay with real historical content. Players explore different eras, collect artifacts, build museums, complete quests, and compete in player-versus-player battles — all while learning fascinating historical facts.

### Core Game Loop

```
Collect Energy → Complete Expeditions → Earn Artifacts → Build Museum → Unlock New Eras → Repeat
```

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Accessibility** | Everyone deserves to play. Free-to-play, mobile-first, multiple languages. |
| **Fairness** | No pay-to-win mechanics. Leaderboards reflect skill and time, not spending. |
| **Educational Value** | Historical content is accurate, well-researched, and inspires curiosity. |
| **Respect for Players** | No dark patterns, manipulative mechanics, or excessive monetization pressure. |

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React + TypeScript | Telegram Mini App UI |
| **Backend** | Supabase | PostgreSQL, Edge Functions, Auth, Realtime |
| **Bot** | Telegram Bot API | Notifications, commands, engagement |
| **Monetization** | AdsGram | Primary revenue (rewarded ads only) |
| **Payments** | Telegram Stars | Premium purchases (cosmetics, convenience) |

---

## 📂 Project Structure

```
Jolt-Time/
├── src/                          # Frontend source code
│   ├── api/                      # REST API endpoints
│   ├── database/                 # Database types & migrations
│   ├── screens/                  # React screen components
│   ├── services/                 # Business logic services
│   └── types/                    # TypeScript type definitions
│
├── knowledge/                    # Game design documentation
│   ├── artifacts.md              # Artifact system
│   ├── energy-system.md          # Energy & daily rewards
│   ├── museum-system.md          # Museum collection system
│   ├── quests.md                 # Quest system
│   ├── pvp-system.md             # Player vs player
│   ├── guild-system.md           # Guild/clan features
│   ├── battle-pass.md            # Seasonal battle pass
│   └── ...
│
├── agents/                       # Designer agent specifications
│   ├── collector-designer.md     # Artifact balancing
│   ├── economy-designer.md       # Economy balance
│   ├── museum-designer.md       # Museum design
│   ├── quest-designer.md        # Quest creation
│   └── social-designer.md        # Social features
│
├── docs/                         # External documentation
├── .openhands/                   # OpenHands agent knowledge
│   ├── system.md                 # Master system documentation
│   ├── agents/                   # Agent specifications
│   └── knowledge/                # Technical knowledge base
│
└── supabase/                     # Backend configuration (planned)
    ├── migrations/                # Database migrations
    └── functions/                # Edge Functions
```

---

## 🎯 Game Systems

### Implemented ✅

| System | Status | Description |
|--------|---------|-------------|
| **Daily Rewards** | ✅ Complete | 30-day reward calendar with streak bonuses |
| **Energy System** | ✅ Complete | Regenerating energy with boosters, offline recovery |
| **Notifications** | ✅ Foundation | Notification domain foundation - entities, templates, channels (P-179.1) |
| **Ads Integration** | ✅ Complete | AdsGram SDK for rewarded ads |
| **Player Profile** | ✅ Complete | Player identity, progression, statistics, preferences |
| **Inventory** | ✅ Foundation | Central storage system for collectibles (P-169.1) |
| **Currency** | ✅ Foundation | Currency economy module (P-170.1) |
| **Artifact** | ✅ Production | Master catalog of collectible artifacts (P-171.2) |
| **Museum** | ✅ Foundation | Museum display with halls and exhibits (P-172.1) |
| **Academy** | ✅ Production | Research progression with technology tree (P-173.2) |
| **Quests** | ✅ Foundation | Quest system foundation with entities, types, and repository skeleton (P-174.1) |
| **Achievements** | ✅ Foundation | Achievement system foundation with entities, types, and repository skeleton (P-175.1) |
| **Guild** | ✅ Foundation | Guild system foundation with entities, types, and repository skeleton (P-176.1) |
| **Reward Engine** | ✅ Production | Central reward distribution system - ONLY system allowed to distribute rewards (P-177.2) |
| **Event Bus** | ✅ Foundation | Central communication mechanism between domains - ONLY allowed inter-domain communication (P-178.1) |
| **Analytics** | ✅ Production | Universal telemetry layer - ONLY records events/metrics, never modifies gameplay (P-180.2) |
| **Admin** | ✅ Foundation | Admin domain foundation - accounts, roles, permissions, repository skeleton (P-181.1) |
| **Audit** | ✅ Complete | Immutable audit history layer with Event Bus integration, automatic collection, and search (P-184.2) |
| **Backup** | ✅ Foundation | Backup domain foundation - entities, types, repository skeleton (P-186.1) |
| **Integration** | ✅ Foundation | Integration domain foundation - providers, requests, responses, repository skeleton (P-187.1) |
| **Security** | ✅ Foundation | Security domain foundation - incidents, policies, sessions, repository skeleton (P-188.1) |
| **Cache** | ✅ Complete | Production cache implementation - memory cache engine, TTL engine, eviction policies (P-189.2) |
| **API Gateway** | ✅ Foundation | API Gateway foundation - entities, types, interfaces, validators, mappers, events, repository skeleton (P-190.1) |
| **Optimization** | ✅ Production | Production optimization implementation - repository, service, analyzers (performance, database, cache, memory), failure handling (P-193.2) |
| **System Integration** | ✅ Foundation | System Integration foundation - entities (SystemModule, IntegrationState, IntegrationSnapshot), types, interfaces, validators, mappers, events, repository skeleton (P-194.1) |
| **Stabilization** | ✅ Production | Production stabilization - StabilizationService, HealthScanner, DependencyValidation, RepositoryValidation, SystemValidation, comprehensive tests (P-195.2) |
| **Alpha** | ✅ Production | Alpha ready validation - SupabaseAlphaRepository, AlphaService, full CRUD, validation, snapshot generation, readiness calculation (P-196.2) |
| **Release** | ✅ Production | Release Candidate validation - SupabaseReleaseRepository, ReleaseService, full CRUD, validation, snapshot generation, readiness calculation (P-197.2) |
| **Hardening** | ✅ Production | Production Hardening implementation - SupabaseHardeningRepository, HardeningService, full CRUD, validation, snapshot generation, hardening report (P-198.2) |
| **Final QA** | ✅ Foundation | Final QA foundation - QACheck, QASnapshot, QAReport entities, types, interfaces, validators, mappers, events, repository skeleton (P-199.1) |
| **Production** | ✅ Production | Production Ready Certification - SupabaseProductionRepository, ProductionService, full CRUD, validation, snapshot generation, certification report (P-200.2) |

### In Development 🚧

| System | Progress | Description |
|--------|----------|-------------|
| **Security** | 0% | Production security implementation - IP blocking, rate limiting, anti-cheat, fraud detection (P-188.2) |
| **System Integration** | 0% | Production system integration - health checker, dependency resolver, auto recovery, startup validation, module loader, runtime synchronization (P-194.2) |
| **Integration** | 0% | Production integration implementation - HTTP clients, webhooks, retries, circuit breakers (P-187.2) |
| **Expeditions** | 0% | Time-based artifact collection missions |
| **Museum** | 0% | Collection display with historical context (P-172.2) |
| **Quests** | 0% | Quest execution, progress tracking, reward distribution (P-174.2) |
| **Achievements** | 0% | Achievement progress tracking, completion detection, reward distribution (P-175.2) |
| **Guild** | 0% | Guild creation, membership, roles, permissions (P-176.2) |
| **PVP Arena** | 0% | League-based competitive battles |
| **Tournaments** | 0% | Competitive bracket tournaments |
| **Battle Pass** | 0% | Seasonal premium progression track |
| **Boss Battles** | 0% | Elite enemy encounters |
| **Story Mode** | 0% | Narrative campaign with chapters |

---

## 🎨 Design System

### Visual Style
**Premium Dark Futuristic** — Dark backgrounds with cyan glow accents

| Element | Value |
|---------|-------|
| Background | `#0A0E17` → `#131B2E` gradient |
| Primary Color | `#00D9FF` (Cyan glow) |
| Accent Color | `#00FFE5` (Mint glow) |
| Premium Color | `#FFD700` (Gold) |
| Typography | Inter |

### UI Philosophy
- Mobile-first, touch-optimized
- Telegram-native look and feel
- Smooth animations with reduced-motion support
- WCAG 2.1 AA accessibility compliance

---

## 💰 Monetization

**Principle: No Pay-to-Win. Ever.**

Monetization enhances but never gate-keeps:

| Source | Type | Examples |
|--------|------|----------|
| **AdsGram** | Rewarded Ads | Optional energy refills, speed-ups |
| **Telegram Stars** | Premium Purchases | Cosmetics, convenience items |
| **Battle Pass** | Subscription ($4.99/season) | Exclusive cosmetics, XP boost |

All ads are **optional rewarded ads** — never forced, always skippable, never interrupt gameplay.

---

## 📖 Documentation

| Category | Location | Description |
|----------|----------|-------------|
| **Architecture** | `.openhands/system.md` | Master system documentation |
| **Game Design** | `knowledge/` | 15+ game system specifications |
| **Agents** | `agents/` | Designer agent specifications |
| **API** | `.openhands/knowledge/api-architecture.md` | REST API design |
| **Database** | `.openhands/knowledge/database-schema.md` | Supabase schema |
| **Project Vision** | `.openhands/knowledge/project-vision.md` | Mission & principles |

### Game Documentation Index

| Document | Location | Version | Status |
|----------|----------|---------|--------|
| **Vision Bible** | `docs/game/Vision-Bible.md` | 1.0 | ✅ Complete |
| **Game Design Bible** | `docs/game/Game-Design-Bible.md` | 1.0 | ✅ Complete |
| **Artifact System Bible** | `docs/game/Artifact-System-Bible.md` | 1.0 | ✅ Complete |
| **Global Artifact Catalogue** | `docs/game/Global-Artifact-Catalogue.md` | 1.0 | ✅ Complete |
| **Civilization Bible** | `docs/game/Civilization-Bible.md` | 1.0 | ✅ Complete |
| **Historical Timeline Bible** | `docs/game/Historical-Timeline-Bible.md` | 1.0 | ✅ Complete |
| **Museum Bible** | `docs/game/Museum-Bible.md` | 1.0 | ✅ Complete |
| **Museum Architecture & Exhibition System** | `docs/game/Museum-Architecture-And-Exhibition-System.md` | 1.0 | ✅ Complete |
| **Collection Bible** | `docs/game/Collection-Bible.md` | 1.0 | ✅ Complete |
| **Collection Architecture & Completion System** | `docs/game/Collection-Architecture-And-Completion-System.md` | 1.0 | ✅ Complete |
| **Historical Artifact Creation Framework** | `docs/game/Historical-Artifact-Creation-Framework.md` | 1.0 | ✅ Complete |
| **Historical Artifact Metadata Standard** | `docs/game/Historical-Artifact-Metadata-Standard.md` | 1.0 | ✅ Complete |
| Technical Bible | `docs/game/Technical-Bible.md` | — | P-201.3 |
| Art Bible | `docs/game/Art-Bible.md` | — | P-201.4 |
| Audio Bible | `docs/game/Audio-Bible.md` | — | P-201.5 |

### Implementation Progress

| Task | Status | Notes |
|------|--------|-------|
| **P-201.1** Vision Bible | ✅ Complete | Game vision, fantasy, identity, philosophy |
| **P-201.2** Game Design Bible | ✅ Complete | Game pillars, loops, progression, philosophy |
| **P-202.1** Artifact System Bible | ✅ Complete | Artifact philosophy, categories, hierarchy, rarity, narratives, progression |
| **P-202.2** Global Artifact Catalogue | ✅ Complete | Catalogue architecture, hierarchy, civilizations, museums, collections, taxonomy |
| **P-203.1** Civilization Bible | ✅ Complete | Civilization philosophy, hierarchy, master list, metadata, identity, relationships, timeline rules, museum/artifact ownership, educational philosophy, expansion rules, regional structure, DLC framework, NEVER DO list, manifesto |
| **P-203.2** Historical Timeline Bible | 📋 Pending | Era definitions, period transitions, temporal relationships |
| **P-204.1** Museum Bible | ✅ Complete | Museum philosophy, purpose, hierarchy, types, regional distribution, identity, wings, exhibition philosophy, progression, relationships, educational philosophy, visual direction, future expansion, NEVER DO list, manifesto |
| **P-204.2** Museum Architecture & Exhibition System | ✅ Complete | Museum structure, wing/hall/gallery types, exhibition philosophy, display philosophy, museum flow, visitor journey, placement rules, expansion rules, LiveOps, educational philosophy, NEVER DO list, manifesto |
| **P-205.1** Collection Bible | ✅ Complete | Collection philosophy, categories, themes, identity, completion philosophy, relationships, educational philosophy, expansion rules, LiveOps, quality rules, NEVER DO list, manifesto |
| **P-205.2** Collection Architecture & Completion System | ✅ Complete | Collection structure, types, artifact sets, completion tiers, knowledge progression, cross-collection links, master collections, LiveOps, discovery pathways, expansion rules |
| **P-206.1** Historical Artifact Creation Framework | ✅ Complete | Artifact creation philosophy, 8-stage pipeline, required fields, authenticity rules, writing standards, educational structure, source requirements, quality checklist, forbidden content, scalability, localization, AI guidelines |
| **P-206.2** Historical Artifact Metadata Standard | ✅ Complete | Core metadata, historical metadata, museum metadata, physical metadata, context, educational, classification, research, localization, media, validation rules, scalability |
| **P-207.1** Ancient Egypt Artifact Pack I — Royal Treasures | ✅ Complete | 50 authentic artifacts following metadata standard |
| **P-207.2** Ancient Egypt Artifact Pack II — Religion & Temples | ✅ Complete | 50 authentic artifacts following metadata standard |
| **P-207.3** Ancient Egypt Artifact Pack III — Daily Life & Society | ✅ Complete | 50 authentic artifacts following metadata standard |
| **P-207.4** Ancient Egypt Artifact Pack IV — Military & Warfare | ✅ Complete | 50 authentic artifacts following metadata standard |
| **P-207.5** Ancient Egypt Artifact Pack V — Science, Medicine & Writing | ✅ Complete | 52 authentic artifacts following metadata standard |
| **P-207.6** Ancient Egypt Artifact Pack VI — Architecture & Engineering | ✅ Complete | 52 authentic artifacts following metadata standard |
| **P-207.7** Ancient Egypt Artifact Pack VII — Trade, Agriculture & Economy | ✅ Complete | 52 authentic artifacts following metadata standard |
| **P-207.8** Ancient Egypt Master Collection Review | ✅ Complete | 356 artifacts, 100% completion, quality score 9.8/10 |
| **P-208.1** Mesopotamia Artifact Pack I — Kings & Royal Power | ✅ Complete | 55 authentic artifacts following metadata standard |
| **P-208.2** Mesopotamia Artifact Pack II — Religion & Temples | ✅ Complete | 52 authentic artifacts following metadata standard |
| **P-208.3** Mesopotamia Artifact Pack III — Writing & Cuneiform | ✅ Complete | 54 authentic artifacts following metadata standard |
| **P-209.1** Ancient Greece Artifact Pack I — Kings, Heroes & Power | ✅ Complete | 55 authentic artifacts following metadata standard |
| **P-209.2** Ancient Greece Artifact Pack II — Religion & Temples | ✅ Complete | 55 authentic artifacts following metadata standard |
| **P-209.3** Ancient Greece Artifact Pack III — Democracy, Philosophy & Writing | ✅ Complete | 55 authentic artifacts following metadata standard |
| **P-209.4** Ancient Greece Artifact Pack IV — Daily Life & Society | ✅ Complete | 55 authentic artifacts following metadata standard |
| **P-209.5** Ancient Greece Artifact Pack V — Science, Mathematics & Medicine | ✅ Complete | 55 authentic artifacts following metadata standard |
| **P-209.6** Ancient Greece Artifact Pack VI — Military & Warfare | 📋 Pending | Military equipment, weapons, armor, warfare tactics, naval technology |
| **P-201.3** Technical Bible | 📋 Pending | Architecture, data, API, tech stack |
| **P-201.4** Art Bible | 📋 Pending | Visual style, UI, animations, assets |
| **P-201.5** Audio Bible | 📋 Pending | Music, SFX, voice, implementation |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- Telegram Bot Token (from @BotFather)
- Supabase account

### Setup

```bash
# Clone the repository
git clone https://github.com/SiTn1k/Jolt-Time.git
cd Jolt-Time

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

### Environment Variables

```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_APP_URL=https://your-app-url.com

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AdsGram
ADSGRAM_APP_ID=your_app_id
ADSGRAM_APP_KEY=your_app_key

# Security
ADMIN_API_KEY=your_admin_key
```

---

## 📊 Project Metrics

| Metric | Value |
|--------|-------|
| Total Files | 183 |
| Total Lines | 133,779 |
| Knowledge Docs | 109 files (~86,000 lines) |
| Source Code | ~6,000 lines |
| SQL Migrations | 17 |
| Game Systems | 15+ |
| Implementation | ~25% |

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Core game mechanics
- [x] Energy system
- [x] Daily rewards
- [x] Telegram Mini App shell
- [x] Telegram Bot integration

### Phase 2: Core Gameplay 🚧
- [ ] Expeditions system
- [ ] Artifact collection
- [ ] Museum building
- [ ] Quest system
- [ ] First historical era (Mesopotamia)

### Phase 3: Social Features
- [ ] Friends system
- [ ] Guilds
- [ ] Leaderboards
- [ ] Referrals

### Phase 4: Competition
- [ ] PVP Arena
- [ ] Tournaments
- [ ] Battle Pass
- [ ] Boss Battles

### Phase 5: Expansion
- [ ] Additional eras (Egypt, Greece, Rome)
- [ ] Story mode chapters
- [ ] Seasonal events
- [ ] Global competitions

---

## 🤝 Contributing

1. Read the [Project Vision](.openhands/knowledge/project-vision.md) to understand our principles
2. Review the [Documentation Standards](.openhands/knowledge/documentation.md)
3. Find the relevant system in the [Master Index](.openhands/knowledge/master-index.md)
4. Follow the coding standards in `.openhands/rules.md`

---

## 📄 License

Private project — All rights reserved.

---

## 🏛️ Historical Content

Jolt Time features **165+ artifacts** from **50+ countries** and **20+ civilizations**, including:

- **Mesopotamia** — Cuneiform tablets, ziggurats, cylinder seals
- **Ancient Egypt** — Pyramids, hieroglyphics, pharaonic treasures
- **Classical Greece** — Amphoras, Olympic artifacts, philosophical texts
- **Roman Empire** — Gladiator equipment, mosaics, architectural plans
- **And many more eras to explore...**

All historical content is verified by experts and provides educational context through the Museum's Encyclopedia system.

---

## 📬 Contact

- **Telegram Bot:** [@YourBot](https://t.me/your_bot)
- **Telegram Mini App:** [Jolt Time](https://t.me/your_app)

---

*Building the future through the lens of the past.*

**Jolt Time** — Where history becomes an adventure.
