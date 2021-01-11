import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacySelectorComponent } from './privacy-selector.component';

describe('PrivacySelectorComponent', () => {
  let component: PrivacySelectorComponent;
  let fixture: ComponentFixture<PrivacySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
