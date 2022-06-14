import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoggedInComponent } from './logged-in.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

describe('LoggedInComponent', () => {
  let component: LoggedInComponent
  let fixture: ComponentFixture<LoggedInComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInComponent],
      providers: [WINDOW_PROVIDERS]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedInComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
