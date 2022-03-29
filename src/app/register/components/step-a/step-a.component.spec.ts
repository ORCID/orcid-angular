import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepAComponent } from './step-a.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

describe('StepAComponent', () => {
  let component: StepAComponent
  let fixture: ComponentFixture<StepAComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepAComponent],
      imports: [RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(StepAComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
