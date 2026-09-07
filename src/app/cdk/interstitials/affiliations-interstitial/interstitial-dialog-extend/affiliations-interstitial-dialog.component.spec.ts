import { TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { EMPTY, of } from 'rxjs'

import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { AffiliationInterstitialOrganizationService } from 'src/app/core/login-interstitials-manager/affiliation-interstitial-organization.service'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordService } from 'src/app/core/record/record.service'
import { Organization } from 'src/app/types/common.endpoint'
import { AffiliationsInterstitialDialogComponent } from './affiliations-interstitial-dialog.component'

describe('AffiliationsInterstitialDialogComponent', () => {
  let component: AffiliationsInterstitialDialogComponent
  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>
  let affiliationOrganization: jasmine.SpyObj<AffiliationInterstitialOrganizationService>

  const domain = { value: 'my.edu', createdDate: { timestamp: 1 } }
  const organization = { value: 'My University' } as Organization

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<any>>('MatDialogRef', [
      'close',
    ])
    affiliationOrganization =
      jasmine.createSpyObj<AffiliationInterstitialOrganizationService>(
        'AffiliationInterstitialOrganizationService',
        ['mostRecentDomain', 'resolveFromDomains']
      )
    affiliationOrganization.mostRecentDomain.and.returnValue(domain as any)
    affiliationOrganization.resolveFromDomains.and.returnValue(of(organization))

    TestBed.configureTestingModule({
      declarations: [AffiliationsInterstitialDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: PlatformInfoService, useValue: { get: () => EMPTY } },
        {
          provide: RecordService,
          useValue: {
            getRecord: () => of({ emails: { emailDomains: [domain] } }),
          },
        },
        {
          provide: AffiliationInterstitialOrganizationService,
          useValue: affiliationOrganization,
        },
        { provide: RecordAffiliationService, useValue: {} },
        {
          provide: UserService,
          useValue: {
            getUserSession: () => ({
              pipe: () => ({ subscribe: () => {} }),
            }),
          },
        },
        WINDOW_PROVIDERS,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })

    component = TestBed.createComponent(
      AffiliationsInterstitialDialogComponent
    ).componentInstance
  })

  // The subclass forwards a fixed argument list to the base constructor, so
  // it only keeps working as long as the two agree.
  it('constructs and inherits the base resolution', () => {
    component.ngOnInit()

    expect(component.userDomainMatched).toEqual('my.edu')
    expect(component.organizationFromDatabase).toBe(organization)
    expect(component.form).toBeDefined()
  })

  it('closes the dialog instead of emitting finish', () => {
    component.finishIntertsitial()

    expect(dialogRef.close).toHaveBeenCalledWith({
      type: 'affiliation-interstitial',
      addedAffiliation: undefined,
    })
  })
})
