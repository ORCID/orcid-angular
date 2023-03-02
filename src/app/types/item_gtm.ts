export type ItemGTM = {
  event: string
  label?: string
  orcid?: string
  duration?: number
  pageName?: string
  clientId?: string
  eventProps?: {
    category?: string
    action?: string
    label?: string
    value?: number
    name?: string
    page_location?: string
  }
  page?: {
    path?: string,
    location?: string
  }
}
