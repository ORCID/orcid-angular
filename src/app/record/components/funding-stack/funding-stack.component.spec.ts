import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FundingStackComponent } from './funding-stack.component'

describe('FundingComponent', () => {
  let component: FundingStackComponent
  let fixture: ComponentFixture<FundingStackComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundingStackComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingStackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
