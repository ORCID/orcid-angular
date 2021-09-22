import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingExternalIdentifiersViewOnlyComponent } from './funding-external-identifiers-view-only.component';

describe('ExternalIdentifiersViewOnlyComponent', () => {
  let component: FundingExternalIdentifiersViewOnlyComponent;
  let fixture: ComponentFixture<FundingExternalIdentifiersViewOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundingExternalIdentifiersViewOnlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingExternalIdentifiersViewOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
