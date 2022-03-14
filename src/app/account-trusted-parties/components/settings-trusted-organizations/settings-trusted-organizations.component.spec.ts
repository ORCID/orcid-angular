import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedOrganizationsComponent } from './settings-trusted-organizations.component'

describe('SettingsTrustedOrganizationsComponent', () => {
  let component: SettingsTrustedOrganizationsComponent
  let fixture: ComponentFixture<SettingsTrustedOrganizationsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsTrustedOrganizationsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTrustedOrganizationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
