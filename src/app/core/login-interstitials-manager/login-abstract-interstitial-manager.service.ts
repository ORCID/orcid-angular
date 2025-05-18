import { Observable, of } from 'rxjs'
import { TogglzService } from '../togglz/togglz.service'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { UserRecord } from 'src/app/types/record.local'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { map, switchMap, take } from 'rxjs/operators'
import { MatDialogConfig } from '@angular/material/dialog'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'

import { QaFlag } from '../../qa-flag/qa-flags.enum'
import { QaFlagsService } from '../../qa-flag/qa-flag.service'
import {
  BaseInterstitialDialogInput,
  BaseInterstitialDialogOutput,
} from './dialog-interface'

export abstract class LoginBaseInterstitialManagerService<
  TInput extends BaseInterstitialDialogInput,
  TOutput extends BaseInterstitialDialogOutput,
  TComponent
> {
  abstract INTERSTITIAL_NAME: InterstitialType
  abstract INTERSTITIAL_TOGGLE: string
  abstract QA_FLAG_FOR_FORCE_INTERSTITIAL_AS_NEVER_SEEN: QaFlag

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
   */
  showInterstitial(userRecord: UserRecord): Observable<TOutput> {
    return this.interstitialsService
      .setInterstitialsViewed(this.INTERSTITIAL_NAME)
      .pipe(
        switchMap(() => {
          const data = this.getDialogDataToShow(userRecord)
          const dialogRef = this.matDialog.open<TOutput>(
            this.getDialogComponentToShow(),
            {
              ...this.getDefaultDialogConfig(data),
            }
          )
          return dialogRef.afterClosed()
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
    }
  }
  getInterstitialTogglz(): Observable<boolean> {
    return this.togglzService.getStateOf(this.INTERSTITIAL_TOGGLE).pipe(take(1))
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
