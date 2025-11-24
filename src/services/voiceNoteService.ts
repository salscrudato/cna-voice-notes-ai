/**
 * Voice note service for handling audio uploads and Firestore records
 * Manages Firebase Storage uploads and VoiceNote metadata persistence
 */

import { storage, db } from '../firebase'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { logger } from './logger'
import type { VoiceNote } from '../types'

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
}

export const voiceNoteService = new VoiceNoteService()

