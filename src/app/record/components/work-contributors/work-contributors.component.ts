import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { UserRecord } from '../../../types/record.local'
import { takeUntil, tap } from 'rxjs/operators'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { Subject } from 'rxjs'
import { Contributor } from '../../../types'
import { environment } from 'src/environments/environment'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'
import { EmploymentsEndpoint } from '../../../types/record-affiliation.endpoint'
import { unique } from '../../../shared/validators/unique/unique.validator'
import { ContributionRoles } from '../../../types/works.endpoint'
import { MAX_LENGTH_LESS_THAN_ONE_HUNDRED } from '../../../constants'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { WINDOW } from '../../../cdk/window'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { MatSelect } from '@angular/material/select'

@Component({
  selector: 'app-work-contributors',
  templateUrl: './work-contributors.component.html',
  styleUrls: [
    './work-contributors.component.scss',
    './work-contributors.component.scss-theme.scss',
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class WorkContributorsComponent implements OnInit, OnDestroy {
  @ViewChildren('roleSelect', { read: ViewContainerRef })
  inputs: QueryList<MatSelect>

  deleteLabel = $localize`:@@shared.deleteActivityAriaLabel:Delete`
  @ViewChildren('contributorNames')
  contributorNamesInputs: QueryList<ElementRef>

  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() contributors: Contributor[]
  @Input() userRecord: UserRecord
  @Input() recordHolderAsContributor: boolean

  affiliation: string
  id: string
  isMobile: boolean
  screenDirection = 'ltr'
  roles: string
  maxNumberOfContributors = 49
  maxNumberOfContributorsSummary = 10
  privateName = 'Name is private'
  togglzAddOtherContributors: boolean

  contributionRoles = ContributionRoles
  recordHolderContribution: Contributor

  ngOrcidSelectRole = $localize`:@@works.pleaseSelectRole:Please select a role`
  ngOrcidSelectRoleAriaLabel = $localize`:@@works.pleaseSelectRoleAriaLabel:Select your contributor to this work`

  ngOrcidContributorName = $localize`:@@works.contributorName:Contributor name`

  constructor(
    _togglz: TogglzService,
    @Inject(WINDOW) private window: Window,
    private _changeDetectorRef: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private parentForm: FormGroupDirective,
    private platform: PlatformInfoService,
    private workService: RecordWorksService,
    private affiliationService: RecordAffiliationService
  ) {
    _togglz
      .getStateOf('ADD_OTHER_WORK_CONTRIBUTORS')
      .subscribe((value) => (this.togglzAddOtherContributors = value))
  }

  get contributorsFormArray() {
    return this.parentForm.control.controls['contributors'] as UntypedFormArray
  }

  get rolesRecordHolderFormArray() {
    return this.parentForm.control.controls['roles'] as UntypedFormArray
  }

  ngOnInit(): void {
    // EFFECTIVE_USER_ORCID keeps the ORCID id of the user you are on.
    // REAL_USER_ORCID will contain the orcid id of a delegator when on delegation mode.
    this.id = this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID
    this.platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
        this.screenDirection = platform.screenDirection
      })
    if (this.userRecord?.affiliations?.length > 0) {
      this.getEmploymentsFromAffiliations(this.userRecord?.affiliations)
    } else {
      this.affiliationService
        .getEmployments()
        .pipe(
          tap((employments) => {
            this.getEmployments(employments)
          })
        )
        .subscribe()
    }
    this.initializeFormArray()
  }

  addAnotherContributor(addAnotherContributorStatus: boolean): void {
    if (!addAnotherContributorStatus) {
      this.contributorsFormArray.push(this.getContributorForm())
    }
    this._changeDetectorRef.detectChanges()

    this.contributorNamesInputs.last.nativeElement.focus()
  }

  addRecordHolderAsContributor(): void {
    this.roles = ''
    this.parentForm.control.setControl(
      'roles',
      new UntypedFormArray([
        this.getRoleForm(
          this.workService.getContributionRoleByKey('no specified role').key,
          false
        ),
      ])
    )
    this.contributorsFormArray.push(this.getRecordHolder())
    this.rolesValuesChange()
  }

  rolesFormArray(contributor): AbstractControl[] {
    return (contributor.get('roles') as UntypedFormArray).controls
  }

  addAnotherRole(contributor, contributorIndex?): void {
    ;(contributor.get('roles') as UntypedFormArray).push(
      this.getRoleForm(
        this.workService.getContributionRoleByKey('no specified role').key,
        false
      )
    )
    this._changeDetectorRef.detectChanges()
    if (contributorIndex) {
      // Find las input with id contributor and focus on it
      const contributorIndexInputs = this.inputs.toArray().filter((input) => {
        // Get input native element
        const nativeElement = ((input as any).element as ElementRef)
          .nativeElement
        console.log(nativeElement)
        console.log(nativeElement.classList)

        // Check if nativeElement has class
        if (
          nativeElement.classList.contains(
            'contributor-role-' + contributorIndex
          )
        ) {
          return input
        }
        return false
      })
      ;(
        contributorIndexInputs[contributorIndexInputs.length - 1] as any
      ).element.nativeElement.focus()
    }
  }

  deleteContributor(contributorIndex: number): void {
    if (
      this.contributorsFormArray
        .at(contributorIndex)
        .get(['contributorOrcid', 'path'])?.value === this.id
    ) {
      this.parentForm.control.setControl('roles', new UntypedFormArray([]))
    }
    this.contributorsFormArray.removeAt(contributorIndex)
  }

  deleteRole(contributor, roleIndex: number): void {
    ;(contributor.get('roles') as UntypedFormArray).removeAt(roleIndex)
    if (roleIndex === 0 && this.roles.length === 0) {
      this.addAnotherRole(contributor)
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.contributorsFormArray.controls,
      event.previousIndex,
      event.currentIndex
    )
  }

  private initializeFormArray(): void {
    this.recordHolderContribution = this.getRecordHolderContribution()
    this.parentForm.control.setControl('contributors', new UntypedFormArray([]))
    const contributorsFormArray = this.parentForm.control.get(
      'contributors'
    ) as UntypedFormArray

    if (this.togglzAddOtherContributors && this.contributors?.length > 0) {
      if (!this.recordHolderContribution && !this.recordHolderAsContributor) {
        this.addRecordHolderAsContributor()
      }
      this.contributors.forEach((contributor) => {
        contributorsFormArray.push(
          this.getContributorForm(
            contributor?.creditName?.content,
            contributor?.contributorOrcid?.path
              ? contributor?.contributorOrcid?.path
              : null,
            contributor?.contributorOrcid?.uri
              ? contributor?.contributorOrcid?.uri
              : null,
            contributor.rolesAndSequences.map((role) => role.contributorRole),
            true
          )
        )
      })
    } else {
      if (!this.recordHolderAsContributor) {
        this.addRecordHolderAsContributor()
      }
    }
    this.roles = this.getDisabledRoles()?.join(', ')
    this.rolesValuesChange()
    this._changeDetectorRef.detectChanges()
  }

  private rolesValuesChange(): void {
    this.rolesRecordHolderFormArray?.valueChanges.subscribe(() => {
      this.roles = [
        ...this.getDisabledRoles(),
        ...this.getEnabledRoles(),
      ]?.join(', ')
    })
  }

  private getContributorForm(
    name?: string,
    orcid?: string,
    uri?: string,
    roles?: string[],
    disabled?: boolean
  ): UntypedFormGroup {
    const contributor = this.formBuilder.group({
      creditName: [
        {
          value: name ? name : '',
          disabled,
        },
        [
          Validators.required,
          Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_HUNDRED),
        ],
      ],
      contributorOrcid: this.formBuilder.group({
        path: [orcid ? orcid : null],
        uri: [
          uri ? uri : orcid ? `https:${environment.BASE_URL}${orcid}` : null,
        ],
      }),
      roles: new UntypedFormArray([]),
    })
    const rolesFormArray = contributor.controls.roles as UntypedFormArray
    if (roles?.length > 0) {
      roles.forEach((role) => {
        if (role) {
          const r = this.workService.getContributionRoleByKey(role)?.key
          rolesFormArray.push(this.getRoleForm(r ? r : role, disabled))
        }
      })
    } else {
      if (!disabled) {
        rolesFormArray.push(
          this.getRoleForm(
            this.workService.getContributionRoleByKey('no specified role').key,
            false
          )
        )
      }
    }
    return contributor
  }

  private getRoleForm(role?: string, disabled?: boolean): UntypedFormGroup {
    return this.formBuilder.group({
      role: [
        {
          value: role ? role.toLowerCase() : '',
          disabled,
        },
        [unique('role', 'no specified role')],
      ],
    })
  }

  private getDisabledRoles(): string[] {
    return this.rolesRecordHolderFormArray?.controls
      .filter((formGroup) => formGroup.disabled)
      .map((formGroup) => {
        const role = formGroup?.value?.role
        const translation =
          this.workService.getContributionRoleByKey(role)?.translation
        return translation
          ? translation
          : role.charAt(0).toUpperCase() + role.slice(1)
      })
  }

  private getEnabledRoles(): string[] {
    return this.rolesRecordHolderFormArray?.controls
      .filter((formGroup) => !formGroup.disabled && formGroup?.value?.role)
      .map(
        (formGroup) =>
          this.workService.getContributionRoleByKey(formGroup?.value?.role)
            .translation
      )
  }

  private getCreditNameFromUserRecord(): string {
    const creditName = this.userRecord?.names?.creditName?.value
    const givenNames = this.userRecord?.names?.givenNames?.value
    const familyName = this.userRecord?.names?.familyName?.value

    if (creditName) {
      return creditName
    } else {
      return familyName ? `${givenNames} ${familyName}` : givenNames
    }
  }

  private getEmployments(employments: EmploymentsEndpoint): void {
    this.affiliation = employments.employmentGroups
      ?.map((employmentGroup) =>
        employmentGroup.activities
          .filter((activity) => !activity?.endDate?.year)
          .map((activity) => activity.organization?.name)
          ?.join(', ')
      )
      .filter((affiliation) => affiliation.length > 0)
      .join(', ')
  }

  private getEmploymentsFromAffiliations(affiliations): void {
    this.affiliation = affiliations
      ?.map((affiliationUIGroup) =>
        affiliationUIGroup.affiliationGroup
          .filter(
            (affiliation) =>
              !affiliation.defaultAffiliation?.endDate?.year &&
              affiliation.defaultAffiliation?.affiliationType?.value ===
                'employment'
          )
          .map(
            (affiliation) =>
              affiliation.defaultAffiliation?.affiliationName?.value
          )
          ?.join(', ')
      )
      .filter((affiliation) => affiliation.length > 0)
      .join(', ')
  }

  private getRecordHolderContribution(): Contributor {
    return this.contributors?.find(
      (c) => c?.contributorOrcid?.path && c?.contributorOrcid?.path === this.id
    )
  }

  private getRecordHolder(): UntypedFormGroup {
    const orcid = this.recordHolderContribution?.contributorOrcid?.path
      ? this.recordHolderContribution?.contributorOrcid?.path
      : this.id
    const name = this.recordHolderContribution
      ? this.recordHolderContribution?.creditName?.content
      : this.getCreditNameFromUserRecord()
    const uri = this.recordHolderContribution?.contributorOrcid?.uri
      ? this.recordHolderContribution?.contributorOrcid?.uri
      : `https:${environment.BASE_URL}${orcid}`
    // todo validate if its necessary
    if (!this.recordHolderContribution) {
      this.recordHolderContribution = {
        contributorOrcid: {
          path: this.id,
          uri: uri,
        },
        creditName: {
          content: name,
        },
      } as Contributor
    }

    return this.getContributorForm(name, orcid, uri, [], true)
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  goto(url: string) {
    this.window.open(url)
  }
}
