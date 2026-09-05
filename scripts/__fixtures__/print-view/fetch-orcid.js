// Stand-in for src/assets/print-view/fetch-orcid.js: same shape, three messages.
// The real file is ~1400 lines; the localizer only cares about the $localize
// calls, so a trimmed copy keeps the expected output small enough to assert on.

// Fallback for non-localized builds (development / unit tests).
// In production, all $localize calls are statically inlined by the Angular build.
if (typeof $localize === 'undefined') {
  self.$localize = function (messageParts) {
    var substitutions = Array.prototype.slice.call(arguments, 1)
    // Strip Angular localize metadata: `:description@@id:` (first part) or `:PLACEHOLDER:` (rest)
    var parts = Array.prototype.map.call(messageParts, function (part) {
      return typeof part === 'string' ? part.replace(/^:[^:]*:/, '') : part
    })
    return parts.reduce(function (result, part, i) {
      return (
        result +
        (substitutions[i - 1] != null ? substitutions[i - 1] : '') +
        part
      )
    })
  }
}

// All user-visible strings. Values are replaced per-locale by the Angular localize pipeline at build time.
const STRINGS = {
  biography: $localize`:@@printView.biography:Biography`,
  lastModified: $localize`:@@printView.lastModified:Last modified`,
}

// `${expr}:name:` is the placeholder form the real file uses (see
// printView.peerReviewSummary); the XLF must carry it as an <x id="count"/>.
function worksHeading(count) {
  return $localize`:@@printView.worksCount:${count}:count: works`
}

function render(record) {
  const heading = document.createElement('h2')
  heading.textContent = STRINGS.biography
  heading.setAttribute('data-works', worksHeading(record.works.length))
  document.body.appendChild(heading)
  return STRINGS.lastModified + ': ' + record.lastModified
}
