import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { MyOrcidAlertsComponent } from './my-orcid-alerts.component'

describe('MyOrcidAlertsComponent', () => {
  let component: MyOrcidAlertsComponent
  let fixture: ComponentFixture<MyOrcidAlertsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyOrcidAlertsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrcidAlertsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
