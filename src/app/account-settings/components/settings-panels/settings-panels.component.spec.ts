import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { SettingsPanelsComponent } from './settings-panels.component'

describe('StackContainerComponent', () => {
  let component: SettingsPanelsComponent
  let fixture: ComponentFixture<SettingsPanelsComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsPanelsComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
