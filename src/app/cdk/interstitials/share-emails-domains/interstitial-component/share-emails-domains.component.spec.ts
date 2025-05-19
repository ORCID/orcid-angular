import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ShareEmailsDomainsComponent } from './share-emails-domains.component'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { UserService } from 'src/app/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'

describe('ShareEmailsDomainsComponent', () => {
  let component: ShareEmailsDomainsComponent
  let fixture: ComponentFixture<ShareEmailsDomainsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareEmailsDomainsComponent],
      providers: [
        {
          provide: PlatformInfoService,
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
    fixture = TestBed.createComponent(ShareEmailsDomainsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
