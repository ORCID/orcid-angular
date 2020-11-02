// Get current central time hyphen separated date
module.exports = function () {
  var date = new Date()
  return date
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Chicago', // Central time as Orcid servers
    })
    .replace(/[,]/g, '')
    .replace(/[:]/g, ' ')
    .split(' ')
    .join('-')
}
