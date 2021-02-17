import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalWebsitesComponent } from './modal-websites.component'

describe('ModalWebsitesComponent', () => {
  let component: ModalWebsitesComponent
  let fixture: ComponentFixture<ModalWebsitesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWebsitesComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWebsitesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
