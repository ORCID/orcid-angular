import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

/**
 * Shares state required by the Record Header between My ORCID and the Header.
 * This avoids duplicate API calls and enables rendering the header in compact mode.
 */
@Injectable({ providedIn: 'root' })
export class RecordHeaderStateService {
  private readonly _loadingUserRecord = new BehaviorSubject<boolean>(true)
  private readonly _isPublicRecord = new BehaviorSubject<string | null>(null)
  private readonly _affiliations = new BehaviorSubject<number>(0)
  private readonly _displaySideBar = new BehaviorSubject<boolean>(false)
  private readonly _displayBiography = new BehaviorSubject<boolean>(false)
  private readonly _recordSummaryOpen = new BehaviorSubject<boolean>(false)

  readonly loadingUserRecord$ = this._loadingUserRecord.asObservable()
  readonly isPublicRecord$ = this._isPublicRecord.asObservable()
  readonly affiliations$ = this._affiliations.asObservable()
  readonly displaySideBar$ = this._displaySideBar.asObservable()
  readonly displayBiography$ = this._displayBiography.asObservable()
  readonly recordSummaryOpen$ = this._recordSummaryOpen.asObservable()

  setLoadingUserRecord(val: boolean) {
    this._loadingUserRecord.next(val)
  }
  setIsPublicRecord(val: string | null) {
    this._isPublicRecord.next(val)
  }
  setAffiliations(val: number) {
    this._affiliations.next(val)
  }
  setDisplaySideBar(val: boolean) {
    this._displaySideBar.next(val)
  }
  setDisplayBiography(val: boolean) {
    this._displayBiography.next(val)
  }
  setRecordSummaryOpen(val: boolean) {
    this._recordSummaryOpen.next(val)
  }

  reset() {
    this._loadingUserRecord.next(true)
    this._isPublicRecord.next(null)
    this._affiliations.next(0)
    this._displaySideBar.next(false)
    this._displayBiography.next(false)
    this._recordSummaryOpen.next(false)
  }
}
