import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DialogRevokeTrustedIndividualsComponent } from './dialog-revoke-trusted-individuals.component'

describe('DialogRevokeTrustedIndividualsComponent', () => {
  let component: DialogRevokeTrustedIndividualsComponent
  let fixture: ComponentFixture<DialogRevokeTrustedIndividualsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogRevokeTrustedIndividualsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRevokeTrustedIndividualsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
