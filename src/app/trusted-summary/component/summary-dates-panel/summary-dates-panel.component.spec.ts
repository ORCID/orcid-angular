import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDatesPanelComponent } from './summary-dates-panel.component';

describe('SummaryDatesPanelComponent', () => {
  let component: SummaryDatesPanelComponent;
  let fixture: ComponentFixture<SummaryDatesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryDatesPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryDatesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
