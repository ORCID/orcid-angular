import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MenuIconComponent } from './menu-icon.component'

describe('MenuIconComponent', () => {
  let component: MenuIconComponent
  let fixture: ComponentFixture<MenuIconComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuIconComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuIconComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
