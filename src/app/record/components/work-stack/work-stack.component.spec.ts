import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkStackComponent } from './work-stack.component'

describe('WorkStackComponent', () => {
  let component: WorkStackComponent
  let fixture: ComponentFixture<WorkStackComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkStackComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkStackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
