export type Gtag = (
  command: string,
  UID: string,
  arg2: { page_path?: string }
) => void
