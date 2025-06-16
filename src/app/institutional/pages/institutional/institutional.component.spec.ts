import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InstitutionalComponent } from './institutional.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('InstitutionalComponent', () => {
  let component: InstitutionalComponent
  let fixture: ComponentFixture<InstitutionalComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [InstitutionalComponent],
      providers: [
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
    fixture = TestBed.createComponent(InstitutionalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
