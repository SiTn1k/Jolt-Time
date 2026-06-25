# Realtime Architecture

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Project:** Jolt Time  
**Platform:** Telegram Mini App + Telegram Bot  
**Backend:** Supabase Realtime + PostgreSQL  

---

## Table of Contents

1. [Realtime Categories](#1-realtime-categories)
2. [Realtime Philosophy](#2-realtime-philosophy)
3. [Realtime Architecture Layers](#3-realtime-architecture-layers)
4. [Player Realtime Architecture](#4-player-realtime-architecture)
5. [Museum Realtime Architecture](#5-museum-realtime-architecture)
6. [Event Realtime Architecture](#6-event-realtime-architecture)
7. [PvP Realtime Architecture](#7-pvp-realtime-architecture)
8. [Guild Realtime Architecture](#8-guild-realtime-architecture)
9. [Notification Realtime Architecture](#9-notification-realtime-architecture)
10. [Subscription Management Philosophy](#10-subscription-management-philosophy)
11. [Event Processing Standards](#11-event-processing-standards)
12. [Performance Philosophy](#12-performance-philosophy)
13. [Security Standards](#13-security-standards)
14. [AdsGram Realtime Notes](#14-adsgram-realtime-notes)
15. [Monitoring Standards](#15-monitoring-standards)
16. [Failure Recovery Philosophy](#16-failure-recovery-philosophy)
17. [Scaling Philosophy](#17-scaling-philosophy)
18. [Future Expansion Notes](#18-future-expansion-notes)
19. [Long-Term Philosophy](#19-long-term-philosophy)

---

## 1. Realtime Categories

The Realtime system is organized into seven distinct categories, each serving different aspects of the Jolt Time experience. Realtime functionality is used strategically—not every system requires live updates.

### 1.1 Player Realtime

Player Realtime handles all player-centric live updates including profile changes, progression milestones, and personal achievements. This is the most frequently accessed realtime category.

**Components:**
- Profile data synchronization
- Experience and level progression
- Achievement unlock notifications
- Reward delivery confirmations

### 1.2 Museum Realtime

Museum Realtime manages artifact-related live updates including discoveries, collection progress, and exhibition changes. This category supports the collection gameplay loop.

**Components:**
- Artifact discovery events
- Collection completion updates
- Museum expansion notifications
- Exhibition slot changes

### 1.3 Event Realtime

Event Realtime handles time-limited event updates including mission progress, participation status, and seasonal content. Events require timely updates to maintain engagement.

**Components:**
- Mission progress synchronization
- Event participation tracking
- Seasonal content updates
- Event countdown notifications

### 1.4 PvP Realtime

PvP Realtime manages competitive gameplay updates including battle results, rankings, and leaderboards. Competitive features require low-latency updates for fair play.

**Components:**
- Battle result notifications
- Ranking change updates
- Leaderboard position changes
- League promotion alerts

### 1.5 Guild Realtime

Guild Realtime handles guild community updates including activity feeds, progression changes, and announcements. Social features benefit from live synchronization.

**Components:**
- Guild activity feed updates
- Guild progression changes
- Announcement broadcasts
- Guild event notifications

### 1.6 Notification Realtime

Notification Realtime delivers system notifications including rewards, mission completions, and important announcements. This category serves as the primary delivery channel.

**Components:**
- Reward notifications
- Mission completion alerts
- Seasonal announcements
- System event notifications

### 1.7 Analytics Realtime

Analytics Realtime tracks engagement metrics and player behavior in real-time. This category is write-heavy with minimal client subscriptions.

**Components:**
- Session tracking
- Engagement metrics
- Feature usage data
- Retention events

---

## 2. Realtime Philosophy

Realtime systems should improve user experience while minimizing infrastructure costs. Not every system requires live updates—strategic use of realtime prevents unnecessary complexity and expense.

### 2.1 Improve Engagement

Realtime updates create a sense of presence and immediacy that keeps players engaged.

**Engagement Principles:**
- Notify players of relevant changes while they are active
- Provide immediate feedback for actions taken
- Create moments of surprise and delight with unexpected updates
- Maintain social connections through live activity

### 2.2 Reduce Manual Refreshes

Realtime updates eliminate the need for players to manually refresh their screens, creating a seamless experience.

**Refresh Reduction:**
- Profile updates appear automatically
- Leaderboard positions update live
- Event progress syncs without user action
- Notifications arrive without polling

### 2.3 Remain Scalable

Realtime architecture must scale from thousands to millions of users without performance degradation.

**Scalability Principles:**
- Minimize active subscriptions per user
- Use efficient event distribution patterns
- Implement connection pooling
- Support horizontal scaling

### 2.4 Avoid Unnecessary Subscriptions

Not all data requires realtime updates. Use polling for rarely changing data and subscriptions only for frequently changing, time-sensitive data.

**Subscription Decisions:**

| Data Type | Update Frequency | Strategy |
|-----------|-----------------|----------|
| Player profile | On change | Subscription |
| Leaderboard | High | Subscription |
| Museum collections | Low | Polling |
| Guild details | Medium | Polling |
| Event status | On change | Subscription |
| Notifications | On change | Subscription |
| Static content | Never | Cache only |

---

## 3. Realtime Architecture Layers

The Realtime Architecture consists of four distinct layers, each with specific responsibilities.

### 3.1 Client Layer

The Client Layer handles realtime connections from Telegram Mini Apps and Bot clients. Clients subscribe to specific channels and receive filtered updates.

**Responsibilities:**
- Establish and maintain websocket connections
- Subscribe to relevant channels based on user context
- Filter and process incoming events
- Handle reconnection and state synchronization

**Client Implementation:**
```
Client Channels:
├── user:{user_id}:profile         # Player profile updates
├── user:{user_id}:notifications   # Personal notifications
├── user:{user_id}:achievements    # Achievement unlocks
├── event:{event_id}               # Event-wide broadcasts
├── guild:{guild_id}               # Guild updates
├── pvp:leaderboard                # Global leaderboard
└── global:announcements           # System announcements
```

### 3.2 Subscription Layer

The Subscription Layer manages channel subscriptions, validates permissions, and routes events to appropriate recipients.

**Responsibilities:**
- Validate user authentication and permissions
- Manage channel subscriptions
- Route events to subscribed clients
- Handle subscription cleanup on disconnect

**Subscription Patterns:**
```
Pattern: user:{user_id}:{category}
├── Subscription requires: Valid authentication token
├── RLS compatibility: Row-level security enforced
└── Cleanup: Automatic on disconnect

Pattern: event:{event_id}
├── Subscription requires: Event participation or public event
├── RLS compatibility: Public events broadcast freely
└── Cleanup: Automatic on event end

Pattern: guild:{guild_id}
├── Subscription requires: Guild membership
├── RLS compatibility: Member-only broadcasts
└── Cleanup: Automatic on leave
```

### 3.3 Event Processing Layer

The Event Processing Layer transforms database events into client-friendly payloads and handles event distribution logic.

**Responsibilities:**
- Transform database events into broadcast messages
- Apply business logic for event routing
- Handle event prioritization
- Support event queuing during high load

**Event Transformation:**
```
Database Event (Postgres NOTIFY):
├── table: String
├── operation: INSERT | UPDATE | DELETE
├── record: Object
└── timestamp: DateTime

Broadcast Payload:
├── type: String (e.g., "PROFILE_UPDATE")
├── payload: Object (filtered, transformed)
├── timestamp: DateTime
├── priority: HIGH | MEDIUM | LOW
└── channels: String[] (recipients)
```

### 3.4 Database Event Layer

The Database Event Layer captures changes from PostgreSQL and publishes them to the Supabase Realtime infrastructure.

**Responsibilities:**
- Capture table changes via PostgreSQL triggers
- Publish events via NOTIFY/pg_notify
- Maintain event ordering
- Support event replay for recovery

**Database Trigger Pattern:**
```sql
-- Example trigger for profile updates
CREATE OR REPLACE FUNCTION fn_realtime_profile_update()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'profile_updates',
    jsonb_build_object(
      'operation', TG_OP,
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profile_realtime
AFTER UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION fn_realtime_profile_update();
```

---

## 4. Player Realtime Architecture

Player Realtime supports profile updates, progression updates, achievement notifications, and reward notifications.

### 4.1 Profile Updates

Profile updates notify players when their core data changes. These updates are high-priority and should arrive with minimal latency.

**Events:**
```
Profile Update Event:
├── type: "PROFILE_UPDATED"
├── payload:
│   ├── user_id: UUID
│   ├── changes: String[] (changed fields)
│   ├── level: Integer (if changed)
│   ├── experience: BigInt (if changed)
│   └── updated_at: DateTime
├── priority: HIGH
└── latency_target: < 100ms
```

**Use Cases:**
- Level up notifications
- Experience gain confirmations
- Premium status changes
- Username or avatar updates

### 4.2 Progression Updates

Progression updates inform players of advancement through eras, stories, and world map positions.

**Events:**
```
Progression Update Event:
├── type: "PROGRESSION_UPDATE"
├── payload:
│   ├── user_id: UUID
│   ├── unlocked_eras: String[] (if changed)
│   ├── completed_stories: String[] (if changed)
│   ├── world_position: Object (if changed)
│   └── progression_type: "ERA_UNLOCK" | "STORY_COMPLETE" | "MAP_ADVANCE"
├── priority: HIGH
└── latency_target: < 100ms
```

### 4.3 Achievement Notifications

Achievement notifications celebrate player milestones with rich, celebratory payloads.

**Events:**
```
Achievement Unlock Event:
├── type: "ACHIEVEMENT_UNLOCKED"
├── payload:
│   ├── user_id: UUID
│   ├── achievement_id: String
│   ├── achievement_name: String
│   ├── achievement_description: String
│   ├── rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY"
│   ├── rewards: Object[] (if any)
│   └── unlocked_at: DateTime
├── priority: MEDIUM
└── latency_target: < 200ms
```

### 4.4 Reward Notifications

Reward notifications confirm currency, items, or other rewards have been credited to the player.

**Events:**
```
Reward Notification Event:
├── type: "REWARD_RECEIVED"
├── payload:
│   ├── user_id: UUID
│   ├── reward_type: "CURRENCY" | "ITEM" | "ACHIEVEMENT" | "BUNDLE"
│   ├── items: Object[]
│   │   ├── item_id: String
│   │   ├── item_name: String
│   │   ├── quantity: Integer
│   │   └── item_type: String
│   ├── source: String (reason for reward)
│   └── total_balance: Object (updated balances)
├── priority: HIGH
└── latency_target: < 100ms
```

---

## 5. Museum Realtime Architecture

Museum Realtime supports artifact discoveries, collection progress, museum expansion events, and exhibition updates.

### 5.1 Artifact Discoveries

Artifact discovery events notify players when they find new artifacts through gameplay.

**Events:**
```
Artifact Discovery Event:
├── type: "ARTIFACT_DISCOVERED"
├── payload:
│   ├── user_id: UUID
│   ├── artifact_id: String
│   ├── artifact_name: String
│   ├── era: String
│   ├── rarity: "COMMON" | "RARE" | "EPIC" ├── LEGENDARY"
│   ├── is_new: Boolean
│   └── discovery_method: "QUEST" | "EXHIBITION" | "GACHA" | "TRADE"
├── priority: HIGH
└── latency_target: < 200ms
```

### 5.2 Collection Progress

Collection progress events update players on their progress toward completing artifact collections.

**Events:**
```
Collection Progress Event:
├── type: "COLLECTION_PROGRESS"
├── payload:
│   ├── user_id: UUID
│   ├── collection_id: String
│   ├── collection_name: String
│   ├── progress: Object
│   │   ├── current: Integer
│   │   ├── total: Integer
│   │   └── percentage: Float
│   ├── artifacts_needed: String[] (gaps)
│   ├── is_complete: Boolean
│   └── rewards_earned: Object[] (if complete)
├── priority: MEDIUM
└── latency_target: < 500ms
```

### 5.3 Museum Expansion Events

Museum expansion events notify players of new display slots, museum levels, or layout changes.

**Events:**
```
Museum Expansion Event:
├── type: "MUSEUM_EXPANDED"
├── payload:
│   ├── user_id: UUID
│   ├── expansion_type: "SLOTS" | "LEVEL" | "AREA"
│   ├── new_capacity: Integer
│   ├── unlocks: Object[]
│   └── bonus_effects: Object (if any)
├── priority: MEDIUM
└── latency_target: < 500ms
```

### 5.4 Exhibition Updates

Exhibition update events reflect changes to how artifacts are displayed in the museum.

**Events:**
```
Exhibition Update Event:
├── type: "EXHIBITION_UPDATED"
├── payload:
│   ├── user_id: UUID
│   ├── exhibition_id: String
│   ├── changes: Object
│   │   ├── artifacts_added: String[]
│   │   ├── artifacts_removed: String[]
│   │   └── layout_changed: Boolean
│   ├── visitor_count: Integer (if public)
│   └── appreciation_score: Float (if public)
├── priority: LOW
└── latency_target: < 1s
```

---

## 6. Event Realtime Architecture

Event Realtime supports mission progress, event participation, seasonal updates, and event countdowns.

### 6.1 Mission Progress

Mission progress events sync player progress through missions, quests, and objectives.

**Events:**
```
Mission Progress Event:
├── type: "MISSION_PROGRESS"
├── payload:
│   ├── user_id: UUID
│   ├── mission_id: String
│   ├── mission_type: "DAILY" | "MAIN" | "SIDE"
│   ├── progress: Object
│   │   ├── current: Integer
│   │   ├── target: Integer
│   │   └── percentage: Float
│   ├── objectives: Object[]
│   │   ├── objective_id: String
│   │   ├── current: Integer
│   │   ├── target: Integer
│   │   └── is_complete: Boolean
│   ├── is_complete: Boolean
│   └── rewards_preview: Object (if complete)
├── priority: HIGH
└── latency_target: < 200ms
```

### 6.2 Event Participation

Event participation events track player enrollment and activity within time-limited events.

**Events:**
```
Event Participation Event:
├── type: "EVENT_PARTICIPATION"
├── payload:
│   ├── user_id: UUID
│   ├── event_id: String
│   ├── action: "JOINED" | "LEFT" | "COMPLETED" | "REWARDED"
│   ├── participant_count: Integer (current)
│   └── rewards: Object[] (if action = COMPLETED or REWARDED)
├── priority: MEDIUM
└── latency_target: < 500ms
```

### 6.3 Seasonal Updates

Seasonal update events broadcast changes to ongoing seasons, battle passes, and rotating content.

**Events:**
```
Seasonal Update Event:
├── type: "SEASONAL_UPDATE"
├── payload:
│   ├── user_id: UUID (null for broadcast)
│   ├── season_id: String
│   ├── update_type: "TIER_UNLOCKED" | "NEW_CHALLENGE" | "BONUS_ACTIVE"
│   ├── details: Object
│   └── affected_users: UUID[] (if targeted)
├── priority: MEDIUM
└── latency_target: < 1s
```

### 6.4 Event Countdowns

Event countdown events create urgency around expiring events, missions, or opportunities.

**Events:**
```
Event Countdown Event:
├── type: "EVENT_COUNTDOWN"
├── payload:
│   ├── user_id: UUID (null for broadcast)
│   ├── event_id: String
│   ├── event_name: String
│   ├── time_remaining: Integer (seconds)
│   ├── urgency_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
│   └── action_url: String (deep link)
├── priority: LOW (toast) | MEDIUM (notification)
└── latency_target: < 5s
```

---

## 7. PvP Realtime Architecture

PvP Realtime supports battle results, ranking changes, leaderboard updates, and league promotions.

### 7.1 Battle Results

Battle result events deliver outcomes of PvP matches with immediate feedback.

**Events:**
```
Battle Result Event:
├── type: "BATTLE_RESULT"
├── payload:
│   ├── user_id: UUID
│   ├── battle_id: String
│   ├── result: "WIN" | "LOSS" | "DRAW"
│   ├── opponent_id: UUID
│   ├── opponent_name: String
│   ├── rewards: Object
│   │   ├── points_earned: Integer
│   │   ├── points_lost: Integer (if loss)
│   │   └── bonus: Object (if any)
│   ├── battle_duration: Integer (seconds)
│   └── new_rating: Integer
├── priority: HIGH
└── latency_target: < 100ms
```

### 7.2 Ranking Changes

Ranking change events update players on their competitive position within leagues.

**Events:**
```
Ranking Change Event:
├── type: "RANKING_CHANGED"
├── payload:
│   ├── user_id: UUID
│   ├── previous_rank: Integer
│   ├── new_rank: Integer
│   ├── league: String
│   ├── division: Integer
│   ├── change_amount: Integer (+/- positions)
│   └── next_rank_target: Integer
├── priority: MEDIUM
└── latency_target: < 500ms
```

### 7.3 Leaderboard Updates

Leaderboard update events broadcast top player changes and position shifts.

**Events:**
```
Leaderboard Update Event:
├── type: "LEADERBOARD_UPDATE"
├── payload:
│   ├── leaderboard_id: String
│   ├── update_scope: "TOP_10" | "AROUND_USER" | "FULL"
│   ├── top_entries: Object[] (if top_10 or full)
│   │   ├── rank: Integer
│   │   ├── user_id: UUID
│   │   ├── user_name: String
│   │   └── score: Integer
│   ├── user_position: Object (if scope includes user)
│   │   ├── rank: Integer
│   │   └── score: Integer
│   └── updated_at: DateTime
├── priority: MEDIUM
└── latency_target: < 1s
```

### 7.4 League Promotions

League promotion events celebrate player advancement to higher competitive tiers.

**Events:**
```
League Promotion Event:
├── type: "LEAGUE_PROMOTION"
├── payload:
│   ├── user_id: UUID
│   ├── previous_league: String
│   ├── new_league: String
│   ├── promotion_type: "PROMOTED" | "DEMOTED"
│   ├── rewards: Object[]
│   └── new_benefits: Object[] (league perks)
├── priority: HIGH
└── latency_target: < 200ms
```

---

## 8. Guild Realtime Architecture

Guild Realtime supports guild activity, guild progression, guild announcements, and guild events.

### 8.1 Guild Activity

Guild activity events feed updates about member actions, contributions, and presence.

**Events:**
```
Guild Activity Event:
├── type: "GUILD_ACTIVITY"
├── payload:
│   ├── guild_id: UUID
│   ├── activity_type: "MEMBER_JOINED" | "MEMBER_LEFT" | "CONTRIBUTION" | "ROLE_CHANGED"
│   ├── member_id: UUID
│   ├── member_name: String
│   ├── details: Object
│   └── timestamp: DateTime
├── priority: LOW
└── latency_target: < 2s
```

### 8.2 Guild Progression

Guild progression events track collective advancement toward guild goals and milestones.

**Events:**
```
Guild Progression Event:
├── type: "GUILD_PROGRESSION"
├── payload:
│   ├── guild_id: UUID
│   ├── progression_type: "LEVEL_UP" | "GOAL_COMPLETE" | "BENEFIT_UNLOCKED"
│   ├── guild_level: Integer (if level_up)
│   ├── completed_goals: String[] (if goal_complete)
│   ├── new_benefits: Object[] (if benefit_unlocked)
│   └── total_members: Integer
├── priority: MEDIUM
└── latency_target: < 500ms
```

### 8.3 Guild Announcements

Guild announcement events broadcast messages from leadership to all members.

**Events:**
```
Guild Announcement Event:
├── type: "GUILD_ANNOUNCEMENT"
├── payload:
│   ├── guild_id: UUID
│   ├── announcement_id: UUID
│   ├── author_id: UUID
│   ├── author_name: String
│   ├── author_role: String
│   ├── message: String
│   ├── priority: "NORMAL" | "IMPORTANT" | "URGENT"
│   └── created_at: DateTime
├── priority: MEDIUM
└── latency_target: < 500ms
```

### 8.4 Guild Events

Guild event events notify members of scheduled guild activities and competitions.

**Events:**
```
Guild Event Event:
├── type: "GUILD_EVENT"
├── payload:
│   ├── guild_id: UUID
│   ├── event_type: "SCHEDULED" | "STARTED" | "ENDED" | "CANCELLED"
│   ├── event_name: String
│   ├── event_id: UUID
│   ├── start_time: DateTime (if scheduled)
│   ├── end_time: DateTime (if ended)
│   ├── participants: UUID[] (if started)
│   └── rewards: Object[] (if ended)
├── priority: MEDIUM
└── latency_target: < 1s
```

---

## 9. Notification Realtime Architecture

Notification Realtime serves as the primary delivery channel for reward notifications, mission completion, seasonal announcements, and important system events.

### 9.1 Reward Notifications

Reward notifications confirm the delivery of in-game rewards through all channels.

**Events:**
```
Reward Notification Event:
├── type: "REWARD_NOTIFICATION"
├── payload:
│   ├── user_id: UUID
│   ├── notification_id: UUID
│   ├── title: String
│   ├── message: String
│   ├── reward_items: Object[]
│   ├── source: String
│   ├── expires_at: DateTime (if applicable)
│   └── action_url: String (if applicable)
├── channel: "IN_APP" | "TELEGRAM" | "BOTH"
├── priority: "LOW" | "MEDIUM" | "HIGH"
└── latency_target: < 100ms
```

### 9.2 Mission Completion

Mission completion notifications celebrate finished objectives and associated rewards.

**Events:**
```
Mission Completion Event:
├── type: "MISSION_COMPLETE"
├── payload:
│   ├── user_id: UUID
│   ├── mission_id: String
│   ├── mission_name: String
│   ├── mission_type: String
│   ├── rewards: Object[]
│   ├── bonus_available: Boolean
│   └── next_mission_id: String (if sequential)
├── channel: "IN_APP" | "TELEGRAM" | "BOTH"
├── priority: MEDIUM
└── latency_target: < 200ms
```

### 9.3 Seasonal Announcements

Seasonal announcement notifications deliver important information about limited-time content.

**Events:**
```
Seasonal Announcement Event:
├── type: "SEASONAL_ANNOUNCEMENT"
├── payload:
│   ├── announcement_id: UUID
│   ├── season_id: String
│   ├── title: String
│   ├── message: String
│   ├── announcement_type: "NEW_SEASON" | "EVENT_START" | "EVENT_END" | "MAINTENANCE"
│   ├── action_url: String
│   └── expires_at: DateTime (if temporary)
├── channel: "TELEGRAM" (push) | "BOTH"
├── priority: "MEDIUM" | "HIGH" | "URGENT"
└── latency_target: < 1s
```

### 9.4 System Events

System event notifications inform users of account-related or critical system events.

**Events:**
```
System Event Notification:
├── type: "SYSTEM_EVENT"
├── payload:
│   ├── user_id: UUID
│   ├── event_type: "ACCOUNT_LINKED" | "SECURITY_ALERT" | "DATA_EXPORT_READY" | "SUBSCRIPTION_EXPIRING"
│   ├── title: String
│   ├── message: String
│   ├── action_required: Boolean
│   └── action_url: String (if action_required)
├── channel: "IN_APP" | "TELEGRAM" | "BOTH"
├── priority: "MEDIUM" | "HIGH" | "URGENT"
└── latency_target: < 100ms
```

---

## 10. Subscription Management Philosophy

Subscription management ensures efficient use of realtime infrastructure while providing reliable event delivery.

### 10.1 Subscription Lifecycle

Subscriptions follow a defined lifecycle from creation to cleanup.

**Lifecycle States:**
```
States:
├── PENDING       # Subscription requested, not yet established
├── ACTIVE        # Subscription active, receiving events
├── RECONNECTING  # Connection lost, attempting reconnection
├── PAUSED        # Subscription paused (user offline)
└── TERMINATED    # Subscription ended, resources cleaned up
```

**Lifecycle Transitions:**
```
Creation → Pending → Active
Active → Reconnecting (on disconnect)
Reconnecting → Active (on reconnect)
Reconnecting → Terminated (after max retries)
Active → Paused (on user inactive)
Paused → Active (on user activity)
Active → Terminated (on unsubscribe or leave)
```

### 10.2 Subscription Creation

Subscriptions are created based on user context and current game state.

**Creation Triggers:**
| Trigger | Subscription Type | Channel Pattern |
|---------|-------------------|-----------------|
| User logs in | Player profile | `user:{user_id}:profile` |
| User views notifications | Notifications | `user:{user_id}:notifications` |
| User joins event | Event broadcast | `event:{event_id}` |
| User enters guild | Guild activity | `guild:{guild_id}` |
| User opens PvP screen | Leaderboard | `pvp:leaderboard` |
| User enters museum | Museum updates | `museum:{user_id}` |

**Creation Process:**
```
1. Client authenticates with Supabase
2. Client requests subscription to channel
3. Server validates RLS permissions for channel
4. Server creates subscription record
5. Server acknowledges subscription to client
6. Client begins receiving events
```

### 10.3 Subscription Cleanup

Subscriptions are cleaned up when no longer needed to free resources.

**Cleanup Triggers:**
| Trigger | Action |
|---------|--------|
| Client disconnect | Immediate cleanup after timeout |
| User logout | Immediate cleanup |
| Leave guild | Remove guild subscriptions |
| Event end | Remove event subscriptions |
| App background (extended) | Pause subscriptions |

**Cleanup Process:**
```
1. Cleanup trigger detected
2. Mark subscription as terminating
3. Stop routing new events
4. Allow in-flight events to complete
5. Close websocket connection
6. Remove subscription record
7. Release allocated resources
```

### 10.4 Reconnection Behavior

Reconnection handling ensures reliable event delivery across network interruptions.

**Reconnection Strategy:**
```
On Disconnect:
1. Wait for reconnect window (exponential backoff)
2. Attempt reconnection with fresh auth token
3. Request missed events since last confirmed event
4. Resynchronize state from last checkpoint
5. Resume normal subscription

Reconnection Parameters:
├── Initial delay: 1 second
├── Maximum delay: 30 seconds
├── Maximum retries: 5
├── Backoff multiplier: 2x
└── Jitter: ±20%
```

---

## 11. Event Processing Standards

Event processing ensures events are validated, distributed efficiently, and prioritized correctly.

### 11.1 Event Validation

Events must be validated before processing and distribution.

**Validation Checks:**
| Check | Purpose | On Failure |
|-------|---------|------------|
| Authenticity | Verify event source | Discard |
| Schema | Validate payload structure | Discard |
| Permissions | Verify sender/recipient access | Discard |
| Rate limits | Prevent spam/abuse | Throttle |
| Duplicates | Prevent reprocessing | Deduplicate |

**Validation Pipeline:**
```typescript
interface EventValidation {
  // Step 1: Authenticate source
  authenticate(): Promise<AuthResult>;
  
  // Step 2: Validate schema
  validateSchema(payload: unknown): ValidationResult;
  
  // Step 3: Check permissions
  checkPermissions(event: Event, userId: string): PermissionResult;
  
  // Step 4: Rate limit check
  checkRateLimit(userId: string, eventType: string): RateLimitResult;
  
  // Step 5: Deduplicate
  checkDuplicate(eventId: string): DuplicateResult;
}
```

### 11.2 Event Distribution

Events are distributed to appropriate channels based on content and recipients.

**Distribution Patterns:**
```
Pattern: Direct (1:1)
├── Use case: User-specific notifications
├── Channel: user:{user_id}:notifications
└── Routing: Direct match

Pattern: Broadcast (1:N)
├── Use case: Event announcements
├── Channel: event:{event_id}
└── Routing: Fan-out to all subscribers

Pattern: Guild (1:M)
├── Use case: Guild activity
├── Channel: guild:{guild_id}
└── Routing: Fan-out to guild members

Pattern: Global (1:ALL)
├── Use case: System announcements
├── Channel: global:announcements
└── Routing: Broadcast to all connected clients
```

### 11.3 Event Prioritization

Events are prioritized to ensure critical updates arrive first.

**Priority Levels:**
```
Priority: CRITICAL
├── Use cases: Security alerts, account issues
├── Latency target: < 50ms
├── Queue position: Immediate
└── Examples: Password change, security breach

Priority: HIGH
├── Use cases: Gameplay results, rewards
├── Latency target: < 100ms
├── Queue position: High
└── Examples: Battle results, reward delivery

Priority: MEDIUM
├── Use cases: Progression updates, social
├── Latency target: < 500ms
├── Queue position: Normal
└── Examples: Level up, guild activity

Priority: LOW
├── Use cases: Background updates, analytics
├── Latency target: < 2s
├── Queue position: Low
└── Examples: Exhibition updates, analytics events
```

**Queue Management:**
```
Multiple Queues:
├── critical_queue: Immediate processing
├── high_priority_queue: Process before normal
├── normal_queue: Standard processing
└── low_priority_queue: Process when idle

Queue Selection:
1. Determine event priority
2. Enqueue to appropriate queue
3. Process queues by priority order
4. Yield to higher priority when available
```

---

## 12. Performance Philosophy

Realtime systems must remain performant at scale while minimizing infrastructure costs.

### 12.1 Minimize Active Subscriptions

Each active subscription consumes server resources. Minimize subscriptions per user.

**Minimization Strategies:**
```
Strategies:
├── Consolidate channels: Combine related updates into single channel
├── Scope subscriptions: Subscribe only to relevant data subsets
├── Timeout inactive: Auto-pause subscriptions for offline users
├── Batch updates: Combine multiple updates into single events
└── Filter server-side: Apply filters before sending to clients
```

**Subscription Limits:**
| User Tier | Maximum Subscriptions | Channels |
|-----------|----------------------|----------|
| Free | 10 | Core only |
| Premium | 25 | Core + social |
| Guild Leader | 35 | Core + guild + social |

### 12.2 Reduce Bandwidth Usage

Minimize data transferred to clients through efficient encoding and filtering.

**Bandwidth Reduction:**
```
Techniques:
├── Delta updates: Send only changed fields
├── Compression: Enable websocket compression
├── Throttling: Limit update frequency for high-volume data
├── Pagination: Stream large datasets
└── Payload optimization: Use minimal field names
```

**Payload Size Guidelines:**
| Event Type | Target Size | Maximum Size |
|------------|-------------|--------------|
| Simple notification | < 200 bytes | 500 bytes |
| Update event | < 500 bytes | 2 KB |
| Leaderboard | < 2 KB | 5 KB |
| Bulk event | < 5 KB | 10 KB |

### 12.3 Support Large-Scale Growth

Architecture must support growth from thousands to millions of users.

**Growth Support:**
```
Scale Considerations:
├── Connection pooling: Reuse database connections
├── Horizontal scaling: Add realtime servers as needed
├── Message queuing: Decouple event processing
├── Geographic distribution: Edge deployment for latency
└── Resource quotas: Per-user resource limits
```

---

## 13. Security Standards

Realtime security ensures data privacy, prevents abuse, and maintains system integrity.

### 13.1 RLS Compatibility

Row-Level Security policies must be compatible with realtime subscriptions.

**RLS Integration:**
```
Supabase Realtime with RLS:
├── RLS policies apply to subscription filters
├── Clients only receive authorized data
├── Broadcasts respect RLS for filtered channels
└── Admin role bypasses RLS for system events
```

**RLS Patterns for Realtime:**
```sql
-- Profile updates: Users see only their own
CREATE POLICY "Users can subscribe to own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Guild updates: Members see guild activity
CREATE POLICY "Members can subscribe to guild"
ON guild_activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM guild_members
    WHERE guild_members.guild_id = guild_activities.guild_id
    AND guild_members.user_id = auth.uid()
  )
);
```

### 13.2 Permission Validation

Permissions are validated before establishing subscriptions and processing events.

**Permission Validation:**
```
Subscription Permission Check:
1. Verify user authentication token
2. Extract user ID from token
3. Validate user has access to requested channel
4. Apply RLS policies for data filtering
5. Grant or deny subscription

Event Permission Check:
1. Verify sender authentication
2. Validate sender has permission to send event
3. Verify recipient has permission to receive event
4. Check rate limits for sender
5. Allow or discard event
```

### 13.3 Event Isolation

Events are isolated to prevent unauthorized access to data.

**Isolation Principles:**
```
Isolation Levels:
├── User isolation: Events addressed to specific users only
├── Guild isolation: Guild events limited to members
├── Event isolation: Event data limited to participants
├── System isolation: Admin-only events protected
└── Cross-tenant prevention: No cross-user data leakage
```

---

## 14. AdsGram Realtime Notes

AdsGram remains one of the primary revenue systems for Jolt Time. Realtime architecture supports reward delivery, monetization event updates, and reward confirmation events.

### 14.1 Reward Delivery

Realtime events confirm ad rewards have been credited to the user.

**Reward Delivery Flow:**
```
Flow:
1. User completes ad on AdsGram SDK
2. AdsGram sends callback to Edge Function
3. Edge Function validates and processes reward
4. RPC distributes reward to user
5. Realtime event confirms delivery to client
```

**Reward Delivery Event:**
```
AdsGram Reward Event:
├── type: "ADSGRAM_REWARD"
├── payload:
│   ├── user_id: UUID
│   ├── reward_id: UUID
│   ├── ad_type: "REWARDED_VIDEO" | "INTERSTITIAL"
│   ├── reward_amount: Integer
│   ├── currency_type: String
│   ├── source: "ADSGRAM"
│   └── transaction_id: String
├── priority: HIGH
└── latency_target: < 200ms
```

### 14.2 Monetization Event Updates

Monetization events update users on their ad viewing progress and limits.

**Monetization Events:**
```
Monetization Update Event:
├── type: "MONETIZATION_UPDATE"
├── payload:
│   ├── user_id: UUID
│   ├── daily_ads_watched: Integer
│   ├── daily_ads_limit: Integer
│   ├── daily_rewards_earned: Integer
│   ├── bonus_available: Boolean
│   └── next_bonus_at: DateTime
├── priority: LOW
└── latency_target: < 1s
```

### 14.3 Reward Confirmation Events

Reward confirmation events provide end-to-end acknowledgment of ad reward transactions.

**Confirmation Event:**
```
Reward Confirmation Event:
├── type: "AD_REWARD_CONFIRMED"
├── payload:
│   ├── user_id: UUID
│   ├── confirmation_id: UUID
│   ├── ad_id: String (AdsGram reference)
│   ├── reward_type: String
│   ├── reward_amount: Integer
│   ├── new_balance: Integer
│   ├── timestamp: DateTime
│   └── fraud_check_passed: Boolean
├── priority: HIGH
└── latency_target: < 100ms
```

---

## 15. Monitoring Standards

Monitoring enables proactive identification and resolution of realtime issues.

### 15.1 Active Subscriptions

Track the number and distribution of active subscriptions.

**Subscription Metrics:**
| Metric | Description | Alert Threshold |
|--------|-------------|------------------|
| Total active | All active subscriptions | > 1M: warning |
| Per user avg | Average per user | > 20: warning |
| By channel type | Distribution by category | Any > 500K |
| Connection count | Websocket connections | > 10K per server |

**Monitoring Query:**
```sql
-- Active subscriptions by type
SELECT 
  channel_type,
  COUNT(*) as active_count
FROM realtime_subscriptions
WHERE status = 'ACTIVE'
GROUP BY channel_type;
```

### 15.2 Event Volume

Track events processed per second and per minute.

**Event Volume Metrics:**
| Metric | Description | Alert Threshold |
|--------|-------------|------------------|
| Events per second | Processing rate | > 10K/s: warning |
| Events per minute | Total volume | > 1M/min: warning |
| By type | Distribution | Any type > 5K/s |
| Queue depth | Pending events | > 1000: warning |

**Monitoring Query:**
```sql
-- Events by type in last minute
SELECT 
  event_type,
  COUNT(*) as event_count
FROM realtime_events
WHERE created_at > NOW() - INTERVAL '1 minute'
GROUP BY event_type;
```

### 15.3 Latency

Track end-to-end latency from database change to client delivery.

**Latency Metrics:**
| Metric | Description | Target | Alert |
|--------|-------------|--------|-------|
| p50 latency | Median delivery | < 100ms | > 200ms |
| p95 latency | 95th percentile | < 500ms | > 1s |
| p99 latency | 99th percentile | < 1s | > 2s |
| Timeout rate | Failed deliveries | < 0.1% | > 1% |

**Monitoring Query:**
```sql
-- Latency percentiles
SELECT 
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY latency_ms) as p50,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency_ms) as p99
FROM realtime_delivery_log
WHERE created_at > NOW() - INTERVAL '5 minutes';
```

### 15.4 Failures

Track failed events, connections, and subscriptions.

**Failure Metrics:**
| Metric | Description | Alert Threshold |
|--------|-------------|------------------|
| Connection failures | Failed connects | > 1% |
| Subscription failures | Denied subscriptions | > 5% |
| Delivery failures | Failed deliveries | > 0.1% |
| RLS violations | Unauthorized access attempts | > 10/min |

---

## 16. Failure Recovery Philosophy

Failure recovery ensures the realtime system maintains reliability despite network and infrastructure issues.

### 16.1 Reconnections

Reconnection handling restores subscriptions after network interruptions.

**Reconnection Flow:**
```
On Network Disconnect:
1. Client detects connection loss
2. Client waits with exponential backoff
3. Client attempts reconnection
4. Server validates session token
5. Server resubscribes client to active channels
6. Client requests missed events since checkpoint
7. Server replays missed events
8. Normal operation resumes
```

**Reconnection Parameters:**
| Parameter | Value | Rationale |
|-----------|-------|----------|
| Initial backoff | 1s | Quick recovery for transient issues |
| Maximum backoff | 30s | Prevent excessive retry load |
| Maximum attempts | 5 | Fail gracefully after repeated issues |
| Checkpoint interval | 5s | Balance between recovery time and missed events |

### 16.2 Missed Events

Missed events are recovered through checkpoint-based replay.

**Recovery Strategy:**
```
Checkpoint System:
1. Server maintains event checkpoint per subscription
2. Client stores last received event ID locally
3. On reconnect, client sends last event ID
4. Server replays events from checkpoint to current
5. Events replayed in original order
6. Client deduplicates any overlap
```

**Replay Limits:**
| Limit Type | Value | Rationale |
|------------|-------|----------|
| Replay window | 5 minutes | Prevent unbounded replay |
| Max events per replay | 100 | Limit recovery time |
| Replay timeout | 10 seconds | Prevent infinite recovery |

### 16.3 Temporary Outages

Temporary outages are handled through graceful degradation and recovery.

**Outage Handling:**
```
During Outage:
1. Events queued in message broker
2. Subscription state persisted
3. Client connections gracefully terminated
4. Clients notified of expected recovery time

After Outage:
1. Services restart
2. Subscriptions restored from persisted state
3. Queued events processed in order
4. Missed event replays delivered
5. Client reconnections accepted
```

### 16.4 Synchronization Recovery

State synchronization ensures clients and servers agree on current state after recovery.

**Synchronization Process:**
```
Full State Sync:
1. Client requests current state snapshot
2. Server returns authoritative state
3. Client replaces local state with snapshot
4. Client applies any replayed events on top
5. State consistent across client and server
```

---

## 17. Scaling Philosophy

The realtime architecture supports scaling from thousands to millions of users.

### 17.1 10,000 Users

At 10,000 users, the system operates efficiently with minimal infrastructure.

**Architecture:**
```
10K Users Configuration:
├── Realtime servers: 2 (primary + standby)
├── Connections per server: 5,000
├── Events per second: ~500
├── Subscription storage: Single database
└── Geographic distribution: Single region
```

**Recommendations:**
- Use basic Supabase Pro plan
- Monitor subscription counts
- Implement basic rate limiting
- Enable connection pooling

### 17.2 100,000 Users

At 100,000 users, the system requires horizontal scaling and optimization.

**Architecture:**
```
100K Users Configuration:
├── Realtime servers: 5-10
├── Connections per server: 10,000-15,000
├── Events per second: ~5,000
├── Subscription storage: Sharded database
├── Message queue: Dedicated broker
└── Geographic distribution: 2-3 regions
```

**Recommendations:**
- Upgrade to Supabase Enterprise or dedicated
- Implement subscription sharding
- Add message queue for event buffering
- Deploy in multiple regions for latency
- Enable aggressive connection timeout

### 17.3 1,000,000+ Users

At 1,000,000+ users, the system requires enterprise-grade infrastructure.

**Architecture:**
```
1M+ Users Configuration:
├── Realtime servers: 20+
├── Connections per server: 50,000
├── Events per second: ~50,000+
├── Subscription storage: Distributed database cluster
├── Message queue: Clustered broker
├── CDN: Global edge network
└── Geographic distribution: Global
```

**Recommendations:**
- Dedicated Supabase Enterprise deployment
- Custom realtime infrastructure
- Global CDN for connection distribution
- Sophisticated subscription partitioning
- Advanced monitoring and alerting
- Automatic scaling policies
- Disaster recovery planning

---

## 18. Future Expansion Notes

Future realtime systems represent potential expansion areas. These are documented as concepts only, not currently planned.

### 18.1 AI Events

**Concept:** Realtime events for AI-driven personalization and content.

**Potential Events:**
- `AI_RECOMMENDATION` — Personalized content suggestions
- `AI_INSIGHT` — Player behavior insights
- `AI_GUIDANCE` — In-game AI assistant responses

**Status:** Future concept only.

### 18.2 Creator Economy Updates

**Concept:** Realtime events for creator content and community features.

**Potential Events:**
- `CREATOR_CONTENT_UPDATE` — New creator content available
- `CREATOR_FOLLOWER_MILESTONE` — Follower achievements
- `CREATOR_REVENUE_UPDATE` — Earnings notifications

**Status:** Future concept only.

### 18.3 Web3 Transactions

**Concept:** Realtime events for blockchain transactions and wallet activity.

**Potential Events:**
- `WALLET_SYNC_COMPLETE` — Wallet balance synchronized
- `TOKEN_TRANSFER_RECEIVED` — Incoming token transfer
- `NFT_ACTIVITY` — NFT purchase or transfer

**Status:** Future concept only.

### 18.4 NFT Activity

**Concept:** Realtime events for NFT-related gameplay features.

**Potential Events:**
- `NFT_MINT_COMPLETE` — Artifact NFT minted
- `NFT_LISTING_UPDATE` — Marketplace listing change
- `NFT_TRANSFER_COMPLETE` — NFT transferred

**Status:** Future concept only.

### 18.5 Esports Broadcasts

**Concept:** Realtime events for competitive gaming broadcasts.

**Potential Events:**
- `ESPORTS_MATCH_START` — Tournament match beginning
- `ESPORTS_SCORE_UPDATE` — Live score change
- `ESPORTS_MATCH_END` — Match concluded

**Status:** Future concept only.

---

## 19. Long-Term Philosophy

The Realtime Architecture serves as the foundation for live features in Jolt Time.

### 19.1 Improve Engagement

Realtime updates create a living, breathing game world that responds immediately to player actions.

**Engagement Benefits:**
- Players feel connected to the game world
- Social features create community bonds
- Competitive features maintain tension
- Notifications re-engage dormant players

### 19.2 Remain Cost-Efficient

Strategic use of realtime prevents infrastructure costs from scaling linearly with users.

**Cost Efficiency:**
- Subscribe only to relevant data
- Send only changed fields
- Batch updates where possible
- Use appropriate update frequencies
- Scale infrastructure as needed

### 19.3 Support Growth

The architecture supports Jolt Time's growth from thousands to millions of players.

**Growth Support:**
- Horizontal scaling capabilities
- Geographic distribution
- Connection pooling
- Message queuing
- Automatic failover

### 19.4 Simplify Future Features

A well-designed realtime architecture makes adding new live features straightforward.

**Simplification Benefits:**
- New event types extend existing patterns
- Subscription management reusable
- Monitoring infrastructure in place
- Security patterns established
- Documentation guides implementation

---

## Related Documentation

- **Database Schema:** `.openhands/knowledge/database-schema.md`
- **RPC Architecture:** `.openhands/knowledge/supabase-rpc-architecture.md`
- **Edge Functions:** `.openhands/knowledge/edge-functions-architecture.md`
- **AdsGram Integration:** `.openhands/knowledge/adsgram.md`
- **Notification System:** `.openhands/knowledge/notifications.md`
- **Analytics:** `.openhands/knowledge/analytics.md`
- **Security System:** `.openhands/knowledge/security-system.md`

---

*Building the future through the lens of the past.*
