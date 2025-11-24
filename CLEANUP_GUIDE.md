# Cleanup Guide: Empty Conversations

This guide explains how to delete empty conversations (conversations with no messages) from your Firestore database.

## Why Clean Up Empty Conversations?

- **Reduces clutter**: Keeps your conversation history clean
- **Saves storage**: Removes unused conversation documents
- **Improves performance**: Fewer documents to query and load
- **Better UX**: Users only see conversations with actual content

## Automatic Prevention

The application now **prevents saving empty conversations**:
- Conversations are only created when a user sends their first message
- Empty conversations created during initialization are automatically cleaned up
- Conversation titles are generated from the first message (first 50 characters)

## Manual Cleanup Methods

### Method 1: Node.js Script (Recommended for Production)

**Prerequisites:**
- Node.js installed
- Firebase Admin SDK credentials

**Setup:**
```bash
# Install dependencies
npm install firebase-admin

# Set up service account key
# Option A: Set environment variable
export FIREBASE_SERVICE_ACCOUNT=/path/to/generic-voice-key.json

# Option B: Place key at default location
mkdir -p ~/.config/firebase
cp your-service-account-key.json ~/.config/firebase/generic-voice-key.json
```

**Run cleanup:**
```bash
node cleanup-empty-chats.js
```

**Output:**
```
🧹 Starting cleanup of empty conversations...

Found 50 conversations to check

Found 12 empty conversations to delete:

✓ Deleted: "Chat 11/24/2025" (conv_123)
✓ Deleted: "Chat 11/23/2025" (conv_456)
...

✓ Cleanup complete! Deleted 12 empty conversations.
```

### Method 2: Browser Console (Quick Testing)

**Steps:**
1. Open your app at https://generic-voice.web.app
2. Open browser DevTools (F12 or Cmd+Option+I)
3. Go to Console tab
4. Run:
```javascript
import { cleanupEmptyChats } from './src/scripts/cleanupEmptyChats.ts'
await cleanupEmptyChats()
```

### Method 3: Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select `generic-voice` project
3. Go to Firestore Database
4. Find conversations with `messageCount === 0`
5. Delete them manually

## Firestore Rules

To prevent accidental deletion, consider adding these Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow deleting conversations with no messages
    match /conversations/{conversationId} {
      allow delete: if resource.data.messageCount == 0;
    }
  }
}
```

## Scheduling Automatic Cleanup

To run cleanup automatically, use Firebase Cloud Functions:

```typescript
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const cleanupEmptyConversations = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore()
    const conversationsRef = db.collection('conversations')
    const snapshot = await conversationsRef
      .where('messageCount', '==', 0)
      .get()

    let deletedCount = 0
    for (const doc of snapshot.docs) {
      await doc.ref.delete()
      deletedCount++
    }

    console.log(`Deleted ${deletedCount} empty conversations`)
  })
```

## Troubleshooting

**Error: "Service account key not found"**
- Make sure your Firebase service account key is in the correct location
- Or set the `FIREBASE_SERVICE_ACCOUNT` environment variable

**Error: "Permission denied"**
- Check your Firestore security rules
- Ensure your service account has appropriate permissions

**Script runs but deletes nothing**
- All conversations have messages (no empty ones to delete)
- This is actually good! Your database is clean.

