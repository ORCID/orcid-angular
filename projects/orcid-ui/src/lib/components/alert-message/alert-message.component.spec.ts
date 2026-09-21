import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AlertMessageComponent } from './alert-message.component'

describe('AlertMessageComponent', () => {
  let component: AlertMessageComponent
  let fixture: ComponentFixture<AlertMessageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertMessageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AlertMessageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /*
   * PD-5635. The success variant borrowed the brand green (#7faa26 on #fcfdf9)
   * because the application had no success state of its own; the design system
   * has one, and every frame in the 2FA recovery phone set draws it. The
   * warning variant was already on the right border and is pinned here beside
   * it so a later palette change cannot move one without the other.
   */
  const containerOf = (type: 'warning' | 'success') => {
    component.type = type
    fixture.detectChanges()
    return fixture.nativeElement.querySelector(
      '.alert-container'
    ) as HTMLElement
  }

  it('draws a success alert in the design system notice-success colours', () => {
    const style = getComputedStyle(containerOf('success'))

    expect(style.borderTopColor).toBe('rgb(86, 184, 51)')
    expect(style.backgroundColor).toBe('rgb(249, 254, 246)')
  })

  it('draws a warning alert in the design system notice-warning colours', () => {
    const style = getComputedStyle(containerOf('warning'))

    expect(style.borderTopColor).toBe('rgb(211, 47, 47)')
  })
})
