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
  unnamedProfile: $localize`:@@printView.unnamedProfile:Name is private`,
  orcidIdAlt: $localize`:@@printView.orcidIdAlt:ORCID iD`,
  biography: $localize`:@@printView.biography:Biography`,
  personalInformation: $localize`:@@printView.personalInformation:Personal information`,
  emails: $localize`:@@printView.emails:Emails`,
  websitesSocialLinks: $localize`:@@printView.websitesSocialLinks:Websites & social links`,
  otherIds: $localize`:@@printView.otherIds:Other IDs`,
  keywords: $localize`:@@printView.keywords:Keywords`,
  countries: $localize`:@@printView.countries:Countries`,
  activities: $localize`:@@printView.activities:Activities`,
  employments: $localize`:@@printView.employments:Employments`,
  educationAndQualifications: $localize`:@@printView.educationAndQualifications:Education and qualifications`,
  professionalActivities: $localize`:@@printView.professionalActivities:Professional activities`,
  fundings: $localize`:@@printView.fundings:Fundings`,
  researchResources: $localize`:@@printView.researchResources:Research Resources`,
  works: $localize`:@@printView.works:Works`,
  organization: $localize`:@@printView.organization:Organization`,
  organizationAddress: $localize`:@@printView.organizationAddress:Organization address`,
  startDate: $localize`:@@printView.startDate:Start date`,
  endDate: $localize`:@@printView.endDate:End date`,
  publicationDate: $localize`:@@printView.publicationDate:Publication date`,
  journal: $localize`:@@printView.journal:Journal`,
  roleTitle: $localize`:@@printView.roleTitle:Role title`,
  department: $localize`:@@printView.department:Department`,
  type: $localize`:@@printView.type:Type`,
  url: $localize`:@@printView.url:URL`,
  untitled: $localize`:@@printView.untitled:Untitled`,
  identifier: $localize`:@@printView.identifier:Identifier`,
  loadingRecord: $localize`:@@printView.loadingRecord:Loading ORCID record...`,
  recordNotFound: $localize`:@@printView.recordNotFound:Record data was not found in ORCID response.`,
  redirectingToPrimary: $localize`:@@printView.redirectingToPrimary:Redirecting to primary ORCID record…`,
  orcidPrintView: $localize`:@@printView.orcidPrintView:ORCID Print view`,
  printSaveAsPdf: $localize`:@@printView.printSaveAsPdf:Print / Save as PDF`,
  printThisOrcidProfile: $localize`:@@printView.printThisOrcidProfile:Print this ORCID profile`,
  relSelf: $localize`:@@printView.relSelf:Self`,
  relPartOf: $localize`:@@printView.relPartOf:Part of`,
  relVersionOf: $localize`:@@printView.relVersionOf:Version of`,
  relFundedBy: $localize`:@@printView.relFundedBy:Funded by`,
}

function peerReviewHeadingText(reviewsCount, publicationsCount) {
  return $localize`:@@printView.peerReviewSummary:Peer review (${reviewsCount}:reviewCount: reviews for ${publicationsCount}:publicationCount: publications/grants)`
}

// Localized country names keyed by ISO 3166-1 alpha-2 code.
// Mirrors `getCountryCodes` in
// src/app/core/record-countries/record-countries.service.ts so the print view
// can show a localized country name instead of the raw country code.
// Values are replaced per-locale by the Angular localize pipeline at build time.
const COUNTRY_NAMES = {
  AF: $localize`:@@printView.AF:Afghanistan`,
  AL: $localize`:@@printView.AL:Albania`,
  DZ: $localize`:@@printView.DZ:Algeria`,
  AS: $localize`:@@printView.AS:American Samoa`,
  AD: $localize`:@@printView.AD:Andorra`,
  AO: $localize`:@@printView.AO:Angola`,
  AI: $localize`:@@printView.AI:Anguilla`,
  AQ: $localize`:@@printView.AQ:Antarctica`,
  AG: $localize`:@@printView.AG:Antigua and Barbuda`,
  AR: $localize`:@@printView.AR:Argentina`,
  AM: $localize`:@@printView.AM:Armenia`,
  AW: $localize`:@@printView.AW:Aruba`,
  AU: $localize`:@@printView.AU:Australia`,
  AT: $localize`:@@printView.AT:Austria`,
  AZ: $localize`:@@printView.AZ:Azerbaijan`,
  BS: $localize`:@@printView.BS:Bahamas`,
  BH: $localize`:@@printView.BH:Bahrain`,
  BD: $localize`:@@printView.BD:Bangladesh`,
  BB: $localize`:@@printView.BB:Barbados`,
  BY: $localize`:@@printView.BY:Belarus`,
  BE: $localize`:@@printView.BE:Belgium`,
  BZ: $localize`:@@printView.BZ:Belize`,
  BJ: $localize`:@@printView.BJ:Benin`,
  BM: $localize`:@@printView.BM:Bermuda`,
  BT: $localize`:@@printView.BT:Bhutan`,
  BO: $localize`:@@printView.BO:Bolivia`,
  BA: $localize`:@@printView.BA:Bosnia and Herzegovina`,
  BW: $localize`:@@printView.BW:Botswana`,
  BV: $localize`:@@printView.BV:Bouvet Island`,
  BR: $localize`:@@printView.BR:Brazil`,
  BQ: $localize`:@@printView.BQ:British Antarctic Territory`,
  IO: $localize`:@@printView.IO:British Indian Ocean Territory`,
  VG: $localize`:@@printView.VG:British Virgin Islands`,
  BN: $localize`:@@printView.BN:Brunei`,
  BG: $localize`:@@printView.BG:Bulgaria`,
  BF: $localize`:@@printView.BF:Burkina Faso`,
  BI: $localize`:@@printView.BI:Burundi`,
  KH: $localize`:@@printView.KH:Cambodia`,
  CM: $localize`:@@printView.CM:Cameroon`,
  CA: $localize`:@@printView.CA:Canada`,
  CV: $localize`:@@printView.CV:Cape Verde`,
  KY: $localize`:@@printView.KY:Cayman Islands`,
  CF: $localize`:@@printView.CF:Central African Republic`,
  TD: $localize`:@@printView.TD:Chad`,
  CL: $localize`:@@printView.CL:Chile`,
  CN: $localize`:@@printView.CN:China`,
  CX: $localize`:@@printView.CX:Christmas Island`,
  CC: $localize`:@@printView.CC:Cocos [Keeling] Islands`,
  CO: $localize`:@@printView.CO:Colombia`,
  KM: $localize`:@@printView.KM:Comoros`,
  CG: $localize`:@@printView.CG:Congo - Brazzaville`,
  CD: $localize`:@@printView.CD:Congo - Kinshasa`,
  CK: $localize`:@@printView.CK:Cook Islands`,
  CR: $localize`:@@printView.CR:Costa Rica`,
  HR: $localize`:@@printView.HR:Croatia`,
  CU: $localize`:@@printView.CU:Cuba`,
  CW: $localize`:@@printView.CW:Curaçao`,
  CY: $localize`:@@printView.CY:Cyprus`,
  CZ: $localize`:@@printView.CZ:Czech Republic`,
  CI: $localize`:@@printView.CI:Côte d'Ivoire`,
  DK: $localize`:@@printView.DK:Denmark`,
  DJ: $localize`:@@printView.DJ:Djibouti`,
  DM: $localize`:@@printView.DM:Dominica`,
  DO: $localize`:@@printView.DO:Dominican Republic`,
  EC: $localize`:@@printView.EC:Ecuador`,
  EG: $localize`:@@printView.EG:Egypt`,
  SV: $localize`:@@printView.SV:El Salvador`,
  GQ: $localize`:@@printView.GQ:Equatorial Guinea`,
  ER: $localize`:@@printView.ER:Eritrea`,
  EE: $localize`:@@printView.EE:Estonia`,
  ET: $localize`:@@printView.ET:Ethiopia`,
  FK: $localize`:@@printView.FK:Falkland Islands`,
  FO: $localize`:@@printView.FO:Faroe Islands`,
  FJ: $localize`:@@printView.FJ:Fiji`,
  FI: $localize`:@@printView.FI:Finland`,
  FR: $localize`:@@printView.FR:France`,
  GF: $localize`:@@printView.GF:French Guiana`,
  PF: $localize`:@@printView.PF:French Polynesia`,
  TF: $localize`:@@printView.TF:French Southern Territories`,
  GA: $localize`:@@printView.GA:Gabon`,
  GM: $localize`:@@printView.GM:Gambia`,
  GE: $localize`:@@printView.GE:Georgia`,
  DE: $localize`:@@printView.DE:Germany`,
  GH: $localize`:@@printView.GH:Ghana`,
  GI: $localize`:@@printView.GI:Gibraltar`,
  GR: $localize`:@@printView.GR:Greece`,
  GL: $localize`:@@printView.GL:Greenland`,
  GD: $localize`:@@printView.GD:Grenada`,
  GP: $localize`:@@printView.GP:Guadeloupe`,
  GU: $localize`:@@printView.GU:Guam`,
  GT: $localize`:@@printView.GT:Guatemala`,
  GG: $localize`:@@printView.GG:Guernsey`,
  GN: $localize`:@@printView.GN:Guinea`,
  GW: $localize`:@@printView.GW:Guinea-Bissau`,
  GY: $localize`:@@printView.GY:Guyana`,
  HT: $localize`:@@printView.HT:Haiti`,
  HM: $localize`:@@printView.HM:Heard Island and McDonald Islands`,
  HN: $localize`:@@printView.HN:Honduras`,
  HK: $localize`:@@printView.HK:Hong Kong SAR China`,
  HU: $localize`:@@printView.HU:Hungary`,
  IS: $localize`:@@printView.IS:Iceland`,
  IN: $localize`:@@printView.IN:India`,
  ID: $localize`:@@printView.ID:Indonesia`,
  IR: $localize`:@@printView.IR:Iran`,
  IQ: $localize`:@@printView.IQ:Iraq`,
  IE: $localize`:@@printView.IE:Ireland`,
  IM: $localize`:@@printView.IM:Isle of Man`,
  IL: $localize`:@@printView.IL:Israel`,
  IT: $localize`:@@printView.IT:Italy`,
  JM: $localize`:@@printView.JM:Jamaica`,
  JP: $localize`:@@printView.JP:Japan`,
  JE: $localize`:@@printView.JE:Jersey`,
  JO: $localize`:@@printView.JO:Jordan`,
  KZ: $localize`:@@printView.KZ:Kazakhstan`,
  KE: $localize`:@@printView.KE:Kenya`,
  KI: $localize`:@@printView.KI:Kiribati`,
  XK: $localize`:@@printView.XK:Kosovo`,
  KW: $localize`:@@printView.KW:Kuwait`,
  KG: $localize`:@@printView.KG:Kyrgyzstan`,
  LA: $localize`:@@printView.LA:Laos`,
  LV: $localize`:@@printView.LV:Latvia`,
  LB: $localize`:@@printView.LB:Lebanon`,
  LS: $localize`:@@printView.LS:Lesotho`,
  LR: $localize`:@@printView.LR:Liberia`,
  LY: $localize`:@@printView.LY:Libya`,
  LI: $localize`:@@printView.LI:Liechtenstein`,
  LT: $localize`:@@printView.LT:Lithuania`,
  LU: $localize`:@@printView.LU:Luxembourg`,
  MO: $localize`:@@printView.MO:Macau SAR China`,
  MG: $localize`:@@printView.MG:Madagascar`,
  MW: $localize`:@@printView.MW:Malawi`,
  MY: $localize`:@@printView.MY:Malaysia`,
  MV: $localize`:@@printView.MV:Maldives`,
  ML: $localize`:@@printView.ML:Mali`,
  MT: $localize`:@@printView.MT:Malta`,
  MH: $localize`:@@printView.MH:Marshall Islands`,
  MQ: $localize`:@@printView.MQ:Martinique`,
  MR: $localize`:@@printView.MR:Mauritania`,
  MU: $localize`:@@printView.MU:Mauritius`,
  YT: $localize`:@@printView.YT:Mayotte`,
  MX: $localize`:@@printView.MX:Mexico`,
  FM: $localize`:@@printView.FM:Micronesia`,
  MD: $localize`:@@printView.MD:Moldova`,
  MC: $localize`:@@printView.MC:Monaco`,
  MN: $localize`:@@printView.MN:Mongolia`,
  ME: $localize`:@@printView.ME:Montenegro`,
  MS: $localize`:@@printView.MS:Montserrat`,
  MA: $localize`:@@printView.MA:Morocco`,
  MZ: $localize`:@@printView.MZ:Mozambique`,
  MM: $localize`:@@printView.MM:Myanmar [Burma]`,
  NA: $localize`:@@printView.NA:Namibia`,
  NR: $localize`:@@printView.NR:Nauru`,
  NP: $localize`:@@printView.NP:Nepal`,
  NL: $localize`:@@printView.NL:Netherlands`,
  NC: $localize`:@@printView.NC:New Caledonia`,
  NZ: $localize`:@@printView.NZ:New Zealand`,
  NI: $localize`:@@printView.NI:Nicaragua`,
  NE: $localize`:@@printView.NE:Niger`,
  NG: $localize`:@@printView.NG:Nigeria`,
  NU: $localize`:@@printView.NU:Niue`,
  NF: $localize`:@@printView.NF:Norfolk Island`,
  KP: $localize`:@@printView.KP:North Korea`,
  MK: $localize`:@@printView.MK:North Macedonia`,
  MP: $localize`:@@printView.MP:Northern Mariana Islands`,
  NO: $localize`:@@printView.NO:Norway`,
  OM: $localize`:@@printView.OM:Oman`,
  PK: $localize`:@@printView.PK:Pakistan`,
  PW: $localize`:@@printView.PW:Palau`,
  PS: $localize`:@@printView.PS:Palestinian Territories`,
  PA: $localize`:@@printView.PA:Panama`,
  PG: $localize`:@@printView.PG:Papua New Guinea`,
  PY: $localize`:@@printView.PY:Paraguay`,
  PE: $localize`:@@printView.PE:Peru`,
  PH: $localize`:@@printView.PH:Philippines`,
  PN: $localize`:@@printView.PN:Pitcairn Islands`,
  PL: $localize`:@@printView.PL:Poland`,
  PT: $localize`:@@printView.PT:Portugal`,
  PR: $localize`:@@printView.PR:Puerto Rico`,
  QA: $localize`:@@printView.QA:Qatar`,
  RO: $localize`:@@printView.RO:Romania`,
  RU: $localize`:@@printView.RU:Russia`,
  RW: $localize`:@@printView.RW:Rwanda`,
  RE: $localize`:@@printView.RE:Réunion`,
  BL: $localize`:@@printView.BL:Saint Barthélemy`,
  SH: $localize`:@@printView.SH:Saint Helena`,
  KN: $localize`:@@printView.KN:Saint Kitts and Nevis`,
  LC: $localize`:@@printView.LC:Saint Lucia`,
  MF: $localize`:@@printView.MF:Saint Martin`,
  PM: $localize`:@@printView.PM:Saint Pierre and Miquelon`,
  VC: $localize`:@@printView.VC:Saint Vincent and the Grenadines`,
  WS: $localize`:@@printView.WS:Samoa`,
  SM: $localize`:@@printView.SM:San Marino`,
  SA: $localize`:@@printView.SA:Saudi Arabia`,
  SN: $localize`:@@printView.SN:Senegal`,
  RS: $localize`:@@printView.RS:Serbia`,
  SC: $localize`:@@printView.SC:Seychelles`,
  SL: $localize`:@@printView.SL:Sierra Leone`,
  SG: $localize`:@@printView.SG:Singapore`,
  SX: $localize`:@@printView.SX:Sint Maarten (Dutch Part)`,
  SK: $localize`:@@printView.SK:Slovakia`,
  SI: $localize`:@@printView.SI:Slovenia`,
  SB: $localize`:@@printView.SB:Solomon Islands`,
  SO: $localize`:@@printView.SO:Somalia`,
  ZA: $localize`:@@printView.ZA:South Africa`,
  GS: $localize`:@@printView.GS:South Georgia and the South Sandwich Islands`,
  KR: $localize`:@@printView.KR:South Korea`,
  SS: $localize`:@@printView.SS:South Sudan`,
  ES: $localize`:@@printView.ES:Spain`,
  LK: $localize`:@@printView.LK:Sri Lanka`,
  SD: $localize`:@@printView.SD:Sudan`,
  SR: $localize`:@@printView.SR:Suriname`,
  SJ: $localize`:@@printView.SJ:Svalbard and Jan Mayen`,
  SZ: $localize`:@@printView.SZ:Swaziland`,
  SE: $localize`:@@printView.SE:Sweden`,
  CH: $localize`:@@printView.CH:Switzerland`,
  SY: $localize`:@@printView.SY:Syria`,
  ST: $localize`:@@printView.ST:São Tomé and Príncipe`,
  TW: $localize`:@@printView.TW:Taiwan`,
  TJ: $localize`:@@printView.TJ:Tajikistan`,
  TZ: $localize`:@@printView.TZ:Tanzania`,
  TH: $localize`:@@printView.TH:Thailand`,
  TL: $localize`:@@printView.TL:Timor-Leste`,
  TG: $localize`:@@printView.TG:Togo`,
  TK: $localize`:@@printView.TK:Tokelau`,
  TO: $localize`:@@printView.TO:Tonga`,
  TT: $localize`:@@printView.TT:Trinidad and Tobago`,
  TN: $localize`:@@printView.TN:Tunisia`,
  TR: $localize`:@@printView.TR:Türkiye`,
  TM: $localize`:@@printView.TM:Turkmenistan`,
  TC: $localize`:@@printView.TC:Turks and Caicos Islands`,
  TV: $localize`:@@printView.TV:Tuvalu`,
  UM: $localize`:@@printView.UM:U.S. Minor Outlying Islands`,
  VI: $localize`:@@printView.VI:U.S. Virgin Islands`,
  UG: $localize`:@@printView.UG:Uganda`,
  UA: $localize`:@@printView.UA:Ukraine`,
  AE: $localize`:@@printView.AE:United Arab Emirates`,
  GB: $localize`:@@printView.GB:United Kingdom`,
  US: $localize`:@@printView.US:United States`,
  UY: $localize`:@@printView.UY:Uruguay`,
  UZ: $localize`:@@printView.UZ:Uzbekistan`,
  VU: $localize`:@@printView.VU:Vanuatu`,
  VA: $localize`:@@printView.VA:Vatican City`,
  VE: $localize`:@@printView.VE:Venezuela`,
  VN: $localize`:@@printView.VN:Vietnam`,
  WF: $localize`:@@printView.WF:Wallis and Futuna`,
  EH: $localize`:@@printView.EH:Western Sahara`,
  YE: $localize`:@@printView.YE:Yemen`,
  ZM: $localize`:@@printView.ZM:Zambia`,
  ZW: $localize`:@@printView.ZW:Zimbabwe`,
  AX: $localize`:@@printView.AX:Åland Islands`,
}

// Returns the localized country name for an ISO 3166-1 alpha-2 code.
// Falls back to the original value (e.g. the raw code) when no match is found.
function localizedCountryName(countryCode) {
  const code = (countryCode || '').trim().toUpperCase()
  return COUNTRY_NAMES[code] || countryCode
}

const ORCID_REGEX = /\b\d{4}-\d{4}-\d{4}-\d{3}[\dX]\b/i

const cvRoot = document.getElementById('cv-root')
const statusNode = document.getElementById('status')
const printButton = document.getElementById('print-button')

function normalizeOrcidId(rawValue) {
  if (!rawValue) return ''
  const normalized = rawValue
    .trim()
    .replace(/^https?:\/\/(www\.)?orcid\.org\//i, '')
  const match = normalized.match(ORCID_REGEX)
  return match ? match[0].toUpperCase() : ''
}

function sanitizeUrl(rawUrl) {
  const trimmed = (rawUrl || '').trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    if (!['http:', 'https:'].includes(parsed.protocol)) return ''

    const host = parsed.hostname.toLowerCase()
    const path = parsed.pathname || ''

    // ORCID client application URLs are not human profile links.
    if (
      (host === 'orcid.org' || host === 'www.orcid.org') &&
      /^\/client\//i.test(path)
    ) {
      return ''
    }

    return parsed.toString()
  } catch (_error) {
    return ''
  }
}

function resolveOrcidIdFromLocation() {
  const url = new URL(window.location.href)
  const fromQuery = normalizeOrcidId(url.searchParams.get('orcid'))
  if (fromQuery) return fromQuery

  const hash = url.hash.replace(/^#\/?/, '')
  const fromHash = normalizeOrcidId(hash)
  if (fromHash) return fromHash

  const pathSegments = url.pathname.split('/').filter(Boolean)
  if (pathSegments.length >= 2) {
    const last = pathSegments[pathSegments.length - 1]
    if (last === 'print' || last === 'print-view') {
      const fromPrintPath = normalizeOrcidId(
        pathSegments[pathSegments.length - 2]
      )
      if (fromPrintPath) return fromPrintPath
    }
  }
  const lastSegment = pathSegments[pathSegments.length - 1]
  const fromPath = normalizeOrcidId(lastSegment)
  if (fromPath) return fromPath

  return ''
}

function syncOrcidInUrl(orcidId) {
  const url = new URL(window.location.href)
  // If we're already on the canonical pretty URL `/{orcid}/print`, keep it clean
  // (don't add `?orcid=...`).
  const canonicalPath = `/${encodeURIComponent(orcidId)}/print`
  if (url.pathname.replace(/\/$/, '') === canonicalPath) {
    return
  }
  url.searchParams.set('orcid', orcidId)
  window.history.replaceState({}, '', url)
}

function showStatus(message, type = 'info') {
  statusNode.textContent = message
  statusNode.className = `status no-print ${type}`
  statusNode.setAttribute(
    'aria-live',
    type === 'error' ? 'assertive' : 'polite'
  )
}

function clearStatus() {
  showStatus('', 'info')
}

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

function makeSection(title) {
  const section = document.createElement('section')
  section.className = 'cv-section'

  const heading = document.createElement('h2')
  heading.textContent = title
  section.appendChild(heading)
  return section
}

function appendList(section, entries) {
  if (!entries.length) return
  const list = document.createElement('ul')
  for (const entry of entries) {
    const li = document.createElement('li')
    li.appendChild(entry)
    list.appendChild(li)
  }
  section.appendChild(list)
}

function jsonText(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  if (typeof value === 'object') {
    if (typeof value.content === 'string') return value.content.trim()
    if (value.value !== null && value.value !== undefined)
      return String(value.value).trim()
  }
  return ''
}

function jsonList(list) {
  return Array.isArray(list) ? list : []
}

function jsonDate(parts) {
  if (!parts) return ''
  const year = jsonText(parts.year)
  const month = jsonText(parts.month)
  const day = jsonText(parts.day)
  return [year, month, day].filter(Boolean).join('-')
}

function jsonOrcidUri(orcidIdentifier) {
  const uri = jsonText(orcidIdentifier?.uri)
  const path = jsonText(orcidIdentifier?.path)
  return uri || (path ? `https://orcid.org/${path}` : '')
}

function setTitle(recordJson, chosenName) {
  const orcidId = jsonText(recordJson?.['orcid-identifier']?.path)
  document.title = `${chosenName} (${orcidId}) - ${STRINGS.orcidPrintView}`
}

function renderIdentityFromJson(recordJson) {
  const person = recordJson?.person
  const name = person?.name
  const given = jsonText(name?.['given-names'])
  const family = jsonText(name?.['family-name'])
  const credit = jsonText(name?.['credit-name'])
  const fullName = [given, family].filter(Boolean).join(' ')
  const chosenName = credit || fullName || STRINGS.unnamedProfile

  // Set the page title
  setTitle(recordJson, chosenName)

  const container = document.createElement('article')
  container.className = 'cv-container'
  container.setAttribute('aria-label', `${chosenName} ORCID profile`)

  const header = document.createElement('header')
  const title = document.createElement('h1')
  title.textContent = chosenName
  header.appendChild(title)

  const otherNames = jsonList(person?.['other-names']?.['other-name'])
    .map((n) => jsonText(n?.content))
    .filter(Boolean)

  if (credit && fullName) {
    otherNames.unshift(fullName)
  }

  if (otherNames.length) {
    const namesLine = document.createElement('p')
    namesLine.className = 'other-names'
    namesLine.textContent = otherNames.join('; ')
    header.appendChild(namesLine)
  }

  const orcidUri = jsonOrcidUri(recordJson?.['orcid-identifier'])
  if (orcidUri) {
    const orcidRow = document.createElement('div')
    orcidRow.className = 'orcid-id'

    const icon = document.createElement('img')
    icon.src = 'https://orcid.org/assets/vectors/orcid.logo.black.icon.svg'
    icon.alt = STRINGS.orcidIdAlt
    orcidRow.appendChild(icon)

    const link = document.createElement('a')
    link.href = orcidUri
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = orcidUri
    orcidRow.appendChild(link)

    header.appendChild(orcidRow)
  }

  container.appendChild(header)
  return container
}

function renderBiographyFromJson(recordJson, container) {
  const person = recordJson?.person

  if (!person) return

  const bioElement = person?.biography

  if (!bioElement) return

  const biography = jsonText(bioElement?.content)

  if (!biography) return

  const bioSection = makeSection(STRINGS.biography)
  const bioLine = document.createElement('p')
  bioLine.className = 'other-names'
  bioLine.textContent = biography
  bioSection.appendChild(bioLine)
  container.appendChild(bioSection)
}

function renderPersonalInfoFromJson(recordJson, container) {
  const person = recordJson?.person
  if (!person) return

  const section = makeSection(STRINGS.personalInformation)
  const blocks = []

  const emails = jsonList(person?.emails?.email)
    .map((e) => jsonText(e?.email))
    .filter(Boolean)
  if (emails.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = STRINGS.emails
    block.appendChild(title)
    appendList(
      block,
      emails.map((email) => textLineNode('', email))
    )
    blocks.push(block)
  }

  const links = jsonList(person?.['researcher-urls']?.['researcher-url'])
    .map((u) => ({
      name: jsonText(u?.['url-name']),
      url: sanitizeUrl(jsonText(u?.url?.value) || jsonText(u?.url)),
    }))
    .filter((u) => u.url)
  if (links.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = STRINGS.websitesSocialLinks
    block.appendChild(title)
    const lines = links.map((entry) => {
      const row = document.createElement('span')
      row.className = 'line'
      if (entry.name)
        row.appendChild(document.createTextNode(`${entry.name} (`))
      const anchor = document.createElement('a')
      anchor.href = entry.url
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      anchor.textContent = entry.url
      row.appendChild(anchor)
      if (entry.name) row.appendChild(document.createTextNode(')'))
      return row
    })
    appendList(block, lines)
    blocks.push(block)
  }

  const externalIds = jsonList(
    person?.['external-identifiers']?.['external-identifier']
  )
    .map((id) => ({
      type: jsonText(id?.['external-id-type']),
      value: jsonText(id?.['external-id-value']),
      url: sanitizeUrl(
        jsonText(id?.['external-id-url']?.value) || jsonText(id?.url)
      ),
    }))
    .filter((id) => id.type || id.value || id.url)
  if (externalIds.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = STRINGS.otherIds
    block.appendChild(title)
    const lines = externalIds.map((entry) => {
      const label = entry.type || 'Identifier'
      const value = entry.value || entry.url || ''
      return otherIdsTextNode(label, value, entry.url)
    })
    appendList(block, lines)
    blocks.push(block)
  }

  const keywords = jsonList(person?.keywords?.keyword)
    .map((k) => jsonText(k?.content))
    .filter(Boolean)
  if (keywords.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = STRINGS.keywords
    block.appendChild(title)
    appendList(block, [textLineNode('', keywords.join(', '))])
    blocks.push(block)
  }

  const countries = jsonList(person?.addresses?.address)
    .map((a) => {
      return localizedCountryName(jsonText(a?.country))
    })
    .filter(Boolean)

  if (countries.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = STRINGS.countries
    block.appendChild(title)
    appendList(block, [textLineNode('', countries.join(', '))])
    blocks.push(block)
  }

  if (!blocks.length) return
  blocks.forEach((b) => section.appendChild(b))
  container.appendChild(section)
}

function humanizeTagName(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function textLineNode(label, value, url) {
  const wrapper = document.createElement('p')
  wrapper.className = 'line'
  if (label) {
    const prefix = document.createElement('span')
    prefix.className = 'line-label'
    prefix.textContent = `${label}: `
    wrapper.appendChild(prefix)
  }
  const safeUrl = sanitizeUrl(url)
  if (safeUrl) {
    const a = document.createElement('a')
    a.href = safeUrl
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.textContent = value || safeUrl
    wrapper.appendChild(a)
  } else {
    wrapper.appendChild(document.createTextNode(value))
  }
  return wrapper
}

function otherIdsTextNode(label, value, url) {
  const wrapper = document.createElement('p')
  wrapper.className = 'line'
  if (label) {
    const prefix = document.createElement('span')
    prefix.className = 'line-label'
    prefix.textContent = `${label}: `
    wrapper.appendChild(prefix)
  }

  const safeUrl = sanitizeUrl(url)
  const valueAsUrl = sanitizeUrl(value)
  if (safeUrl && valueAsUrl) {
    // If both are provided and value is a URL, render value as the link
    wrapper.appendChild(document.createTextNode(' ('))
    const a = document.createElement('a')
    a.href = valueAsUrl
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.textContent = value || valueAsUrl
    wrapper.appendChild(a)
    wrapper.appendChild(document.createTextNode(')'))
  } else {
    // Otherwise, render value as text,
    if (value) wrapper.appendChild(document.createTextNode(value))

    // and optionally append a (url) link if provided and safe
    if (safeUrl) {
      wrapper.appendChild(document.createTextNode(' ('))
      const a = document.createElement('a')
      a.href = safeUrl
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.textContent = safeUrl
      wrapper.appendChild(a)
      wrapper.appendChild(document.createTextNode(')'))
    }
  }
  return wrapper
}

function safeTextNode(value) {
  return (value || '').replace(/\s+/g, ' ').trim()
}

function renderActivityGroupFromJson(section, title, items, renderItem) {
  const entries = (items || []).filter(Boolean)
  if (!entries.length) return false
  const block = document.createElement('div')
  block.className = 'activity-group'
  const heading = document.createElement('h3')
  heading.textContent = `${title} (${entries.length})`
  block.appendChild(heading)
  const list = document.createElement('ul')
  entries.forEach((entry) => {
    const li = document.createElement('li')
    li.appendChild(renderItem(entry))
    list.appendChild(li)
  })
  block.appendChild(list)
  section.appendChild(block)
  return true
}

function composeActivityEntryFromJson(entry, opts = {}) {
  const wrapper = document.createElement('div')
  wrapper.className = 'activity-item'
  const title =
    opts.title ||
    jsonText(entry?.title?.title) ||
    jsonText(entry?.organization?.name) ||
    jsonText(entry?.['role-title']) ||
    jsonText(entry?.type) ||
    STRINGS.untitled
  const titleNode = document.createElement('strong')
  titleNode.textContent = title
  wrapper.appendChild(titleNode)

  const org = jsonText(entry?.organization?.name)
  if (org && org !== title)
    wrapper.appendChild(textLineNode(STRINGS.organization, org))

  const orgAddress = [
    jsonText(entry?.organization?.address?.city),
    jsonText(entry?.organization?.address?.region),
    jsonText(entry?.organization?.address?.country),
  ]
    .filter(Boolean)
    .join(', ')
  if (orgAddress)
    wrapper.appendChild(textLineNode(STRINGS.organizationAddress, orgAddress))

  const start = jsonDate(entry?.['start-date'])
  const end = jsonDate(entry?.['end-date'])
  if (start) wrapper.appendChild(textLineNode(STRINGS.startDate, start))
  if (end) wrapper.appendChild(textLineNode(STRINGS.endDate, end))

  const pub = jsonDate(entry?.['publication-date'])
  if (pub) wrapper.appendChild(textLineNode(STRINGS.publicationDate, pub))
  const journal = jsonText(entry?.['journal-title'])
  if (journal) wrapper.appendChild(textLineNode(STRINGS.journal, journal))
  const roleTitle = jsonText(entry?.['role-title'])
  if (roleTitle) wrapper.appendChild(textLineNode(STRINGS.roleTitle, roleTitle))
  const dept = jsonText(entry?.['department-name'])
  if (dept) wrapper.appendChild(textLineNode(STRINGS.department, dept))
  const type = jsonText(entry?.type)
  if (type) wrapper.appendChild(textLineNode(STRINGS.type, type))

  const url = sanitizeUrl(jsonText(entry?.url?.value) || jsonText(entry?.url))
  if (url) wrapper.appendChild(textLineNode(STRINGS.url, url, url))

  if (opts.type) {
    wrapper.appendChild(textLineNode(STRINGS.type, opts.type))
  }

  // External identifiers (works / fundings etc)
  const extIds =
    entry?.['external-ids']?.['external-id'] ||
    entry?.proposal?.['external-ids']?.['external-id'] ||
    []
  if (Array.isArray(extIds) && extIds.length) {
    extIds.forEach((id) => {
      const idType = jsonText(id.type || id['external-id-type'])
      const idValue = jsonText(id.value || id['external-id-value'])
      const idRel = jsonText(id.relationship || id['external-id-relationship'])
      const idUrl = sanitizeUrl(jsonText(id['external-id-url']?.value))

      let localizedRel = idRel
      if (idRel) {
        const lowerRel = idRel.toLowerCase()
        if (lowerRel === 'self') localizedRel = STRINGS.relSelf
        else if (lowerRel === 'part-of') localizedRel = STRINGS.relPartOf
        else if (lowerRel === 'version-of') localizedRel = STRINGS.relVersionOf
        else if (lowerRel === 'funded-by') localizedRel = STRINGS.relFundedBy
      }

      const label =
        idRel && idRel.toLowerCase() !== 'self'
          ? `${localizedRel} ${idType}`.trim()
          : idType || STRINGS.identifier
      wrapper.appendChild(otherIdsTextNode(label, idValue, idUrl))
    })
  }

  return wrapper
}

function renderEmployments(activities, section) {
  // Employments: activities-summary.employments.affiliation-group[].summaries[]
  const employments = []

  for (const groups of activities?.employments?.['affiliation-group'] || []) {
    // Get just the first element from each group
    for (const summaries of groups.summaries || []) {
      employments.push(summaries['employment-summary'])
      break
    }
  }

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(
      section,
      STRINGS.employments,
      employments,
      (e) =>
        composeActivityEntryFromJson(e, {
          title: jsonText(e?.organization?.name) || jsonText(e?.roleTitle),
        })
    ) || hasContent
  return hasContent
}

function renderEducationsAndQualifications(activities, section) {
  const educations = []
  // Educations: activities.educations.affiliation-group[].[0].summaries[]
  for (const groups of activities?.educations?.['affiliation-group'] || []) {
    // Get just the first element from each group
    for (const summaries of groups.summaries || []) {
      educations.push({
        type: 'education',
        title:
          summaries['education-summary'].organization?.name ||
          summaries['education-summary']?.['role-title'],
        original: summaries['education-summary'],
      })
      break
    }
  }

  // Qualifications: activities.qualifications.affiliation-group[].[0].summaries[]
  const qualifications = []
  for (const groups of activities?.qualifications?.['affiliation-group'] ||
    []) {
    // Get just the first element from each group
    for (const summaries of groups.summaries || []) {
      qualifications.push({
        type: 'qualification',
        title:
          summaries['qualification-summary'].organization?.name ||
          summaries['qualification-summary']?.['role-title'],
        original: summaries['qualification-summary'],
      })
      break
    }
  }

  const merged = [...educations, ...qualifications]
  merged.sort((a, b) => a.title.localeCompare(b.title))

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(
      section,
      STRINGS.educationAndQualifications,
      merged,
      (e) =>
        composeActivityEntryFromJson(e.original, {
          title: e.title,
          type: e.type,
        })
    ) || hasContent
  return hasContent
}

function renderWorks(activities, section) {
  const workSummaries = []
  // Works: activities-summary.works.group[].work-summary[]
  for (const group of activities?.works?.group || []) {
    workSummaries.push(group['work-summary'][0])
  }

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(section, STRINGS.works, workSummaries, (w) =>
      composeActivityEntryFromJson(w, { title: jsonText(w?.title?.title) })
    ) || hasContent
  return hasContent
}

function renderProfessionalActivities(activities, section) {
  const invitedPositions = []
  // invitedPositions: activities.invited-positions.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['invited-positions']?.[
    'affiliation-group'
  ] || []) {
    // Get just the first element from each group
    for (const summaries of groups.summaries || []) {
      invitedPositions.push({
        type: 'invited-position',
        title:
          summaries['invited-position-summary'].organization?.name ||
          summaries['invited-position-summary']?.['role-title'],
        original: summaries['invited-position-summary'],
      })
      break
    }
  }

  const distinctions = []
  // distinctions: activities.distinctions.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['distinctions']?.['affiliation-group'] ||
    []) {
    // Get just the first element from each group
    for (const summaries of groups.summaries || []) {
      distinctions.push({
        type: 'distinction',
        title:
          summaries['distinction-summary'].organization?.name ||
          summaries['distinction-summary']?.['role-title'],
        original: summaries['distinction-summary'],
      })
      break
    }
  }

  const memberships = []
  // memberships: activities.memberships.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['memberships']?.['affiliation-group'] ||
    []) {
    // Get just the first element from each group
    for (const summaries of groups.summaries || []) {
      memberships.push({
        type: 'membership',
        title:
          summaries['membership-summary'].organization?.name ||
          summaries['membership-summary']?.['role-title'],
        original: summaries['membership-summary'],
      })
      break
    }
  }

  const services = []
  const editorialServices = []
  // memberships: activities.services.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['services']?.['affiliation-group'] || []) {
    // Get just the first element from each group
    for (const summaries of groups.summaries || []) {
      // If there is an issn, then it will be set as an editorial service
      const isEditorialService = summaries['external-ids']?.[
        'external-id'
      ]?.some((extId) => extId['external-id-type'] === 'issn')
      if (isEditorialService) {
        editorialServices.push({
          type: 'editorial-service',
          title:
            summaries['service-summary'].organization?.name ||
            summaries['service-summary']?.['role-title'],
          original: summaries['service-summary'],
        })
      } else {
        services.push({
          type: 'service',
          title:
            summaries['service-summary'].organization?.name ||
            summaries['service-summary']?.['role-title'],
          original: summaries['service-summary'],
        })
      }
      break
    }
  }

  const merged = [
    ...invitedPositions,
    ...distinctions,
    ...memberships,
    ...editorialServices,
    ...services,
  ]
  merged.sort((a, b) => a.title.localeCompare(b.title))

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(
      section,
      STRINGS.professionalActivities,
      merged,
      (e) =>
        composeActivityEntryFromJson(e.original, {
          title: e.title,
          type: e.type,
        })
    ) || hasContent
  return hasContent
}

function renderFundings(activities, section) {
  const fundingSummaries = []
  for (const group of activities?.fundings?.group || []) {
    fundingSummaries.push(group['funding-summary'][0])
  }

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(
      section,
      STRINGS.fundings,
      fundingSummaries,
      (f) =>
        composeActivityEntryFromJson(f, { title: jsonText(f?.title?.title) })
    ) || hasContent
  return hasContent
}

function renderResearchResources(activities, section) {
  // Research resources: activities.research-resources.group.research-resource-summary
  const researchResourceSummaries = []
  for (const group of activities?.['research-resources']?.group || []) {
    researchResourceSummaries.push(group['research-resource-summary'][0])
  }

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(
      section,
      STRINGS.researchResources,
      researchResourceSummaries,
      (r) =>
        composeActivityEntryFromJson(r, {
          title:
            jsonText(r?.proposal?.title?.title) ||
            jsonText(r?.proposal?.url?.value),
        })
    ) || hasContent
  return hasContent
}

function renderPeerReviews(activities, section) {
  let reviews = 0
  const publications = new Set()
  const peerReviewsPerPublication = new Map()
  // Peer reviews: activities.peer-reviews.group.peer-review-group
  for (const group of activities?.['peer-reviews']?.group || []) {
    for (const peerReviewGroup of group['peer-review-group'] || []) {
      // Just process the first peer review element on each group
      const firstPeerReviewSummary = peerReviewGroup['peer-review-summary'][0]
      const numOfReviewsInGroup = peerReviewGroup['peer-review-summary'].length
      reviews += numOfReviewsInGroup
      const publication = firstPeerReviewSummary['review-group-id']
      if (publications.has(publication)) {
        const count = peerReviewsPerPublication.get(publication)
        peerReviewsPerPublication.set(publication, count + 1)
      } else {
        publications.add(publication)
        peerReviewsPerPublication.set(publication, 1)
      }
    }
  }

  if (publications.size > 0) {
    // Sorted publications
    const sortedPublications = new Set([...publications].sort())
    const block = document.createElement('div')
    block.className = 'activity-group'
    const heading = document.createElement('h3')
    heading.textContent = peerReviewHeadingText(
      reviews,
      sortedPublications.size
    )
    block.appendChild(heading)
    const list = document.createElement('ul')
    for (publication of sortedPublications || []) {
      const numberOfPublications = peerReviewsPerPublication.get(publication)
      const li = document.createElement('li')
      const strong = document.createElement('strong')
      strong.textContent = publication
      li.appendChild(strong)
      li.appendChild(document.createTextNode(' (' + numberOfPublications + ')'))
      list.appendChild(li)
    }
    block.appendChild(list)
    section.appendChild(block)
    return true
  }

  return false
}

function renderActivitiesFromJson(recordJson, container) {
  const activities = recordJson?.['activities-summary']
  if (!activities) return

  const section = makeSection(STRINGS.activities)
  let hasContent = false

  if (renderEmployments(activities, section)) hasContent = true
  if (renderEducationsAndQualifications(activities, section)) hasContent = true
  if (renderProfessionalActivities(activities, section)) hasContent = true
  if (renderFundings(activities, section)) hasContent = true
  if (renderResearchResources(activities, section)) hasContent = true
  if (renderWorks(activities, section)) hasContent = true
  if (renderPeerReviews(activities, section)) hasContent = true

  if (hasContent) container.appendChild(section)
}

function renderRecord(recordJson) {
  if (!recordJson || typeof recordJson !== 'object') {
    throw new Error(STRINGS.recordNotFound)
  }
  clearNode(cvRoot)
  const container = renderIdentityFromJson(recordJson)
  renderBiographyFromJson(recordJson, container)
  renderPersonalInfoFromJson(recordJson, container)
  renderActivitiesFromJson(recordJson, container)
  cvRoot.appendChild(container)
}

async function fetchOrcidRecord(orcidId) {
  /** Same-origin UI endpoint (e.g. org.orcid.frontend.web.api.v3.UiPublicV3RecordController). */
  const url = new URL(
    `/${encodeURIComponent(orcidId)}/record`,
    window.location.origin
  )
  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    redirect: 'manual',
    headers: {
      Accept: 'application/vnd.orcid+json, application/json;q=0.9',
    },
  })
  if (response.status === 301 || response.status === 302) {
    const primaryFromHeader = normalizeOrcidId(
      response.headers.get('x-orcid-primary')
    )
    const location =
      response.headers.get('location') || response.headers.get('Location')
    const primaryFromLocation = location ? normalizeOrcidId(location) : ''
    const primaryOrcid = primaryFromHeader || primaryFromLocation
    if (primaryOrcid) {
      window.location.replace(`/${encodeURIComponent(primaryOrcid)}/print`)
      throw new Error(STRINGS.redirectingToPrimary)
    }
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch ORCID record (${response.status}).`)
  }

  const recordJson = await response.json()
  return { recordJson }
}

async function loadRecord(orcidId) {
  clearStatus()
  cvRoot.setAttribute('aria-busy', 'true')
  const loading = document.createElement('p')
  loading.className = 'loading'
  loading.textContent = STRINGS.loadingRecord
  clearNode(cvRoot)
  cvRoot.appendChild(loading)

  try {
    const { recordJson } = await fetchOrcidRecord(orcidId)
    renderRecord(recordJson)
    clearStatus()
    cvRoot.setAttribute('aria-busy', 'false')
  } catch (error) {
    clearNode(cvRoot)
    const message = document.createElement('p')
    message.className = 'error'
    message.textContent = error.message
    cvRoot.appendChild(message)
    showStatus(`Could not load ${orcidId}.`, 'error')
    cvRoot.setAttribute('aria-busy', 'false')
  }
}

// Guard: only run DOM initialization when the required elements are present.
// This allows the file to be loaded in test environments (Karma/Jasmine) where
// the print-view HTML is not present and getElementById returns null.
if (cvRoot && statusNode && printButton) {
  printButton.textContent = STRINGS.printSaveAsPdf
  printButton.setAttribute('aria-label', STRINGS.printThisOrcidProfile)
  printButton.addEventListener('click', () => window.print())

  const startingId = resolveOrcidIdFromLocation()
  if (startingId) {
    syncOrcidInUrl(startingId)
    loadRecord(startingId)
  } else {
    clearStatus()
    console.log('-------------------------------')
    console.log('ERROR: No ORCID ID found in URL')
    console.log('-------------------------------')
  }
}
