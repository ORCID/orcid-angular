import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SkipMainNavComponent } from './skip-main-nav.component'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'

describe('SkipMainNavComponent', () => {
  let component: SkipMainNavComponent
  let fixture: ComponentFixture<SkipMainNavComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SkipMainNavComponent],
      providers: [WINDOW_PROVIDERS],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SkipMainNavComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
