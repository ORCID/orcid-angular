import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerReviewStackComponent } from './peer-review-stack.component';

describe('PeerReviewStackComponent', () => {
  let component: PeerReviewStackComponent;
  let fixture: ComponentFixture<PeerReviewStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeerReviewStackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerReviewStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
