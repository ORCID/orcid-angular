import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { combineLatest, Observable, of, Subject } from 'rxjs'
import { first, takeUntil, finalize } from 'rxjs/operators'
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
import { OrcidPanelComponent } from '@orcid/ui'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { TogglzFlag } from '../../../core/togglz/togglz-flags.enum'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { MatDialog } from '@angular/material/dialog'
import { VerificationEmailModalService } from 'src/app/core/verification-email-modal/verification-email-modal.service'
import { getAriaLabel } from 'src/app/constants'

@Component({
  selector: 'app-affiliation-stack',
  templateUrl: './affiliation-stack.component.html',
  styleUrls: [
    './affiliation-stack.component.scss',
    './affiliation-stack.component.scss-theme.scss',
  ],
  standalone: false,
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

  // Panel header visibility/edit helpers
  tooltipLabelEdit = $localize`:@@shared.edit:Edit`
  visibilityError = false
  editableVisibilityControl = true
  bannerCaptionEnabled = false

  constructor(
    private _affiliationService: RecordAffiliationService,
    private _organizationsService: OrganizationsService,
    private _togglz: TogglzService,
    private _platform: PlatformInfoService,
    private _dialog: MatDialog,
    private _verificationEmailModalService: VerificationEmailModalService
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
      affiliation.affiliationType.value === 'editorial-service'
        ? 'service'
        : affiliation.affiliationType.value,
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

  editAffiliation(affiliation: Affiliation) {
    const hasVerifiedEmail = this.userRecord?.emails?.emails?.some(
      (email) => email.verified
    )
    const primaryEmail = this.userRecord?.emails?.emails?.find(
      (email) => email.primary
    )

    if (!hasVerifiedEmail) {
      if (primaryEmail?.value) {
        this._verificationEmailModalService.openVerificationEmailModal(
          primaryEmail.value
        )
      }
      return
    }

    this._platform
      .get()
      .pipe(first())
      .subscribe((platform) => {
        const dialogRef = this._dialog.open(ModalAffiliationsComponent, {
          width: '850px',
          maxWidth: platform.tabletOrHandset ? '99%' : '80vw',
          ariaLabel: getAriaLabel(ModalAffiliationsComponent, this.type),
        })

        dialogRef.componentInstance.type = this.type
        dialogRef.componentInstance.affiliation = affiliation
      })
  }

  loadingFeatured: { [key: string]: boolean } = {}
  @Output() featuredToggled = new EventEmitter<{
    affiliationName: string
    featured: boolean
  }>()

  toggleFeatured(affiliation: Affiliation) {
    const putCode = affiliation.featured ? '' : affiliation.putCode.value
    const wasFeatured = affiliation.featured
    this.loadingFeatured[affiliation.putCode.value] = true
    this._affiliationService
      .updateFeatured(putCode)
      .pipe(
        finalize(() => {
          this.loadingFeatured[affiliation.putCode.value] = false
        })
      )
      .subscribe({
        next: () => {
          // Only emit if we're setting it as featured (not removing)
          if (!wasFeatured) {
            this.featuredToggled.emit({
              affiliationName: affiliation.affiliationName?.value || '',
              featured: true,
            })
          }
        },
      })
  }

  updateVisibility(visibility: any) {
    // Apply visibility change to all affiliations in this stack
    const putCodes = this.affiliationStack.affiliations
      .map((a) => a.putCode.value)
      .join(',')
    this._affiliationService.updateVisibility(putCodes, visibility).subscribe()
    this.visibilityError = false
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

  getAffiliationIcon(type: AffiliationType): string | undefined {
    if (!this.professionalActivities) {
      return undefined
    }

    const iconMap: Record<string, string> = {
      'invited-position': 'join_inner',
      distinction: 'crown',
      membership: 'card_membership',
      service: 'badge',
      'editorial-service': 'auto_stories',
    }

    return iconMap[type]
  }

  getAffiliationIconClass(type: AffiliationType): string | undefined {
    if (!this.professionalActivities) {
      return undefined
    }

    if (type === 'distinction' || type === 'editorial-service') {
      return 'material-symbols-outlined'
    }
    return 'material-icons-outlined'
  }

  getAffiliationTitle(affiliation: Affiliation): string {
    const parts: string[] = [affiliation.affiliationName.value]

    const locationParts: string[] = []

    if (affiliation.city?.value?.trim()) {
      locationParts.push(affiliation.city.value)
    }

    if (affiliation.region?.value?.trim()) {
      locationParts.push(affiliation.region.value)
    }

    if (affiliation.country?.value) {
      locationParts.push(affiliation.country.value)
    }

    if (locationParts.length > 0) {
      parts.push(': ' + locationParts.join(', '))
    }

    return parts.join('')
  }

  getFeaturedToggleTooltip(affiliation: Affiliation): string {
    // Only show tooltip when not a public record
    if (!!this.isPublicRecord) {
      return ''
    }

    // Check if visibility is PUBLIC
    const isPublic = affiliation.visibility?.visibility === 'PUBLIC'

    if (!isPublic) {
      return $localize`:@@shared.makePublicToEnableHighlighting:Make this affiliation public to enable highlighting`
    }

    if (affiliation.featured) {
      return $localize`:@@shared.clickToRemoveHighlight:Click to remove this highlight`
    }

    return $localize`:@@shared.clickToHighlight:Click to highlight this affiliation`
  }

  isFeaturedToggleDisabled(affiliation: Affiliation): boolean {
    // Disable if banner caption feature is disabled
    if (!this.bannerCaptionEnabled) {
      return true
    }

    // Disable if it's a public record
    if (!!this.isPublicRecord) {
      return true
    }

    // Disable if loading
    if (this.loadingFeatured[affiliation.putCode.value]) {
      return true
    }

    // Disable if visibility is not PUBLIC
    const isPublic = affiliation.visibility?.visibility === 'PUBLIC'
    if (!isPublic) {
      return true
    }

    return false
  }

  getEnableStartToggl(affiliation: Affiliation): boolean {
    if (!this.bannerCaptionEnabled) {
      return false
    }
    return (
      (!!this.isPublicRecord && affiliation.featured) ||
      (!this.isPublicRecord && this.type === 'employment')
    )
  }

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (platform) => (this.isMobile = platform.columns4 || platform.columns8)
      )

    this._togglz
      .getStateOf(TogglzFlag.FEATURED_AFFILIATIONS)
      .pipe(takeUntil(this.$destroy))
      .subscribe((enabled) => {
        this.bannerCaptionEnabled = !!enabled
      })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
