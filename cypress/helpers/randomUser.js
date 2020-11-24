const date = require('../helpers/date')

module.exports = function () {
  return {
    email: 'cy-' + date() + '+' + userID() + '@gmail.com',
    password: '12345678Aa',
    name: 'cy-' + date() + '-' + userID(),
    familyName: 'cy-' + date() + '-' + userID(),
  }
}

function userID() {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789ñáéíóú-北查爾斯頓工廠的安全漏洞已經引起了航空公司和監管機構的密切關注'

  for (var i = 0; i < 2; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}
