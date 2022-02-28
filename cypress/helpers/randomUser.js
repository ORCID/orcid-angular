const date = require('../helpers/date')

module.exports = function () {
  var uniqueString = userID()
  return {
    email: 'qa' + '+cy_' + date() + '_' + uniqueString + '@orcid.org',
    password: '12345678Aa',
    name: 'cy_' + date() + '_' + uniqueString + '_name',
    familyName: 'cy_' + date() + '_' + uniqueString + '_family',
    id: undefined,
  }
}

function userID() {
  var text = ''
  var possible =
    'abcdefghijklmnopqrstuvwxyz123456789ñáéíóú-北查爾斯頓工廠的安全漏洞已經引起了航空公司和監管機構的密切關注'

  for (var i = 0; i < 2; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}
