import {
  PropertyFolder,
  Property,
  Properties,
  Files,
} from '../src/app/types/locale.scripts'
import * as fs from 'fs'
const propertiesToJSON = require('properties-to-json')

class PropertyFolderImpl implements PropertyFolder {
  files: Files

  folderPath
  supportedLanguagesFile = [
    'en',
    'ar',
    'ca',
    'cs',
    'es',
    'fr',
    'it',
    'ja',
    'ko',
    'lr',
    'pt',
    'rl',
    'ru',
    'uk',
    'xx',
    'zh_CN',
    'zh_TW',
    'source',
  ]

  constructor(folderPath: string) {
    this.folderPath = folderPath
    this.propertiesFolderToJson(folderPath)
  }

  public folderToNames(value: string[]) {
    return ['']
  }
  public nameLanguageToFilename(name: string, language: string) {
    return name + language
  }
  /*
    Takes a folder that should contain .properties files, and transform the folder into a .JSON object
  */
  propertiesFolderToJson(folderPath: string): PropertyFolder {
    this.files = {}
    this.folderToNames(fs.readdirSync(folderPath)).map((fileName: string) => {
      this.files[fileName] = {}
      this.supportedLanguagesFile.forEach((language: string) => {
        const properties = this.readFileLanguageProperties(fileName, language)
        if (properties) {
          this.files[fileName][language] = properties
        }
      })
    })
    return this
  }

  /*
    Inverse operation of propertiesFolderToJson
  */
  propertiesJsonToFolder(folderPath: string): boolean {
    return false
  }

  /* 
Clone all the values from a PropertyFolder to another when the matcher is true 
*/
  cloneValues(
    destinationFolder: PropertyFolder,
    originFolder: PropertyFolder,
    matcher: (a: Property, b: Property) => boolean
  ): PropertyFolder {
    this.files = {
      shared: {
        en: {
          keyString: {
            value: 'string',
            language: 'string',
            fileName: 'string',
          },
        },
      },
    }
    return this
  }

  readFileLanguageProperties(
    fileName: string,
    language: string
  ): void | Properties {
    const filePath =
      this.folderPath + '/' + this.nameLanguageToFilename(fileName, language)

    try {
      console.warn(filePath, '- reading file')
      const data = fs.readFileSync(filePath, { encoding: 'utf8' })
      return this.dataToProperties(data, fileName, language)
    } catch {
      console.warn(filePath, '- does not exists ')
    }
  }

  dataToProperties(data: string, fileName, language): Properties {
    const properties: Properties = {}
    const jsonData = propertiesToJSON(data)
    Object.keys(jsonData).forEach(
      key =>
        (properties[key] = { value: jsonData[key], ...{ fileName, language } })
    )
    return properties
  }
}

class OrcidSourcePropertyFolder extends PropertyFolderImpl {
  constructor(folderPath: string) {
    super(folderPath)
  }

  nameLanguageToFilename(name, language) {
    return `${name}.${language}.properties`
  }

  folderToNames(filenames: string[]) {
    const namesOnly = filenames
      .filter(file => file.includes('.properties'))
      .map(value => value.split('.'))
      .map(value => value.pop() && value)
      .map(value => value.pop() && value)
      .map(value => value.join())
    return namesOnly.filter(
      (value, index) => namesOnly.indexOf(value) === index
    )
  }
}

class NgOrcidPropertyFolder extends PropertyFolderImpl {
  constructor(folderPath: string) {
    super(folderPath)
  }

  nameLanguageToFilename(name, language) {
    return `${name}_${language}.properties`
  }

  folderToNames(filenames: string[]) {
    const namesOnly = filenames
      .filter(file => file.includes('.properties'))
      .map(value => value.split('.'))
      .map(value => value.pop() && value)
      .map(value => value.pop() && value)
      .map(value => value.join())
    return namesOnly.filter(
      (value, index) => namesOnly.indexOf(value) === index
    )
  }
}

const ngOrcid = new OrcidSourcePropertyFolder(
  'D:/workspace/orcid-angular/src/locale/properties'
)

const orcidSource = new NgOrcidPropertyFolder(
  'D:/workspace/ORCID-Source/orcid-core/src/main/resources/i18n'
)

console.log(orcidSource.files)
console.log(ngOrcid.files)
