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
import { Properties } from '../src/app/types/locale.scripts'
import { NgOrcidPropertyFolder } from './properties-folder-manager'

const reportFile: {
  language: any
} = {
  language: {},
}

// Add language empty objects to always keep the same order
NgOrcidPropertyFolder.supportedLanguagesFile.map((language) => {
  reportFile.language[language] = {}
})

// Read the base folder
const ngOrcidFolder = new NgOrcidPropertyFolder(
  './src/locale/properties',
  reportUnexistingFiles
)

// List of strings that will be replace on when translations are move from the properties to the xlf files
const stringReplacements = {
  '<br />': ' ',
  '\\u0020': '',
  '\\!': '!',
}

// Read the angular generated XLF message file
readMessageFile('./src/locale/messages.xlf')
  // For each language generate a translation file
  .pipe(
    switchMap((file) =>
      from(
        NgOrcidPropertyFolder.supportedLanguagesFile.map((language) => {
          return generateLanguageFile(language, deepCopy(file))
        })
      )
    )
  )
  // Generate the next translation file until the last one finish
  .pipe(concatAll())
  // Save the translation file
  .pipe(
    mergeMap((result) => {
      return from([saveJsonAsXlf(result.file, result.saveCode)])
    })
  )
  // Waits until all translations are created
  .pipe(combineAll())
  // Save the translation log
  .pipe(
    mergeMap(() => saveJson(reportFile, 'translation.log')),
    tap((reportFile: any) => {
      const unmatch = reportFile?.language?.en?.unmatch
      const notFound = reportFile?.language?.en?.notFound
      if (unmatch || notFound) {
        console.warn(
          'Unmatch or/and notFound properties on the source english files'
        )
        console.warn({ unmatch, notFound })
      }
    })
  )
  // Start it all
  .subscribe()

function generateLanguageFile(saveCode, file) {
  return (
    of(ngOrcidFolder)
      .pipe(map((folder) => folder.flatFolder(saveCode)))
      .pipe(
        mergeMap((properties) =>
          setLanguagePropertiesToLanguageFile(file, properties, saveCode)
        )
      )
      // Return the XLF to be saved
      .pipe(
        map((translatedFile) => {
          return { file: translatedFile, saveCode: saveCode }
        })
      )
      // Report success
      .pipe(
        tap(() => {
          console.warn(`The langue code '${saveCode}' file was created`)
        })
      )
  )
}

function saveJsonAsXlf(json, name) {
  return from(
    new Promise((resolve, reject) => {
      // Ensure XLIFF 1.2 metadata is set
      const fileNode = json?.xliff?.file?.[0]
      if (fileNode?.$) {
        fileNode.$['source-language'] = 'en'
        if (name !== 'source') {
          const target = name.replace('_', '-')
          fileNode.$['target-language'] = target
        } else {
          delete fileNode.$['target-language']
        }
      }
      const builder = new Builder()
      const xml = builder.buildObject(json)
      fs.writeFile(
        './src/locale/messages.' + name + '.xlf',
        xml,
        (err) => {
          if (err) {
            reject(err)
          }
          resolve(undefined)
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
        function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(json)
          }
        }
      )
    })
  )
}

function readMessageFile(path) {
  return new Observable((observer) => {
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
): Observable<any> {
  return new Observable((observer) => {
    // Read XLF file as a Json to
    // Edit the original XLF or the 'staticValues' object  to add the translations
    parseString(XlfFile, (error, staticValues) => {
      if (error) {
        observer.error(error)
      }
      const fileNode = staticValues?.xliff?.file?.[0]
      const units =
        fileNode?.unit || fileNode?.body?.[0]?.['trans-unit'] || []

      if (!Array.isArray(units) || units.length === 0) {
        observer.error(
          new Error('No translatable units found in XLF (1.2 or 2.0)')
        )
        return
      }

      // For each translation (supports XLIFF 2.0 and 1.2 structures)
      units.forEach((element) => {
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
          setTarget(element, translation)
          // Check if translations from the template and properties file match
          if ('en' === languageCode) {
            checkIfTranslationMatch(
              element['$'].id,
              getTarget(element),
              getSource(element)
            )
          }
          // If not any id match any of the translations properties
          // the same English template text is added as the translations
        } else {
          setTarget(element, getSource(element))
          // reports when a translation id does not match with any translation property
          translationNotFound(element['$'].id, languageCode)
        }
      })
      // return an object containing an XLF file
      observer.next(staticValues)
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
// Helpers to support both XLIFF 2.0 (segment/source/target) and 1.2 (source/target)
function getSource(element) {
  if (element.segment && element.segment[0]?.source) {
    return element.segment[0].source[0]
  }
  if (element.source) {
    return element.source[0]
  }
  return ''
}

function setTarget(element, value) {
  if (element.segment) {
    element.segment[0].target = [value]
  } else {
    // XLIFF 1.2: add state/approved hints for Transifex
    element.target = [
      {
        _: value,
        $: { state: 'translated' },
      },
    ]
    if (element.$) {
      element.$.approved = 'yes'
    }
  }
}

function getTarget(element) {
  if (element.segment && element.segment[0]?.target) {
    return element.segment[0].target[0]
  }
  if (element.target) {
    return element.target[0]
  }
  return ''
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
  const notes = [
    ...(element?.notes?.[0]?.note || []),
    ...(element?.note || []), // XLIFF 1.2 puts note directly under the unit
  ]
  if (!notes.length) {
    return value
  }
  notes.forEach((note) => {
    const category = note?.$?.category || note?.$?.from // xlf2 uses category, xlf1.2 uses from
    if (category && category === noteCategory) {
      value = note['_']
    }
  })
  return value
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function sentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function reportUnexistingFiles(path, code) {
  if (code !== 'source') {
    console.warn(`Unexisting language fie: ${path} - ${code}`)
    if (!reportFile.language[code]) {
      reportFile.language[code] = {}
    }
    if (!reportFile.language[code].unexistingFiles) {
      reportFile.language[code].unexistingFiles = []
    }
    reportFile.language[code].unexistingFiles.push(path)
  }
}
