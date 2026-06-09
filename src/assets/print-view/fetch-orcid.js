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

function renderOrcidPrompt(message = '') {
  clearNode(cvRoot)
  cvRoot.setAttribute('aria-busy', 'false')

  const card = document.createElement('section')
  card.className = 'orcid-prompt'

  const heading = document.createElement('h2')
  heading.textContent = 'Enter an ORCID iD'
  card.appendChild(heading)

  const help = document.createElement('p')
  help.textContent = 'Add an ORCID iD to the URL or use the form below.'
  card.appendChild(help)

  const form = document.createElement('form')
  form.className = 'orcid-prompt-form'
  form.setAttribute('novalidate', 'novalidate')

  const input = document.createElement('input')
  input.type = 'text'
  input.name = 'orcid'
  input.placeholder = '0000-0000-0000-0000'
  input.setAttribute('aria-label', 'ORCID iD')
  input.required = true
  form.appendChild(input)

  const button = document.createElement('button')
  button.type = 'submit'
  button.textContent = 'Load profile'
  form.appendChild(button)

  const formError = document.createElement('p')
  formError.className = 'orcid-prompt-error'
  if (message) formError.textContent = message
  form.appendChild(formError)

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const orcidId = normalizeOrcidId(input.value)
    if (!orcidId) {
      formError.textContent =
        'Enter a valid ORCID iD (format: 0000-0000-0000-0000).'
      input.focus()
      return
    }
    clearStatus()
    syncOrcidInUrl(orcidId)
    loadRecord(orcidId)
  })

  card.appendChild(form)
  cvRoot.appendChild(card)
}

function appendParagraph(section, content) {
  if (!content) return
  const p = document.createElement('p')
  p.textContent = content
  section.appendChild(p)
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

function renderIdentityFromJson(recordJson) {
  const person = recordJson?.person
  const name = person?.name
  const given = jsonText(name?.['given-names'])
  const family = jsonText(name?.['family-Nam'])
  const credit = jsonText(name?.['credit-name'])
  const fullName = [given, family].filter(Boolean).join(' ')
  const chosenName = credit || fullName || 'Unnamed ORCID profile'

  const container = document.createElement('article')
  container.className = 'cv-container'
  container.setAttribute('aria-label', `${chosenName} ORCID profile`)

  const header = document.createElement('header')
  const title = document.createElement('h1')
  title.textContent = chosenName
  header.appendChild(title)

  const otherNames = jsonList(person?.otherNames?.otherNames)
    .map((n) => jsonText(n?.content))
    .filter(Boolean)
  if (otherNames.length) {
    const namesLine = document.createElement('p')
    namesLine.className = 'other-names'
    namesLine.textContent = otherNames.join('; ')
    header.appendChild(namesLine)
  }

  const orcidUri = jsonOrcidUri(recordJson?.orcidIdentifier)
  if (orcidUri) {
    const orcidRow = document.createElement('div')
    orcidRow.className = 'orcid-id'

    const icon = document.createElement('img')
    icon.src = 'https://orcid.org/assets/vectors/orcid.logo.black.icon.svg'
    icon.alt = 'ORCID iD'
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
  
  if (typeof myVar === 'string' && myVar.length === 0) return     

  const bioSection = makeSection('Biography')
  const bioLine = document.createElement('p')
  bioLine.className = 'other-names'
  bioLine.textContent = biography
  bioSection.appendChild(bioLine)
  container.appendChild(bioSection)
}

function renderPersonalInfoFromJson(recordJson, container) {
  const person = recordJson?.person
  if (!person) return

  const section = makeSection('Personal information')
  const blocks = []

  const emails = jsonList(person?.emails?.email)
    .map((e) => jsonText(e?.email))
    .filter(Boolean)
  if (emails.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = 'Emails'
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
    title.textContent = 'Websites & social links'
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

  const externalIds = jsonList(person?.['external-identifiers']?.['external-identifier'])
    .map((id) => ({
      type: jsonText(id?.['external-id-type']),
      value: jsonText(id?.['external-id-value']),
      url: sanitizeUrl(jsonText(id?.['external-id-url']?.value) || jsonText(id?.url)),
    }))
    .filter((id) => id.type || id.value || id.url)
  if (externalIds.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = 'Other IDs'
    block.appendChild(title)
    const lines = externalIds.map((entry) => {
      const label = entry.type || 'Identifier'
      const value = entry.value || entry.url || ''
      return textLineNode(label, value, entry.url)
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
    title.textContent = 'Keywords'
    block.appendChild(title)
    appendList(block, [textLineNode('', keywords.join(', '))])
    blocks.push(block)
  }  

  const countries = jsonList(person?.addresses?.address)
    .map((a) => {
      return jsonText(a?.country)
    })
    .filter(Boolean)

  if (countries.length) {
    const block = document.createElement('div')
    const title = document.createElement('h3')
    title.textContent = 'Countries'
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
    'Untitled'
  const titleNode = document.createElement('strong')
  titleNode.textContent = title
  wrapper.appendChild(titleNode)
  
  const org = jsonText(entry?.organization?.name)
  if (org && org !== title)
    wrapper.appendChild(textLineNode('Organization', org))

  const orgAddress = [
    jsonText(entry?.organization?.address?.city),
    jsonText(entry?.organization?.address?.region),
    jsonText(entry?.organization?.address?.country),
  ]
    .filter(Boolean)
    .join(', ')  
  if (orgAddress)
    wrapper.appendChild(textLineNode('Organization address', orgAddress))

  const start = jsonDate(entry?.['start-date'])
  const end = jsonDate(entry?.['end-date'])
  if (start) wrapper.appendChild(textLineNode('Start date', start))
  if (end) wrapper.appendChild(textLineNode('End date', end))

  const pub = jsonDate(entry?.['publication-date'])
  if (pub) wrapper.appendChild(textLineNode('Publication date', pub))
  const journal = jsonText(entry?.['journal-title'])
  if (journal) wrapper.appendChild(textLineNode('Journal', journal))
  const roleTitle = jsonText(entry?.['role-title'])
  if (roleTitle) wrapper.appendChild(textLineNode('Role title', roleTitle))
  const dept = jsonText(entry?.['department-nName'])
  if (dept) wrapper.appendChild(textLineNode('Department', dept))
  const type = jsonText(entry?.type)
  if (type) wrapper.appendChild(textLineNode('Type', type))

  const url = sanitizeUrl(jsonText(entry?.url?.value) || jsonText(entry?.url))
  if (url) wrapper.appendChild(textLineNode('URL', url, url))

  if (opts.type) {
    wrapper.appendChild(textLineNode('Type', opts.type))
  }

  // External identifiers (works / fundings etc)
  console.log("1")
  console.log(JSON.stringify(entry))
  console.log("2")
  console.log(JSON.stringify(entry?.['external-ids']))
  const extIds =
    entry?.['external-ids']?.['external-id'] || entry?.proposal?.['external-ids']?.['external-id'] || 
    []
  if (Array.isArray(extIds) && extIds.length) {
    extIds.forEach((id) => {
      const idType = jsonText(id.type || id['external-id-type'])
      const idValue = jsonText(id.value || id['external-id-value'])
      const idRel = jsonText(id.relationship || id['external-id-relationship'])
      const idUrl = sanitizeUrl(
        jsonText(
          id['external-id-url']?.value
        )
      )
      const label =
        idRel && idRel.toLowerCase() !== 'self'
          ? `${idRel} ${idType}`
          : idType || 'Identifier'
      wrapper.appendChild(textLineNode(label, idValue || idUrl || '', idUrl))
    })
  }

  return wrapper
}

function renderEmployments(activities, section) {
  // Employments: activities-summary.employments.affiliation-group[].summaries[]
  const employments = []
  
  for (const groups of activities?.employments?.['affiliation-group']) {
    // Get just the first element from each group
    for(const summaries of groups.summaries) {
      employments.push(summaries['employment-summary'])
      break;
    }
  }

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(section, 'Employments', employments, (e) =>
      composeActivityEntryFromJson(e, {
        title: jsonText(e?.organization?.name) || jsonText(e?.roleTitle),
      })
    ) || hasContent
    return hasContent
}

function renderEducationsAndQualifications(activities, section) {  
  const educations = [] 
  // Educations: activities.educations.affiliation-group[].[0].summaries[]
  for (const groups of activities?.educations?.['affiliation-group']) {
    // Get just the first element from each group
    for(const summaries of groups.summaries) {
      educations.push({
        type: 'education',
        title: summaries['education-summary'].organization?.name || summaries['education-summary']?.['role-title'],
        original: summaries['education-summary']
      })
      break;
    }
  }  
  
  // Qualifications: activities.qualifications.affiliation-group[].[0].summaries[]
  const qualifications = []
  for (const groups of activities?.qualifications?.['affiliation-group']) {
    // Get just the first element from each group
    for(const summaries of groups.summaries) {
      qualifications.push({
        type: 'qualification',
        title: summaries['qualification-summary'].organization?.name || summaries['qualification-summary']?.['role-title'],
        original: summaries['qualification-summary']
      })
      break;
    }
  }  

  const merged = [...educations, ...qualifications]  
  merged.sort((a,b) => a.title.localeCompare(b.title))
  
  hasContent = false
  hasContent =
    renderActivityGroupFromJson(section, 'Education and qualifications', merged, (e) =>
      composeActivityEntryFromJson(e.original, { title: e.title, type: e.type })
    ) || hasContent   
    return hasContent
}

function renderWorks(activities, section) {
  // Works: activities-summary.works.group[].work-summary[]
  const workSummaries = (activities?.works?.group || []).flatMap(
    (g) => g?.['work-summary'] || []
  )
  hasContent = false
  hasContent =
    renderActivityGroupFromJson(section, 'Works', workSummaries, (w) =>
      composeActivityEntryFromJson(w, { title: jsonText(w?.title?.title) })
    ) || hasContent
  return hasContent
}

function renderProfessionalActivities(activities, section) {
  const invitedPositions = [] 
  // invitedPositions: activities.invited-positions.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['invited-positions']?.['affiliation-group']) {
    // Get just the first element from each group
    for(const summaries of groups.summaries) {
      invitedPositions.push({
        type: 'invited-position',
        title: summaries['invited-position-summary'].organization?.name || summaries['invited-position-summary']?.['role-title'],
        original: summaries['invited-position-summary']
      })
      break;
    }
  }  

  const distinctions = [] 
  // distinctions: activities.distinctions.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['distinctions']?.['affiliation-group']) {
    // Get just the first element from each group
    for(const summaries of groups.summaries) {
      distinctions.push({
        type: 'distinction',
        title: summaries['distinction-summary'].organization?.name || summaries['distinction-summary']?.['role-title'],
        original: summaries['distinction-summary']
      })
      break;
    }
  }  

  const memberships = [] 
  // memberships: activities.memberships.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['memberships']?.['affiliation-group']) {
    // Get just the first element from each group
    for(const summaries of groups.summaries) {
      memberships.push({
        type: 'membership',
        title: summaries['membership-summary'].organization?.name || summaries['membership-summary']?.['role-title'],
        original: summaries['membership-summary']
      })
      break;
    }
  }  

  const services = [] 
  const editorialServices = []
  // memberships: activities.services.affiliation-group[].[0].summaries[]
  for (const groups of activities?.['services']?.['affiliation-group']) {
    // Get just the first element from each group
    for(const summaries of groups.summaries) {
      // If there is an issn, then it will be set as an editorial service
      const isEditorialService = summaries['external-ids']?.['external-id']?.some(extId => extId['external-id-type'] === 'issn')
      if(isEditorialService) {
        editorialServices.push({
        type: 'editorial-service',
        title: summaries['service-summary'].organization?.name || summaries['service-summary']?.['role-title'],
        original: summaries['service-summary']
        })
      } else {
        services.push({
        type: 'service',
        title: summaries['service-summary'].organization?.name || summaries['service-summary']?.['role-title'],
        original: summaries['service-summary']
        })
      }      
      break;
    }
  }  

  const merged = [...invitedPositions, ...distinctions, ...memberships, ...editorialServices, ...services]  
  merged.sort((a,b) => a.title.localeCompare(b.title))

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(section, 'Professional activities', merged, (e) =>
      composeActivityEntryFromJson(e.original, { title: e.title, type: e.type })
    ) || hasContent   
    return hasContent
}

function renderFundings(activities, section) {  
  // Fundings: activitiesSummary.fundings.group[].activities[]
  const fundings = (activities?.fundings?.group || []).flatMap(
    (g) => g?.['funding-summary'] || []
  )
  hasContent = false
  hasContent =
    renderActivityGroupFromJson(section, 'Fundings', fundings, (f) =>
      composeActivityEntryFromJson(f, { title: jsonText(f?.title?.title) })
    ) || hasContent    
  return hasContent
}

function renderResearchResources(activities, section) {
  // Research resources: activities.research-resources.group.research-resource-summary
  const researchResources = (
    activities?.['research-resources']?.group || []
  ).flatMap((g) => g?.['research-resource-summary'] || [])
  

  hasContent = false
  hasContent =
    renderActivityGroupFromJson(section, 'Research Resources', researchResources, (r) =>
      composeActivityEntryFromJson(r, { title: jsonText(r?.proposal?.title?.title) || jsonText(r?.proposal?.url?.value), })
    ) || hasContent    
  return hasContent
}

function renderActivitiesFromJson(recordJson, container) {  
  const activities = recordJson?.['activities-summary']  
  if (!activities) return

  const section = makeSection('Activities')
  let hasContent = false

  //if(renderEmployments(activities, section)) hasContent = true  
  //if(renderEducationsAndQualifications(activities, section)) hasContent = true  
  //if(renderProfessionalActivities(activities, section)) hasContent = true  
  //if(renderFundings(activities, section)) hasContent = true  
  if(renderResearchResources(activities, section)) hasContent = true  
  //if(renderWorks(activities, section)) hasContent = true  

  // Peer reviews: activitiesSummary.peerReviews.peerReviewGroup[].peerReviewGroup[].peerReviewSummary[]
  const peerReviews = (activities?.peerReviews?.peerReviewGroup || []).flatMap(
    (g) =>
      (g?.peerReviewGroup || []).flatMap((gg) => gg?.peerReviewSummary || [])
  )
  hasContent =
    renderActivityGroupFromJson(section, 'Peer reviews', peerReviews, (p) =>
      composeActivityEntryFromJson(p, {
        title: jsonText(p?.organization?.name) || jsonText(p?.groupId),
      })
    ) || hasContent

  

  if (hasContent) container.appendChild(section)
}

function renderRecord(recordJson) {
  if (!recordJson || typeof recordJson !== 'object') {
    throw new Error('Record data was not found in ORCID response.')
  }
  clearNode(cvRoot)
  const container = renderIdentityFromJson(recordJson)
  //renderBiographyFromJson(recordJson, container)
  //renderPersonalInfoFromJson(recordJson, container)
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
      throw new Error('Redirecting to primary ORCID record…')
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
  loading.textContent = 'Loading ORCID record...'
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

printButton.addEventListener('click', () => window.print())

const startingId = resolveOrcidIdFromLocation()
if (startingId) {
  syncOrcidInUrl(startingId)
  loadRecord(startingId)
} else {
  clearStatus()
  renderOrcidPrompt()
}
