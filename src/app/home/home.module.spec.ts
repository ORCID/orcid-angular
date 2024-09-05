import { HomeModule } from './home.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('HomeModule', () => {
  let homeModule: HomeModule

  beforeEach(() => {
    homeModule = new HomeModule()
  })

  it('should create an instance', () => {
    expect(homeModule).toBeTruthy()
  })
})
