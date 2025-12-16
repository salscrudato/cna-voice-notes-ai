import React, { memo } from 'react'

const SkipToContentComponent: React.FC = () => {
  const handleSkip = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="absolute top-0 left-0 -translate-y-full focus:translate-y-0 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-6 py-3 rounded-b-lg font-semibold transition-all duration-200 z-50 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
    >
      Skip to main content
    </a>
  )
}

export const SkipToContent = memo(SkipToContentComponent)

