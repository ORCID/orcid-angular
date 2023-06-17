import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSecretComponent } from './client-secret.component';

describe('ClientSecretComponent', () => {
  let component: ClientSecretComponent;
  let fixture: ComponentFixture<ClientSecretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSecretComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSecretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
