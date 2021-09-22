import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkExternalIdentifiersEditComponent } from './work-external-identifiers-edit.component'

describe('ExternalIdentifiersEditComponent', () => {
  let component: WorkExternalIdentifiersEditComponent
  let fixture: ComponentFixture<WorkExternalIdentifiersEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkExternalIdentifiersEditComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExternalIdentifiersEditComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
