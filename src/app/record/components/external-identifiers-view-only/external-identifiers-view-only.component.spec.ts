import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalIdentifiersViewOnlyComponent } from './external-identifiers-view-only.component';

describe('ExternalIdentifiersViewOnlyComponent', () => {
  let component: ExternalIdentifiersViewOnlyComponent;
  let fixture: ComponentFixture<ExternalIdentifiersViewOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalIdentifiersViewOnlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalIdentifiersViewOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
