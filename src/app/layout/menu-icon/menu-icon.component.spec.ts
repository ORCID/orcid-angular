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

  it('toggles between the menu and close icons', () => {
    const button = () => fixture.nativeElement.querySelector('button')
    const iconName = () =>
      fixture.nativeElement.querySelector('mat-icon').textContent.trim()

    expect(iconName()).toBe('menu')
    expect(button().getAttribute('aria-expanded')).toBe('false')

    component.isOpen = true
    fixture.detectChanges()

    expect(iconName()).toBe('close')
    expect(button().getAttribute('aria-expanded')).toBe('true')
  })
})
