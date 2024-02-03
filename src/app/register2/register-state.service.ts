import { Injectable } from '@angular/core'
import { OrganizationsService } from '../core'
import { Organization } from 'src/app/types/record-affiliation.endpoint'
import { Subject } from 'rxjs'
import { OrgDisambiguated } from '../types'
@Injectable({
  providedIn: 'root',
})
export class RegisterStateService {
  rorIdHasBeenMatched: boolean = false
  matchOrganization$ = new Subject<string | Organization>()
  primaryEmailMatched: Organization
  secondaryEmail: Organization
  constructor(private _organizationsService: OrganizationsService) {}

  setRorAffiliationFound(affiliationFound: string, additionalEmail = false) {
    if (!!affiliationFound) {
      this._organizationsService
        .getOrgDisambiguated('ROR', affiliationFound)
        .subscribe((affiliation) => {
          this.rorIdHasBeenMatched = true
          if (!additionalEmail) {
            this.primaryEmailMatched =
              this.affiliationToOrganization(affiliation)
          } else {
            this.secondaryEmail = this.affiliationToOrganization(affiliation)
          }

          this.updateTheAffiliationMatch()
        })
    } else {
      if (!additionalEmail) {
        this.primaryEmailMatched = null
      } else {
        this.secondaryEmail = null
      }
      this.updateTheAffiliationMatch()
    }
  }

  private affiliationToOrganization(
    affiliation: OrgDisambiguated
  ): Organization {
    return {
      value: affiliation.value,
      city: affiliation.city,
      region: affiliation.region,
      country: affiliation.country,
      disambiguatedAffiliationIdentifier:
        affiliation.disambiguatedAffiliationIdentifier,
      sourceId: affiliation.sourceId,
    } as Organization
  }

  private updateTheAffiliationMatch() {
    if (this.primaryEmailMatched) {
      this.rorIdHasBeenMatched = true
      this.matchOrganization$.next(this.primaryEmailMatched)
    } else if (this.secondaryEmail) {
      this.rorIdHasBeenMatched = true
      this.matchOrganization$.next(this.secondaryEmail)
    } else {
      this.rorIdHasBeenMatched = false
      this.matchOrganization$.next('')
    }
  }
}
