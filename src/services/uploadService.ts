/**
 * Upload Service
 * Handles file uploads, storage, and metadata management
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'
import type { UploadedFile, UploadedFileInput } from '../types'
import { logger } from './logger'

const UPLOADS_COLLECTION = 'uploads'
const STORAGE_BUCKET = 'uploads'

class UploadService {
  /**
   * Upload a file to Firebase Storage and create metadata in Firestore
   */
  async uploadFile(
    file: File,
    userId: string,
    fileType: 'audio' | 'document',
    tags: string[] = []
  ): Promise<UploadedFile> {
    try {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const storagePath = `${STORAGE_BUCKET}/${userId}/${fileId}/${file.name}`

      // Upload file to Firebase Storage
      logger.debug('Uploading file to storage', { filename: file.name, size: file.size })
      const storageRef = ref(storage, storagePath)
      await uploadBytes(storageRef, file)

      // Create metadata in Firestore
      const uploadedFileData: UploadedFileInput = {
        filename: fileId,
        fileType,
        mimeType: file.type,
        size: file.size,
        tags,
      }

      const docRef = await addDoc(collection(db, UPLOADS_COLLECTION), {
        ...uploadedFileData,
        userId,
        originalName: file.name,
        storagePath,
        uploadedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      logger.info('File uploaded successfully', { fileId, filename: file.name })

      return {
        id: docRef.id,
        userId,
        filename: fileId,
        originalName: file.name,
        fileType,
        mimeType: file.type,
        size: file.size,
        tags,
        uploadedAt: new Date(),
        updatedAt: new Date(),
        storagePath,
      }
    } catch (error) {
      logger.error('Error uploading file', error)

      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('cors')) {
          const corsError = new Error(
            'CORS configuration error: Firebase Storage CORS is not properly configured. ' +
            'Please run: gsutil cors set cors.json gs://generic-voice.firebasestorage.app'
          )
          logger.error('CORS Configuration Issue', corsError)
          throw corsError
        }
        if (error.message.includes('Permission denied')) {
          const permError = new Error(
            'Permission denied: Check Firebase Storage security rules and ensure your user has upload permissions.'
          )
          logger.error('Firebase Storage Permission Error', permError)
          throw permError
        }
      }

      throw error
    }
  }

  /**
   * Get all uploaded files for a user
   * Note: Sorting is done in memory to avoid requiring a composite index
   */
  async getUserFiles(userId: string): Promise<UploadedFile[]> {
    try {
      const q = query(
        collection(db, UPLOADS_COLLECTION),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(q)
      const files = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          filename: data.filename,
          originalName: data.originalName,
          fileType: data.fileType,
          mimeType: data.mimeType,
          size: data.size,
          tags: data.tags || [],
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          storagePath: data.storagePath,
          transcription: data.transcription,
          extractedText: data.extractedText,
          metadata: data.metadata,
        }
      })

      // Sort by uploadedAt in descending order (most recent first)
      return files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    } catch (error) {
      logger.error('Error fetching user files', error)
      throw error
    }
  }

  /**
   * Update file tags
   */
  async updateFileTags(fileId: string, tags: string[]): Promise<void> {
    try {
      const fileRef = doc(db, UPLOADS_COLLECTION, fileId)
      await updateDoc(fileRef, {
        tags,
        updatedAt: Timestamp.now(),
      })
      logger.info('File tags updated', { fileId })
    } catch (error) {
      logger.error('Error updating file tags', error)
      throw error
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string, storagePath: string): Promise<void> {
    try {
      // Delete from storage
      const storageRef = ref(storage, storagePath)
      await deleteObject(storageRef)

      // Delete metadata from Firestore
      await deleteDoc(doc(db, UPLOADS_COLLECTION, fileId))
      logger.info('File deleted successfully', { fileId })
    } catch (error) {
      logger.error('Error deleting file', error)
      throw error
    }
  }
}

export const uploadService = new UploadService()

