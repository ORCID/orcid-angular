// When the error text is not listed on the RegisterBackendErrors enum
// the error message will be displayed as it comes from the backend
// This is because the backend might return code or a text ready for the UI
export enum RegisterBackendErrors {
  'orcid.frontend.verify.duplicate_email',
  'additionalEmailCantBePrimaryEmail',
  'duplicatedAdditionalEmail',
  'orcid.frontend.verify.unclaimed_email',
  'orcid.frontend.verify.deactivated_email'
}
