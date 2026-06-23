# Telegram Push Notification System - Jolt Time

A complete push notification architecture for the Jolt Time Telegram Mini App.

## Overview

This notification system enables game event notifications, reminders, and inactive player outreach through the Telegram Bot API - no external providers required.

## New Tables

### 1. `users` (Modified)
Additional columns added:
- `telegram_id` (BIGINT, UNIQUE) - Telegram user ID
- `username` (VARCHAR) - Telegram username
- `chat_id` (BIGINT) - Telegram chat ID for sending messages
- `notifications_enabled` (BOOLEAN, DEFAULT true) - Global notification toggle
- `last_notification_at` (TIMESTAMP) - Last notification sent timestamp
- `last_active_at` (TIMESTAMP) - User's last activity timestamp

### 2. `notification_preferences`
Stores user notification preference switches.

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID | auto | Primary key |
| `user_id` | UUID | - | Foreign key to users |
| `daily_reminders` | BOOLEAN | true | Daily reward, weekly bonus |
| `events` | BOOLEAN | true | Event started |
| `research_complete` | BOOLEAN | true | Academy research completed |
| `energy_restored` | BOOLEAN | true | Energy restored |
| `building_complete` | BOOLEAN | true | Building upgrade completed |
| `marketing` | BOOLEAN | false | Marketing notifications |

### 3. `notifications_queue`
Queue for managing notification delivery with status tracking.

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID | auto | Primary key |
| `user_id` | UUID | - | Foreign key to users |
| `type` | VARCHAR(50) | - | Notification type |
| `title` | VARCHAR(255) | - | Notification title |
| `message` | TEXT | - | Notification message |
| `status` | VARCHAR(20) | pending | pending/sent/failed |
| `scheduled_at` | TIMESTAMP | NOW() | When to send |
| `sent_at` | TIMESTAMP | - | When actually sent |
| `deduplication_key` | VARCHAR(255) | - | Prevents duplicates |
| `error_message` | TEXT | - | Error if failed |
| `retry_count` | INTEGER | 0 | Retry attempts |

### 4. `notification_cooldowns`
Tracks cooldown periods per user per notification type.

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID | auto | Primary key |
| `user_id` | UUID | - | Foreign key to users |
| `notification_type` | VARCHAR(50) | - | Notification type |
| `cooldown_expires_at` | TIMESTAMP | - | When cooldown expires |

## TypeScript Files

```
src/
├── index.ts                              # Main exports
├── types/
│   └── notifications.ts                  # Enums and interfaces
├── services/
│   ├── NotificationService.ts            # Core notification service
│   ├── UserPreferencesService.ts         # User preferences management
│   ├── InactivePlayerService.ts          # Inactive player detection
│   ├── TelegramBotService.ts             # Telegram Bot API integration
│   └── notification-messages.ts          # Message templates
└── database/
    ├── migrations/
    │   ├── 001_add_telegram_fields_to_users.sql
    │   ├── 002_create_notification_preferences.sql
    │   ├── 003_create_notifications_queue.sql
    │   └── 004_create_notification_cooldowns.sql
    ├── supabase-types.ts                 # TypeScript types for Supabase
    └── cron-jobs.md                      # Cron job documentation
```

## Services Created

### 1. NotificationService
Core service for notification management.

**Methods:**
- `scheduleNotification(params)` - Schedule a notification with validation
- `scheduleTypedNotification(userId, type, params, context)` - Schedule with auto-generated message
- `sendNotification(userId, type, title, message)` - Send immediately via Telegram
- `markAsSent(notificationId)` - Mark notification as sent
- `markAsFailed(notificationId, errorMessage?)` - Mark notification as failed
- `processPendingNotifications(batchSize)` - Process queue (for cron)

**Features:**
- Deduplication to prevent duplicate notifications
- Cooldown protection per notification type
- User preference checking
- Queue-based architecture for scalability

### 2. UserPreferencesService
Manages user notification preferences.

**Methods:**
- `getPreferences(userId)` - Get user's notification preferences
- `updatePreferences(userId, preferences)` - Update preferences
- `isCategoryEnabled(userId, category)` - Check if category enabled
- `resetToDefaults(userId)` - Reset to default preferences

### 3. InactivePlayerService
Detects inactive players and sends reminders.

**Methods:**
- `processInactivePlayers()` - Find and notify inactive users
- `updateLastActive(userId)` - Update user's last active time
- `getInactivityStats()` - Get inactivity statistics

**Inactivity Tiers:**
- 24 hours inactive → INACTIVE_24H notification
- 72 hours inactive → INACTIVE_72H notification
- 7 days inactive → INACTIVE_7D notification

### 4. TelegramBotService
Handles Telegram Bot API interactions.

**Methods:**
- `sendMessage(chatId, text, parseMode)` - Send message to user
- `registerUser(telegramId, username, chatId)` - Register/update user
- `handleStartCommand(message)` - Handle /start command
- `handleSettingsCommand(message)` - Handle /settings command
- `processUpdate(update)` - Process incoming Telegram updates

## Notification Categories

| Category | Notification Types | Default |
|----------|-------------------|---------|
| `daily_reminders` | DAILY_REWARD, WEEKLY_BONUS, INACTIVE_* | ON |
| `events` | EVENT_STARTED, EXPEDITION_FINISHED | ON |
| `research_complete` | RESEARCH_COMPLETED | ON |
| `energy_restored` | ENERGY_RESTORED | ON |
| `building_complete` | BUILDING_COMPLETED | ON |
| `marketing` | (future) | OFF |

## Cron Jobs Required

### 1. Process Pending Notifications
- **Schedule:** Every 1 minute (`* * * * *`)
- **Purpose:** Send pending notifications from queue

### 2. Inactive Player Check
- **Schedule:** Every 1 hour (`0 * * * *`)
- **Purpose:** Detect inactive users and send reminders

### 3. Daily Reward Reminder
- **Schedule:** Daily at 9:00 AM UTC (`0 9 * * *`)
- **Purpose:** Send daily reward reminder

### 4. Weekly Bonus Reminder
- **Schedule:** Weekly Monday 10:00 AM UTC (`0 10 * * 1`)
- **Purpose:** Notify weekly bonus available

### 5. Cleanup Old Records
- **Schedule:** Daily at 3:00 AM UTC (`0 3 * * *`)
- **Purpose:** Clean up old notifications and expired cooldowns

## Notification Flow

### Flow Diagram

```
┌─────────────────┐
│  Game Event     │
│  (Energy full,  │
│  Building done) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  NotificationService            │
│  scheduleTypedNotification()    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Validation Checks             │
│  ├─ User notifications enabled? │
│  ├─ Category enabled?            │
│  ├─ In cooldown?                │
│  └─ Already exists (dedup)?    │
└────────┬────────────────────────┘
         │
         ▼ (if all pass)
┌─────────────────────────────────┐
│  notifications_queue           │
│  INSERT pending notification   │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Cron Job: Process Queue       │
│  (runs every minute)           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  For each pending notification │
│  ├─ Check user still valid?    │
│  ├─ Check preferences changed?  │
│  └─ Check cooldown (race cond)  │
└────────┬────────────────────────┘
         │
         ▼ (if valid)
┌─────────────────────────────────┐
│  Telegram Bot API              │
│  sendMessage(chat_id, text)    │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  On Success                    │
│  ├─ markAsSent()               │
│  ├─ Set cooldown               │
│  └─ Update last_notification_at│
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  On Failure                    │
│  ├─ Increment retry_count      │
│  └─ markAsFailed() after 3 tries│
└─────────────────────────────────┘
```

### Inactive Player Flow

```
┌─────────────────────────────────┐
│  Cron: Inactive Player Check   │
│  (runs every hour)              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Query Users by last_active_at │
│  ├─ 24h window (23h-25h ago)   │
│  ├─ 72h window (71h-73h ago)   │
│  └─ 7d window (167h-169h ago)  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  For each inactive user        │
│  ├─ Check not already notified │
│  └─ Schedule notification       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Notification goes to queue    │
│  and follows normal flow       │
└─────────────────────────────────┘
```

## Deduplication

Each notification has a `deduplication_key` that prevents duplicates:

**Format:** `{type}_{userId}_{context}`

**Examples:**
- `daily_reward_user123` - Daily reward for user123
- `building_completed_user456_building789` - Building 789 completed for user456
- `event_started_*` - Event started (broadcast, no user context)

Before inserting, the system checks if a notification with the same key exists within the last hour. If found, it's skipped.

## Cooldown Protection

Cooldowns prevent notification spam:

| Type | Cooldown |
|------|----------|
| DAILY_REWARD | 24 hours |
| WEEKLY_BONUS | 7 days |
| ENERGY_RESTORED | 30 minutes |
| EXPEDITION_FINISHED | 15 minutes |
| RESEARCH_COMPLETED | 30 minutes |
| BUILDING_COMPLETED | 15 minutes |
| EVENT_STARTED | 12 hours |
| INACTIVE_* | 24 hours |

Cooldowns are stored in `notification_cooldowns` table and checked before scheduling.

## Future Mass Broadcast Architecture

The system is designed for mass broadcasts:

1. **Queue-Based**: All notifications go through the queue
2. **Batch Processing**: `processPendingNotifications()` handles 100 at a time
3. **Rate Limiting**: Telegram limits to 30 msg/sec - the cron job naturally throttles
4. **Deduplication**: Prevents duplicate sends
5. **Scalable**: Queue can handle millions of pending notifications

**Example Broadcast:**
```typescript
async function broadcastEvent(supabase, service, eventName, eventId) {
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('notifications_enabled', true)
    .not('chat_id', 'is', null);

  for (const user of users) {
    await service.scheduleTypedNotification(
      user.id,
      NotificationType.EVENT_STARTED,
      { event_name: eventName },
      eventId
    );
  }
}
```

## Environment Variables

```
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=your-bot-token
```

## Usage Example

```typescript
import { 
  getNotificationService, 
  NotificationType 
} from './src';

// Initialize service
const notificationService = getNotificationService();

// Schedule a building completion notification
await notificationService.scheduleTypedNotification(
  userId,
  NotificationType.BUILDING_COMPLETED,
  { building_name: 'Energy Reactor', level: 5 },
  buildingId
);

// Or send immediately
await notificationService.sendNotification(
  userId,
  NotificationType.ENERGY_RESTORED,
  '⚡ Energy Restored!',
  'Your energy is full!'
);
```

## No External Providers

This implementation uses only:
- **Telegram Bot API** (`api.telegram.org`) - No cost, direct integration
- **Supabase** - Database, auth, edge functions, cron jobs

No external notification providers (OneSignal, Firebase, AWS SNS, etc.) required.
