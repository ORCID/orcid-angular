import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HeadingLevel } from '../../heading-level'
import { HeadingComponent } from './heading.component'

@Component({
  standalone: true,
  imports: [HeadingComponent],
  template: `
    <app-heading
      [level]="level"
      [id]="id"
      [visualClass]="visualClass"
      [hidden]="hidden"
      [lang]="lang"
      [dir]="dir"
    >
      {{ text }}
    </app-heading>
  `,
})
class HostComponent {
  level = 2 as HeadingLevel
  id?: string
  visualClass = 'orc-font-heading'
  hidden = false
  lang?: string
  dir?: string
  text = 'Get started with ORCID'
}

describe('HeadingComponent', () => {
  let fixture: ComponentFixture<HostComponent>

  function render(state: Partial<HostComponent> = {}): HTMLElement {
    Object.assign(fixture.componentInstance, state)
    fixture.detectChanges()
    return fixture.nativeElement as HTMLElement
  }

  /** The single heading element the component produced, whatever its tag. */
  function heading(element: HTMLElement): HTMLHeadingElement {
    const found = element.querySelector<HTMLHeadingElement>(
      'h1, h2, h3, h4, h5, h6'
    )
    if (!found) throw new Error('no heading element was rendered')
    return found
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
  })

  it('renders the heading element that matches the level it was given', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as HeadingLevel[]) {
      const element = render({ level })

      expect(heading(element).tagName).toBe(`H${level}`)
      expect(element.querySelectorAll('h1, h2, h3, h4, h5, h6').length).toBe(1)
    }
  })

  it('announces the text it was given', () => {
    const element = render({ level: 3, text: 'Latest news' })

    expect(heading(element).textContent?.trim()).toBe('Latest news')
  })

  it('renders an h6 for a level deeper than HTML has headings for', () => {
    expect(
      heading(render({ level: 7 as unknown as HeadingLevel })).tagName
    ).toBe('H6')
    expect(
      heading(render({ level: 42 as unknown as HeadingLevel })).tagName
    ).toBe('H6')
  })

  it('renders an h1 for a level below the first heading', () => {
    expect(
      heading(render({ level: 0 as unknown as HeadingLevel })).tagName
    ).toBe('H1')
    expect(
      heading(render({ level: -3 as unknown as HeadingLevel })).tagName
    ).toBe('H1')
  })

  it('keeps a hidden heading in the accessibility tree', () => {
    const element = render({ level: 2, hidden: true, text: 'Get started' })
    const rendered = heading(element)
    const style = getComputedStyle(rendered)

    // Everything an assistive technology reads is still true of the element.
    expect(rendered.hasAttribute('hidden')).toBe(false)
    expect(rendered.getAttribute('aria-hidden')).toBeNull()
    expect(style.display).not.toBe('none')
    expect(style.visibility).not.toBe('hidden')
    expect(rendered.textContent?.trim()).toBe('Get started')
  })

  it('removes a hidden heading from sight', () => {
    const rendered = heading(render({ level: 2, hidden: true }))
    const style = getComputedStyle(rendered)

    expect(rendered.classList.contains('cdk-visually-hidden')).toBe(true)
    expect(rendered.getBoundingClientRect().height).toBeLessThanOrEqual(1)
    expect(style.position).toBe('absolute')
    expect(style.overflow).toBe('hidden')
  })

  it('shows the heading when it is not hidden', () => {
    const rendered = heading(render({ level: 2, hidden: false }))

    expect(rendered.classList.contains('cdk-visually-hidden')).toBe(false)
    expect(rendered.getBoundingClientRect().height).toBeGreaterThan(1)
  })

  it('applies the same visual class at every semantic level', () => {
    for (const level of [1, 2, 3, 4, 5, 6] as HeadingLevel[]) {
      const rendered = heading(
        render({ level, visualClass: 'orc-font-heading-large' })
      )

      expect(rendered.classList.contains('orc-font-heading-large')).toBe(true)
    }
  })

  it('applies different visual classes at the same semantic level', () => {
    expect(
      heading(render({ level: 3, visualClass: 'orc-font-heading-large' }))
        .className
    ).toContain('orc-font-heading-large')

    expect(
      heading(render({ level: 3, visualClass: 'orc-font-heading-small' }))
        .className
    ).toContain('orc-font-heading-small')
  })

  it('carries the id an aria-labelledby can point at', () => {
    const rendered = heading(
      render({ level: 2, id: 'section-latest-news-title' })
    )

    expect(rendered.getAttribute('id')).toBe('section-latest-news-title')
  })

  it('emits no id attribute when it was given none', () => {
    expect(heading(render({ level: 2 })).hasAttribute('id')).toBe(false)
  })

  it('marks a heading left in another language with lang and dir', () => {
    const rendered = heading(
      render({ level: 2, lang: 'ar', dir: 'rtl', text: 'ORCID' })
    )

    expect(rendered.getAttribute('lang')).toBe('ar')
    expect(rendered.getAttribute('dir')).toBe('rtl')
  })

  it('emits no lang or dir when the string is in the page language', () => {
    const rendered = heading(render({ level: 2 }))

    expect(rendered.hasAttribute('lang')).toBe(false)
    expect(rendered.hasAttribute('dir')).toBe(false)
  })
})
