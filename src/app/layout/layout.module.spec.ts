import { LayoutModule } from './layout.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('LayoutModule', () => {
  let layoutModule: LayoutModule

  beforeEach(() => {
    layoutModule = new LayoutModule()
  })

  it('should create an instance', () => {
    expect(layoutModule).toBeTruthy()
  })
})
