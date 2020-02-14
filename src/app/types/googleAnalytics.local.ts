export type Gtag = (
  command: string,
  UID: string,
  arg2: {
    page_path?: string
    page_location?: string
    anonymize_ip?: boolean
    sample_rate: string
  }
) => void
