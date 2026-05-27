import {
  Affiliation,
  AffiliationUIGroup,
} from 'src/app/types/record-affiliation.endpoint'

export function getFeaturedEmploymentCaption(
  affiliations?: AffiliationUIGroup[]
): string {
  if (!affiliations || affiliations.length === 0) {
    return ''
  }

  const employmentGroup = affiliations.find(
    (group) => group.type === 'EMPLOYMENT'
  )

  if (!employmentGroup || !employmentGroup.affiliationGroup) {
    return ''
  }

  for (const group of employmentGroup.affiliationGroup) {
    if (!group.affiliations) {
      continue
    }

    const featuredAffiliation = group.affiliations.find(
      (affiliation) =>
        affiliation.featured === true &&
        affiliation.affiliationType?.value === 'employment'
    )

    if (featuredAffiliation) {
      return formatAffiliationCaption(featuredAffiliation)
    }
  }

  return ''
}

function formatAffiliationCaption(affiliation: Affiliation): string {
  const parts: string[] = []

  const orgName = affiliation.affiliationName?.value
  if (orgName) {
    parts.push(orgName)
  }

  const locationParts: string[] = []
  if (affiliation.city?.value) {
    locationParts.push(affiliation.city.value)
  }
  if (affiliation.region?.value) {
    locationParts.push(affiliation.region.value)
  }
  if (affiliation.countryForDisplay) {
    locationParts.push(affiliation.countryForDisplay)
  } else if (affiliation.country?.value) {
    locationParts.push(affiliation.country.value)
  }

  if (orgName && locationParts.length > 0) {
    parts[0] = `${orgName}: ${locationParts.join(', ')}`
  } else if (locationParts.length > 0) {
    parts.push(locationParts.join(', '))
  }

  const roleParts: string[] = []
  if (affiliation.roleTitle?.value) {
    roleParts.push(affiliation.roleTitle.value)
  }
  if (affiliation.departmentName?.value) {
    roleParts.push(affiliation.departmentName.value)
  }

  if (roleParts.length > 0) {
    if (parts.length > 0) {
      parts.push(`- ${roleParts.join(', ')}`)
    } else {
      parts.push(roleParts.join(', '))
    }
  }

  return parts.join(' ')
}
