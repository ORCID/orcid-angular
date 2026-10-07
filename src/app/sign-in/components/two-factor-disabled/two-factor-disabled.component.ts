import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Subscription, timer } from 'rxjs'

/**
 * How long the panel waits before it continues on its own (R4.3). The user
 * has nothing to decide here - they are being told what happened to their
 * account - so the flow must not stall on a button nobody presses.
 */
export const TWO_FACTOR_DISABLED_AUTO_CONTINUE_MS = 10000

/**
 * The standalone panel an OAuth sign-in lands on after the user signed in with
 * their recovery phone number (R4.2). It replaces the straight continuation to
 * the authorization screen, because 2FA has just been turned off on the
 * account and the client's screen would never say so.
 */
@Component({
  selector: 'app-two-factor-disabled',
  templateUrl: './two-factor-disabled.component.html',
  styleUrls: ['./two-factor-disabled.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class TwoFactorDisabledComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /** The client the user is on their way back to, when its name is known. */
  @Input() clientName?: string

  /** Where continuing goes. The panel never navigates; the page does. */
  @Input() redirectUrl: string

  @Output() continue = new EventEmitter<void>()

  @ViewChild('panelTitle') panelTitle: ElementRef<HTMLElement>

  private autoContinue: Subscription
  /** Guards the one thing that must not happen twice: the redirect. */
  private continued = false

  ngOnInit(): void {
    this.autoContinue = timer(TWO_FACTOR_DISABLED_AUTO_CONTINUE_MS).subscribe(
      () => this.emitContinue()
    )
  }

  /**
   * The sign-in card this panel replaced took the focus with it. Move it to
   * the heading, so a screen reader says what just happened and the tab order
   * restarts inside the panel rather than at the top of the page - both before
   * the auto-continue takes the user away.
   */
  ngAfterViewInit(): void {
    this.panelTitle?.nativeElement.focus()
  }

  ngOnDestroy(): void {
    this.cancelAutoContinue()
  }

  /** The button. Cancels the timer, so the redirect cannot happen twice. */
  onContinue(): void {
    this.emitContinue()
  }

  private emitContinue(): void {
    if (this.continued) {
      return
    }
    this.continued = true
    this.cancelAutoContinue()
    this.continue.emit()
  }

  private cancelAutoContinue(): void {
    this.autoContinue?.unsubscribe()
    this.autoContinue = undefined
  }
}
