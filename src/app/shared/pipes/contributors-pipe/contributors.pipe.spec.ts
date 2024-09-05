import { ContributorsPipe } from './contributors.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ContributorsPipe', () => {
  it('create an instance', () => {
    const pipe = new ContributorsPipe()
    expect(pipe).toBeTruthy()
  })
})
