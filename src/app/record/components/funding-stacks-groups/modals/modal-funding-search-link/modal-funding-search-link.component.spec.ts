import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalFundingSearchLinkComponent } from './modal-funding-search-link.component'

describe('ModalFundingSearchLinkComponent', () => {
  let component: ModalFundingSearchLinkComponent
  let fixture: ComponentFixture<ModalFundingSearchLinkComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFundingSearchLinkComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFundingSearchLinkComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
