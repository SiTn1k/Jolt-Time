# Jolt Time — Settings, Personalization, and Accessibility System

## Document Overview

This document defines the complete settings, personalization, and accessibility systems for Jolt Time. The systems are designed to ensure Jolt Time remains comfortable for all players while respecting individual preferences and supporting different play styles.

---

## 1. Settings Categories Overview

Jolt Time provides a comprehensive settings structure organized into the following categories:

- **General Settings** — Core application behavior
- **Notification Settings** — Push notification preferences
- **Language Settings** — Localization and regional preferences
- **Accessibility Settings** — Visual and motion accommodations
- **Privacy Settings** — Data control and visibility preferences
- **Visual Settings** — Animation, effects, and performance options

All settings are persisted per user in Supabase and apply across both the Telegram Mini App and Telegram Bot.

---

## 2. General Settings

Core application behavior that affects overall user experience.

### 2.1 Core Preferences

- **Auto-Play Animations** — Enable/disable automatic animation playback
- **Haptic Feedback** — Toggle vibration on interactions
- **Sound Effects** — Master toggle for all UI sounds
- **Music** — Toggle background music
- **Music Volume** — Slider 0-100%
- **Sound Effects Volume** — Slider 0-100%
- **Default Tab** — Set home screen landing tab (Collection, Museum, Quests, Profile)

### 2.2 Time Display

- **Time Format** — 12-hour / 24-hour toggle
- **Date Format** — Multiple locale-aware options
- **Show Relative Times** — "2 hours ago" vs absolute timestamps

### 2.3 Data Management

- **Clear Cache** — Remove locally cached data (artifacts, images)
- **Export Account Data** — GDPR-compliant data export
- **Delete Account** — Account deletion with confirmation flow

---

## 3. Notification Settings

Notification preferences give players full control over how and when they receive communications.

### 3.1 Master Controls

- **Enable All Notifications** — Global toggle (default: enabled)
- **Notification Sound** — Enable/disable notification sounds
- **Notification Badge** — Show/hide Telegram unread badge

### 3.2 Notification Categories

Players can individually enable or disable each notification type:

| Category | Description | Default |
|----------|-------------|---------|
| Daily Reminders | Login reminder, streak protection | Enabled |
| Quest Completion | Mission/quest finished notifications | Enabled |
| Collection Events | New artifact discoveries, duplicate alerts | Enabled |
| Social Activity | Friend requests, guild updates, leaderboard changes | Enabled |
| Event Alerts | Seasonal events, limited-time content | Enabled |
| Museum Milestones | Display cases unlocked, collection tier reached | Enabled |
| Inactivity Reminders | Prompt to return after 3+ days inactive | Disabled |
| AdsGram Rewards | Optional ad reward notifications | Disabled |
| Bot Reminders | Telegram bot reminder messages | Enabled |

### 3.3 Quiet Hours

Players can configure a daily quiet period when no notifications are sent:

- **Quiet Hours Enabled** — Toggle
- **Start Time** — Time picker (default: 22:00)
- **End Time** — Time picker (default: 08:00)
- **Timezone** — Auto-detected from Telegram, overridable

During quiet hours, all non-critical notifications are queued and delivered when the period ends. Quest completion and urgent notifications bypass quiet hours.

### 3.4 Notification Frequency

- **Daily Notification Limit** — Maximum notifications per day (1-10, default: 5)
- **Digest Mode** — Combine multiple notifications into a single digest

---

## 4. Language Settings

Language settings extend the localization system with user preferences.

### 4.1 Language Selection

- **Interface Language** — Player-selected language for all UI text
- **Available Languages:** Ukrainian (uk), English (en), Polish (pl), German (de), Spanish (es), French (fr)
- **Auto-Detection** — Uses Telegram locale on first login if supported
- **Instant Preview** — Shows key UI elements in selected language before confirming

### 4.2 Regional Preferences

- **Number Format** — Locale-aware (1,234.56 vs 1.234,56)
- **Date Format** — DD.MM.YYYY / MM/DD/YYYY / DD/MM/YYYY
- **Timezone** — Auto-detected with manual override available

### 4.3 Audio Language

- **Narration Language** — Language for historical content narration (future feature)
- **Event Commentary** — Language preference for live events (future feature)

---

## 5. Accessibility Settings

Accessibility features ensure Jolt Time remains comfortable for all players, including those with visual impairments, motion sensitivity, or other accessibility needs.

### 5.1 Text Size

- **Larger Text Mode** — Increases base font size by 25%
- **Text Size Slider** — Fine-grained control from 80% to 150% of default
- **Respects System Settings** — Option to follow Telegram app text size

### 5.2 Color and Contrast

- **High Contrast Mode** — Increases color contrast ratios, adds borders to interactive elements
- **Dark/Light Theme** — Dark mode (default) / Light theme option
- **Reduce Transparency** — Removes backdrop blur and transparency effects
- **Reduce Vignette** — Decreases or removes screen edge darkening

### 5.3 Motion and Animation

- **Reduce Animations** — Minimizes non-essential animations
- **Disable All Animations** — Complete animation disable (except essential transitions)
- **Pause Background Effects** — Static background instead of animated elements
- **Reduced Motion Mode** — Respects device-level reduced motion preference

### 5.4 Color-Friendly Interface Principles

The interface follows color-blind friendly design principles:

- **Never Rely on Color Alone** — Information conveyed through shape, icon, or text alongside color
- **Artifact Rarity Colors** — Always paired with distinct icons or labels:
  - Common: Gray (#9CA3AF) with ◇
  - Rare: Blue (#3B82F6) with ◆
  - Epic: Purple (#8B5CF6) with ◆◇
  - Legendary: Gold (#FFD700) with ★
  - Mythical: Cyan (#00D9FF) with ★★
- **Status Indicators** — Use both color and text/icon (e.g., "Online" with green dot + text)
- **Error States** — Red border + icon + text message, never color alone
- **Interactive Elements** — Hover/focus states include border changes, not just color
- **Chart Colors** — Use patterns/shapes in addition to color for data visualization

### 5.5 Screen Reader Support

- **ARIA Labels** — All interactive elements have proper ARIA labels
- **Heading Hierarchy** — Proper heading structure (h1 > h2 > h3)
- **Focus Indicators** — Visible focus states for keyboard navigation
- **Live Regions** — Dynamic content changes announced appropriately
- **Language Attributes** — Correct lang attributes for multilingual content

### 5.6 Cognitive Accessibility

- **Simplified Mode** — Reduces interface complexity, larger touch targets
- **Tutorial Replay** — Easy access to replay any tutorial or guide
- **Consistent Navigation** — Predictable menu placement and interaction patterns
- **Clear Error Messages** — Human-readable error descriptions with recovery suggestions

---

## 6. Privacy Settings

Privacy settings give players control over their data and visibility.

### 6.1 Notification Privacy

- **Show Online Status** — Let others see when you're online
- **Show Activity Status** — Let friends see recent gameplay activity
- **Last Seen Privacy** — Everyone / Friends Only / Nobody

### 6.2 Analytics Participation

- **Share Analytics** — Opt-in to anonymous gameplay analytics (default: opt-in)
- **Share Crash Reports** — Opt-in to crash and error reporting
- **Personalized Recommendations** — Allow use of personal data for content suggestions

Analytics participation is entirely voluntary and does not affect gameplay or rewards.

### 6.3 Connected Services

- **Telegram Profile** — View linked Telegram account information
- **Friend Connections** — Manage Telegram contact linking
- **Third-Party Links** — View and revoke any future third-party connections

### 6.4 Data Control

- **Request Data Export** — GDPR-compliant full data export
- **Delete Account** — Complete account deletion with 30-day grace period
- **Privacy Policy Version** — View current privacy policy with version history

---

## 7. Personalization Features

Personalization allows players to customize their Jolt Time experience to reflect their interests and achievements.

### 7.1 Profile Customization

- **Display Name** — Customizable nickname (within character limits)
- **Avatar Frame** — Selectable decorative frames based on achievements
- **Bio/About** — Short personal description (optional)
- **Favorite Color** — Theme accent color preference
- **Time Traveler Title** — Titles earned through gameplay displayed on profile

### 7.2 Favorite Artifact Display

- **Featured Artifact** — Pin one artifact to profile showcase
- **Favorite Collection** — Highlight a specific artifact collection
- **Recently Displayed** — Show recently acquired artifacts
- **Artifact Display Style** — Grid view / List view / Showcase view

### 7.3 Favorite Historical Era

- **Preferred Era** — Set a favorite era for quick navigation
- **Era Theme** — Option to apply era-specific theme accents
- **Era Notifications** — Receive updates about preferred era content

### 7.4 Museum Showcase Preferences

- **Public Museum** — Share museum collection with other players
- **Showcase Layout** — Customize museum display order
- **Exhibition Focus** — Highlight specific collection themes
- **Tour Guide Mode** — Enable/disable educational fact displays

### 7.5 Dashboard Customization

- **Quick Access Widgets** — Customize home screen widget arrangement
- **Favorite Quests** — Pin frequently accessed quests
- **Recent Activity Feed** — Configure activity notification preferences

---

## 8. Profile Visibility Settings

Players control who can see their profile and activity.

### 8.1 Visibility Levels

| Level | Description |
|-------|-------------|
| **Public Profile** | Visible to all players; shown on leaderboards and in search |
| **Friends Only** | Visible to approved friends; hidden from public leaderboards |
| **Private Profile** | Only visible to self; all stats and collection hidden |

### 8.2 Granular Visibility Controls

- **Show on Leaderboards** — Appear on global/era leaderboards
- **Show Collection Progress** — Display artifact collection percentage
- **Show Museum Level** — Reveal museum progression
- **Show Achievements** — Display earned achievement badges
- **Show Activity Status** — Let friends see current activity
- **Allow Friend Requests** — Accept/reject automatic friend requests
- **Show Time Travel Stats** — Display total time played, eras visited

### 8.3 Blocking and Muting

- **Block Players** — Prevent specific players from viewing profile or sending messages
- **Mute Players** — Hide activity without blocking
- **Report Players** — Flag inappropriate content or behavior

---

## 9. Telegram Bot Settings

Configuration options for the Telegram Bot companion.

### 9.1 Reminder Settings

- **Daily Login Reminder** — Bot sends reminder if no login by configured time
- **Reminder Time** — Set preferred reminder time (default: 18:00)
- **Streak Protection Alert** — Notify before streak grace period expires
- **Quest Deadline Reminder** — Alert before weekly quest reset

### 9.2 Event Notifications

- **Event Start Alerts** — Notify when limited-time events begin
- **Event Ending Alerts** — Remind when event is about to end
- **New Content Alerts** — Notify about new eras, artifacts, or features
- **Seasonal Reminders** — Special notifications for seasonal content

### 9.3 Inactivity Reminders

- **Inactivity Warning** — Message after 3 days of inactivity
- **Comeback Incentive** — Special rewards message after 7+ days inactive
- **Unsubscribe Option** — Complete opt-out from bot messages

### 9.4 Bot Command Preferences

- **Compact Responses** — Shorter, less detailed bot replies
- **Include Images** — Attach artifact/images in bot messages
- **Language Preference** — Separate language setting for bot messages

---

## 10. Visual Settings

Visual settings control animations, effects, and performance-related options.

### 10.1 Animation Controls

- **Animation Intensity:**
  - **Full** — All animations enabled (default)
  - **Reduced** — Essential animations only
  - **Minimal** — No decorative animations
  - **None** — All animations disabled

- **Animation Categories:**
  - **UI Transitions** — Screen and menu transitions (cannot be fully disabled)
  - **Artifact Reveals** — Collection/capsule opening animations
  - **Background Effects** — Particle effects, parallax scrolling
  - **Notification Animations** — Toast and alert animations
  - **Achievement Celebrations** — Unlock and milestone animations

### 10.2 Vibration Settings

- **Haptic Feedback:**
  - **Full** — All haptics enabled (default)
  - **Light** — Subtle haptics only
  - **Minimal** — Essential actions only
  - **None** — All haptics disabled

- **Vibration Categories:**
  - **Button Press** — Touch feedback on buttons
  - **Success** — Reward/achievement feedback
  - **Error** — Error state feedback
  - **Pull-to-Refresh** — Refresh gesture feedback

### 10.3 Reduced Effects Mode

**Reduced Effects Mode** is a comprehensive preset that combines:

- Animation Intensity → Reduced
- Haptic Feedback → Light
- Background Effects → Disabled
- Reduce Transparency → Enabled
- Reduce Vignette → Enabled

Single toggle to enable/disable all at once.

### 10.4 Battery Saving Mode

**Battery Saving Mode** optimizes for reduced power consumption:

- Animation Intensity → Minimal
- Background Effects → Disabled
- Auto-Play Videos → Disabled
- High Refresh Rate → Disabled (lock to 30Hz)
- Push Notifications → Batch delivery (hourly vs real-time)

Can be auto-triggered when device battery is below 20%.

### 10.5 Graphics Quality

- **Resolution Scale** — High (100%) / Medium (75%) / Low (50%)
- **Texture Quality** — High / Medium / Low
- **Shadow Quality** — High / Medium / Low / None
- **Particle Count** — Max / Medium / Low / None

---

## 11. Accessibility Philosophy

Jolt Time is committed to remaining comfortable for all players across different abilities, devices, and preferences.

### 11.1 Universal Comfort Principles

- **No Forced Experience** — Players always have choices; no experience is mandatory
- **Graceful Degradation** — Core gameplay accessible even with all accessibility options enabled
- **Device Inclusivity** — Support both flagship and budget devices
- **Independence** — All features playable without requiring precise timing or inputs

### 11.2 Supporting Different Play Styles

| Play Style | Supported Through |
|------------|-------------------|
| **Casual** | Quick sessions, flexible timers, forgiving mechanics |
| **Dedicated** | Deep content, achievement systems, collection tracking |
| **Competitive** | Leaderboards, fair matching, transparent mechanics |
| **Social** | Friends, guilds, shared experiences |
| **Exploratory** | Museum, lore, historical content depth |

### 11.3 Avoiding Visual Overload

- **Progressive Disclosure** — Complex information revealed gradually
- **Priority Hierarchy** — Most important information visually prominent
- **Calming Aesthetic** — Dark theme with soft glows reduces eye strain
- **No Flashing Content** — No rapid color changes or strobing effects
- **Readable Typography** — Clear fonts, adequate spacing, sufficient contrast
- **Intentional Color Use** — Color serves meaning, not decoration

### 11.4 Accessibility by Default

- All new features must maintain accessibility compliance
- Accessibility options tested with each release
- Player feedback actively sought for accessibility improvements
- Support for device-level accessibility settings (iOS/Android)

---

## 12. Quality of Life Philosophy

Settings in Jolt Time improve player comfort without affecting competitive balance.

### 12.1 QoL Design Principles

- **Comfort Over Speed** — Quality of life > marginal time savings
- **Optional Only** — No mandatory accessibility requirements
- **No Competitive Advantage** — Settings affect personal experience only, not relative power
- **Performance Preservation** — Visual settings respect device capabilities
- **Battery Awareness** — Power-saving options for mobile devices

### 12.2 What Settings Should NOT Affect

To maintain competitive integrity:

- **Progression Speed** — No settings that accelerate XP or currency gains
- **Resource Availability** — No settings that increase drops or rewards
- **Combat Balance** — No settings that affect battle outcomes
- **Leaderboard Standing** — No settings that provide unfair advantages
- **Collection Probability** — No settings that affect gacha/capsule odds

### 12.3 What Settings CAN Affect

Settings appropriately affect:

- **Visual Experience** — Animations, effects, themes
- **Audio Experience** — Sounds, music, haptics
- **Notification Frequency** — Push notification preferences
- **Interface Layout** — Dashboard customization, quick access
- **Accessibility Features** — Text size, contrast, motion reduction
- **Privacy** — Profile visibility, data sharing

---

## 13. Future Accessibility Features

The following features are documented for future implementation consideration.

### 13.1 Screen Reader Improvements

- **Enhanced ARIA Support** — Comprehensive screen reader compatibility for all screens
- **Audio Descriptions** — Narration of visual content for image-based elements
- **Gesture Alternatives** — All touch gestures have non-gesture alternatives
- **Voice Control** — Hands-free navigation option (future)

### 13.2 Advanced Color Themes

- **Custom Accent Colors** — Player-selectable primary color
- **Preset Themes** — Multiple color schemes beyond dark/light
- **Seasonal Themes** — Special themes for events (future)
- **High Contrast Presets** — Optimized presets for various vision types

### 13.3 Customizable Interface Layouts

- **Drag-and-Drop Dashboard** — Arrange home screen elements
- **Widget Selection** — Choose which widgets appear on home
- **Navigation Customization** — Reorder or hide menu items
- **Preset Layouts** — Collection-focused, Social-focused, Balanced

### 13.4 Advanced Motion Controls

- **Per-Animation Toggle** — Fine-grained control over each animation type
- **Motion Presets** — Gaming, Reading, Minimalist presets
- **Motion Intensity Scale** — Continuous slider rather than discrete options
- **Animation Duration** — Adjustable animation speed globally

### 13.5 Cognitive Support Features

- **Task Breakdown** — Break complex quests into smaller steps
- **Visual Guides** — Highlight next action more prominently
- **Simplified Interface Mode** — Reduced UI complexity option
- **Extended Time Limits** — Additional time for timed interactions (future)

### 13.6 Input Accessibility

- **Custom Key Bindings** — Remap shortcuts for keyboard users
- **Controller Support** — Gamepad/joystick navigation (future)
- **Switch Access** — Single-switch navigation option (future)
- **Voice Commands** — Text-based commands via bot (future)

---

## 14. AdsGram Integration with Settings

AdsGram remains a primary revenue system. Players maintain control over ad-related notifications.

### 14.1 AdsGram Notification Control

- **AdsGram Reward Notifications** — Independent toggle from general notifications
- **Default: Disabled** — Players opt-in to ad reward notifications
- **Rewarded Ad Frequency** — Player-configurable max daily rewarded ads (1-10)
- **No Forced Viewing** — Ads never become intrusive or mandatory

### 14.2 Ad Experience Controls

- **Reduced Motion in Ads** — Apply reduced animation to rewarded ad content
- **Mute Ads** — Option to mute audio in video ads
- **Battery Saver Impact** — Ads auto-quality-reduce when Battery Saving Mode active

### 14.3 AdsGram Compliance

- **No Intrusive Ads** — Ads appear only at natural breaks
- **No Mid-Game Ads** — Zero ads during active gameplay or battles
- **Skip Options** — Available on all non-rewarded ad formats
- **Frequency Caps** — Strict limits regardless of settings
- **GDPR Compliant** — Consent management for analytics and ads

---

## 15. Settings Persistence and Sync

### 15.1 Data Storage

All settings are stored in Supabase with the following structure:

```
user_settings {
  user_id: uuid (FK to users)
  settings_key: string
  settings_value: jsonb
  updated_at: timestamp
}
```

### 15.2 Sync Behavior

- **Real-time Sync** — Settings changes apply immediately across all sessions
- **Platform Independent** — Settings apply to both Mini App and Bot
- **Offline Capable** — Core settings cached locally, sync when online
- **Reset Option** — "Reset to Defaults" available in each settings category

### 15.3 Default Values

All settings have documented defaults documented in this specification. First-time users receive default values appropriate for their device type and Telegram locale.

---

## 16. Settings UI Design

### 16.1 Navigation Structure

```
Settings (Home)
├── General
│   ├── Audio & Sound
│   ├── Display
│   └── Data Management
├── Notifications
│   ├── Master Toggle
│   ├── Categories
│   ├── Quiet Hours
│   └── Frequency
├── Language
│   ├── Interface Language
│   └── Regional Preferences
├── Accessibility
│   ├── Text Size
│   ├── Color & Contrast
│   ├── Motion
│   └── Screen Reader
├── Privacy
│   ├── Profile Visibility
│   ├── Analytics
│   └── Connected Services
├── Visual
│   ├── Animation
│   ├── Haptics
│   ├── Quality Presets
│   └── Battery
└── About
    ├── Version
    ├── Terms
    └── Privacy Policy
```

### 16.2 Design Principles

- **Clear Labels** — Each setting has descriptive label with optional tooltip
- **Immediate Feedback** — Toggle states update visually on touch
- **Grouped Related Settings** — Logical grouping for easy scanning
- **Search** — Global settings search for quick navigation
- **Reset Options** — Per-section and global reset to defaults

---

## 17. Related Documentation

- [Localization System](../localization.md) — Language infrastructure
- [Notifications](../notifications.md) — Push notification system
- [Privacy & Security](../security-system.md) — Security architecture
- [Analytics](../analytics.md) — Analytics data handling
- [AdsGram](../adsgram.md) — Ad monetization system
- [User Profile](../player-profile.md) — Profile customization
- [Museum System](../museum-system.md) — Museum showcase features

---

*Settings should respect player individuality while maintaining shared experience.*
