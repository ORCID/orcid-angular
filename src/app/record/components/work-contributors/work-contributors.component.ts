import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroupDirective,
} from '@angular/forms'
import { UserRecord } from '../../../types/record.local'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { Subject } from 'rxjs'
import { Contributor } from '../../../types'
import { environment } from 'src/environments/environment'
import { RecordWorksService } from '../../../core/record-works/record-works.service'

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

  constructor(
    private formBuilder: FormBuilder,
    private parentForm: FormGroupDirective,
    private platform: PlatformInfoService,
    private workService: RecordWorksService
  ) {}

  get contributorsFormArray() {
    return this.parentForm.control.controls['contributors'] as FormArray
  }

  get rolesFormArray() {
    return this.parentForm.control.controls['roles'] as FormArray
  }

  ngOnInit(): void {
    this.id = this.userRecord?.userInfo?.REAL_USER_ORCID
    this.platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
        this.screenDirection = platform.screenDirection
      })
    this.initializeFormArray()
  }

  private initializeFormArray(): void {
    const recordHolderContribution = this.getRecordHolderContribution()
    const orcid = recordHolderContribution?.contributorOrcid?.path
      ? recordHolderContribution?.contributorOrcid?.path
      : this.id
    this.parentForm.control.setControl(
      'contributors',
      new FormArray([
        this.formBuilder.group({
          creditName: [
            recordHolderContribution
              ? recordHolderContribution?.creditName?.value
              : this.getCreditNameFromUserRecord(),
          ],
          contributorOrcid: this.formBuilder.group({
            path: [orcid],
            uri: [
              recordHolderContribution?.contributorOrcid?.uri
                ? recordHolderContribution?.contributorOrcid?.uri
                : `https:${environment.BASE_URL}${orcid}`,
            ],
          }),
        }),
      ])
    )
    this.roles = this.getDisabledRoles()?.join(', ')
    this.rolesFormArray?.valueChanges.subscribe(() => {
      this.roles = [
        ...this.getDisabledRoles(),
        ...this.getEnabledRoles(),
      ]?.join(', ')
    })
    this.getAffiliation()
  }

  private getDisabledRoles(): string[] {
    return this.rolesFormArray?.controls
      .filter((formGroup) => formGroup.disabled)
      .map(
        (formGroup) =>
          this.workService.getContributionRoleByKey(formGroup?.value?.role)
            .translation
      )
  }

  private getEnabledRoles(): string[] {
    return this.rolesFormArray?.controls
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

  private getAffiliation(): void {
    const affiliationUIGroup = this.userRecord?.affiliations?.find(
      (value) => value.type === 'EMPLOYMENT'
    ).affiliationGroup
    const defaultAffiliation = affiliationUIGroup
      ?.filter((value) => !value.defaultAffiliation?.endDate?.year)
      .map((value) => value.defaultAffiliation?.affiliationName?.value)
    this.affiliation = defaultAffiliation?.join(', ')
  }

  private getRecordHolderContribution(): Contributor {
    return this.contributors?.find((c) => c?.contributorOrcid?.path === this.id)
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
