// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyArd37qujqzU0Er5GJ6RVcUiFndTA5Dbvk',
  authDomain: 'generic-voice.firebaseapp.com',
  projectId: 'generic-voice',
  storageBucket: 'generic-voice.firebasestorage.app',
  messagingSenderId: '297339398874',
  appId: '1:297339398874:web:e6a3d9089ad4c2314913e3',
  measurementId: 'G-TXQ7DFG0XK',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export { app, analytics, db }

