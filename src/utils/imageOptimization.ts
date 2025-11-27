/**
 * Image optimization utilities
 * Provides helpers for lazy loading, responsive images, and WebP support
 */

/**
 * Generate responsive image srcset for different screen sizes
 * @param basePath - Base path to the image (without extension)
 * @param formats - Image formats to generate (default: ['webp', 'jpg'])
 * @returns Object with srcset and fallback src
 */
export function generateResponsiveImageSrcset(
  basePath: string,
  formats: string[] = ['webp', 'jpg']
) {
  const sizes = [320, 640, 1024, 1280, 1920]
  
  const srcsets = formats.map(format => {
    const srcset = sizes
      .map(size => `${basePath}-${size}w.${format} ${size}w`)
      .join(', ')
    return { format, srcset }
  })

  return {
    srcsets,
    fallbackSrc: `${basePath}-1024w.jpg`,
  }
}

/**
 * Check if browser supports WebP format
 * @returns Promise that resolves to true if WebP is supported
 */
export async function supportsWebP(): Promise<boolean> {
  return new Promise(resolve => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAAA'
  })
}

/**
 * Get optimal image format based on browser support
 * @returns 'webp' if supported, otherwise 'jpg'
 */
export async function getOptimalImageFormat(): Promise<'webp' | 'jpg'> {
  const webpSupported = await supportsWebP()
  return webpSupported ? 'webp' : 'jpg'
}

/**
 * Create an intersection observer for lazy loading images
 * @param callback - Function to call when element becomes visible
 * @param options - IntersectionObserver options
 * @returns IntersectionObserver instance
 */
export function createLazyLoadObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  }

  return new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry)
      }
    })
  }, defaultOptions)
}

/**
 * Calculate optimal image dimensions based on container width
 * @param containerWidth - Width of the container in pixels
 * @param aspectRatio - Aspect ratio (width/height)
 * @returns Object with width and height
 */
export function calculateImageDimensions(
  containerWidth: number,
  aspectRatio: number = 16 / 9
) {
  return {
    width: containerWidth,
    height: Math.round(containerWidth / aspectRatio),
  }
}

/**
 * Generate blur-up placeholder data URL
 * @param width - Placeholder width
 * @param height - Placeholder height
 * @param color - Placeholder color (hex)
 * @returns Data URL for placeholder image
 */
export function generatePlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#e2e8f0'
): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
  if (!canvas) return ''

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
  return canvas.toDataURL()
}

