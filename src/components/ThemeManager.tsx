import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ThemeManager component that manages theme switching based on current route
 * 
 * Theme behavior:
 * - Landing page (/): Respects user's theme preference (light/dark)
 * - All other pages: Force light theme for ChatGPT-style appearance
 */
const ThemeManagerComponent: React.FC = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    const htmlElement = document.documentElement
    
    if (isLandingPage) {
      // Landing page: respect user preference from localStorage
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      let shouldBeDark = false
      if (savedTheme === 'dark') {
        shouldBeDark = true
      } else if (savedTheme === 'light') {
        shouldBeDark = false
      } else {
        shouldBeDark = prefersDark
      }
      
      if (shouldBeDark) {
        htmlElement.classList.add('dark')
      } else {
        htmlElement.classList.remove('dark')
      }
    } else {
      // All other pages: force light theme
      htmlElement.classList.remove('dark')
    }
  }, [isLandingPage])

  return null
}

export const ThemeManager = ThemeManagerComponent

