import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalCombineWorksComponent } from './modal-combine-works.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ModalCombineWorksComponent', () => {
  let component: ModalCombineWorksComponent
  let fixture: ComponentFixture<ModalCombineWorksComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ModalCombineWorksComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        WINDOW_PROVIDERS,
        PlatformInfoService,
        RecordWorksService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCombineWorksComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
