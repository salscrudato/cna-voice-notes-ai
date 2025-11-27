import { useEffect, useState } from 'react'
import {
  registerServiceWorker,
  isServiceWorkerActive,
  getCacheSize,
} from '../utils/serviceWorker'
import { logger } from '../services/logger'

interface UseServiceWorkerOptions {
  autoRegister?: boolean
  onUpdate?: () => void
  debug?: boolean
}

interface UseServiceWorkerReturn {
  isActive: boolean
  cacheSize: number
  isLoading: boolean
}

/**
 * Hook to manage service worker registration and offline support
 * @param options - Configuration options
 * @returns Service worker state
 */
export function useServiceWorker(
  options: UseServiceWorkerOptions = {}
): UseServiceWorkerReturn {
  const { autoRegister = true, onUpdate, debug = false } = options
  const [isActive, setIsActive] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initServiceWorker = async () => {
      try {
        if (autoRegister) {
          await registerServiceWorker({
            onSuccess: () => {
              if (debug) {
                logger.info('Service Worker registered successfully')
              }
              setIsActive(true)
            },
            onUpdate: () => {
              if (debug) {
                logger.info('Service Worker update available')
              }
              onUpdate?.()
            },
            onError: (error) => {
              if (debug) {
                logger.error('Service Worker registration failed:', error)
              }
            },
          })
        }

        // Check if service worker is already active
        setIsActive(isServiceWorkerActive())

        // Get cache size
        const size = await getCacheSize()
        setCacheSize(size)
      } catch (error) {
        if (debug) {
          logger.error('Service Worker initialization failed:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initServiceWorker()
  }, [autoRegister, onUpdate, debug])

  return { isActive, cacheSize, isLoading }
}

