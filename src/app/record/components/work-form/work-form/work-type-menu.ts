import { DeepSelectMenu } from 'src/app/cdk/deep-select-input/deep-select-input/deep-select-input.component'
import {
  WorkCategoriesLabel,
  WorkCategories,
  WorkTypesLabels,
  WorkTypes,
} from 'src/app/types/works.endpoint'

export const WorkTypeMenu: DeepSelectMenu[] = [
  {
    label: $localize`:@@works.popularWorkTypes:Popular work types`,
    isNotSelectableLabel: true,
  },
  {
    // Journal article
    label: WorkTypesLabels[WorkTypes.journalIssue],
    value: WorkTypes.journalArticle,
  },
  {
    // Conference paper
    label: WorkTypesLabels[WorkTypes.conferencePaper],
    value: WorkTypes.conferencePaper,
  },
  {
    // Book chapter
    label: WorkTypesLabels[WorkTypes.bookChapter],
    value: WorkTypes.bookChapter,
  },
  {
    label: WorkCategoriesLabel[WorkCategories.academicPublication],
    value: WorkCategories.academicPublication,
    description: $localize`:@@works.publicationDescription:Books, journal articles, conference outputs, preprints and working papers`,
    content: [
      {
        label: WorkTypesLabels[WorkTypes.journalArticle],
        value: WorkTypes.journalArticle,
      },
      { label: WorkTypesLabels[WorkTypes.book], value: WorkTypes.book },
      {
        label: WorkTypesLabels[WorkTypes.bookChapter],
        value: WorkTypes.bookChapter,
      },
      {
        label: WorkTypesLabels[WorkTypes.conferencePaper],
        value: WorkTypes.conferencePaper,
      },
      {
        label: WorkTypesLabels[WorkTypes.conferenceAbstract],
        value: WorkTypes.conferenceAbstract,
      },
      {
        label: WorkTypesLabels[WorkTypes.lectureSpeech],
        value: WorkTypes.lectureSpeech,
      },
      {
        label: WorkTypesLabels[WorkTypes.conferencePoster],
        value: WorkTypes.conferencePoster,
      },
      {
        label: WorkTypesLabels[WorkTypes.editedBook],
        value: WorkTypes.editedBook,
      },
      { label: WorkTypesLabels[WorkTypes.preprint], value: WorkTypes.preprint },
      {
        label: WorkTypesLabels[WorkTypes.dissertationThesis],
        value: WorkTypes.dissertationThesis,
      },
      {
        label: WorkTypesLabels[WorkTypes.workingPaper],
        value: WorkTypes.workingPaper,
      },
      {
        label: $localize`:@@works.otherAcademicPublication:Other academic publication`,
        description: $localize`:@@works.otherLabelMicrocopy:Selecting this will set the work type to ‘Other’`,
        value: WorkTypes.other,
        secondaryItem: true,
      },
    ],
  },
  {
    label: WorkCategoriesLabel[WorkCategories.reviewAndEditing],
    value: WorkCategories.reviewAndEditing,
    description: $localize`:@@works.reviewDescription:Annotations, transcriptions, reviews and editing`,
    content: [
      {
        label: WorkTypesLabels[WorkTypes.annotation],
        value: WorkTypes.annotation,
      },
      {
        label: WorkTypesLabels[WorkTypes.bookReview],
        value: WorkTypes.bookReview,
      },
      {
        label: WorkTypesLabels[WorkTypes.journalIssue],
        value: WorkTypes.journalIssue,
      },
      { label: WorkTypesLabels[WorkTypes.review], value: WorkTypes.review },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
      {
        label: WorkTypesLabels[WorkTypes.translation],
        value: WorkTypes.translation,
      },
      {
        label: $localize`:@@works.otherReviewAndEditing:Other review or editing`,
        description: $localize`:@@works.otherLabelMicrocopy:Selecting this will set the work type to ‘Other’`,
        value: WorkTypes.other,
        secondaryItem: true,
      },
    ],
  },
  {
    label: WorkCategoriesLabel[WorkCategories.dissemination],
    value: WorkCategories.dissemination,
    description: $localize`:@@works.disseminationDescription:Blog posts, media articles, speeches and podcasts`,
    content: [
      {
        label: WorkTypesLabels[WorkTypes.onlineResource],
        value: WorkTypes.onlineResource,
      },
      {
        label: WorkTypesLabels[WorkTypes.dictionaryEntry],
        value: WorkTypes.dictionaryEntry,
      },
      {
        label: WorkTypesLabels[WorkTypes.encyclopediaEntry],
        value: WorkTypes.encyclopediaEntry,
      },
      {
        label: WorkTypesLabels[WorkTypes.magazineArticle],
        value: WorkTypes.magazineArticle,
      },
      {
        label: WorkTypesLabels[WorkTypes.newspaperArticle],
        value: WorkTypes.newspaperArticle,
      },
      {
        label: WorkTypesLabels[WorkTypes.lectureSpeech],
        value: WorkTypes.lectureSpeech,
      },
      { label: WorkTypesLabels[WorkTypes.website], value: WorkTypes.website },
      {
        label: $localize`:@@works.otherDissemination:Other dissemination output`,
        value: WorkTypes.other,
        secondaryItem: true,
        description: $localize`:@@works.otherLabelMicrocopy:Selecting this will set the work type to ‘Other’`,
      },
    ],
  },
  {
    label: WorkCategoriesLabel[WorkCategories.creative],
    value: WorkCategories.creative,
    description: $localize`:@@works.creativeDescription:Designs, images, video, music, sound and interactive media`,
    content: [
      {
        label: WorkTypesLabels[WorkTypes.artisticPerformance],
        value: WorkTypes.artisticPerformance,
      },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
      //   { label: WorkTypesLabels[WorkTypes.other], value: WorkTypes.other },
    ],
  },
  {
    label: WorkCategoriesLabel[WorkCategories.dataAndProccesses],
    value: WorkCategories.dataAndProccesses,
    description: $localize`:@@works.dataDescription:Datasets, software, plans and research tools`,
    content: [
      {
        label: WorkTypesLabels[WorkTypes.physicalObject],
        value: WorkTypes.physicalObject,
      },
      { label: WorkTypesLabels[WorkTypes.dataSet], value: WorkTypes.dataSet },
      { label: WorkTypesLabels[WorkTypes.dataSet], value: WorkTypes.dataSet },
      {
        label: WorkTypesLabels[WorkTypes.dataManagementPlan],
        value: WorkTypes.dataManagementPlan,
      },
      {
        label: WorkTypesLabels[WorkTypes.physicalObject],
        value: WorkTypes.physicalObject,
      },
      {
        label: WorkTypesLabels[WorkTypes.researchTechnique],
        value: WorkTypes.researchTechnique,
      },
      {
        label: WorkTypesLabels[WorkTypes.researchTool],
        value: WorkTypes.researchTool,
      },
      { label: WorkTypesLabels[WorkTypes.software], value: WorkTypes.software },
      {
        label: $localize`:@@works.otherData:Other data output`,
        value: WorkTypes.other,
        secondaryItem: true,
        description: $localize`:@@works.otherLabelMicrocopy:Selecting this will set the work type to ‘Other’`,
      },
    ],
  },
  {
    label: WorkCategoriesLabel[WorkCategories.legalAndIp],
    value: WorkCategories.legalAndIp,
    description: $localize`:@@works.legalDescription:Patents, trademarks, copyright and other legal items`,
    content: [
      {
        label: WorkTypesLabels[WorkTypes.invention],
        value: WorkTypes.invention,
      },
      { label: WorkTypesLabels[WorkTypes.license], value: WorkTypes.license },
      { label: WorkTypesLabels[WorkTypes.patent], value: WorkTypes.patent },
      {
        label: WorkTypesLabels[WorkTypes.registeredCopyright],
        value: WorkTypes.registeredCopyright,
      },
      {
        label: WorkTypesLabels[WorkTypes.standardsAndPolicy],
        value: WorkTypes.standardsAndPolicy,
      },
      {
        label: WorkTypesLabels[WorkTypes.trademark],
        value: WorkTypes.trademark,
      },
      {
        label: $localize`:@@works.otherLegal:Other legal or IP output`,
        value: WorkTypes.other,
        secondaryItem: true,
        description: $localize`:@@works.otherLabelMicrocopy:Selecting this will set the work type to ‘Other’`,
      },
    ],
  },
  {
    label: WorkCategoriesLabel[WorkCategories.teachingAndSupervision],
    value: WorkCategories.teachingAndSupervision,
    description: $localize`:@@works.teachingDescription:Working with students`,
    content: [
      {
        label: WorkTypesLabels[WorkTypes.lectureSpeech],
        value: WorkTypes.lectureSpeech,
      },
      {
        label: WorkTypesLabels[WorkTypes.supervisedStudentPublication],
        value: WorkTypes.supervisedStudentPublication,
      },
      {
        label: $localize`:@@works.otherTeaching:Other teaching or supervision output`,
        value: WorkTypes.other,
        secondaryItem: true,
        description: $localize`:@@works.otherLabelMicrocopy:Selecting this will set the work type to ‘Other’`,
      },
    ],
  },
]
