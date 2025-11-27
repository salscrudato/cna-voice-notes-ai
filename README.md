# CNA Voice Notes AI

Modern conversational AI interface for underwriting conversations. Built with React 19, TypeScript, Firebase, and OpenAI GPT-4o-mini.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local and add: VITE_OPENAI_API_KEY=sk-your-key-here

# 3. Start dev server
npm run dev
# Visit http://localhost:5173
```

**Get OpenAI API Key:** https://platform.openai.com/api-keys

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Build for production
npm run lint     # Check code quality
npm run preview  # Preview production build
```

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Database:** Firebase Firestore
- **AI:** OpenAI GPT-4o-mini
- **Icons:** React Icons

## Architecture

```
src/
├── components/      # UI components (memoized)
│   ├── landing/    # Landing page sections
│   ├── ai/         # AI-specific components
│   └── ...         # Chat, sidebar, modals, etc.
├── pages/          # Route pages (lazy loaded)
├── hooks/          # Custom React hooks
├── services/       # Business logic & API
├── utils/          # Helper functions
├── types/          # TypeScript definitions
├── constants/      # App constants
└── lib/            # AI utilities
```

## Features

- **AI Chat:** GPT-4o-mini powered conversations
- **Persistence:** Firestore database storage
- **Metadata:** Auto-extracted conversation metadata
- **Dark Mode:** System-aware theme switching
- **Responsive:** Mobile and desktop optimized
- **Accessible:** ARIA labels, keyboard navigation

## Configuration

### Environment Variables

```env
# Required
VITE_OPENAI_API_KEY=sk-your-key-here

# Optional (defaults shown)
VITE_CHAT_PROVIDER=openai-direct
VITE_FIREBASE_PROJECT_ID=generic-voice
```

### Chat Providers

- **`openai-direct`** - Direct OpenAI API (development)
- **`proxied`** - Backend proxy (production recommended)

Set via `VITE_CHAT_PROVIDER` environment variable.

## Deployment

```bash
# Build
npm run build

# Deploy to Firebase
npx firebase deploy --project generic-voice
```

**Live:** https://generic-voice.web.app

## Troubleshooting

**API key errors:**
- Ensure `.env.local` exists with `VITE_OPENAI_API_KEY`
- Restart dev server after changing `.env.local`

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Firestore permissions:**
- Check Firebase Console security rules
- Verify project ID matches configuration

## Performance

- **Lazy Loading:** MainChatPage code-split
- **Memoization:** All components use React.memo
- **Optimistic UI:** Instant message updates
- **Error Boundaries:** Graceful error handling
- **Circuit Breaker:** API resilience pattern

## Development

**Prerequisites:**
- Node.js 18+
- npm 9+
- OpenAI API key
- Firebase project

**Code Quality:**
- TypeScript strict mode enabled
- ESLint configured
- All components typed
- No `any` types

**Best Practices:**
- Functional components only
- Custom hooks for logic separation
- Proper dependency arrays
- Error boundaries implemented
- Logger service for debugging
