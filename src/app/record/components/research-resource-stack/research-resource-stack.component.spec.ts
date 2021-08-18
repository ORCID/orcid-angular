import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResearchResourceStackComponent } from './research-resource-stack.component'

describe('ResearchResourceStackComponent', () => {
  let component: ResearchResourceStackComponent
  let fixture: ComponentFixture<ResearchResourceStackComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResearchResourceStackComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchResourceStackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
