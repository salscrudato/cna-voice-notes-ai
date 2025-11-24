import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkipToContent } from './components/SkipToContent'
import { LayoutShell } from './components/LayoutShell'
import { LoadingSpinner } from './components/LoadingSpinner'
import { LandingPage } from './pages/LandingPage'

// Lazy load pages for better code splitting
const MainChatPage = lazy(() => import('./pages/MainChatPage').then(m => ({ default: m.MainChatPage })))
const ChatHistoryPage = lazy(() => import('./pages/ChatHistoryPage').then(m => ({ default: m.ChatHistoryPage })))
const AudioUploadPage = lazy(() => import('./pages/AudioUploadPage').then(m => ({ default: m.AudioUploadPage })))
const VoiceNotesPage = lazy(() => import('./pages/VoiceNotesPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-white">
    <LoadingSpinner />
  </div>
)

function App() {
  return (
    <LayoutShell>
      <ErrorBoundary>
        <Router>
          <SkipToContent />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat" element={<MainChatPage />} />
              <Route path="/history" element={<ChatHistoryPage />} />
              <Route path="/upload" element={<AudioUploadPage />} />
              <Route path="/voice-notes" element={<VoiceNotesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </LayoutShell>
  )
}

export default App
