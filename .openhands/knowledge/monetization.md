# Jolt Time — Monetization Strategy

## Core Principle

> **AdsGram revenue must always remain the primary business model. Never design the game around aggressive monetization. Avoid pay-to-win systems at all costs.**

Jolt Time is committed to fair, player-respecting monetization that preserves the core gaming experience and ensures long-term retention.

## Primary Revenue: AdsGram

### Ad Types

#### 1. Rewarded Video Ads
**Purpose:** Player-initiated rewards for watching ads
**Format:** 15-30 second video ads
**Frequency:** Player chooses when to watch
**Rewards:**
- Extra Time Energy bonus
- Accelerated cooldown reduction
- Cosmetic item preview
- Additional daily attempt

**Implementation:**
- Never force or guilt players into watching
- Clear value proposition for watching
- Easy dismiss option
- Reward immediately upon completion

#### 2. Interstitial Ads
**Purpose:** Natural break points in gameplay
**Format:** 5-15 second video ads
**Frequency:** Maximum 1 ad per 3 minutes of play
**Placement:**
- Between mission completion and rewards screen
- Before loading new era
- After closing result screens

**Rules:**
- Never interrupt active gameplay
- Clear skip option after 5 seconds
- No autoplay without player action
- Respect player's time

#### 3. Event Ads
**Purpose:** Special limited-time events with ad rewards
**Format:** Themed ad experiences
**Frequency:** During special events only
**Examples:**
- Double reward weekends (watch ad to double)
- Event-exclusive cosmetics
- Bonus Time Energy during events

### Ad Placement Rules

| Location | Allowed Types | Frequency Cap |
|----------|--------------|--------------|
| Mission Complete | Interstitial | 1 per 3 min |
| Daily Login | Rewarded | Unlimited |
| Shop Browse | None | — |
| During Gameplay | NONE | — |
| Loading Screens | None | — |
| Collection View | Rewarded | 1 per session |

### Revenue Targets (per 1000 DAU)

| Ad Type | Daily Impressions | Estimated CPM | Daily Revenue |
|---------|------------------|---------------|--------------|
| Rewarded Video | 30,000 | $8.00 | $240 |
| Interstitial | 15,000 | $5.00 | $75 |
| Event Ads | 5,000 | $6.00 | $30 |
| **Total** | 50,000 | — | **$345** |

*Estimates based on AdsGram averages; actual results may vary*

## Secondary Revenue: Optional Premium

### Premium Subscription (Future)
**Price:** $2.99/month (regional pricing)
**Benefits:**
- Ad-free experience
- +10% Time Energy gains
- Exclusive premium cosmetics
- Early access to new features
- Priority support

**Rules:**
- No gameplay advantages beyond minor progression boost
- All content accessible without subscription
- No exclusive gameplay features
- Cancel anytime, retain progress

### Cosmetic Shop
**Types:**
- Time Suit skins
- Profile frames
- Achievement badges
- Collection auras
- Chat effects

**Rules:**
- 100% cosmetic only
- No stat bonuses
- No gameplay effects
- Clear preview before purchase
- Reasonable pricing

### Battle Pass (Future)
**Price:** $4.99 per season (8 weeks)
**Free Track:**
- New missions
- Basic cosmetics
- Time Energy

**Premium Track:**
- Premium cosmetics
- Bonus rewards
- +20% season XP boost
- Exclusive badge

**Rules:**
- Free players progress through all content
- Premium is cosmetic + convenience only
- Season content permanently available
- No FOMO mechanics

## Prohibited Monetization

### Never Implement

🚫 **Pay-to-Win Mechanics**
- No purchasing Time Energy
- No purchasing fragments
- No purchasing era unlocks
- No purchasing mission completions

🚫 **Aggressive Monetization**
- No energy/cooldown systems that require payment
- No forced watching of ads
- No countdown timers that can be skipped with money
- No "pay to continue" after failure

🚫 **Gambling Mechanics**
- No loot boxes
- No gacha systems
- No randomized paid items
- No slot machines or similar

🚫 **Predatory Practices**
- No artificial scarcity
- No false urgency
- No social pressure mechanics
- No fear-of-missing-out (FOMO)

## User Monetization Guidelines

### What Users Can (Eventually) Earn
- Cosmetic items (tradeable in future)
- Achievement badges
- Leaderboard positions
- Guild rankings

### What Users Can Never Do
- Convert in-game currency to real money
- Sell accounts
- Trade Time Energy for real currency
- Participate in real-money betting

**This is NOT a Play-to-Earn game.**

## Monetization Principles

### 1. Player-First Approach
- Monetization serves players, not vice versa
- Players should feel rewarded, not pressured
- Every purchase should feel worth it
- Transparency in all transactions

### 2. Long-Term Focus
- Retention > immediate revenue
- Trust > quick profits
- Quality > aggressive upselling
- Sustainable growth over spikes

### 3. Ethical Standards
- No targeting vulnerable players
- No manipulative design patterns
- No hidden costs
- Clear, honest communication

### 4. Fair Play
- All players compete on skill/time
- No paywalls for progression
- No gameplay advantages for money
- Competitive integrity maintained

## Revenue Projection (Year 1)

| Month | DAU Target | Monthly Revenue |
|-------|------------|-----------------|
| 1-2 | 1,000 | $200-500 |
| 3-4 | 5,000 | $1,000-2,500 |
| 5-6 | 25,000 | $6,000-12,000 |
| 7-9 | 100,000 | $20,000-40,000 |
| 10-12 | 250,000 | $50,000-100,000 |

*Projections based on similar Telegram Mini Apps; actual results may vary*

## Cost Structure

### Fixed Costs (Monthly)
| Item | Cost |
|------|------|
| Supabase | $500 |
| Hosting | $200 |
| CDN | $150 |
| Monitoring | $100 |
| **Total** | **$950** |

### Break-Even Analysis
- At 5,000 DAU: Revenue covers infrastructure
- At 10,000 DAU: Sustainable operation
- At 50,000 DAU: Profitable and growing
- At 100,000+ DAU: Significant growth possible

## AdsGram Compliance

### Requirements
- Use official AdsGram SDK
- Follow AdsGram placement guidelines
- Accurate impression reporting
- No fraud or manipulation
- Respect user ad preferences

### Best Practices
- Test ads in development environment
- Monitor ad performance
- A/B test ad placements
- Gather user feedback on ads
- Stay updated on AdsGram policies

## Review Checklist

Before implementing any monetization feature, verify:

- [ ] Does this serve the player?
- [ ] Does this preserve fair play?
- [ ] Is this compliant with AdsGram policies?
- [ ] Is this ethical and respectful?
- [ ] Does this support long-term retention?
- [ ] Is this transparent to the player?
- [ ] Does this avoid predatory patterns?

If any answer is no, reconsider the feature.

---

*Respect your players, and they will respect your game.*
