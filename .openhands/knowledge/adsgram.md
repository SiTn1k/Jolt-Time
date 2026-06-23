# Jolt Time — AdsGram Integration

## Overview

**AdsGram is the PRIMARY revenue model for Jolt Time.** All other monetization is supplementary. The goal is sustainable revenue through non-intrusive, player-respecting advertisements.

---

## Revenue Model

### Primary Income: AdsGram

```
PROJECT REVENUE from AdsGram:
├── Rewarded video ads (player-initiated)
├── Interstitial ads (natural breaks)
├── Event-themed ads (special occasions)
└── Daily bonus ads (optional engagement)

AdsGram SDK handles:
├── Ad serving
├── Impression tracking
├── Revenue calculation
└── Payment processing
```

### Key Principle

> **PROJECT earns from AdsGram. PLAYERS do NOT earn from AdsGram.**

Players receive in-game rewards for watching ads. The revenue (real money) goes to the project. Players cannot convert ad-watching into real currency.

---

## Ad Types

### 1. Rewarded Video Ads

**Type:** Player-Initated
**Trigger:** Player chooses to watch
**Revenue:** High CPM ($8-12)
**User Reward:** In-game bonuses

**When Shown:**
- Player taps "Watch Ad" button
- Natural reward moments
- Optional quest completions
- Cosmetic unlocks

**User Rewards Examples:**
```
🎁 WATCH AD FOR REWARD:
├── +50 Time Energy (instant)
├── 2x Daily Capsule (double reward)
├── Free Mission Skip
├── +100 Chrono Dust
├── Extended Research (8h → 0h)
└── Preview New Cosmetic
```

**Rules:**
- ✅ Player ALWAYS chooses to watch
- ✅ Clear reward shown BEFORE watching
- ✅ Reward given immediately after
- ✅ Never required for gameplay
- ✅ Can dismiss before completion

---

### 2. Interstitial Ads

**Type:** Automatic (at natural breaks)
**Trigger:** Game-determined natural pauses
**Revenue:** Medium CPM ($3-6)
**User Reward:** None (project revenue only)

**Placement Points:**
```
BATTLE FLOW:
1. Battle Complete Screen
       ↓
2. [Ad plays - optional skip after 5s]
       ↓
3. Rewards Screen

DAILY FLOW:
1. Daily Reward Claimed
       ↓
2. [Ad plays - optional skip after 5s]
       ↓
3. Continue to Game

ERA TRANSITION:
1. Era Complete
       ↓
2. [Ad plays - optional skip after 5s]
       ↓
3. New Era Loading
```

**Frequency Cap:**
- Maximum 1 ad per 3 minutes of play
- Maximum 8 interstitial ads per hour
- Maximum 24 interstitial ads per day per player
- Cooldown between ads: 3 minutes minimum

**Rules:**
- ✅ Only at natural break points
- ✅ Skip option after 5 seconds
- ✅ Never during active gameplay
- ✅ Never during missions
- ✅ Respects player time

---

### 3. Daily Bonus Ads

**Type:** Player-Initiated (Daily Limit)
**Trigger:** First ad of the day, then optional
**Revenue:** High engagement
**User Reward:** Enhanced daily reward

**How It Works:**
```
Daily Login Flow:

┌─────────────────────────────────────┐
│  DAILY REWARD READY!                │
│                                     │
│  🎁 Common Capsule + 50 XP          │
│                                     │
│  [ CLAIM NOW ] [ DOUBLE (Watch Ad) ]│
└─────────────────────────────────────┘

If "Double" selected:
┌─────────────────────────────────────┐
│  YOUR DAILY BONUS:                  │
│  Watch short ad to DOUBLE reward!   │
│                                     │
│  Reward Preview:                    │
│  Before: 1 Common Capsule          │
│  After:  1 RARE Capsule!!!          │
│                                     │
│  [ WATCH AD ] [ SKIP ]              │
└─────────────────────────────────────┘
```

**Daily Limit:**
- 1 "enhanced" ad reward per day guaranteed
- Additional bonus ads available (up to 3/day)
- Gap between ads: 1 hour minimum

---

### 4. Special Event Ads

**Type:** Themed (during events only)
**Trigger:** Event participation
**Revenue:** Premium event rates
**User Reward:** Event-specific bonuses

**Event Ad Examples:**
```
🔥 DOUBLE FRAGMENTS WEEKEND:

Watch ad → 4x fragments instead of 2x
Your choice! Regular rewards or enhanced.

⏰ EGYPT WEEK EVENT:

Watch ad → +200 Event Points
Special cosmetics available only this week!

🎄 HOLIDAY CELEBRATION:

Watch ad → Holiday gift box
Exclusive holiday items inside!
```

---

## Ad Cooldowns & Frequency

### Cooldown System

```yaml
ad_cooldowns:
  interstitial:
    min_interval: 3 minutes
    max_per_hour: 8
    max_per_day: 24
    
  rewarded:
    min_interval: 1 minute
    daily_limit: 5
    enhanced_limit: 3
    
  event:
    min_interval: 30 minutes
    max_per_event: 10
```

### Frequency Rules

| Ad Type | Max Daily | Gap Between | Skip Allowed |
|---------|-----------|-------------|--------------|
| Interstitial | 24 | 3 min | After 5s |
| Rewarded | 5 | 1 min | Yes (no reward) |
| Daily Bonus | 3 | 1 hour | Yes |
| Event | 10 | 30 min | Yes |

---

## User Experience Rules

### The Golden Rules

```
✅ DO:
├── Respect player choice
├── Provide clear value
├── Show reward before ad
├── Deliver reward immediately
├── Allow easy dismissal
├── Limit frequency strictly
└── Track user feedback

❌ NEVER:
├── Force ads on players
├── Block gameplay with ads
├── Show ads during missions
├── Use deceptive ad placements
├── guilt-trip for skipping
├── Make ads feel mandatory
└── Exceed frequency caps
```

### Skip Options

**Interstitial Skip:**
```
┌─────────────────────────────────────┐
│                                     │
│  Ad playing in 5 seconds...        │
│                                     │
│  [ SKIP NOW ]                       │
│                                     │
│  Skip → No reward, instant return   │
└─────────────────────────────────────┘
```

**Rewarded Ad Skip:**
```
┌─────────────────────────────────────┐
│                                     │
│  Watch complete → Get reward!      │
│                                     │
│  [ X ]  ← Tap to leave (no reward) │
│                                     │
│  Leaving = No reward, no penalty    │
└─────────────────────────────────────┘
```

---

## Ad Display Rules

### Visual Standards

```
GOOD AD PLACEMENT:
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │      ADVERTISEMENT          │    │
│  │                             │    │
│  │   (Standard ad container)   │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Clean, non-intrusive placement     │
└─────────────────────────────────────┘

BAD AD PLACEMENT:
✗ Multiple ads stacked together
✗ Ads that look like gameplay
✗ Ads with fake close buttons
✗ Ads that auto-play sound
✗ Ads covering game UI
```

### Ad Container Design

```css
.ad-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
```

---

## AdsGram SDK Integration

### Basic Integration Flow

```javascript
// Initialize AdsGram
const adsgram = new AdsGram({
  adPid: 'YOUR_AD_PID',
  onError: (error) => console.error(error),
  onNoAd: () => console.log('No ad available')
});

// Show Rewarded Ad
async function showRewardedAd() {
  try {
    const result = await adsgram.showRewardedAd();
    
    if (result.reward) {
      // Give reward to player
      await giveReward(result.reward);
    }
  } catch (error) {
    console.error('Ad error:', error);
  }
}

// Show Interstitial Ad
async function showInterstitialAd() {
  // Check cooldown
  if (canShowInterstitial()) {
    await adsgram.showInterstitialAd();
  }
}
```

### Revenue Tracking

```javascript
// Track impressions for analytics
adsgram.onImpression((data) => {
  analytics.track('ad_impression', {
    ad_type: data.type,
    ad_id: data.id,
    user_id: currentUser.id,
    timestamp: Date.now()
  });
});
```

---

## Revenue Projections

### Per 1000 Daily Active Users

| Ad Type | Daily Impressions | CPM | Daily Revenue |
|---------|------------------|-----|---------------|
| Rewarded | 2,000 | $10.00 | $20.00 |
| Interstitial | 4,000 | $4.00 | $16.00 |
| Event | 500 | $8.00 | $4.00 |
| **Total** | 6,500 | — | **$40.00** |

### Monthly Revenue (Per 1000 DAU)

| DAU | Daily Revenue | Monthly Revenue |
|-----|---------------|-----------------|
| 1,000 | $40 | $1,200 |
| 5,000 | $200 | $6,000 |
| 10,000 | $400 | $12,000 |
| 50,000 | $2,000 | $60,000 |
| 100,000 | $4,000 | $120,000 |

---

## Compliance & Policies

### AdsGram Policy Compliance

```
REQUIREMENTS:
├── Use official AdsGram SDK only
├── Accurate impression reporting
├── No ad fraud or manipulation
├── Respect user ad preferences
├── Follow Telegram ad policies
└── Display proper ad labeling

PROHIBITED:
├── Forcing users to watch ads
├── Misrepresenting ad content
├── Click fraud
├── Self-clicking ads
├── Blocking ads from reporting
└── Violating Telegram ToS
```

### User Privacy

```
DATA HANDLING:
├── AdsGram handles ad targeting
├── No personal data shared with advertisers
├── Impression data anonymized
├── User can opt-out of personalized ads
└── GDPR compliance maintained

TRANSPARENCY:
├── Users see they are watching ads
├── Clear who serves the ads
├── Easy way to provide feedback
└── No hidden ad tracking
```

---

## Quality Assurance

### Ad Testing Checklist

```
BEFORE LAUNCH:
- [ ] Test all ad placements
- [ ] Verify skip buttons work
- [ ] Check frequency limits
- [ ] Test in poor network conditions
- [ ] Verify reward delivery
- [ ] Check mobile responsiveness
- [ ] Test on Telegram iOS
- [ ] Test on Telegram Android

ONGOING:
- [ ] Monitor ad fill rates
- [ ] Track user complaints
- [ ] A/B test ad placements
- [ ] Review ad performance
- [ ] Update SDK regularly
- [ ] Check policy compliance
```

---

## User Feedback Loop

### Feedback Collection

```
PLAYER CAN REPORT:
├── Intrusive ads
├── Broken skip buttons
├── Missing rewards
├── Offensive ad content
├── Too many ads
└── Other issues

REPORT CHANNEL:
Bot command: /report
In-app: Settings → Report Issue
Email: support@jolttime.bot
```

### Response Process

```
Issue Reported
      ↓
Priority Assessment
      ↓
┌─────────────────────────────────┐
│ P1: Revenue-affecting          │ → Fix within 24h
│ P2: User experience issues     │ → Fix within 72h
│ P3: Minor inconveniences       │ → Fix in next sprint
└─────────────────────────────────┘
      ↓
Player notified of resolution
```

---

## Success Metrics

### Ad Performance

| Metric | Target | Minimum |
|--------|--------|---------|
| Fill Rate | >95% | 80% |
| Viewability | >70% | 50% |
| Skip Rate (Interstitial) | <30% | 50% |
| Completion Rate (Rewarded) | >80% | 60% |
| User Complaints | <1% | 3% |

### Revenue Health

| Metric | Target |
|--------|--------|
| Revenue per DAU | >$0.04 |
| Rewarded ad ratio | >30% of revenue |
| User satisfaction | >4/5 |
| Retention with ads | No negative impact |

---

## Anti-Frustration Measures

### Player Protection

```
NEVER DO:
❌ Make players feel forced to watch ads
❌ Block progress without watching ads
❌ Show multiple ads in a row
❌ Use anxiety-inducing messages
❌ Punish players for skipping ads
❌ Make ads more frequent than allowed

ALWAYS DO:
✅ Thank players for watching
✅ Show clear value proposition
✅ Respect their choice to skip
✅ Keep frequency within limits
✅ Provide non-ad alternatives
✅ Listen to player feedback
```

---

## Future Considerations

### Potential Enhancements

```
PHASE 2:
├── More rewarded ad options
├── Personalized ad experiences
├── Season-themed ad campaigns
└── Community goal ads (shared rewards)

PHASE 3:
├── Interactive ads
├── Playable ads
├── Survey-based feedback
└── Extended rewarded options
```

---

*Ads should enhance the experience, not interrupt it. Respect leads to trust. Trust leads to retention. Retention leads to sustainable revenue.*
