/**
 * Responsive design utilities
 * Provides helpers for responsive layouts and mobile-first design
 */

// Breakpoints matching Tailwind CSS
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Check if viewport width matches or exceeds breakpoint
 * @param breakpoint - Breakpoint to check
 * @returns true if viewport width >= breakpoint
 */
export function isBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= BREAKPOINTS[breakpoint]
}

/**
 * Get current breakpoint
 * @returns Current breakpoint name
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'xs'

  const width = window.innerWidth
  const breakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']

  for (const bp of breakpoints) {
    if (width >= BREAKPOINTS[bp]) {
      return bp
    }
  }

  return 'xs'
}

/**
 * Check if device is mobile
 * @returns true if viewport width < md (768px)
 */
export function isMobile(): boolean {
  return !isBreakpoint('md')
}

/**
 * Check if device is tablet
 * @returns true if viewport width >= md and < lg
 */
export function isTablet(): boolean {
  return isBreakpoint('md') && !isBreakpoint('lg')
}

/**
 * Check if device is desktop
 * @returns true if viewport width >= lg
 */
export function isDesktop(): boolean {
  return isBreakpoint('lg')
}

/**
 * Get touch target size (minimum 44x44px for accessibility)
 * @returns Touch target size in pixels
 */
export function getTouchTargetSize(): number {
  return 44
}

/**
 * Get safe area insets for notched devices
 * @returns Safe area insets
 */
export function getSafeAreaInsets(): {
  top: number
  right: number
  bottom: number
  left: number
} {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  const style = getComputedStyle(document.documentElement)
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
  }
}

/**
 * Get viewport dimensions
 * @returns Viewport width and height
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

/**
 * Check if viewport is in portrait orientation
 * @returns true if height > width
 */
export function isPortrait(): boolean {
  if (typeof window === 'undefined') return true
  return window.innerHeight > window.innerWidth
}

/**
 * Check if viewport is in landscape orientation
 * @returns true if width > height
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth > window.innerHeight
}

