# ⚡ JOLT TIME
## The Official Game Design Bible

**Document Classification:** Game Design Foundation  
**Version:** 1.0  
**Status:** Official Reference  
**Date:** 2025  

---

> *"TheGame is the series of meaningful choices that a player makes to achieve a goal."*
> — Sid Meier

---

# Table of Contents

1. [Game Pillars](#1-game-pillars)
2. [Player Journey](#2-player-journey)
3. [Core Loop](#3-core-loop)
4. [Progression Philosophy](#4-progression-philosophy)
5. [Reward Philosophy](#5-reward-philosophy)
6. [Economy Philosophy](#6-economy-philosophy)
7. [Artifact Philosophy](#7-artifact-philosophy)
8. [Museum Philosophy](#8-museum-philosophy)
9. [Research Philosophy](#9-research-philosophy)
10. [Exploration Philosophy](#10-exploration-philosophy)
11. [Competition Philosophy](#11-competition-philosophy)
12. [Social Philosophy](#12-social-philosophy)
13. [PvP Philosophy](#13-pvp-philosophy)
14. [LiveOps Philosophy](#14-liveops-philosophy)
15. [Educational Philosophy](#15-educational-philosophy)
16. [Retention Philosophy](#16-retention-philosophy)
17. [Expansion Philosophy](#17-expansion-philosophy)
18. [Content Philosophy](#18-content-philosophy)
19. [Things We NEVER Do](#19-things-we-never-do)
20. [The Jolt Time Promise](#20-the-jolt-time-promise)

---

# 1. Game Pillars

**Game Pillars are the foundational design principles that guide every decision in Jolt Time. They are not features — they are the reasons features exist.**

---

## 1.1 Discovery

**The thrill of the unknown drives every session.**

Every expedition carries the potential for revelation. Players never know exactly what awaits in the temporal currents — a common relic or a legendary artifact. This uncertainty transforms routine gameplay into anticipation. Discovery is not accidental; it is designed into every system.

**Implementation Guiding Principle:**
- Every expedition must deliver something — if not a rare artifact, then knowledge, currency, or progress
- Rarity distributions must feel rewarding, never punishing
- New content must remain discoverable for years without exhausting the unknown

---

## 1.2 Collection

**Completing sets triggers something primal in the human spirit.**

Artifacts are not isolated items — they belong to sets, eras, civilizations, and narratives. The drive to complete collections provides constant direction. Incomplete sets create tension; completed sets create satisfaction. Collection is the spine of Jolt Time's progression.

**Implementation Guiding Principle:**
- Every artifact must belong to at least one collection
- Collection completion must provide meaningful rewards
- Missing pieces must always feel achievable, not impossible

---

## 1.3 History

**Every artifact is a window into a real moment of human achievement.**

Jolt Time does not fictionalize history — it celebrates it. Artifacts come with real historical context, real significance, real stories. The educational layer is not tacked on; it is woven into the core experience. History is the setting, the story, and the teacher.

**Implementation Guiding Principle:**
- All historical content must be verified by experts
- Historical narratives must connect artifacts to real events
- Learning must emerge naturally from gameplay, never as a separate mode

---

## 1.4 Exploration

**The world of Jolt Time has no edges.**

Historical eras extend infinitely into the past. New civilizations await discovery. Hidden chambers conceal rare artifacts. Exploration is not a single mechanic — it is the fundamental way players interact with the game world. The unknown is the ultimate motivator.

**Implementation Guiding Principle:**
- Content must always expand, never feel complete
- Hidden areas and secret discoveries must surprise even veteran players
- Map/museum must grow to represent the expanding known world

---

## 1.5 Long-Term Progression

**Jolt Time respects players who stay for years, not just days.**

Every action in Jolt Time contributes to permanent progression. The museum grows, never resets. Collections span months or years to complete. Long-term goals provide meaning beyond daily sessions. A player's collection reflects their journey through time itself.

**Implementation Guiding Principle:**
- Seasonal content must complement, not replace, permanent progression
- Year-one players must be able to eventually achieve what day-one players have
- Prestige systems must enhance rather than invalidate prior progress

---

## 1.6 Respect for Player Time

**Every minute in Jolt Time matters.**

No artificial waiting walls. No mandatory daily logins. No content locked behind payment. Jolt Time respects that players have lives beyond the game. When they return, they are rewarded. When they leave, they are not penalized. Time invested is time well spent.

**Implementation Guiding Principle:**
- No energy systems that punish inactivity beyond reasonable recovery caps
- No daily login walls that punish missing a day
- Session length must be meaningful, not padded

---

## 1.7 Meaningful Rewards

**Every reward tells the player they accomplished something real.**

Rewards in Jolt Time are not arbitrary — they mark genuine achievement. Completing an era, finishing a collection, winning a PvP match — these moments deserve celebration. The reward system is designed to make every achievement feel earned and valuable.

**Implementation Guiding Principle:**
- Rewards must correspond to meaningful milestones, not arbitrary thresholds
- Rare rewards must feel rare and special
- Common rewards must still feel valuable and usable

---

## 1.8 Museum Curation

**The museum is the player's legacy.**

Every artifact in the collection is displayed with purpose. The museum is not a warehouse — it is a gallery of human achievement curated by the player. Display decisions reflect the player's identity, taste, and journey. The museum is the ultimate expression of the player's time with Jolt Time.

**Implementation Guiding Principle:**
- Museum display must be meaningful, not just storage
- Player curation must be rewarded and showcased
- Museum growth must be visible and satisfying

---

## 1.9 Community Connection

**Jolt Time is played together.**

Guilds, trading, shared museums, collaborative events — Jolt Time thrives as a social experience. Players learn from each other, compete with each other, and celebrate each other's discoveries. The community is an essential part of the Jolt Time ecosystem.

**Implementation Guiding Principle:**
- Social features must enhance, never gate, progression
- Trading must be meaningful and balanced
- Community events must create shared experiences

---

## 1.10 Fair Competition

**Victory belongs to the skilled and dedicated, not the wealthy.**

PvP in Jolt Time is about knowledge, strategy, and collection mastery — not spending power. Leaderboards reflect genuine achievement. Competition is fierce but respectful. Players compete as historians, not wallets.

**Implementation Guiding Principle:**
- No competitive advantage purchasable with real money
- Skill and knowledge must outweigh time invested
- Leaderboards must remain credible and meaningful

---

# 2. Player Journey

**The player journey defines how motivation evolves from first touch to long-term commitment. Each phase has distinct goals, challenges, and rewards.**

---

## 2.1 First Session

**Duration:** 0–5 minutes  
**Goal:** Create wonder and establish core loop understanding

### Player State
The player has just discovered Jolt Time through Telegram. They know nothing about the game except the promise of time travel and artifact collection.

### Design Objectives

**Instant Gratification:**  
The first artifact must be acquired within 60 seconds of gameplay. This establishes that the promise is real — artifacts exist, they can be found, they are rewarding.

**Clear Direction:**  
A gentle tutorial guides the player through their first expedition without overwhelming them. The player learns: expedition → artifact → museum.

**Emotional Hook:**  
The first artifact should be significant enough to create an emotional connection. It represents the beginning of a journey.

**Telegram Integration:**  
Telegram-native elements are introduced naturally — the mini app opens seamlessly, bot notifications feel helpful, not intrusive.

### What the Player Feels
*"This is exciting. I found something ancient. What else is out there?"*

### Key Metrics
- Completion of first expedition: >90%
- First artifact acquired: <60 seconds
- Session continuation rate: >70%

---

## 2.2 First Day

**Duration:** 0–24 hours  
**Goal:** Establish habits and reveal depth

### Player State
The player has completed their first expedition and seen the core loop. They understand the basic premise: expeditions cost energy, energy regenerates, artifacts go in the museum.

### Design Objectives

**Energy Cycle Introduction:**  
The player experiences their first energy depletion and natural regeneration. This teaches patience without punishing the player.

**Collection Expansion:**  
By the end of day one, the player should have 3–7 artifacts. This establishes collection as achievable and exciting.

**Museum First Impressions:**  
The museum displays the player's early collection with pride. The player sees their artifacts with historical context.

**Daily Reward Discovery:**  
The first daily reward is claimed, establishing the return-to-play habit.

**Social Proof (Optional):**  
If the player has friends in the game, leaderboards introduce gentle competition.

### What the Player Feels
*"I'm building something. My museum has artifacts. I want to see what I find next."*

### Key Metrics
- Day 1 retention: >50%
- Artifacts collected: 3–7
- Museum visits: >2

---

## 2.3 First Week

**Duration:** Days 1–7  
**Goal:** Deepen systems engagement and establish routines

### Player State
The player has experienced the core loop multiple times. They have a small collection and understand the basic systems. Now the depth begins to reveal itself.

### Design Objectives

**Era Introduction:**  
The player is introduced to their second historical era. This reveals that the game has immense depth — one era is just the beginning.

**Collection Goals:**  
The player sees their first collection set and understands the completionist loop. Missing pieces create anticipation.

**Research Unlocking:**  
The Academy system is introduced. The player learns they can research artifacts for deeper historical context and mechanical benefits.

**Streak Establishment:**  
Daily play becomes habitual. The streak system rewards consistency without punishing absence.

**Social Features Unveiled:**  
Guilds and trading become visible. The player learns they are part of a larger community.

### What the Player Feels
*"There's so much more than I expected. I want to complete this collection. I want to explore that era."*

### Key Metrics
- Day 7 retention: >30%
- Artifacts collected: 15–30
- Collections started: 2–4
- Era unlocked: 1–2

---

## 2.4 First Month

**Duration:** Days 1–30  
**Goal:** Transition from new player to invested player

### Player State
The player has established Jolt Time as a regular part of their routine. They have meaningful progress, understand multiple systems, and have begun forming attachments to their collection.

### Design Objectives

**Depth Revelation:**  
Multiple eras are now accessible. The player realizes the scope of the game and must prioritize their exploration.

**Museum Curation:**  
The museum display system is fully unlocked. The player begins personalizing their exhibition.

**PvP Introduction:**  
The competitive player has entered the Arena. They discover that skill and knowledge matter more than time spent.

**Guild Integration:**  
Active guild members have joined or created a guild. Social gameplay enhances the experience.

**LiveOps Exposure:**  
The player's first seasonal event occurs. They experience limited-time content and understand the ongoing rhythm of new content.

### What the Player Feels
*"This is my game now. I have a collection I'm proud of. I'm part of a community."*

### Key Metrics
- Day 30 retention: >15%
- Artifacts collected: 50–100
- Collections completed: 3–5
- Guild membership: >60% of retained players

---

## 2.5 First Year

**Duration:** 365 days  
**Goal:** Cement player as long-term community member

### Player State
The player has experienced multiple seasons, participated in events, built a substantial museum, and formed genuine connections with the Jolt Time community.

### Design Objectives

**Collection Mastery:**  
Veteran players have nearly completed all available artifacts. They shift from collection acquisition to collection perfection.

**Museum Showcase:**  
The museum is a source of pride and identity. Players share their curation with the community.

**Community Leadership:**  
Veteran players become guild leaders, content creators, and community pillars.

**Prestige Introduction:**  
For those who have completed everything, prestige systems provide new challenges without invalidating prior progress.

**Knowledge Authority:**  
Veteran players have deep historical knowledge. They can answer questions newer players cannot.

### What the Player Feels
*"I've been on this journey for a year. Jolt Time has taught me history. I've met people. My museum is my legacy."*

### Key Metrics
- Day 365 retention: >5% of day-1 cohort
- Artifacts collected: >90% of available
- Guild leadership: >30% of retained year-one players
- User-generated content: guides, showcases, community contributions

---

## 2.6 Motivation Evolution

**Motivation is not static — it evolves with the player's journey.**

| Phase | Primary Motivation | Secondary Motivation |
|-------|-------------------|---------------------|
| First Session | Curiosity | Instant gratification |
| First Day | Discovery | Collection building |
| First Week | Goal completion | Social connection |
| First Month | Mastery | Competition |
| First Year | Legacy | Community contribution |

---

# 3. Core Loop

**The core loop is the heartbeat of Jolt Time. It defines what players do most of the time, why they do it, and what keeps them coming back.**

---

## 3.1 Primary Loop

**The loop players execute 80% of the time.**

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXPEDITION                                │
│    Spend Energy → Travel to Era → Discover Artifacts → Return   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ACQUISITION                              │
│              Examine Find → Decide → Collect                      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          EXHIBITION                              │
│              Display Artifact → Arrange Museum                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PROGRESSION                              │
│              Earn Rewards → Unlock Content                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
                         (Repeat)
```

**Cycle Time:** 5–15 minutes per iteration  
**Daily Iterations:** 3–8 depending on energy management

### Design Principles
- Each iteration must feel complete and satisfying
- No iteration should feel wasted or repetitive
- The loop must support both casual and engaged play styles

---

## 3.2 Secondary Loop

**The loop players execute 15% of the time.**

```
┌─────────────────────────────────────────────────────────────────┐
│                         RESEARCH                                  │
│           Study Artifact → Unlock Knowledge → Gain Power         │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       COLLECTION                                  │
│           Complete Sets → Unlock Bonuses → Strengthen            │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CURATION                                   │
│           Arrange Museum → Express Identity → Share              │
└─────────────────────────────────────────────────────────────────┘
```

**Cycle Time:** Daily to weekly  
**Trigger:** After acquiring key artifacts

### Design Principles
- Secondary loops must enhance, not distract from, primary loop
- Progress in secondary loop must be visible and measurable
- Secondary loops provide rest stops between primary iterations

---

## 3.3 Long-Term Loop

**The loop players execute 5% of the time, but think about constantly.**

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXPANSION                                  │
│           Unlock Era → Explore Depth → Complete Civilization      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MASTERY                                    │
│           Achieve Mastery → Become Authority → Mentor Others     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       LEGACY                                      │
│           Build Museum → Share Knowledge → Inspire Community      │
└─────────────────────────────────────────────────────────────────┘
```

**Cycle Time:** Months to years  
**Trigger:** After understanding all core systems

### Design Principles
- Long-term loop must provide goals that feel impossible yet achievable
- Progress must be permanent and meaningful
- Completion must be celebrated but never required

---

## 3.4 Seasonal Loop

**The loop driven by LiveOps content.**

```
┌─────────────────────────────────────────────────────────────────┐
│                         SEASON                                    │
│           New Content → Fresh Goals → Compete → Earn Rewards      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COLLECTION                                   │
│           Acquire Seasonal → Complete Set → Unlock Exclusive      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        RANKING                                    │
│           Climb Leaderboard → Earn Recognition → Celebrate       │
└─────────────────────────────────────────────────────────────────┘
```

**Cycle Time:** 8–12 weeks per season  
**Trigger:** Automatic seasonal reset

### Design Principles
- Seasons must refresh without invalidating permanent progress
- Seasonal content must be obtainable by dedicated free players
- Seasonal achievements must be memorable and prestigious

---

## 3.5 Endgame Loop

**The loop for players who have experienced everything else.**

```
┌─────────────────────────────────────────────────────────────────┐
│                       PERFECTION                                  │
│           Hunt Rarity → Optimize Display → Complete Encyclopedia  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PRESTIGE                                    │
│           Reset Progress → Gain Power → New Challenges           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTRIBUTION                                │
│           Create Content → Support Community → Lead Guild        │
└─────────────────────────────────────────────────────────────────┘
```

**Cycle Time:** Ongoing, no completion  
**Trigger:** After completing all core content

### Design Principles
- Endgame must provide endless challenges for dedicated players
- Prestige must enhance, not invalidate, prior achievements
- Community contribution must be recognized and rewarded

---

# 4. Progression Philosophy

**Progression in Jolt Time is multidimensional. Players grow in multiple ways simultaneously, each providing distinct satisfaction.**

---

## 4.1 Horizontal Progression

**Expanding the playground.**

Horizontal progression means accessing new content — new eras, new civilizations, new types of challenges. The player's world grows larger.

### Examples
- Unlocking new historical eras (Mesopotamia → Egypt → Greece)
- Accessing new expedition types
- Unlocking new museum wings
- Gaining access to competitive divisions

### Design Principles
- Horizontal progression must always be accessible through dedicated play
- New content must provide meaningful new challenges
- Horizontal expansion must never feel like dilution

---

## 4.2 Vertical Progression

**Becoming more powerful within existing content.**

Vertical progression means growing stronger — better artifacts, higher research levels, more efficient systems. The player becomes more capable.

### Examples
- Artifact rarity upgrades through duplicate fusion
- Research tree unlocks providing mechanical advantages
- Museum display improvements providing passive bonuses
- Guild rank advancement providing social status

### Design Principles
- Vertical progression must be achievable through gameplay alone
- Vertical power must not create unfair PvP advantages
- Vertical growth must be visible and satisfying

---

## 4.3 Collection Progression

**Completing sets and categories.**

Collection progression means filling gaps — completing sets, filling museums, gathering rarities. The player's catalog grows more complete.

### Examples
- Collection set completion bonuses
- Era completion rewards
- Artifact category mastery (weapons, pottery, jewelry)
- Civilization completion achievements

### Design Principles
- Collection completion must always feel achievable
- Missing pieces must create anticipation, not frustration
- Completion must be rewarded meaningfully

---

## 4.4 Knowledge Progression

**Understanding the game world better.**

Knowledge progression means learning — historical facts, game mechanics, strategic insights. The player becomes smarter.

### Examples
- Research tree advancement revealing artifact secrets
- Encyclopedia entries unlocking with collection progress
- Historical context revealing hidden connections
- Strategy mastery through experience

### Design Principles
- Knowledge must be valuable and applicable
- Learning must feel rewarding, not academic
- Knowledge must provide competitive advantages in skill-based activities

---

## 4.5 Museum Progression

**Creating a personal legacy.**

Museum progression means curation — arranging displays, expressing identity, sharing with the community. The museum becomes an extension of the player.

### Examples
- Display slot expansion
- Exhibition theme unlocks
- Curation awards and recognition
- Community museum tours

### Design Principles
- Museum curation must be meaningful, not just cosmetic
- Player creativity must be recognized and rewarded
- Museum sharing must be celebrated

---

# 5. Reward Philosophy

**Rewards are promises kept. Every reward confirms that the player's time was well spent and motivates continued engagement.**

---

## 5.1 Immediate Rewards

**Instant feedback for actions taken.**

Immediate rewards confirm that the player's last action was worthwhile. They arrive within seconds of the triggering action.

### Triggers
- Completing an expedition (artifact or currency)
- Discovering a rare artifact (celebration effect)
- Winning a PvP match (victory rewards)
- Completing a quest objective (progress reward)

### Design Principles
- Immediate rewards must arrive within the same session
- The reward must directly relate to the action taken
- Visual/audio feedback must enhance the reward feeling

---

## 5.2 Daily Rewards

**Routine acknowledgment of return.**

Daily rewards confirm that the player's continued engagement is valued. They arrive on a predictable schedule and reward consistency.

### Triggers
- First daily login
- Daily quest completion
- Daily streak milestones
- Daily energy milestones

### Design Principles
- Daily rewards must be achievable in under 10 minutes
- Missing a day must never feel catastrophic
- Streak systems must reward consistency, not punish absence

---

## 5.3 Weekly Rewards

**Medium-term goal acknowledgment.**

Weekly rewards mark sustained engagement over time. They reward dedication without requiring daily perfection.

### Triggers
- Weekly quest completion
- Weekly leaderboard standings
- Weekly guild contribution
- Weekly collection milestones

### Design Principles
- Weekly rewards must require meaningful time investment
- Partial progress must be acknowledged and preserved
- Weekly resets must feel like fresh starts, not punishment

---

## 5.4 Collection Rewards

**Completion celebration.**

Collection rewards acknowledge when players achieve collection milestones. They mark genuine achievement.

### Triggers
- Collection set completion
- Era completion
- Category completion
- Duplicate threshold

### Design Principles
- Completion rewards must feel earned and special
- Rare completions must receive rare rewards
- Collection rewards must provide mechanical benefits

---

## 5.5 Exploration Rewards

**Discovery acknowledgment.**

Exploration rewards celebrate finding new content. They encourage players to venture beyond their comfort zone.

### Triggers
- First artifact from a new era
- First visit to a new region
- Hidden discovery
- Secret area exploration

### Design Principles
- Exploration rewards must feel like genuine discovery
- First-time exploration must always be rewarded
- Hidden content must provide proportionally greater rewards

---

## 5.6 Achievement Rewards

**Milestone recognition.**

Achievement rewards mark significant accomplishments. They are permanent markers of player dedication.

### Triggers
- Major milestone achievements
- Rare achievement completions
- Achievement streak completion
- Category achievement mastery

### Design Principles
- Achievement rewards must be prestigious and visible
- Rare achievements must receive proportionally rare rewards
- Achievement hunting must be a valid long-term pursuit

---

# 6. Economy Philosophy

**The Jolt Time economy exists to facilitate meaningful choices. Currency is not wealth — it is freedom to pursue preferred paths.**

---

## 6.1 Collection Currency

**For acquiring artifacts and completing sets.**

Collection currency is earned through expeditions and used specifically for artifact acquisition. It facilitates the core collection loop.

### Purpose
- Purchasing expedition rerolls
- Buying specific artifacts from merchants
- Acquisition of missing collection pieces

### Design Principles
- Collection currency must be earnable through gameplay only
- Collection currency must never be purchasable with real money
- Acquisition must feel rewarding, not transactional

---

## 6.2 Research Currency

**For unlocking knowledge and power.**

Research currency is earned through the Academy and used to advance the research tree. It facilitates the knowledge progression loop.

### Purpose
- Advancing research tiers
- Unlocking artifact bonuses
- Knowledge tree progression

### Design Principles
- Research currency must require active engagement to earn
- Research advancement must provide meaningful power
- Research must be completable by dedicated free players

---

## 6.3 Museum Currency

**For curation and display.**

Museum currency is earned through museum-related activities and used for display customization. It facilitates the identity expression loop.

### Purpose
- Purchasing display themes
- Unlocking exhibition slots
- Curation tools and features

### Design Principles
- Museum currency must reward creative engagement
- Cosmetic purchases must be meaningful and visible
- Museum expression must be achievable without spending

---

## 6.4 Prestige Currency

**For endgame progression.**

Prestige currency is earned through prestige actions and used for permanent power increases. It facilitates the endgame loop.

### Purpose
- Permanent artifact bonuses
- Prestige-specific upgrades
- Legacy rewards and titles

### Design Principles
- Prestige currency must require significant sacrifice to earn
- Prestige benefits must be meaningful but not required
- Prestige must be a choice, not an obligation

---

## 6.5 Event Currency

**For limited-time content.**

Event currency is earned during seasonal events and used exclusively for event rewards. It facilitates the LiveOps loop.

### Purpose
- Event artifact acquisition
- Event milestone rewards
- Event exclusive content

### Design Principles
- Event currency must expire when events end
- Event content must be achievable by dedicated free players
- Event completion must feel exclusive and memorable

---

# 7. Artifact Philosophy

**Artifacts are the soul of Jolt Time. They are not items — they are windows into humanity's greatest achievements.**

---

## 7.1 Historical

**Every artifact connects to real history.**

Artifacts are not fictional. Each one represents a real object, a real moment, a real achievement from human history. This gives weight to every discovery.

### Requirements
- All artifacts must be historically verified
- Historical context must be provided with each artifact
- Artifact stories must be accurate and educational
- Real museum pieces inspire game artifacts

### Design Principles
- Historical accuracy is never sacrificed for gameplay
- Educational content must be woven into discovery
- Historical connections must create genuine wonder

---

## 7.2 Unique

**Every artifact is one of a kind.**

No two artifacts are identical. Even common artifacts have unique properties — different discovery dates, different conditions, different stories. Uniqueness creates value.

### Requirements
- Each artifact instance has unique metadata
- Discovery conditions affect artifact value
- Artifact history is trackable and visible

### Design Principles
- Uniqueness must be meaningful, not just cosmetic
- Common artifacts must still feel special
- Rare artifacts must feel genuinely rare

---

## 7.3 Meaningful

**Every artifact tells a story.**

Artifacts are not collectibles — they are stories waiting to be told. Each one connects to historical events, other artifacts, and human narratives.

### Requirements
- Each artifact has historical narrative
- Artifacts connect to collection narratives
- Artifact stories relate to real human experiences

### Design Principles
- Meaning must be discoverable through research
- Stories must reveal layers of significance
- Narrative must enhance, not replace, gameplay

---

## 7.4 Connected

**Artifacts form a web of human achievement.**

Artifacts are not isolated — they connect to other artifacts, to eras, to civilizations, to narratives. These connections reward deep engagement.

### Requirements
- Artifacts belong to logical collections
- Artifacts relate to their historical context
- Completing sets reveals new information

### Design Principles
- Connections must be logical and educational
- Hidden connections must reward dedicated research
- Collection completion must reveal grand narratives

---

## 7.5 Educational

**Every artifact teaches something.**

Playing Jolt Time means learning history without trying. Educational content emerges naturally from the gameplay loop.

### Requirements
- All historical content is expert-verified
- Encyclopedia entries provide genuine knowledge
- Learning is encouraged and rewarded

### Design Principles
- Education must never feel like homework
- Curiosity must be the primary driver
- Knowledge must be valuable in competitive contexts

---

# 8. Museum Philosophy

**The museum is the player's legacy. It is not storage — it is expression.**

---

## 8.1 Expand

**The museum grows with the player.**

Museums are not static — they grow as collections grow. New wings open as new eras are explored. Space is never limited in a way that prevents progress.

### Mechanics
- Museum wings unlock with era progression
- Display space expands with player level
- Special exhibitions require achievements

### Design Principles
- Expansion must be constant and visible
- New space must feel like achievement
- Growth must never be artificially limited

---

## 8.2 Evolve

**Museums improve over time.**

Museums are not finished — they are always being improved. Display quality, arrangement, theme coherence all evolve with player dedication.

### Mechanics
- Display quality upgrades
- Lighting and presentation improvements
- Theme coherence bonuses

### Design Principles
- Evolution must be visible and satisfying
- Improvements must require meaningful investment
- Evolution must never feel complete

---

## 8.3 Unlock

**Hidden content rewards dedication.**

Museums contain secrets — hidden chambers, locked vaults, secret exhibitions. Unlocking them rewards deep engagement.

### Mechanics
- Achievement-gated exhibitions
- Collection-complete reveals
- Rare discovery unlocks

### Design Principles
- Unlocks must feel like genuine discovery
- Hidden content must be achievable
- Secrets must be discoverable, not just purchasable

---

## 8.4 Connect

**Artifacts relate to each other.**

Museums arrange artifacts in meaningful ways — by era, by type, by narrative. Connections between artifacts create deeper understanding.

### Mechanics
- Era-based galleries
- Narrative exhibitions
- Collection bonuses for themed displays

### Design Principles
- Connections must be logical and educational
- Themed displays must be rewarded
- Curation must provide mechanical benefits

---

## 8.5 Grow

**The museum is never finished.**

Museums are infinite. There is always another artifact to display, another exhibition to create, another improvement to make. Growth is permanent and meaningful.

### Mechanics
- Endless artifact acquisition
- Unlimited exhibition slots (with progression)
- Community museum sharing

### Design Principles
- Growth must be infinite and meaningful
- Completion must never be possible
- Legacy must be the ultimate reward

---

# 9. Research Philosophy

**Players don't just own artifacts — they understand them.**

---

## 9.1 Restore Knowledge

**From broken pieces to complete understanding.**

Artifacts in Jolt Time are not pristine — they are fragments of history that must be restored. Research transforms fragments into understanding.

### Mechanics
- Artifact restoration through research
- Fragment combination and analysis
- Historical reconstruction

### Design Principles
- Restoration must reveal new information
- Research must feel like genuine discovery
- Complete restoration must be rewarding

---

## 9.2 Uncover History

**Behind every artifact is a story.**

Research reveals the stories behind artifacts — who made them, how they were used, what they meant to people. History comes alive through research.

### Mechanics
- Encyclopedia entries unlock with research
- Historical context reveals with collection
- Connected narratives emerge through mastery

### Design Principles
- Stories must be genuine and educational
- Narrative must enhance collection meaning
- History must feel relevant and personal

---

## 9.3 Unlock Power

**Knowledge is power.**

Research provides mechanical benefits — artifact bonuses, passive rewards, competitive advantages. Understanding history makes players stronger.

### Mechanics
- Research tree provides permanent bonuses
- Artifact mastery unlocks powerful abilities
- Knowledge-based competitive advantages

### Design Principles
- Power must be meaningful but not required
- Skill-based advantages must reward learning
- Power must never invalidate dedication

---

# 10. Exploration Philosophy

**The past is infinite. Discovery never ends.**

---

## 10.1 Endless History

**There is always more to discover.**

History extends forever. New eras, new civilizations, new stories. Players never run out of new territory to explore.

### Content Principles
- Content must always expand
- New discoveries must feel significant
- The frontier must always be visible

### Design Principles
- Exploration must always be rewarded
- New content must be achievable
- Depth must match breadth

---

## 10.2 Always Something New

**Every session brings novelty.**

Even veteran players encounter new content. The game always has something to discover, some secret to uncover, some new connection to make.

### Content Principles
- Procedural elements create variety
- Hidden content rewards exploration
- Seasonal content introduces novelty

### Design Principles
- New players must never exhaust content
- Veteran players must always find surprises
- Discovery must feel personal

---

## 10.3 The Unknown Beckons

**Curiosity is the ultimate motivator.**

The promise of undiscovered content drives exploration. The unknown is not threatening — it is inviting.

### Content Principles
- Teasers hint at undiscovered content
- Discovery creates desire for more
- Mystery rewards dedicated players

### Design Principles
- The unknown must always be more compelling than the known
- Discovery must be celebrated
- Curiosity must be the primary hook

---

# 11. Competition Philosophy

**Competition in Jolt Time is friendly, long-term, and knowledge-based.**

---

## 11.1 Friendly Competition

**We compete to improve, not to diminish.**

Competition creates energy, but never hostility. Players celebrate each other's victories and learn from defeats.

### Principles
- Sportsmanship is required
- Toxic behavior is penalized
- Victory is graceful, defeat is dignified

### Design Principles
- Leaderboards must encourage, not demean
- Matchmaking must pair similar skill levels
- Competition must build community

---

## 11.2 Long-Term Competition

**Patience beats urgency.**

Competition in Jolt Time is not about single sessions — it is about sustained dedication. Long-term players are rewarded over short-term specialists.

### Principles
- Leaderboard rankings span entire seasons
- Collection progress matters more than daily spikes
- Dedication beats optimization

### Design Principles
- Daily fluctuations must not invalidate long-term effort
- Rankings must reflect genuine mastery
- Patience must be rewarded

---

## 11.3 Knowledge-Based Competition

**Smart beats wealthy.**

Competitive success comes from knowing history, understanding artifacts, and making strategic decisions. Knowledge is power.

### Principles
- Historical knowledge provides advantages
- Artifact synergy creates strategic depth
- Research progression matters

### Design Principles
- Knowledge must be valuable in competition
- Learning must be rewarded
- Skill must overcome spending

---

## 11.4 Collection-Based Competition

**Completion matters.**

Competitive standings reflect collection progress. Completing sets, gathering rarities, and building comprehensive museums drives competitive success.

### Principles
- Collection determines competitive ceiling
- Set completion provides ranking advantages
- Museum quality reflects competitive investment

### Design Principles
- Collection must provide meaningful advantages
- Completion must be achievable by dedicated players
- Collection racing must be exciting

---

## 11.5 Never Pure Pay To Win

**Spending enhances, it does not dominate.**

Competition must always be winnable by skilled, dedicated free players. Spending provides convenience and cosmetics, never competitive advantage.

### Principles
- No purchasable power in competitive modes
- Time invested beats money invested
- Leaderboards reflect skill and dedication

### Design Principles
- Free players must be competitive
- Spending must be cosmetic only
- Leaderboard integrity is sacred

---

# 12. Social Philosophy

**Jolt Time is played together. Community is not an add-on — it is essential.**

---

## 12.1 Guilds

**Find your people.**

Guilds are communities within Jolt Time. They provide social connection, collaborative gameplay, and mutual support.

### Guild Features
- Collaborative quests and goals
- Guild museums and showcases
- Guild progression and ranks
- Guild chat and communication

### Design Principles
- Guilds must provide meaningful benefits
- Solo play must remain viable
- Guild membership must feel valuable

---

## 12.2 Trading

**Share the journey.**

Trading allows players to help each other complete collections. It builds relationships and creates economy.

### Trading Features
- Artifact trading between players
- Collection completion assistance
- Trade negotiation and fairness

### Design Principles
- Trading must be balanced and fair
- Scams and exploitation must be prevented
- Trading must enhance community bonds

---

## 12.3 Cooperation

**We rise together.**

Cooperative gameplay creates shared experiences. Players help each other succeed.

### Cooperation Features
- Co-op quests and missions
- Shared museum contributions
- Group achievements

### Design Principles
- Cooperation must be rewarding
- Solo play must remain valid
- Collaboration must build friendships

---

## 12.4 Community

**Belonging matters.**

Jolt Time creates belonging. Players feel part of something larger than themselves.

### Community Features
- Global chat and discussion
- Community events and celebrations
- Player-created content sharing

### Design Principles
- Community must be welcoming
- Toxicity must be addressed
- Belonging must be genuine

---

## 12.5 Museum Sharing

**Showcase your legacy.**

Museums are shared with the community. Players inspire each other with their curation.

### Sharing Features
- Public museum viewing
- Museum tours and showcases
- Curation awards and recognition

### Design Principles
- Sharing must be encouraged
- Creativity must be recognized
- Community inspiration must flow both ways

---

## 12.6 Events

**Celebrate together.**

Events create shared experiences. The community plays together.

### Event Features
- Community goals and rewards
- Collaborative achievements
- Shared competitive experiences

### Design Principles
- Events must unite the community
- Participation must be accessible
- Celebration must be collective

---

# 13. PvP Philosophy

**PvP in Jolt Time is respectful, skill-based, and collection-driven.**

---

## 13.1 Respectful Competition

**Honor your opponent.**

PvP in Jolt Time is never toxic. Competition is fierce but friendly. Players compete as historians, not enemies.

### Principles
- Respect is required in all PvP interactions
- Toxic behavior is penalized
- Sportsmanship is rewarded

### Design Principles
- Systems must encourage respect
- Moderation must be active
- Community standards must be high

---

## 13.2 Skill-Based Competition

**Know more, win more.**

Victory comes from knowledge — knowing artifact synergies, understanding historical context, making strategic decisions. Skill is the primary determinant of success.

### Principles
- Knowledge provides advantages
- Strategic decisions matter
- Practice improves results

### Design Principles
- Skill must overcome spending
- Learning must be rewarded
- Skill ceiling must be high

---

## 13.3 Collection-Based Competition

**What you own matters.**

Competitive success reflects collection quality. Rare artifacts, complete sets, and strong museums provide advantages.

### Principles
- Collection determines competitive potential
- Set bonuses provide advantages
- Museum quality reflects investment

### Design Principles
- Collection must matter
- Progression must be rewarded
- Completion must provide advantages

---

## 13.4 Strategic Competition

**Think before you act.**

Victory comes from strategy — choosing the right artifacts, exploiting weaknesses, adapting to opponents. Thought beats reaction.

### Principles
- Strategy determines outcomes
- Countering opponents matters
- Adaptation is rewarded

### Design Principles
- Strategic depth must exist
- Mind games must be possible
- Outthinking must beat outplaying

---

## 13.5 Not Wallet-Based

**Free players can win.**

No purchasable power exists in PvP. Victory belongs to the skilled and dedicated.

### Principles
- Spending provides no competitive advantage
- Leaderboards reflect skill, not wallets
- Free players are competitive

### Design Principles
- Pay-to-win is never allowed
- Leaderboards must be credible
- Skill must be the only advantage

---

# 14. LiveOps Philosophy

**Jolt Time is never finished. LiveOps keeps the experience fresh.**

---

## 14.1 Seasons

**Rhythm creates habit.**

Seasons create the heartbeat of Jolt Time. Every 8–12 weeks, new content arrives and fresh competition begins.

### Season Features
- Season-exclusive artifacts
- Seasonal visual themes
- Season-long Battle Pass
- Fresh competitive leaderboards

### Design Principles
- Seasons must refresh without invalidating progress
- Seasonal content must be achievable by dedicated free players
- Seasonal completion must feel prestigious

---

## 14.2 Limited Collections

**Get them while you can.**

Limited-time collections create urgency. Artifacts that disappear create desire.

### Collection Features
- Seasonal artifact sets
- Limited availability artifacts
- Collection completion urgency

### Design Principles
- Limited editions must be genuinely limited
- FOMO must not be manipulative
- Missed content must not be devastating

---

## 14.3 Historical Anniversaries

**Celebrate history together.**

Real-world historical anniversaries become in-game events. The present meets the past.

### Anniversary Events
- Historical commemoration events
- Educational content tied to real dates
- Special artifacts for significant anniversaries

### Design Principles
- Anniversaries must be educational
- Real history must be honored
- Community must celebrate together

---

## 14.4 Expeditions

**Special missions await.**

Limited-time expeditions offer unique challenges and rewards.

### Expedition Features
- Rare artifact expeditions
- Time-limited missions
- Collaborative expedition events

### Design Principles
- Expeditions must be special
- Difficulty must match rewards
- Discovery must be celebrated

---

## 14.5 Special Museums

**Temporary exhibitions.**

Limited-time museum themes create variety and celebration.

### Museum Features
- Holiday museum decorations
- Collaboration museum themes
- Historical replica exhibitions

### Design Principles
- Special museums must feel exclusive
- Themes must be varied
- Expression must be celebrated

---

# 15. Educational Philosophy

**Learning happens naturally in Jolt Time.**

---

## 15.1 Natural Learning

**No studying required.**

Players learn history by playing, not by studying. Educational content emerges from gameplay.

### Principles
- Education is woven into gameplay
- Discovery creates curiosity
- Learning is intrinsic, not forced

### Design Principles
- Educational content must never feel like homework
- Curiosity must drive learning
- Discovery must be rewarding

---

## 15.2 Discover Without Studying

**Wonder over work.**

Players absorb history by exploring it, not by memorizing it. Understanding comes from experience.

### Principles
- Play teaches without effort
- Stories convey knowledge
- Context creates understanding

### Design Principles
- Knowledge must be absorbable naturally
- Study must never be required
- Wonder must be the primary feeling

---

## 15.3 Historical Accuracy

**Truth matters.**

All historical content in Jolt Time is verified. Fiction is clearly marked. Reality is celebrated.

### Principles
- All content is expert-verified
- Fiction is clearly labeled
- Accuracy is non-negotiable

### Design Principles
- Truth must never be sacrificed
- Mistakes must be corrected
- Education must be genuine

---

# 16. Retention Philosophy

**Players return because Jolt Time enriches their lives.**

---

## 16.1 Return Tomorrow

**Daily value proposition.**

Players return tomorrow because:
- Daily rewards await
- Energy has regenerated
- New daily content is available
- Streak bonuses compound

### Design Principles
- Daily return must be rewarding
- Missing a day must not be punishing
- Daily engagement must be achievable in 10 minutes

---

## 16.2 Return Next Week

**Weekly goals matter.**

Players return next week because:
- Weekly quests provide direction
- Weekly milestones create targets
- Guild activities require attention
- Collection completion provides momentum

### Design Principles
- Weekly goals must be achievable
- Progress must be visible
- Return must feel like progress

---

## 16.3 Return Next Month

**Monthly content delivers.**

Players return next month because:
- New seasons bring fresh content
- Events create anticipation
- Collection gaps require filling
- Social connections deepen

### Design Principles
- Monthly content must feel significant
- Seasons must provide genuine novelty
- Long-term goals must remain visible

---

## 16.4 Return Next Year

**Legacy keeps players connected.**

Players return next year because:
- The museum is their legacy
- Community membership is meaningful
- Prestige provides new challenges
- The journey continues forever

### Design Principles
- Long-term commitment must be rewarded
- Legacy must feel valuable
- Return must always feel worthwhile

---

# 17. Expansion Philosophy

**Jolt Time grows forever.**

---

## 17.1 New Museums

**More galleries, more stories.**

Every new museum wing tells new stories. Museums expand to accommodate growing collections.

### Expansion Content
- Era-specific museum wings
- Civilization galleries
- Thematic exhibitions
- Special collection halls

### Design Principles
- New museums must add genuine value
- Content must be achievable
- Discovery must be celebrated

---

## 17.2 New Civilizations

**More cultures to explore.**

Every new civilization adds new perspectives on human achievement.

### Expansion Content
- Unique artifact sets per civilization
- Civilization-specific mechanics
- Cultural narrative content
- Historical education

### Design Principles
- New civilizations must feel distinct
- Cultural representation must be respectful
- Discovery must reveal new wonders

---

## 17.3 New Mechanics

**Deeper gameplay.**

New mechanics add strategic depth without invalidating existing systems.

### Expansion Content
- New expedition types
- Additional progression systems
- Advanced competitive modes
- Creative curation tools

### Design Principles
- New mechanics must enhance, not replace
- Learning must be rewarded
- Depth must match accessibility

---

## 17.4 New Seasons

**Endless freshness.**

Every season brings new content, new challenges, new rewards.

### Expansion Content
- Seasonal artifact collections
- Season-specific events
- Fresh competitive cycles
- Thematic content

### Design Principles
- Seasons must feel fresh
- Content must be obtainable
- Return must be rewarded

---

## 17.5 New Stories

**History has infinite chapters.**

Every expansion reveals new stories from humanity's past.

### Expansion Content
- Historical narratives
- Artifact backstories
- Civilization epics
- Personal player stories

### Design Principles
- Stories must be genuine
- Narrative must enhance collection
- Discovery must create wonder

---

# 18. Content Philosophy

**Creating content for Jolt Time means honoring history while creating fun.**

---

## 18.1 Artifact Creation

**Every artifact must be worthy.**

New artifacts must meet the highest standards of historical accuracy and gameplay value.

### Requirements
- Expert historical verification
- Unique gameplay contribution
- Meaningful collection role
- Educational value
- Visual and narrative quality

### Design Principles
- Quality over quantity always
- Every artifact must tell a story
- Historical accuracy is sacred

---

## 18.2 Museum Creation

**Galleries that inspire.**

New museums must inspire wonder and celebrate human achievement.

### Requirements
- Thematic coherence
- Curatorial intelligence
- Display meaning
- Community appeal
- Educational context

### Design Principles
- Museums must feel curated
- Space must be used meaningfully
- Discovery must be possible

---

## 18.3 Character Creation

**Voices that teach.**

Characters in Jolt Time are historians, guides, and companions. They teach while they entertain.

### Requirements
- Historical authenticity
- Educational value
- Engaging personality
- Helpful function
- Respectful representation

### Design Principles
- Characters must enhance learning
- Voices must be memorable
- Presence must be meaningful

---

## 18.4 Narrative Creation

**Stories worth telling.**

Narratives in Jolt Time connect artifacts to human experience.

### Requirements
- Historical accuracy
- Emotional resonance
- Educational value
- Collection integration
- Community relevance

### Design Principles
- Stories must be genuine
- Narrative must enhance gameplay
- Discovery must create wonder

---

## 18.5 Event Creation

**Moments worth remembering.**

Events in Jolt Time create community celebration and individual achievement.

### Requirements
- Community participation
- Meaningful rewards
- Fresh content
- Historical connection
- Accessibility

### Design Principles
- Events must unite the community
- Participation must be rewarding
- Memories must be created

---

# 19. Things We NEVER Do

**These lines are absolute. They are never crossed.**

---

## 19.1 No Fake Scarcity

**Scarcity is real, not manufactured.**

Artificially limited content creates false urgency and manipulates players. True scarcity comes from genuine difficulty.

### Forbidden
- Arbitrary limited-time content that returns later
- Fake "last chance" marketing
- Manufactured urgency without substance
- Rarity inflation through artificial limits

---

## 19.2 No Paywalls for Core Gameplay

**Core gameplay is free.**

Paying never unlocks essential content. Free players can achieve everything paying players achieve — it just takes longer.

### Forbidden
- Paying to skip core progression
- Purchasing power in competitive modes
- Paying to unlock essential features
- Premium currency blocking core content

---

## 19.3 No Meaningless Grind

**Every action has purpose.**

Grind exists to create investment, not to waste time. Every repetitive action must provide meaningful progress.

### Forbidden
- Grinding without rewards
- Padding progression artificially
- Requiring excessive repetition for completion
- Time-wasting as "content"

---

## 19.4 No Deceptive Monetization

**Honesty is policy.**

All monetization is transparent. No hidden costs, no deceptive pricing, no manipulative tactics.

### Forbidden
- Dark patterns in purchasing
- Hidden costs or fees
- Deceptive reward descriptions
- Manipulative urgency tactics

---

## 19.5 No Spam

**Quality over frequency.**

Communications respect players. No excessive notifications, no spam, no bombardment.

### Forbidden
- Excessive notification volume
- Repetitive messaging
- Low-value communication
- Attention manipulation

---

## 19.6 No Pay To Win

**Ever. Period.**

Spending money never provides competitive advantages. Leaderboards reflect skill and dedication.

### Forbidden
- Purchasing competitive power
- Buying leaderboard position
- Paying for skill advantages
- Spending overrides mastery

---

## 19.7 No Dark Patterns

**Respect is mutual.**

Design respects players. No manipulation, no exploitation, no tricks.

### Forbidden
- False urgency
- Hidden subscriptions
- Deceptive opt-outs
- Manipulative defaults

---

## 19.8 No Content FOMO

**Missed content is okay.**

Limited content that expires does not create lasting regret. Players who miss events survive to play another day.

### Forbidden
- Permanent FOMO creation
- Punishing absent players
- Making missed content devastating
- Manipulating fear of missing out

---

# 20. The Jolt Time Promise

**This is our commitment to every player.**

---

## A One-Page Manifesto

### The Jolt Time Promise

When you play Jolt Time, you can always expect:

**Honesty.**  
Every artifact tells the truth. Every reward is earned, not purchased. Every claim is verified. History is respected, never fabricated, always educational.

**Respect.**  
Your time is valuable. Your money is respected. Your achievements are genuine. We build games we are proud of, not manipulations we exploit.

**Discovery.**  
There is always more to find. The unknown beckons. Curiosity is rewarded. Wonder never ends. History is an adventure.

**Community.**  
You are never alone in Jolt Time. Guilds welcome you. Trading helps you. Friendships form. Competition is friendly. Belonging is real.

**Fairness.**  
Leaderboards reflect skill. Progression rewards dedication. No wallet wins. No paywalls. Free players compete. Spending enhances, never dominates.

**Growth.**  
Your museum grows. Your knowledge deepens. Your legacy builds. Every session matters. Every return delivers. Progress is permanent.

**Quality.**  
Every artifact is worthy. Every system is polished. Every experience is considered. We ship excellence, not minimum viable products.

**Education.**  
You will learn history without trying. You will discover facts you never knew. You will wonder at human achievement. You will leave smarter.

**Joy.**  
Above all, Jolt Time is fun. It brings joy. It creates memories. It connects people. It celebrates humanity. Playing should make you happy.

**This is Jolt Time.**

**Where history becomes an adventure.**

**Where discovery never ends.**

**Where you are always welcome.**

---

# Document Information

| Field | Value |
|-------|-------|
| **Document Name** | Jolt Time Game Design Bible |
| **Classification** | Game Design Foundation |
| **Status** | Official Reference |
| **Version** | 1.0 |
| **Date** | 2025-01-15 |
| **Author** | Jolt Time Design Team |
| **Purpose** | Single source of truth for game design principles |

---

# Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-15 | Initial Game Design Bible |

---

# Related Documents

| Document | Purpose |
|----------|---------|
| Vision Bible | Game vision, fantasy, identity, philosophy |
| Technical Bible | Architecture, data, API, tech stack |
| Art Bible | Visual style, UI, animations, assets |
| Audio Bible | Music, SFX, voice, implementation |

---

> *"TheGame is the series of meaningful choices that a player makes to achieve a goal."*
> — Sid Meier

---

**Jolt Time — Where History Becomes an Adventure.**

---

*This document is the foundation of all game design decisions in Jolt Time. All implementation, content creation, and design work must align with these principles.*

**© Jolt Time — All Rights Reserved**
