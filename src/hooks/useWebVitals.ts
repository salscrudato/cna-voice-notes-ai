import { useEffect } from 'react'
import { initWebVitals, reportWebVitals, type WebVitalsMetric } from '../utils/webVitals'
import { logger } from '../services/logger'

interface UseWebVitalsOptions {
  endpoint?: string
  onMetric?: (metric: WebVitalsMetric) => void
  debug?: boolean
}

/**
 * Hook to initialize and track Web Vitals
 * @param options - Configuration options
 */
export function useWebVitals(options: UseWebVitalsOptions = {}): void {
  const { endpoint, onMetric, debug = false } = options

  useEffect(() => {
    const handleMetric = async (metric: WebVitalsMetric) => {
      if (debug) {
        logger.info(`Web Vital: ${metric.name} = ${metric.value.toFixed(2)}ms (${metric.rating})`)
      }

      // Call custom callback if provided
      onMetric?.(metric)

      // Report to endpoint if provided
      if (endpoint) {
        await reportWebVitals(metric, endpoint)
      }
    }

    initWebVitals(handleMetric)
  }, [endpoint, onMetric, debug])
}

