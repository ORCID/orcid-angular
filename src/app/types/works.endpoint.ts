import { ExternalIdentifier, MonthDayYearDate, Value } from './common.endpoint'
export interface Citation {
  citation: Value
  citationType: Value
  errors: any[]
  getRequiredMessage?: any
  required: boolean
}

export interface Work {
  visibility: Value
  errors: any[] // TODO is this always empty?
  publicationDate: MonthDayYearDate
  putCode: Value
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

export const WorkCategoryLabels = {
  [WorkCategories.conference]: $localize`Conference`,
  [WorkCategories.intellectual_property]: $localize`Intellectual property`,
  [WorkCategories.other_output]: $localize`Other output`,
  [WorkCategories.publication]: $localize`Publication`,
}

export const WorkTypesLabels = {
  [WorkCategories.conference]: {
    [WorkConferenceTypes.conferenceAbstract]: 'Conference abstract',
    [WorkConferenceTypes.conferencePaper]: 'Conference paper',
    [WorkConferenceTypes.conferencePoster]: 'Conference poster',
  },
  [WorkCategories.publication]: {
    [WorkPublicationTypes.bookChapter]: 'Book chapter',
    [WorkPublicationTypes.bookReview]: 'Book review',
    [WorkPublicationTypes.book]: 'Book',
    [WorkPublicationTypes.dictionaryEntry]: 'Dictionary entry',
    [WorkPublicationTypes.dissertationThesis]: 'Dissertation/Thesis',
    [WorkPublicationTypes.editedBook]: 'Edited book',
    [WorkPublicationTypes.encyclopediaEntry]: 'Encyclopedia entry',
    [WorkPublicationTypes.journalArticle]: 'Journal article',
    [WorkPublicationTypes.journalIssue]: 'Journal issue',
    [WorkPublicationTypes.magazineArticle]: 'Magazine article',
    [WorkPublicationTypes.manual]: 'Manual',
    [WorkPublicationTypes.newsletterArticle]: 'Newsletter article',
    [WorkPublicationTypes.newspaperArticle]: 'Newspaper article',
    [WorkPublicationTypes.onlineResource]: 'Online resource',
    [WorkPublicationTypes.preprint]: 'Preprint',
    [WorkPublicationTypes.report]: 'Report',
    [WorkPublicationTypes.researchTool]: 'Research tool',
    [WorkPublicationTypes.supervisedStudentPublication]:
      'Supervised student publication',
    [WorkPublicationTypes.test]: 'Test',
    [WorkPublicationTypes.translation]: 'Translation',
    [WorkPublicationTypes.website]: 'Website',
    [WorkPublicationTypes.workingPaper]: 'Working paper',
  },

  [WorkCategories.intellectual_property]: {
    [WorkIntellectualPropertyTypes.disclosure]: 'Disclosure',
    [WorkIntellectualPropertyTypes.license]: 'License',
    [WorkIntellectualPropertyTypes.patent]: 'Patent',
    [WorkIntellectualPropertyTypes.registeredCopyright]: 'Registered copyright',
    [WorkIntellectualPropertyTypes.trademark]: 'Trademark',
  },
  [WorkCategories.other_output]: {
    [WorkOtherOutputTypes.annotation]: 'Annotation',
    [WorkOtherOutputTypes.artisticPerformance]: 'Artistic performance',
    [WorkOtherOutputTypes.dataManagementPlan]: 'Data management plan',
    [WorkOtherOutputTypes.dataSet]: 'Data set',
    [WorkOtherOutputTypes.invention]: 'Invention',
    [WorkOtherOutputTypes.lectureSpeech]: 'Lecture speech',
    [WorkOtherOutputTypes.physicalObject]: 'Physical object',
    [WorkOtherOutputTypes.researchTechnique]: 'Research technique',
    [WorkOtherOutputTypes.software]: 'software',
    [WorkOtherOutputTypes.spinOffCompany]: 'Spin off company',
    [WorkOtherOutputTypes.standardsAndPolicy]: 'Standards and policy',
    [WorkOtherOutputTypes.technicalStandard]: 'Technical Standard',
    [WorkOtherOutputTypes.other]: 'Other',
  },
}

export const WorkTitleTypesLabels = {
  [WorkCategories.conference]: {
    [WorkConferenceTypes.conferenceAbstract]: 'Conference title',
    [WorkConferenceTypes.conferencePaper]: 'Conference title',
    [WorkConferenceTypes.conferencePoster]: 'Conference title',
  },
  [WorkCategories.publication]: {
    [WorkPublicationTypes.book]: 'Publisher',
    [WorkPublicationTypes.bookChapter]: 'Book title',
    [WorkPublicationTypes.bookReview]: 'Publisher',
    [WorkPublicationTypes.dictionaryEntry]: 'Publisher',
    [WorkPublicationTypes.editedBook]: 'Publisher',
    [WorkPublicationTypes.dissertationThesis]: 'Journal title',
    [WorkPublicationTypes.encyclopediaEntry]: 'Publisher',
    [WorkPublicationTypes.journalArticle]: 'Journal title',
    [WorkPublicationTypes.journalIssue]: 'Journal title',
    [WorkPublicationTypes.magazineArticle]: 'Magazine title',
    [WorkPublicationTypes.manual]: 'Publisher',
    [WorkPublicationTypes.newsletterArticle]: 'Newsletter title',
    [WorkPublicationTypes.newspaperArticle]: 'Newsletter title',
    [WorkPublicationTypes.onlineResource]: 'Publisher',
    [WorkPublicationTypes.preprint]: 'Journal title',
    [WorkPublicationTypes.report]: 'Institution',
    [WorkPublicationTypes.researchTool]: 'Institution',
    [WorkPublicationTypes.supervisedStudentPublication]: 'Institution',
    [WorkPublicationTypes.test]: 'Institution',
    [WorkPublicationTypes.translation]: 'Publisher',
    [WorkPublicationTypes.website]: 'Publisher',
    [WorkPublicationTypes.workingPaper]: 'Publisher',
  },

  [WorkCategories.intellectual_property]: {
    [WorkIntellectualPropertyTypes.disclosure]: 'Publisher',
    [WorkIntellectualPropertyTypes.license]: 'Publisher',
    [WorkIntellectualPropertyTypes.patent]: 'Publisher',
    [WorkIntellectualPropertyTypes.registeredCopyright]: 'Publisher',
    [WorkIntellectualPropertyTypes.trademark]: 'Trademark',
  },
  [WorkCategories.other_output]: {
    [WorkOtherOutputTypes.annotation]: 'Custodian',
    [WorkOtherOutputTypes.artisticPerformance]: 'Publisher',
    [WorkOtherOutputTypes.dataManagementPlan]: 'Journal title',
    [WorkOtherOutputTypes.dataSet]: 'Publisher',
    [WorkOtherOutputTypes.invention]: 'Publisher',
    [WorkOtherOutputTypes.lectureSpeech]: 'Publisher',
    [WorkOtherOutputTypes.physicalObject]: 'Custodian',
    [WorkOtherOutputTypes.researchTechnique]: 'Publisher',
    [WorkOtherOutputTypes.software]: 'Journal title',
    [WorkOtherOutputTypes.spinOffCompany]: 'Publisher',
    [WorkOtherOutputTypes.standardsAndPolicy]: 'Publisher',
    [WorkOtherOutputTypes.technicalStandard]: 'Publisher',
    [WorkOtherOutputTypes.other]: 'Publisher',
  },
}
