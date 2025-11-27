/**
 * Accessibility utilities
 * Provides helpers for WCAG 2.1 AA compliance and accessible interactions
 */

/**
 * Generate unique ID for accessibility attributes
 * @param prefix - Prefix for the ID
 * @returns Unique ID
 */
export function generateAccessibilityId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if element is visible to screen readers
 * @param element - DOM element to check
 * @returns true if element is visible
 */
export function isAccessibilityVisible(element: HTMLElement): boolean {
  if (!element) return false

  const style = window.getComputedStyle(element)
  const ariaHidden = element.getAttribute('aria-hidden')

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    ariaHidden !== 'true'
  )
}

/**
 * Announce message to screen readers
 * @param message - Message to announce
 * @param priority - Announcement priority ('polite' or 'assertive')
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus element with optional scroll
 * @param element - Element to focus
 * @param smooth - Whether to scroll smoothly
 */
export function focusElement(element: HTMLElement, smooth: boolean = true): void {
  if (!element) return

  element.focus({ preventScroll: !smooth })

  if (smooth) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/**
 * Get focus trap boundaries
 * @param container - Container element
 * @returns First and last focusable elements
 */
export function getFocusTrapBoundaries(
  container: HTMLElement
): { first: HTMLElement | null; last: HTMLElement | null } {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  const focusableElements = container.querySelectorAll(focusableSelectors)

  return {
    first: focusableElements[0] as HTMLElement,
    last: focusableElements[focusableElements.length - 1] as HTMLElement,
  }
}

/**
 * Check if keyboard event is Enter or Space
 * @param event - Keyboard event
 * @returns true if Enter or Space
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' || event.key === ' '
}

/**
 * Check if keyboard event is Escape
 * @param event - Keyboard event
 * @returns true if Escape
 */
export function isEscapeKey(event: KeyboardEvent): boolean {
  return event.key === 'Escape'
}

/**
 * Check if keyboard event is Arrow key
 * @param event - Keyboard event
 * @returns Arrow direction or null
 */
export function getArrowKeyDirection(
  event: KeyboardEvent
): 'up' | 'down' | 'left' | 'right' | null {
  switch (event.key) {
    case 'ArrowUp':
      return 'up'
    case 'ArrowDown':
      return 'down'
    case 'ArrowLeft':
      return 'left'
    case 'ArrowRight':
      return 'right'
    default:
      return null
  }
}

/**
 * Get ARIA label for button
 * @param text - Button text
 * @param description - Optional description
 * @returns ARIA label
 */
export function getButtonAriaLabel(text: string, description?: string): string {
  return description ? `${text}. ${description}` : text
}

/**
 * Check if element has focus visible
 * @param element - Element to check
 * @returns true if element has focus visible
 */
export function hasFocusVisible(element: HTMLElement): boolean {
  return element.matches(':focus-visible')
}

