export interface MaintenanceMessage {
  plainHtml: string
  closableElements: NodeListOf<Element>
  nonClosableElements: NodeListOf<Element>
}
