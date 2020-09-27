import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SideBarIdComponent } from './side-bar-id.component'

describe('SideBarIdComponent', () => {
  let component: SideBarIdComponent
  let fixture: ComponentFixture<SideBarIdComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideBarIdComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarIdComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
