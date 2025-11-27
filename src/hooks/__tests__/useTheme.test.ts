import { renderHook, act } from '@testing-library/react'
import { useTheme, type SeasonalTheme } from '../useTheme'

describe('useTheme Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Remove all theme classes from document
    document.documentElement.className = ''
  })

  it('should initialize with light theme by default', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(result.current.isDarkMode).toBe(false)
  })

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(localStorage.getItem('theme')).toBe('dark')
    expect(result.current.theme).toBe('dark')
  })

  it('should support all seasonal themes', () => {
    const { result } = renderHook(() => useTheme())
    const themes: SeasonalTheme[] = ['light', 'dark', 'spring', 'summer', 'fall', 'winter']

    themes.forEach((theme) => {
      act(() => {
        result.current.setTheme(theme)
      })
      expect(result.current.theme).toBe(theme)
    })
  })

  it('should toggle between light and dark themes', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
  })

  it('should apply theme class to document element', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('spring')
    })

    expect(document.documentElement.classList.contains('theme-spring')).toBe(true)
  })

  it('should set isDarkMode correctly for dark themes', () => {
    const { result } = renderHook(() => useTheme())

    const darkThemes: SeasonalTheme[] = ['dark', 'fall', 'winter']
    darkThemes.forEach((theme) => {
      act(() => {
        result.current.setTheme(theme)
      })
      expect(result.current.isDarkMode).toBe(true)
    })

    const lightThemes: SeasonalTheme[] = ['light', 'spring', 'summer']
    lightThemes.forEach((theme) => {
      act(() => {
        result.current.setTheme(theme)
      })
      expect(result.current.isDarkMode).toBe(false)
    })
  })

  it('should restore theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'summer')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('summer')
  })

  it('should provide list of available themes', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.availableThemes).toContain('light')
    expect(result.current.availableThemes).toContain('dark')
    expect(result.current.availableThemes).toContain('spring')
    expect(result.current.availableThemes).toContain('summer')
    expect(result.current.availableThemes).toContain('fall')
    expect(result.current.availableThemes).toContain('winter')
  })
})

