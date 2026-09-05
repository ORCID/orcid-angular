import { HeadingComponent } from '../heading/heading.component'
import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Spacing, Tone } from '../../../types/homepage-content.v2'
import { SectionShellComponent } from './section-shell.component'

@Component({
  standalone: true,
  imports: [HeadingComponent, SectionShellComponent],
  template: `
    <app-section-shell
      [sectionId]="sectionId"
      [tone]="tone"
      [spacing]="spacing"
      [labelledBy]="labelledBy"
    >
      <app-heading [level]="2" id="heading-for-shell">Researchers</app-heading>
      <p class="projected">Body copy from the bundle.</p>
    </app-section-shell>
  `,
})
class HostComponent {
  sectionId = 'for-researchers'
  tone: Tone = 'default'
  spacing: Spacing = 'normal'
  labelledBy?: string = 'heading-for-shell'
}

describe('SectionShellComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let host: HostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    host = fixture.componentInstance
  })

  function element(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('names the region after its own heading when the section has one', () => {
    fixture.detectChanges()

    const section = element().querySelector('section')
    expect(section).not.toBeNull()
    expect(section?.getAttribute('aria-labelledby')).toBe('heading-for-shell')

    const heading = element().querySelector('#heading-for-shell')
    expect(heading?.textContent).toBe('Researchers')
  })

  it('exposes no region at all when the section has no heading', () => {
    host.labelledBy = undefined
    fixture.detectChanges()

    // An unnamed <section> is announced as an empty region a screen reader user
    // has to step through, so the shell must emit no landmark rather than a
    // nameless one or an invented aria-label.
    expect(element().querySelector('section')).toBeNull()
    expect(element().querySelector('[aria-label]')).toBeNull()
    expect(element().querySelector('[role="region"]')).toBeNull()
  })

  it('still renders the section content when there is no landmark', () => {
    host.labelledBy = undefined
    fixture.detectChanges()

    expect(element().querySelector('.projected')?.textContent).toBe(
      'Body copy from the bundle.'
    )
  })

  it('offers the section as an in-page anchor target under a stable id', () => {
    fixture.detectChanges()

    expect(element().querySelector('#section-for-researchers')).not.toBeNull()
  })

  it('paints the tone the content asked for', () => {
    host.tone = 'brand-dark'
    fixture.detectChanges()

    const section = element().querySelector('section') as HTMLElement
    expect(section.getAttribute('data-tone')).toBe('brand-dark')

    const painted = getComputedStyle(section)
    expect(painted.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  it('gives each spacing step a visibly different band of space', () => {
    const measured = (['compact', 'normal', 'loose'] as Spacing[]).map(
      (spacing) => {
        host.spacing = spacing
        fixture.detectChanges()
        const section = element().querySelector('section') as HTMLElement
        return parseFloat(getComputedStyle(section).paddingTop)
      }
    )

    expect(measured[0]).toBeGreaterThan(0)
    expect(measured[1]).toBeGreaterThan(measured[0])
    expect(measured[2]).toBeGreaterThan(measured[1])
  })
})
