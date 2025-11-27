import React, { useState, useEffect, memo } from 'react'
import { FiArrowUp } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

const ScrollToTopButtonComponent: React.FC = () => {
  const { accentColor } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-lg hover:shadow-xl dark:hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 animate-fade-in hover:-translate-y-2 border"
          style={{
            background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
            borderColor: `${getAccentColor(accentColor, '500')}4d`,
            boxShadow: `0 0 20px ${getAccentColor(accentColor, '500')}40`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 30px ${getAccentColor(accentColor, '500')}60`
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${getAccentColor(accentColor, '500')}40`
          }}
          aria-label="Scroll to top"
          type="button"
        >
          <FiArrowUp className="w-6 h-6 transition-all duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
        </button>
      )}
    </>
  )
}

export const ScrollToTopButton = memo(ScrollToTopButtonComponent)

