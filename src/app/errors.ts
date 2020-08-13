import { ErrorReport } from './types'

export const ERROR_REPORT: {
  JUST_GA: ErrorReport
  STANDARD: ErrorReport
  STANDARD_VERBOSE: ErrorReport
  RESET_PASSWORD_COULD_NOT_RECOVER: ErrorReport
  REGISTER: ErrorReport
} = {
  JUST_GA: {
    analytics: {
      code: '000',
      fatal: true,
    },
  },

  STANDARD: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred!`,
      message: `not verbose`,
      displayOnlyOnVerboseEnvironment: true,
      action: $localize`:@@shared.contactSupport:contact support.`,
      actionURL: `https://support.orcid.org/hc/en-us/requests/new`,
    },
    analytics: {
      code: '001',
      fatal: true,
    },
  },

  STANDARD_VERBOSE: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred!`,
      action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
      actionURL: `https://support.orcid.org/hc/en-us/articles/360047687054`,
    },
    analytics: {
      code: '002',
      fatal: true,
    },
  },

  RESET_PASSWORD_COULD_NOT_RECOVER: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred.`,
      // tslint:disable-next-line:max-line-length
      message: $localize`:@@ngOrcid.passwordError:We couldn't recover your account details. Please try again, and if the error persists please`,
      action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
      actionURL: `https://support.orcid.org/hc/en-us/articles/360047687054`,
    },
    analytics: {
      code: '003',
      fatal: true,
    },
  },

  REGISTER: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred.`,
      // tslint:disable-next-line:max-line-length
      message: $localize`:@@ngOrcid.registerError:We couldn't complete your registration. Please try again, and if the error persists please`,
      action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
      actionURL: `https://support.orcid.org/hc/en-us/articles/360047687054`,
    },
    analytics: {
      code: '003',
      fatal: true,
    },
  },
}
