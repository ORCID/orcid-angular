import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopBarComponent } from './top-bar.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { WarningMessageComponent } from '../../../cdk/warning-message/warning-message/warning-message.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TopBarComponent', () => {
  let component: TopBarComponent
  let fixture: ComponentFixture<TopBarComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [TopBarComponent, WarningMessageComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /*
   * PD-6043. The frame links two words and the notice linked the whole closing
   * sentence. Measured off the export: the underline is a continuous 111 px
   * run, which is "account settings" and no more. `get_metadata` cannot answer
   * this - a design tool styles a link as a range inside one text node - so the
   * assertion pins the shape the pixels showed.
   */
  it('links only the account settings words in the 2FA disabled notice', () => {
    component.twoFactorDisabledByRecoveryPhone = true
    fixture.detectChanges()

    const notice: HTMLElement = fixture.nativeElement.querySelector(
      'app-warning-message'
    )
    const link: HTMLAnchorElement = notice.querySelector('a[fragment="2FA"]')

    expect(link).toBeTruthy()
    expect(link.textContent.trim()).toBe('account settings')
    expect(notice.textContent.replace(/\s+/g, ' ')).toContain(
      'You can re-enable 2FA from your account settings'
    )
  })

  /*
   * PD-6043 and PD-5850, the colour half of the same two links. The frames draw
   * every word of both notices in black: measured over the whole export, the
   * only dark ink in either is #000000 (1041 px and 1064 px), and neither frame
   * carries a single pixel of the build's #447405 or of link blue #085c77. The
   * saturated colours in them - #d32f2f and #56b833 - are the notice's own
   * border and glyph, not its copy.
   *
   * So the link takes `black-url`, not a bare removal of `green-url`: without a
   * class the global `a.underline` rule would paint it #085c77, which no frame
   * draws either. The three other `green-url` links in this template are left
   * alone deliberately - nothing in the evidence photographs them.
   */
  it('draws both notice links in the black the frames draw', () => {
    component.twoFactorDisabledByRecoveryPhone = true
    component.newAddedRecoveryPhone = '***********3456'
    fixture.detectChanges()

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('a[fragment="2FA"]')
    )

    expect(links.length).toBe(2)
    links.forEach((link) => {
      expect(link.classList).toContain('black-url')
      expect(link.classList).not.toContain('green-url')
      expect(getComputedStyle(link).color).toBe('rgb(0, 0, 0)')
    })
  })

  /*
   * PD-5850. The frame draws this notice as three pixel-separated rows inside
   * one 568 px column - title, sentence, link - and the build drew two: the
   * anchor ran on inside the sentence's own paragraph and wrapped onto a second
   * line. Three assertions, one per thing the frame states and the build did
   * not.
   *
   * The first is the one the comparison reads. `block_text` in the DOM probe is
   * the browser's innerText, so an anchor projected into the same <p> as the
   * sentence is part of that paragraph's string whatever it is styled as -
   * display: block included. Only leaving the paragraph changes the string, and
   * that is what closes the frame's sentence node against the page's.
   */
  describe('the recovery phone added notice against its frame', () => {
    const notice = () => {
      component.newAddedRecoveryPhone = '***********3456'
      fixture.detectChanges()
      return fixture.nativeElement.querySelector(
        'app-warning-message'
      ) as HTMLElement
    }

    it('keeps the link out of the sentence paragraph', () => {
      const banner = notice()
      const paragraph: HTMLParagraphElement = banner.querySelector('p')
      const link: HTMLAnchorElement = banner.querySelector('a[fragment="2FA"]')

      expect(paragraph).toBeTruthy()
      expect(link).toBeTruthy()
      expect(paragraph.contains(link)).toBe(false)
      expect(paragraph.innerText || paragraph.textContent).not.toContain(
        'Manage your recovery options'
      )
    })

    it('draws the link as its own row', () => {
      const banner = notice()
      const link: HTMLAnchorElement = banner.querySelector('a[fragment="2FA"]')

      expect(getComputedStyle(link).display).toBe('block')
    })

    it('sets the link a spacing-S row below the sentence', () => {
      const banner = notice()
      const paragraph: HTMLParagraphElement = banner.querySelector('p')
      const link: HTMLAnchorElement = banner.querySelector('a[fragment="2FA"]')

      expect(getComputedStyle(link).marginTop).toBe('8px')
      expect(link.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        paragraph.getBoundingClientRect().bottom
      )
    })
  })

  /*
   * PD-5692. A record that has to reset its password gets here through a
   * linked institutional account, and the notice takes it straight to the
   * Account password panel.
   */
  describe('mandatory password reset notice', () => {
    const notice = (): HTMLElement =>
      fixture.nativeElement.querySelector(
        '[id="cy-force-password-reset-notice"]'
      )

    it('shows above everything else and links to the password panel', () => {
      component.userInfo = { FORCE_PASSWORD_RESET: 'true' } as any
      component.userRecord = {
        names: {
          givenNames: { value: 'Given' },
          familyName: { value: 'Family' },
          visibility: { visibility: 'PUBLIC' },
        },
      } as any
      fixture.detectChanges()

      expect(notice()).toBeTruthy()
      const link: HTMLAnchorElement = notice().querySelector(
        '#cy-force-password-reset-link'
      )
      expect(link.getAttribute('href')).toBe('/account#password')
      expect(link.textContent.trim()).toBe('Reset your account password now')
      // The first thing in the signed-in part of the page, ahead of every
      // other notice and of the names panel, as the frame draws it
      const host: HTMLElement = fixture.nativeElement
      const children = Array.from(host.children)
      const previous = children[children.indexOf(notice()) - 1]
      expect(previous.tagName.toLowerCase()).toBe(
        'app-top-bar-verification-email'
      )
      const names = host.querySelector('#names')
      expect(names).toBeTruthy()
      expect(
        notice().compareDocumentPosition(names) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    })

    it('is absent when no reset is owed', () => {
      component.userInfo = { FORCE_PASSWORD_RESET: 'false' } as any
      fixture.detectChanges()
      expect(notice()).toBeNull()

      component.userInfo = {} as any
      fixture.detectChanges()
      expect(notice()).toBeNull()
    })

    it('is absent on a public record', () => {
      component.isPublicRecord = 'true' as any
      component.userInfo = { FORCE_PASSWORD_RESET: 'true' } as any
      fixture.detectChanges()

      expect(notice()).toBeNull()
    })
  })
})
