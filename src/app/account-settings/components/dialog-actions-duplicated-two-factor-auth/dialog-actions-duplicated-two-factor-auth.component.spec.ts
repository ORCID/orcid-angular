import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogActionsDuplicatedTwoFactorAuthComponent } from './dialog-actions-duplicated-two-factor-auth.component';

describe('DialogActionsDuplicatedTwoFactorAuthComponent', () => {
  let component: DialogActionsDuplicatedTwoFactorAuthComponent;
  let fixture: ComponentFixture<DialogActionsDuplicatedTwoFactorAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogActionsDuplicatedTwoFactorAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogActionsDuplicatedTwoFactorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
