import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkExternalIdentifiersEditComponent } from './work-external-identifiers-edit.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WorkExternalIdentifiersEditComponent', () => {
  let component: WorkExternalIdentifiersEditComponent
  let fixture: ComponentFixture<WorkExternalIdentifiersEditComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkExternalIdentifiersEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
