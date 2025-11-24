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
      className="absolute top-0 left-0 -translate-y-full focus:translate-y-0 bg-blue-600 text-white px-4 py-2 rounded-b-lg font-semibold transition-transform duration-200 z-50"
    >
      Skip to main content
    </a>
  )
}

export const SkipToContent = memo(SkipToContentComponent)

