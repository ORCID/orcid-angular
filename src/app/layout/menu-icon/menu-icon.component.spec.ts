import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MenuIconComponent } from './menu-icon.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('MenuIconComponent', () => {
  let component: MenuIconComponent
  let fixture: ComponentFixture<MenuIconComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuIconComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuIconComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
