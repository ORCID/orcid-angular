import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPeerReviewsComponent } from './modal-peer-reviews.component';

describe('ModalPeerReviewsComponent', () => {
  let component: ModalPeerReviewsComponent;
  let fixture: ComponentFixture<ModalPeerReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPeerReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPeerReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
