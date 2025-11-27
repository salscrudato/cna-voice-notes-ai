import { useEffect, useState } from 'react'
import {
  getCurrentBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  isPortrait,
  isLandscape,
  getViewportDimensions,
  type Breakpoint,
} from '../utils/responsive'

interface UseResponsiveReturn {
  breakpoint: Breakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isPortrait: boolean
  isLandscape: boolean
  width: number
  height: number
}

/**
 * Hook to track responsive breakpoints and viewport dimensions
 * Updates on window resize
 * @returns Responsive state
 */
export function useResponsive(): UseResponsiveReturn {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial values
    setBreakpoint(getCurrentBreakpoint())
    setDimensions(getViewportDimensions())

    // Handle resize
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint())
      setDimensions(getViewportDimensions())
    }

    // Add listener with debounce
    let resizeTimeout: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 150)
    }

    window.addEventListener('resize', debouncedResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return {
    breakpoint,
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isPortrait: isPortrait(),
    isLandscape: isLandscape(),
    width: dimensions.width,
    height: dimensions.height,
  }
}

