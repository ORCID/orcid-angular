import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSecurityPasswordComponent } from './settings-security-password.component';

describe('SettingsSecurityPasswordComponent', () => {
  let component: SettingsSecurityPasswordComponent;
  let fixture: ComponentFixture<SettingsSecurityPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsSecurityPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSecurityPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
