import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkExternalIdentifiersViewOnlyComponent } from './work-external-identifiers-view-only.component'

describe('ExternalIdentifiersViewOnlyComponent', () => {
  let component: WorkExternalIdentifiersViewOnlyComponent
  let fixture: ComponentFixture<WorkExternalIdentifiersViewOnlyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkExternalIdentifiersViewOnlyComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExternalIdentifiersViewOnlyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
