import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AffiliationStackComponent } from './affiliation-stack.component'

describe('AffiliationComponent', () => {
  let component: AffiliationStackComponent
  let fixture: ComponentFixture<AffiliationStackComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationStackComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationStackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
