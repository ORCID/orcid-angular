import { EmailsEndpoint } from '../types'

export const setProfessionalEmails = (
  emails: EmailsEndpoint
): EmailsEndpoint => {
  emails?.emailDomains?.forEach((domain) => {
    emails?.emails?.forEach((email) => {
      if (
        email?.value?.split('@')[1].endsWith('.' + domain?.value) ||
        email?.value?.split('@')[1] === domain?.value
      ) {
        email.professionalEmail = true
      }
    })
  })
  return emails
}
