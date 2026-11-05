import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'

import { InfoPanelComponent } from './info-panel.component'

describe('InfoPanelComponent', () => {
  let component: InfoPanelComponent
  let fixture: ComponentFixture<InfoPanelComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelComponent],
      imports: [MatIconModule],
    })
    fixture = TestBed.createComponent(InfoPanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /*
   * PD-5635. The frames draw an information panel in state-info-dark #1565c0 on
   * state-info-bg #f5fafe; this took the darkest step of the ramp (#0d47a1) on
   * a different fill (#f1f8fe).
   */
  it('draws itself in the design system information colours', () => {
    const panel = fixture.nativeElement.querySelector('.info') as HTMLElement
    const style = getComputedStyle(panel)

    expect(style.borderTopColor).toBe('rgb(21, 101, 192)')
    expect(style.backgroundColor).toBe('rgb(245, 250, 254)')
  })

  /*
   * PD-5850. The recovery phone interstitial's frame draws an outlined question
   * mark (Material `help_outline`) in state-info-dark, not the filled
   * check-window disc. The glyph is an input so the three other consumers --
   * affiliations, share-emails-domains and backup-email -- keep the disc until
   * their own frames are checked, which is what the default below pins.
   */
  it('draws the check-window disc by default, for the consumers not yet rechecked', () => {
    expect(component.type).toBe('check-window')

    const img = fixture.nativeElement.querySelector('img')
    expect(img).not.toBeNull()
    expect(img.getAttribute('src')).toBe('/assets/vectors/check-window.svg')
    expect(fixture.nativeElement.querySelector('mat-icon')).toBeNull()
  })

  it("draws the frame's outlined question mark when asked for help", () => {
    component.type = 'help'
    fixture.detectChanges()

    const icon = fixture.nativeElement.querySelector('mat-icon')
    expect(icon).not.toBeNull()
    expect(icon.textContent.trim()).toBe('help_outline')
    expect(fixture.nativeElement.querySelector('img')).toBeNull()
  })

  it('paints that glyph in the same state-info-dark as the border', () => {
    component.type = 'help'
    fixture.detectChanges()

    const icon = fixture.nativeElement.querySelector('mat-icon') as HTMLElement
    expect(getComputedStyle(icon).color).toBe('rgb(21, 101, 192)')
  })
})
