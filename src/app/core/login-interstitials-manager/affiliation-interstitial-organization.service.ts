import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import {
  catchError,
  defaultIfEmpty,
  first,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators'

import { affiliationToOrganization } from 'src/app/constants'
import { OrganizationsService } from 'src/app/core/organizations/organizations.service'
import { RegisterService } from 'src/app/core/register/register.service'
import { Organization } from 'src/app/types/common.endpoint'
import { AssertionVisibilityString } from 'src/app/types'

/**
 * Resolves the single organization an email domain stands for.
 *
 * Both the affiliation interstitial's eligibility check and the interstitial
 * itself need this answer, and they have to agree: if they disagreed the user
 * would be shown an interstitial that then has nothing to offer. Keeping the
 * lookup — and the choice of which domain to look up — in one place is what
 * makes them agree.
 */
@Injectable({
  providedIn: 'root',
})
export class AffiliationInterstitialOrganizationService {
  private readonly byDomain = new Map<
    string,
    Observable<Organization | undefined>
  >()

  constructor(
    private registerService: RegisterService,
    private organizationsService: OrganizationsService
  ) {}

  /**
   * The interstitial only ever speaks about one domain: the most recently
   * added one.
   */
  mostRecentDomain(
    domains: AssertionVisibilityString[] | undefined
  ): AssertionVisibilityString | undefined {
    if (!Array.isArray(domains) || domains.length === 0) {
      return undefined
    }
    return domains
      .slice()
      .sort(
        (a, b) =>
          (b.createdDate?.timestamp ?? 0) - (a.createdDate?.timestamp ?? 0)
      )[0]
  }

  resolveFromDomains(
    domains: AssertionVisibilityString[] | undefined
  ): Observable<Organization | undefined> {
    const domain = this.mostRecentDomain(domains)
    return domain?.value ? this.resolve(domain.value) : of(undefined)
  }

  /**
   * Emits the organization the domain maps to, or `undefined` when there
   * isn't exactly one.
   *
   * `email-domain/find-category` returns a `rorId` only for a domain that
   * matches a single ROR. An unknown domain and a domain matching several
   * both come back without one, so every "nothing to offer here" case —
   * no domain, no ROR, several RORs, a ROR that resolves to no org, a failed
   * lookup — reaches the caller the same way, as `undefined`.
   *
   * Cached per domain: the eligibility check and the interstitial ask the
   * same question within one page view, and the second ask should not cost
   * two more round trips.
   */
  resolve(domain: string): Observable<Organization | undefined> {
    if (!this.byDomain.has(domain)) {
      this.byDomain.set(
        domain,
        this.request(domain).pipe(
          shareReplay({ bufferSize: 1, refCount: false })
        )
      )
    }
    return this.byDomain.get(domain)
  }

  private request(domain: string): Observable<Organization | undefined> {
    return this.registerService.getEmailCategory(domain).pipe(
      first(),
      switchMap((category) =>
        category?.rorId
          ? this.organizationsService
              .getOrgDisambiguated('ROR', category.rorId)
              .pipe(first())
          : of(undefined)
      ),
      map((org) => (org ? affiliationToOrganization(org) : undefined)),
      defaultIfEmpty(undefined),
      catchError(() => of(undefined))
    )
  }
}
