import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResearchResourceStacksGroupComponent } from './research-resource-stacks-group.component'

describe('ResearchResourcesComponent', () => {
  let component: ResearchResourceStacksGroupComponent
  let fixture: ComponentFixture<ResearchResourceStacksGroupComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResearchResourceStacksGroupComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchResourceStacksGroupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
