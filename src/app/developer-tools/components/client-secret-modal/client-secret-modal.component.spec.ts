import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSecretModalComponent } from './client-secret-modal.component';

describe('ClientSecretModalComponent', () => {
  let component: ClientSecretModalComponent;
  let fixture: ComponentFixture<ClientSecretModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSecretModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSecretModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
