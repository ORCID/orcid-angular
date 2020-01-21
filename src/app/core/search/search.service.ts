import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor() {}

  search(
    value?: string,
    firstName?: string,
    FamilyName?: string,
    Institution?: string,
    Keyword?: string,
    orcid?: string
  ) {
    const searchString =
      // tslint:disable-next-line: max-line-length
      '{!edismax qf="given-and-family-names^50.0 family-name^10.0 given-names^5.0 credit-name^10.0 other-names^5.0 text^1.0" pf="given-and-family-names^50.0" mm=1}'
  }
}
