import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedSummaryComponent } from './trusted-summary.component';

describe('TrustedSummaryComponent', () => {
  let component: TrustedSummaryComponent;
  let fixture: ComponentFixture<TrustedSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrustedSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
