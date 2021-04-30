import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FundingStacksGroupsComponent } from './funding-stacks-groups.component'

describe('FundingsComponent', () => {
  let component: FundingStacksGroupsComponent
  let fixture: ComponentFixture<FundingStacksGroupsComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FundingStacksGroupsComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingStacksGroupsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
