import { BootstrapLayoutModule } from './bootstrap-layout.module'

describe('BoostrapLayoutModule', () => {
  let bootstrapLayoutModule: BootstrapLayoutModule

  beforeEach(() => {
    bootstrapLayoutModule = new BootstrapLayoutModule()
  })

  it('should create an instance', () => {
    expect(bootstrapLayoutModule).toBeTruthy()
  })
})
