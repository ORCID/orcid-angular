import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsActionsComponent } from './settings-actions.component'

describe('SettingsActionsComponent', () => {
  let component: SettingsActionsComponent
  let fixture: ComponentFixture<SettingsActionsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsActionsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsActionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
