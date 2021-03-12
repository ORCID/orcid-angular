import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalPersonIdentifiersComponent } from './modal-person-identifiers.component'

describe('ModalPersonIdentifiersComponent', () => {
  let component: ModalPersonIdentifiersComponent
  let fixture: ComponentFixture<ModalPersonIdentifiersComponent>

  beforeEach(waitForAsync(() => {
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
