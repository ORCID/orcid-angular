import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PrintErrorsComponent } from './print-errors.component'

describe('PrintErrorsComponent', () => {
  let component: PrintErrorsComponent
  let fixture: ComponentFixture<PrintErrorsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintErrorsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintErrorsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
