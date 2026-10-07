import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { SearchParameters, SearchResults } from 'src/app/types'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { catchError, delay, map } from 'rxjs/operators'
import {
  DEFAULT_PAGE_SIZE,
  ORCID_REGEXP_CASE_INSENSITIVE,
} from 'src/app/constants'
import { debug } from 'console'

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  quickSearchEDisMax =
    // tslint:disable-next-line: max-line-length
    '{!edismax qf="given-and-family-names^50.0 family-name^10.0 given-names^10.0 credit-name^10.0 other-names^5.0 text^1.0" pf="given-and-family-names^50.0" bq="current-institution-affiliation-name:[* TO *]^100.0 past-institution-affiliation-name:[* TO *]^70" mm=1}'

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  search(querryParam: SearchParameters): Observable<SearchResults> {
    return this._http
      .get<SearchResults>(
        `${runtimeEnvironment.API_PUB}/expanded-search/${this.buildSearchUrl(
          querryParam
        )}`,
        {
          headers: { Accept: 'application/json' },
        }
      )
      .pipe(
        catchError((error) => this._errorHandler.handleError(error)),
        map((x) => {
          x['expanded-result'] = x['expanded-result']?.map((element) => {
            if (!element['given-names'] && !element['family-names']) {
              element[
                'given-names'
              ] = $localize`:@@account.nameIsPri:Name is private`
            }

            return element
          })
          return x
        })
      )
  }

  private buildSearchUrl(querryParam: SearchParameters): string {
    const escapedParams: SearchParameters = {}
    Object.keys(querryParam).map((key) => {
      if (typeof querryParam[key] === 'string') {
        escapedParams[key] = this.escapeReservedChar(querryParam[key])
      }
    })

    const orcidId =
      this.extractOrcidId(escapedParams.orcid) ||
      this.extractOrcidId(escapedParams.searchQuery)

    if (escapedParams && orcidId) {
      // When there is an Orcid id on the `Advance search Orcid iD` or `Quick search input`: only search the orcid ID
      return this.encodeUrlWithPagination(`orcid:${orcidId}`, querryParam)
    } else if (escapedParams && escapedParams.searchQuery) {
      // When there is a `searchQuery` parameter with no Orcid iD:  do a quick search
      return this.encodeUrlWithPagination(
        this.quickSearchEDisMax + escapedParams.searchQuery,
        querryParam
      )
    } else if (escapedParams) {
      // otherwise do an advanced search
      const searchParameters = []
      if (escapedParams.firstName) {
        let searchValue = `given-names:${escapedParams.firstName}`
        if (escapedParams.otherFields === 'true') {
          searchValue += ` OR other-names:${escapedParams.firstName}`
        }
        searchParameters.push(`(${searchValue})`)
      }
      if (escapedParams.lastName) {
        let searchValue = `family-name:${escapedParams.lastName}`
        if (escapedParams.otherFields === 'true') {
          searchValue += ` OR other-names:${escapedParams.lastName}`
        }
        searchParameters.push(`(${searchValue})`)
      }
      if (escapedParams.keyword) {
        searchParameters.push(`keyword:${escapedParams.keyword}`)
      }
      if (escapedParams.institution) {
        // if all chars are numbers, assume it's a ringgold id
        if (escapedParams.institution.match(/^[0-9]*$/)) {
          searchParameters.push(`ringgold-org-id:${escapedParams.institution}`)
        } else if (escapedParams.institution.startsWith('grid.')) {
          searchParameters.push(`grid-org-id:${escapedParams.institution}`)
        }
        //if starts with http, assume it's a ror id
        else if (escapedParams.institution.startsWith('http')) {
          searchParameters.push(`ror-org-id:${escapedParams.institution}`)
        } else {
          searchParameters.push(
            `affiliation-org-name:${escapedParams.institution}`
          )
        }
      }
      return this.setEdismaxAndEncodedUrlWithPagination(
        searchParameters.join(' AND '),
        querryParam
      )
    }
  }

  private escapeReservedChar(inputText: any) {
    // escape all reserved chars except double quotes
    // per https://lucene.apache.org/solr/guide/6_6/the-standard-query-parser.html#TheStandardQueryParser-EscapingSpecialCharacters
    const escapedText = inputText.replace(/([!^&*()+=\[\]\\/{}|:?~])/g, '\\$1')
    return escapedText.toLowerCase().trim()
  }

  private extractOrcidId(string: any) {
    const regexResult = ORCID_REGEXP_CASE_INSENSITIVE.exec(string)
    if (regexResult) {
      return regexResult[0].toUpperCase()
    }
    return null
  }

  // Remove empty values, trim strings and remove false parameters
  searchParametersAdapter(value: SearchParameters) {
    const trimParameters = {}
    Object.keys(value).forEach((element) => {
      if (typeof value[element] === 'string') {
        if (value[element].trim() && value[element] !== 'false') {
          trimParameters[element] = value[element].trim()
        }
      } else if (value[element]) {
        trimParameters[element] = value[element]
      }
    })
    return trimParameters
  }

  private setEdismaxAndEncodedUrlWithPagination(searchStream, querryParam) {
    const bq = encodeURIComponent(
      `current-institution-affiliation-name:[* TO *]^100.0 past-institution-affiliation-name:[* TO *]^70`
    )
    return (
      `?bq=` +
      bq +
      `&defType=edismax&q=${encodeURIComponent(searchStream)}` +
      this.handlePagination(querryParam)
    )
  }

  private encodeUrlWithPagination(searchStream, querryParam) {
    return (
      `?q=${encodeURIComponent(searchStream)}` +
      this.handlePagination(querryParam)
    )
  }

  private handlePagination(querryParam: SearchParameters): string {
    return `&start=${querryParam.pageIndex * querryParam.pageSize || 0}&rows=${
      querryParam.pageSize || DEFAULT_PAGE_SIZE
    }`
  }
}
