import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InstitutionalComponent } from './institutional.component'

describe('InstitutionalComponent', () => {
  let component: InstitutionalComponent
  let fixture: ComponentFixture<InstitutionalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InstitutionalComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
