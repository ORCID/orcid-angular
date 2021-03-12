import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalCountryComponent } from './modal-country.component'

describe('ModalCountryComponent', () => {
  let component: ModalCountryComponent
  let fixture: ComponentFixture<ModalCountryComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ModalCountryComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCountryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
