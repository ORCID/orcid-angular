import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsActionsDuplicatedComponent } from './settings-actions-duplicated.component'

describe('SettingsActionsDuplicatedComponent', () => {
  let component: SettingsActionsDuplicatedComponent
  let fixture: ComponentFixture<SettingsActionsDuplicatedComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsActionsDuplicatedComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsActionsDuplicatedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
