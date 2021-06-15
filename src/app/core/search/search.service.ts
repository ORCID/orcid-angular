import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { SearchParameters, SearchResults } from 'src/app/types'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { catchError } from 'rxjs/operators'
import { ORCID_REGEXP } from 'src/app/constants'

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

  search(queryParam: SearchParameters): Observable<SearchResults> {
    return this._http
      .get<SearchResults>(
        `${environment.API_PUB}/expanded-search/${this.buildSearchUrl(
          queryParam
        )}`,
        {
          headers: { Accept: 'application/json' },
        }
      )
      .pipe(catchError((error) => this._errorHandler.handleError(error)))
  }

  public buildSearchUrl(queryParam: SearchParameters): string {
    const escapedParams: SearchParameters = {}
    Object.keys(queryParam).map((key) => {
      escapedParams[key] = this.escapeReservedChar(queryParam[key])
    })

    const orcidId =
      this.extractOrcidId(escapedParams.orcid) ||
      this.extractOrcidId(escapedParams.searchQuery)

    if (escapedParams && orcidId) {
      // When there is an Orcid id on the `Advance search Orcid iD` or `Quick search input`: only search the orcid ID
      return this.encodeUrlWithPagination(`orcid:${orcidId}`, queryParam)
    } else if (escapedParams && escapedParams.searchQuery) {
      // When there is a `searchQuery` parameter with no Orcid iD:  do a quick search
      return this.encodeUrlWithPagination(
        this.quickSearchEDisMax + escapedParams.searchQuery,
        queryParam
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
        } else {
          searchParameters.push(
            `affiliation-org-name:${escapedParams.institution}`
          )
        }
      }
      return this.setEdismaxAndEncodedUrlWithPagination(
        searchParameters.join(' AND '),
        queryParam
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
    const regexResult = ORCID_REGEXP.exec(string)
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

  private setEdismaxAndEncodedUrlWithPagination(searchStream, queryParam) {
    const bq = encodeURIComponent(
      `current-institution-affiliation-name:[* TO *]^100.0 past-institution-affiliation-name:[* TO *]^70`
    )
    return (
      `?bq=` +
      bq +
      `&defType=edismax&q=${encodeURIComponent(searchStream)}` +
      this.handlePagination(queryParam)
    )
  }

  private encodeUrlWithPagination(searchStream, queryParam) {
    return (
      `?q=${encodeURIComponent(searchStream)}` +
      this.handlePagination(queryParam)
    )
  }

  private handlePagination(queryParam: SearchParameters): string {
    return `&start=${queryParam.pageIndex * queryParam.pageSize || 0}&rows=${
      queryParam.pageSize || 50
    }`
  }
}
