import React, { useEffect, useRef, useState, memo } from 'react'
import { createLazyLoadObserver } from '../utils/imageOptimization'

interface LazyImageProps {
  src: string
  alt: string
  srcSet?: string
  sizes?: string
  placeholder?: string
  width?: number
  height?: number
  className?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * Lazy-loaded image component with blur-up effect
 * Loads images only when they become visible in the viewport
 */
const LazyImageComponent: React.FC<LazyImageProps> = ({
  src,
  alt,
  srcSet,
  sizes,
  placeholder,
  width,
  height,
  className = '',
  onLoad,
  onError,
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder)

  useEffect(() => {
    const observer = createLazyLoadObserver(
      (entry) => {
        const img = entry.target as HTMLImageElement
        setImageSrc(img.dataset.src || src)
        observer.unobserve(img)
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      imgRef.current.dataset.src = src
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    onError?.()
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-75'} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  )
}

export const LazyImage = memo(LazyImageComponent)

