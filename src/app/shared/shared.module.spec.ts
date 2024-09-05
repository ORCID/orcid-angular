import { SharedModule } from './shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SharedModule', () => {
  let sharedModule: SharedModule

  beforeEach(() => {
    sharedModule = new SharedModule()
  })

  it('should create an instance', () => {
    expect(sharedModule).toBeTruthy()
  })
})
