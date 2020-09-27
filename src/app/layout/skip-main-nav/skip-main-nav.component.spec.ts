import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SkipMainNavComponent } from './skip-main-nav.component'

describe('SkipMainNavComponent', () => {
  let component: SkipMainNavComponent
  let fixture: ComponentFixture<SkipMainNavComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkipMainNavComponent],
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
