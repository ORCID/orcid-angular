import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalFundingComponent } from './modal-funding.component'

describe('ModalNameComponent', () => {
  let component: ModalFundingComponent
  let fixture: ComponentFixture<ModalFundingComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ModalFundingComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFundingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
