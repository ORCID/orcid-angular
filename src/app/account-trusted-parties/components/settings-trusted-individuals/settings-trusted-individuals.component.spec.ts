import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedIndividualsComponent } from './settings-trusted-individuals.component'

describe('SettingsTrustedIndividualsComponent', () => {
  let component: SettingsTrustedIndividualsComponent
  let fixture: ComponentFixture<SettingsTrustedIndividualsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsTrustedIndividualsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTrustedIndividualsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
