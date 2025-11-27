import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkipToContent } from './components/SkipToContent'
import { LayoutShell } from './components/LayoutShell'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ThemeProvider } from './contexts/ThemeContext'
import { LandingPage } from './pages/LandingPage'
import { SupportPage } from './pages/SupportPage'
import { UploadPage } from './pages/UploadPage'
import { useWebVitals } from './hooks/useWebVitals'
import { useServiceWorker } from './hooks/useServiceWorker'

// Lazy load pages for better code splitting
const MainChatPage = lazy(() => import('./pages/MainChatPage').then(m => ({ default: m.MainChatPage })))

// Loading fallback component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 animate-fade-in">
    <LoadingSpinner />
  </div>
)

function App() {
  // Initialize Web Vitals monitoring
  useWebVitals({ debug: false })

  // Initialize Service Worker for offline support
  useServiceWorker({ autoRegister: true, debug: false })

  return (
    <ThemeProvider>
      <LayoutShell>
        <ErrorBoundary>
          <Router>
            <SkipToContent />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/chat" element={<MainChatPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </LayoutShell>
    </ThemeProvider>
  )
}

export default App
