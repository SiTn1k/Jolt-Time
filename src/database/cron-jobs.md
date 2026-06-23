# Cron Job Specifications

This document describes the cron jobs required for the notification system.

## Overview

The notification system uses several cron jobs to:
1. Process pending notifications from the queue
2. Send inactive player reminders
3. Clean up old records

## Required Cron Jobs

### 1. Process Pending Notifications

**Schedule:** Every 1 minute (`* * * * *`)

**Purpose:** Send pending notifications that have reached their scheduled time.

**Implementation:**
```typescript
// In your cron handler or Supabase Edge Function
import { getNotificationService } from '../services/NotificationService';

export async function processPendingNotifications() {
  const service = getNotificationService();
  const result = await service.processPendingNotifications(100);
  
  console.log(`Processed notifications: sent=${result.sent}, failed=${result.failed}`);
}
```

**Edge Function (Supabase):**
```javascript
// supabase/functions/process-notifications/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!

Deno.serve(async (req) => {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Process notifications logic here
  // ...
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

**Supabase pg_cron setup:**
```sql
-- Add to Supabase dashboard or run via SQL
SELECT cron.schedule(
  'process-notifications',
  '* * * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/process-notifications',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### 2. Inactive Player Reminders

**Schedule:** Every 1 hour (`0 * * * *`)

**Purpose:** Check for inactive players and send reminder notifications.

**Implementation:**
```typescript
// supabase/functions/inactive-player-check/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!

Deno.serve(async (req) => {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Import and run inactive player service
  const result = await processInactivePlayers(supabase, telegramToken)
  
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  })
})

async function processInactivePlayers(supabase: any, telegramToken: string) {
  // ... implementation
}
```

**Supabase pg_cron:**
```sql
SELECT cron.schedule(
  'inactive-player-check',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/inactive-player-check',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### 3. Daily Reward Reminder

**Schedule:** Daily at 9:00 AM UTC (`0 9 * * *`)

**Purpose:** Send daily reward reminders to all active users.

**Implementation:**
```typescript
// supabase/functions/daily-reminder/index.ts
// Sends daily reward notification to all users who:
// - Have notifications enabled
// - Have a chat_id
// - Are not in cooldown for daily_reward
```

### 4. Weekly Bonus Reminder

**Schedule:** Weekly on Monday at 10:00 AM UTC (`0 10 * * 1`)

**Purpose:** Notify users that weekly bonus is available.

### 5. Cleanup Old Notifications

**Schedule:** Daily at 3:00 AM UTC (`0 3 * * *`)

**Purpose:** Clean up old processed notifications and expired cooldowns.

```sql
-- Clean up old sent/failed notifications (older than 30 days)
DELETE FROM notifications_queue 
WHERE status IN ('sent', 'failed') 
AND created_at < NOW() - INTERVAL '30 days';

-- Clean up expired cooldowns
DELETE FROM notification_cooldowns 
WHERE cooldown_expires_at < NOW();
```

## Architecture for Mass Broadcasts

### Future Mass Broadcast Design

The notification queue architecture supports future mass broadcasts:

1. **Queue-Based Processing**: All notifications go through the queue
2. **Batch Processing**: `processPendingNotifications()` processes in batches of 100
3. **Rate Limiting**: Telegram Bot API has limits (30 messages/second)
4. **Deduplication**: Each notification has a unique deduplication_key

### Implementing Mass Broadcasts

```typescript
// Example: Send event notification to all users
async function broadcastEventNotification(
  supabase: SupabaseClient,
  notificationService: NotificationService,
  eventName: string,
  eventId: string
) {
  // Fetch all users with notifications enabled
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('notifications_enabled', true)
    .not('chat_id', 'is', null);

  if (!users) return;

  // Schedule notifications in batches
  const batchSize = 100;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(user =>
        notificationService.scheduleTypedNotification(
          user.id,
          NotificationType.EVENT_STARTED,
          { event_name: eventName },
          eventId // Context for deduplication
        )
      )
    );

    // Small delay to prevent overwhelming the queue
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

## Monitoring

### Key Metrics to Track

1. **Queue Depth**: Number of pending notifications
2. **Success Rate**: sent / (sent + failed)
3. **Delivery Latency**: Time from scheduled_at to sent_at
4. **Inactive Users**: Count at each tier

### Alerting

Set up alerts for:
- Queue depth > 1000
- Success rate < 90%
- Failed notifications > 10 in a minute

## Supabase Dashboard Setup

1. Go to Database > Extensions > Enable `pg_cron`
2. Go to Database > Replication > Enable `pg_cron` scheduler
3. Create the cron jobs using the SQL above

## Alternative: External Cron Service

If pg_cron is not available, use an external cron service:

**Options:**
- GitHub Actions scheduled workflow
- Vercel Cron Jobs
- External service (cron-job.org, easycron.com)

```bash
# Example: Vercel cron.json
{
  "crons": [
    {
      "path": "/api/cron/process-notifications",
      "schedule": "* * * * *"
    },
    {
      "path": "/api/cron/inactive-player-check",
      "schedule": "0 * * * *"
    }
  ]
}
```
