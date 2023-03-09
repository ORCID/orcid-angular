import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { ContributionRoles, Role } from '../../../types/works.endpoint'
import {
  ControlContainer,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormGroupDirective,
} from '@angular/forms'
import { Contributor } from '../../../types'
import { UserRecord } from '../../../types/record.local'
import { unique } from '../../../shared/validators/unique/unique.validator'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { MatSelect } from '@angular/material/select'

@Component({
  selector: 'app-work-contributor-roles',
  templateUrl: './work-contributor-roles.component.html',
  styleUrls: ['./work-contributor-roles.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class WorkContributorRolesComponent implements OnInit {
  deleteLabel = $localize`:@@shared.deleteActivityAriaLabel:Delete`
  @ViewChildren('roleSelect') inputs: QueryList<MatSelect>

  _contributors: Contributor[]
  @Input() userRecord: UserRecord
  @Input() recordHolderAsContributor: boolean

  contributionRoles = ContributionRoles
  recordHolder: Contributor

  ngOrcidSelectRole = $localize`:@@works.pleaseSelectRole:Please select a role`

  @Input()
  set contributors(contributors: Contributor[]) {
    this._contributors = contributors
  }

  get contributors() {
    return this._contributors
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private parentForm: FormGroupDirective,
    private workService: RecordWorksService
  ) {}

  get roles() {
    return this.parentForm.control.controls['roles'] as UntypedFormArray
  }

  ngOnInit(): void {
    this.initializeFormArray()
  }

  addRole(): void {
    this.roles.push(
      this.getRoleForm(
        this.workService.getContributionRoleByKey('no specified role').key,
        false
      )
    )
    this.changeDetectorRef.detectChanges()
    const input = this.inputs.last
    input.focus()
  }

  deleteRole(roleIndex: number): void {
    this.roles.removeAt(roleIndex)
    if (roleIndex === 0 && this.roles.length === 0) {
      this.addRole()
    }
  }

  private initializeFormArray(): void {
    this.parentForm.control.setControl('roles', new UntypedFormArray([]))
    this.recordHolder = this.getRecordHolderContribution()
    if (!this.recordHolderAsContributor || this.recordHolder) {
      if (this.contributors) {
        const rolesAndSequences = this.recordHolder?.rolesAndSequences
        if (rolesAndSequences?.length > 0) {
          const roles = rolesAndSequences
            .filter((roleAndSequence) => roleAndSequence.contributorRole)
            .map((rolesAndSequence) => rolesAndSequence.contributorRole)
          if (roles?.length > 0) {
            roles.forEach((rs) => {
              const role = this.workService.getContributionRoleByKey(rs)
              if (rs && role) {
                this.addRoleFormGroup(role.key, true)
              } else {
                this.addRoleFormGroup(rs, true)
              }
            })
          } else {
            this.addRoleFormGroup(
              this.workService.getContributionRoleByKey('no specified role')
                .key,
              false
            )
          }
        } else {
          this.addRoleFormGroup(
            this.workService.getContributionRoleByKey('no specified role').key,
            false
          )
        }
      } else {
        this.addRoleFormGroup(
          this.workService.getContributionRoleByKey('no specified role').key,
          false
        )
      }
    }
  }

  private addRoleFormGroup(role?: string, disabled?: boolean): void {
    this.roles.push(this.getRoleForm(role, disabled))
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

  private getRecordHolderContribution(): Contributor {
    return this.contributors?.find(
      (c) =>
        c?.contributorOrcid?.path ===
        this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID
    )
  }
}
