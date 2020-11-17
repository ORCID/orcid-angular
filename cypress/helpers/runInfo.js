import { environment } from '../cypress.env'
const date = require('../helpers/date')

module.exports = function () {
  return ` on "${environment.baseUrl.replace('https://', '')}" at ${date()}`
}
