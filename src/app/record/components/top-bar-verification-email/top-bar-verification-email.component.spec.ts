import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarVerificationEmailComponent } from './top-bar-verification-email.component';

describe('TopBarVerificationEmailComponent', () => {
  let component: TopBarVerificationEmailComponent;
  let fixture: ComponentFixture<TopBarVerificationEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopBarVerificationEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarVerificationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
