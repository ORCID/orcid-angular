import { RequestInfoForm } from './types'
import { PerformanceMarks } from './constants'

export function removeUrlParameters(url: string) {
  return url.split('?')[0]
}

export function startPerformanceMeasurement(url: string, window: Window): void {
  if (window.performance) {
    window.performance.mark(PerformanceMarks.navigationStartPrefix + url)
  }
}

export function finishPerformanceMeasurement(
  url: string,
  window: Window
): number | void {
  if (window.performance) {
    window.performance.mark(PerformanceMarks.navigationEndPrefix + url)
    let timeForNavigation
    window.performance.measure(
      url,
      PerformanceMarks.navigationStartPrefix + url,
      PerformanceMarks.navigationEndPrefix + url
    )
    window.performance.getEntriesByName(url).forEach((value) => {
      timeForNavigation = value.duration
    })
    clearPerformanceMarks(url, window)
    return timeForNavigation
  }
}

export function clearPerformanceMarks(url: string, window: Window) {
  if (window.performance) {
    window.performance.clearMarks(PerformanceMarks.navigationStartPrefix + url)
    window.performance.clearMarks(PerformanceMarks.navigationEndPrefix + url)
    window.performance.clearMeasures(url)
  }
}

export function buildClientString(request: RequestInfoForm) {
  return request.memberName + ' - ' + request.clientName
}
