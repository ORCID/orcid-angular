import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareEmailsDomainsComponent } from './share-emails-domains.component';

describe('ShareEmailsDomainsComponent', () => {
  let component: ShareEmailsDomainsComponent;
  let fixture: ComponentFixture<ShareEmailsDomainsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareEmailsDomainsComponent]
    });
    fixture = TestBed.createComponent(ShareEmailsDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
