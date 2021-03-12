import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AffiliationComponent } from './affiliation.component'

describe('AffiliationComponent', () => {
  let component: AffiliationComponent
  let fixture: ComponentFixture<AffiliationComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AffiliationComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
