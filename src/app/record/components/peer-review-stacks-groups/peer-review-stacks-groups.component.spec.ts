import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PeerReviewStacksGroupsComponent } from './peer-review-stacks-groups.component'

describe('PeerReviewStacksGroupsComponent', () => {
  let component: PeerReviewStacksGroupsComponent
  let fixture: ComponentFixture<PeerReviewStacksGroupsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PeerReviewStacksGroupsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerReviewStacksGroupsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
