import { AssertionVisibilityString } from '.'

export interface EmailsEndpoint {
  emails: AssertionVisibilityString[]
  errors: string[]
}

export interface EmailsActions {
  email: AssertionVisibilityString
  action: 'ADD' | 'UPDATE' | 'DELETE' | 'PRIMARY'
}
