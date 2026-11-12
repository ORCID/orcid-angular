import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalEmailComponent } from './modal-email.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../window'
import { PlatformInfoService } from '../../../platform-info'
import { ErrorHandlerService } from '../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { AlertMessageComponent } from '@orcid/ui'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { of } from 'rxjs'
import { AssertionVisibilityString } from 'src/app/types'

describe('ModalEmailComponent', () => {
  let component: ModalEmailComponent
  let fixture: ComponentFixture<ModalEmailComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AlertMessageComponent,
        ReactiveFormsModule,
      ],
      declarations: [ModalEmailComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEmailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('shows duplicate feedback for a hidden-character match in the modal', () => {
    component.originalEmailsBackendCopy = []
    component.addEmail({
      value: 'user@example.org',
    } as AssertionVisibilityString)
    component.addEmail({ value: '' } as AssertionVisibilityString)
    const control = component.emailsForm.get('emailInput-1.email')
    control.setValue('USER\u200b@example.org')
    expect(control.hasError('duplicated')).toBeTrue()
    control.setValue('other@example.org')
    expect(control.hasError('duplicated')).toBeFalse()
  })

  it('checks normalized hidden-character input with the account validator', () => {
    component.originalEmailsBackendCopy = []
    const validate = spyOn(
      component._recordEmails,
      'validateRegisterValue'
    ).and.returnValue(
      of({ value: 'user@example.org', errors: ['duplicate'] } as any)
    )
    component.addEmail({ value: '' } as AssertionVisibilityString)
    const control = component.emailsForm.get('emailInput-0.email')
    control.setValue('user\u200b@example.org')
    expect(validate).toHaveBeenCalledWith({ value: 'user@example.org' })
    expect(control.hasError('backendError')).toBeTrue()
    expect(control.value).toBe('user\u200b@example.org')
    validate.and.returnValue(
      of({ value: 'other@example.org', errors: [] } as any)
    )
    control.setValue('other\u200b@example.org')
    expect(control.hasError('email')).toBeTrue()
    control.setValue('other@example.org')
    expect(control.valid).toBeTrue()
  })
})
