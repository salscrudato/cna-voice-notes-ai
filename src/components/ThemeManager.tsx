import React from 'react'

/**
 * ThemeManager component - now a no-op since useTheme hook handles all theme management
 *
 * Theme behavior:
 * - Landing page (/): Respects user's theme preference (light/dark)
 * - Chat pages (/chat): Respects user's theme preference (light/dark) - allows toggling
 * - All other pages: Respects user's theme preference
 *
 * The useTheme hook handles all theme application to the DOM
 */
const ThemeManagerComponent: React.FC = () => {
  // Theme is managed entirely by the useTheme hook in LayoutShell and other components
  return null
}

export const ThemeManager = ThemeManagerComponent

