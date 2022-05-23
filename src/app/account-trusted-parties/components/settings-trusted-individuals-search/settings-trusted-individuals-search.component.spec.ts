import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedIndividualsSearchComponent } from './settings-trusted-individuals-search.component'

describe('SettingsTrustedIndividualsSearchComponent', () => {
  let component: SettingsTrustedIndividualsSearchComponent
  let fixture: ComponentFixture<SettingsTrustedIndividualsSearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsTrustedIndividualsSearchComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTrustedIndividualsSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
