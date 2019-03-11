import { BootstrapHomeRoutingModule } from './bootstrap-home-routing.module'

describe('BootstrapHomeRoutingModule', () => {
  let bootstrapHomeRoutingModule: BootstrapHomeRoutingModule

  beforeEach(() => {
    bootstrapHomeRoutingModule = new BootstrapHomeRoutingModule()
  })

  it('should create an instance', () => {
    expect(bootstrapHomeRoutingModule).toBeTruthy()
  })
})
