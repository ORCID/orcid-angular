import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { OrganizationsService, UserService } from 'src/app/core'
import { RecordAffiliationService } from 'src/app/core/record-affiliations/record-affiliations.service'
import { RecordService } from 'src/app/core/record/record.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { AffiliationsInterstitialComponent } from './affiliations-interstitial.component'
import { EMPTY, of } from 'rxjs'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { AffiliationInterstitialOrganizationService } from 'src/app/core/login-interstitials-manager/affiliation-interstitial-organization.service'
import { Organization } from 'src/app/types/common.endpoint'

describe('AffiliationsInterstitialComponent', () => {
  let component: AffiliationsInterstitialComponent
  let fixture: ComponentFixture<AffiliationsInterstitialComponent>
  let affiliationOrganization: jasmine.SpyObj<AffiliationInterstitialOrganizationService>

  const domain = { value: 'my.edu', createdDate: { timestamp: 1 } }
  const organization = { value: 'My University' } as Organization

  /**
   * The template is not rendered by these tests, so the mocks only need to
   * satisfy the component's own code. `UntypedFormBuilder` is deliberately
   * left as the real one: the interstitial reads its controls back by name.
   */
  function configure(recordService: unknown) {
    affiliationOrganization =
      jasmine.createSpyObj<AffiliationInterstitialOrganizationService>(
        'AffiliationInterstitialOrganizationService',
        ['mostRecentDomain', 'resolveFromDomains']
      )
    affiliationOrganization.mostRecentDomain.and.returnValue(domain as any)
    affiliationOrganization.resolveFromDomains.and.returnValue(of(organization))

    TestBed.configureTestingModule({
      declarations: [AffiliationsInterstitialComponent],
      providers: [
        {
          provide: PlatformInfoService,
          useValue: {
            get: () => EMPTY,
          },
        },
        { provide: RecordService, useValue: recordService },
        {
          provide: AffiliationInterstitialOrganizationService,
          useValue: affiliationOrganization,
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
  }

  const recordWithDomain = {
    getRecord: () =>
      of({
        emails: { emailDomains: [domain] },
      }),
  }

  it('should create', () => {
    configure({
      getRecord: () => ({
        pipe: () => ({
          subscribe: () => {},
        }),
      }),
    })
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('pre-selects the organization the domain resolves to', () => {
    configure(recordWithDomain)

    component.ngOnInit()

    expect(component.userDomainMatched).toEqual('my.edu')
    expect(component.organizationFromDatabase).toBe(organization)
    expect(component.rorIdHasBeenMatched).toBeTrue()
    expect(component.form).toBeDefined()
    expect(component.form.get('organization').value).toBe(organization)
  })

  // PD-13050: the form used to be built inside a stream that short-circuited
  // to EMPTY when no organization came back, so it was never built at all and
  // the interstitial rendered nothing but its spinner.
  it('still builds the form when the domain resolves to no organization', () => {
    configure(recordWithDomain)
    affiliationOrganization.resolveFromDomains.and.returnValue(of(undefined))

    component.ngOnInit()

    expect(component.form).toBeDefined()
    expect(component.organizationFromDatabase).toBeUndefined()
    expect(component.rorIdHasBeenMatched).toBeFalse()
  })

  it('builds the form once, from the first record emission carrying emails', () => {
    configure({
      getRecord: () =>
        of(
          undefined,
          { emails: undefined },
          { emails: { emailDomains: [domain] } },
          { emails: { emailDomains: [domain] } }
        ),
    })

    component.ngOnInit()
    const form = component.form

    expect(form).toBeDefined()
    expect(affiliationOrganization.resolveFromDomains).toHaveBeenCalledTimes(1)
    expect(component.form).toBe(form)
  })
})
