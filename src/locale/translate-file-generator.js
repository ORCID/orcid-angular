var fs = require('fs')
parseString = require('xml2js').parseString
xml2jsBuilder = require('xml2js').Builder
const util = require('util')
const propertiesToJSON = require('properties-to-json')
const axios = require('axios')

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

languages.forEach(language => {
  generateLanguageFile(language.code, language.code)
})

function generateLanguageFile(code, saveCode) {
  let language
  return new Promise((resolve, reject) => {
    Promise.all([
      axios
        .get(
          'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/about_' +
            code +
            '.properties'
        )
        .catch(error => {
          return null
        }),
      axios
        .get(
          'https://raw.githubusercontent.com/ORCID/ORCID-Source/master/orcid-core/src/main/resources/i18n/messages_' +
            code +
            '.properties'
        )
        .catch(error => {
          return null
        }),
      ,
    ])
      .then(data => {
        let propsText = {}
        data.forEach(data => {
          if (data && data.data)
            Object.assign(propsText, propertiesToJSON(data.data))
        })
        return propsText
      })
      .then(propsText => {
        fs.readFile('./src/locale/messages.fr.xlf', 'utf-8', (error, data) => {
          if (error) {
            console.log(error)
            //TODO THROW
          }
          parseString(data, (error, result) => {
            if (error) {
              console.log(error)

              //TODO THROW
            }
            result.xliff.file[0].unit.forEach(element => {
              if (propsText[element['$'].id]) {
                element.segment[0].target = []
                element.segment[0].target.push(propsText[element['$'].id])
              }
            })
            // create a new builder object and then convert
            // our json back to xml.
            var builder = new xml2jsBuilder()
            var xml = builder.buildObject(result)
            fs.writeFile(
              './src/locale/messages.' + saveCode + '.xlf',
              xml,
              function(err, data) {
                if (err) console.log(err)
                console.log(
                  'successfully create translation file for ' + saveCode
                )
              }
            )
          })
        })
      })
  })
}
