import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkipToContent } from './components/SkipToContent'
import { LayoutShell } from './components/LayoutShell'
import { ThemeManager } from './components/ThemeManager'
import { LoadingSpinner } from './components/LoadingSpinner'
import { LandingPage } from './pages/LandingPage'

// Lazy load pages for better code splitting
const MainChatPage = lazy(() => import('./pages/MainChatPage').then(m => ({ default: m.MainChatPage })))

// Loading fallback component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 animate-fade-in">
    <LoadingSpinner />
  </div>
)

function App() {
  return (
    <LayoutShell>
      <ErrorBoundary>
        <Router>
          <ThemeManager />
          <SkipToContent />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat" element={<MainChatPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </LayoutShell>
  )
}

export default App
