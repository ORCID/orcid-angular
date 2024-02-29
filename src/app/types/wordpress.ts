export interface WordpressPost {
  id: number
  date: string
  date_gmt: string
  guid: Guid
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: Title
  content: Content
  excerpt: Excerpt
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: Meta
  categories: number[]
  tags: number[]
  ppma_author: number[]
  yoast_head: string
  yoast_head_json: YoastHeadJson
  jetpack_sharing_enabled: boolean
  featured_image_src: any
  featured_image_src_square: any
  author_info: AuthorInfo
  jetpack_featured_media_url: string
  'jetpack-related-posts': any[]
  authors: Author2[]
  gt_translate_keys: GtTranslateKey4[]
  _links: Links
}

export interface Guid {
  rendered: string
}

export interface Title {
  rendered: string
  gt_translate_keys: GtTranslateKey[]
}

export interface GtTranslateKey {
  key: string
  format: string
}

export interface Content {
  rendered: string
  protected: boolean
  gt_translate_keys: GtTranslateKey2[]
}

export interface GtTranslateKey2 {
  key: string
  format: string
}

export interface Excerpt {
  rendered: string
  protected: boolean
  gt_translate_keys: GtTranslateKey3[]
}

export interface GtTranslateKey3 {
  key: string
  format: string
}

export interface Meta {
  _tec_requires_first_save: boolean
  _eb_attr: string
  _genesis_hide_title: boolean
  _genesis_hide_breadcrumbs: boolean
  _genesis_hide_singular_image: boolean
  _genesis_hide_footer_widgets: boolean
  _genesis_custom_body_class: string
  _genesis_custom_post_class: string
  _genesis_layout: string
  _EventAllDay: boolean
  _EventTimezone: string
  _EventStartDate: string
  _EventEndDate: string
  _EventStartDateUTC: string
  _EventEndDateUTC: string
  _EventShowMap: boolean
  _EventShowMapLink: boolean
  _EventURL: string
  _EventCost: string
  _EventCostDescription: string
  _EventCurrencySymbol: string
  _EventCurrencyCode: string
  _EventCurrencyPosition: string
  _EventDateTimeSeparator: string
  _EventTimeRangeSeparator: string
  _EventOrganizerID: any[]
  _EventVenueID: any[]
  _OrganizerEmail: string
  _OrganizerPhone: string
  _OrganizerWebsite: string
  _VenueAddress: string
  _VenueCity: string
  _VenueCountry: string
  _VenueProvince: string
  _VenueState: string
  _VenueZip: string
  _VenuePhone: string
  _VenueURL: string
  _VenueStateProvince: string
  _VenueLat: string
  _VenueLng: string
  _VenueShowMap: boolean
  _VenueShowMapLink: boolean
  _tribe_blocks_recurrence_rules: string
  _tribe_blocks_recurrence_description: string
  _tribe_blocks_recurrence_exclusions: string
  footnotes: string
}

export interface YoastHeadJson {
  title: string
  description: string
  robots: Robots
  canonical: string
  og_locale: string
  og_type: string
  og_title: string
  og_description: string
  og_url: string
  og_site_name: string
  article_publisher: string
  article_published_time: string
  article_modified_time: string
  og_image: OgImage[]
  author: string
  twitter_card: string
  twitter_creator: string
  twitter_site: string
  twitter_misc: TwitterMisc
  schema: Schema
}

export interface Robots {
  index: string
  follow: string
  'max-snippet': string
  'max-image-preview': string
  'max-video-preview': string
}

export interface OgImage {
  url: string
}

export interface TwitterMisc {
  'Written by': string
  'Est. reading time': string
}

export interface Schema {
  '@context': string
  '@graph': Graph[]
}

export interface Graph {
  '@type': string
  '@id': string
  isPartOf?: IsPartOf
  author?: Author
  headline?: string
  datePublished?: string
  dateModified?: string
  mainEntityOfPage?: MainEntityOfPage
  wordCount?: number
  publisher?: Publisher
  keywords?: string[]
  articleSection?: string[]
  inLanguage?: string
  url?: string
  name?: string
  description?: string
  breadcrumb?: Breadcrumb
  potentialAction?: PotentialAction[]
  itemListElement?: ItemListElement[]
  logo?: Logo
  image?: Image
  sameAs?: string[]
}

export interface IsPartOf {
  '@id': string
}

export interface Author {
  name: string
  '@id': string
}

export interface MainEntityOfPage {
  '@id': string
}

export interface Publisher {
  '@id': string
}

export interface Breadcrumb {
  '@id': string
}

export interface PotentialAction {
  '@type': string
  target: any
  'query-input'?: string
}

export interface ItemListElement {
  '@type': string
  position: number
  name: string
  item?: string
}

export interface Logo {
  '@type': string
  inLanguage: string
  '@id': string
  url: string
  contentUrl: string
  width: number
  height: number
  caption: string
}

export interface Image {
  '@type'?: string
  inLanguage?: string
  '@id': string
  url?: string
  contentUrl?: string
  caption?: string
}

export interface AuthorInfo {
  display_name: string
  author_link: string
}

export interface Author2 {
  term_id: number
  user_id: number
  is_guest: number
  slug: string
  display_name: string
  avatar_url: AvatarUrl
  user_url: string
  last_name: string
  first_name: string
  description: string
}

export interface AvatarUrl {
  url: string
  url2x: string
}

export interface GtTranslateKey4 {
  key: string
  format: string
}

export interface Links {
  self: Self[]
  collection: Collection[]
  about: About[]
  author: Author3[]
  replies: Reply[]
  'version-history': VersionHistory[]
  'predecessor-version': PredecessorVersion[]
  'wp:attachment': WpAttachment[]
  'wp:term': WpTerm[]
  curies: Cury[]
}

export interface Self {
  href: string
}

export interface Collection {
  href: string
}

export interface About {
  href: string
}

export interface Author3 {
  embeddable: boolean
  href: string
}

export interface Reply {
  embeddable: boolean
  href: string
}

export interface VersionHistory {
  count: number
  href: string
}

export interface PredecessorVersion {
  id: number
  href: string
}

export interface WpAttachment {
  href: string
}

export interface WpTerm {
  taxonomy: string
  embeddable: boolean
  href: string
}

export interface Cury {
  name: string
  href: string
  templated: boolean
}
