import { Component, Input, OnInit } from '@angular/core'
import { Role } from '../../../types/works.endpoint'
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms'
import { Contributor } from '../../../types'
import { UserRecord } from '../../../types/record.local'
import { unique } from '../../../shared/validators/unique/unique.validator'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-work-contributor-roles',
  templateUrl: './work-contributor-roles.component.html',
  styleUrls: ['./work-contributor-roles.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class WorkContributorRolesComponent implements OnInit {
  _contributors: Contributor[]
  @Input() userRecord: UserRecord

  contributionRoles: Role[]

  ngOrcidSelectRole = $localize`:@@works.pleaseSelectRole:Please select a role`

  @Input()
  set contributors(contributors: Contributor[]) {
    this._contributors = contributors
  }

  get contributors() {
    return this._contributors
  }

  constructor(
    private formBuilder: FormBuilder,
    private parentForm: FormGroupDirective,
    private workService: RecordWorksService
  ) {}

  get roles() {
    return this.parentForm.control.controls['roles'] as FormArray
  }

  ngOnInit(): void {
    this.workService
      .getContributionRoles()
      .pipe(tap((contributors) => (this.contributionRoles = contributors)))
      .subscribe()
    this.initializeFormArray()
  }

  addRole(): void {
    this.roles.push(this.getRoleForm())
  }

  deleteRole(roleIndex: number): void {
    this.roles.removeAt(roleIndex)
  }

  private initializeFormArray(): void {
    this.parentForm.control.setControl('roles', new FormArray([]))
    if (this.contributors) {
      const rolesAndSequences = this.getRecordHolderContribution()
        ?.rolesAndSequences
      if (rolesAndSequences) {
        rolesAndSequences.forEach((rs) => {
          const role = this.workService.getContributionRoleByKey(
            rs?.contributorRole
          )
          if (rs?.contributorRole && role) {
            this.addRoleFormGroup(role.translation)
          } else {
            this.addRoleFormGroup(
              this.workService.getContributionRoleByKey('unspecified')
                .translation
            )
          }
        })
      } else {
        this.addRoleFormGroup()
      }
    } else {
      this.addRoleFormGroup()
    }
  }

  private addRoleFormGroup(role?: string): void {
    this.roles.push(this.getRoleForm(role))
  }

  private getRoleForm(role?: string): FormGroup {
    return this.formBuilder.group({
      role: [
        { value: role ? role.toLowerCase() : '', disabled: !!role },
        [unique('role')],
      ],
    })
  }

  private getRecordHolderContribution(): Contributor {
    return this.contributors?.find(
      (c) =>
        c?.contributorOrcid?.path === this.userRecord?.userInfo?.REAL_USER_ORCID
    )
  }
}
