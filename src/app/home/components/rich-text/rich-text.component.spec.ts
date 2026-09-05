import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RichTextComponent } from './rich-text.component'

@Component({
  standalone: true,
  imports: [RichTextComponent],
  template:
    '<app-rich-text [markdown]="markdown" [lang]="lang" [dir]="dir"></app-rich-text>',
})
class HostComponent {
  markdown = ''
  lang?: string
  dir?: 'ltr' | 'rtl'
  @ViewChild(RichTextComponent) richText!: RichTextComponent
}

describe('RichTextComponent', () => {
  let fixture: ComponentFixture<HostComponent>

  function render(markdown: string): HTMLElement {
    fixture.componentInstance.markdown = markdown
    fixture.detectChanges()
    return fixture.nativeElement as HTMLElement
  }

  function link(markdown: string): HTMLAnchorElement {
    return render(markdown).querySelector('a') as HTMLAnchorElement
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
  })

  it('renders one paragraph element per paragraph', () => {
    const element = render('First.\n\nSecond.')
    expect(element.querySelectorAll('p').length).toBe(2)
  })

  it('renders bold as a strong element', () => {
    const element = render('ORCID is **free**')
    expect(element.querySelector('strong')?.textContent).toBe('free')
  })

  it('renders nothing for empty content', () => {
    expect(render('').querySelectorAll('p').length).toBe(0)
  })

  it('does not collapse inside a flex grid column', () => {
    render('Anything')
    const host = (fixture.nativeElement as HTMLElement).querySelector(
      'app-rich-text'
    ) as HTMLElement

    expect(getComputedStyle(host).display).toBe('block')
  })

  describe('a link that leaves ORCID', () => {
    it('opens in a new tab and is told to do so out loud', () => {
      const anchor = link(
        'Watch [the video](https://www.youtube.com/watch?v=x)'
      )

      expect(anchor.getAttribute('target')).toBe('_blank')
      expect(anchor.textContent).toContain('opens in a new tab')
    })

    it('is protected against the opened tab reaching back', () => {
      expect(
        link('[YouTube](https://www.youtube.com/watch?v=x)').getAttribute('rel')
      ).toBe('noopener noreferrer')
    })

    it('shows a mark as well as saying it, never an icon alone', () => {
      const anchor = link('[YouTube](https://www.youtube.com/watch?v=x)')
      const icon = anchor.querySelector('svg')

      expect(icon).not.toBeNull()
      expect(icon?.getAttribute('aria-hidden')).toBe('true')
      expect(icon?.getAttribute('focusable')).toBe('false')
    })

    it('keeps the spoken warning off the screen', () => {
      const anchor = link('[YouTube](https://www.youtube.com/watch?v=x)')
      const hidden = anchor.querySelector('.cdk-visually-hidden') as HTMLElement
      const style = getComputedStyle(hidden)

      expect(hidden.textContent).toContain('opens in a new tab')
      expect(style.position).toBe('absolute')
      expect(style.width).toBe('1px')
    })
  })

  describe('a link that stays on ORCID', () => {
    it('opens in place and keeps the referrer', () => {
      const anchor = link('[Register](https://orcid.org/register)')

      expect(anchor.getAttribute('target')).toBeNull()
      expect(anchor.getAttribute('rel')).toBeNull()
    })

    it('treats a subdomain as ORCID too', () => {
      const anchor = link('[Info](https://info.orcid.org/about)')

      expect(anchor.getAttribute('target')).toBeNull()
      expect(anchor.getAttribute('rel')).toBeNull()
    })

    it('carries no new-tab announcement', () => {
      const anchor = link('[Register](https://orcid.org/register)')

      expect(anchor.textContent).toBe('Register')
      expect(anchor.querySelector('svg')).toBeNull()
    })
  })

  describe('an email address', () => {
    it('is not a new tab: a mail client is not a browsing context', () => {
      const anchor = link('[Email us](mailto:support@orcid.org)')

      expect(anchor.getAttribute('href')).toBe('mailto:support@orcid.org')
      expect(anchor.getAttribute('target')).toBeNull()
      expect(anchor.getAttribute('rel')).toBeNull()
    })

    it('is treated as internal whatever the domain', () => {
      const anchor = link('[Write](mailto:hello@example.org)')

      expect(anchor.getAttribute('target')).toBeNull()
      expect(anchor.getAttribute('rel')).toBeNull()
    })
  })

  describe('mixed direction', () => {
    it('isolates the link text from the sentence around it', () => {
      const anchor = link('Read [مرحبا](https://orcid.org/x), then stop.')
      const isolated = anchor.querySelector('bdi')

      expect(isolated).not.toBeNull()
      expect(isolated?.textContent).toBe('مرحبا')
    })

    it('lets the browser decide direction when nobody told it', () => {
      const paragraph = render('Hello').querySelector('p')

      expect(paragraph?.getAttribute('dir')).toBe('auto')
      expect(paragraph?.getAttribute('lang')).toBeNull()
    })

    it('announces an English fallback in English inside an Arabic page', () => {
      fixture.componentInstance.lang = 'en'
      fixture.componentInstance.dir = 'ltr'
      const paragraph = render('Sign in to your record').querySelector('p')

      expect(paragraph?.getAttribute('lang')).toBe('en')
      expect(paragraph?.getAttribute('dir')).toBe('ltr')
    })
  })

  describe('untrusted content', () => {
    it('never renders content text as markup', () => {
      const element = render('Danger <img src=x onerror=alert(1)> here')

      expect(element.querySelector('img')).toBeNull()
      expect(element.textContent).toContain('<img src=x onerror=alert(1)>')
    })

    it('renders an unsafe link as plain text, with no anchor', () => {
      const element = render('Click [here](javascript:alert(1)) now')

      expect(element.querySelector('a')).toBeNull()
      expect(element.textContent).toContain('here')
    })
  })

  it('re-renders when the input changes', () => {
    render('First')
    const element = render('**Second**')

    expect(element.querySelector('strong')?.textContent).toBe('Second')
    expect(element.textContent).not.toContain('First')
  })
})
