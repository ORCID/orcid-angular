/**
 * The homepage content contract.
 *
 * These types mirror `schema/home.schema.json` in the orcid-homepage-decap-cms
 * repository, which publishes the documents this app fetches at runtime. The
 * two move independently: content is edited and released there without a
 * release here, and only a change to the *shape* of the document needs both.
 *
 * `schemaVersion` is what makes that safe. This build renders major version 1
 * and refuses anything else, falling back to the static homepage rather than
 * rendering a document it does not understand.
 */

export const HOMEPAGE_CONTENT_SCHEMA_MAJOR = 1

export interface HomepageFeature {
  id: string
  /** Path relative to the content bundle; absolute by the time a component sees it. */
  icon: string
  title: string
  /** Markdown-lite: paragraphs, **bold** and [text](https://…) only. */
  body: string
}

export interface HomepageAudience {
  id: string
  label: string
  background: string
  intro: string
  features: HomepageFeature[]
}

export interface HomepageFeaturedNews {
  kicker: string
  title: string
  body: string
  /** Digits only. Validated again before it is used to build a player URL. */
  vimeoId: string
}

export interface HomepageIntegrateParagraph {
  id: string
  body: string
}

export interface HomepageIntegrate {
  title: string
  paragraphs: HomepageIntegrateParagraph[]
}

export interface HomepageContentMeta {
  locale: string
  version: string
  commit: string
  generatedAt: string
  /** How many strings this locale actually translates, out of `total`. */
  translated: number
  total: number
}

export interface HomepageContent {
  schemaVersion: number
  meta?: HomepageContentMeta
  hero: { title: string }
  audiences: HomepageAudience[]
  featuredNews: HomepageFeaturedNews
  integrate: HomepageIntegrate
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function isFeature(value: unknown): value is HomepageFeature {
  return (
    isObject(value) &&
    isNonEmptyString(value['id']) &&
    isNonEmptyString(value['icon']) &&
    isNonEmptyString(value['title']) &&
    isNonEmptyString(value['body'])
  )
}

function isAudience(value: unknown): value is HomepageAudience {
  return (
    isObject(value) &&
    isNonEmptyString(value['id']) &&
    isNonEmptyString(value['label']) &&
    isNonEmptyString(value['background']) &&
    isNonEmptyString(value['intro']) &&
    Array.isArray(value['features']) &&
    value['features'].length > 0 &&
    value['features'].every(isFeature)
  )
}

/**
 * Whether a fetched document is one this build can render.
 *
 * The check is deliberately structural rather than a full schema validation.
 * The publisher validates against the schema before anything is deployed; what
 * matters here is never handing a component a field it will read as undefined,
 * and never rendering a document from a future major version.
 */
export function isSupportedHomepageContent(
  value: unknown
): value is HomepageContent {
  if (!isObject(value)) {
    return false
  }

  const version = value['schemaVersion']
  if (
    typeof version !== 'number' ||
    !Number.isInteger(version) ||
    version !== HOMEPAGE_CONTENT_SCHEMA_MAJOR
  ) {
    return false
  }

  const hero = value['hero']
  const news = value['featuredNews']
  const integrate = value['integrate']

  return (
    isObject(hero) &&
    isNonEmptyString(hero['title']) &&
    Array.isArray(value['audiences']) &&
    value['audiences'].length > 0 &&
    value['audiences'].every(isAudience) &&
    isObject(news) &&
    isNonEmptyString(news['kicker']) &&
    isNonEmptyString(news['title']) &&
    isNonEmptyString(news['body']) &&
    isNonEmptyString(news['vimeoId']) &&
    isObject(integrate) &&
    isNonEmptyString(integrate['title']) &&
    Array.isArray(integrate['paragraphs']) &&
    integrate['paragraphs'].every(
      (paragraph: unknown) =>
        isObject(paragraph) &&
        isNonEmptyString(paragraph['id']) &&
        isNonEmptyString(paragraph['body'])
    )
  )
}
