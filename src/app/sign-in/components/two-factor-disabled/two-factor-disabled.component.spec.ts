import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { TwoFactorDisabledComponent } from './two-factor-disabled.component'

describe('TwoFactorDisabledComponent', () => {
  let component: TwoFactorDisabledComponent
  let fixture: ComponentFixture<TwoFactorDisabledComponent>
  let continued: jasmine.Spy

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFactorDisabledComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(TwoFactorDisabledComponent)
    component = fixture.componentInstance
    continued = jasmine.createSpy('continue')
    component.continue.subscribe(continued)
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('names the client when the oauth session knows it (R4.2)', () => {
    component.clientName = 'A member organization'
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toContain(
      'Continue to A member organization'
    )
  })

  it('falls back to a generic label when it does not', () => {
    fixture.detectChanges()

    const button = fixture.nativeElement.querySelector(
      '#cy-continue-after-two-factor-disabled'
    )
    expect(button.textContent.trim()).toBe('Continue')
  })

  it('takes focus to its heading, so the swap is announced', () => {
    fixture.detectChanges()

    const heading = fixture.nativeElement.querySelector(
      '.two-factor-disabled__title'
    )
    // Out of the tab order, but focusable: the sign-in card that held focus
    // is gone, and the ten-second timer is already running
    expect(heading.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(heading)
  })

  it('continues on its own after ten seconds (R4.3)', fakeAsync(() => {
    fixture.detectChanges()

    tick(9999)
    expect(continued).not.toHaveBeenCalled()

    tick(1)
    expect(continued).toHaveBeenCalledTimes(1)
  }))

  it('never continues twice when the button is pressed first', fakeAsync(() => {
    fixture.detectChanges()

    component.onContinue()
    expect(continued).toHaveBeenCalledTimes(1)

    tick(10000)
    expect(continued).toHaveBeenCalledTimes(1)
  }))

  it('drops the timer when it is destroyed', fakeAsync(() => {
    fixture.detectChanges()

    fixture.destroy()
    tick(10000)

    expect(continued).not.toHaveBeenCalled()
  }))
})
