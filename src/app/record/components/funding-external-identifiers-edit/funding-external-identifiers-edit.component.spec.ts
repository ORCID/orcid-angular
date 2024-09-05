import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FundingExternalIdentifiersEditComponent } from './funding-external-identifiers-edit.component'
import { SharedModule } from '../../../shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FundingExternalIdentifiersEditComponent', () => {
  let component: FundingExternalIdentifiersEditComponent
  let fixture: ComponentFixture<FundingExternalIdentifiersEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [FundingExternalIdentifiersEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
