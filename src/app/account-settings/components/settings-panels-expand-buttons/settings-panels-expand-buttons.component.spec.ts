import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PanelExpandButtonsComponent as SettingsPanelExpandButtonsComponent,
} from './settings-panels-expand-buttons.component';

describe('PanelExpandButtonsComponent', () => {
  let component: SettingsPanelExpandButtonsComponent
  let fixture: ComponentFixture<SettingsPanelExpandButtonsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPanelExpandButtonsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelExpandButtonsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
