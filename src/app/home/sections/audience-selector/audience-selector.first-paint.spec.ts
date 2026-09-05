import { MediaMatcher } from '@angular/cdk/layout'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { AudienceSelectorSection } from '../../../types/homepage-content.v2'
import { AudienceSelectorSectionComponent } from './audience-selector-section.component'
import {
  FakeMediaMatcher,
  audienceSelectorFixture,
} from './audience-selector.test-doubles'

@Component({
  standalone: true,
  imports: [AudienceSelectorSectionComponent],
  template: `<app-audience-selector-section [section]="section" />`,
})
class HostComponent {
  section: AudienceSelectorSection = audienceSelectorFixture('tabs-photo')
}

/**
 * The first paint is the whole point of subscribing in the constructor.
 *
 * If the mode were resolved a beat later, a phone would paint a tab strip and
 * then swap it for an accordion — a visible jump, a wrong-mode largest
 * contentful paint, and a screen reader announcing a widget that is about to
 * stop existing. Each spec here calls `detectChanges()` exactly once and looks
 * at what that single pass produced.
 */
describe('the audience selector on its first change-detection pass', () => {
  function firstPass(wide: boolean): HTMLElement {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: MediaMatcher, useValue: new FakeMediaMatcher(wide) },
      ],
    })
    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    return fixture.nativeElement as HTMLElement
  }

  afterEach(() => TestBed.resetTestingModule())

  it('is already a tab strip on a wide viewport', () => {
    const element = firstPass(true)

    expect(element.querySelectorAll('[role="tablist"]').length).toBe(1)
    expect(element.querySelectorAll('[role="tab"]').length).toBe(6)
    expect(element.querySelectorAll('button[aria-expanded]').length).toBe(0)
  })

  it('is already an accordion on a narrow viewport', () => {
    const element = firstPass(false)

    expect(element.querySelectorAll('button[aria-expanded]').length).toBe(6)
    expect(element.querySelectorAll('[role="tablist"]').length).toBe(0)
    expect(element.querySelectorAll('[role="tab"]').length).toBe(0)
  })

  it('never has both widgets in the document at once', () => {
    for (const wide of [true, false]) {
      const element = firstPass(wide)
      const tabs = element.querySelectorAll('[role="tab"]').length
      const headers = element.querySelectorAll('button[aria-expanded]').length

      // Rendering both and hiding one with CSS would duplicate every id, every
      // aria-controls and every word a screen reader reads.
      expect(Math.min(tabs, headers)).toBe(0)
      expect(Math.max(tabs, headers)).toBe(6)
      TestBed.resetTestingModule()
    }
  })
})
