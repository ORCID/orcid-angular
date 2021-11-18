import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FundingExternalIdentifiersEditComponent } from './funding-external-identifiers-edit.component'

describe('ExternalIdentifiersEditComponent', () => {
  let component: FundingExternalIdentifiersEditComponent
  let fixture: ComponentFixture<FundingExternalIdentifiersEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundingExternalIdentifiersEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingExternalIdentifiersEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
