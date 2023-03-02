import { RequestInfoForm } from './types'
import { PerformanceMarks } from './constants'

export const browserGlobals = {
  windowRef(): any {
    return window
  },
  documentRef(): any {
    return document
  },
}

export function reportNavigationStart(url: string) {
  startPerformanceMeasurement(url)
}

export function removeUrlParameters(url: string) {
  return url.split('?')[0]
}

export function startPerformanceMeasurement(url: string): void {
  if (window.performance) {
    window.performance.mark(PerformanceMarks.navigationStartPrefix + url)
  }
}

export function finishPerformanceMeasurement(url: string): number | void {
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
    clearPerformanceMarks(url)
    return timeForNavigation
  }
}

export function clearPerformanceMarks(url: string) {
  if (window.performance) {
    window.performance.clearMarks(PerformanceMarks.navigationStartPrefix + url)
    window.performance.clearMarks(PerformanceMarks.navigationEndPrefix + url)
    window.performance.clearMeasures(url)
  }
}

export function buildClientString(request: RequestInfoForm) {
  return request.memberName + ' - ' + request.clientName
}

export function getDataLayer(): any[] {
  const window = browserGlobals.windowRef()
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

export function pushOnDataLayer(object: Object): void {
  const dataLayer = getDataLayer()
  dataLayer.push(object)
}
