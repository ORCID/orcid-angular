import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkModalRelationshipViewOnlyComponent } from './work-modal-relationship-view-only.component'

describe('WorkModalRelationshipViewOnlyComponent', () => {
  let component: WorkModalRelationshipViewOnlyComponent
  let fixture: ComponentFixture<WorkModalRelationshipViewOnlyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkModalRelationshipViewOnlyComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkModalRelationshipViewOnlyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
