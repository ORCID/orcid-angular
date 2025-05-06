import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { PlatformInfoService } from '../../platform-info'
import { WINDOW_PROVIDERS } from '../../window'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { OrganizationsService, UserService } from 'src/app/core'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordService } from 'src/app/core/record/record.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { AffiliationsInterstitialComponent } from './affiliations-interstitial.component'
import { EMPTY } from 'rxjs'

describe('AffiliationsInterstitialComponent', () => {
  let component: AffiliationsInterstitialComponent
  let fixture: ComponentFixture<AffiliationsInterstitialComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliationsInterstitialComponent],
      providers: [
        {
          provide: PlatformInfoService,
          useValue: {
            get: () => EMPTY,
          },
        },
        {
          provide: RecordService,
          useValue: {
            getRecord: () => ({
              pipe: () => ({
                subscribe: () => {},
              }),
            }),
          },
        },

        {
          provide: RegisterService,
          useValue: {},
        },

        {
          provide: OrganizationsService,
          useValue: {},
        },
        {
          provide: RecordAffiliationService,
          useValue: {},
        },
        {
          provide: FormBuilder,
          useValue: {
            array: () => [new FormControl({})],
            group: () => new FormGroup({}),
          },
        },
        {
          provide: RecordEmailsService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {
            getUserSession: () => ({
              pipe: () => ({
                subscribe: () => {},
              }),
            }),
          },
        },
        WINDOW_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(AffiliationsInterstitialComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
