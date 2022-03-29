import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AffiliationComponent } from './affiliation.component'
import { AffiliationTypeLabelPipe } from '../../../shared/pipes/affiliation-type-label.pipe'

describe('AffiliationComponent', () => {
  let component: AffiliationComponent
  let fixture: ComponentFixture<AffiliationComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AffiliationComponent, AffiliationTypeLabelPipe],
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
