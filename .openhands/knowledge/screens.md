# Jolt Time — Screen Architecture

## Overview

This document defines all screens for Jolt Time Telegram Mini App. Each screen includes purpose, major blocks, buttons, and user actions. Design follows premium dark futuristic style with soft glowing elements.

---

## 1. Loading Screen

### Purpose
Initial loading experience while app initializes, authenticates, and loads assets.

### Major Blocks
- **Logo Animation**: Animated Jolt Time logo with temporal distortion effect
- **Progress Indicator**: Thin progress bar showing load progress
- **Loading Text**: "Initializing temporal coordinates..." with animated dots
- **Version Badge**: Subtle app version in corner (debug only)

### Buttons
- None (auto-advances)

### User Actions
- Automatic transition when load completes
- Tap anywhere to skip animation (after minimum 2s)

### Transitions
- Fade to Welcome Screen (400ms ease-out)

---

## 2. Welcome Screen

### Purpose
First-time user onboarding entry point. Introduces the app concept for new users.

### Major Blocks
- **Hero Illustration**: Animated time portal with floating artifacts
- **Title Block**: "Jolt Time" with glow effect
- **Subtitle**: "Travel through history. Collect artifacts. Rewrite time."
- **Feature Highlights**: 3-card preview of core features
- **CTA Section**: Primary action button

### Buttons
- **Start Journey** (primary): Navigate to Telegram auth / main app
- **Learn More** (ghost): Expand feature preview

### User Actions
- Tap Start Journey → Trigger Telegram auth → Navigate to Home
- Tap Learn More → Expand feature cards with animation
- Swipe feature cards horizontally

### Transitions
- Slide up to Home Screen on start

---

## 3. Home Screen

### Purpose
Central hub displaying player status, quick actions, and daily content. Primary touchpoint for returning players.

### Major Blocks
- **Header Bar**: Player avatar, level badge, energy meter, settings icon
- **Time Energy Widget**: Current/max energy with regeneration timer
- **Daily Quests Card**: 3 daily quests with progress indicators
- **Current Event Banner**: Active event with countdown timer
- **Capsule Preview**: Available capsules to open
- **Quick Actions Grid**: 4 shortcut buttons to key features
- **Streak Widget**: Current streak with fire animation

### Buttons
- **Settings** (icon): Navigate to Settings
- **Energy Card**: Navigate to Energy details
- **Daily Quest Cards**: Navigate to quest detail / start quest
- **Event Banner**: Navigate to Events screen
- **Capsule Cards**: Open Capsule modal
- **Quick Actions**: Collection, Museum, Leaderboard, Friends

### User Actions
- Pull down to refresh all data
- Tap quest → Start/continue quest
- Tap capsule → Open with animation
- Long-press energy → Show regeneration details
- Tap avatar → Navigate to Profile

### Transitions
- Tab navigation switches main content
- Modal sheets slide up for details

---

## 4. Artifact Collection

### Purpose
Display all collected artifacts organized by era. Allow viewing, filtering, and managing artifacts.

### Major Blocks
- **Era Selector**: Horizontal scrollable tabs (All, Mesopotamia, Egypt, etc.)
- **Filter Bar**: Rarity filter, sort options, search
- **Collection Stats**: "12/20 Artifacts" progress indicator
- **Artifact Grid**: 3-column grid of artifact cards
- **Empty State**: Illustration for locked eras with unlock requirements

### Buttons
- **Era Tab**: Filter by era
- **Rarity Filter**: Common/Uncommon/Rare/Legendary toggles
- **Sort Button**: Name, Rarity, Date acquired, Power level
- **Search Icon**: Expand search input
- **Artifact Card**: Navigate to Artifact Details

### User Actions
- Tap artifact → Navigate to Artifact Details
- Swipe between eras
- Pull to refresh collection data
- Long-press artifact → Quick preview popup
- Tap locked era → Show unlock requirements

### Transitions
- Artifact tap → Slide right to Details
- Filter change → Fade transition on grid

---

## 5. Artifact Details

### Purpose
Detailed view of a single artifact with lore, stats, and upgrade options.

### Major Blocks
- **Artifact Display**: Large 3D rotating artifact with glow effect
- **Name & Era**: Artifact name with era badge
- **Rarity Badge**: Color-coded rarity indicator (Common/Uncommon/Rare/Legendary)
- **Lore Text**: Historical description and story
- **Stats Panel**: Power level, collection bonus, set bonus progress
- **Upgrade Section**: Chrono Dust cost and upgrade button
- **Set Preview**: Other artifacts in the same set

### Buttons
- **Back** (icon): Return to Collection
- **Upgrade** (primary): Spend Chrono Dust to power up
- **Share** (icon): Share artifact to Telegram chat
- **Set Preview Items**: Navigate to other artifacts in set

### User Actions
- Swipe artifact to rotate manually
- Tap upgrade → Confirm dialog → Success animation
- Tap Share → Telegram share picker
- Tap set item → Navigate to that artifact's details

### Transitions
- Back → Slide left back to Collection
- Upgrade success → Particle burst animation

---

## 6. Historical Capsules

### Purpose
Manage and open Historical Capsules. Display capsule inventory and opening options.

### Major Blocks
- **Capsule Balance**: Count of each capsule type (Common/Rare/Legendary)
- **Daily Free Capsule**: One free common capsule per day
- **Capsule Inventory**: List of owned capsules by type
- **Opening Animation Area**: Space for capsule opening experience
- **Capsule Shop**: Option to acquire more capsules (free/premium)

### Buttons
- **Open Capsule**: Start opening animation
- **Claim Free Capsule**: Daily free capsule claim
- **Watch Ad**: Earn capsule via AdsGram rewarded ad
- **Buy Capsule** (if premium): Purchase with Jolt Crystals

### User Actions
- Tap capsule to select → Open button activates
- Tap Open → Full-screen opening animation with reveal
- Tap Watch Ad → Load AdsGram ad → Reward capsule
- Long-press capsule → Quick view details

### Transitions
- Open animation → Full screen takeover → Reward reveal → Return

---

## 7. Museum

### Purpose
Endgame showcase displaying collection achievements, trophies, and player journey timeline.

### Major Blocks
- **Museum Header**: Player title and level display
- **Hall of Ages**: Visual gallery of all collected artifacts by era
- **Chronicle Wall**: Timeline of player milestones
- **Trophy Room**: Achievement badges and rare finds display
- **Research Lab**: Collection statistics and percentages
- **Share Button**: Export museum as image

### Buttons
- **Hall of Ages Section**: Enter interactive era view
- **Chronicle Wall**: Expand timeline entries
- **Trophy Items**: View achievement details
- **Share Museum**: Generate shareable image
- **Navigate Tabs**: Hall of Ages / Chronicle / Trophies / Research

### User Actions
- Tap era → Enter detailed era view with animated scenes
- Tap milestone → Expand with details and date
- Tap trophy → Show achievement popup
- Pinch to zoom on Hall of Ages
- Tap Share → Generate and share museum snapshot

### Transitions
- Tab switch → Crossfade content
- Era entry → Zoom into detail

---

## 8. Daily Quests

### Purpose
Display and track daily missions that refresh every 24 hours.

### Major Blocks
- **Quest List**: 3 daily quests with progress bars
- **Quest Cards**: Icon, name, description, reward preview, progress
- **Completion Time**: Remaining time until daily reset
- **Bonus Progress**: Extra rewards for completing all quests

### Buttons
- **Quest Card**: Start quest / Continue quest
- **Claim Button**: Appears when quest is complete
- **Refresh Timer**: Shows countdown to reset

### User Actions
- Tap active quest → Navigate to quest location
- Tap completed quest → Claim reward
- Pull to refresh quest status
- Tap claimed quest → Show reward summary

### Transitions
- Quest start → Navigate to game location
- Claim → Coin burst animation → Auto-close

---

## 9. Achievements

### Purpose
Display all achievements, progress, and unlocked rewards.

### Major Blocks
- **Category Tabs**: All, Collection, Progression, Social, Special
- **Achievement Grid**: Cards with icon, name, progress, reward
- **Overall Progress**: "15/50 Achieved" with XP earned
- **Recently Unlocked**: Highlight card for latest achievement

### Buttons
- **Category Tab**: Filter achievements
- **Achievement Card**: View details
- **Locked Achievement**: Show unlock requirements
- **Unlocked Badge**: View achievement popup

### User Actions
- Tap achievement → Show full achievement details
- Tap locked → Show how to unlock
- Swipe categories horizontally
- Pull to refresh achievement status

### Transitions
- Achievement tap → Scale-in popup
- Category change → Fade transition

---

## 10. Events

### Purpose
Display active and upcoming events with participation options.

### Major Blocks
- **Active Event Hero**: Large banner with event art and countdown
- **Event Type Badge**: Collection / Challenge / Story / Community
- **Event Progress**: Player's progress in current event
- **Event Rewards**: Preview of available rewards
- **Upcoming Events**: List of next 3 events with dates
- **Past Events**: History with participant results

### Buttons
- **Join Event**: Start participating in active event
- **Event Reward**: Claim event reward
- **Event Card**: View event details
- **Upcoming Card**: Set reminder notification

### User Actions
- Tap active event → Full event details screen
- Tap Join → Start event participation
- Tap upcoming → Set notification
- Swipe event cards for more info
- Pull to refresh event status

### Transitions
- Event join → Expand to full screen
- Reward claim → Confetti animation

---

## 11. Leaderboard

### Purpose
Competitive rankings showing player positions across different categories.

### Major Blocks
- **Time Period Selector**: Daily / Weekly / Season tabs
- **Category Tabs**: Global / Friends / Era-specific
- **Top 3 Display**: Special styling for podium positions
- **Player Rank Card**: User's current position (pinned if not in view)
- **Rankings List**: Scrollable list with avatar, name, score
- **Rewards Preview**: Rank-based reward tiers

### Buttons
- **Period Tab**: Switch time period
- **Category Tab**: Switch ranking category
- **Player Card**: Navigate to their profile
- **Rank Card**: View profile of ranked player
- **Refresh Button**: Update leaderboard

### User Actions
- Tap period → Reload leaderboard data
- Tap player → View their profile
- Scroll rankings → Player card stays visible if scrolled past
- Swipe between categories
- Pull to refresh rankings

### Transitions
- Period change → Skeleton → Data fade in
- Profile tap → Slide right to profile

---

## 12. Season Pass

### Purpose
Display current season progress with free and premium reward tracks.

### Major Blocks
- **Season Header**: Season name, theme art, time remaining
- **Progress Bar**: Current tier and XP progress
- **Free Track**: 15 reward tiers available to all players
- **Premium Track**: 15 additional tiers for subscribers
- **Current Tier Preview**: Highlighted active reward
- **Season Benefits Card**: Summary of season pass advantages

### Buttons
- **Claim Tier**: Claim completed tier reward
- **Upgrade to Premium**: Purchase season pass
- **Track Tab**: Switch between Free/Premium
- **Reward Card**: Preview tier rewards
- **Season FAQ**: Information about season system

### User Actions
- Tap claimable reward → Claim with animation
- Tap locked premium tier → Prompt to upgrade
- Tap Upgrade → Show purchase flow
- Swipe tracks to compare
- Pull to refresh season data

### Transitions
- Reward claim → Slide to next tier
- Purchase → Success overlay → Track update

---

## 13. Notifications Center

### Purpose
Display all player notifications including achievements, events, friends, and system alerts.

### Major Blocks
- **Notification Tabs**: All / Achievements / Social / Events / System
- **Notification List**: Grouped by date
- **Unread Badge**: Count of unread notifications
- **Empty State**: Encouraging message when inbox is empty
- **Clear All Button**: Mark all as read

### Buttons
- **Notification Card**: Navigate to related content
- **Tab**: Filter by category
- **Mark Read**: Swipe action on notification
- **Clear All**: Mark all as read

### User Actions
- Tap notification → Navigate to relevant screen
- Swipe notification → Mark as read
- Long-press → Show notification details
- Pull to refresh notifications
- Tap Clear All → Confirmation → Clear

### Transitions
- Notification tap → Navigate with back reference
- Mark read → Slide out animation

---

## 14. Profile

### Purpose
Display player identity, stats, collection summary, and social features.

### Major Blocks
- **Avatar & Badge**: Profile picture with level frame
- **Player Name & Title**: Display name and earned title
- **Stats Grid**: Level, Total XP, Artifacts, Achievements
- **Collection Summary**: Era completion percentages
- **Season Progress**: Current season tier
- **Friends Preview**: Friend count with add button
- **Joined Date**: Member since timestamp
- **Edit Profile Button**: Customize name/avatar

### Buttons
- **Edit Profile**: Open profile editor
- **Settings**: Navigate to settings
- **Share Profile**: Share profile card to Telegram
- **Friends Section**: Navigate to Friends screen
- **Collection Stats**: Navigate to Collection

### User Actions
- Tap Edit → Change name/avatar
- Tap Share → Generate shareable profile card
- Tap friend → View friend's profile
- Tap stats → Navigate to detailed stats
- Tap collection → Open Collection screen

### Transitions
- Edit profile → Modal sheet
- Share → Telegram share picker

---

## 15. Settings

### Purpose
App configuration, preferences, and account management.

### Major Blocks
- **Profile Section**: Edit name, avatar
- **Notification Toggles**: Enable/disable notification types
- **Sound Settings**: Music, SFX, haptic toggles
- **Display Settings**: Theme options, animation toggle
- **Language Selector**: Available languages
- **Account Section**: Telegram link, data export
- **Help & Support**: FAQ, contact, report bug
- **About**: Version, credits, legal

### Buttons
- **Toggle Switches**: Enable/disable options
- **Setting Row**: Expand setting details
- **Language Row**: Open language picker
- **Help Links**: Navigate to help content
- **Back**: Return to previous screen

### User Actions
- Tap toggle → Immediate save with feedback
- Tap language → Show picker modal
- Tap edit profile → Open profile editor
- Tap export data → Generate data package
- Tap help → Open support options

### Transitions
- Setting expand → Smooth accordion
- Back → Slide left

---

## 16. Premium Membership

### Purpose
Display premium subscription benefits and purchase options.

### Major Blocks
- **Benefits List**: Detailed feature comparison
- **Pricing Card**: Cost with regional pricing
- **Current Status**: Active/Expired subscription
- **Feature Grid**: Icons with feature descriptions
- **Testimonial**: Social proof quotes
- **FAQ Section**: Common questions about premium

### Buttons
- **Subscribe** (primary): Start purchase flow
- **Restore Purchase**: For transferred accounts
- **Feature Card**: Learn more about feature
- **FAQ Item**: Expand answer

### User Actions
- Tap Subscribe → In-app purchase flow
- Tap Restore → Check purchase history
- Tap feature → Show feature details
- Tap FAQ → Expand answer
- Scroll comparison chart

### Transitions
- Purchase → Loading → Success overlay
- Feature expand → Accordion animation

---

## 17. Reward Screen

### Purpose
Celebratory display of rewards earned from quests, achievements, or events.

### Major Blocks
- **Reward Animation**: Particle effects and glow
- **Reward Display**: Large item preview
- **Reward Details**: Name, rarity, description
- **XP Gained**: Experience bar animation showing progress
- **Currency Gained**: Chrono Dust, Jolt Crystals counters
- **Continue Button**: Dismiss and continue

### Buttons
- **Continue** (primary): Return to previous screen
- **Share Reward**: Share to Telegram (for rare+ rewards)
- **View Collection**: Navigate to Collection

### User Actions
- Tap Continue → Return to game
- Tap Share → Telegram share picker
- Tap View Collection → Navigate to Collection
- Long-press reward → Enlarge preview

### Transitions
- Entry → Zoom-in with particles
- Continue → Fade out

---

## 18. Ads Reward Screen (AdsGram)

### Purpose
Display rewarded video ad options and handle AdsGram integration. Primary monetization pathway.

### Major Blocks
- **Available Rewards List**: Energy, Capsules, Currency options
- **Ad Reward Cards**: Icon, reward amount, "Watch Ad" button
- **Watch Counter**: Ads watched today / daily limit
- **Bonus Multiplier**: Special event multipliers
- **Loading State**: Ad loading indicator

### Buttons
- **Watch Ad** (primary): Load and play AdsGram rewarded ad
- **Reward Card**: Select specific reward
- **Info Icon**: Explain reward details

### User Actions
- Tap Watch Ad → Load AdsGram SDK → Play ad
- Ad completes → Grant reward with animation
- Ad closes early → No reward granted
- Tap reward option → Select reward type

### Transitions
- Ad load → Full-screen takeover
- Reward grant → Reward Screen → Return

### Important Notes
- **AdsGram Primary**: This screen is mandatory as the core revenue model
- **No Pay-to-Win**: Rewards are conveniences only, never gameplay advantages
- **Respects User Time**: Easy dismiss after 5 seconds
- **Transparent**: Clear value proposition before watching

---

## 19. Telegram Friends

### Purpose
Social features including friend list, friend requests, and friend activity.

### Major Blocks
- **Friends List**: Alphabetical/Active sorting
- **Online Status**: Green dot for active friends
- **Friend Card**: Avatar, name, level, last active
- **Pending Requests**: Incoming friend requests badge
- **Add Friends**: Invite via Telegram link
- **Friend Activity**: Recent actions from friends

### Buttons
- **Friend Card**: View friend's profile
- **Send Gift**: Send energy/currency to friend
- **Request Badge**: View pending requests
- **Add Friends**: Open invite flow
- **Invite Link**: Copy/share Telegram invite

### User Actions
- Tap friend → View profile
- Tap Send Gift → Select gift → Send
- Tap request → Accept/Decline
- Tap Add → Copy/share invite link
- Pull to refresh friend list
- Swipe friend → Quick actions (gift, message)

### Transitions
- Profile tap → Slide right
- Gift send → Success popup

---

## 20. Referral Screen

### Purpose
Invite friends via Telegram and earn rewards for successful referrals.

### Major Blocks
- **Referral Stats**: Friends invited, rewards earned
- **Unique Invite Link**: Telegram shareable link
- **Reward Preview**: What referrer and referee get
- **Leaderboard**: Top referrers in community
- **Referral History**: List of successful referrals

### Buttons
- **Invite Friends** (primary): Share invite link
- **Copy Link**: Copy to clipboard
- **Reward Card**: View reward details
- **History Item**: View referred friend

### User Actions
- Tap Invite → Telegram share picker
- Tap Copy → Copy link with feedback
- Tap reward → Show reward details
- Tap history → View friend's profile
- Pull to refresh referral data

### Transitions
- Share → Telegram native share
- Copy → Toast notification

---

## Screen Consistency Rules

### Visual Patterns
- All screens use dark background (#0A0E17)
- Cards use #131B2E with subtle cyan borders
- Primary actions use gradient (cyan → mint)
- Premium elements use gold (#FFD700)
- Consistent 16px card padding
- 12px border radius on cards

### Responsive Behavior
- Max-width: 428px (iPhone Pro Max)
- Safe area insets respected
- Bottom navigation: 72px + safe area
- Touch targets: minimum 44x44px

### Loading States
- Skeleton screens for content loading
- Shimmer animation on skeletons
- Never show raw spinners
- Pull-to-refresh on all lists

### Error States
- Friendly error illustrations
- Actionable error messages
- Retry button always visible
- Fallback data when available

### Empty States
- Encouraging illustrations
- Clear explanation of how to populate
- Primary CTA to take action
- Contextual based on screen

---

## Accessibility Requirements

### WCAG 2.1 AA
- Color contrast 4.5:1 for text
- 3:1 for interactive elements
- Focus indicators visible
- Keyboard navigation support

### Touch Optimization
- 44x44px minimum touch targets
- Adequate spacing (8px minimum)
- No precision required
- Gesture alternatives available

### Motion Respect
- Check prefers-reduced-motion
- Provide static alternatives
- No essential info in animation only
- Smooth 60fps animations only

---

*Every screen tells a part of the Jolt Time story.*
