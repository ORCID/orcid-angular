var fs = require('fs')
parseString = require('xml2js').parseString
xml2jsBuilder = require('xml2js').Builder
const util = require('util')
const propertiesToJSON = require('properties-to-json')
const axios = require('axios')

baseGithubTranslationFilesURL = [
  'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/about_',
  'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/messages_',
  'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/admin_',
  'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/email_',
  'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/identifiers_',
  'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/javascript_',
  'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/test_messages_',
]

languages = [
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
    code: 'en',
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
]
reportFile = {}

stringReplacements = {
  '<br />': ' ',
}

readMessageFile('./src/locale/messages.xlf', 'utf-8').then(file => {
  // TODO: Generate the language file report always in the same order to keep tracking on git
  Promise.all(
    languages.map(language =>
      generateLanguageFile(language.code, language.code, deepCopy(file))
    )
  ).then(() => {
    saveJson(reportFile, 'generator-report')
  })
})

function generateLanguageFile(code, saveCode, file) {
  return Promise.all(
    baseGithubTranslationFilesURL.map(url =>
      getTranslationFileFromGithub(url, code)
    )
  )
    .then(data => getProperties(data))
    .then(propsText =>
      setLanguagePropertiesToLanguageFile(file, propsText, saveCode)
    )
    .then(result => saveJsonAsXlf(result, saveCode))
    .then(() =>
      console.log('successfully create translation file for ' + saveCode)
    )
}

function saveJsonAsXlf(json, name) {
  new Promise((resolve, reject) => {
    var builder = new xml2jsBuilder()
    var xml = builder.buildObject(json)
    fs.writeFile('./src/locale/messages.' + name + '.xlf', xml, function(
      err,
      data
    ) {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

function saveJson(json, name) {
  new Promise((resolve, reject) => {
    fs.writeFile(
      './src/locale/messages.' + name + '.json',
      JSON.stringify(reportFile, null, 2),
      function(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

function getProperties(data) {
  let propsText = {}
  data.forEach(data => {
    if (data && data.data) {
      Object.assign(propsText, propertiesToJSON(data.data))
    }
  })
  return propsText
}

function readMessageFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

function setLanguagePropertiesToLanguageFile(data, propsText, saveCode) {
  return new Promise((resolve, reject) => {
    parseString(data, (error, result) => {
      if (error) {
        reject(error)
      }
      result.xliff.file[0].unit.forEach(element => {
        if (propsText[element['$'].id]) {
          element.segment[0].target = []
          element.segment[0].target.push(
            translationTreatment(
              propsText[element['$'].id],
              element['$'].id,
              saveCode
            )
          )
        } else {
          element.segment[0].target = element.segment[0].source
          translationNotFound(element['$'].id, saveCode)
        }
        if ('en' === saveCode) {
          checkIfTranslationMatch(
            element['$'].id,
            element.segment[0].target[0],
            element.segment[0].source[0]
          )
        }
      })
      resolve(result)
    })
  })
}

function deepCopy(json) {
  return JSON.parse(JSON.stringify(json))
}

function translationNotFound(id, saveCode) {
  if (!reportFile[saveCode]) {
    reportFile[saveCode] = {}
  }
  if (!reportFile[saveCode].notfound) {
    reportFile[saveCode].notfound = []
  }
  reportFile[saveCode].notfound.push(id)
}

function checkIfTranslationMatch(id, target, source) {
  let treatedSource = source.replace('\n', '')
  treatedSource = treatedSource.replace(/\s\s+/g, ' ')
  treatedSource = treatedSource.trim()
  if (target !== treatedSource) {
    reportTranslationNotMatch(id, target, treatedSource)
  }
}

function reportTranslationNotMatch(id, expected, got) {
  if (!reportFile.unmatchedTranslations) {
    reportFile.unmatchedTranslations = []
  }
  reportFile.unmatchedTranslations.push({ id, expected, got })
}

function getTranslationFileFromGithub(baseUrl, code) {
  return axios.get(baseUrl + code + '.properties').catch(error => {
    if (!reportFile.unexistingFiles) {
      reportFile.unexistingFiles = []
    }
    reportFile.unexistingFiles.push(baseUrl + code + '.properties')
  })
}

function translationTreatment(translation, id, saveCode) {
  let replacement = JSON.parse(JSON.stringify(translation))
  Object.keys(stringReplacements).map((text, index) => {
    replacement = replacement.replace(text, stringReplacements[text])
  })
  reportTranslationTreatment(translation, replacement, saveCode, id)
  return replacement
}

function reportTranslationTreatment(translation, replacement, saveCode, id) {
  if (replacement !== translation) {
    if (!reportFile[saveCode]) {
      reportFile[saveCode] = {}
    }
    if (!reportFile[saveCode].changed) {
      reportFile[saveCode].changed = []
    }
    reportFile[saveCode].changed.push({
      id,
      translation,
      replacement,
    })
  }
}
