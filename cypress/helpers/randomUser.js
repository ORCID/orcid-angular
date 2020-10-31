module.exports = function () {
  return {
    email: 'cypress' + userID() + '@gmail.com',
    password: '12345678Aa',
    name: 'cypress' + userID(),
    familyName: 'cypress' + userID(),
  }
}

function userID() {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}
