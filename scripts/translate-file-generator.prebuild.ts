import * as fs from 'fs'
import { parseString, Builder } from 'xml2js'
import {
  map,
  tap,
  concatAll,
  combineAll,
  mergeMap,
  switchMap,
} from 'rxjs/operators'
import { Observable } from 'rxjs/internal/Observable'
import { from } from 'rxjs/internal/observable/from'
import { of } from 'rxjs/internal/observable/of'
import { NgOrcidPropertyFolder } from './translate-file-clone.prebuild'
import { Properties } from '../src/app/types/locale.scripts'

const ngOrcidFolder = new NgOrcidPropertyFolder('./src/locale/properties')

const languages = [
  {
    code: 'en',
  },
  {
    code: 'ar',
  },
  {
    code: 'ca',
  },
  {
    code: 'cs',
  },
  {
    code: 'es',
  },
  {
    code: 'fr',
  },
  {
    code: 'it',
  },
  {
    code: 'ja',
  },
  {
    code: 'ko',
  },
  {
    code: 'lr',
  },
  {
    code: 'pt',
  },
  {
    code: 'rl',
  },
  {
    code: 'ru',
  },
  {
    code: 'uk',
  },
  {
    code: 'xx',
  },
  {
    code: 'zh_CN',
  },
  {
    code: 'zh_TW',
  },
  {
    code: 'source',
  },
]

const reportFile: {
  language: any
} = {
  language: {},
}

const stringReplacements = {
  '<br />': ' ',
  '\\u0020': '',
  '\\!': '!',
}

// Read message file
readMessageFile('./src/locale/messages.xlf')
  // For each language generate a translation file
  .pipe(
    switchMap(file =>
      from(
        languages.map(language =>
          generateLanguageFile(language.code, deepCopy(file))
        )
      )
    )
  )
  // Generate the next translation file until the last one finish
  .pipe(concatAll())
  // Save the translation file
  .pipe(
    mergeMap(result => {
      return from([
        saveTs(result.values.dynamicValues, result.saveCode),
        saveJsonAsXlf(result.values.staticValues, result.saveCode),
      ])
    })
  )
  // Waits until all translations are created
  .pipe(combineAll())
  // Save the translation log
  .pipe(mergeMap(() => saveJson(reportFile, 'translation.log')))
  // Start it all
  .subscribe()

function generateLanguageFile(saveCode, file) {
  return (
    of(ngOrcidFolder)
      .pipe(map(folder => folder.flatFolder(saveCode)))
      .pipe(
        mergeMap(properties =>
          setLanguagePropertiesToLanguageFile(file, properties, saveCode)
        )
      )
      // Return the XLF to be saved
      .pipe(
        map(val => {
          return { values: val, saveCode: saveCode }
        })
      )
      // Report success
      .pipe(
        tap(() => {
          console.log(`The langue code '${saveCode}' file was created`)
        })
      )
  )
}

function saveJsonAsXlf(json, name) {
  return from(
    new Promise((resolve, reject) => {
      const builder = new Builder()
      const xml = builder.buildObject(json)
      fs.writeFile(
        './src/locale/messages.static.' + name + '.xlf',
        xml,
        err => {
          if (err) {
            reject(err)
          }
          resolve()
        }
      )
    })
  )
}

function saveJson(json, name) {
  return from(
    new Promise((resolve, reject) => {
      fs.writeFile(
        './src/locale/messages.' + name + '.json',
        JSON.stringify(json, null, 2),
        function(err) {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  )
}

function saveTs(json, name) {
  return from(
    new Promise((resolve, reject) => {
      fs.writeFile(
        './src/locale/messages.dynamic.' + name + '.ts',
        '// prettier-ignore\n' +
          '/* tslint:disable */\n' +
          'export const LOCALE : {[key:string]: string} = ' +
          JSON.stringify(json, null, 2),
        function(err) {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  )
}

function readMessageFile(path) {
  return new Observable(observer => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        observer.error(error)
      } else {
        observer.next(data)
        observer.complete()
      }
    })
  })
}

function setLanguagePropertiesToLanguageFile(
  XlfFile,
  properties: Properties,
  languageCode
): Observable<{ staticValues: any; dynamicValues: any }> {
  return new Observable(observer => {
    const dynamicValues = {}
    // Read XLF file as a Json to
    // 1- Extract the dynamic values with the translations and save the 'dynamicValues' object
    // 2- Edit the original XLF or the 'staticValues' object  to add the translations
    parseString(XlfFile, (error, staticValues) => {
      if (error) {
        observer.error(error)
      }
      // For each translation
      staticValues.xliff.file[0].unit.forEach(element => {
        // If an id match one of the translations properties or de language code is "source"
        if (properties[element['$'].id] || languageCode === 'source') {
          let translation: string
          // languageCode 'source' use the key translation value as the text of the translation to debug translation
          if (languageCode === 'source') {
            translation = element['$'].id
          } else {
            // Runs the translation treatment where the text of some translations is modified
            translation = translationTreatment(
              properties[element['$'].id].value,
              element,
              languageCode
            )
          }
          // The translation is added to the XLF file
          element.segment[0].target = []
          element.segment[0].target.push(translation)
          // If the translation is located on i18n.pseudo.component
          // the translation is added to the dynamic translations file
          if (XLFTranslationNoteHas(element, 'location', 'i18n.pseudo')) {
            dynamicValues[element['$'].id] = translation
          }

          // If the translation is located on i18n.pseudo.component
          // the translation is added to the dynamic translations file

          if ('en' === languageCode) {
            checkIfTranslationMatch(
              element['$'].id,
              element.segment[0].target[0],
              element.segment[0].source[0]
            )
          }
          // If not any id match any of the translations properties
          // the same English template text is added as the translations
        } else {
          element.segment[0].target = element.segment[0].source
          // If the translation is located on i18n.pseudo.component
          // the translation is added to the dynamic translations file
          if (XLFTranslationNoteHas(element, 'location', 'i18n.pseudo')) {
            dynamicValues[element['$'].id] = element.segment[0].source[0]
          }

          // reports when a translation id does not match with any translation property
          translationNotFound(element['$'].id, languageCode)
        }
      })
      // return an object containing an XLF file and a JSON file with the dynamic values
      observer.next({ staticValues, dynamicValues })
      observer.complete()
    })
  })
}

function deepCopy(json) {
  return JSON.parse(JSON.stringify(json))
}

function translationNotFound(id, saveCode) {
  if (!reportFile.language[saveCode]) {
    reportFile.language[saveCode] = {}
  }
  if (!reportFile.language[saveCode].notFound) {
    reportFile.language[saveCode].notFound = []
  }
  reportFile.language[saveCode].notFound.push(id)
}

function checkIfTranslationMatch(id, target, source) {
  if (typeof source !== 'string') {
    throw new Error(
      `Translation id "${id}" is not a string. Maybe the i18n attribute is in an HTML tag with nested tags`
    )
  }
  const treatedSource = source
    .replace('\n', '')
    .replace('\r', '')
    .replace(/\s\s+/g, ' ')
    .trim()
  if (target !== treatedSource) {
    reportTranslationNotMatch(id, treatedSource, target)
  }
}

function reportTranslationNotMatch(id, textOnTemplate, textOnProperty) {
  if (!reportFile.language['en']) {
    reportFile.language['en'] = {}
  }
  if (!reportFile.language['en'].unmatch) {
    reportFile.language['en'].unmatch = []
  }
  reportFile.language['en'].unmatch.push({ id, textOnTemplate, textOnProperty })
}

function translationTreatment(translation, element, saveCode) {
  let replacement: string = JSON.parse(JSON.stringify(translation))
  // Check for hardwired replacement on the `stringReplacements` object
  Object.keys(stringReplacements).map((text, index) => {
    replacement = replacement.replace(text, stringReplacements[text])
  })
  // Check for notes to find for #upperCase #lowerCase
  if (XLFTranslationNoteHas(element, 'description', '#upperCase')) {
    replacement = replacement.toUpperCase()
  }
  if (XLFTranslationNoteHas(element, 'description', '#lowerCase')) {
    replacement = replacement.toLocaleLowerCase()
  }
  if (XLFTranslationNoteHas(element, 'description', '#titleCase')) {
    replacement = titleCase(replacement)
  }
  if (XLFTranslationNoteHas(element, 'description', '#sentenceCase')) {
    replacement = sentenceCase(replacement)
  }
  reportTranslationTreatment(
    translation,
    replacement,
    saveCode,
    element['$'].id
  )
  return replacement
}

function reportTranslationTreatment(translation, replacement, saveCode, id) {
  if (replacement !== translation) {
    if (!reportFile.language[saveCode]) {
      reportFile.language[saveCode] = {}
    }
    if (!reportFile.language[saveCode].changed) {
      reportFile.language[saveCode].changed = []
    }
    reportFile.language[saveCode].changed.push({
      id,
      translation,
      replacement,
    })
  }
}
function XLFTranslationNoteHas(element, category, content): boolean {
  const value = getXLFTranslationNote(element, category)
  if (value) {
    return value.indexOf(content) !== -1
  } else {
    return false
  }
}
function getXLFTranslationNote(element, noteCategory: string): string {
  let value
  element.notes[0].note.forEach(note => {
    if (note['$']['category'] && note['$']['category'] === noteCategory) {
      value = note['_']
    }
  })
  return value
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function sentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
