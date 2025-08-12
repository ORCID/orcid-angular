import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'

import { FundingComponent } from './funding.component'
import { SharedModule } from '../../../shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FundingComponent', () => {
  let component: FundingComponent
  let fixture: ComponentFixture<FundingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [FundingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
