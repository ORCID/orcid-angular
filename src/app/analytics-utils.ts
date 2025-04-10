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



export function removeUrlParameters(url: string) {
  return url.split('?')[0]
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
