import { inject } from '@angular/core'
import { Observable, of } from 'rxjs'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { UserRecord } from 'src/app/types/record.local'
import { MatDialog } from '@angular/material/dialog'
import { catchError, map, switchMap, take, tap } from 'rxjs/operators'
import { InterstitialObservabilityService } from '../interstitial-observability.service'
import { WINDOW } from 'src/app/cdk/window'
import { MatDialogConfig } from '@angular/material/dialog'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'

import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from './dialog-interface'
import { TogglzService } from '../../togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'

export abstract class LoginBaseInterstitialManagerService<
  TInput extends BaseInterstitialDialogInput,
  TOutput extends BaseInterstitialDialogOutput,
  TComponent
> {
  abstract INTERSTITIAL_NAME: InterstitialType
  abstract INTERSTITIAL_TOGGLE: TogglzFlag[]
  abstract QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN: QaFlag

  // Injected here rather than through the constructor so the existing
  // subclasses keep their signatures
  protected interstitialObservability = inject(InterstitialObservabilityService)
  protected window = inject(WINDOW) as Window

  // This will usually get updated on subscription to togglz

  constructor(
    protected matDialog: MatDialog,
    protected togglzService: TogglzService,
    protected interstitialsService: InterstitialsService,
    protected qaFlag: QaFlagsService
  ) {}

  abstract userIsElegibleForInterstitial(
    userRecord: UserRecord
  ): Observable<boolean>

  /**
   * Contexts where no interstitial should ever show, regardless of its own
   * eligibility rule: an admin acting as the user, or a popup window.
   */
  protected isBlockedContext(userRecord: UserRecord): boolean {
    const isImpersonation = !(
      userRecord?.userInfo?.REAL_USER_ORCID ===
      userRecord?.userInfo?.EFFECTIVE_USER_ORCID
    )
    return isImpersonation || !!this.window.opener
  }

  getInterstitialViewed(): Observable<boolean> {
    if (
      this.qaFlag.isFlagEnabled(
        this.QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN
      )
    ) {
      return of(false)
    }
    // Check if user has already seen it
    return this.interstitialsService.getInterstitialsViewed(
      this.INTERSTITIAL_NAME
    )
  }

  /**
   * Records the visit and opens the interstitial's journey. Shared by both
   * render paths so a dialog and an inline component behave identically —
   * anything added here is inherited by the OAuth flow for free.
   *
   * Recording the visit is bookkeeping, so a failure there must not stop the
   * interstitial from showing. It used to: the flag POST is chained ahead of
   * the render, and `setInterstitialsViewed` writes localStorage *before*
   * calling it, so a transient failure (a 403 from a missing XSRF header, for
   * one) left the user marked as having seen an interstitial that never
   * appeared — and never would again.
   */
  protected markViewedAndTrackShown(): Observable<unknown> {
    return this.interstitialsService
      .setInterstitialsViewed(this.INTERSTITIAL_NAME)
      .pipe(
        catchError(() => of(null)),
        tap(() => this.interstitialObservability.shown(this.INTERSTITIAL_NAME))
      )
  }

  showInterstitialAsDialog(userRecord: UserRecord): Observable<TOutput> {
    return this.markViewedAndTrackShown().pipe(
      switchMap(() => {
        const data = this.getDialogDataToShow(userRecord)
        const dialogRef = this.matDialog.open<TOutput>(
          this.getDialogComponentToShow(),
          {
            ...this.getDefaultDialogConfig(data),
          }
        )
        return dialogRef
          .afterClosed()
          .pipe(tap(() => this.interstitialObservability.closed()))
      })
    )
  }

  /**
   * Let each child define which component to open and how to build `TInput`.
   */
  abstract getDialogComponentToShow(): ComponentType<any>
  abstract getDialogDataToShow(userRecord: UserRecord): TInput
  abstract getComponentToShow(): ComponentType<TComponent>

  /**
   * Provide a default dialog config, which child classes can override if needed.
   */
  protected getDefaultDialogConfig(data: TInput): MatDialogConfig<TInput> {
    return {
      data,
      width: '580px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      maxHeight: 'calc(100vh - 20px)',
      maxWidth: '98vw',
      panelClass: 'interstitial-dialog',
    }
  }
  getInterstitialTogglz(toggglzPrefix: 'OAUTH' | 'LOGIN'): Observable<boolean> {
    const togglzName = this.INTERSTITIAL_TOGGLE.find((toggle) =>
      toggle.startsWith(toggglzPrefix)
    )
    return this.togglzService.getStateOf(togglzName as TogglzFlag).pipe(take(1))
  }

  /**
   * The OAuth flow renders the interstitial inline instead of in a dialog.
   * The host owns the component's lifetime, so it is responsible for calling
   * `InterstitialObservabilityService.closed()` when it tears it down.
   */
  showInterstitialAsComponent(): Observable<ComponentType<TComponent>> {
    return this.markViewedAndTrackShown().pipe(
      map(() => this.getComponentToShow())
    )
  }
}
