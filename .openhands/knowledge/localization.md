# Jolt Time — Localization and Multi-Language System

## Overview

Jolt Time is designed for an international audience from the ground up. The localization system ensures all players, regardless of language, experience the game fully and fairly. Every system—Mini App, bot, notifications, and content—supports multiple languages with consistent quality.

**Core Philosophy:**
- International-first design — language is not an afterthought
- All text externalized — no hardcoded strings ever
- Quality translations — meaning preserved, not just words
- Consistent experience — same information available in every language
- Accessible language — simple enough for language learners, clear for natives

---

## 1. Supported Languages

### 1.1 Initial Language Support

```
SUPPORTED LANGUAGES (LAUNCH):
┌─────────────────────────────────────────────────────────────────┐
│  LANGUAGE              CODE    REGION        PRIORITY            │
│  ─────────────────────────────────────────────────────────────  │
│  Ukrainian            uk      Ukraine       Primary            │
│  English              en      Global        Primary            │
│  Polish               pl      Poland        Secondary          │
│  German               de      Germany       Secondary          │
│  Spanish              es      Spain/LatAm   Secondary          │
│  French               fr      France        Secondary          │
│                                                                 │
│  Total: 6 languages at launch                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Language Priority Tiers

```
LANGUAGE TIERS:
┌─────────────────────────────────────────────────────────────────┐
│  TIER 1 - PRIMARY (Launch)                                     │
│  ─────────────────────────────────────────────────────────────  │
│  • Ukrainian (uk) — Primary market                            │
│  • English (en) — Global fallback                            │
│  • Full localization: All text, content, notifications        │
│  • Professional translation                                    │
│  • Native speaker review                                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  TIER 2 - SECONDARY (Launch)                                  │
│  ─────────────────────────────────────────────────────────────  │
│  • Polish, German, Spanish, French                            │
│  • Full localization: All text, content, notifications        │
│  • Professional translation                                    │
│  • Native speaker review                                       │
│  • May have minor regional adaptations                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  TIER 3 - FUTURE (Post-Launch)                                │
│  ─────────────────────────────────────────────────────────────  │
│  • Portuguese (pt), Italian (it), Japanese (ja)               │
│  • Korean (ko), Chinese Simplified (zh-CN)                    │
│  • Arabic (ar), Hebrew (he) — RTL languages                  │
│  • Added based on community demand and resources              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Future Language Expansion

```
ADDING NEW LANGUAGES:
┌─────────────────────────────────────────────────────────────────┐
│  EXPANSION PROCESS                                              │
│  ─────────────────────────────────────────────────────────────  │
│  1. Community Request → Analyze demand metrics                  │
│  2. Resource Assessment → Translation team capacity            │
│  3. Content Freeze → Lock current strings for translation      │
│  4. Translation → Professional translation + review             │
│  5. Integration → Add to language picker and detection         │
│  6. Soft Launch → Beta test with new language users           │
│  7. Full Launch → Enable for all users                         │
│                                                                 │
│  STRING ADDITION:                                             │
│  • All new strings include all Tier 1+ languages              │
│  • Tier 3 languages receive updates within 2 weeks             │
│  • Never deploy new strings without English version           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Translation Philosophy

### 2.1 Translation Architecture

```
TRANSLATION SYSTEM DESIGN:
┌─────────────────────────────────────────────────────────────────┐
│  TRANSLATION ARCHITECTURE                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │  Source     │    │ Translation │    │  Runtime    │       │
│  │  Strings    │───▶│    JSON     │───▶│   Bundle    │       │
│  │  (English)  │    │   Files     │    │   (i18n)   │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│         │                 │                  │               │
│         │          ┌──────┴──────┐          │               │
│         │          │  Fallback   │          │               │
│         │          │  (English)  │          │               │
│         │          └─────────────┘          │               │
│         │                                     │               │
│         ▼                                     ▼               │
│  ┌─────────────────────────────────────────────────────┐       │
│  │            TRANSLATION DELIVERY                      │       │
│  │  • Embedded in app bundle                          │       │
│  │  • Supabase RLS for user preferences               │       │
│  │  • CDN for hot-loading new languages               │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 String Key Design

```
STRING KEY CONVENTIONS:
┌─────────────────────────────────────────────────────────────────┐
│  NAMING CONVENTIONS                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  FORMAT: {screen}.{component}.{element}.{variant}             │
│                                                                 │
│  EXAMPLES:                                                     │
│  • common.button.submit — Submit button text                   │
│  • common.button.cancel — Cancel button text                  │
│  • profile.title — Profile screen title                       │
│  • profile.stats.level — Level stat label                     │
│  • mission.daily.easy — Easy mission difficulty               │
│  • error.generic — Generic error message                     │
│  • reward.artifact.epic — Epic artifact reward label        │
│                                                                 │
│  CATEGORIES:                                                  │
│  • common.* — Shared elements (buttons, labels, errors)       │
│  • {screen}.* — Screen-specific strings                      │
│  • notification.* — Push notification content                  │
│  • bot.* — Telegram bot messages                             │
│  • event.* — Event-specific content                          │
│  • historical.* — Historical artifact descriptions            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Pluralization Rules

```
PLURAL FORMS:
┌─────────────────────────────────────────────────────────────────┐
│  PLURAL SUPPORT                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Each language has specific plural rules:                      │
│                                                                 │
│  ENGLISH (2 forms):                                            │
│  • one: 1                                                    │
│  • other: 0, 2-999, 1000+                                   │
│                                                                 │
│  UKRAINIAN (3 forms):                                         │
│  • one: 1                                                   │
│  • few: 2-4                                                 │
│  • many: 0, 5-999, 1000+                                     │
│                                                                 │
│  POLISH (3 forms):                                           │
│  • one: 1                                                   │
│  • few: 2-4                                                 │
│  • many: 0, 5-999, 1000+                                     │
│                                                                 │
│  GERMAN (2 forms):                                            │
│  • one: 1                                                   │
│  • other: 0, 2-999, 1000+                                   │
│                                                                 │
│  FRENCH (2 forms):                                           │
│  • one: 0-1                                                 │
│  • other: 2+                                                 │
│                                                                 │
│  SPANISH (2 forms):                                          │
│  • one: 1                                                   │
│  • other: 0, 2-999, 1000+                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Translation Best Practices

```
TRANSLATION GUIDELINES:
┌─────────────────────────────────────────────────────────────────┐
│  STYLE GUIDE                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  CONSISTENCY:                                                  │
│  • Same term → Same translation throughout                    │
│  • Use glossary for ambiguous terms                           │
│  • Preserve terminology consistency                           │
│                                                                 │
│  CONTEXT:                                                     │
│  • Provide context notes for translators                       │
│  • Explain UI constraints (max characters)                    │
│  • Clarify placeholder meanings                               │
│                                                                 │
│  TONE:                                                        │
│  • Friendly but not overly casual                             │
│  • Professional but not stiff                                 │
│  • Match game's personality (time-travel, historical)          │
│                                                                 │
│  CULTURAL ADAPTATION:                                         │
│  • Idioms adapted, not literally translated                  │
│  • Examples use culturally relevant references                │
│  • Humor localized where possible                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Regional Adaptation Rules

### 3.1 Date Formatting

```
DATE FORMAT STANDARDS:
┌─────────────────────────────────────────────────────────────────┐
│  DATE FORMAT BY REGION                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  FORMAT: {day}/{month}/{year} or {year}/{month}/{day}        │
│                                                                 │
│  Ukrainian:    DD.MM.YYYY  (31.12.2026)                     │
│  English:       MM/DD/YYYY  (12/31/2026) or DD/MM/YYYY       │
│  Polish:        DD.MM.YYYY  (31.12.2026)                     │
│  German:        DD.MM.YYYY  (31.12.2026)                     │
│  Spanish:       DD/MM/YYYY  (31/12/2026)                    │
│  French:        DD/MM/YYYY  (31/12/2026)                    │
│                                                                 │
│  SHORT DATE:                                                 │
│  Ukrainian:    DD MMM    (31 груд)                            │
│  English:      MMM DD    (Dec 31)                            │
│  German:       DD. MMM   (31. Dez)                          │
│                                                                 │
│  MONTH NAMES: Full and abbreviated forms required              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Time Formatting

```
TIME FORMAT STANDARDS:
┌─────────────────────────────────────────────────────────────────┐
│  TIME FORMAT BY REGION                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  12-HOUR (US, UK, Spanish):                                   │
│  • 12:30 PM, 11:45 AM                                        │
│                                                                 │
│  24-HOUR (EU, Ukraine):                                       │
│  • 12:30, 23:45                                              │
│                                                                 │
│  DISPLAY:                                                     │
│  • Use user's Telegram locale preference as default           │
│  • Game default to 24-hour (international standard)          │
│  • Always show AM/PM when using 12-hour format               │
│                                                                 │
│  TIME ZONE:                                                  │
│  • Display in user's local timezone                           │
│  • UTC reference for server times (shown when relevant)        │
│  • Event countdowns show user's local time                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Number Formatting

```
NUMBER FORMAT STANDARDS:
┌─────────────────────────────────────────────────────────────────┐
│  NUMBER FORMAT BY REGION                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  DECIMAL SEPARATOR:                                           │
│  • Period (.): US, UK, German, Polish                         │
│  • Comma (,): French, Spanish, Ukrainian                      │
│                                                                 │
│  THOUSANDS SEPARATOR:                                         │
│  • Comma (,): US, UK, German, Polish                          │
│  • Period (.): French, Spanish, Ukrainian                      │
│  • Space ( ): Some regions                                    │
│                                                                 │
│  EXAMPLES:                                                     │
│  • US: 1,234.56                                             │
│  • German: 1.234,56                                          │
│  • French: 1 234,56                                          │
│  • Ukrainian: 1 234,56                                        │
│                                                                 │
│  GAME NUMBER FORMATTING:                                       │
│  • Always use locale-aware formatting                         │
│  • Currency: Locale-specific separators                        │
│  • Large numbers: Abbreviate (1K, 1M, 1B) for UI              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Currency Formatting

```
CURRENCY FORMAT STANDARDS:
┌─────────────────────────────────────────────────────────────────┐
│  CURRENCY DISPLAY                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  IN-GAME CURRENCIES:                                           │
│  • Chrono Coins: "1,234" or "1 234" (locale-aware)           │
│  • Chrono Dust: "500" (no decimals)                          │
│  • Time Shards: "2.5K" (abbreviated)                         │
│                                                                 │
│  REAL MONEY (if applicable):                                   │
│  • Telegram Stars: Localized price display                     │
│  • TON: "≈ $9.99" format                                     │
│  • Regional pricing shown where available                      │
│                                                                 │
│  SYMBOL PLACEMENT:                                            │
│  • Before amount: €9.99, $9.99, £9.99                       │
│  • After amount: 9,99 € (EU style)                           │
│  • Use locale-preferred style                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Telegram Bot Localization

### 4.1 Bot Language Detection

```
BOT LANGUAGE HANDLING:
┌─────────────────────────────────────────────────────────────────┐
│  LANGUAGE DETECTION FLOW                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  1. CHECK USER PREFERENCE                                      │
│     • Stored in database: user.language_preference              │
│     • If set → Use preference                                 │
│                                                                 │
│  2. CHECK TELEGRAM LOCALE                                      │
│     • Telegram User object: user.language_code                  │
│     • If supported → Use Telegram locale                       │
│                                                                 │
│  3. FALLBACK TO DEFAULT                                        │
│     • Default: English (en)                                   │
│     • Log detection method for analytics                       │
│                                                                 │
│  DETECTION PRIORITY:                                          │
│  User Preference > Telegram Locale > Default (English)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Bot Message Templates

```
BOT MESSAGE LOCALIZATION:
┌─────────────────────────────────────────────────────────────────┐
│  EXAMPLE: DAILY REWARD NOTIFICATION                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ENGLISH:                                                      │
│  🎁 Your Daily Reward is Ready!                                 │
│  Day {streak} Streak Bonus Active!                             │
│  Today's Reward: +{xp} XP, +{dust} Chrono Dust               │
│                                                                 │
│  UKRAINIAN:                                                    │
│  🎁 Ваша щоденна нагорода готова!                             │
│  Бонус серії {streak} днів активний!                          │
│  Сьогоднішня нагорода: +{xp} XP, +{dust} Chrono Dust        │
│                                                                 │
│  GERMAN:                                                       │
│  🎁 Deine tägliche Belohnung ist bereit!                       │
│  Tagesstrenen-Serienbonus {streak} aktiv!                      │
│  Heutige Belohnung: +{xp} XP, +{dust} Chrono Dust            │
│                                                                 │
│  PLURAL HANDLING:                                             │
│  EN: "{count} artifact" / "{count} artifacts"                  │
│  UK: "{count} артефакт" / "{count} артефакти" / "{count} артефактів" │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Bot Command Localization

```
BOT COMMANDS:
┌─────────────────────────────────────────────────────────────────┐
│  COMMAND HANDLING                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Commands are universal (slash commands):                       │
│  /start, /help, /profile, /settings                            │
│                                                                 │
│  Response content is localized:                                 │
│  /help → Shows help in user's language                         │
│                                                                 │
│  Dynamic command descriptions (BotFather):                     │
│  • Menu button labels localized                               │
│  • Command descriptions localized                             │
│                                                                 │
│  EXAMPLE BOT FATHER DESCRIPTIONS:                              │
│  /start — Почати гру / Start the game                        │
│  /help — Довідка / Help                                       │
│  /profile — Ваш профіль / Your profile                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Inline Keyboard Localization

```
INLINE KEYBOARD BUTTONS:
┌─────────────────────────────────────────────────────────────────┐
│  BUTTON TEXT LOCALIZATION                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Universal buttons (icons only):                               │
│  • ▶️ Continue                                                 │
│  • ⚙️ Settings                                                 │
│  • 📊 Stats                                                    │
│                                                                 │
│  Text buttons translated:                                       │
│  • "Claim Reward" → "Отримати нагороду"                       │
│  • "Continue" → "Продовжити" / "Weiter"                       │
│  • "View More" → "Дивитись більше"                           │
│                                                                 │
│  Character limits:                                              │
│  • Buttons: Max 64 characters                                  │
│  • German may need abbreviation for long words                 │
│  • Test all translations fit within button width               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Notification Localization

### 5.1 Notification Language Rules

```
NOTIFICATION LANGUAGE RULES:
┌─────────────────────────────────────────────────────────────────┐
│  LANGUAGE SELECTION                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Same detection flow as bot:                                   │
│  User Preference > Telegram Locale > Default                    │
│                                                                 │
│  Each notification sent in recipient's language:              │
│  • Player A (Ukrainian) → Ukrainian notification                │
│  • Player B (German) → German notification                     │
│                                                                 │
│  Batch notifications:                                          │
│  • Each player receives in their preferred language             │
│  • Queue respects language per recipient                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Notification Templates by Category

```
NOTIFICATION TEMPLATES:
┌─────────────────────────────────────────────────────────────────┐
│  DAILY REMINDER                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  EN: "⏰ Your Temporal Journey Awaits! Energy: {energy}"        │
│  UK: "⏰ Ваша часова подорож чекає! Енергія: {energy}"       │
│  DE: "⏰ Deine zeitliche Reise wartet! Energie: {energy}"       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  EVENT START                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  EN: "🎭 {event_name} begins! {description}"                  │
│  UK: "🎭 {event_name} розпочався! {description}"             │
│  DE: "🎭 {event_name} beginnt! {description}"                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ACHIEVEMENT UNLOCKED                                          │
│  ─────────────────────────────────────────────────────────────  │
│  EN: "🏆 Achievement Unlocked: {name}! Reward: {reward}"      │
│  UK: "🏆 Досягнення розблоковано: {name}! Нагорода: {reward}"│
│  DE: "🏆 Erfolg freigeschaltet: {name}! Belohnung: {reward}"  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 AdsGram Notification Localization

```
ADSGRAM NOTIFICATION LOCALIZATION:
┌─────────────────────────────────────────────────────────────────┐
│  REWARD NOTIFICATIONS                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ADSGRAM rewards shown in player's language:                  │
│                                                                 │
│  EN: "🎬 Watch ad → +{amount} {currency}"                     │
│  UK: "🎬 Переглянути рекламу → +{amount} {currency}"         │
│  DE: "🎬 Werbung ansehen → +{amount} {currency}"               │
│                                                                 │
│  ADSGRAM TERMS:                                               │
│  • "Watch Ad" → "Переглянути рекламу" / "Werbung ansehen"    │
│  • "Bonus Reward" → "Бонусна нагорода" / "Bonusbelohnung"    │
│  • "Double Reward Weekend" → Localized equivalent              │
│                                                                 │
│  IMPORTANT:                                                    │
│  AdsGram SDK handles ad content; only our reward text is      │
│  translated. Ad creative is provided by advertisers.           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Historical Content Localization

### 6.1 Historical Description Guidelines

```
HISTORICAL CONTENT TRANSLATION RULES:
┌─────────────────────────────────────────────────────────────────┐
│  PRINCIPLES                                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  1. MEANING PRESERVATION                                       │
│     • Historical accuracy is paramount                          │
│     • Technical terms preserved with explanation               │
│     • Dates and numbers in appropriate format                 │
│                                                                 │
│  2. EDUCATIONAL VALUE                                          │
│     • Explanations clear for non-native speakers              │
│     • Cultural context provided where needed                   │
│     • Links to further learning (localized URLs)               │
│                                                                 │
│  3. QUALITY TRANSLATION                                        │
│     • Human translation required, not machine-only             │
│     • Native speaker review for each language                 │
│     • Historical consultant review for accuracy               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Historical Content Example

```
ARTIFACT DESCRIPTION EXAMPLE:
┌─────────────────────────────────────────────────────────────────┐
│  ROSETTA STONE                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ENGLISH:                                                      │
│  "A basalt stone fragment bearing inscriptions in three         │
│  scripts: Hieroglyphic, Demotic, and Ancient Greek.            │
│  Discovered in 1799 by French soldiers, it became the key       │
│  to deciphering Egyptian hieroglyphs. Now in the British      │
│  Museum, London."                                              │
│                                                                 │
│  UKRAINIAN:                                                    │
│  "Фрагмент базальтового каменю з написами трьома мовами:     │
│  єгипетськими ієрогліфами, демотичним та давньогрецьким.     │
│  Виявлений у 1799 році французькими солдатами, він став        │
│  ключем до розшифровки єгипетських ієрогліфів. Нині           │
│  зберігається в Британському музеї в Лондоні."                │
│                                                                 │
│  GERMAN:                                                       │
│  "Ein Basaltsteinfragment mit Inschriften in drei Schriften:   │
│  Hieroglyphen, Demotisch und Altgriechisch. 1799 von           │
│  französischen Soldaten entdeckt, wurde es zum Schlüssel      │
│  zur Entzifferung ägyptischer Hieroglyphen. Heute im         │
│  British Museum, London."                                     │
│                                                                 │
│  NOTES:                                                        │
│  • Proper nouns (Rosetta Stone, British Museum) may vary     │
│  • Date format adapts to locale (1799 vs 1799)               │
│  • Historical terms explained in annotations for translators  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Cultural Adaptation Rules

```
CULTURAL CONSIDERATIONS:
┌─────────────────────────────────────────────────────────────────┐
│  DO:                                                           │
│  ─────────────────────────────────────────────────────────────  │
│  • Adapt idioms naturally (" piece of cake" → "_par")         │
│  • Use culturally appropriate examples                          │
│  • Localize currency/counting references                      │
│  • Respect cultural sensitivities in historical content       │
│                                                                 │
│  DON'T:                                                       │
│  • Literal translation of idioms                               │
│  • Anachronistic cultural references                          │
│  • Stereotypical representations                              │
│  • Omit cultural context that aids understanding              │
│                                                                 │
│  HISTORICAL CONTENT REVIEW:                                    │
│  • Each translated description reviewed by:                   │
│    - Native speaker translator                                 │
│    - History enthusiast/cultural consultant                   │
│    - Native speaker player (community review)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Missing Translation Handling

### 7.1 Fallback Strategy

```
MISSING TRANSLATION HANDLING:
┌─────────────────────────────────────────────────────────────────┐
│  FALLBACK CHAIN                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Request: Ukrainian (uk) for key "profile.title"              │
│                                                                 │
│  Resolution:                                                  │
│  1. Check: uk.profile.title → Not found                      │
│  2. Check: en.profile.title → Found ✅                        │
│  3. Return: "Profile" (English value)                        │
│  4. Log: Missing translation warning                          │
│                                                                 │
│  FALLBACK ORDER:                                              │
│  User Language → English (en) → System Default               │
│                                                                 │
│  NEVER:                                                       │
│  • Show untranslated key (profile.title)                      │
│  • Show empty string                                          │
│  • Throw error for missing translation                        │
│  • Show "null" or "undefined"                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Missing Translation Logging

```
LOGGING FRAMEWORK:
┌─────────────────────────────────────────────────────────────────┐
│  MISSING TRANSLATION LOG                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Log Entry:                                                    │
│  {                                                             │
│    "key": "uk.profile.new_feature",                          │
│    "fallback": "en",                                          │
│    "user_id": "xxx",                                         │
│    "timestamp": "2026-06-24T10:30:00Z",                      │
│    "platform": "miniapp"                                      │
│  }                                                             │
│                                                                 │
│  AGGREGATION:                                                 │
│  • Daily report of top missing keys                          │
│  • Severity based on usage frequency                          │
│  • Alert if critical keys missing                            │
│                                                                 │
│  CRITICAL KEYS (ALERT):                                       │
│  • common.error.* — Error messages                           │
│  • common.button.* — User actions                            │
│  • payment.* — Purchase related                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Development-Time Detection

```
BUILD-TIME VALIDATION:
┌─────────────────────────────────────────────────────────────────┐
│  TRANSLATION VALIDATION                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Pre-Deployment Checks:                                        │
│  ✓ All keys present in all Tier 1+ languages                 │
│  ✓ No empty string values                                     │
│  ✓ Plural forms complete for each language                    │
│  ✓ Variable placeholders match source                         │
│  ✓ Character limits respected                                  │
│                                                                 │
│  CI/CD Integration:                                            │
│  • Translation check in build pipeline                        │
│  • Block deployment if missing critical translations            │
│  • Warning (non-blocking) for non-critical misses             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Player Language Settings

### 8.1 Language Selection UI

```
LANGUAGE SETTINGS:
┌─────────────────────────────────────────────────────────────────┐
│  LANGUAGE PICKER                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  🌐 Language / Мова / Sprache / Idioma / Langue        │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ 🇺🇦 Українська                            [✓] │   │   │
│  │  ├─────────────────────────────────────────────────┤   │   │
│  │  │ 🇬🇧 English                                  [ ] │   │   │
│  │  ├─────────────────────────────────────────────────┤   │   │
│  │  │ 🇵🇱 Polski                                   [ ] │   │   │
│  │  ├─────────────────────────────────────────────────┤   │   │
│  │  │ 🇩🇪 Deutsch                                  [ ] │   │   │
│  │  ├─────────────────────────────────────────────────┤   │   │
│  │  │ 🇪🇸 Español                                 [ ] │   │   │
│  │  ├─────────────────────────────────────────────────┤   │   │
│  │  │ 🇫🇷 Français                                 [ ] │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ⓘ Changes apply immediately                          │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Language Detection Settings

```
LANGUAGE SETTINGS OPTIONS:
┌─────────────────────────────────────────────────────────────────┐
│  SETTING: AUTO-DETECT LANGUAGE                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Options:                                                      │
│  • Automatic (Recommended) — Use Telegram language            │
│  • Manual — Choose specific language                          │
│                                                                 │
│  Auto-Detect Behavior:                                         │
│  • On first login: Set to Telegram locale if supported        │
│  • If unsupported locale: Default to English                   │
│  • Show notification explaining auto-detection                │
│                                                                 │
│  Manual Override:                                              │
│  • Available in Settings at any time                         │
│  • Change takes effect immediately (no reload)               │
│  • Preview shown before confirming                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Language Preview

```
PREVIEW SYSTEM:
┌─────────────────────────────────────────────────────────────────┐
│  LANGUAGE CHANGE PREVIEW                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  When user selects new language:                                │
│                                                                 │
│  1. Show preview of key UI elements:                          │
│     • "Continue" button text                                   │
│     • "Daily Reward" label                                    │
│     • Error message example                                    │
│     • Profile title                                           │
│                                                                 │
│  2. Confirm dialog:                                           │
│     "Change language to Deutsch?"                              │
│     [Cancel] [Change Language]                                 │
│                                                                 │
│  3. Apply on confirmation:                                     │
│     • Instant UI update (no page reload)                     │
│     • Save preference to database                             │
│     • Update all subsequent requests                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Community Translation Philosophy

### 9.1 Volunteer Translation Program (Future)

```
FUTURE: COMMUNITY TRANSLATION PROGRAM
┌─────────────────────────────────────────────────────────────────┐
│  VOLUNTEER TRANSLATION SYSTEM                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Description:                                                   │
│  Allow qualified community members to contribute translations    │
│  for additional languages or improve existing translations.     │
│                                                                 │
│  Potential Features:                                           │
│  • Translation interface for approved contributors             │
│  • Suggestion/review workflow                                 │
│  • Translator profile and attribution                          │
│  • Leaderboards for community translators                      │
│  • Recognition badges for contributors                         │
│                                                                 │
│  Quality Control:                                              │
│  • All suggestions reviewed by core team or lead translator   │
│  • Native speaker verification required                        │
│  • Historical content requires expert review                   │
│  • Machine translation + human review for efficiency           │
│                                                                 │
│  Requirements:                                                 │
│  • Minimum account age (30+ days)                            │
│  • Demonstrated language proficiency                          │
│  • History knowledge (for historical content)                 │
│  • Community standing (no recent violations)                   │
│                                                                 │
│  Timeline: Phase 2+ (after launch stability)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Community Review System (Future)

```
FUTURE: COMMUNITY REVIEW SYSTEM
┌─────────────────────────────────────────────────────────────────┐
│  TRANSLATION REVIEW WORKFLOW                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Description:                                                  │
│  Allow native speakers to review and suggest improvements      │
│  to existing translations.                                      │
│                                                                 │
│  Potential Features:                                           │
│  • "Suggest Better Translation" on any text                   │
│  • Upvote/downvote suggestions                                 │
│  • Community consensus indicators                             │
│  • Quick review queue for translators                         │
│                                                                 │
│  Review Tiers:                                                │
│  • Tier 1: Typo fixes — Quick approval                       │
│  • Tier 2: Clarity improvements — Standard review            │
│  • Tier 3: Cultural adaptation — Expert review               │
│                                                                 │
│  Timeline: Phase 2+                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. AdsGram Localization

### 10.1 AdsGram Reward Text

```
ADSGRAM MESSAGE LOCALIZATION:
┌─────────────────────────────────────────────────────────────────┐
│  REWARD DESCRIPTIONS                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  All AdsGram-related text translated:                           │
│                                                                 │
│  "Watch Ad for Bonus" →                                        │
│  EN: "Watch Ad for Bonus"                                      │
│  UK: "Переглянути рекламу для бонусу"                         │
│  DE: "Werbung für Bonus ansehen"                               │
│                                                                 │
│  "Extra Daily Pack" →                                         │
│  EN: "Extra Daily Pack"                                        │
│  UK: "Додатковий щоденний пакет"                              │
│  DE: "Zusätzliches tägliches Paket"                            │
│                                                                 │
│  "Double Reward Weekend" →                                     │
│  EN: "Double Reward Weekend"                                    │
│  UK: "Вихідні з подвійною нагородою"                         │
│  DE: "Doppelte Belohnung am Wochenende"                         │
│                                                                 │
│  Note: Ad content itself is not translated (handled by AdsGram) │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Accessibility Philosophy

### 11.1 Language Accessibility

```
ACCESSIBILITY PRINCIPLES:
┌─────────────────────────────────────────────────────────────────┐
│  UNDERSTANDABLE WORLDWIDE                                       │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ✓ Simple sentence structures across all languages              │
│  ✓ Avoid idioms that don't translate                          │
│  ✓ Technical terms explained or contextualized                 │
│  ✓ Consistent terminology throughout                          │
│                                                                 │
│  READING LEVEL:                                                │
│  • Target: B1-B2 (intermediate) reading level                │
│  • Complex language only where necessary (historical content)  │
│  • Explanatory notes provided for complex terms               │
│                                                                 │
│  SCREEN READER COMPATIBILITY:                                  │
│  • All text readable by screen readers                        │
│  • No text embedded in images (use aria labels)              │
│  • Proper heading hierarchy                                    │
│  • Language attribute set correctly                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Avoid Unnecessary Complexity

```
SIMPLE LANGUAGE RULES:
┌─────────────────────────────────────────────────────────────────┐
│  TEXT SIMPLICITY                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  DO:                                                           │
│  • "Get your daily reward" instead of "Claim your daily       │
│    temporal dividend"                                          │
│  • "Energy is full" instead of "Your chronometric reserves    │
│    have reached maximum capacity"                              │
│  • "New missions available" instead of "Your quest queue    │
│    has been refreshed with new objectives"                     │
│                                                                 │
│  EXCEPTIONS (Historical Content):                             │
│  • Artifact descriptions maintain historical authenticity        │
│  • Names of historical periods/figures preserved              │
│  • Educational context maintained                              │
│                                                                 │
│  GAME PERSONALITY:                                             │
│  • Some thematic language acceptable ("Temporal Journey")      │
│  • But clarity always prioritized                             │
│  • Never confuse "thematic" with "obscure"                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Future Expansion

### 12.1 Right-to-Left Language Support

```
FUTURE: RTL LANGUAGE SUPPORT
┌─────────────────────────────────────────────────────────────────┐
│  ARABIC AND HEBREW                                              │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Description:                                                  │
│  Support for Arabic and Hebrew requires RTL (right-to-left)   │
│  interface mirroring and specialized typography.                │
│                                                                 │
│  Technical Requirements:                                       │
│  • Full RTL layout mirroring                                   │
│  • Proper text alignment and direction                        │
│  • Mirrored icons and navigation                              │
│  • RTL-aware text rendering                                    │
│  • Number formatting remains LTR                              │
│                                                                 │
│  Content Considerations:                                       │
│  • Historical content requires RTL-aware formatting            │
│  • Bidirectional text handling (English in Arabic)             │
│  • Localized dates and numbers                                 │
│                                                                 │
│  Timeline: Phase 3 (post core-language stability)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Asian Language Support

```
FUTURE: ASIAN LANGUAGE SUPPORT
┌─────────────────────────────────────────────────────────────────┐
│  CJK LANGUAGES                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Languages: Japanese (ja), Korean (ko), Chinese (zh-CN, zh-TW)│
│                                                                 │
│  Technical Requirements:                                       │
│  • Character encoding: UTF-8 (standard)                      │
│  • Font support for 10,000+ characters                        │
│  • Different line height for CJK characters                    │
│  • Proper word wrapping for CJK (no spaces)                   │
│  • Vertical text option (Japanese)                             │
│                                                                 │
│  Content Considerations:                                       │
│  • UI layout may need horizontal expansion for character width │
│  • Historical names have standard CJK forms                    │
│  • Cultural adaptation for East Asian historical references     │
│                                                                 │
│  Timeline: Phase 3+ (requires dedicated Asian localization)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 12.3 Regional Content Customization

```
FUTURE: REGIONAL CONTENT VARIANTS
┌─────────────────────────────────────────────────────────────────┐
│  REGIONAL VARIATIONS                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Description:                                                  │
│  Some content may vary by region beyond language:              │
│  • Pricing in local currency                                   │
│  • Event dates aligned to regional holidays                   │
│  • Cultural references adapted per region                      │
│  • Local partner content (future)                              │
│                                                                 │
│  Implementation:                                               │
│  • Region code (not just language)                            │
│  • Region-specific string overrides                           │
│  • Localized content managed separately                        │
│                                                                 │
│  Examples:                                                     │
│  • Spanish (Spain) vs Spanish (Latin America)                 │
│  • English (US) vs English (UK)                              │
│  • Portuguese (Brazil) vs Portuguese (Portugal)              │
│                                                                 │
│  Timeline: Phase 2+                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Technical Implementation

### 13.1 Translation File Structure

```
TRANSLATION FILE ORGANIZATION:
┌─────────────────────────────────────────────────────────────────┐
│  FILE STRUCTURE                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  /locales                                                     │
│  ├── en.json          # English (source)                       │
│  ├── uk.json          # Ukrainian                             │
│  ├── pl.json          # Polish                                │
│  ├── de.json          # German                               │
│  ├── es.json          # Spanish                              │
│  ├── fr.json          # French                               │
│  └── _meta.json       # Metadata, plural rules, etc.         │
│                                                                 │
│  NAMESPACE ORGANIZATION:                                       │
│  {                                                             │
│    "common": { ... },        // Shared UI elements            │
│    "profile": { ... },       // Profile screen                │
│    "battle": { ... },        // Battle system                 │
│    "museum": { ... },        // Museum system                  │
│    "notification": { ... },  // Push notifications            │
│    "bot": { ... },           // Telegram bot                   │
│    "event": { ... },         // Event content                  │
│    "historical": { ... },    // Artifact descriptions          │
│    "error": { ... },         // Error messages                │
│    "adsgram": { ... }        // AdsGram rewards                │
│  }                                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Runtime Translation Loading

```
LOADING STRATEGY:
┌─────────────────────────────────────────────────────────────────┐
│  TRANSLATION LOADING                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  INITIAL LOAD (App Start):                                    │
│  • User language determined                                   │
│  • Full translation bundle for user's language loaded          │
│  • Default language (English) pre-loaded                      │
│  • Size target: <100KB per language bundle                   │
│                                                                 │
│  HOT LOADING (Future):                                         │
│  • New translations loaded without app restart                 │
│  • Background download of language updates                     │
│  • CDN-backed translation files                               │
│                                                                 │
│  FALLBACK BEHAVIOR:                                           │
│  • Missing keys logged                                         │
│  • English value returned immediately                         │
│  • No UI disruption                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. Quality Assurance

### 14.1 Translation Quality Checklist

```
QA PROCESS:
┌─────────────────────────────────────────────────────────────────┐
│  TRANSLATION REVIEW                                             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  □ Native speaker review for each language                    │
│  □ Meaning preserved (not literal translation)                │
│  □ Consistent terminology with glossary                        │
│  □ Correct plural forms                                       │
│  □ Placeholder variables intact and correct                   │
│  □ Character limits respected                                  │
│  □ Cultural appropriateness verified                          │
│  □ No untranslated text remaining                              │
│  □ Historical content accuracy verified                        │
│  □ UI context applied (buttons vs paragraphs)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 In-Game Testing

```
TESTING PROCEDURES:
┌─────────────────────────────────────────────────────────────────┐
│  LOCALIZATION TESTING                                           │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  All languages tested before release:                          │
│  • Every screen in each language                               │
│  • Every notification in each language                        │
│  • Every error message in each language                      │
│  • Historical content in each language                        │
│                                                                 │
│  Common issues checked:                                         │
│  • Text overflow/clipping                                     │
│  • Truncated buttons                                          │
│  • Misaligned layouts                                          │
│  • Broken special characters                                   │
│  • Missing plural forms                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

*Language is the bridge to understanding. Build it strong, and players from every corner of the world will feel at home.*
