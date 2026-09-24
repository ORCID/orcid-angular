import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityPasswordComponent } from './settings-security-password.component'
import { UntypedFormBuilder } from '@angular/forms'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { AUTH_CHALLENGE_HEADING_ID } from '@orcid/registry-ui'
import { Subject } from 'rxjs'

import { RecoveryPhoneChallengeService } from '../../../core/two-factor-authentication/recovery-phone-challenge.service'

describe('SettingsSecurityPasswordComponent', () => {
  let component: SettingsSecurityPasswordComponent
  let fixture: ComponentFixture<SettingsSecurityPasswordComponent>
  let recoveryPhoneChallengeService: jasmine.SpyObj<RecoveryPhoneChallengeService>

  beforeEach(async () => {
    recoveryPhoneChallengeService = jasmine.createSpyObj(
      'RecoveryPhoneChallengeService',
      ['create']
    )
    recoveryPhoneChallengeService.create.and.returnValue({
      available: true,
      codeSent: false,
      resendSeconds: 0,
      sending: false,
      used: false,
      sendCode: jasmine.createSpy('sendCode'),
      verify: jasmine.createSpy('verify'),
      dispose: jasmine.createSpy('dispose'),
    } as any)

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [SettingsSecurityPasswordComponent],
      providers: [
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        {
          provide: RecoveryPhoneChallengeService,
          useValue: recoveryPhoneChallengeService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSecurityPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('the challenge it opens when 2FA is on', () => {
    function stubChallengeDialog(): jasmine.Spy {
      const dialogRef = {
        componentInstance: {
          submitAttempt: new Subject<void>(),
          loading: true,
          processBackendResponse: jasmine.createSpy('processBackendResponse'),
        },
        afterClosed: () => new Subject<any>().asObservable(),
        close: jasmine.createSpy('close'),
      }
      return spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
        dialogRef as any
      )
    }

    it('names the account password rather than the one being chosen (R5.3)', () => {
      const open = stubChallengeDialog()

      component.openAuthChallenge()

      const config = open.calls.mostRecent().args[1] as any
      // `password` in this form is the replacement the user is typing. The
      // credential the challenge exists to prove - and the one a recovery
      // phone verify posts to the registry - is `oldPassword`.
      expect(config.data.passwordControlName).toBe('oldPassword')
      expect(component.form.contains('oldPassword')).toBeTrue()
    })

    it('names itself from the challenge heading rather than repeating it', () => {
      const open = stubChallengeDialog()

      component.openAuthChallenge()

      const config = open.calls.mostRecent().args[1] as any
      expect(config.ariaLabelledBy).toBe(AUTH_CHALLENGE_HEADING_ID)
      expect(config.ariaLabel).toBeUndefined()
    })
  })
})
