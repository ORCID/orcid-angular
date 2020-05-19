import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionalLinkingComponent } from './institutional-linking.component';

describe('InstitutionalLinkingComponent', () => {
  let component: InstitutionalLinkingComponent;
  let fixture: ComponentFixture<InstitutionalLinkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionalLinkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionalLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
