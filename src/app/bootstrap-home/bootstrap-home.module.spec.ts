import { BootstrapHomeModule } from './bootstrap-home.module'

describe('BootstrapHomeModule', () => {
  let bootstrapHomeModule: BootstrapHomeModule

  beforeEach(() => {
    bootstrapHomeModule = new BootstrapHomeModule()
  })

  it('should create an instance', () => {
    expect(bootstrapHomeModule).toBeTruthy()
  })
})
