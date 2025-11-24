/**
 * Browser-based cleanup script for empty conversations
 * 
 * Usage in browser console:
 *   import { cleanupEmptyChats } from './scripts/cleanupEmptyChats'
 *   await cleanupEmptyChats()
 */

import { db } from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, limit } from 'firebase/firestore'

export async function cleanupEmptyChats(): Promise<number> {
  try {
    console.log('🧹 Starting cleanup of empty conversations...\n')

    // Get all conversations
    const conversationsRef = collection(db, 'conversations')
    const q = query(conversationsRef, orderBy('updatedAt', 'desc'), limit(1000))
    const conversationsSnapshot = await getDocs(q)

    console.log(`Found ${conversationsSnapshot.size} conversations to check\n`)

    let deletedCount = 0
    const emptyConversations: Array<{ id: string; title: string; createdAt: Date }> = []

    // Find empty conversations
    for (const docSnap of conversationsSnapshot.docs) {
      const data = docSnap.data()
      if (data.messageCount === 0) {
        emptyConversations.push({
          id: docSnap.id,
          title: data.title,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        })
      }
    }

    console.log(`Found ${emptyConversations.length} empty conversations to delete:\n`)

    // Delete empty conversations
    for (const conv of emptyConversations) {
      try {
        // Delete all messages for this conversation (should be none, but just in case)
        const messagesRef = collection(db, 'messages')
        const messagesQuery = query(messagesRef, where('conversationId', '==', conv.id))
        const messagesSnapshot = await getDocs(messagesQuery)

        for (const msgDoc of messagesSnapshot.docs) {
          await deleteDoc(msgDoc.ref)
        }

        // Delete the conversation
        await deleteDoc(doc(db, 'conversations', conv.id))
        deletedCount++

        console.log(`✓ Deleted: "${conv.title}" (${conv.id})`)
      } catch (error) {
        console.error(`✗ Failed to delete "${conv.title}":`, error)
      }
    }

    console.log(`\n✓ Cleanup complete! Deleted ${deletedCount} empty conversations.`)
    return deletedCount
  } catch (error) {
    console.error('Error during cleanup:', error)
    throw error
  }
}

