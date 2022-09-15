import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
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
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() contributors: Contributor[]
  @Input() userRecord: UserRecord

  affiliation: string
  id: string
  isMobile: boolean
  screenDirection = 'ltr'
  roles: string
  maxNumberOfContributors = 49

  contributionRoles = ContributionRoles

  ngOrcidSelectRole = $localize`:@@works.pleaseSelectRole:Please select a role`

  constructor(
    @Inject(WINDOW) private window: Window,
    private formBuilder: FormBuilder,
    private parentForm: FormGroupDirective,
    private platform: PlatformInfoService,
    private workService: RecordWorksService,
    private affiliationService: RecordAffiliationService
  ) {}

  get contributorsFormArray() {
    return this.parentForm.control.controls['contributors'] as FormArray
  }

  get rolesRecordHolderFormArray() {
    return this.parentForm.control.controls['roles'] as FormArray
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
  }

  rolesFormArray(contributor): AbstractControl[] {
    return (contributor.get('roles') as FormArray).controls
  }

  addAnotherRole(contributor): void {
    ;(contributor.get('roles') as FormArray).push(
      this.getRoleForm(
        this.workService.getContributionRoleByKey('no specified role').key,
        false
      )
    )
  }

  deleteContributor(contributorIndex: number): void {
    this.contributorsFormArray.removeAt(contributorIndex)
  }

  deleteRole(contributor, roleIndex: number): void {
    ;(contributor.get('roles') as FormArray).removeAt(roleIndex)
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
    const recordHolderContribution = this.getRecordHolderContribution()
    const orcid = recordHolderContribution?.contributorOrcid?.path
      ? recordHolderContribution?.contributorOrcid?.path
      : this.id
    const name = recordHolderContribution
      ? recordHolderContribution?.creditName?.value
      : this.getCreditNameFromUserRecord()
    const uri = recordHolderContribution?.contributorOrcid?.uri
      ? recordHolderContribution?.contributorOrcid?.uri
      : `https:${environment.BASE_URL}${orcid}`
    this.parentForm.control.setControl('contributors', new FormArray([]))
    const contributorsFormArray = this.parentForm.control.get(
      'contributors'
    ) as FormArray
    if (this.contributors?.length > 0) {
      if (!recordHolderContribution) {
        contributorsFormArray.push(
          this.getContributorForm(name, orcid, uri, [], true)
        )
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
      contributorsFormArray.push(
        this.getContributorForm(name, orcid, uri, [], true)
      )
    }
    // Validate if contributor is in the list of contributors otherwise added it
    this.roles = this.getDisabledRoles()?.join(', ')
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
  ): FormGroup {
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
      roles: new FormArray([]),
    })
    const rolesFormArray = contributor.controls.roles as FormArray
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

  private getRoleForm(role?: string, disabled?: boolean): FormGroup {
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
        const translation = this.workService.getContributionRoleByKey(role)
          ?.translation
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

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

  goto(url: string) {
    this.window.open(url)
  }
}
