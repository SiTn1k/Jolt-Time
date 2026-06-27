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
|--------|--------|-------------|
| **Daily Rewards** | ✅ Complete | 30-day reward calendar with streak bonuses |
| **Energy System** | ✅ Complete | Regenerating energy with boosters, offline recovery |
| **Notifications** | ✅ Complete | Push notifications with spam protection |
| **Ads Integration** | ✅ Complete | AdsGram SDK for rewarded ads |
| **Player Profile** | ✅ Complete | Player identity, progression, statistics, preferences |
| **Inventory** | ✅ Foundation | Central storage system for collectibles (P-169.1) |
| **Currency** | ✅ Foundation | Currency economy module (P-170.1) |

### In Development 🚧

| System | Progress | Description |
|--------|----------|-------------|
| **Expeditions** | 0% | Time-based artifact collection missions |
| **Artifacts** | 0% | Collectible items with rarities and upgrades |
| **Museum** | 0% | Collection display with historical context |
| **Quests** | 0% | Daily, weekly, story, and achievement quests |
| **PVP Arena** | 0% | League-based competitive battles |
| **Guilds** | 0% | Cooperative clan system |
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
