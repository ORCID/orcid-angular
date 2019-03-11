import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BootstrapHomeComponent } from './bootstrap-home.component'

describe('BootstrapHomeComponent', () => {
  let component: BootstrapHomeComponent
  let fixture: ComponentFixture<BootstrapHomeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BootstrapHomeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapHomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
