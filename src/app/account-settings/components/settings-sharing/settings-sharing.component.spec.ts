import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSharingComponent } from './settings-sharing.component'

describe('SettingsSharingComponent', () => {
  let component: SettingsSharingComponent
  let fixture: ComponentFixture<SettingsSharingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsSharingComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSharingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
