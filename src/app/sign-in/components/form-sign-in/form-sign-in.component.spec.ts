import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSignInComponent } from './form-sign-in.component';

describe('FormSignInComponent', () => {
  let component: FormSignInComponent;
  let fixture: ComponentFixture<FormSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
