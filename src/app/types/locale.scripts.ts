export interface Property {
  value: string
  language: string
  fileName: string
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
  propertiesJsonToFolder: (path: string) => boolean
  cloneValues: (
    destinationFolder: PropertyFolder,
    originFolder: PropertyFolder,
    matcher: (a: Property, b: Property) => boolean
  ) => PropertyFolder
}
