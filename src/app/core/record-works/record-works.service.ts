import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { EMPTY, Observable, of, ReplaySubject } from 'rxjs'
import { catchError, map, retry, switchMap, switchMapTo, take, tap } from 'rxjs/operators'
import { Work, WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import {
  GroupingSuggestions,
  WorkCombineEndpoint,
  WorkIdType,
  WorkIdTypeValidation,
} from 'src/app/types/works.endpoint'
import { environment } from 'src/environments/environment'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { VisibilityStrings } from '../../types/common.endpoint'
import { DEFAULT_PAGE_SIZE, EXTERNAL_ID_TYPE_WORK } from 'src/app/constants'
import { RecordImportWizard } from '../../types/record-peer-review-import.endpoint'
import { SortOrderType } from '../../types/sort'
import { TogglzService } from '../togglz/togglz.service'

@Injectable({
  providedIn: 'root',
})
export class RecordWorksService {
  lastEmittedValue: WorksEndpoint = null
  groupingSuggestionsSubjectInitialized = false
  groupingSuggestionsSubject = new ReplaySubject<GroupingSuggestions>(1)
  $workSubject = new ReplaySubject<WorksEndpoint>(1)
  offset = 0
  sortOrder: SortOrderType = 'date'
  sortAsc = false
  pageSize = DEFAULT_PAGE_SIZE
  togglzWorksContributors: boolean

  userRecordOptions: UserRecordOptions = {}

  constructor(
    private _togglz: TogglzService,
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  /**
   * Return an observable with a list of Works
   * Arrange according to the requested parameters
   *
   * @param id user Orcid id
   */

  sort(
    offset = 0,
    sort = 'date',
    sortAsc = false,
    orcidId?: string
  ): Observable<WorksEndpoint> {
    return this.getWorksData(offset, sort, sortAsc, orcidId).pipe(
      map((data) => {
        this.lastEmittedValue = data
        this.$workSubject.next(data)
      }),
      switchMap((data) => this.$workSubject.asObservable())
    )
  }
  /**
   * Return an observable with a list of Works
   * For full work details getDetails(id, putCode) must be called
   *
   * @param id user Orcid id
   */
  getWorks(options: UserRecordOptions): Observable<WorksEndpoint> {
    if (options.cleanCacheIfExist && this.$workSubject) {
      this.$workSubject.next(<WorksEndpoint>undefined)
    }

    options.pageSize = options.pageSize || DEFAULT_PAGE_SIZE
    options.offset = options.offset || 0
    this.pageSize = options.pageSize
    this.offset = options.offset
    this.sortOrder = options.sort
    this.sortAsc = options.sortAsc

    let url
    if (options.publicRecordId) {
      url =
        options.publicRecordId +
        (this.togglzWorksContributors
          ? '/worksExtendedPage.json'
          : '/worksPage.json')
    } else {
      url = this.togglzWorksContributors
        ? 'works/worksExtendedPage.json'
        : 'works/worksPage.json'
    }

    this._http
      .get<WorksEndpoint>(
        environment.API_WEB +
          url +
          '?offset=' +
          options.offset +
          '&sort=' +
          (options.sort != null ? options.sort : 'date') +
          '&sortAsc=' +
          (options.sortAsc != null ? options.sortAsc : false) +
          `&pageSize=` +
          options.pageSize
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({ groups: [] } as WorksEndpoint)),
        map((data) => {
          data.pageSize = options.pageSize
          data.pageIndex = options.offset
            ? Math.floor(options.offset / options.pageSize)
            : 0
          return data
        }),
        tap((data) => {
          this.lastEmittedValue = data
          this.$workSubject.next(data)
        }),
        tap(() => {
          if (!options.publicRecordId) {
            this.getWorksGroupingSuggestions({ force: true })
          }
        }),
        switchMapTo(this._togglz.getStateOf('ORCID_ANGULAR_WORKS_CONTRIBUTORS'), (a, b) => this.togglzWorksContributors = b),
      )
      .subscribe()
    return this.$workSubject.asObservable()
  }

  changeUserRecordContext(
    userRecordOptions: UserRecordOptions
  ): Observable<WorksEndpoint> {
    this.userRecordOptions = userRecordOptions
    return this.getWorks(userRecordOptions).pipe(take(1))
  }

  /**
   * Similar to get() witch to returns a list of Work objects
   * this returns the same observable list but with the details of the requested work.
   *
   * This would add the following data to the Work:
   * citation, contributors, countryCode, countryName, createdDate, dateSortString, dateSortString
   * languageCode, languageName, url, lastModified, shortDescription, subtitle, workCategory
   *
   * TODO check why the userSource attribute comes as false on this call
   *
   * @param orcidId user Orcid id
   * @param putCode code of work
   */

  getDetails(putCode: string, orcidId?: string): Observable<WorksEndpoint> {
    return this.getWorkInfo(putCode, orcidId).pipe(
      tap((workWithDetails) => {
        this.lastEmittedValue.groups.map((works) => {
          works.works = works.works.map((work) => {
            if (work.putCode.value === putCode) {
              return workWithDetails
            }
            return work
          })
        })
        this.$workSubject.next(this.lastEmittedValue)
      }),
      switchMap(() => {
        return this.$workSubject.asObservable()
      })
    )
  }

  getWorkInfo(putCode: string, orcidId?: string): Observable<Work> {
    return this._http
      .get<Work>(
        environment.API_WEB +
          `${
            orcidId ? orcidId + '/' : 'works/'
          }getWorkInfo.json?workId=${putCode}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getWorksInfo(putCodes: string[], orcidId?: string): Observable<Work[]> {
    return this._http
      .get<Work[]>(
        environment.API_WEB + `works/worksInfo/${putCodes.join(',')}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  getWorksData(
    offset,
    sort,
    sortAsc,
    orcidId?: string
  ): Observable<WorksEndpoint> {
    return this._http
      .get<WorksEndpoint>(
        environment.API_WEB +
          `${
            orcidId ? orcidId + '/' : 'works/'
          }worksPage.json?offset=${offset}&sort=${sort}&sortAsc=${sortAsc}&pageSize=50`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  save(work: Work, bibtex?: boolean): Observable<WorksEndpoint | never> {
    return this._http
      .post<Work>(environment.API_WEB + `works/work.json`, work)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        switchMap(() =>
          bibtex === false ? EMPTY : this.getWorks({ forceReload: true })
        )
      )
  }

  getWork(): Observable<Work> {
    return this._http.get<Work>(environment.API_WEB + `works/work.json`).pipe(
      retry(3),
      map((x) => {
        x.workExternalIdentifiers = []
        return x
      }),
      catchError((error) => this._errorHandler.handleError(error))
    )
  }

  set(value: any): Observable<any> {
    throw new Error('Method not implemented.')
  }

  updateVisibility(
    putCode: string,
    visibility: VisibilityStrings
  ): Observable<any> {
    const options = {
      forceReload: true,
      offset: this.offset,
      sort: this.sortOrder,
      sortAsc: this.sortAsc,
    }

    return this._http
      .get(
        environment.API_WEB + 'works/' + putCode + '/visibility/' + visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getWorks(options))
      )
  }

  updatePreferredSource(putCode: string): Observable<any> {
    return this._http
      .get(
        environment.API_WEB + 'works/updateToMaxDisplay.json?putCode=' + putCode
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() =>
          this.getWorks({ ...this.userRecordOptions, forceReload: true })
        )
      )
  }

  public loadWorkIdTypes(): Observable<WorkIdType[]> {
    return this._http
      .get<WorkIdType[]>(`${environment.API_WEB}works/idTypes.json?query=`)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  public validateWorkIdTypes(
    idType: string,
    workId: string
  ): Observable<WorkIdTypeValidation> {
    return this._http
      .get<WorkIdTypeValidation>(
        `${environment.API_WEB}works/id/${idType}?value=${workId}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  delete(putCode: any): Observable<any> {
    return this._http
      .delete(
        environment.API_WEB +
          'works/' +
          (Array.isArray(putCode) ? putCode.join(',') : putCode)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getWorks({ forceReload: true }))
      )
  }

  combine(putCodes: string[]): Observable<WorkCombineEndpoint> {
    return this.combinePutCodes(putCodes.join(','))
  }

  combinePutCodes(putCodes: string): Observable<WorkCombineEndpoint> {
    return this._http
      .post<WorkCombineEndpoint>(
        environment.API_WEB + 'works/group/' + putCodes,
        {}
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getWorks({ forceReload: true }))
      )
  }

  visibility(
    putCodes: string[],
    visibility: VisibilityStrings
  ): Observable<any> {
    return this._http
      .get(
        environment.API_WEB +
          'works/' +
          putCodes.join(',') +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getWorks({ forceReload: true }))
      )
  }

  export(): Observable<any> {
    return this._http.get(environment.API_WEB + 'works/works.bib', {
      responseType: 'text',
    })
  }

  exportSelected(putCodes: string[]): Observable<any> {
    return this._http.get(
      environment.API_WEB +
        'works/export/bibtex?workIdsStr=' +
        putCodes.join(','),
      {
        responseType: 'text',
      }
    )
  }

  loadWorkImportWizardList(): Observable<RecordImportWizard[]> {
    return this._http.get<RecordImportWizard[]>(
      environment.API_WEB + 'workspace/retrieve-work-import-wizards.json'
    )
  }

  loadExternalId(
    externalId: string,
    type: EXTERNAL_ID_TYPE_WORK
  ): Observable<Work> {
    let url = 'works/resolve/doi?value='
    if (type === EXTERNAL_ID_TYPE_WORK.pubMed) {
      const regex = new RegExp(/((.*[\/,\\](pmc))|(PMC)\/?\d{5})/g)
      const result = regex.exec(externalId)
      url = result ? 'works/resolve/pmc/?value=' : 'works/resolve/pmid?value='
    }

    return this._http.get<Work>(environment.API_WEB + url + externalId)
  }

  worksValidate(obj): Observable<any> {
    return this._http.post(
      environment.API_WEB + 'works/worksValidate.json',
      JSON.stringify(obj),
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    )
  }

  getWorksGroupingSuggestions(
    options: { force: boolean } = { force: false }
  ): Observable<GroupingSuggestions> {
    if (options.force || !this.groupingSuggestionsSubjectInitialized) {
      this.groupingSuggestionsSubjectInitialized = true
      this._http
        .get<GroupingSuggestions>(
          environment.API_WEB + 'works/groupingSuggestions.json',
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        )
        .subscribe((x) => this.groupingSuggestionsSubject.next(x))
    }
    return this.groupingSuggestionsSubject.asObservable()
  }
}
