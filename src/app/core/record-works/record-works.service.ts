import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, forkJoin, Observable, of, ReplaySubject } from 'rxjs'
import {
  catchError,
  first,
  map,
  retry,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'
import {
  PublicWorkSearchEndpoint,
  PublicWorkSearchResult,
  TranslatedTitle,
  Work,
  WorkGroup,
  WorksEndpoint,
} from 'src/app/types/record-works.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import {
  ContributionRoles,
  GroupingSuggestions,
  Role,
  WorkCombineEndpoint,
  WorkIdType,
  WorkIdTypeValidation,
  _LEGACY_ContributionRoles,
} from 'src/app/types/works.endpoint'

import { ErrorHandlerService } from '../error-handler/error-handler.service'
import {
  MonthDayYearDate,
  Value,
  VisibilityStrings,
} from '../../types/common.endpoint'
import { DEFAULT_PAGE_SIZE, EXTERNAL_ID_TYPE_WORK } from 'src/app/constants'
import {
  RecordImportWizard,
  SearchAndLinkWizardFormSummaryResponse,
} from '../../types/record-peer-review-import.endpoint'
import type {
  ImportWorksDialogData,
  ImportWorksCertifiedLink,
  ImportWorksMoreLink,
} from '@orcid/registry-ui'
import { SortOrderType } from '../../types/sort'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordWorksService {
  lastEmittedValue: WorksEndpoint = null
  groupingSuggestionsSubjectInitialized = false
  groupingSuggestionsSubject = new ReplaySubject<GroupingSuggestions>(1)
  $workSubject = new ReplaySubject<WorksEndpoint>(1)
  $featuredWorkSubject = new ReplaySubject<Work[]>(1)
  offset = 0
  sortOrder: SortOrderType = 'date'
  sortAsc = false
  pageSize = DEFAULT_PAGE_SIZE
  contributionRoles = ContributionRoles

  userRecordOptions: UserRecordOptions = {}

  private _$loading = new BehaviorSubject<boolean>(true)
  private _$loadingFeatured = new BehaviorSubject<boolean>(true)
  private _$loadingSearch = new BehaviorSubject<boolean>(false)

  public get $loading() {
    return this._$loading.asObservable()
  }

  public get $loadingFeatured() {
    return this._$loadingFeatured.asObservable()
  }

  public get $loadingSearch() {
    return this._$loadingSearch.asObservable()
  }

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _togglz: TogglzService
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
   * @param options
   */
  getWorks(options: UserRecordOptions): Observable<WorksEndpoint> {
    if (!options) {
      options = {}
    }

    if (options?.cleanCacheIfExist && this.$workSubject) {
      this.$workSubject.next(<WorksEndpoint>undefined)
    }

    options.pageSize = options?.pageSize || DEFAULT_PAGE_SIZE
    options.offset = options.offset || 0
    this.pageSize = options.pageSize
    this.offset = options.offset
    this.sortOrder = options.sort
    this.sortAsc = options.sortAsc

    this._$loading.next(true)

    let url: string
    if (options.publicRecordId) {
      url = options.publicRecordId + '/worksExtendedPage.json'
    } else {
      url = 'works/worksExtendedPage.json'
    }

    this._http
      .get<WorksEndpoint>(
        runtimeEnvironment.API_WEB +
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
          data.groups = this.calculateVisibilityErrors(data.groups)
          return data
        }),
        tap((data) => {
          this._$loading.next(false)
          this.lastEmittedValue = data
          this.$workSubject.next(data)
        }),
        tap(() => {
          if (!options.publicRecordId) {
            this.getWorksGroupingSuggestions({ force: true })
          }
        })
      )
      .subscribe()

    return this.$workSubject.asObservable()
  }

  /**
   * Return an observable with a list of Featured Works
   *
   * @param options
   */
  getFeaturedWorks(options: UserRecordOptions): Observable<Work[]> {
    this._$loadingFeatured.next(true)

    this._togglz
      .getStateOf(TogglzFlag.FEATURED_WORKS_UI)
      .pipe(take(1))
      .subscribe((enabled) => {
        if (!enabled) {
          this._$loadingFeatured.next(false)
          this.$featuredWorkSubject.next([])
          return
        }

        let url: string
        if (options.publicRecordId) {
          url = options.publicRecordId + '/featuredWorks.json'
        } else {
          url = 'works/featuredWorks.json'
        }

        this._http
          .get<Work[]>(runtimeEnvironment.API_WEB + url)
          .pipe(
            retry(3),
            catchError((error) => this._errorHandler.handleError(error)),
            tap((data) => {
              this._$loadingFeatured.next(false)
              this.$featuredWorkSubject.next(data)
            })
          )
          .subscribe()
      })

    return this.$featuredWorkSubject.asObservable()
  }

  searchPublicWorks(
    term: string
  ): Observable<{ results: Work[]; total: number }> {
    return this._http
      .get<PublicWorkSearchEndpoint>(
        runtimeEnvironment.API_WEB +
          `works/searchWorksTitleToFeature.json?term=${encodeURIComponent(
            term
          )}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        map((works: PublicWorkSearchEndpoint) => ({
          results: works.results.map(
            (work) =>
              ({
                ...work,
                title: { value: work.title } as Value,
                workType: { value: work.workType } as Value,
                putCode: { value: work.putCode } as Value,
                journalTitle: { value: work.journalTitle } as Value,
                translatedTitle: {
                  value: work.translatedTitle,
                } as TranslatedTitle,
                featuredDisplayIndex: work.featuredDisplayIndex,
                publicationDate: {
                  day: work.publicationDay,
                  month: work.publicationMonth,
                  year: work.publicationYear,
                } as MonthDayYearDate,
                workExternalIdentifiers: [],
              } as Work)
          ),
          total: works.totalCount,
        })),
        tap(() => this._$loadingSearch.next(false))
      )
  }

  /**
   * Update featured works ordering
   * Payload: map of putCode -> position index (1-based). To delete, send `undefined`.
   */
  updateFeaturedWorks(
    featuredOrder: { [putCode: string]: number | undefined },
    requireReloadAllWotks: boolean = false
  ): Observable<boolean> {
    return this._http
      .put<boolean>(
        runtimeEnvironment.API_WEB + 'works/featuredWorks.json',
        featuredOrder
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => {
          this.getFeaturedWorks({ forceReload: true })
          if (requireReloadAllWotks) {
            this.getWorks({ forceReload: true })
          }
        })
      )
  }

  private calculateVisibilityErrors(groups: WorkGroup[]): WorkGroup[] {
    return groups?.map((group) => {
      group.visibilityError = !!group.works.find(
        (x) => x.visibility.visibility !== group.activeVisibility
      )
      return group
    })
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
        runtimeEnvironment.API_WEB +
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
        runtimeEnvironment.API_WEB + `works/worksInfo/${putCodes.join(',')}`
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
        runtimeEnvironment.API_WEB +
          `${
            orcidId ? orcidId + '/' : 'works/'
          }worksPage.json?offset=${offset}&sort=${sort}&sortAsc=${sortAsc}&pageSize=50`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  save(
    work: Work,
    reloadFeatured: boolean = false,
    isLastWorkElement = true
  ): Observable<Work> {
    return this._http
      .post<Work>(runtimeEnvironment.API_WEB + `works/work.json`, work)
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => {
          if (isLastWorkElement) {
            this.getWorks({ forceReload: true })
          }
          if (reloadFeatured) {
            this.getFeaturedWorks({ forceReload: true })
          }
        })
      )
  }

  getWork(): Observable<Work> {
    return this._http
      .get<Work>(runtimeEnvironment.API_WEB + `works/work.json`)
      .pipe(
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
    visibility: VisibilityStrings,
    reloadFeatured: boolean = false
  ): Observable<any> {
    const options = {
      forceReload: true,
      offset: this.offset,
      sort: this.sortOrder,
      sortAsc: this.sortAsc,
    }

    return this._http
      .get(
        runtimeEnvironment.API_WEB +
          'works/' +
          putCode +
          '/visibility/' +
          visibility
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(
          () =>
            this.getWorks(options) &&
            reloadFeatured &&
            this.getFeaturedWorks({ forceReload: true })
        )
      )
  }

  updatePreferredSource(putCode: string): Observable<any> {
    return this._http
      .get(
        runtimeEnvironment.API_WEB +
          'works/updateToMaxDisplay.json?putCode=' +
          putCode
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
      .get<WorkIdType[]>(
        `${runtimeEnvironment.API_WEB}works/idTypes.json?query=`
      )
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
        `${runtimeEnvironment.API_WEB}works/id/${idType}?value=${workId}`
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  delete(putCode: any, reloadFeatured: boolean): Observable<any> {
    return this._http
      .delete(
        runtimeEnvironment.API_WEB +
          'works/' +
          (Array.isArray(putCode) ? putCode.join(',') : putCode)
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => {
          this.getWorks({ forceReload: true })
          if (reloadFeatured) {
            this.getFeaturedWorks({ forceReload: true })
          }
        })
      )
  }

  combine(putCodes: string[]): Observable<WorkCombineEndpoint> {
    return this.combinePutCodes(putCodes.join(','))
  }

  combinePutCodes(putCodes: string): Observable<WorkCombineEndpoint> {
    return this._http
      .post<WorkCombineEndpoint>(
        runtimeEnvironment.API_WEB + 'works/group/' + putCodes,
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
        runtimeEnvironment.API_WEB +
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
    return this._http.get(runtimeEnvironment.API_WEB + 'works/works.bib', {
      responseType: 'text',
    })
  }

  exportSelected(putCodes: string[]): Observable<any> {
    return this._http.get(
      runtimeEnvironment.API_WEB +
        'works/export/bibtex?workIdsStr=' +
        putCodes.join(','),
      {
        responseType: 'text',
      }
    )
  }

  loadWorkImportWizardList(): Observable<RecordImportWizard[]> {
    return this._togglz
      .getStateOf(
        TogglzFlag.SEARCH_AND_LINK_WIZARD_WITH_CERTIFIED_AND_FEATURED_LINKS
      )
      .pipe(
        take(1),
        switchMap((useNewEndpoint) =>
          this._http.get<RecordImportWizard[]>(
            runtimeEnvironment.API_WEB +
              (useNewEndpoint
                ? 'workspace/retrieve-works-search-and-link-wizard.json'
                : 'workspace/retrieve-work-import-wizards.json')
          )
        )
      )
  }

  /**
   * Returns the static part of the Import Works dialog data (title, intro, labels, empty link lists).
   * Sets loading: true so the dialog shows skeleton placeholders until full data is assigned.
   * Use this to open the dialog immediately; then pass full data from loadSearchAndLinkWizardDialogData when it loads.
   */
  getImportWorksDialogDataSkeleton(): ImportWorksDialogData {
    return this._getImportWorksDialogDataStatic([], [], true)
  }

  private _getImportWorksDialogDataStatic(
    certifiedLinks: ImportWorksCertifiedLink[],
    moreServicesLinks: ImportWorksMoreLink[],
    loading?: boolean
  ): ImportWorksDialogData {
    return {
      ...(loading !== undefined && { loading }),
      title: $localize`:@@works.importYourWorks:Import your works`,
      introText: $localize`:@@works.importIntroText:These services can help you update your ORCID record quickly by searching for your research outputs from various databases. Connect to a service to grant permission and add selected research outputs to your ORCID record.`,
      supportLink: {
        url: 'https://support.orcid.org/hc/en-us/articles/360006973653-Add-works-by-direct-import-from-other-systems',
        label: $localize`:@@works.importSupportLinkLabel:Find out more about importing works into your ORCID record`,
      },
      certifiedSectionHeading: $localize`:@@works.certifiedSectionHeading:ORCID Certified Services`,
      moreServicesHeading: $localize`:@@works.moreServicesHeading:More Services`,
      connectNowLabel: $localize`:@@works.connectNow:Connect now`,
      connectedLabel: $localize`:@@works.connected:Connected`,
      closeAriaLabel: $localize`:@@works.closeImportYourWorks:Close Import your works`,
      showMoreServicesAriaLabel: $localize`:@@works.showMoreServices:Show more services`,
      hideMoreServicesAriaLabel: $localize`:@@works.hideMoreServices:Hide more services`,
      connectNowAriaLabelTemplate: $localize`:@@works.connectWithCspNow:Connect with {{name}} now`,
      connectedAriaLabelTemplate: $localize`:@@works.connectedWithCsp:Connected with {{name}}`,
      certifiedLinks,
      moreServicesLinks,
      placeholderIconUrl: 'assets/vectors/CSPs/csp-placeholder.svg',
    }
  }

  /**
   * Loads data for the new Import Works dialog (certified + more services).
   * Use when SEARCH_AND_LINK_WIZARD_WITH_CERTIFIED_AND_FEATURED_LINKS is enabled.
   * Certified/Featured: description from S3 localize.properties by client id, else redirectUriMetadata.defaultDescription.
   * More Services: description from top-level `description` only.
   */
  loadSearchAndLinkWizardDialogData(
    locale: string
  ): Observable<ImportWorksDialogData> {
    const list$ = this._http.get<SearchAndLinkWizardFormSummaryResponse[]>(
      runtimeEnvironment.API_WEB +
        'workspace/retrieve-works-search-and-link-wizard.json'
    )
    const baseUrl = (
      runtimeEnvironment as { CERTIFIED_LINKS_LOCALIZE_BASE_URL?: string }
    ).CERTIFIED_LINKS_LOCALIZE_BASE_URL?.replace(/\/$/, '')
    const localizeUrl = baseUrl
      ? `${baseUrl}/works-search-and-link.${locale}.properties`
      : null
    const localize$ = localizeUrl
      ? this._http
          .get(localizeUrl, { responseType: 'text' })
          .pipe(catchError(() => of('')))
      : of('')

    return forkJoin({ list: list$, localize: localize$ }).pipe(
      map(({ list, localize }) => {
        const localizeByClientId = this._parsePropertiesFile(localize)
        const certifiedForList: Array<{
          link: ImportWorksCertifiedLink
          index: number
        }> = []
        const featuredForMore: Array<{
          link: ImportWorksMoreLink
          index: number
        }> = []
        const defaultForMore: ImportWorksMoreLink[] = []

        for (const item of list) {
          const type = item.redirectUriMetadata?.type
          const connected = item.connected ?? false
          const name = item.name ?? ''
          const redirectUri = item.redirectUri ?? ''
          const scopes = item.scopes ?? ''
          const oauthUrl = this._buildOAuthAuthorizeUrl(
            item.id,
            scopes,
            redirectUri
          )
          // Backend returns redirectUriMetadata from DB as-is; logoUrl may be absent (Certified can have no logo)
          const rawLogoUrl = item.redirectUriMetadata?.logoUrl
          const imageUrl =
            typeof rawLogoUrl === 'string' && rawLogoUrl.trim() !== ''
              ? rawLogoUrl.trim()
              : undefined

          if (type === 'Certified') {
            const description =
              localizeByClientId[`${item.id}-client-description`] ??
              localizeByClientId[item.id] ??
              item.redirectUriMetadata?.defaultDescription ??
              ''
            const index = item.redirectUriMetadata?.index ?? 999
            certifiedForList.push({
              link: {
                name,
                description,
                url: oauthUrl,
                connected,
                imageUrl,
              },
              index,
            })
          } else if (type === 'Featured') {
            const description =
              localizeByClientId[`${item.id}-client-description`] ??
              localizeByClientId[item.id] ??
              item.redirectUriMetadata?.defaultDescription ??
              ''
            const index = item.redirectUriMetadata?.index ?? 999
            featuredForMore.push({
              link: { name, description, url: oauthUrl, imageUrl },
              index,
            })
          } else {
            const description = item.description ?? ''
            defaultForMore.push({ name, description, url: oauthUrl, imageUrl })
          }
        }

        certifiedForList.sort((a, b) => a.index - b.index)
        const certifiedLinks: ImportWorksCertifiedLink[] =
          certifiedForList.map((x) => x.link)

        featuredForMore.sort((a, b) => a.index - b.index)
        defaultForMore.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        )
        const moreServicesLinks: ImportWorksMoreLink[] = [
          ...featuredForMore.map((x) => x.link),
          ...defaultForMore,
        ]

        return this._getImportWorksDialogDataStatic(
          certifiedLinks,
          moreServicesLinks,
          false
        )
      })
    )
  }

  /**
   * Builds the OAuth authorize URL used when the user clicks "Connect now".
   * Matches the format used by the legacy search-link-wizard.
   */
  private _buildOAuthAuthorizeUrl(
    clientId: string,
    scopes: string,
    redirectUri: string
  ): string {
    const base = (runtimeEnvironment as { BASE_URL?: string }).BASE_URL ?? ''
    return (
      base +
      'oauth/authorize' +
      '?client_id=' +
      encodeURIComponent(clientId) +
      '&response_type=code' +
      '&scope=' +
      encodeURIComponent(scopes) +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri)
    )
  }

  /**
   * Parses a Java .properties file into a key-value map.
   * Handles key=value lines and skips comments/empty lines.
   */
  private _parsePropertiesFile(text: string): Record<string, string> {
    const out: Record<string, string> = {}
    if (!text || typeof text !== 'string') return out
    const lines = text.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq < 0) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      value = value
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\')
      out[key] = value
    }
    return out
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

    return this._http.get<Work>(runtimeEnvironment.API_WEB + url + externalId)
  }

  worksValidate(obj): Observable<any> {
    return this._http.post(
      runtimeEnvironment.API_WEB + 'works/worksValidate.json',
      JSON.stringify(obj),
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
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
          runtimeEnvironment.API_WEB + 'works/groupingSuggestions.json',
          {
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
        .subscribe((x) => this.groupingSuggestionsSubject.next(x))
    }
    return this.groupingSuggestionsSubject.asObservable()
  }

  getContributionRoleByKey(key: string): Role {
    return (
      this.contributionRoles.find((role) => role.key === key) ||
      _LEGACY_ContributionRoles.find((role) => role.key === key)
    )
  }
}
