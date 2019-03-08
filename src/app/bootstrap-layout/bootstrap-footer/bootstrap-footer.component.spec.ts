import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BootstrapFooterComponent } from './bootstrap-footer.component'

describe('BootstrapFooterComponent', () => {
  let component: BootstrapFooterComponent
  let fixture: ComponentFixture<BootstrapFooterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BootstrapFooterComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
