import { Component } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DisclosureComponent } from './disclosure.component'

@Component({
  standalone: true,
  imports: [DisclosureComponent],
  template: `
    <app-disclosure label="Read the transcript">
      <p>ORCID gives every researcher a persistent identifier.</p>
    </app-disclosure>
  `,
})
class HostComponent {}

describe('a disclosure', () => {
  let fixture: ComponentFixture<HostComponent>
  let element: HTMLElement

  function button(): HTMLButtonElement {
    return element.querySelector('button') as HTMLButtonElement
  }

  function region(): HTMLElement {
    return element.querySelector('.disclosure-region') as HTMLElement
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    element = fixture.nativeElement as HTMLElement
  })

  it('is operated by a real button, not a clickable box', () => {
    expect(button().getAttribute('type')).toBe('button')
    expect(button().textContent?.trim()).toBe('Read the transcript')
  })

  it('starts collapsed, and says so', () => {
    expect(button().getAttribute('aria-expanded')).toBe('false')
    expect(region().hasAttribute('hidden')).toBe(true)
  })

  it('names the region it controls', () => {
    const controls = button().getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    expect(region().id).toBe(controls as string)
  })

  it('reveals the content when pressed, and hides it again', () => {
    button().click()
    fixture.detectChanges()

    expect(button().getAttribute('aria-expanded')).toBe('true')
    expect(region().hasAttribute('hidden')).toBe(false)
    expect(region().textContent).toContain('persistent identifier')

    button().click()
    fixture.detectChanges()

    expect(button().getAttribute('aria-expanded')).toBe('false')
    expect(region().hasAttribute('hidden')).toBe(true)
  })

  it('gives no invented role to the revealed region', () => {
    expect(region().hasAttribute('role')).toBe(false)
  })
})
