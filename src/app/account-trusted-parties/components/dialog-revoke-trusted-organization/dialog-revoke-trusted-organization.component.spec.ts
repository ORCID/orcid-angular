import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRevokeTrustedOrganizationComponent } from './dialog-revoke-trusted-organization.component';

describe('DialogRevokeTrustedOrganizationComponent', () => {
  let component: DialogRevokeTrustedOrganizationComponent;
  let fixture: ComponentFixture<DialogRevokeTrustedOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRevokeTrustedOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRevokeTrustedOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
