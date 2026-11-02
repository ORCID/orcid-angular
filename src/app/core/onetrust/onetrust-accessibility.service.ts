import { DOCUMENT } from '@angular/common'
import { Injectable, NgZone, OnDestroy, inject } from '@angular/core'
import { AnnouncerService } from '../announcer/announcer.service'
import {
  ConsentVendor,
  ConsentVendorService,
} from '../consent/consent-vendor.service'

/**
 * The consent dialogs this service manages focus for, per vendor. CookieYes's
 * notice is deliberately absent: it is not a dialog, and CookieYes wraps Tab
 * in it by itself when the banner is configured as a modal popup.
 */
const CONSENT_DIALOG_SELECTORS: Record<ConsentVendor, string[]> = {
  onetrust: [
    '#onetrust-pc-sdk [role="dialog"]',
    '#onetrust-banner-sdk .ot-sdk-container[role="dialog"]',
  ],
  cookieyes: ['[data-cky-tag="detail"][role="dialog"]'],
}

/**
 * How many animation frames to keep re-checking after a consent dialog's
 * markup changes. CookieYes fades its preference centre in and out with a one
 * second visibility transition, so the dialog is still hidden when the mutation
 * that opens it is observed, and still visible when the one that closes it is.
 */
const RESYNC_FRAMES = 90

@Injectable({
  providedIn: 'root',
})
export class OneTrustAccessibilityService implements OnDestroy {
  private _document = inject(DOCUMENT)
  private _announcerService = inject(AnnouncerService)
  private _ngZone = inject(NgZone)
  private _consentVendor = inject(ConsentVendorService)

  private _observer?: MutationObserver
  private _activeDialog: HTMLElement | null = null
  private _previouslyFocusedElement: HTMLElement | null = null
  private _keyDownListener?: (event: KeyboardEvent) => void
  private _focusInListener?: (event: FocusEvent) => void
  private _policyLinkElement: HTMLElement | null = null
  private _policyLinkOriginalTabIndex: string | null | undefined = undefined
  private _expectedFocusAfterWrap: HTMLElement | null = null
  private _expectedFocusExpiresAt = 0
  private _resyncFramesLeft = 0
  private _pendingTrigger: HTMLElement | null = null

  init(): void {
    if (!this._document?.body || this._observer) {
      return
    }

    this._ngZone.runOutsideAngular(() => {
      this._observer = new MutationObserver((records) =>
        this._onMutations(records)
      )
      this._observer.observe(this._document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-hidden', 'hidden'],
      })
      this._syncDialogState()
    })
  }

  ngOnDestroy(): void {
    this._observer?.disconnect()
    this._observer = undefined
    this._resyncFramesLeft = 0
    this._removeFocusTrap()
  }

  private _onMutations(records: MutationRecord[]): void {
    const dialogs = this._findConsentDialogs()
    const touched = dialogs.some((dialog) =>
      records.some(
        (record) =>
          record.target.contains(dialog) || dialog.contains(record.target)
      )
    )
    if (touched) {
      this._rememberTrigger(dialogs)
      this._scheduleResync()
    }
    this._syncDialogState()
  }

  /**
   * Who is opening the dialog, taken before it is visible: by the time it is,
   * the vendor may already have moved focus into it.
   */
  private _rememberTrigger(dialogs: HTMLElement[]): void {
    if (this._activeDialog) {
      return
    }
    const active = this._document.activeElement
    if (
      active instanceof HTMLElement &&
      active !== this._document.body &&
      !dialogs.some((dialog) => dialog.contains(active))
    ) {
      this._pendingTrigger = active
    }
  }

  private _scheduleResync(): void {
    const view = this._document.defaultView
    const alreadyRunning = this._resyncFramesLeft > 0
    this._resyncFramesLeft = RESYNC_FRAMES
    if (alreadyRunning || !view?.requestAnimationFrame) {
      return
    }
    const tick = () => {
      if (!this._observer || this._resyncFramesLeft <= 0) {
        return
      }
      this._resyncFramesLeft -= 1
      this._syncDialogState()
      view.requestAnimationFrame(tick)
    }
    view.requestAnimationFrame(tick)
  }

  private _syncDialogState(): void {
    const dialog = this._findVisibleConsentDialog()

    if (dialog) {
      this._ensurePolicyLinkTabbable(dialog)
      if (this._activeDialog !== dialog) {
        this._activeDialog = dialog
        this._focusDialogOnOpen(dialog)
        this._installFocusTrap()
      }
      return
    }

    if (this._activeDialog) {
      this._removeFocusTrap()
      this._restorePolicyLinkTabIndex()
      this._restorePreviousFocus()
      this._activeDialog = null
    }
  }

  private _findConsentDialogs(): HTMLElement[] {
    return CONSENT_DIALOG_SELECTORS[this._consentVendor.vendor]
      .map((selector) => this._document.querySelector(selector))
      .filter((node): node is HTMLElement => node instanceof HTMLElement)
  }

  private _findVisibleConsentDialog(): HTMLElement | null {
    return (
      this._findConsentDialogs().find((node) => this._isVisible(node)) ?? null
    )
  }

  private _focusDialogOnOpen(dialog: HTMLElement): void {
    const active = this._document.activeElement
    const activeOutside =
      active instanceof HTMLElement && !dialog.contains(active)
    if (activeOutside && active !== this._document.body) {
      this._previouslyFocusedElement = active as HTMLElement
    } else if (this._pendingTrigger) {
      this._previouslyFocusedElement = this._pendingTrigger
    } else if (activeOutside) {
      this._previouslyFocusedElement = active as HTMLElement
    }
    this._pendingTrigger = null

    const tabbable = this._getTabbableElements(dialog)
    const target = tabbable[0] ?? dialog
    // Only the dialog itself needs a tabindex to take focus. Setting -1 on its
    // first control would drop that control out of the Tab order for good.
    if (target === dialog && !dialog.hasAttribute('tabindex')) {
      dialog.setAttribute('tabindex', '-1')
    }
    target.focus()
    this._announcerService.liveAnnounce(
      this._announcerService.oneTrustFocusAnnouncement
    )
  }

  private _installFocusTrap(): void {
    this._removeFocusTrap()

    this._keyDownListener = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !this._activeDialog) {
        return
      }
      // By default, do not carry wrap expectation across new key events.
      this._expectedFocusAfterWrap = null
      this._expectedFocusExpiresAt = 0

      const dialog = this._activeDialog
      if (!this._isVisible(dialog)) {
        return
      }

      const tabbable = this._getTabbableElements(dialog)
      if (!tabbable.length) {
        dialog.focus()
        this._preventEvent(event)
        return
      }

      const first = tabbable[0]
      const last = tabbable[tabbable.length - 1]
      const activeElement = this._document.activeElement as HTMLElement | null
      const isOutside = !activeElement || !dialog.contains(activeElement)

      if (event.shiftKey) {
        if (isOutside || activeElement === first) {
          this._setExpectedFocusAfterWrap(last)
          last.focus()
          this._preventEvent(event)
        }
        return
      }

      if (isOutside || activeElement === last) {
        this._setExpectedFocusAfterWrap(first)
        first.focus()
        this._preventEvent(event)
      }
    }

    this._focusInListener = (event: FocusEvent) => {
      if (!this._activeDialog) {
        return
      }

      const dialog = this._activeDialog
      if (!this._isVisible(dialog)) {
        return
      }

      const target = event.target
      if (target instanceof HTMLElement && dialog.contains(target)) {
        if (
          this._expectedFocusAfterWrap &&
          Date.now() <= this._expectedFocusExpiresAt &&
          target !== this._expectedFocusAfterWrap
        ) {
          this._expectedFocusAfterWrap.focus()
          return
        }
        return
      }

      const tabbable = this._getTabbableElements(dialog)
      const fallback = tabbable[0] ?? dialog
      fallback.focus()
    }

    this._document.addEventListener('keydown', this._keyDownListener, true)
    this._document.addEventListener('focusin', this._focusInListener, true)
  }

  private _removeFocusTrap(): void {
    if (this._keyDownListener) {
      this._document.removeEventListener('keydown', this._keyDownListener, true)
      this._keyDownListener = undefined
    }
    if (this._focusInListener) {
      this._document.removeEventListener('focusin', this._focusInListener, true)
      this._focusInListener = undefined
    }
  }

  private _restorePreviousFocus(): void {
    if (
      this._previouslyFocusedElement &&
      this._document.contains(this._previouslyFocusedElement)
    ) {
      this._previouslyFocusedElement.focus()
    }
    this._previouslyFocusedElement = null
  }

  private _ensurePolicyLinkTabbable(dialog: HTMLElement): void {
    const node = dialog.querySelector('.ot-cookie-policy-link')
    if (!(node instanceof HTMLElement) || !this._isVisible(node)) {
      return
    }

    if (this._policyLinkElement !== node) {
      this._policyLinkElement = node
      this._policyLinkOriginalTabIndex = node.getAttribute('tabindex')
    }

    if (node.getAttribute('tabindex') === '-1') {
      node.setAttribute('tabindex', '0')
    }
  }

  private _restorePolicyLinkTabIndex(): void {
    if (
      !this._policyLinkElement ||
      !this._document.contains(this._policyLinkElement)
    ) {
      this._policyLinkElement = null
      this._policyLinkOriginalTabIndex = undefined
      return
    }

    if (this._policyLinkOriginalTabIndex === null) {
      this._policyLinkElement.removeAttribute('tabindex')
    } else if (this._policyLinkOriginalTabIndex !== undefined) {
      this._policyLinkElement.setAttribute(
        'tabindex',
        this._policyLinkOriginalTabIndex
      )
    }

    this._policyLinkElement = null
    this._policyLinkOriginalTabIndex = undefined
  }

  private _getTabbableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    return Array.from(container.querySelectorAll(selector)).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement &&
        this._isVisible(node) &&
        node.tabIndex >= 0 &&
        !node.hasAttribute('disabled') &&
        node.getAttribute('aria-hidden') !== 'true'
    )
  }

  private _isVisible(element: HTMLElement): boolean {
    if (!element.isConnected) {
      return false
    }

    let current: HTMLElement | null = element
    while (current) {
      const style = this._document.defaultView?.getComputedStyle(current)
      if (
        style?.display === 'none' ||
        style?.visibility === 'hidden' ||
        current.getAttribute('aria-hidden') === 'true' ||
        current.hasAttribute('hidden')
      ) {
        return false
      }
      current = current.parentElement
    }

    return element.getClientRects().length > 0
  }

  private _preventEvent(event: KeyboardEvent): void {
    if (event.cancelable) {
      try {
        event.preventDefault()
      } catch {
        // Some runtime listeners are treated as passive by Zone/host; ignore and rely on focusin correction.
      }
    }
    event.stopPropagation()
  }

  private _setExpectedFocusAfterWrap(target: HTMLElement): void {
    this._expectedFocusAfterWrap = target
    this._expectedFocusExpiresAt = Date.now() + 250
  }
}
