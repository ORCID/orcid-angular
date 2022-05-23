// Generate a unique substring/identifier to append to a given entry
module.exports = function () {
  const uuid = () => Cypress._.random(0, 1e6)
  const entryId = uuid()
  return entryId
}
