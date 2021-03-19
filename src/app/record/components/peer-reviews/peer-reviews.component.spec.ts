import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PeerReviewsComponent } from './peer-reviews.component'

describe('PeerReviewsComponent', () => {
  let component: PeerReviewsComponent
  let fixture: ComponentFixture<PeerReviewsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PeerReviewsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerReviewsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
