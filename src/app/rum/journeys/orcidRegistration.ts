export interface OrcidRegistrationContext {
  isReactivation?: boolean
  coulumn4?: boolean
  column8?: boolean
  column12?: boolean
}

export interface OrcidRegistrationEventAttributes {
  formValues?: unknown
  formValid?: boolean
  errors?: {
    givenNamesError?: unknown
    familyNamesError?: unknown
    emailError?: unknown
    confirmEmailError?: unknown
    additionalEmailsError?: unknown
    passwordError?: unknown
    confirmPasswordError?: unknown
    departmentNameError?: unknown
    roleTitleError?: unknown
    startDateGroupErrors?: unknown
    organizationErrors?: unknown
    visibilityErrors?: unknown
    captcha?: unknown
    sendMemberUpdatesError?: unknown
    termsOfUseError?: unknown
  }
  validator?: unknown
  response?: unknown
}
