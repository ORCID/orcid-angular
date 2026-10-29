import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ShareEmailsDomainsComponent } from './share-emails-domains.component'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { UserService } from 'src/app/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { RecordService } from 'src/app/core/record/record.service'
import { of } from 'rxjs'

describe('ShareEmailsDomainsComponent', () => {
  let component: ShareEmailsDomainsComponent
  let fixture: ComponentFixture<ShareEmailsDomainsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareEmailsDomainsComponent],
      imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatDividerModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: PlatformInfoService,
          useValue: {},
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
        {
          provide: RecordService,
          useValue: {
            // The component only builds its form once a record carrying
            // emailDomains arrives, so an empty record leaves `form` undefined
            // and `[formGroup]` with nothing to bind to.
            getRecord: () =>
              of({
                emails: {
                  emailDomains: [
                    {
                      value: 'example.org',
                      visibility: 'PRIVATE',
                      createdDate: { timestamp: 1 },
                    },
                  ],
                },
              }),
          },
        },
        WINDOW_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    fixture = TestBed.createComponent(ShareEmailsDomainsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
