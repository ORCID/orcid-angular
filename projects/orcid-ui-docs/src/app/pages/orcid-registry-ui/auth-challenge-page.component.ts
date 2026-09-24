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
import {
  AUTH_CHALLENGE_HEADING_ID,
  AuthChallengeComponent,
  AuthChallengeRecoveryPhone,
  AuthChallengeRecoveryPhoneVerification,
} from '@orcid/registry-ui'
import '@angular/localize/init'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'
import { MatDialog } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { Observable, Subscription, timer } from 'rxjs'
import { map, take, takeUntil } from 'rxjs/operators'

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
  offerRecoveryPhone = false
  actionDescription = 'to perform this action on'
  boldText = 'Example Account'
  trailingText = 'to continue.'
  form: UntypedFormGroup

  constructor(private _fb: UntypedFormBuilder, private _dialog: MatDialog) {}

  ngOnInit() {
    this.form = this._fb.group({
      twoFactorCode: [null, [Validators.minLength(6), Validators.maxLength(6)]],
      twoFactorRecoveryCode: [
        null,
        [Validators.minLength(10), Validators.maxLength(10)],
      ],
      twoFactorRecoveryPhoneCode: [
        null,
        [Validators.minLength(6), Validators.maxLength(6)],
      ],
      password: [null, Validators.required],
    })
  }

  /**
   * A stand-in for what the application hands the component: the registry is
   * not here, so sending is instant, 123456 is the code that works and 000000
   * stands in for the password having been wrong - which the registry decides
   * before it ever looks at the code.
   */
  private buildRecoveryPhone(): AuthChallengeRecoveryPhone {
    // Everything this one challenge has running, emptied by `dispose()`
    const running = new Subscription()

    const recoveryPhone: AuthChallengeRecoveryPhone = {
      available: true,
      maskedNumber: '***********1234',
      codeSent: false,
      resendSeconds: 0,
      sending: false,
      errorCode: undefined,
      used: false,
      sendCode: () => {
        recoveryPhone.sending = true
        running.add(
          timer(400).subscribe(() => {
            recoveryPhone.sending = false
            recoveryPhone.codeSent = true
            recoveryPhone.resendSeconds = 30
            // `take` bounds the countdown so the demo leaves nothing ticking
            running.add(
              timer(1000, 1000)
                .pipe(take(30))
                .subscribe(() => {
                  recoveryPhone.resendSeconds = Math.max(
                    0,
                    recoveryPhone.resendSeconds - 1
                  )
                })
            )
          })
        )
      },
      verify: (
        _password: string,
        code: string
      ): Observable<AuthChallengeRecoveryPhoneVerification> =>
        timer(600).pipe(
          map(() => {
            if (code === '000000') {
              return 'invalidPassword'
            }
            return code === '123456' ? 'passed' : 'invalidCode'
          })
        ),
      dispose: () => running.unsubscribe(),
    }
    return recoveryPhone
  }

  openDialog() {
    const recoveryPhone = this.offerRecoveryPhone
      ? this.buildRecoveryPhone()
      : undefined

    const dialogRef = this._dialog.open(AuthChallengeComponent, {
      // Named from the challenge's own heading rather than from a second copy
      // of that sentence here
      ariaLabelledBy: AUTH_CHALLENGE_HEADING_ID,
      data: {
        parentForm: this.form,
        actionDescription: this.actionDescription,
        boldText: this.boldText,
        trailingText: this.trailingText,
        showPasswordField: this.showPasswordField,
        showTwoFactorField: this.showTwoFactorField,
        // Which control holds the *account* password. Required before the
        // recovery phone option is offered to a challenge that does not
        // collect the password itself.
        passwordControlName: 'password',
        recoveryPhone,
      },
    })

    // Mock the submission to show developers how the error handling works!
    dialogRef.componentInstance.submitAttempt
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(() => {
        if (recoveryPhone?.used) {
          // The recovery phone number code has already answered the challenge
          // and turned 2FA off, so the guarded action simply proceeds.
          dialogRef.close(true)
          return
        }
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

    dialogRef.componentInstance.cancelAttempt
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(() => {
        dialogRef.close()
      })

    dialogRef.afterClosed().subscribe(() => {
      this.form.reset()
    })
  }
}
