/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals: LCP, FID, CLS, TTFB, INP
 */

export interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
}

export interface WebVitalsReport {
  lcp?: WebVitalsMetric
  fid?: WebVitalsMetric
  cls?: WebVitalsMetric
  ttfb?: WebVitalsMetric
  inp?: WebVitalsMetric
  timestamp: number
}

// Thresholds for Core Web Vitals (in milliseconds or unitless)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 600, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

/**
 * Determine rating based on metric value and thresholds
 */
function getRating(
  metricName: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS]
  if (!threshold) return 'needs-improvement'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Initialize Web Vitals monitoring
 * @param onMetric - Callback function when a metric is recorded
 */
export function initWebVitals(onMetric?: (metric: WebVitalsMetric) => void): void {
  if (typeof window === 'undefined') return

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        const value = lastEntry.renderTime || lastEntry.loadTime || 0
        const metric: WebVitalsMetric = {
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: 0,
          id: `lcp-${Date.now()}`,
          navigationType: performance.navigation?.type.toString() || 'navigate',
        }
        onMetric?.(metric)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.debug('LCP observer not supported')
    }

    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        const metric: WebVitalsMetric = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: 0,
          id: `cls-${Date.now()}`,
          navigationType: performance.navigation?.type.toString() || 'navigate',
        }
        onMetric?.(metric)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.debug('CLS observer not supported')
    }

    // Interaction to Next Paint (INP)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const maxDuration = Math.max(...entries.map((e: any) => e.duration))
        const metric: WebVitalsMetric = {
          name: 'INP',
          value: maxDuration,
          rating: getRating('INP', maxDuration),
          delta: 0,
          id: `inp-${Date.now()}`,
          navigationType: performance.navigation?.type.toString() || 'navigate',
        }
        onMetric?.(metric)
      })
      inpObserver.observe({ entryTypes: ['event'] })
    } catch (e) {
      console.debug('INP observer not supported')
    }
  }

  // Time to First Byte (TTFB)
  if (performance.timing) {
    const ttfb = performance.timing.responseStart - performance.timing.navigationStart
    const metric: WebVitalsMetric = {
      name: 'TTFB',
      value: ttfb,
      rating: getRating('TTFB', ttfb),
      delta: 0,
      id: `ttfb-${Date.now()}`,
      navigationType: performance.navigation?.type.toString() || 'navigate',
    }
    onMetric?.(metric)
  }
}

/**
 * Send Web Vitals data to analytics service
 * @param metric - The metric to report
 * @param endpoint - Analytics endpoint URL
 */
export async function reportWebVitals(
  metric: WebVitalsMetric,
  endpoint: string
): Promise<void> {
  try {
    // Use sendBeacon for reliability (won't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(metric))
    } else {
      // Fallback to fetch
      await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(metric),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      })
    }
  } catch (error) {
    console.debug('Failed to report Web Vitals:', error)
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): WebVitalsReport {
  const report: WebVitalsReport = {
    timestamp: Date.now(),
  }

  if (performance.timing) {
    const timing = performance.timing
    report.ttfb = {
      name: 'TTFB',
      value: timing.responseStart - timing.navigationStart,
      rating: getRating('TTFB', timing.responseStart - timing.navigationStart),
      delta: 0,
      id: `ttfb-${Date.now()}`,
      navigationType: performance.navigation?.type.toString() || 'navigate',
    }
  }

  return report
}

