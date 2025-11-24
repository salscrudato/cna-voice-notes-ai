#!/usr/bin/env node

/**
 * Cleanup Script: Delete all empty conversations from Firestore
 * 
 * Usage:
 *   node cleanup-empty-chats.js
 * 
 * This script will:
 * 1. Connect to your Firebase project (generic-voice)
 * 2. Find all conversations with messageCount === 0
 * 3. Delete those conversations and their associated messages
 * 4. Report the number of conversations deleted
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || 
  path.join(process.env.HOME, '.config/firebase/generic-voice-key.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'generic-voice'
  });
} catch (error) {
  console.error('Error loading service account key. Make sure FIREBASE_SERVICE_ACCOUNT is set or the key exists at ~/.config/firebase/generic-voice-key.json');
  console.error('Error:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function cleanupEmptyConversations() {
  try {
    console.log('Starting cleanup of empty conversations...\n');

    // Get all conversations
    const conversationsRef = db.collection('conversations');
    const conversationsSnapshot = await conversationsRef.orderBy('updatedAt', 'desc').limit(1000).get();

    console.log(`Found ${conversationsSnapshot.size} conversations to check\n`);

    let deletedCount = 0;
    const emptyConversations = [];

    // Find empty conversations
    for (const doc of conversationsSnapshot.docs) {
      const data = doc.data();
      if (data.messageCount === 0) {
        emptyConversations.push({
          id: doc.id,
          title: data.title,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        });
      }
    }

    console.log(`Found ${emptyConversations.length} empty conversations to delete:\n`);

    // Delete empty conversations
    for (const conv of emptyConversations) {
      try {
        // Delete all messages for this conversation (should be none, but just in case)
        const messagesRef = db.collection('messages');
        const messagesSnapshot = await messagesRef
          .where('conversationId', '==', conv.id)
          .get();

        for (const msgDoc of messagesSnapshot.docs) {
          await msgDoc.ref.delete();
        }

        // Delete the conversation
        await conversationsRef.doc(conv.id).delete();
        deletedCount++;

        console.log(`✓ Deleted: "${conv.title}" (${conv.id})`);
      } catch (error) {
        console.error(`✗ Failed to delete "${conv.title}":`, error.message);
      }
    }

    console.log(`\n✓ Cleanup complete! Deleted ${deletedCount} empty conversations.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupEmptyConversations();

