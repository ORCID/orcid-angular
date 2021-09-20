import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorksVisibilityModalComponent } from './works-visibility-modal.component'

describe('WorksVisibilityModalComponent', () => {
  let component: WorksVisibilityModalComponent
  let fixture: ComponentFixture<WorksVisibilityModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorksVisibilityModalComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksVisibilityModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
