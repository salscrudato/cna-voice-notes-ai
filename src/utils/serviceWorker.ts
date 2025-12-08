/**
 * Service Worker registration and management
 */

export interface ServiceWorkerOptions {
  onUpdate?: () => void
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Register service worker for offline support
 * @param options - Configuration options
 */
export async function registerServiceWorker(
  options: ServiceWorkerOptions = {}
): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.debug('Service Workers not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.debug('Service Worker registered successfully')
    options.onSuccess?.()

    // Check for updates periodically
    setInterval(() => {
      registration.update()
    }, 60000) // Check every minute

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker is ready
          console.debug('New Service Worker available')
          options.onUpdate?.()
        }
      })
    })

    return registration
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Service Worker registration failed:', err)
    options.onError?.(err)
    return null
  }
}

/** Check if service worker is active */
export function isServiceWorkerActive(): boolean {
  return (
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller !== null
  )
}

/** Get cache size */
export async function getCacheSize(): Promise<number> {
  if (!('caches' in window)) return 0

  try {
    const cacheNames = await caches.keys()
    let totalSize = 0

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      for (const request of keys) {
        const response = await cache.match(request)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }
    }

    return totalSize
  } catch (error) {
    console.error('Failed to get cache size:', error)
    return 0
  }
}
