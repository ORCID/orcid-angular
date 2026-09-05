import { Component, ViewChild } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RichTextComponent } from './rich-text.component'

@Component({
  template: '<app-rich-text [markdown]="markdown"></app-rich-text>',
  standalone: false,
})
class HostComponent {
  markdown = ''
  @ViewChild(RichTextComponent) richText!: RichTextComponent
}

describe('RichTextComponent', () => {
  let fixture: ComponentFixture<HostComponent>

  function render(markdown: string): HTMLElement {
    fixture.componentInstance.markdown = markdown
    fixture.detectChanges()
    return fixture.nativeElement as HTMLElement
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RichTextComponent, HostComponent],
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

  it('renders a link with rel="noopener noreferrer"', () => {
    const element = render('See [our site](https://info.orcid.org).')
    const link = element.querySelector('a')

    expect(link?.getAttribute('href')).toBe('https://info.orcid.org')
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link?.textContent).toBe('our site')
  })

  it('opens an off-site link in a new tab and an ORCID link in place', () => {
    expect(
      render('[Info](https://info.orcid.org)')
        .querySelector('a')
        ?.getAttribute('target')
    ).toBeNull()

    expect(
      render('[Video](https://www.youtube.com/watch?v=x)')
        .querySelector('a')
        ?.getAttribute('target')
    ).toBe('_blank')
  })

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

  it('re-renders when the input changes', () => {
    render('First')
    const element = render('**Second**')

    expect(element.querySelector('strong')?.textContent).toBe('Second')
    expect(element.textContent).not.toContain('First')
  })

  it('renders nothing for empty content', () => {
    expect(render('').querySelectorAll('p').length).toBe(0)
  })
})
