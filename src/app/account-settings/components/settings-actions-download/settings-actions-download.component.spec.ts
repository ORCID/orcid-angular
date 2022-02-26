import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsActionsDownloadComponent } from './settings-actions-download.component'

describe('SettingsActionsDownloadComponent', () => {
  let component: SettingsActionsDownloadComponent
  let fixture: ComponentFixture<SettingsActionsDownloadComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsActionsDownloadComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsActionsDownloadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
