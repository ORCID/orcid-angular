import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkDetailsComponent } from './work-details.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

describe('WorkDetailsComponent', () => {
  let component: WorkDetailsComponent
  let fixture: ComponentFixture<WorkDetailsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [WorkDetailsComponent],
    })
    fixture = TestBed.createComponent(WorkDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
