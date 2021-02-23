import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalPersonIdentifiersComponent } from './modal-person-identifiers.component'

describe('ModalPersonIdentifiersComponent', () => {
  let component: ModalPersonIdentifiersComponent
  let fixture: ComponentFixture<ModalPersonIdentifiersComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPersonIdentifiersComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPersonIdentifiersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
