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
  const containerOf = (type: 'warning' | 'success' | 'notice-important') => {
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

  /*
   * PD-6042. The background was state-warning-lightest, which is the same
   * colour at 25% and composites to #fffafb on white. The frame behind
   * `pd-6042-10` paints notice-warning-background #ffebee at full opacity -
   * 44 of 44 interior samples, and the token it binds for it is an exact
   * match - so the notice now paints the solid token. pd-6042-04 and
   * pd-6043-10 paint the same #ffebee, and the top-bar warning already used
   * the solid value; this brings the panel notice onto it too.
   */
  it('draws a warning alert in the design system notice-warning colours', () => {
    const style = getComputedStyle(containerOf('warning'))

    expect(style.borderTopColor).toBe('rgb(211, 47, 47)')
    expect(style.backgroundColor).toBe('rgb(255, 235, 238)')
  })

  /*
   * PD-5692. The mandatory password reset frames draw their notice in the
   * design system's notice-important: #ff9c00 on the notice background, an
   * error glyph, and links in the ordinary #085c77. The plain notice keeps its
   * own colours, so nothing that already uses it changes.
   */
  it('draws a notice-important alert in the design system colours', () => {
    const container = containerOf('notice-important')
    const style = getComputedStyle(container)

    expect(style.borderTopColor).toBe('rgb(255, 156, 0)')
    expect(style.backgroundColor).toBe('rgb(255, 251, 238)')
    expect(container.querySelector('mat-icon').textContent.trim()).toBe(
      'error_outline'
    )
  })

  it('leaves the plain notice on its own colours', () => {
    component.type = 'notice'
    fixture.detectChanges()
    const container = fixture.nativeElement.querySelector(
      '.alert-container'
    ) as HTMLElement

    expect(getComputedStyle(container).borderTopColor).toBe('rgb(255, 100, 0)')
    expect(container.querySelector('mat-icon').textContent.trim()).toBe(
      'info_outline'
    )
  })
})
