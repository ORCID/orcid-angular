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
import { MatButtonModule } from '@angular/material/button'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'auth-challenge-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    DocumentationPageComponent,
    ReactiveFormsModule,
  ],
  styleUrls: ['./auth-challenge-page.component.scss'],
  templateUrl: './auth-challenge-page.component.html',
})
export class AuthChallengePageComponent implements OnInit {
  showPasswordField = true
  showTwoFactorField = true
  actionDescription = 'perform this action on'
  memberName = 'Example Account'
  form: UntypedFormGroup

  constructor(private _fb: UntypedFormBuilder, private _dialog: MatDialog) {}

  ngOnInit() {
    this.form = this._fb.group({
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
      password: [null, Validators.required],
    })
  }

  openDialog() {
    const dialogRef = this._dialog.open(AuthChallengeComponent, {
      data: {
        parentForm: this.form,
        actionDescription: this.actionDescription,
        memberName: this.memberName,
        showPasswordField: this.showPasswordField,
        showTwoFactorField: this.showTwoFactorField,
      },
    })

    // Mock the submission to show developers how the error handling works!
    dialogRef.componentInstance.submitAttempt
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(() => {
        // Simulate a 1-second backend delay
        setTimeout(() => {
          // Fake a backend response complaining about a bad password
          dialogRef.componentInstance.processBackendResponse({
            success: false,
            invalidPassword: true,
            invalidTwoFactorCode: false,
          })
        }, 1000)
      })

    dialogRef.afterClosed().subscribe(() => {
      this.form.reset()
    })
  }
}
