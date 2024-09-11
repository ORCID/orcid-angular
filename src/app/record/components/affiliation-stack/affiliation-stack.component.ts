import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { combineLatest, Observable, of, Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { OrganizationsService } from 'src/app/core'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { OrgDisambiguated, UserInfo } from 'src/app/types'
import {
  Affiliation,
  AffiliationGroup,
  AffiliationType,
  AffiliationUIGroup,
} from 'src/app/types/record-affiliation.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { ModalAffiliationsComponent } from '../affiliation-stacks-groups/modals/modal-affiliations/modal-affiliations.component'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { PlatformInfoService } from '../../../cdk/platform-info'

@Component({
  selector: 'app-affiliation-stack',
  templateUrl: './affiliation-stack.component.html',
  styleUrls: [
    './affiliation-stack.component.scss',
    './affiliation-stack.component.scss-theme.scss',
  ],
})
export class AffiliationStackComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @HostBinding('class.display-the-stack') displayTheStackClass = false
  _affiliationStack: AffiliationGroup
  @Input() userRecord: UserRecord
  @Input() isPublicRecord: string = null
  @Input() type: AffiliationType
  hasExternalIdentifiers: boolean
  @Input() professionalActivities: boolean
  @Input()
  set affiliationStack(value: AffiliationGroup) {
    this.hasExternalIdentifiers = !!value.externalIdentifiers.length
    this._affiliationStack = value
    this._affiliationStack.affiliations =
      this._affiliationStack.affiliations.map((affiliation) => {
        return {
          ...affiliation,
          userIsSource: this.userIsSource(affiliation),
        }
      })

    this.setAffiliationsInitialStates(value)
  }
  get affiliationStack(): AffiliationGroup {
    return this._affiliationStack
  }

  _displayTheStack = false
  set displayTheStack(mode: boolean) {
    this._displayTheStack = mode
    this.displayTheStackClass = this._displayTheStack
    this.setAffiliationsInitialStates(this.affiliationStack, true)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }
  private _userInfo: UserInfo

  @Input()
  public set userInfo(value: UserInfo) {
    this._userInfo = value
    this._affiliationStack.affiliations =
      this._affiliationStack.affiliations.map((affiliation) => {
        return {
          ...affiliation,
          userIsSource: this.userIsSource(affiliation),
        }
      })
  }
  public get userInfo(): UserInfo {
    return this._userInfo
  }

  orgDisambiguated: { [key: string]: OrgDisambiguated | null } = {}
  stackPanelsDisplay: { [key: string]: { topPanelOfTheStack: boolean } } = {}
  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}
  modalAffiliationsComponent = ModalAffiliationsComponent
  isMobile: boolean

  constructor(
    private _affiliationService: RecordAffiliationService,
    private _organizationsService: OrganizationsService,
    private _togglz: TogglzService,
    private _platform: PlatformInfoService
  ) {}

  /**
   * Set the panelDetails and top of the stack card to default mode
   */
  private setAffiliationsInitialStates(value: AffiliationGroup, force = false) {
    if (value.affiliations?.length === 1 && this.displayTheStack) {
      this.displayTheStack = false
    }

    value.affiliations.forEach((affiliation) => {
      this.setDefaultPanelsDisplay(affiliation, force)
      this.setDefaultPanelDetailsState(affiliation, force)
    })
  }

  /**
   * On start, hide the details for all the panels
   */
  private setDefaultPanelDetailsState(affiliation: Affiliation, force = false) {
    if (
      this.panelDetailsState[affiliation.putCode.value] === undefined ||
      force
    ) {
      this.panelDetailsState[affiliation.putCode.value] = {
        state: false,
      }
    }
  }

  /**
   * On start, set the preferred source as the top panel of the stack
   */
  private setDefaultPanelsDisplay(affiliation: Affiliation, force = false) {
    if (
      this.stackPanelsDisplay[affiliation.putCode.value] === undefined ||
      force
    ) {
      this.stackPanelsDisplay[affiliation.putCode.value] = {
        topPanelOfTheStack: this.isPreferred(affiliation) ? true : false,
      }
    }
  }

  isPreferred(affiliation: Affiliation) {
    const response =
      affiliation && this.affiliationStack
        ? this.affiliationStack.defaultAffiliation.putCode.value ===
          affiliation.putCode.value
        : false
    return response
  }

  /**
   * Show and hide details of the panel
   */
  toggleDetails(affiliation: Affiliation) {
    const putCode = affiliation.putCode.value
    this.panelDetailsState[putCode].state =
      !this.panelDetailsState[putCode].state

    if (
      this.panelDetailsState[putCode].state &&
      !this.orgDisambiguated[putCode]
    ) {
      this.getMoreDetailsAndOrganizationDisambiguatedFromTheServer(
        affiliation
      ).subscribe((response) => {
        this.orgDisambiguated[putCode] = response[0] || null
      })
    }
  }

  /**
   * Get require extra backend data to display on the panel details
   */
  private getMoreDetailsAndOrganizationDisambiguatedFromTheServer(
    affiliation: Affiliation
  ): Observable<[false | OrgDisambiguated, AffiliationUIGroup[]]> {
    const putCode = affiliation.putCode.value

    let $affiliationDisambiguationSource: Observable<false | OrgDisambiguated> =
      of(false)
    // Adds call for disambiguationSource if the affiliation has
    if (affiliation.disambiguationSource) {
      $affiliationDisambiguationSource =
        this._organizationsService.getOrgDisambiguated(
          affiliation.disambiguationSource.value,
          affiliation.disambiguatedAffiliationSourceId.value
        )
    }
    const $affiliationDetails = this._affiliationService.getAffiliationsDetails(
      affiliation.affiliationType.value,
      putCode,
      {
        publicRecordId: this.isPublicRecord,
      }
    )

    // Call http requests at the same time
    return combineLatest([
      $affiliationDisambiguationSource,
      $affiliationDetails,
    ]).pipe(first())
  }

  makePrimaryCard(affiliation: Affiliation) {
    this._affiliationService
      .updatePreferredSource(affiliation.putCode.value)
      .subscribe()
  }

  changeTopPanelOfTheStack(affiliation: Affiliation) {
    Object.keys(this.stackPanelsDisplay).forEach((key) => {
      this.stackPanelsDisplay[key].topPanelOfTheStack = false
    })
    this.stackPanelsDisplay[affiliation.putCode.value].topPanelOfTheStack = true
  }

  trackByAffiliationStack(index, item: Affiliation) {
    return item.putCode.value
  }

  userIsSource(affiliation: Affiliation): boolean {
    if (this.userInfo) {
      return affiliation.source === this.userInfo.EFFECTIVE_USER_ORCID
    }
    return false
  }

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (platform) => (this.isMobile = platform.columns4 || platform.columns8)
      )
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
