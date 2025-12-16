/**
 * Authentication hook
 * Currently provides a placeholder user identity.
 * TODO: Integrate with Firebase Auth or other auth provider
 */

import { useState, useEffect, useCallback } from 'react'
import { logger } from '../services/logger'

export interface User {
  id: string
  email?: string
  displayName?: string
  isAnonymous: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Placeholder user for development
const PLACEHOLDER_USER: User = {
  id: 'dev-user-001',
  email: 'dev@example.com',
  displayName: 'Development User',
  isAnonymous: true,
}

/**
 * Hook for accessing authentication state
 * @returns Authentication state and methods
 */
export function useAuth(): AuthState & { signOut: () => Promise<void> } {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate auth initialization
    // TODO: Replace with actual Firebase Auth listener
    const initAuth = async () => {
      try {
        // In development, use placeholder user
        // In production, this should check for actual auth state
        if (import.meta.env.MODE === 'development') {
          logger.debug('Using placeholder user for development')
          setUser(PLACEHOLDER_USER)
        } else {
          // Production: check for stored session or redirect to login
          logger.debug('Checking auth state...')
          // For now, still use placeholder in production
          // TODO: Implement real auth check
          setUser(PLACEHOLDER_USER)
        }
      } catch (error) {
        logger.error('Auth initialization failed', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const signOut = useCallback(async () => {
    try {
      logger.info('Signing out user')
      // TODO: Implement actual sign out
      setUser(null)
    } catch (error) {
      logger.error('Sign out failed', error)
      throw error
    }
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  }
}

/**
 * Get the current user ID
 * Throws if no user is authenticated
 */
export function useUserId(): string {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated || !user) {
    throw new Error('User is not authenticated')
  }
  
  return user.id
}

