// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * Firebase configuration loaded from environment variables
 * Supports both hardcoded defaults (for generic-voice project) and environment-based config
 *
 * Environment variables (optional):
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - VITE_FIREBASE_MEASUREMENT_ID
 */
function getFirebaseConfig() {
  // Default configuration for generic-voice project
  const defaultConfig = {
    apiKey: 'AIzaSyArd37qujqzU0Er5GJ6RVcUiFndTA5Dbvk',
    authDomain: 'generic-voice.firebaseapp.com',
    projectId: 'generic-voice',
    storageBucket: 'generic-voice.firebasestorage.app',
    messagingSenderId: '297339398874',
    appId: '1:297339398874:web:e6a3d9089ad4c2314913e3',
    measurementId: 'G-TXQ7DFG0XK',
  }

  // Allow environment variable overrides
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId,
  }

  // Validate required fields
  if (!firebaseConfig.projectId) {
    throw new Error('Firebase projectId is required. Set VITE_FIREBASE_PROJECT_ID or use default configuration.')
  }

  return firebaseConfig
}

const firebaseConfig = getFirebaseConfig()

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics safely (may not be available in all environments)
let analytics
try {
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app)
  }
} catch {
  // Analytics initialization is optional, silently fail
  // Error is not logged as it's expected in some environments
}

const db = getFirestore(app)
const storage = getStorage(app)

export { app, analytics, db, storage }

