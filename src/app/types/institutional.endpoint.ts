export interface Institutional {
  entityID: string
  DisplayNames: DisplayName[]
  Descriptions: Description[]
  Logos: Logo[]
}

export interface Description {
  value: string
  lang: string
}

export interface DisplayName {
  value: string
  lang: string
}

export interface Logo {
  value: string
  height: string,
  width: string
}
