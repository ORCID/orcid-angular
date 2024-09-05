import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ClientSecretComponent } from './client-secret.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ClientSecretComponent', () => {
  let component: ClientSecretComponent
  let fixture: ComponentFixture<ClientSecretComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientSecretComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(ClientSecretComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
