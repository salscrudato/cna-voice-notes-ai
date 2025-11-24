/**
 * Voice note service for handling audio uploads and Firestore records
 * Manages Firebase Storage uploads and VoiceNote metadata persistence
 */

import { storage, db } from '../firebase'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { collection, addDoc, Timestamp, getDocs, query, doc, getDoc, updateDoc, where } from 'firebase/firestore'
import { logger } from './logger'
import { toDate } from '../utils/timestampConverter'
import type { VoiceNote, VoiceNoteStatus } from '../types'

export interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
  progress: number
}

export interface UploadResult {
  voiceNote: VoiceNote
  storagePath: string
}

class VoiceNoteService {
  private voiceNotesCollection = 'voiceNotes'

  /**
   * Upload an audio file to Firebase Storage and create a VoiceNote record
   * @param file - The audio file to upload
   * @param onProgress - Callback for upload progress updates
   * @returns Promise with the created VoiceNote and storage path
   */
  async uploadAudioFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      logger.info('Starting audio file upload', { fileName: file.name, fileSize: file.size })

      // Create storage path: voice-notes/{timestamp}_{filename}
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const storagePath = `voice-notes/${timestamp}_${sanitizedFileName}`

      // Create upload task
      const storageRef = ref(storage, storagePath)
      const uploadTask = uploadBytesResumable(storageRef, file)

      // Handle upload progress
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            }
            onProgress?.(progress)
            logger.debug('Upload progress', { progress: progress.progress })
          },
          (error) => {
            logger.error('Upload failed', error)
            reject(error)
          },
          async () => {
            try {
              // Upload completed successfully, create Firestore record
              const voiceNote = await this.createVoiceNoteRecord(file.name, storagePath)
              logger.info('Audio file uploaded successfully', { voiceNoteId: voiceNote.id })
              resolve({ voiceNote, storagePath })
            } catch (error) {
              logger.error('Failed to create voice note record', error)
              reject(error)
            }
          }
        )
      })
    } catch (error) {
      logger.error('Error uploading audio file', error)
      throw error
    }
  }

  /**
   * Create a VoiceNote record in Firestore
   * @param fileName - The name of the uploaded file
   * @param storagePath - The path in Firebase Storage
   * @returns The created VoiceNote
   */
  private async createVoiceNoteRecord(fileName: string, storagePath: string): Promise<VoiceNote> {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, this.voiceNotesCollection), {
        fileName,
        storagePath,
        status: 'uploaded',
        createdAt: now,
        updatedAt: now,
      })

      logger.info('Voice note record created', { id: docRef.id })

      return {
        id: docRef.id,
        fileName,
        storagePath,
        status: 'uploaded',
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      }
    } catch (error) {
      logger.error('Error creating voice note record', error)
      throw error
    }
  }

  /**
   * Get a voice note by ID
   * @param voiceNoteId - The ID of the voice note
   * @returns The VoiceNote or undefined if not found
   */
  async getVoiceNoteById(voiceNoteId: string): Promise<VoiceNote | undefined> {
    try {
      logger.debug('Fetching voice note', { voiceNoteId })
      const docRef = doc(db, this.voiceNotesCollection, voiceNoteId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        logger.warn('Voice note not found', { voiceNoteId })
        return undefined
      }

      const data = docSnap.data()
      return {
        id: docSnap.id,
        fileName: data.fileName || 'Unknown',
        storagePath: data.storagePath || '',
        status: (data.status || 'uploaded') as VoiceNoteStatus,
        createdAt: toDate(data.createdAt, 'voiceNote.createdAt'),
        updatedAt: toDate(data.updatedAt, 'voiceNote.updatedAt'),
        transcriptId: data.transcriptId,
        transcriptSummary: data.transcriptSummary,
        conversationId: data.conversationId,
      }
    } catch (error) {
      logger.error('Error fetching voice note', error)
      throw error
    }
  }

  /**
   * Get all voice notes for the current user
   * @returns Array of VoiceNote objects
   */
  async getAllVoiceNotes(): Promise<VoiceNote[]> {
    try {
      logger.debug('Fetching all voice notes')
      const q = query(collection(db, this.voiceNotesCollection))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          fileName: data.fileName || 'Unknown',
          storagePath: data.storagePath || '',
          status: (data.status || 'uploaded') as VoiceNoteStatus,
          createdAt: toDate(data.createdAt, 'voiceNote.createdAt'),
          updatedAt: toDate(data.updatedAt, 'voiceNote.updatedAt'),
          transcriptId: data.transcriptId,
          transcriptSummary: data.transcriptSummary,
          conversationId: data.conversationId,
        }
      })
    } catch (error) {
      logger.error('Error fetching voice notes', error)
      throw error
    }
  }

  /**
   * Link a voice note to a conversation
   * @param voiceNoteId - The ID of the voice note
   * @param conversationId - The ID of the conversation
   */
  async linkVoiceNoteToConversation(voiceNoteId: string, conversationId: string): Promise<void> {
    try {
      logger.info('Linking voice note to conversation', { voiceNoteId, conversationId })
      const docRef = doc(db, this.voiceNotesCollection, voiceNoteId)
      await updateDoc(docRef, {
        conversationId,
        updatedAt: Timestamp.now(),
      })
      logger.info('Voice note linked successfully', { voiceNoteId, conversationId })
    } catch (error) {
      logger.error('Error linking voice note to conversation', error)
      throw error
    }
  }

  /**
   * Get all voice notes linked to a conversation
   * @param conversationId - The ID of the conversation
   * @returns Array of VoiceNote objects linked to the conversation
   */
  async getVoiceNotesByConversation(conversationId: string): Promise<VoiceNote[]> {
    try {
      logger.debug('Fetching voice notes for conversation', { conversationId })
      const q = query(
        collection(db, this.voiceNotesCollection),
        where('conversationId', '==', conversationId)
      )
      const snapshot = await getDocs(q)

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          fileName: data.fileName || 'Unknown',
          storagePath: data.storagePath || '',
          status: (data.status || 'uploaded') as VoiceNoteStatus,
          createdAt: toDate(data.createdAt, 'voiceNote.createdAt'),
          updatedAt: toDate(data.updatedAt, 'voiceNote.updatedAt'),
          transcriptId: data.transcriptId,
          transcriptSummary: data.transcriptSummary,
          conversationId: data.conversationId,
        }
      })
    } catch (error) {
      logger.error('Error fetching voice notes for conversation', error)
      throw error
    }
  }

  /**
   * Update voice note status and optional transcript information
   * @param voiceNoteId - The ID of the voice note
   * @param status - The new status
   * @param partialFields - Optional additional fields to update (transcriptId, transcriptSummary)
   */
  async updateVoiceNoteStatus(
    voiceNoteId: string,
    status: VoiceNoteStatus,
    partialFields?: Partial<VoiceNote>
  ): Promise<void> {
    try {
      logger.info('Updating voice note status', { voiceNoteId, status })
      const docRef = doc(db, this.voiceNotesCollection, voiceNoteId)
      await updateDoc(docRef, {
        status,
        ...partialFields,
        updatedAt: Timestamp.now(),
      })
      logger.info('Voice note status updated', { voiceNoteId, status })
    } catch (error) {
      logger.error('Error updating voice note status', error)
      throw error
    }
  }
}

export const voiceNoteService = new VoiceNoteService()

