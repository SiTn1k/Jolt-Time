# Jolt Time — Telegram Bot Notifications

## Overview

Telegram Bot notifications are designed to increase retention through timely, relevant reminders without becoming spam. Maximum 2-4 notifications per day per user.

## Notification Philosophy

### Core Principles
1. **Value-First** — Every notification provides genuine value
2. **Respectful** — Never spam, never guilt-trip
3. **Actionable** — Clear next steps when possible
4. **Optional** — Users can disable any notification type
5. **Timely** — Sent at optimal times for engagement

### Notification Limits
| Type | Daily Limit | Weekly Limit |
|------|-------------|--------------|
| Maximum Total | 4 | 28 |
| Daily Login Reminder | 1 | 7 |
| Energy Restored | 1 | 7 |
| New Quest | 1 | 7 |
| Event Start | 1 | 3 |
| Event Ending | 1 | 2 |
| Streak at Risk | 1 | 3 |

---

## Notification Types

### 1. Daily Login Reminder

**Trigger:** User hasn't opened app in 20+ hours

**Timing:** 
- 10:00 AM local time (configurable)
- Only sent once per day maximum

**Content:**
```
⏰ Your Temporal Journey Awaits!

Time Energy: ████████░░ 80/100
Daily Reward: 🎁 Ready to claim!
Streak: 🔥 Day 7 (2.0x bonus active!)

[Continue Your Journey] → Jolt Time
```

**Why Valuable:**
- Daily rewards available
- Streak protection reminder
- No pressure to open immediately

**Opt-Out:** Users can disable or change time

---

### 2. Energy Restored

**Trigger:** User at 0 energy, now has 20+ energy

**Timing:** Immediate when threshold reached

**Content:**
```
⚡ Time Energy Restored!

Your energy is back — ready for a mission?
Current Energy: ████░░░░░░ 40/100

[Quick Mission] → Mesopotamia
```

**Why Valuable:**
- User can play again
- Low effort to return
- Quick action opportunity

**Frequency:** Once per energy cycle (~8 hours)

---

### 3. New Quest Available

**Trigger:** New daily quests have refreshed

**Timing:**
- 00:00 local time
- Or when user typically active

**Content:**
```
📜 New Daily Quests Ready!

Quest 1: Complete 3 missions → +100 XP, +25 Dust
Quest 2: Collect 2 artifacts → +50 XP
Quest 3: Help a friend → +25 XP, +10 Energy

Progress: 0/3 complete

[View Quests] → Jolt Time
```

**Why Valuable:**
- Fresh daily content
- Clear reward info
- Progress tracking

**Frequency:** Once per day

---

### 4. Research Completed

**Trigger:** Collection upgrade research finishes

**Timing:** Immediate when research completes

**Content:**
```
🔬 Research Complete!

Your artifact study has concluded:
→ "Ancient Sumerian Tablet" upgraded to Level 3
→ Set Bonus progress: 4/8 artifacts

New ability unlocked: "Scribe's Wisdom"
+10% XP for History Missions

[View Collection] → Jolt Time
```

**Why Valuable:**
- Time investment rewarded
- New power to try
- Collection progress shown

---

### 5. Event Started

**Trigger:** New limited-time event begins

**Timing:** Event start + reminder 24h later if not participated

**Content:**
```
🎭 New Event: "Greek Olympics" (Week 3)

Join the ancient Games in Athens!
🏛️ Compete in 5 historical challenges
🏆 Earn exclusive "Olympic Champion" title
🪙 Historical Tokens: 500 available

Duration: 7 days remaining

[Enter Event] → Jolt Time
```

**Why Valuable:**
- Limited-time content
- Exclusive rewards
- Community participation

**Frequency:** 1-2 times per week

---

### 6. Energy Cap Warning

**Trigger:** User has full energy, hasn't played in 12+ hours

**Timing:** 8:00 PM local time

**Content:**
```
⚠️ Energy Overflow Warning!

Your Time Energy is maxed at 100!
You're missing out on regenerating energy.

Last played: 14 hours ago
Come back to keep your streak alive!

[Play Now] → Jolt Time
```

**Why Valuable:**
- Prevents wasted resources
- Streak protection
- Gentle reminder

---

### 7. Limited-Time Historical Event

**Trigger:** Special event with unique rewards

**Timing:** 
- 48 hours before end
- 24 hours before end
- 2 hours before end

**Content:**
```
🏛️ "Last Day" — Egyptian Pyramid Discovery

Tomorrow at midnight UTC:
• Final opportunity for "Pharaoh's Seal" badge
• Pyramid expedition closes forever
• Leaderboard final standings

Your Progress: 75%
To guarantee: Complete 2 more expeditions

[Race for the Seal] → Jolt Time
```

**Why Valuable:**
- Creates urgency without pressure
- Clear action path
- Fair warning

**Frequency:** End of major events only

---

### 8. Seasonal Pass Ending Soon

**Trigger:** Season ends in 72 hours, user has premium track

**Timing:** 
- 72 hours before end
- 24 hours before end

**Content:**
```
📅 Season "Rise of Civilizations" Ending!

Premium Track Progress: 23/30 tiers
Unclaimed Rewards:
• Level 24: Legendary Artifact
• Level 25: Exclusive Frame

2 days remaining to claim!

[Claim Rewards] → Jolt Time
```

**Why Valuable:**
- Prevents missed rewards
- Clear claim path
- Premium value reminder

---

### 9. Friend Activity

**Trigger:** Friend completes achievement or beats your score

**Timing:** Real-time (max 3 per day)

**Content:**
```
👥 Friend Update!

Alex_Agent_42 beat your high score in "Roman Roads"
New Score: 15,420 | Your Best: 12,890

Or Alex_Agent_42 just reached Level 30!
They're now a certified "History Master"

[Challenge Alex] → Jolt Time
```

**Why Valuable:**
- Social connection
- Friendly competition
- Re-engagement hook

---

### 10. Weekly Summary

**Trigger:** End of week (Sunday midnight)

**Timing:** Monday 9:00 AM local time

**Content:**
```
📊 Your Week in Review

⏱️ Time Played: 4h 32m (+15% vs last week)
🎯 Missions Completed: 28
🏆 Achievements: 3 new
🔥 Current Streak: 12 days!
📈 Collection Level: 47

Top Era: Mesopotamia (68% complete)

[Start New Week Strong] → Jolt Time
```

**Why Valuable:**
- Progress reflection
- Achievement recognition
- Motivational

---

## Notification Timing Best Practices

### Optimal Send Times
```yaml
notification_timing:
  daily_login_reminder:
    primary: "10:00 AM"
    secondary: "6:00 PM"
    
  energy_restored:
    immediate: true
    threshold: 20 energy
    
  new_quests:
    immediate: "00:00 local"
    fallback: "User's typical wake time"
    
  events:
    morning: "9:00 AM"
    evening: "7:00 PM"
    
  weekly_summary:
    monday: "9:00 AM"
```

### User Time Zones
- All notifications sent in user's local timezone
- Default: UTC if not detected
- User can configure preferred times
- Quiet hours respected

---

## User Control

### Granular Settings
```yaml
notification_preferences:
  enabled: true  # Master toggle
  
  types:
    daily_reminder:
      enabled: true
      time: "10:00 AM"
      
    energy:
      enabled: true
      threshold: 20
      
    quests:
      enabled: true
      
    events:
      enabled: true
      
    social:
      enabled: true
      frequency_limit: 3/day
      
    weekly_summary:
      enabled: true
      day: "Monday"
      
  quiet_hours:
    enabled: true
    start: "10:00 PM"
    end: "8:00 AM"
```

### One-Click Actions
- Every notification includes "Settings" link
- Quick disable for that notification type
- Mute for 1 hour / 4 hours / 24 hours

---

## Anti-Spam Rules

### Hard Limits
- Maximum 4 notifications per 24 hours
- Maximum 1 notification per category per 12 hours
- No notification sent before 8:00 AM local
- No notification sent after 10:00 PM local

### Never Send
- ❌ Deceptive claims ("You won!")
- ❌ Fear tactics ("Your account will be deleted!")
- ❌ Multiple repeats of same message
- ❌ Notifications for inactive users (>7 days)
- ❌ Urgent payment requests

### Always Include
- ✅ Clear value proposition
- ✅ Honest timing ("2 days left")
- ✅ Easy opt-out
- ✅ Muting option
- ✅ Clear sender (Jolt Time Bot)

---

## Implementation Notes

### Telegram Bot API Usage
```javascript
// Send notification
bot.sendMessage(userId, message, {
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [{ text: 'Open Jolt Time', url: 't.me/jolttimebot?start=from_notif' }]
    ]
  },
  disable_notification: false
});
```

### Throttling
```javascript
// Per-user throttling
const MAX_NOTIFICATIONS_PER_DAY = 4;
const MIN_HOURS_BETWEEN_NOTIFICATIONS = 3;

// Queue management
const notificationQueue = new PriorityQueue();
notificationQueue.enqueue(notification, priority, timestamp);
```

### Analytics Tracking
- Notification open rate
- Click-through rate
- Opt-out rate
- Engagement after notification
- User satisfaction surveys

---

## Retention Impact Goals

| Notification Type | Open Rate Target | Retention Impact |
|------------------|------------------|------------------|
| Daily Reminder | 35% | +15% D7 retention |
| Energy Restored | 25% | +8% sessions/week |
| New Quests | 40% | +10% daily active |
| Event Start | 50% | +20% event participation |
| Streak Warning | 30% | -5% churn at risk |

---

*Good notifications are like good friends — they remind you of something valuable without being annoying.*
