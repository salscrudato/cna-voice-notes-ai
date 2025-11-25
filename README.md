# CNA Voice Notes AI Workbench

A modern, ChatGPT-like conversational AI interface for underwriting conversations.

## Quick Start (2 minutes)

### 1. Get Your OpenAI API Key
- Go to https://platform.openai.com/api-keys
- Create a new secret key
- Copy it (starts with `sk-`)

### 2. Configure Environment
```bash
# macOS/Linux
./setup.sh

# Windows
setup.bat

# Or manually:
cp .env.example .env.local
# Edit .env.local and paste your API key
```

### 3. Start the App
```bash
npm run dev
# Visit http://localhost:5174
```

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase Firestore
- **AI**: OpenAI GPT-4o-mini (fast, cheap, smart)
- **Icons**: React Icons

## Model: GPT-4o-mini

- **Fast**: Responds in seconds
- **Cheap**: ~$0.00015 per 1K input tokens
- **Smart**: High-quality responses
- **Reliable**: 99.9% uptime

## Architecture

```
src/
├── components/         # Reusable UI components (all memoized)
│   ├── landing/       # Landing page sub-components
│   ├── ChatHeader.tsx
│   ├── ChatInput.tsx
│   ├── ChatMessages.tsx
│   ├── ChatSidebar.tsx
│   └── ... (13 total)
├── pages/             # Page components (lazy loaded)
│   ├── LandingPage.tsx
│   ├── MainChatPage.tsx
│   └── ChatHistoryPage.tsx
├── hooks/             # Custom React hooks (5 files)
├── services/          # Business logic & API (3 files)
├── utils/             # Utility functions (8 files)
├── types/             # TypeScript definitions
├── constants/         # App-wide constants
├── firebase.ts        # Firebase configuration
├── App.tsx            # Router setup
└── index.css          # Global styles & animations
```

## Features

- **Conversational AI**: Chat with GPT-4o-mini powered by OpenAI
- **Chat History**: Browse and manage previous conversations
- **Firestore Persistence**: All conversations saved to Firebase
- **Modern UI**: ChatGPT-like interface with smooth animations
- **Responsive Design**: Works on desktop and mobile
```
