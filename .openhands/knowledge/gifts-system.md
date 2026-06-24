# Jolt Time — Gifts and Social Interaction System

## Document Overview

This document defines the complete gift system and positive social interactions for Jolt Time. The system is designed to strengthen friendships and community bonds while maintaining strict anti-abuse measures. All gift features encourage positive social behavior without creating pressure, dependency, or exploitable mechanics.

---

## 1. Gift System Overview

### Core Philosophy

The gift system serves as a vehicle for positive social reinforcement:

- **Strengthening Bonds** — Gifts express appreciation between friends
- **Community Building** — Shared rewards encourage cooperation
- **Anti-Abuse Priority** — Strict limits prevent exploitation
- **Voluntary Participation** — No gameplay advantage from receiving gifts

### System Scope

| Feature | Description |
|---------|-------------|
| Daily Gifts | Limited daily exchanges between friends |
| Gift Categories | Daily, Event, Anniversary, Friendship types |
| Gift History | Complete record of sent and received gifts |
| Friendship Milestones | Rewards for long-term friendships |
| Social Rewards | Bonuses for positive interactions |
| Anti-Abuse Systems | Prevention of farming and exploitation |

---

## 2. Daily Gifts

### 2.1 Gift Types

**Daily Gift Contents**
| Gift Type | Value Range | Rarity |
|-----------|-------------|--------|
| Chrono Coins | 10-50 coins | Common |
| Energy | 5-20 energy | Common |
| Expedition Keys | 1 key | Rare |
| Social Tokens | 1-3 tokens | Rare |

**Gift Selection**
- Contents randomized for surprise element
- Higher value gifts are rarer
- No guarantee of specific content
- Fun anticipation over guaranteed value

### 2.2 Gift Mechanics

**Sending a Gift**
- One gift per friend per day
- Gifts reset at UTC midnight
- No cost to sender (free action)
- Recipient receives notification

**Receiving a Gift**
- Gifts appear in Gift Center
- Must be claimed (one-tap claim)
- Unclaimed gifts expire after 7 days
- Grace period prevents missed gifts

**Gift Delivery**
- Instant notification via push
- Bot notification if Mini App closed
- Gift preview in notification
- Claim from notification or Gift Center

### 2.3 Daily Sending Limits

| Player Type | Daily Gifts | Per Friend |
|-------------|-------------|------------|
| Free Players | 20 gifts | 1 |
| Jolt Time Plus | 50 gifts | 1 |
| Premium | Unlimited | 1 |

**Limit Enforcement**
- Counter shown: "15/20 gifts sent today"
- At limit: "You've sent all your gifts today. Come back tomorrow!"
- Timer shows reset time

### 2.4 Daily Receiving Limits

| Player Type | Daily Gifts | Storage |
|-------------|-------------|---------|
| All Players | Unlimited | 10 unclaimed max |

**Storage Overflow**
- 11th unclaimed gift auto-claims oldest
- Overflow notification shown
- No gifts lost permanently

---

## 3. Gift Limits

### 3.1 Daily Limits

**Sending Limits**
- Per friend: 1 gift per day (strict)
- Global: 20-50 gifts per day (by tier)
- Reset: UTC midnight

**Receiving Limits**
- Per friend: Unlimited gifts (accept multiple from same friend)
- Global: Unlimited (10 unclaimed max)
- Expiry: 7 days unclaimed

### 3.2 Anti-Abuse Rules

**Account Requirements**
- Minimum account age: 7 days to send gifts
- Minimum level: Level 5 to send gifts
- Friends must be mutual: Both players must have accepted

**Rate Limiting**
- Maximum 5 gifts to same friend per week
- Burst limit: 10 gifts in 1 hour triggers cooldown
- Cooldown: 1 hour before can send again

**Mutual Requirement**
- Cannot gift someone who hasn't accepted friend request
- Friend request must be accepted by both parties
- One-sided "friendships" cannot exchange gifts

---

## 4. Gift Categories

### 4.1 Daily Gifts

**Standard Daily Gifts**
- Sent via Friends List or Gift Center
- Random contents from standard pool
- No special requirements
- Available every day

**Daily Gift UI**
```
┌─────────────────────────────────────────────────────────────────┐
│  🎁 DAILY GIFTS                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Gifts Sent Today: 12/20                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  @FriendName1                                           │   │
│  │  💰 Sent 25 Chrono Coins                               │   │
│  │  [SEND GIFT]                      ✓ Sent               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  @FriendName2                                           │   │
│  │  🎁 Waiting to be claimed                              │   │
│  │  [SEND GIFT]                      ⏳ Pending            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Event Gifts

**Seasonal Events**
- Special gift themes during events
- Enhanced contents (bonus coins, event tokens)
- Limited duration (event length)
- Event-specific graphics

**Event Gift Contents**
| Event Type | Bonus Contents |
|------------|---------------|
| Seasonal | +50% coins, event tokens |
| Holiday | Holiday-themed cosmetics |
| Anniversary | Special badge, bonus coins |
| Milestone | Rare artifacts (very rare) |

### 4.3 Anniversary Gifts

**Friendship Anniversary**
- Gifts sent on friendship milestones (day 7, 30, 100, 365)
- Enhanced value compared to daily gifts
- Special packaging/notification
- Both players receive commemorative item

**Anniversary Gift Contents**
| Milestone | Sender Gift | Receiver Gift |
|-----------|-------------|---------------|
| 7 Days | 50 coins + 1 Social Token | 25 coins |
| 30 Days | 100 coins + 5 Social Tokens | 50 coins |
| 100 Days | 250 coins + Rare Fragment | 100 coins |
| 365 Days | Legendary Fragment + Badge | Epic Fragment + Badge |

### 4.4 Friendship Rewards

**Milestone Bonuses**
- Rewards for reaching friendship milestones
- Based on cumulative positive interactions
- Cosmetic rewards preferred

**Friendship Reward Tiers**
| Interaction | Reward |
|-------------|--------|
| First Gift Exchange | "First Gift" badge |
| 10 Gifts Sent | "Generous" title |
| 50 Gifts Sent | "Philanthropist" badge |
| 100 Gifts Received | "Popular" badge |
| All Friends Gifted (daily) | Bonus coins (weekly) |

---

## 5. Social Rewards

### 5.1 Active Friendship Rewards

**Purpose**
Reward players for maintaining active friendships and regular social engagement.

**Active Friendship Criteria**
- Both players sent/received at least 1 gift in past 7 days
- At least 1 greeting exchanged in past 7 days
- Both players are Level 10+

**Weekly Active Friendship Bonus**
| Friends Active | Weekly Bonus |
|---------------|--------------|
| 1-5 friends | 50 coins |
| 6-10 friends | 100 coins + 3 Social Tokens |
| 11-25 friends | 250 coins + 5 Social Tokens |
| 26+ friends | 500 coins + 10 Social Tokens |

### 5.2 Helping Friends Rewards

**Quest Assistance**
- "Help a Friend" quests available
- Help friend complete quest → Both get bonus
- Limited to 3 helps per week

**Help Quest Rewards**
| Action | Helper Reward | Helped Reward |
|--------|---------------|---------------|
| Help complete daily quest | 10 coins + 1 Social Token | 5 coins |
| Help complete weekly quest | 25 coins + 3 Social Tokens | 15 coins |
| Help reach milestone | 50 coins + Rare Fragment | 25 coins |

### 5.3 Long-Term Interaction Rewards

**Loyal Friend Bonus**
- Sustained friendship over time
- Rewards increase with friendship duration

**Loyal Friend Rewards**
| Duration | Annual Bonus |
|----------|--------------|
| 6 months | 500 coins + Epic Fragment |
| 1 year | 1000 coins + Legendary Fragment |
| 2+ years | 2000 coins + Exclusive Badge |

### 5.4 Reward Balance Philosophy

**Cosmetic Over Competitive**
- Social rewards are cosmetic or minor convenience
- No gameplay power from social rewards
- No competitive advantage from social spending

**Fair Distribution**
- Helpers and recipients both benefit
- No exploitation through fake friendships
- Rewards capped to prevent inflation

---

## 6. Friendship Milestones

### 6.1 Milestone Types

**Time-Based Milestones**
| Days | Title | Reward |
|------|-------|--------|
| 7 | New Friend | 25 coins + "Week 1" badge |
| 30 | Friend | 50 coins + "Month 1" badge |
| 100 | Good Friend | 100 coins + "Century" badge |
| 365 | Best Friend | 500 coins + "Year One" badge |
| 730 | Old Friend | 1000 coins + "Old Friend" badge |

**Interaction Milestones**
| Interactions | Title | Reward |
|--------------|-------|--------|
| 10 gifts | Gift Giver | "Generous" badge |
| 50 gifts | Generous | "Philanthropist" badge |
| 100 greetings | Social Butterfly | "Communicator" badge |
| 500 achievements reacted | Supportive | "Encourager" badge |

### 6.2 Milestone Rewards Philosophy

**Cosmetic Focus**
- Badges and titles preferred over currency
- Recognition > Compensation
- Milestones celebrated, not monetized

**Reward Caps**
- Maximum 1000 coins per milestone year
- No Legendary+ artifacts as milestone rewards
- Rare/Epic fragments acceptable for major milestones

### 6.3 Milestone Notifications

**Announcement Types**
- Both players notified when milestone reached
- Special notification for mutual milestones
- Weekly digest of upcoming milestones

**Notification Example**
```
🎉 Milestone Reached!

You and @FriendName have been friends for 100 days!

🎁 Reward: 100 Chrono Coins + "Century Friend" Badge

Keep exploring together!
```

---

## 7. Gift History

### 7.1 History Overview

**Tracked Information**
- All sent gifts with recipient, date, contents
- All received gifts with sender, date, contents
- All milestones reached with dates
- Anniversary celebrations

**History Access**
- Gift Center → History tab
- Filterable by type (sent/received/milestones)
- Searchable by friend name
- Exportable for personal records

### 7.2 Gift History UI

```
┌─────────────────────────────────────────────────────────────────┐
│  🎁 GIFT CENTER                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [Send] [Receive] [History] [Milestones]                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  GIFT HISTORY                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📤 SENT                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Today, 3:45 PM                                          │   │
│  │ To @FriendName1 → 25 Chrono Coins                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Yesterday, 11:20 AM                                     │   │
│  │ To @FriendName2 → 10 Energy                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📥 RECEIVED                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Today, 10:30 AM                                        │   │
│  │ From @FriendName3 → 35 Chrono Coins ✓ Claimed          │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Yesterday, 8:15 PM                                      │   │
│  │ From @FriendName4 → 1 Expedition Key ✓ Claimed        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Milestone History

**Milestone Timeline**
- Chronological list of all milestones
- Shared milestones highlighted
- Anniversary dates highlighted

**Stats Summary**
- Total gifts sent: XXX
- Total gifts received: XXX
- Longest friendship: @FriendName (XXX days)
- Most gifts exchanged with: @FriendName (XXX)

---

## 8. Privacy Controls

### 8.1 Gift Privacy Settings

**Who Can Send Gifts**
| Setting | Description |
|---------|-------------|
| Everyone | Any player can send you gifts |
| Friends Only | Only friends can send gifts |
| Nobody | Block all incoming gifts |

**Who Can Receive Gifts**
| Setting | Description |
|---------|-------------|
| Everyone | Can send gifts to any player |
| Friends Only | Can only send gifts to friends |
| Custom | Select specific friends |

### 8.2 Social Interaction Privacy

**Interaction Controls**
| Action | Everyone | Friends Only | Nobody |
|--------|----------|--------------|--------|
| Send Gift | ✓ | ✓ | ✗ |
| Send Greeting | ✓ | ✓ | ✗ |
| React to Achievement | ✓ | ✓ | ✗ |
| View Gift History | Self only | ✗ | ✗ |
| Send Challenge | ✓ | ✓ | ✗ |

### 8.3 Notification Privacy

**Gift Notifications**
- Can disable gift notifications entirely
- Can mute specific friends' gift notifications
- Quiet hours apply to all notifications
- Batch notifications available

---

## 9. Anti-Abuse Systems

### 9.1 Fake Account Prevention

**Account Verification**
- Telegram account must be active (>1 week)
- Minimum profile completion required
- Phone number verification recommended
- Bot detection on suspicious patterns

**Behavioral Detection**
- Gift patterns analyzed for anomalies
- Rapid friend additions flagged
- Mass gift sending detected
- Coordinated account identification

### 9.2 Self-Gifting Prevention

**Self-Gift Block**
- Cannot send gifts to self
- Cannot create alternate accounts for self-gifting
- Cross-account gift detection (same phone/Device)

**Family Account Rules**
- Verified family members exempt from mutual gift limits
- Family verification required
- Maximum 2 family accounts linked

### 9.3 Automated Gift Loop Prevention

**Loop Detection**
- Gift exchanges >10 per day between same pair flagged
- Bidirectional gift patterns analyzed
- Rapid fire gift sessions detected

**Rate Limiting**
- Maximum gifts per pair per day: 2 (send + receive)
- Burst detection: 5 gifts in 10 minutes → 1 hour cooldown
- Daily cap enforcement regardless of client behavior

### 9.4 Exploitation Penalties

**Warning System**
- First offense: Warning notification
- Second offense: 24-hour gift suspension
- Third offense: 7-day gift suspension + review

**Permanent Actions**
- Severe abuse: Account suspension
- Monetization fraud: Revenue recovery + ban
- Appeal process available after penalty

### 9.5 Anti-Abuse Monitoring

**Real-Time Monitoring**
- Gift transaction velocity tracking
- New account gift pattern analysis
- Geographic clustering detection
- Device fingerprinting for multi-account

**Weekly Review**
- Flagged accounts reviewed by moderation
- False positive manual review
- Pattern analysis for new exploit types
- System tuning based on findings

---

## 10. Telegram Bot Notifications

### 10.1 Gift Notifications

**Received Gift**
| Scenario | Notification |
|----------|-------------|
| Single gift | "@FriendName sent you a gift! Tap to open." |
| Multiple gifts | "You have 3 gifts waiting! Tap to open all." |
| Event gift | "@FriendName sent a [Event] gift! Limited time contents!" |

### 10.2 Milestone Notifications

**Friendship Milestone**
- "You and @FriendName have been friends for 30 days! Claim your reward."
- "@FriendName reached 100 days with 5 friends! Celebrate with them."

**Achievement Unlocked**
- "You reached 'Generous' badge for sending 50 gifts!"
- "@FriendName earned 'Popular' badge!"

### 10.3 Anniversary Notifications

**Upcoming Anniversary**
- "You and @FriendName have been friends for 99 days! Anniversary tomorrow!"
- "Don't forget to celebrate your 1-year friendship next week!"

**Anniversary Day**
- "🎉 Happy Friendship Anniversary with @FriendName! Open your gift!"

### 10.4 Notification Frequency Rules

**Anti-Spam Rules**
- Maximum 3 gift-related notifications per day
- Batch similar notifications
- Quiet hours respected
- User-configurable per notification type

**Digest Option**
- Combine all gift notifications into daily digest
- Single notification at user-configured time
- Full details in Gift Center

---

## 11. AdsGram Integration

### 11.1 Optional Ad Rewards

**Gift Enhancement Options**
| Feature | Base | With Ads (Optional) |
|---------|------|---------------------|
| Daily Gifts | 20 | +10 bonus gifts |
| Gift Value | 10-50 coins | Chance for 100+ coins |
| Anniversary Gift | Standard | Enhanced contents |
| Storage | 10 unclaimed | 20 unclaimed |

**Social Token Multiplier**
- Watch ad → 2x Social Tokens for 24 hours
- Social Tokens used for premium social features

### 11.2 Bonus Social Rewards

**Watch Ad Options**
| Action | Without Ads | With Ads |
|--------|-------------|----------|
| Claim gift | Standard | +10 coins |
| Send gift | Standard | +1 bonus gift to random friend |
| Milestone | Standard badge | Enhanced badge |

### 11.3 Ad Compliance

**Non-Intrusive Design**
- Ads never required for social features
- Gift system fully functional without ads
- Clear labeling of optional enhancements
- Easy opt-out of ad-enhanced features

**Transparency**
- Reward value shown before watching
- No deceptive ad placement
- No ads in gift-giving flow

---

## 12. Community Philosophy

### 12.1 Encouraging Friendships

**Design Principles**
- Every interaction should feel good
- Gifts are appreciation, not obligation
- No pressure to maintain friendships
- Celebrating others is its own reward

**Positive Reinforcement**
- "Your friend @X will love this!" (encouraging)
- "You made @X's day!" (after sending gift)
- "Thanks for being a great community member!" (periodic)

### 12.2 Rewarding Positive Behavior

**Good Citizen Rewards**
- Consistent positive interactions → badges and recognition
- Helping others → Social Tokens and bonuses
- Long-term engagement → anniversary rewards

**Recognition Systems**
- "Generous" badge for gift givers
- "Supportive" badge for achievement reactors
- "Communicator" badge for greeters
- No shame badges for low activity

### 12.3 Avoiding Toxic Competition

**No Gift Leaderboards**
- Personal progress tracked, not compared
- No "Top Gifter" public rankings
- No negative comparison to others
- No shame for not gifting

**No Mandatory Reciprocity**
- Gifts are gifts, not obligations
- No "gift debt" system
- No negative social pressure
- Thankfulness over expectation

### 12.4 Supporting Healthy Communities

**Community Building**
- Cooperative events over competitive
- Shared goals encourage teamwork
- Guild gifts (future) reinforce group bonds
- Event participation celebrated

**Moderation Presence**
- Community guidelines clearly displayed
- Report mechanism for abuse
- Quick response to negative behavior
- Graduated consequences for violations

---

## 13. Future Social Features

### 13.1 Birthday Gifts

**Planned Features**
- Players set birthday in profile
- Friends can send special birthday gifts on that day
- Birthday gift has enhanced contents
- Birthday week (7 days) for sending

**Birthday Gift Contents**
- Enhanced coin bonus
- Special "Birthday" badge
- Limited-edition cosmetic item
- 2x Social Tokens for sender

**Privacy**
- Birthday visibility: Friends Only by default
- Can hide birthday entirely
- Can change birthday once per year

### 13.2 Guild Gifts

**Planned Features**
- Send gifts to all guild members simultaneously
- Guild gift contributions
- Shared guild gift pool
- Guild milestone celebrations

**Guild Gift System**
- Contribute to guild gift fund
- Guild leader distributes gifts
- Weekly guild gift event
- Guild-wide anniversary rewards

### 13.3 Shared Expeditions

**Planned Features**
- Invite friends to join expedition
- Each participant contributes energy
- Shared rewards based on contribution
- Contribution tracking and recognition

**Cooperative Mechanics**
- Combined artifact drop rates
- Shared discovery progress
- Team achievement recognition
- Communication via bot messages

### 13.4 Cooperative Rewards

**Planned Features**
- Group goals for friend clusters
- Team achievements for milestones
- Shared collection progress tracking
- Community challenges

**Reward Distribution**
- Equal distribution among participants
- Bonus for consistent participation
- No free-rider problem (minimum contribution required)

---

## 14. System Integration

### 14.1 Connected Systems

**Quest System**
- "Send 5 gifts" — Daily quest
- "Reach a friendship milestone" — Weekly quest
- "Help a friend complete a quest" — Special quest
- Rewards: Coins, Social Tokens, XP

**Achievement System**
- "First Gift" — Send first gift
- "Generous" — Send 50 gifts
- "Popular" — Receive 100 gifts
- "Social Butterfly" — Reach milestones with 10 friends

**Economy System**
- Social Tokens: Earned through social activity
- Gift contents: From dedicated social currency pool
- Anti-inflation: Daily caps on social currency circulation

### 14.2 Data Model

**Gift Transactions Table**
```
gift_transactions {
  id: uuid
  sender_id: uuid (FK to users)
  receiver_id: uuid (FK to users)
  gift_type: enum (daily, event, anniversary, milestone)
  contents: jsonb
  sent_at: timestamp
  claimed_at: timestamp (nullable)
  expires_at: timestamp
}
```

**Friendship Milestones Table**
```
friendship_milestones {
  id: uuid
  user_id: uuid (FK to users)
  friend_id: uuid (FK to users)
  milestone_type: string
  milestone_date: date
  rewarded_at: timestamp (nullable)
  reward_contents: jsonb
}
```

**Social Tokens Table**
```
social_tokens {
  user_id: uuid (FK to users)
  balance: integer
  lifetime_earned: integer
  lifetime_spent: integer
  updated_at: timestamp
}
```

### 14.3 Performance Considerations

- Gift list cached, refreshed on open
- Background job processes gift expirations
- Batch notifications for gift digests
- History paginated (50 items per page)

---

## 15. Related Documentation

- [Friends System](./friends-system.md) — Friend management and interactions
- [Social System](./social-system.md) — Overview of all social features
- [Economy System](./economy-system.md) — Currency and economy balancing
- [Notifications](./notifications.md) — Push notification system
- [Settings](./settings.md) — User settings and accessibility
- [Privacy & Security](../security-system.md) — Security architecture

---

*Gifts strengthen bonds, community builds connections.*
