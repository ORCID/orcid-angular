import { inject } from '@angular/core'
import { Observable, of } from 'rxjs'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { UserRecord } from 'src/app/types/record.local'
import { MatDialog } from '@angular/material/dialog'
import { catchError, map, switchMap, take, tap } from 'rxjs/operators'
import { InterstitialObservabilityService } from '../interstitial-observability.service'
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
   * We define a default "show" function that:
   *   1) Marks the interstitial as viewed
   *   2) Opens the dialog
   *   3) Returns whatever the dialog emits on close
   *
   * Recording the visit is bookkeeping, so a failure there must not stop the
   * interstitial from opening. It used to: the flag POST is chained ahead of
   * the dialog, and `setInterstitialsViewed` writes localStorage *before*
   * calling it, so a transient failure (a 403 from a missing XSRF header, for
   * one) left the user marked as having seen an interstitial that never
   * appeared — and never would again.
   */
  showInterstitialAsDialog(userRecord: UserRecord): Observable<TOutput> {
    return this.interstitialsService
      .setInterstitialsViewed(this.INTERSTITIAL_NAME)
      .pipe(
        catchError(() => of(null)),
        switchMap(() => {
          const data = this.getDialogDataToShow(userRecord)
          const dialogRef = this.matDialog.open<TOutput>(
            this.getDialogComponentToShow(),
            {
              ...this.getDefaultDialogConfig(data),
            }
          )
          // Single choke point, so every interstitial reports the same
          // "shown" denominator and closes its journey
          this.interstitialObservability.shown(this.INTERSTITIAL_NAME)
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

  showInterstitialAsComponent(): Observable<ComponentType<TComponent>> {
    return this.interstitialsService
      .setInterstitialsViewed(this.INTERSTITIAL_NAME)
      .pipe(
        map(() => {
          return this.getComponentToShow()
        })
      )
  }
}
