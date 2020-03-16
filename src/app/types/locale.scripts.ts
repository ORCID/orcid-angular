export interface Property {
  value: string
  language: string
  fileName: string
  key: string
}

export interface Properties {
  [propertyKey: string]: Property
}

export interface Languages {
  [language: string]: Properties
}

export interface Files {
  [fileName: string]: Languages
}

export interface PropertyFolder {
  files?: Files
  propertiesFolderToJson: (path: string) => PropertyFolder
  save: (dir) => void
  cloneValues: (originFolder: PropertyFolder) => PropertyFolder
}

export interface MatchingPair {
  a: Property
  b: Property
}
