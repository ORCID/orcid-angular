import { ExternalIdentifier, MonthDayYearDate, Value } from './common.endpoint'

export interface Citation {
  citation: Value
  citationType: Value
  errors: any[]
  getRequiredMessage?: any
  required: boolean
}

export enum WorkCategories {
  publication = 'publication',
  conference = 'conference',
  intellectual_property = 'intellectual_property',
  other_output = 'other_output',
}

export enum WorkPublicationTypes {
  book = 'book',
  bookChapter = 'book-chapter',
  bookReview = 'book-review',
  dictionaryEntry = 'dictionary-entry',
  dissertationThesis = 'dissertation-thesis',
  editedBook = 'edited-book',
  encyclopediaEntry = 'encyclopedia-entry',
  journalArticle = 'journal-article',
  journalIssue = 'journal-issue',
  magazineArticle = 'magazine-article',
  manual = 'manual',
  newsletterArticle = 'newsletter-article',
  newspaperArticle = 'newspaper-article',
  onlineResource = 'online-resource',
  preprint = 'preprint',
  report = 'report',
  researchTool = 'research-tool',
  supervisedStudentPublication = 'supervised-student-publication',
  test = 'test',
  translation = 'translation',
  website = 'website',
  workingPaper = 'working-paper',
  review = 'review',
}

export enum WorkConferenceTypes {
  conferenceAbstract = 'conference-abstract',
  conferencePaper = 'conference-paper',
  conferencePoster = 'conference-poster',
}

export enum WorkIntellectualPropertyTypes {
  disclosure = 'disclosure',
  license = 'license',
  patent = 'patent',
  registeredCopyright = 'registered-copyright',
  trademark = 'trademark',
}

export enum WorkOtherOutputTypes {
  annotation = 'annotation',
  artisticPerformance = 'artistic-performance',
  dataManagementPlan = 'data-management-plan', //
  dataSet = 'data-set',
  invention = 'invention',
  lectureSpeech = 'lecture-speech',
  other = 'other',
  physicalObject = 'physical-object',
  researchTechnique = 'research-technique',
  software = 'software', //
  spinOffCompany = 'spin-off-company',
  standardsAndPolicy = 'standards-and-policy',
  technicalStandard = 'technical-standard',
}

export const WorkCategoriesLabel = {
  [WorkCategories.conference]: $localize`:@@works.conference:Conference`,
  [WorkCategories.intellectual_property]: $localize`:@@works.intellectual:Intellectual property`,
  [WorkCategories.other_output]: $localize`:@@works.other:Other`,
  [WorkCategories.publication]: $localize`:@@works.publication:Publication`,
}

export const WorkTypesLabels = {
  [WorkCategories.conference]: {
    [WorkConferenceTypes.conferenceAbstract]: $localize`:@@works.abstract:Conference abstract`,
    [WorkConferenceTypes.conferencePaper]: $localize`:@@works.paper:Conference paper`,
    [WorkConferenceTypes.conferencePoster]: $localize`:@@works.poster:Conference poster`,
  },
  [WorkCategories.publication]: {
    [WorkPublicationTypes.bookChapter]: $localize`:@@works.chapter:Book chapter`,
    [WorkPublicationTypes.bookReview]: $localize`:@@works.review:Book review`,
    [WorkPublicationTypes.book]: $localize`:@@works.book:Book`,
    [WorkPublicationTypes.dictionaryEntry]: $localize`:@@works.entry:Dictionary entry`,
    [WorkPublicationTypes.dissertationThesis]: $localize`:@@works.thesis:Dissertation/Thesis`,
    [WorkPublicationTypes.editedBook]: $localize`:@@works.editedBook:Edited book`,
    [WorkPublicationTypes.encyclopediaEntry]: $localize`:@@works.encyclopediaEntry:Encyclopedia entry`,
    [WorkPublicationTypes.journalArticle]: $localize`:@@works.journalArticle:Journal article`,
    [WorkPublicationTypes.journalIssue]: $localize`:@@works.issue:Journal issue or edition`,
    [WorkPublicationTypes.magazineArticle]: $localize`:@@works.magazineArticle:Magazine article`,
    [WorkPublicationTypes.manual]: $localize`:@@works.manual:Manual`,
    [WorkPublicationTypes.newsletterArticle]: $localize`:@@works.newsletterarticle:Newsletter article`,
    [WorkPublicationTypes.newspaperArticle]: $localize`:@@works.newspaperArticle:Newspaper article`,
    [WorkPublicationTypes.onlineResource]: $localize`:@@works.onlineResource:Interactive resource`,
    [WorkPublicationTypes.preprint]: $localize`:@@works.preprint:Preprint`,
    [WorkPublicationTypes.report]: $localize`:@@works.report:Report`,
    [WorkPublicationTypes.researchTool]: $localize`:@@works.tool:Research tool`,
    [WorkPublicationTypes.supervisedStudentPublication]: $localize`:@@works.studentPublication:Supervised student publication`,
    [WorkPublicationTypes.test]: $localize`:@@works.test:Test`,
    [WorkPublicationTypes.translation]: $localize`:@@works.translation:Translation`,
    [WorkPublicationTypes.website]: $localize`:@@works.website:Website`,
    [WorkPublicationTypes.workingPaper]: $localize`:@@works.working:Working paper`,
    [WorkPublicationTypes.review]: $localize`:@@works.reviewPublication:Review`,
  },

  [WorkCategories.intellectual_property]: {
    [WorkIntellectualPropertyTypes.disclosure]: $localize`:@@works.disclosure:Disclosure`,
    [WorkIntellectualPropertyTypes.license]: $localize`:@@works.license:License`,
    [WorkIntellectualPropertyTypes.patent]: $localize`:@@works.patent:Patent`,
    [WorkIntellectualPropertyTypes.registeredCopyright]: $localize`:@@works.copyright:Registered copyright`,
    [WorkIntellectualPropertyTypes.trademark]: $localize`:@@works.trademark:Trademark`,
  },
  [WorkCategories.other_output]: {
    [WorkOtherOutputTypes.annotation]: $localize`:@@works.annotation:Annotation`,
    [WorkOtherOutputTypes.artisticPerformance]: $localize`:@@works.artisticPerformance:Artistic output or performance`,
    [WorkOtherOutputTypes.dataManagementPlan]: $localize`:@@works.dataManagementPlan:Data management plan`,
    [WorkOtherOutputTypes.dataSet]: $localize`:@@works.plan:Dataset`,
    [WorkOtherOutputTypes.invention]: $localize`:@@works.invention:Invention`,
    [WorkOtherOutputTypes.lectureSpeech]: $localize`:@@works.speech:Talk, interview, podcast or speech`,
    [WorkOtherOutputTypes.physicalObject]: $localize`:@@works.object:Physical object`,
    [WorkOtherOutputTypes.researchTechnique]: $localize`:@@works.technique:Research technique`,
    [WorkOtherOutputTypes.software]: $localize`:@@works.software:Software`,
    [WorkOtherOutputTypes.spinOffCompany]: $localize`:@@works.company:Spin off company`,
    [WorkOtherOutputTypes.standardsAndPolicy]: $localize`:@@works.policy:Standards and policy`,
    [WorkOtherOutputTypes.technicalStandard]: $localize`:@@works.standard:Technical Standard`,
    [WorkOtherOutputTypes.other]: $localize`:@@works.other:Other`,
  },
}

export enum WorksTitleName {
  publisher = 'publisher',
  conferenceTitle = 'conferenceTitle',
  bookTitle = 'bookTitle',
  journalTitle = 'journalTitle',
  magazineTitle = 'magazineTitle',
  newsletterTitle = 'newsletterTitle',
  newspaperTitle = 'newspaperTitle',
  institution = 'institution',
  custodian = 'custodian',
  trademark = 'trademark',
}

export const WorksTitleNameLabel = {
  [WorksTitleName.publisher]: $localize`:@@works.publisher:Publisher`,
  [WorksTitleName.conferenceTitle]: $localize`:@@works.conferenceTitle:Conference title`,
  [WorksTitleName.bookTitle]: $localize`:@@works.bookTitle:Book title`,
  [WorksTitleName.journalTitle]: $localize`:@@works.journalTitle:Journal title`,
  [WorksTitleName.magazineTitle]: $localize`:@@works.magazineTitle:Magazine title`,
  [WorksTitleName.newsletterTitle]: $localize`:@@works.newsletterTitle:Newsletter title`,
  [WorksTitleName.newspaperTitle]: $localize`:@@works.newspaperTitle:Newspaper title`,
  [WorksTitleName.institution]: $localize`:@@works.institution:Institution`,
  [WorksTitleName.custodian]: $localize`:@@works.custodian:Custodian`,
  [WorksTitleName.trademark]: $localize`:@@works.trademark:Trademark`,
}

export const WorkTypesTitle = {
  [WorkConferenceTypes.conferenceAbstract]: WorksTitleName.conferenceTitle,
  [WorkConferenceTypes.conferencePaper]: WorksTitleName.conferenceTitle,
  [WorkConferenceTypes.conferencePoster]: WorksTitleName.conferenceTitle,
  [WorkPublicationTypes.book]: WorksTitleName.publisher,
  [WorkPublicationTypes.bookChapter]: WorksTitleName.bookTitle,
  [WorkPublicationTypes.bookReview]: WorksTitleName.publisher,
  [WorkPublicationTypes.dictionaryEntry]: WorksTitleName.publisher,
  [WorkPublicationTypes.editedBook]: WorksTitleName.publisher,
  [WorkPublicationTypes.dissertationThesis]: WorksTitleName.journalTitle,
  [WorkPublicationTypes.encyclopediaEntry]: WorksTitleName.publisher,
  [WorkPublicationTypes.journalArticle]: WorksTitleName.journalTitle,
  [WorkPublicationTypes.journalIssue]: WorksTitleName.journalTitle,
  [WorkPublicationTypes.magazineArticle]: WorksTitleName.magazineTitle,
  [WorkPublicationTypes.manual]: WorksTitleName.publisher,
  [WorkPublicationTypes.newsletterArticle]: WorksTitleName.newsletterTitle,
  [WorkPublicationTypes.newspaperArticle]: WorksTitleName.newspaperTitle,
  [WorkPublicationTypes.onlineResource]: WorksTitleName.publisher,
  [WorkPublicationTypes.preprint]: WorksTitleName.journalTitle,
  [WorkPublicationTypes.report]: WorksTitleName.institution,
  [WorkPublicationTypes.researchTool]: WorksTitleName.institution,
  [WorkPublicationTypes.supervisedStudentPublication]:
    WorksTitleName.institution,
  [WorkPublicationTypes.test]: WorksTitleName.institution,
  [WorkPublicationTypes.translation]: WorksTitleName.publisher,
  [WorkPublicationTypes.website]: WorksTitleName.publisher,
  [WorkPublicationTypes.workingPaper]: WorksTitleName.institution,
  [WorkIntellectualPropertyTypes.disclosure]: WorksTitleName.publisher,
  [WorkIntellectualPropertyTypes.license]: WorksTitleName.publisher,
  [WorkIntellectualPropertyTypes.patent]: WorksTitleName.publisher,
  [WorkPublicationTypes.review]: WorksTitleName.publisher,
  [WorkIntellectualPropertyTypes.registeredCopyright]: WorksTitleName.publisher,
  [WorkIntellectualPropertyTypes.trademark]: WorksTitleName.journalTitle,
  [WorkOtherOutputTypes.annotation]: WorksTitleName.custodian,
  [WorkOtherOutputTypes.artisticPerformance]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.dataManagementPlan]: WorksTitleName.journalTitle,
  [WorkOtherOutputTypes.dataSet]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.invention]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.lectureSpeech]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.physicalObject]: WorksTitleName.custodian,
  [WorkOtherOutputTypes.researchTechnique]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.software]: WorksTitleName.journalTitle,
  [WorkOtherOutputTypes.spinOffCompany]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.standardsAndPolicy]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.technicalStandard]: WorksTitleName.publisher,
  [WorkOtherOutputTypes.other]: WorksTitleName.publisher,
}

export const WorkTypesByCategory = {
  [WorkCategories.conference]: WorkConferenceTypes,
  [WorkCategories.publication]: WorkPublicationTypes,
  [WorkCategories.intellectual_property]: WorkIntellectualPropertyTypes,
  [WorkCategories.other_output]: WorkOtherOutputTypes,
}

export const LanguageMap = {
  Abkhazian: 'ab',
  Afar: 'aa',
  Afrikaans: 'af',
  Akan: 'ak',
  Albanian: 'sq',
  Amharic: 'am',
  Arabic: 'ar',
  Aragonese: 'an',
  Armenian: 'hy',
  Assamese: 'as',
  Avaric: 'av',
  Avestan: 'ae',
  Aymara: 'ay',
  Azerbaijani: 'az',
  Bambara: 'bm',
  Bangla: 'bn',
  Bashkir: 'ba',
  Basque: 'eu',
  Belarusian: 'be',
  Bihari: 'bh',
  Bislama: 'bi',
  Bosnian: 'bs',
  Breton: 'br',
  Bulgarian: 'bg',
  Burmese: 'my',
  Catalan: 'ca',
  Chamorro: 'ch',
  Chechen: 'ce',
  'Chinese (simplified)': 'zh_CN',
  'Chinese (traditional)': 'zh_TW',
  'Church Slavic': 'cu',
  Chuvash: 'cv',
  Cornish: 'kw',
  Corsican: 'co',
  Cree: 'cr',
  Croatian: 'hr',
  Czech: 'cs',
  Danish: 'da',
  Divehi: 'dv',
  Dutch: 'nl',
  Dzongkha: 'dz',
  English: 'en',
  Esperanto: 'eo',
  Estonian: 'et',
  Ewe: 'ee',
  Faroese: 'fo',
  Fijian: 'fj',
  Finnish: 'fi',
  French: 'fr',
  Fulah: 'ff',
  Galician: 'gl',
  Ganda: 'lg',
  Georgian: 'ka',
  German: 'de',
  Greek: 'el',
  Guarani: 'gn',
  Gujarati: 'gu',
  'Haitian Creole': 'ht',
  Hausa: 'ha',
  Hebrew: 'iw',
  Herero: 'hz',
  Hindi: 'hi',
  'Hiri Motu': 'ho',
  Hungarian: 'hu',
  Icelandic: 'is',
  Ido: 'io',
  Igbo: 'ig',
  Indonesian: 'in',
  Interlingua: 'ia',
  Interlingue: 'ie',
  Inuktitut: 'iu',
  Inupiaq: 'ik',
  Irish: 'ga',
  Italian: 'it',
  Japanese: 'ja',
  Javanese: 'jv',
  Kalaallisut: 'kl',
  Kannada: 'kn',
  Kanuri: 'kr',
  Kashmiri: 'ks',
  Kazakh: 'kk',
  Khmer: 'km',
  Kikuyu: 'ki',
  Kinyarwanda: 'rw',
  Komi: 'kv',
  Kongo: 'kg',
  Korean: 'ko',
  Kuanyama: 'kj',
  Kurdish: 'ku',
  Kyrgyz: 'ky',
  Lao: 'lo',
  Latin: 'la',
  Latvian: 'lv',
  Limburgish: 'li',
  Lingala: 'ln',
  Lithuanian: 'lt',
  'Luba-Katanga': 'lu',
  Luxembourgish: 'lb',
  Macedonian: 'mk',
  Malagasy: 'mg',
  Malay: 'ms',
  Malayalam: 'ml',
  Maltese: 'mt',
  Manx: 'gv',
  Maori: 'mi',
  Marathi: 'mr',
  Marshallese: 'mh',
  Moldavian: 'mo',
  Mongolian: 'mn',
  Nauru: 'na',
  Navajo: 'nv',
  Ndonga: 'ng',
  Nepali: 'ne',
  'North Ndebele': 'nd',
  'Northern Sami': 'se',
  Norwegian: 'no',
  'Norwegian Bokmål': 'nb',
  'Norwegian Nynorsk': 'nn',
  Nyanja: 'ny',
  Occitan: 'oc',
  Odia: 'or',
  Ojibwa: 'oj',
  Oromo: 'om',
  Ossetic: 'os',
  Pali: 'pi',
  Pashto: 'ps',
  Persian: 'fa',
  Polish: 'pl',
  Portuguese: 'pt',
  Punjabi: 'pa',
  Quechua: 'qu',
  Romanian: 'ro',
  Romansh: 'rm',
  Rundi: 'rn',
  Russian: 'ru',
  Samoan: 'sm',
  Sango: 'sg',
  Sanskrit: 'sa',
  Sardinian: 'sc',
  'Scottish Gaelic': 'gd',
  Serbian: 'sr',
  Shona: 'sn',
  'Sichuan Yi': 'ii',
  Sindhi: 'sd',
  Sinhala: 'si',
  Slovak: 'sk',
  Slovenian: 'sl',
  Somali: 'so',
  'South Ndebele': 'nr',
  'Southern Sotho': 'st',
  Spanish: 'es',
  Sundanese: 'su',
  Swahili: 'sw',
  Swati: 'ss',
  Swedish: 'sv',
  Tagalog: 'tl',
  Tahitian: 'ty',
  Tajik: 'tg',
  Tamil: 'ta',
  Tatar: 'tt',
  Telugu: 'te',
  Thai: 'th',
  Tibetan: 'bo',
  Tigrinya: 'ti',
  Tongan: 'to',
  Tsonga: 'ts',
  Tswana: 'tn',
  Turkish: 'tr',
  Turkmen: 'tk',
  Twi: 'tw',
  Ukrainian: 'uk',
  Urdu: 'ur',
  Uyghur: 'ug',
  Uzbek: 'uz',
  Venda: 've',
  Vietnamese: 'vi',
  Volapük: 'vo',
  Walloon: 'wa',
  Welsh: 'cy',
  'Western Frisian': 'fy',
  Wolof: 'wo',
  Xhosa: 'xh',
  Yiddish: 'ji',
  Yoruba: 'yo',
}

export const CitationTypes = {
  'formatted-apa': 'APA',
  bibtex: 'BIBTEX',
  'formatted-chicago': 'CHICAGO',
  'formatted-harvard': 'HARVARD',
  'formatted-ieee': 'IEEE',
  'formatted-mla': 'MLA',
  ris: 'RIS',
  'formatted-unspecified': 'UNSPECIFIED',
  'formatted-vancouver': 'VANCOUVER',
}

export const ContributionRoles: Role[] = [
  {
    key: 'no specified role',
    value: null,
    translation: $localize`:@@works.noSpecifiedRole:No specified role`,
  },
  {
    key: 'conceptualization',
    value: 'http://credit.niso.org/contributor-roles/conceptualization/',
    translation: $localize`:@@works.conceptualization:Conceptualization`,
  },
  {
    key: 'data curation',
    value: 'http://credit.niso.org/contributor-roles/data-curation/',
    translation: $localize`:@@works.dataCuration:Data curation`,
  },
  {
    key: 'formal analysis',
    value: 'http://credit.niso.org/contributor-roles/formal-analysis/',
    translation: $localize`:@@works.formalAnalysis:Formal analysis`,
  },
  {
    key: 'funding acquisition',
    value: 'http://credit.niso.org/contributor-roles/funding-acquisition/',
    translation: $localize`:@@works.fundingAcquisition:Funding acquisition`,
  },
  {
    key: 'investigation',
    value: 'http://credit.niso.org/contributor-roles/investigation/',
    translation: $localize`:@@works.investigation:Investigation`,
  },
  {
    key: 'methodology',
    value: 'http://credit.niso.org/contributor-roles/methodology/',
    translation: $localize`:@@works.methodology:Methodology`,
  },
  {
    key: 'project administration',
    value: 'http://credit.niso.org/contributor-roles/project-administration/',
    translation: $localize`:@@works.projectAdministration:Project administration`,
  },
  {
    key: 'resources',
    value: 'http://credit.niso.org/contributor-roles/resources/',
    translation: $localize`:@@works.resources:Resources`,
  },
  {
    key: 'software',
    value: 'http://credit.niso.org/contributor-roles/software/',
    translation: $localize`:@@works.software:Software`,
  },
  {
    key: 'supervision',
    value: 'http://credit.niso.org/contributor-roles/supervision/',
    translation: $localize`:@@works.supervision:Supervision`,
  },
  {
    key: 'validation',
    value: 'http://credit.niso.org/contributor-roles/validation/',
    translation: $localize`:@@works.validation:Validation`,
  },
  {
    key: 'visualization',
    value: 'http://credit.niso.org/contributor-roles/visualization/',
    translation: $localize`:@@works.visualization:Visualization`,
  },
  {
    key: 'writing - original draft',
    value: 'http://credit.niso.org/contributor-roles/writing-original-draft/',
    translation: $localize`:@@works.writingOriginalDraft:Writing - original draft`,
  },
  {
    key: 'writing - review & editing',
    value: 'http://credit.niso.org/contributor-roles/writing-review-editing/',
    translation: $localize`:@@works.writingReviewEditing:Writing - review & editing`,
  },
]

export const _LEGACY_ContributionRoles: Role[] = [
  {
    key: 'author',
    value: null,
    translation: $localize`:@@works.author:Author`,
  },
  {
    key: 'assignee',
    value: null,
    translation: $localize`:@@works.assignee:Assignee`,
  },
  {
    key: 'editor',
    value: null,
    translation: $localize`:@@works.editor:Editor`,
  },
  {
    key: 'chair-or-translator',
    value: null,
    translation: $localize`:@@works.chairOrTranslator:Chair or Translator`,
  },
  {
    key: 'co-investigator',
    value: null,
    translation: $localize`:@@works.coInvestigator:Co-investigator`,
  },
  {
    key: 'co-inventor',
    value: null,
    translation: $localize`:@@works.coInventor:Co-inventor`,
  },
  {
    key: 'graduate-student',
    value: null,
    translation: $localize`:@@works.graduateStudent:Graduate Student`,
  },
  {
    key: 'other-inventor',
    value: null,
    translation: $localize`:@@works.otherInventor:Other inventor`,
  },
  {
    key: 'principal-investigator',
    value: null,
    translation: $localize`:@@works.principalInvestigator:Principal Investigator`,
  },
  {
    key: 'postdoctoral-researcher',
    value: null,
    translation: $localize`:@@works.postdoctoralResearcher:Postdoctoral Researcher`,
  },
  {
    key: 'support-staff',
    value: null,
    translation: $localize`:@@works.supportStaff:Support Staff`,
  },
  {
    key: 'lead',
    value: null,
    translation: $localize`:@@works.lead:Lead`,
  },
  {
    key: 'co-lead',
    value: null,
    translation: $localize`:@@works.coLead:Co-lead`,
  },
  {
    key: 'supported-by',
    value: null,
    translation: $localize`:@@works.supportedBy:Supported by`,
  },
  {
    key: 'other-contribution',
    value: null,
    translation: $localize`:@@works.otherContribution:Other contribution`,
  },
]

export interface WorkIdType {
  name: string
  description: string
  resolutionPrefix: string
}

export interface WorkIdTypeValidation {
  resolved: boolean
  attemptedResolution: boolean
  generatedUrl: string
  validFormat: boolean
}

export interface WorkCombineEndpoint {
  errors: string[]
  workIds: any
}

export enum WorkRelationships {
  self = 'self',
  'part-of' = 'part-of',
  'version-of' = 'version-of',
  'funded-by' = 'funded-by',
}

export const WorkRelationshipsLabels = {
  self: $localize`:@@works.self:Self`,
  'part-of': $localize`:@@works.partOf:Part of`,
  'version-of': $localize`:@@works.versionOf:Version of`,
  'funded-by': $localize`:@@works.fundedBy:Funded by`,
}

export const WorkRelationshipsHintsLabels = {
  self: $localize`:@@works.selfDescription:The identifier applies to the work itself. For example, a DOI for a book chapter.`,
  'part-of': $localize`:@@works.partOfDescription:The identifier applies to part of a larger work. For example, the ISBN of the book in which the work was published.`,
  'version-of': $localize`:@@works.versionOfDescription:The identifier applies to an alternate version of the work. For example, an earlier draft of an article.`,
  'funded-by': $localize`:@@works.fundedByDescription:The identifier applies to the funding for the work.`,
}

export interface Work {
  visibility: any
  errors: any[] // TODO is this always empty?
  publicationDate: MonthDayYearDate
  putCode: any
  shortDescription?: Value
  url?: Value
  journalTitle?: Value
  languageCode?: Value
  languageName?: Value
  citation?: Citation
  countryCode?: Value
  countryName?: Value
  contributors?: [any] // TODO is this always empty?
  workExternalIdentifiers: ExternalIdentifier[]
  source: string
  sourceName: string
  title: Value
  subtitle?: Value
  translatedTitle?: any // TODO is this always empty?
  workCategory?: Value
  workType: Value
  dateSortString?: string
  createdDate?: MonthDayYearDate
  lastModified?: MonthDayYearDate
  userSource: boolean
  checked: boolean
}

export interface Suggestion {
  putCodes: number[]
  orcid: string
  putCodesAsString: string
}

export interface GroupingSuggestions {
  suggestions: Suggestion[]
  moreAvailable: boolean
}

export interface Role {
  key: string
  value: string
  translation: string
}
