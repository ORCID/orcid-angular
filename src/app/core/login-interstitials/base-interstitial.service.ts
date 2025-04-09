import { Observable } from 'rxjs'
import { TogglzService } from '../togglz/togglz.service'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { UserRecord } from 'src/app/types/record.local'
import { IInterstitialService } from './iinterstitial-service'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { map, switchMap, take } from 'rxjs/operators'
import { MatDialogConfig } from '@angular/material/dialog'
import { ComponentType } from '@angular/cdk/overlay'
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'

export abstract class BaseInterstitialService<TInput, TOutput>
  implements IInterstitialService<TInput, TOutput>
{
  // You can define some default properties here that child classes can override if needed
  abstract INTERSTITIAL_NAME: InterstitialType
  abstract INTERSTITIAL_TOGGLE: string

  // This will usually get updated on subscription to togglz
  INTERSTITIAL_TOGGLE_ENABLED = false
  INTERSTITIAL_WAS_SHOWN = false

  constructor(
    protected matDialog: MatDialog,
    protected togglzService: TogglzService,
    protected interstitialsService: InterstitialsService
  ) {}
  getIntertitialToggle() {
    this.togglzService
      .getStateOf(this.INTERSTITIAL_TOGGLE)
      .pipe(take(1))
      .subscribe((state) => (this.INTERSTITIAL_TOGGLE_ENABLED = state))
  }

  abstract shouldShowInterstitial(userRecord: UserRecord): Observable<boolean>

  userHasNotSeemTheInterstitialAndTogglzIsOn(): Observable<boolean> {
    // Check if user has already seen it
    return this.interstitialsService
      .getInterstitialsViewed(this.INTERSTITIAL_NAME)
      .pipe(
        map((flag) => {
          console.log('flag-', this.INTERSTITIAL_NAME, flag)
          console.log(
            'toglz-',
            this.INTERSTITIAL_NAME,
            this.INTERSTITIAL_TOGGLE_ENABLED
          )
          console.log(
            'wasShow-n-',
            this.INTERSTITIAL_NAME,
            this.INTERSTITIAL_WAS_SHOWN
          )
          // Return true only if it's toggled on AND we haven't shown it yet
          return (
            this.INTERSTITIAL_TOGGLE_ENABLED &&
            !this.INTERSTITIAL_WAS_SHOWN &&
            !flag
          )
        })
      )
  }

  /**
   * We define a default "show" function that:
   *   1) Marks the interstitial as viewed
   *   2) Opens the dialog
   *   3) Returns whatever the dialog emits on close
   */
  showInterstitial(userRecord: UserRecord): Observable<TOutput> {
    this.INTERSTITIAL_WAS_SHOWN = true

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
  getInterstitialFlag(): Observable<boolean> {
    return this.togglzService.getStateOf(this.INTERSTITIAL_TOGGLE)
  }
}
