import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { DeveloperToolsService } from 'src/app/core/developer-tools/developer-tools.service'
import { RecordService } from 'src/app/core/record/record.service'
import { ChangeDetectorRef } from '@angular/core'
import { UserInfoService } from 'src/app/core/user-info/user-info.service'
import { of } from 'rxjs'
import { WINDOW, WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { DeveloperToolsComponent } from './developer-tools.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DeveloperToolsComponent', () => {
  let component: DeveloperToolsComponent
  let fixture: ComponentFixture<DeveloperToolsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeveloperToolsComponent],
      providers: [
        { provide: WINDOW, useValue: {} },
        {
          provide: PlatformInfoService,
          useValue: { get: () => of({}) },
        },
        {
          provide: FormBuilder,
          useValue: {},
        },
        {
          provide: MatDialog,
          useValue: {},
        },
        {
          provide: DeveloperToolsService,
          useValue: {},
        },
        {
          provide: RecordService,
          useValue: {
            getRecord: () => of(),
          },
        },
        {
          provide: ChangeDetectorRef,
          useValue: {},
        },
        {
          provide: UserInfoService,
          useValue: {},
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(DeveloperToolsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
