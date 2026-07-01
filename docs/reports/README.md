# 🏛️ Ukraine Tap

A Telegram Mini App game about Ukrainian history, where players collect artifacts through the ages.

## 🎮 Game Features

- **24 Historical Epochs**: 12 Ukrainian epochs (Trypillia to Independence) + 12 World epochs (Egypt to Meiji, unlocked via Prestige)
- **Artifact Collection**: Gather and complete artifact sets
- **Prestige System**: Reset progress for permanent bonuses
- **Expeditions**: Send heroes on archaeological missions
- **Museum System**: Display your collection
- **Daily Rewards**: Streak-based rewards system

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Auth**: Telegram Mini App SDK (HMAC validated)
- **Payments**: Telegram Stars

## 📁 Project Structure

```
├── src/
│   ├── App.tsx              # Main app component
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks (useGame)
│   ├── lib/                 # Utilities (storage, telegram)
│   ├── data/                # Game data (epochs, artifacts)
│   └── expedition/          # Expedition system
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── expedition-sync/
│   │   ├── expedition-rewards/
│   │   ├── daily-rewards/
│   │   ├── story-quests/
│   │   ├── perform-prestige/
│   │   ├── telegram-payments/
│   │   ├── claim-ad-reward/
│   │   ├── adsgram-reward/
│   │   ├── open-chest/
│   │   └── claim-offline-income/
│   └── migrations/          # Database migrations
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Telegram Bot Token
- (Optional) GitHub account for CI/CD

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Fill in your values:
# VITE_SUPABASE_URL=https://iyxhzisfwcdfhuxuqxso.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# VITE_TELEGRAM_BOT_USERNAME=YourBotName

# Start development server
npm run dev
```

### Database & Edge Functions Setup

**Option 1: GitHub Actions (Recommended)**

1. Follow [SETUP_GITHUB_SECRETS.md](./SETUP_GITHUB_SECRETS.md)
2. Connect Supabase to GitHub
3. Push to `fix/typescript-errors` → Automatic deploy!

**Option 2: Manual via Supabase Dashboard**

1. Open https://supabase.com/dashboard
2. Go to SQL Editor → Run migrations in order
3. Go to Edge Functions → Deploy each function

**Option 3: Supabase CLI (requires local setup)**

```bash
npm install -g supabase
supabase login
supabase link --project-ref iyxhzisfwcdfhuxuqxso
supabase db push
supabase functions deploy
```

## 🔒 Security

All game logic is server-authoritative:

- HMAC validation for Telegram auth
- RLS policies on all tables
- Server-side rarity rolls for chests
- Atomic currency operations
- Anti-abuse measures (cooldowns, limits)

## 📖 Documentation

- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) - Production deployment guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment documentation

## 🎨 Game Balance

| Epoch | Level Range | Generators |
|-------|-------------|------------|
| Trypillia | 1-50 | 5 |
| Scythia | 51-100 | 5 |
| Antiquity | 101-150 | 5 |
| Kyiv Rus | 151-250 | 5 |
| ... | ... | ... |
| Independence | 901-950 | 5 |

**Prestige**: Available at level 950 in Independence epoch

## 📱 Telegram Integration

1. Create bot via [@BotFather](https://t.me/BotFather)
2. Enable Mini App in Bot Settings
3. Set webhook for payments
4. Configure Telegram Stars

## 📊 Monitoring

- Supabase Dashboard: Logs, Metrics, Functions
- Edge Function Logs: Real-time execution logs
- Database: RLS policy violations

## 📄 License

MIT

---

**Version**: 1.8.0
**Build**: Production Ready ✅
