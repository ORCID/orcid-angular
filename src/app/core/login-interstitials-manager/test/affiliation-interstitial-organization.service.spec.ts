import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'

import { OrganizationsService } from 'src/app/core/organizations/organizations.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { AssertionVisibilityString } from 'src/app/types'
import { AffiliationInterstitialOrganizationService } from '../affiliation-interstitial-organization.service'

describe('AffiliationInterstitialOrganizationService', () => {
  let service: AffiliationInterstitialOrganizationService
  let registerService: jasmine.SpyObj<RegisterService>
  let organizationsService: jasmine.SpyObj<OrganizationsService>

  const domains = (...values: string[]): AssertionVisibilityString[] =>
    values.map(
      (value, index) =>
        ({
          value,
          createdDate: { timestamp: index },
        } as unknown as AssertionVisibilityString)
    )

  const orgDisambiguated = {
    value: 'My University',
    city: 'Bethesda',
    region: 'MD',
    country: 'US',
    sourceId: '02mpq6x41',
    disambiguatedAffiliationIdentifier: '02mpq6x41',
  }

  beforeEach(() => {
    registerService = jasmine.createSpyObj<RegisterService>('RegisterService', [
      'getEmailCategory',
    ])
    organizationsService = jasmine.createSpyObj<OrganizationsService>(
      'OrganizationsService',
      ['getOrgDisambiguated']
    )

    TestBed.configureTestingModule({
      providers: [
        AffiliationInterstitialOrganizationService,
        { provide: RegisterService, useValue: registerService },
        { provide: OrganizationsService, useValue: organizationsService },
      ],
    })

    service = TestBed.inject(AffiliationInterstitialOrganizationService)
  })

  describe('mostRecentDomain', () => {
    it('picks the domain with the newest createdDate', () => {
      expect(
        service.mostRecentDomain(domains('old.edu', 'new.edu'))?.value
      ).toEqual('new.edu')
    })

    it('returns undefined for an empty or missing list', () => {
      expect(service.mostRecentDomain([])).toBeUndefined()
      expect(service.mostRecentDomain(undefined)).toBeUndefined()
    })
  })

  describe('resolveFromDomains', () => {
    it('resolves the organization when the domain matches exactly one ROR', (done) => {
      registerService.getEmailCategory.and.returnValue(
        of({ category: 'PROFESSIONAL', rorId: '02mpq6x41' } as any)
      )
      organizationsService.getOrgDisambiguated.and.returnValue(
        of(orgDisambiguated as any)
      )

      service.resolveFromDomains(domains('my.edu')).subscribe((org) => {
        expect(organizationsService.getOrgDisambiguated).toHaveBeenCalledWith(
          'ROR',
          '02mpq6x41'
        )
        expect(org.value).toEqual('My University')
        expect(org.sourceId).toEqual('02mpq6x41')
        done()
      })
    })

    // find-category omits rorId for an unknown domain and for one matching
    // several RORs alike, which is what PD-13050 reported.
    it('emits undefined, without an org lookup, when no rorId comes back', (done) => {
      registerService.getEmailCategory.and.returnValue(
        of({ category: 'UNDEFINED' } as any)
      )

      service.resolveFromDomains(domains('unknown.edu')).subscribe((org) => {
        expect(org).toBeUndefined()
        expect(organizationsService.getOrgDisambiguated).not.toHaveBeenCalled()
        done()
      })
    })

    it('emits undefined when the ROR resolves to no organization', (done) => {
      registerService.getEmailCategory.and.returnValue(
        of({ category: 'PROFESSIONAL', rorId: '02mpq6x41' } as any)
      )
      organizationsService.getOrgDisambiguated.and.returnValue(of(null))

      service.resolveFromDomains(domains('my.edu')).subscribe((org) => {
        expect(org).toBeUndefined()
        done()
      })
    })

    it('emits undefined when the lookup fails', (done) => {
      registerService.getEmailCategory.and.returnValue(
        throwError(() => new Error('boom'))
      )

      service.resolveFromDomains(domains('my.edu')).subscribe((org) => {
        expect(org).toBeUndefined()
        done()
      })
    })

    it('emits undefined when the record has no domains', (done) => {
      service.resolveFromDomains([]).subscribe((org) => {
        expect(org).toBeUndefined()
        expect(registerService.getEmailCategory).not.toHaveBeenCalled()
        done()
      })
    })

    it('asks the backend once per domain, so eligibility and the interstitial share one answer', (done) => {
      registerService.getEmailCategory.and.returnValue(
        of({ category: 'PROFESSIONAL', rorId: '02mpq6x41' } as any)
      )
      organizationsService.getOrgDisambiguated.and.returnValue(
        of(orgDisambiguated as any)
      )

      service.resolveFromDomains(domains('my.edu')).subscribe(() => {
        service.resolveFromDomains(domains('my.edu')).subscribe((org) => {
          expect(registerService.getEmailCategory).toHaveBeenCalledTimes(1)
          expect(
            organizationsService.getOrgDisambiguated
          ).toHaveBeenCalledTimes(1)
          expect(org.value).toEqual('My University')
          done()
        })
      })
    })
  })
})
