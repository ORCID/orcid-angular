import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsDefaultsEmailFrequencyComponent } from './settings-defaults-email-frequency.component'
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { UntypedFormBuilder } from '@angular/forms'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { UserInfoService } from 'src/app/core/user-info/user-info.service'
import { RecordService } from 'src/app/core/record/record.service'
import { of } from 'rxjs'

describe('SettingsDefaultsEmailFrequencyComponent', () => {
  let component: SettingsDefaultsEmailFrequencyComponent
  let fixture: ComponentFixture<SettingsDefaultsEmailFrequencyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatLegacyDialogModule,
      ],
      declarations: [SettingsDefaultsEmailFrequencyComponent],
      providers: [
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
        {
          provide: RecordService,
          useValue: {
            getRecord: () => of({}),
          },
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDefaultsEmailFrequencyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
