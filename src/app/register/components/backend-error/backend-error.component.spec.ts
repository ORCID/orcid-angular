import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BackendErrorComponent } from './backend-error.component'

describe('BackendErrorComponent', () => {
  let component: BackendErrorComponent
  let fixture: ComponentFixture<BackendErrorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackendErrorComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendErrorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
