# Jolt Time — Friends System and Social Interactions

## Document Overview

This document defines the complete friends system and social interaction features for Jolt Time. The system is designed to encourage positive interactions between players while keeping all social features entirely optional. Social systems support community building without creating pressure or toxicity.

---

## 1. Friends System Overview

### Core Philosophy

The friends system in Jolt Time serves as the foundation for social gameplay. All social features are designed around three principles:

- **Optional Participation** — No social feature is mandatory for progression
- **Positive Interactions** — All interactions should be welcoming and supportive
- **Privacy First** — Players control who can find them and what information is shared

### System Scope

| Feature | Implementation |
|---------|----------------|
| Friend Management | Send, accept, decline, remove friends |
| Friend List | Display with privacy controls |
| Friend Interactions | Gifts, greetings, reactions |
| Friend Limits | 100 friends base, expandable |
| Favorite Friends | Priority marking system |
| Social Statistics | Friendship tracking |

---

## 2. Friend Management

### 2.1 Sending Friend Requests

Players can send friend requests through multiple methods:

**Search by Username**
- Search Telegram username within the app
- Results filtered by privacy settings
- Request includes optional personal message (max 100 characters)

**QR Code**
- Generate personal QR code for easy sharing
- Scan other players' QR codes
- QR codes expire after 5 minutes for security

**Telegram Contact Sync**
- Optional: Import contacts from Telegram
- Players choose which contacts to send requests to
- All contacts must have Telegram username to be suggested

**In-Game Actions**
- "Add Friend" button on player profiles
- "Add Friend" option after battles
- "Add Friend" option from leaderboards

### 2.2 Accepting Requests

**Request Notification**
- Push notification when request received
- Request appears in dedicated "Friend Requests" tab
- Shows sender's profile preview (respecting privacy)

**Accept Flow**
- Tap "Accept" to become friends
- Both players notified of successful connection
- Friend appears in Friends List immediately

**Response Time**
- Requests remain active for 30 days
- Expired requests require re-sending

### 2.3 Declining Requests

**Decline Options**
- "Decline" — Request removed, no notification to sender
- "Decline & Block" — Request removed, sender blocked from future contact
- No penalty for declining any request

**Privacy Note**
- Sender is not notified if request is declined (silent decline)
- Declined players can still send one new request after 7 days

### 2.4 Removing Friends

**Remove Flow**
- Remove from friend's profile menu
- Confirmation required: "Remove @username from friends?"
- Removed friend does not receive notification

**Post-Removal**
- Both players can send new friend requests immediately
- Previous interaction history preserved for reference
- Removed friend can still appear in recommendations after 30 days

---

## 3. Friends List

### 3.1 Display Elements

The Friends List presents each friend with key information at a glance:

| Element | Description | Privacy Control |
|---------|-------------|-----------------|
| **Nickname** | Display name from profile | Public |
| **Level** | Player level (Lv. X) | Public |
| **Favorite Era** | Preferred historical era | Friends Only |
| **Online Status** | Online/Away/Offline indicator | Friends Only |
| **Last Seen** | Timestamp of last activity | Configurable |
| **Avatar Frame** | Achievement-based frame | Public |
| **Time Traveler Title** | Earned title | Public |

### 3.2 Online Status Philosophy

Jolt Time takes a considerate approach to online status:

**Status Types**
- **Online** — Green dot, actively playing
- **Away** — Yellow dot, inactive for 5+ minutes
- **Offline** — No indicator, last seen shown based on settings

**Privacy Considerations**
- Players can hide their online status entirely
- "Last seen" can be set to: Everyone / Friends Only / Nobody
- No guilt induction — "last seen" format is friendly ("2 hours ago"), never judgmental

**Status Updates**
- Status updates in real-time within the Mini App
- Bot notifications for friend online status (optional, off by default)

### 3.3 List Organization

**Default Sort**
- Online friends first
- Then by last interaction date
- Alphabetical as fallback

**Sort Options**
- By Level (highest first)
- By Name (A-Z)
- By Last Played (most recent)
- By Favorite Era
- Custom (drag to reorder)

**List Views**
- **Grid View** — Compact avatar-based display
- **List View** — Detailed row-based display

---

## 4. Friend Limits

### 4.1 Maximum Friend Count

**Base Limit:** 100 friends

| Player Type | Limit | Expansion |
|-------------|-------|-----------|
| Free Players | 100 | Cannot expand |
| Jolt Time Plus | 200 | +100 slots |
| Premium (Future) | 500 | +400 slots |

**Limit Enforcement**
- Players at limit cannot send requests until removing friends
- Error message: "Your friends list is full. Remove some friends to add new ones."
- Clear UX to manage existing friends when at limit

### 4.2 Future Expansion Possibilities

Documented for potential implementation:

- **Friendship Tiers** — Mutual interaction tracking that unlocks additional slots
- **Guild Integration** — Guild members don't count against friend limit
- **Social Score** — Active social participation grants bonus slots
- **Event-Based** — Special events temporarily expand limits

---

## 5. Favorite Friends

### 5.1 Marking Important Friends

Players can mark friends as favorites for priority organization:

**Favorite Categories**
- **Best Friends** — Up to 10 slots, always visible at top
- **Guild Friends** — Auto-marked if same guild, separate section
- **Real-Life Friends** — Custom tag for RL connections
- **Custom Tags** — Create custom categories (e.g., "Trading Partners")

### 5.2 Best Friends System

**Features**
- Pinned to top of Friends List with star icon
- Dedicated quick-access menu in battle/gift screens
- Special badge on friend's profile when viewing
- Max 10 Best Friends (Jolt Time Plus: 25)

**Adding/Removing**
- One-tap toggle from friend profile
- Confirmation: "Mark @username as Best Friend?"
- Swapping when at limit: "Replace @old_friend with @new_friend?"

### 5.3 Tag Management

**Default Tags**
- Best Friends (max 10)
- Guild Friends (dynamic)
- Real-Life Friends (unlimited)

**Custom Tags**
- Create custom tag name
- Assign unlimited friends to tag
- Color-code tags for visual organization
- Filter Friends List by tag

---

## 6. Social Statistics

### 6.1 Tracked Statistics

**Friendship Metrics**
| Stat | Description | Display |
|------|-------------|---------|
| Total Friends | Current friend count | "42/100 Friends" |
| Longest Friendship | Days since first friend connection | "156 days with @friend" |
| Friends Since | Date of first friend | Shown on profile |
| Mutual Friends | Friends in common with another player | Shown on profile preview |

### 6.2 Referral Statistics

**Referral Tracking**
| Stat | Description |
|------|-------------|
| Total Referrals | Players joined via your link |
| Active Referrals | Reached Level 5+ |
| Pending Rewards | Rewards awaiting milestone |
| Earned Rewards | Total rewards received from referrals |

**Referral Attribution**
- Each friend tagged with referral source
- Shows "You met @player through @referrer" when applicable
- Referral path visible in friend profile if relevant

### 6.3 Interaction Statistics

**Friendly Actions**
| Action | Count |
|--------|-------|
| Gifts Sent | Total gifts sent to friends |
| Gifts Received | Total gifts received |
| Battles | Number of friendly battles |
| Achievements Celebrated | Times you've reacted to friend achievements |
| Greetings Sent | Daily greetings sent |

---

## 7. Friendly Interactions

### 7.1 Greetings System

**Daily Greetings**
- Send one greeting per friend per day
- 5 preset greetings: "Good morning!", "Good luck today!", "Happy collecting!", "Stay curious!", "Time awaits!"
- Custom greeting option (max 50 characters)
- Greeting appears as notification to recipient

**Greeting Rewards**
- No gameplay rewards for greetings (purely social)
- "Greeting Streak" tracked for fun, no bonuses
- Greeting streaks shown on profile if >30 days

### 7.2 Achievement Reactions

**Reacting to Milestones**
- When friend reaches achievement, milestone, or collection goal
- Pre-set reactions: "🎉", "🔥", "👏", "⭐", "❤️"
- Optional brief message (max 30 characters)
- Reaction appears in friend's activity feed

**Tracked Milestones**
- Artifact collection milestones (25%, 50%, 75%, 100%)
- Museum completion (era or total)
- Level milestones (every 10 levels)
- PvP rank achievements
- Streak milestones

### 7.3 Museum Milestone Reactions

**Museum Interactions**
- "Visited" — Friend viewed your museum
- "Celebrated" — Reacted to museum achievement
- "Shared" — Friend shared museum milestone
- "Inspired" — Sent when friend gets artifact you were seeking (optional)

### 7.4 Gift-Giving

**Daily Gifts**
- Send one free gift per friend per day
- Gift contents: random selection from small coin amounts
- Gift value: 10-50 coins (random)
- Surprise element maintains excitement

**Gift Notification**
- "@FriendName sent you a gift! Tap to open."
- Opening is instant, no collection mechanics
- Both players see gift history

---

## 8. Privacy Rules

### 8.1 Request Controls

**Who Can Send Requests**
| Setting | Description |
|---------|-------------|
| Everyone | Any player can send request |
| Friends of Friends | Must share mutual friend |
| No One | Completely blocks incoming requests |

**Request Filtering**
- Blocked players cannot send requests
- Declined requests don't count against send limit
- Expired requests auto-remove after 30 days

### 8.2 Profile Visibility Controls

**Friend-Only Information**
The following information is only visible to friends by default:

- Online status and last seen
- Favorite era
- Museum progress percentage
- Full collection list
- Achievement details
- Activity history

**Public Information**
The following is always visible (unless privacy mode enabled):

- Display name
- Player level
- Avatar frame
- Time Traveler title
- Profile visibility setting

### 8.3 Interaction Controls

**Who Can Interact**
| Action | Everyone | Friends Only | Nobody |
|--------|----------|--------------|--------|
| Send Friend Request | ✓ | ✗ | ✗ |
| View Full Profile | ✓ | ✗ | ✗ |
| Send Gift | ✓ | ✗ | ✗ |
| Send Greeting | ✓ | ✗ | ✗ |
| Challenge to Battle | ✓ | ✗ | ✗ |
| React to Achievements | ✓ | ✓ | ✗ |

### 8.4 Blocking and Reporting

**Block Feature**
- Blocked players cannot:
  - Send friend requests
  - View your profile
  - Send gifts or greetings
  - Challenge you to battle
  - See your online status
- You do not appear in their search results
- Blocking is silent (no notification to blocked player)

**Report Feature**
- Report inappropriate behavior
- Categories: Spam, Harassment, Cheating, Inappropriate Content
- Report includes chat/activity context
- No notification to reported player

---

## 9. Friend Recommendations

### 9.1 Current Implementation

**Recommendation Sources**
- Players you have Telegram contacts with
- Players from same region/timezone
- Players who viewed your profile

### 9.2 Future Recommendation Features

Documented for future implementation only:

**Guild Recommendations**
- "Players from guild [Name] also play Jolt Time"
- Based on Telegram group membership
- Requires explicit opt-in from guild admins

**Mutual Friends**
- "You have 5 mutual friends with @player"
- "Your friend @Friend is friends with @SuggestedPlayer"
- Promotes organic community building

**Event Teammates**
- "Players who participated in [Event] are also playing now"
- Based on past event participation
- Matched by era preferences

**Recommendation Philosophy**
- Recommendations never feel like pressure to add friends
- Opt-out always available
- No gamification around adding recommended friends
- No rewards tied to accepting recommendations

---

## 10. Positive Community Philosophy

### 10.1 Encouraging Kindness

**Design Principles**
- All interactions have positive framing
- No negative feedback loops ("You lost" → focus on what to try next)
- Celebration of progress, not comparison
- Gift-giving is always beneficial, never mandatory

**Positive Language**
- "Your friend @X reached Level 20!" (celebration)
- "You can catch up to @X" (encouragement, not competition)
- "Great collection progress!" (appreciation)
- "Keep exploring!" (motivation)

### 10.2 Avoiding Toxicity

**Anti-Toxicity Measures**
- No public leaderboard shame (bottom scorers not highlighted)
- No "worst" rankings or negative comparisons
- Battle results shown privately, not broadcast
- No global announcements of defeats

**Competitive Balance**
- Leaderboards show rank ranges, not exact scores of others
- PvP matching based on skill, not punitive matchmaking
- No "revenge" mechanics or negative-sum competition

**Moderation Ready**
- All messages/reportable
- Clear community guidelines
- Quick response to reported behavior
- Graduated consequences for violations

### 10.3 Supporting Cooperative Gameplay

**Cooperation Over Competition**
- Group goals prioritized in events
- "Help a Friend" quests available
- Shared museum progress (future guild feature)
- Artifact discovery shared with friends optionally

**Accessibility in Social**
- Social features never require real-time interaction
- Asynchronous options for all multiplayer features
- No voice chat required anywhere
- Time zone differences respected

---

## 11. Telegram Bot Notifications

### 11.1 Friend-Related Notifications

**Notification Types**
| Notification | Trigger | Default | Frequency Cap |
|--------------|---------|---------|---------------|
| Friend Request | Someone sends request | ON | Unlimited (individual) |
| Request Accepted | Request accepted | ON | Once per acceptance |
| Gift Received | Friend sends gift | ON | Batched if multiple |
| Greeting Received | Friend sends greeting | ON | Batched if multiple |
| Friend Online | Friend comes online | OFF | Max 5/day |
| Friend Milestone | Friend reaches achievement | OFF | Batched if multiple |
| Friend Inactive | Friend hasn't played in 7+ days | OFF | Once per friend/week |

### 11.2 Notification Frequency Rules

**Anti-Spam Rules**
- Maximum 3 friend-related notifications per day per category
- Batch similar notifications ("3 friends sent you gifts!")
- Quiet hours respected for all notifications
- User can disable any notification type entirely

**Notification Grouping**
- Multiple gifts → single notification with count
- Multiple greetings → single notification with senders
- Multiple milestones → digest notification

### 11.3 Bot Command Preferences

**Notification via Bot**
- Bot delivers friend notifications if Mini App closed
- Users can set notification preferences in bot
- `/friends` — Quick friend list access
- `/gifts` — Pending gifts summary
- `/settings` — Notification preferences

---

## 12. AdsGram Integration

### 12.1 Social Feature Ads Philosophy

**Core Principle**
Friend systems must never pressure users to watch ads. Social features are designed to be fully functional without any ad participation.

**Optional Enhancement Model**
AdsGram rewards may optionally enhance social features, but never gate them.

### 12.2 Optional Ad Rewards for Social

| Feature | Without Ads | With Ads (Optional) |
|---------|-------------|---------------------|
| Daily Gift | 1 per friend | +1 bonus gift per friend |
| Greeting | 5 presets | Unlock custom greetings |
| Gift Value | 10-50 coins | Chance for +100 coin gift |
| Friend Slots | 100 base | +10 bonus slots (permanent) |
| Celebration | Basic reactions | Unlock premium reactions |

### 12.3 AdsGram Compliance

**Non-Intrusive Design**
- No ads required to send gifts
- No ads required to see friend activity
- No ads in friend request flow
- No ads during social interactions

**Transparency**
- Ads clearly labeled as optional
- Reward value shown before watching
- Easy opt-out of ad-enhanced features

**Fairness**
- All social rewards earnable without ads
- Ads provide convenience, not advantage
- No competitive social features affected

---

## 13. Future Social Features

### 13.1 Direct Messages

**Planned Features**
- Private 1-on-1 messaging between friends
- Text messages with emoji support
- Artifact/image sharing capability
- Message history (last 100 messages)
- Block/mute functionality

**Implementation Notes**
- Requires moderation infrastructure
- Report functionality built-in
- Blocked users cannot send messages
- No message encryption required (Telegram handles)

### 13.2 Friend Activity Feed

**Planned Features**
- Unified feed of friend activities
- Filter by activity type
- Chronological display
- "Catch up" summary for inactive periods
- Customizable notification preferences per activity

**Activity Types**
- Artifact discoveries
- Museum milestones
- Level ups
- Battle results (win/loss, no scores)
- Daily login streaks
- Gift exchanges

### 13.3 Shared Expeditions

**Planned Features**
- Invite friends to join expedition
- Each participant contributes energy
- Shared rewards based on contribution
- Contribution tracking and recognition
- Difficulty scaling based on team size

**Cooperative Mechanics**
- Combined artifact drop rates
- Shared discovery progress
- Team achievement recognition
- Communication via bot messages

### 13.4 Friend Challenges

**Planned Features**
- Weekly challenge between friends
- Challenge categories: Collection, Museum, Streak, Energy
- Progress tracking throughout week
- Winner recognition (no loser shaming)
- Small reward for both participants

**Challenge Design**
- Non-zero-sum: both can win with different goals
- Self-improvement focused
- Time-limited weekly reset
- No PvP combat required

---

## 14. System Integration

### 14.1 Connected Systems

**Quest System Integration**
- "Add 3 friends" — First-time friend connections
- "Send 10 gifts" — Gift-sending encouragement
- "React to 5 achievements" — Social engagement
- Weekly social quests refresh Monday

**Achievement System Integration**
- "First Friend" — Add first friend
- "Social Butterfly" — Reach 25 friends
- "Collector of Friends" — Reach 50 friends
- "Gift Giver" — Send 100 gifts
- "Best Friend" — Mark someone as Best Friend

**Leaderboard Integration**
- Friends can be filtered on leaderboards
- Friend rank shown on their profile
- "Beat your friend" suggestions (non-intrusive)

**Referral System Integration**
- Friends can be tagged as referrals
- Referral progress shown in friend profile
- Referral rewards attributed correctly

### 14.2 Data Model

**Friendship Table Structure**
```
friendships {
  id: uuid
  requester_id: uuid (FK to users)
  addressee_id: uuid (FK to users)
  status: enum (pending, accepted, declined, blocked)
  created_at: timestamp
  updated_at: timestamp
  favorited_at: timestamp (nullable)
  favorite_tag: string (nullable)
  referred_by: uuid (nullable, FK to users)
}
```

**Friend Tags Table**
```
friend_tags {
  id: uuid
  user_id: uuid (FK to users)
  name: string
  color: string
  is_default: boolean
  created_at: timestamp
}
```

### 14.3 Performance Considerations

- Friend list loads first 20, pagination for rest
- Online status updated via Telegram updates, not polling
- Activity feed cached, refreshed on open
- Search uses Telegram username index

---

## 15. Related Documentation

- [Social System](./social-system.md) — Overview of all social features
- [Leaderboards](./leaderboards.md) — Competitive ranking system
- [Referral System](./referral-system.md) — Player acquisition
- [Notifications](./notifications.md) — Push notification system
- [Privacy & Security](../security-system.md) — Security architecture
- [Settings](./settings.md) — User settings and accessibility

---

*Building connections through time.*
