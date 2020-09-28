import { ErrorReport } from './types'

export const ERROR_REPORT: {
  JUST_GA: ErrorReport
  STANDARD_NO_VERBOSE: ErrorReport
  STANDARD_NO_VERBOSE_NO_GA: ErrorReport
  STANDARD_VERBOSE: ErrorReport
  RESET_PASSWORD_COULD_NOT_RECOVER: ErrorReport
  REGISTER: ErrorReport
  REGISTER_REACTIVATED_EMAIL: ErrorReport
  OAUTH_PARAMETERS: ErrorReport
} = {
  // The JUST_GA error
  // It will report the error only on google analytics
  JUST_GA: {
    analytics: {
      code: '000',
      fatal: true,
    },
  },

  // The STANDARD_NO_VERBOSE
  // use by default on every not expect HTTP response
  // should be use for non critical HTTP errors and non critical thrown errors
  // It will report the error on google analytics and will be show to the user **only on QA and local dev environments**
  STANDARD_NO_VERBOSE: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred`,
      message: `Internal Orcid QA error please`,
      displayOnlyOnVerboseEnvironment: true,
      action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
      actionURL: `https://support.orcid.org/hc/en-us/articles/360047687054`,
    },
    analytics: {
      code: '001',
      fatal: true,
    },
  },

  // The STANDARD_NO_VERBOSE_NO_QA
  // Same as STANDARD_NO_VERBOSE, but without google analytics report
  STANDARD_NO_VERBOSE_NO_GA: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred`,
      message: `Internal Orcid QA, error please`,
      displayOnlyOnVerboseEnvironment: true,
      action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
      actionURL: `https://support.orcid.org/hc/en-us/articles/360047687054`,
    },
  },

  // The STANDARD_VERBOSE
  // should be use for critical HTTP errors and critical thrown errors
  // It will report the error on google analytics and the snackbar will be show to the user
  STANDARD_VERBOSE: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred`,
      message: $localize`:@@shared.standardError:Please try again, and if the error persists please`,
      action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
      actionURL: `https://support.orcid.org/hc/en-us/articles/360047687054`,
    },
    analytics: {
      code: '002',
      fatal: true,
    },
  },

  // The RESET_PASSWORD_COULD_NOT_RECOVER is used only on the /reset-password page after the user clicks the recover account details button
  // It will report the error on google analytics and the snackbar will be show to the user
  RESET_PASSWORD_COULD_NOT_RECOVER: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred`,
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

  // The REGISTER is used only on the /register page after the user clicks the register button
  // It will report the error on google analytics and the snackbar will be show to the user
  REGISTER: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred`,
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

  // The REGISTER_REACTIVATED_EMAIL is used only on the /register page
  // after the user clicks the reactivation link display under the email input
  // It will report the error on google analytics and the snackbar will be show to the user
  REGISTER_REACTIVATED_EMAIL: {
    display: {
      title: $localize`:@@ngOrcid.error:Oh no! An error occurred.`,
      // tslint:disable-next-line:max-line-length
      message: $localize`:@@ngOrcid.reactivationAccountError:We couldn't reactivate your ORCID account. Please try again, and if the error persists please`,
      action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
      actionURL: `https://support.orcid.org/hc/en-us/articles/360047687054`,
    },
    analytics: {
      code: '004',
      fatal: true,
    },
  },

  // OAUTH_PARAMETERS is used only when the server returns an error related to the OAUTH parameters
  // It will NOT report the error on google analytics but the snackbar will be show to the user
  OAUTH_PARAMETERS: {
    display: {
      title: $localize`:@@shared.oauthSessionError:Your Oauth request is invalid.`,
    },
  },
}
