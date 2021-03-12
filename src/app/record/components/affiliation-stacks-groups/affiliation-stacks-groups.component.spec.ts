import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AffiliationStacksGroupsComponent } from './affiliation-stacks-groups.component'

describe('AffiliationsComponent', () => {
  let component: AffiliationStacksGroupsComponent
  let fixture: ComponentFixture<AffiliationStacksGroupsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationStacksGroupsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationStacksGroupsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
