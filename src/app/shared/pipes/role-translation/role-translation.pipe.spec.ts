import { RoleTranslationPipe } from './role-translation.pipe'
import { ContributionRoles, Role } from '../../../types/works.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RoleTranslationPipe', () => {
  let pipe: RoleTranslationPipe
  let roles: Role[]

  beforeEach(() => {
    pipe = new RoleTranslationPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return translation of the role by key', () => {
    expect(pipe.transform('writing - review & editing')).toBe(
      'Writing - review & editing'
    )
  })
})
