import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DialogAddTrustedIndividualsComponent } from './dialog-add-trusted-individuals.component'

describe('DialogAddTrustedIndividualsComponent', () => {
  let component: DialogAddTrustedIndividualsComponent
  let fixture: ComponentFixture<DialogAddTrustedIndividualsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAddTrustedIndividualsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddTrustedIndividualsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
