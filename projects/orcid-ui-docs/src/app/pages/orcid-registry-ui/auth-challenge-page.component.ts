import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { AuthChallengeComponent } from '@orcid/registry-ui'
import '@angular/localize/init'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'auth-challenge-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    AuthChallengeComponent,
    DocumentationPageComponent,
    ReactiveFormsModule,
  ],
  styleUrls: ['./auth-challenge-page.component.scss'],
  templateUrl: './auth-challenge-page.component.html',
})
export class AuthChallengePageComponent implements OnInit {
  showPasswordField = true
  showTwoFactorField = false
  actionDescription: String
  memberName: String
  form: UntypedFormGroup
  data: any

  constructor(private _fb: UntypedFormBuilder, private _dialog: MatDialog) {}

  ngOnInit() {
    this.form = this._fb.group({
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
      password: ['', Validators.required],
    })
  }

  openDialog() {
    const dialogRef = this._dialog.open(AuthChallengeComponent, {
      data: {
        actionDescription: this.actionDescription,
        memberName: this.memberName,
        showPasswordField: this.showPasswordField,
        showTwoFactorField: this.showTwoFactorField,
      },
    })
  }
}
