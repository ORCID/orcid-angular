import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BootstrapHeaderComponent } from './bootstrap-header.component'

describe('BootstrapHeaderComponent', () => {
  let component: BootstrapHeaderComponent
  let fixture: ComponentFixture<BootstrapHeaderComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BootstrapHeaderComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
