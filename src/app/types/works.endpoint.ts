import { ExternalIdentifier, MonthDayYearDate, Value } from './common.endpoint'

export interface Citation {
  citation: Value
  citationType: Value
  errors: any[]
  getRequiredMessage?: any
  required: boolean
}

export enum WorkCategories {
  academicPublication = 'academic-publication',
  reviewAndEditing = 'review-and-editing',
  other_output = 'other-output',
  dissemination = 'dissemination',
  creative = 'creative',
  dataAndProccesses = 'data-and-proccesses',
  legalAndIp = 'legal-and-ip',
  teachingAndSupervision = 'teaching-and-supervision',
}

export enum WorkTypes {
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
  conferenceAbstract = 'conference-abstract',
  conferencePaper = 'conference-paper',
  conferencePoster = 'conference-poster',
  disclosure = 'disclosure',
  license = 'license',
  patent = 'patent',
  registeredCopyright = 'registered-copyright',
  trademark = 'trademark',
  annotation = 'annotation',
  artisticPerformance = 'artistic-performance',
  dataManagementPlan = 'data-management-plan',
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
  blogPost = 'blog-post',
  clinicalStudy = 'clinical-study',
  cartographicMaterial = 'cartographic-material',
  conferenceOutput = 'conference-output',
  conferencePresentation = 'conference-presentation',
  conferenceProceedings = 'conference-proceedings',
  design = 'design',
  image = 'image',
  learningObject = 'learning-object',
  movingImage = 'moving-image',
  musicalComposition = 'musical-composition',
  sound = 'sound',
  transcription = 'transcription',
  publicSpeech = 'public-speech'
}

export const WorkCategoriesLabel = {
  [WorkCategories.academicPublication]: $localize`:@@works.academicPublication:Academic publications`,
  [WorkCategories.reviewAndEditing]: $localize`:@@works.reviewAndEditing:Review and editing`,
  [WorkCategories.other_output]: $localize`:@@works.other:Other`,
  [WorkCategories.dissemination]: $localize`:@@works.dissemination:Dissemination`,
  [WorkCategories.creative]: $localize`:@@works.creative:Creative`,
  [WorkCategories.dataAndProccesses]: $localize`:@@works.data:Data and process`,
  [WorkCategories.legalAndIp]: $localize`:@@works.legal:Legal and IP`,
  [WorkCategories.teachingAndSupervision]: $localize`:@@works.teaching:Teaching and supervision`,
}

export const WorkTypesLabels = {
  [WorkTypes.conferenceAbstract]: $localize`:@@works.abstract:Conference abstract`,
  [WorkTypes.conferencePaper]: $localize`:@@works.paper:Conference paper`,
  [WorkTypes.conferencePoster]: $localize`:@@works.poster:Conference poster`,
  [WorkTypes.bookChapter]: $localize`:@@works.chapter:Book chapter`,
  [WorkTypes.bookReview]: $localize`:@@works.review:Book review`,
  [WorkTypes.book]: $localize`:@@works.book:Book`,
  [WorkTypes.dictionaryEntry]: $localize`:@@works.entry:Dictionary entry`,
  [WorkTypes.dissertationThesis]: $localize`:@@works.thesis:Dissertation or Thesis`,
  [WorkTypes.editedBook]: $localize`:@@works.editedBook:Edited book`,
  [WorkTypes.encyclopediaEntry]: $localize`:@@works.encyclopediaEntry:Encyclopedia entry`,
  [WorkTypes.journalArticle]: $localize`:@@works.journalArticle:Journal article`, //
  [WorkTypes.journalIssue]: $localize`:@@works.issue:Journal issue or edition`,
  [WorkTypes.magazineArticle]: $localize`:@@works.magazineArticle:Magazine article`,
  [WorkTypes.manual]: $localize`:@@works.manual:Manual`,
  [WorkTypes.newsletterArticle]: $localize`:@@works.newsletterarticle:Newsletter article`,
  [WorkTypes.newspaperArticle]: $localize`:@@works.newspaperArticle:Newspaper article`,
  [WorkTypes.onlineResource]: $localize`:@@works.onlineResource:Interactive resource`,
  [WorkTypes.preprint]: $localize`:@@works.preprint:Preprint`,
  [WorkTypes.report]: $localize`:@@works.report:Report`,
  [WorkTypes.researchTool]: $localize`:@@works.tool:Research tool`,
  [WorkTypes.supervisedStudentPublication]: $localize`:@@works.studentPublication:Supervised student publication`,
  [WorkTypes.test]: $localize`:@@works.test:Test`,
  [WorkTypes.translation]: $localize`:@@works.translation:Translation`,
  [WorkTypes.website]: $localize`:@@works.website:Website`,
  [WorkTypes.workingPaper]: $localize`:@@works.working:Working paper`,
  [WorkTypes.review]: $localize`:@@works.reviewPublication:Review`,
  [WorkTypes.disclosure]: $localize`:@@works.disclosure:Disclosure`,
  [WorkTypes.license]: $localize`:@@works.license:License`,
  [WorkTypes.patent]: $localize`:@@works.patent:Patent`,
  [WorkTypes.registeredCopyright]: $localize`:@@works.copyright:Registered copyright`,
  [WorkTypes.trademark]: $localize`:@@works.trademark:Trademark`,
  [WorkTypes.annotation]: $localize`:@@works.annotation:Annotation`,
  [WorkTypes.artisticPerformance]: $localize`:@@works.artisticPerformance:Artistic output or performance`,
  [WorkTypes.dataManagementPlan]: $localize`:@@works.dataManagementPlan:Data management plan`,
  [WorkTypes.dataSet]: $localize`:@@works.plan:Dataset`,
  [WorkTypes.invention]: $localize`:@@works.invention:Invention`,
  [WorkTypes.lectureSpeech]: $localize`:@@works.speech:Lecture`,
  [WorkTypes.physicalObject]: $localize`:@@works.object:Physical object`,
  [WorkTypes.researchTechnique]: $localize`:@@works.technique:Research protocol or technique`,
  [WorkTypes.software]: $localize`:@@works.software:Software`,
  [WorkTypes.spinOffCompany]: $localize`:@@works.company:Spin off company`,
  [WorkTypes.standardsAndPolicy]: $localize`:@@works.policy:Standards or policy`,
  [WorkTypes.technicalStandard]: $localize`:@@works.standard:Technical Standard`,
  [WorkTypes.other]: $localize`:@@works.other:Other`,
  [WorkTypes.blogPost]: $localize`:@@works.blogPost:Blog post`,
  [WorkTypes.clinicalStudy]: $localize`:@@works.clinicalStudy:Clinical study`,
  [WorkTypes.cartographicMaterial]: $localize`:@@works.cartographicMaterial:Cartographic material`,
  [WorkTypes.conferenceOutput]: $localize`:@@works.conferenceOutput:Conference output`,
  [WorkTypes.conferencePresentation]: $localize`:@@works.conferencePresentation:Conference presentation`,
  [WorkTypes.conferenceProceedings]: $localize`:@@works.conferenceProceedings:Conference proceedings`,
  [WorkTypes.design]: $localize`:@@works.design:Design`,
  [WorkTypes.image]: $localize`:@@works.image:Image`,
  [WorkTypes.learningObject]: $localize`:@@works.learningObject:Teaching material`,
  [WorkTypes.movingImage]: $localize`:@@works.movingImage:Moving image or video`,
  [WorkTypes.musicalComposition]: $localize`:@@works.musicalComposition:Musical composition`,
  [WorkTypes.sound]: $localize`:@@works.sound:Sound`,
  [WorkTypes.transcription]: $localize`:@@works.transcription:Transcription`,
  [WorkTypes.publicSpeech]: $localize`:@@works.publicSpeech:Talk, interview, podcast or speech`,
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
  [WorkTypes.conferenceAbstract]: WorksTitleName.conferenceTitle,
  [WorkTypes.conferencePaper]: WorksTitleName.conferenceTitle,
  [WorkTypes.conferencePoster]: WorksTitleName.conferenceTitle,
  [WorkTypes.book]: WorksTitleName.publisher,
  [WorkTypes.bookChapter]: WorksTitleName.bookTitle,
  [WorkTypes.bookReview]: WorksTitleName.publisher,
  [WorkTypes.dictionaryEntry]: WorksTitleName.publisher,
  [WorkTypes.editedBook]: WorksTitleName.publisher,
  [WorkTypes.dissertationThesis]: WorksTitleName.journalTitle,
  [WorkTypes.encyclopediaEntry]: WorksTitleName.publisher,
  [WorkTypes.journalArticle]: WorksTitleName.journalTitle,
  [WorkTypes.journalIssue]: WorksTitleName.journalTitle,
  [WorkTypes.magazineArticle]: WorksTitleName.magazineTitle,
  [WorkTypes.manual]: WorksTitleName.publisher,
  [WorkTypes.newsletterArticle]: WorksTitleName.newsletterTitle,
  [WorkTypes.newspaperArticle]: WorksTitleName.newspaperTitle,
  [WorkTypes.onlineResource]: WorksTitleName.publisher,
  [WorkTypes.preprint]: WorksTitleName.journalTitle,
  [WorkTypes.report]: WorksTitleName.institution,
  [WorkTypes.researchTool]: WorksTitleName.institution,
  [WorkTypes.supervisedStudentPublication]: WorksTitleName.institution,
  [WorkTypes.test]: WorksTitleName.institution,
  [WorkTypes.translation]: WorksTitleName.publisher,
  [WorkTypes.website]: WorksTitleName.publisher,
  [WorkTypes.workingPaper]: WorksTitleName.institution,
  [WorkTypes.disclosure]: WorksTitleName.publisher,
  [WorkTypes.license]: WorksTitleName.publisher,
  [WorkTypes.patent]: WorksTitleName.publisher,
  [WorkTypes.review]: WorksTitleName.publisher,
  [WorkTypes.registeredCopyright]: WorksTitleName.publisher,
  [WorkTypes.trademark]: WorksTitleName.journalTitle,
  [WorkTypes.annotation]: WorksTitleName.custodian,
  [WorkTypes.artisticPerformance]: WorksTitleName.publisher,
  [WorkTypes.dataManagementPlan]: WorksTitleName.journalTitle,
  [WorkTypes.dataSet]: WorksTitleName.publisher,
  [WorkTypes.invention]: WorksTitleName.publisher,
  [WorkTypes.lectureSpeech]: WorksTitleName.publisher,
  [WorkTypes.physicalObject]: WorksTitleName.custodian,
  [WorkTypes.researchTechnique]: WorksTitleName.publisher,
  [WorkTypes.software]: WorksTitleName.journalTitle,
  [WorkTypes.spinOffCompany]: WorksTitleName.publisher,
  [WorkTypes.standardsAndPolicy]: WorksTitleName.publisher,
  [WorkTypes.technicalStandard]: WorksTitleName.publisher,
  [WorkTypes.other]: WorksTitleName.publisher,
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
