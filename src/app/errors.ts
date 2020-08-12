import { ErrorReport } from './types'

export const BLIND_ERROR_REPORT: ErrorReport = {}

export const JUST_GA_ERROR_REPORT: ErrorReport = {
  analytics: {
    code: '/00/',
    fatal: true,
  },
}

export const STANDARD_ERROR_REPORT: ErrorReport = {
  display: {
    title: $localize`:@@ngOrcid.error:Oh no! An error occurred.`,
  },
  analytics: {
    code: '/01/',
    fatal: true,
  },
}

export const RESET_PASSWORD_COULD_NOT_RECOVER_ERROR_REPORT: ErrorReport = {
  display: {
    title: $localize`:@@ngOrcid.error:Oh no! An error occurred.`,
    // tslint:disable-next-line:max-line-length
    message: $localize`:@@ngOrcid.passwordError:We couldn't recover your account details. Please try again, and if the error persists please`,
    action: $localize`:@@shared.knowledgeBase:visit our knowledge base.`,
    actionURL: ``,
  },
  analytics: {
    code: '/02/',
    fatal: true,
  },
}
