// iinterstitial-service.ts
import { Observable } from 'rxjs'
import { UserRecord } from 'src/app/types/record.local'
import { ComponentType } from '@angular/cdk/overlay' // If not recognized, import from @angular/cdk
import { InterstitialType } from 'src/app/cdk/interstitials/interstitial.type'

/**
 * Common interface for any interstitial service that needs
 * to decide if it should show an interstitial and then show it.
 *
 * TInput: the type of data passed into the dialog.
 * TOutput: the type of data (if any) emitted from dialogRef.afterClosed().
 */
export interface InterstitialManagerServiceInterface<TInput = any, TOutput = any> {
  INTERSTITIAL_NAME: InterstitialType
  INTERSTITIAL_TOGGLE: string

  // Determines whether this interstitial should be shown
  userIsElegibleForInterstitial(userRecord: UserRecord): Observable<boolean>

  // Actually display the interstitial, returning whatever the afterClosed emits
  showInterstitial(userRecord: UserRecord): Observable<TOutput>

  // Provide the dialog component that should be opened
  getDialogComponentToShow(): ComponentType<any>

  // Build the dialog's input data from the user record
  getDialogDataToShow(userRecord: UserRecord): TInput

  // Get the interstitial toggle from the togglz service
  getInterstitialTogglz(): Observable<boolean>

  // Check if the interstitial has already been viewed
  getInterstitialViewed(): Observable<boolean>
}
