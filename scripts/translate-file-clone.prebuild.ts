import {
  PropertyFolder,
  Property,
  Properties,
  Files,
  Languages,
  MatchingPair,
} from '../src/app/types/locale.scripts'
import * as fs from 'fs'
const propertiesToJSON = require('properties-to-json')
const glob = require('glob')

abstract class PropertyFolderImpl implements PropertyFolder {
  constructor(
    folderPath: string,
    flatFolder = true,
    reportUnexistingFiles?: (path: string, languageCode: string) => void
  ) {
    console.log(`Read folder ${folderPath}  ________`)
    this.folderPath = folderPath
    this.reportUnexistingFiles = reportUnexistingFiles
    this.propertiesFolderToJson(folderPath, flatFolder)
  }
  static supportedLanguagesFile = [
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
  files: Files
  folderPath

  reportUnexistingFiles: (path: string, languageCode: string) => void

  /*
    Returns a list of file name strings without extension or language
  */
  abstract folderFileNames(value: string[]): string[]

  /*
    Mixes the name and the language to create the file name
  */
  abstract nameLanguageToFilename(name: string, language: string): string
  /*
    Takes a folder that should contain .properties files, and transform the folder into a .JSON object
  */
  propertiesFolderToJson(
    folderPath: string = this.folderPath,
    flatFolder: boolean
  ): PropertyFolder {
    this.files = {}
    this.folderFileNames(glob.sync(folderPath + '/**/*.properties')).map(
      (fileName: string) => {
        this.files[fileName] = {}
        PropertyFolderImpl.supportedLanguagesFile.forEach(
          (language: string) => {
            const properties = this.readFileLanguageProperties(
              fileName,
              language,
              flatFolder
            )
            if (properties) {
              this.files[fileName][language] = properties
            } else if (this.reportUnexistingFiles) {
              this.reportUnexistingFiles(fileName, language)
            }
          }
        )
      }
    )
    return this
  }

  /*
    Clone translation values from a origin PropertyFolder to this
    Compares english strings, if they match, the translations on the origin folder are copied
    It only copies the translations when there is not translation on this PropertyFolder
*/
  cloneValues(originFolder: PropertyFolderImpl): PropertyFolder {
    console.log('Clone values from properties ________')
    const matchingProperties: MatchingPair[] = this.matchingValueEnglishProperties(
      originFolder
    )
    matchingProperties.forEach(matching => {
      PropertyFolderImpl.supportedLanguagesFile.forEach(language => {
        if (language !== 'en') {
          // Creates a language node if there is no one already
          if (!this.files[matching.a.fileName][language]) {
            this.files[matching.a.fileName][language] = {}
          }
          // Creates a key node if there is no one already
          if (!this.files[matching.a.fileName][language][matching.a.key]) {
            const translation = this.getTranslationForProperty(
              originFolder,
              matching.b,
              language
            )
            // If there is a translation for the key on the language adds it
            if (translation) {
              this.files[matching.a.fileName][language][matching.a.key] = {
                key: matching.a.key,
                language: language,
                fileName: matching.a.fileName,
                value: translation,
              }
            }
          }
        }
      })
    })

    return this
  }

  private getTranslationForProperty(
    originFolder: PropertyFolder,
    originProperty: Property,
    language: string
  ): string {
    const file = originFolder.files[originProperty.fileName]
    if (file) {
      const properties = file[language]
      if (properties) {
        const property = properties[originProperty.key]
        if (property) {
          return property.value
        }
      }
    }
    return null
  }

  private matchingValueEnglishProperties(
    originFolder: PropertyFolderImpl
  ): MatchingPair[] {
    const matchingPairs: MatchingPair[] = []
    const thisFolderFlat: Properties = this.flatFolder('en')
    const originFolderFlat: Properties = this.flatFolder('en', originFolder)
    Object.keys(thisFolderFlat).forEach((thisPropertyKey: string) => {
      const thisProperty = thisFolderFlat[thisPropertyKey]
      const candidateKeys = Object.keys(originFolderFlat).filter(
        (originKey: string) => {
          return originFolderFlat[originKey].value === thisProperty.value
        }
      )
      const originPropertyKey: string = this.findTheKeyWithMostTranslations(
        candidateKeys,
        originFolder,
        thisPropertyKey
      )

      if (originPropertyKey) {
        const originProperty = originFolderFlat[originPropertyKey]
        matchingPairs.push({ a: thisProperty, b: originProperty })
      } else {
        console.warn(
          `not match for ${thisProperty.fileName}/ ${thisProperty.key}=${
            thisProperty.value
          }`
        )
      }
    })
    return matchingPairs
  }

  /*
    From a list of keys that can be used to clone it's translations
    Return the one that has translations for more languages
  */
  findTheKeyWithMostTranslations(
    candidateKeys: string[],
    originFolder: PropertyFolder,
    propertyKey: string
  ): string {
    if (candidateKeys.length === 1) {
      return candidateKeys[0]
    } else {
      // Setup a score object
      const scores = {}
      candidateKeys.forEach(key => (scores[key] = 0))

      // Adds a score point for each translation that a key has
      PropertyFolderImpl.supportedLanguagesFile.forEach(language => {
        const flatFolder = this.flatFolder(language, originFolder)

        candidateKeys.forEach(key => {
          if (flatFolder[key]) {
            scores[key]++
          }
        })
      })

      // Finds and returns the key with more translations
      let betterScoreKey = null
      // If a key with the same name exist as a candidate it gets prioritized
      // to win over other keys with the same score
      if (scores[propertyKey]) {
        betterScoreKey = propertyKey
      }
      Object.keys(scores).forEach(key => {
        if (!betterScoreKey) {
          betterScoreKey = key
        } else if (scores[betterScoreKey] < scores[key]) {
          betterScoreKey = key
        }
      })
      if (propertyKey !== betterScoreKey) {
        console.warn(`
From the many properties on Orcid Source that have the same english value of ${propertyKey}
-----${betterScoreKey} was select as it has translations for ${
          scores[betterScoreKey]
        } languages
      `)
      }
      return betterScoreKey
    }
  }

  save(dir = './tmp', flatFolder = true) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    Object.keys(this.files).forEach((fileKey: string) => {
      const languages: Languages = this.files[fileKey]
      Object.keys(languages).forEach((languageKey: string) => {
        const properties: Properties = languages[languageKey]
        const fileName = this.getPropertyFilePath(
          dir,
          fileKey,
          languageKey,
          flatFolder
        )
        let fileContent = ''
        Object.keys(properties).forEach((propertyKey: string) => {
          const property: Property = properties[propertyKey]
          fileContent += `${property.key}=${property.value}\n`
        })
        if (fileContent !== '') {
          this.writeFileSyncRecursive(fileName, fileContent)
        }
      })
    })
  }

  private readFileLanguageProperties(
    fileName: string,
    language: string,
    flatFolder: boolean
  ): void | Properties {
    const filePath = this.getPropertyFilePath(
      this.folderPath,
      fileName,
      language,
      flatFolder
    )
    try {
      const data = fs.readFileSync(filePath, { encoding: 'utf8' })
      console.warn(filePath, '- was read')
      return this.dataToProperties(data, fileName, language)
    } catch {
      console.warn(filePath, '- does not exists ')
    }
  }

  private getPropertyFilePath(
    dir: string,
    fileName: string,
    language: string,
    flatFolder = true
  ) {
    if (flatFolder) {
      return dir + '/' + this.nameLanguageToFilename(fileName, language)
    } else {
      return (
        dir +
        '/' +
        fileName +
        '/' +
        this.nameLanguageToFilename(fileName, language)
      )
    }
  }

  private writeFileSyncRecursive(
    filename,
    content,
    options = { encoding: 'utf8' }
  ) {
    // create folder path if not exists
    filename
      .split('/')
      .slice(0, -1)
      .reduce((last, folder) => {
        const folderPath = last ? last + '/' + folder : folder
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath)
        }
        return folderPath
      })

    fs.writeFileSync(filename, content, options)
  }

  private dataToProperties(data: string, fileName, language): Properties {
    const properties: Properties = {}
    const jsonData = propertiesToJSON(data)
    Object.keys(jsonData).forEach(
      key =>
        (properties[key] = {
          value: jsonData[key],
          ...{ key, fileName, language },
        })
    )
    return properties
  }

  flatFolder(
    languageToMakeFlat: string,
    folder: PropertyFolder = this
  ): Properties {
    const flatFolder: Properties = {}
    Object.keys(folder.files).forEach((fileKey: string) => {
      const languages: Languages = folder.files[fileKey]
      Object.keys(languages).forEach((languageKey: string) => {
        if (languageToMakeFlat === languageKey) {
          const properties: Properties = languages[languageKey]
          Object.keys(properties).forEach((propertyKey: string) => {
            const property: Property = properties[propertyKey]
            flatFolder[propertyKey] = property
          })
        }
      })
    })
    return flatFolder
  }

  generateTestingLanguages() {
    console.log('Generate testing languages ________')
    const testingLanguages = ['rl', 'lr', 'xx']
    Object.keys(this.files).forEach(fileName => {
      console.log('fileName', fileName)
      testingLanguages.forEach(testingLangue => {
        console.log('---testingLangue', testingLangue)
        // Create the error testing language if does not exist
        if (!this.files[fileName][testingLangue]) {
          console.log('---did not had translations file', testingLangue)

          this.files[fileName][testingLangue] = {}
        }
        Object.keys(this.files[fileName]['en']).forEach(key => {
          if (!this.files[fileName][testingLangue][key]) {
            console.log('---did not had translations for key', key)

            this.files[fileName][testingLangue][key] = {
              value: 'rl',
              language: 'rl',
              fileName: fileName,
              key: key,
            }
          }
        })
      })
    })
  }
}

export class OrcidSourcePropertyFolder extends PropertyFolderImpl {
  constructor(
    folderPath: string,
    reportUnexistingFiles?: (path: string, languageCode: string) => void
  ) {
    super(folderPath, true, reportUnexistingFiles)
  }

  nameLanguageToFilename(name, language) {
    return `${name}_${language}.properties`
  }

  folderFileNames(filenames: string[]) {
    return [
      'messages',
      'javascript',
      'admin',
      'about',
      'ng_orcid',
      'ng_orcid_search',
      'ng_orcid_signin',
      'ng_orcid_material',
    ]
  }
}

export class NgOrcidPropertyFolder extends PropertyFolderImpl {
  constructor(
    folderPath: string,
    reportUnexistingFiles?: (path: string, languageCode: string) => void
  ) {
    super(folderPath, false, reportUnexistingFiles)
  }

  nameLanguageToFilename(name, language) {
    return `${name}.${language}.properties`
  }

  folderFileNames(filenames: string[]) {
    const namesOnly = filenames
      .filter(file => file.includes('.properties'))
      .map(value => value.split('/'))
      .map(value => value.pop())
      .map(value => value.split('.'))
      .map(value => value.pop() && value)
      .map(value => value.pop() && value)
      .map(value => value.join())
    return namesOnly.filter(
      (value, index) => namesOnly.indexOf(value) === index
    )
  }
}

const args = process.argv.slice(2)
if (args.length !== 2) {
  console.error(
    '2 parameters are require: destiny folder path where translations will be added\n' +
      'and origin folder path where values are going to be copied from'
  )
} else if (!fs.readdirSync(args[0]) || !fs.readdirSync(args[1])) {
  console.error('the destiny or origin folder does no exists ')
} else {
  // Open ng orcid
  const ngOrcid = new NgOrcidPropertyFolder(args[0])
  // Open orcid source
  const orcidSource = new OrcidSourcePropertyFolder(args[1])
  // Clone values from orcid source
  ngOrcid.cloneValues(orcidSource)
  // Create rl, lr and xx testing languages
  ngOrcid.generateTestingLanguages()
  // Save generated files on a /temp folder
  ngOrcid.save('./tmp', false)
}
