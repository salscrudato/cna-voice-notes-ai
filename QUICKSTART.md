# Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Building

```bash
npm run build
```

## Deployment

```bash
npx firebase deploy --project generic-voice
```

Live at: https://generic-voice.web.app

## Using the Chat Interface

### Starting a Conversation

1. Click **"New Chat"** button in the sidebar
2. Type your message in the input field
3. Press **Enter** or click the **Send** button
4. Wait for the AI response

### Managing Conversations

- **View History** - All conversations appear in the left sidebar
- **Switch Conversations** - Click any conversation to load it
- **New Chat** - Click "New Chat" to start fresh

## API Integration

### Current Setup

- **Provider**: OpenAI (GPT-4o-mini)
- **Storage**: Firestore
- **API Key**: Configured in `src/services/chatService.ts`

### Changing the API Key

Set environment variable:
```bash
VITE_OPENAI_API_KEY=your-key-here
```

Or edit `src/services/chatService.ts` directly.

### Swapping Chat Providers

See `ARCHITECTURE.md` for details on implementing custom providers.

## Firestore Setup

The app automatically creates these collections:
- `conversations` - Stores conversation metadata
- `messages` - Stores all messages

No manual setup required!

## Troubleshooting

### Messages not saving?
- Check Firestore permissions in Firebase Console
- Ensure `generic-voice` project is selected

### API errors?
- Verify OpenAI API key is valid
- Check API usage limits
- Review OpenAI console for errors

### Build errors?
- Run `npm install` to ensure dependencies
- Clear `node_modules` and reinstall if needed
- Check TypeScript errors: `npm run build`

## File Structure

```
src/
├── pages/
│   └── MainChatPage.tsx      # Main chat UI
├── services/
│   └── chatService.ts        # Chat logic & Firestore
├── firebase.ts               # Firebase config
├── App.tsx                   # Router
└── index.css                 # Minimal styles
```

## Next Steps

1. ✅ Chat with OpenAI
2. ✅ Manage conversations
3. 🔄 Customize UI/styling
4. 🔄 Add authentication
5. 🔄 Implement custom providers

