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
      className="absolute top-0 left-0 -translate-y-full focus:translate-y-0 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 text-white px-4 py-2 rounded-b-lg font-semibold transition-all duration-200 z-50 shadow-lg dark:shadow-lg dark:shadow-blue-500/20 hover:shadow-xl dark:hover:shadow-xl focus:shadow-xl dark:focus:shadow-xl focus:-translate-y-0 focus:scale-105 dark:hover:shadow-blue-500/30 dark:focus:shadow-blue-500/30"
    >
      Skip to main content
    </a>
  )
}

export const SkipToContent = memo(SkipToContentComponent)

