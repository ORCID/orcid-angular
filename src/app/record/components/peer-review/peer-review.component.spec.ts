import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerReviewComponent } from './peer-review.component';

describe('PeerReviewComponent', () => {
  let component: PeerReviewComponent;
  let fixture: ComponentFixture<PeerReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
