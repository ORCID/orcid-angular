import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorRecoveryCodesComponent } from './two-factor-recovery-codes.component';

describe('TwoFactorRecoveryCodesComponent', () => {
  let component: TwoFactorRecoveryCodesComponent;
  let fixture: ComponentFixture<TwoFactorRecoveryCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoFactorRecoveryCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorRecoveryCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
