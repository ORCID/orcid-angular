import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedOrganizationComponent } from './settings-trusted-organization.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsTrustedOrganizationComponent', () => {
  let component: SettingsTrustedOrganizationComponent
  let fixture: ComponentFixture<SettingsTrustedOrganizationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsTrustedOrganizationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTrustedOrganizationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
