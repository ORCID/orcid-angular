import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AffiliationComponent } from './affiliation.component'
import { SharedModule } from '../../../shared/shared.module'

describe('AffiliationComponent', () => {
  let component: AffiliationComponent
  let fixture: ComponentFixture<AffiliationComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AffiliationComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
