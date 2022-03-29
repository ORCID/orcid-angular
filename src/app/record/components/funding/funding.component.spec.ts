import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FundingComponent } from './funding.component'
import { RecordFundingTypeLabelPipe } from '../../../shared/pipes/record-funding-type-label/record-funding-type-label.pipe'

describe('FundingComponent', () => {
  let component: FundingComponent
  let fixture: ComponentFixture<FundingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FundingComponent, RecordFundingTypeLabelPipe],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
