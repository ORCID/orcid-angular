import { EmailsEndpoint } from '../types'

export const setProfessionalEmails = (
  emails: EmailsEndpoint
): EmailsEndpoint => {
  emails?.emailDomains?.forEach((domain) => {
    emails?.emails?.forEach((email) => {
      if (email?.value?.includes(domain?.value)) {
        email.professionalEmail = true
      }
    })
  })
  return emails
}
