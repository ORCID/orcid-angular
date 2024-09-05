import { CoreModule } from './core.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('CoreModule', () => {
  let coreModule: CoreModule

  beforeEach(() => {
    coreModule = new CoreModule()
  })

  it('should create an instance', () => {
    expect(coreModule).toBeTruthy()
  })
})
