import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core'
import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { By } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { OrcidStepViewComponent } from '@orcid/ui'
import { Subject, of } from 'rxjs'

import { RecoveryPhoneComponent } from './recovery-phone.component'
import { RecoveryPhoneFormComponent } from '../../../cdk/recovery-phone-form/recovery-phone-form.component'
import { ApplicationRoutes } from '../../../constants'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { RECOVERY_PHONE_ELEVATION_TTL_MILLIS } from '../../../core/two-factor-authentication/recovery-phone-elevation'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { Status } from '../../../types/two-factor.endpoint'

describe('RecoveryPhoneComponent', () => {
  let component: RecoveryPhoneComponent
  let fixture: ComponentFixture<RecoveryPhoneComponent>
  let twoFactorService: jasmine.SpyObj<TwoFactorAuthenticationService>
  let togglzService: jasmine.SpyObj<TogglzService>
  let dialog: jasmine.SpyObj<MatDialog>
  let router: Router

  // Stands in for the auth challenge dialog the page opens on load
  let submitAttempt: EventEmitter<void>
  let cancelAttempt: EventEmitter<void>
  let afterClosed: Subject<boolean>
  let dialogInstance: any
  let dialogRef: any

  const status = (overrides: Partial<Status> = {}): Status =>
    ({ enabled: true, ...overrides } as Status)

  function build(flagEnabled = true, statusValue: Status = status()) {
    togglzService.getStateOf.and.returnValue(of(flagEnabled))
    twoFactorService.checkState.and.returnValue(of(statusValue))
    fixture = TestBed.createComponent(RecoveryPhoneComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  /** Drives the challenge dialog to a pass, which is what unlocks the form. */
  function passChallenge() {
    twoFactorService.verifyRecoveryPhoneChallenge.and.returnValue(
      of({ success: true } as any)
    )
    submitAttempt.emit()
    afterClosed.next(true)
    fixture.detectChanges()
  }

  /** The form the page hosts, once the status call has let it render. */
  function hostedForm(): RecoveryPhoneFormComponent {
    const form = component.recoveryPhoneForm
    expect(form).withContext('the form should be rendered').toBeTruthy()
    return form as RecoveryPhoneFormComponent
  }

  beforeEach(async () => {
    submitAttempt = new EventEmitter<void>()
    cancelAttempt = new EventEmitter<void>()
    afterClosed = new Subject<boolean>()
    dialogInstance = {
      submitAttempt,
      cancelAttempt,
      loading: false,
      processBackendResponse: jasmine.createSpy('processBackendResponse'),
    }
    dialogRef = {
      componentInstance: dialogInstance,
      afterClosed: () => afterClosed.asObservable(),
      close: jasmine.createSpy('close').and.callFake((value?: boolean) => {
        afterClosed.next(!!value)
      }),
    } as unknown as MatDialogRef<any>

    twoFactorService = jasmine.createSpyObj('TwoFactorAuthenticationService', [
      'checkState',
      'verifyRecoveryPhoneChallenge',
      'sendRecoveryPhoneCode',
      'saveRecoveryPhone',
    ])
    togglzService = jasmine.createSpyObj('TogglzService', ['getStateOf'])
    dialog = jasmine.createSpyObj('MatDialog', ['open'])
    dialog.open.and.returnValue(dialogRef)

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatIconModule,
        OrcidStepViewComponent,
        RecoveryPhoneFormComponent,
      ],
      declarations: [RecoveryPhoneComponent],
      providers: [
        { provide: TwoFactorAuthenticationService, useValue: twoFactorService },
        { provide: TogglzService, useValue: togglzService },
        { provide: MatDialog, useValue: dialog },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    router = TestBed.inject(Router)
    spyOn(router, 'navigate')
  })

  it('sends the user back to account settings when the feature is off', () => {
    build(false)

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ fragment: '2FA' })
    )
    expect(dialog.open).not.toHaveBeenCalled()
  })

  it('sends the user back when 2FA is not enabled', () => {
    build(true, status({ enabled: false }))

    expect(router.navigate).toHaveBeenCalled()
    expect(dialog.open).not.toHaveBeenCalled()
  })

  it('asks for the authentication challenge before anything else', () => {
    build()

    expect(dialog.open).toHaveBeenCalled()
    expect(component.title).toBe('Add a recovery phone number')
  })

  it('names the challenge dialog and marks it modal', () => {
    build()

    const config = dialog.open.calls.mostRecent().args[1] as any
    expect(config.ariaModal).toBeTrue()
    expect(config.ariaLabel).toBe('Add a recovery phone number')
    expect(config.disableClose).toBeTrue()
  })

  it('treats an existing number as a change rather than an addition', () => {
    build(true, status({ maskedRecoveryPhoneNumber: '***********1234' }))

    expect(component.managingExistingNumber).toBeTrue()
    expect(component.title).toBe('Manage your recovery phone number')
    expect(component.primaryLabel).toBe('Update recovery phone number')
    expect(component.maskedRecoveryPhoneNumber).toBe('***********1234')
  })

  it('tells the form it is running in account settings', () => {
    build(true, status({ maskedRecoveryPhoneNumber: '***********1234' }))

    expect(hostedForm().context).toBe('SETTINGS')
    expect(hostedForm().managingExistingNumber).toBeTrue()
    expect(hostedForm().maskedRecoveryPhoneNumber).toBe('***********1234')
  })

  it('leaves the page when the challenge is cancelled', () => {
    build()
    ;(router.navigate as jasmine.Spy).calls.reset()

    afterClosed.next(false)

    expect(router.navigate).toHaveBeenCalled()
  })

  it('reports a failed challenge back into the dialog', () => {
    build()
    twoFactorService.verifyRecoveryPhoneChallenge.and.returnValue(
      of({ success: false, invalidPassword: true } as any)
    )

    submitAttempt.emit()

    expect(dialogInstance.processBackendResponse).toHaveBeenCalled()
    expect(dialogRef.close).not.toHaveBeenCalledWith(true)
  })

  it('keeps the primary button dead until a code has been sent', () => {
    build()
    passChallenge()

    const primary = fixture.debugElement.query(
      By.css('#cy-step-view-primary-action')
    )
    expect(primary.nativeElement.disabled).toBeTrue()
  })

  it('hands its primary button to the form', () => {
    build()
    passChallenge()
    const form = hostedForm()
    spyOn(form, 'save')
    component.codeSent = true
    fixture.detectChanges()

    const primary = fixture.debugElement.query(
      By.css('#cy-step-view-primary-action')
    )
    expect(primary.nativeElement.disabled).toBeFalse()
    primary.nativeElement.click()

    expect(form.save).toHaveBeenCalled()
  })

  it('goes back to account settings, reporting nothing, when the registry says the elevation ran out (PD-13638)', () => {
    build()
    passChallenge()
    dialog.open.calls.reset()
    ;(router.navigate as jasmine.Spy).calls.reset()

    hostedForm().challengeRequired.emit()

    // This page used to ask its challenge again. Asking a second time without
    // being invited is a re-prompt, and the exit is the one Cancel already
    // takes: back to the panel, with nothing said, because nothing happened.
    expect(dialog.open).not.toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: {}, fragment: '2FA' })
    )
  })

  it('returns with the added outcome after a first number is stored', () => {
    build()
    passChallenge()
    ;(router.navigate as jasmine.Spy).calls.reset()

    hostedForm().saved.emit({
      success: true,
      maskedRecoveryPhoneNumber: '***********1234',
    })

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: { recoveryPhone: 'added' } })
    )
  })

  it('returns with the updated outcome after a number is changed', () => {
    build(true, status({ maskedRecoveryPhoneNumber: '***********1234' }))
    passChallenge()
    ;(router.navigate as jasmine.Spy).calls.reset()

    hostedForm().saved.emit({ success: true })

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: { recoveryPhone: 'updated' } })
    )
  })

  it('returns with the failed outcome when the form gives up', () => {
    build()
    passChallenge()
    ;(router.navigate as jasmine.Spy).calls.reset()

    hostedForm().failed.emit('HTTP')

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: { recoveryPhone: 'failed' } })
    )
  })

  it('leaves without saving anything when cancelled', () => {
    build()
    passChallenge()
    ;(router.navigate as jasmine.Spy).calls.reset()

    component.cancel()

    expect(twoFactorService.saveRecoveryPhone).not.toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: {} })
    )
  })

  /*
   * The clock, rather than the registry, reaching the end of the window.
   *
   * These drive the component directly rather than through a rendered
   * fixture: the page renders the real recovery phone form, whose phone field
   * lazily imports its formatting utilities, and a dynamic import inside
   * fakeAsync never settles.
   */
  describe('when the elevation window runs out on its own', () => {
    const TTL = RECOVERY_PHONE_ELEVATION_TTL_MILLIS

    function pageOnItsOwn() {
      togglzService.getStateOf.and.returnValue(of(true))
      twoFactorService.checkState.and.returnValue(of(status()))
      fixture = TestBed.createComponent(RecoveryPhoneComponent)
      component = fixture.componentInstance
      component.ngOnInit()
    }

    /** The pass, without the render the helper above performs. */
    function passChallengeOnly() {
      twoFactorService.verifyRecoveryPhoneChallenge.and.returnValue(
        of({ success: true } as any)
      )
      submitAttempt.emit()
      afterClosed.next(true)
    }

    it('returns to account settings eight minutes after the challenge passed', fakeAsync(() => {
      pageOnItsOwn()
      passChallengeOnly()
      ;(router.navigate as jasmine.Spy).calls.reset()

      tick(TTL - 1)
      expect(router.navigate).not.toHaveBeenCalled()

      tick(1)
      expect(router.navigate).toHaveBeenCalledWith(
        [ApplicationRoutes.account],
        jasmine.objectContaining({ queryParams: {}, fragment: '2FA' })
      )
      expect(twoFactorService.saveRecoveryPhone).not.toHaveBeenCalled()
    }))

    it('does not start the clock until the challenge passes', fakeAsync(() => {
      pageOnItsOwn()
      ;(router.navigate as jasmine.Spy).calls.reset()

      // Two minutes spent on the challenge itself buy no part of the window:
      // the registry grants it when the challenge is accepted, not when the
      // page was opened.
      tick(2 * 60 * 1000)
      passChallengeOnly()
      ;(router.navigate as jasmine.Spy).calls.reset()

      tick(TTL - 1)
      expect(router.navigate).not.toHaveBeenCalled()

      tick(1)
      expect(router.navigate).toHaveBeenCalled()
    }))

    it('lets a save already on the wire answer first', fakeAsync(() => {
      pageOnItsOwn()
      passChallengeOnly()
      component.recoveryPhoneForm = {
        saving: true,
      } as RecoveryPhoneFormComponent
      ;(router.navigate as jasmine.Spy).calls.reset()

      tick(TTL)

      expect(router.navigate).not.toHaveBeenCalled()
    }))

    it('drops the clock when the page is gone', fakeAsync(() => {
      pageOnItsOwn()
      passChallengeOnly()
      ;(router.navigate as jasmine.Spy).calls.reset()

      component.ngOnDestroy()
      tick(TTL)

      expect(router.navigate).not.toHaveBeenCalled()
      discardPeriodicTasks()
    }))
  })
})
