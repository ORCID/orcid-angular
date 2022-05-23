import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsPanelsDataComponent } from './settings-panels-data.component'

describe('SettingsPanelsDataComponent', () => {
  let component: SettingsPanelsDataComponent
  let fixture: ComponentFixture<SettingsPanelsDataComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPanelsDataComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelsDataComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
