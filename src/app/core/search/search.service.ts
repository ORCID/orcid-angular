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
  quickSearchEDisMax = encodeURIComponent(
    // tslint:disable-next-line: max-line-length
    '{!edismax qf="given-and-family-names^50.0 family-name^10.0 given-names^5.0 credit-name^10.0 other-names^5.0 text^1.0" pf="given-and-family-names^50.0" mm=1}'
  )

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  search(querryParam: SearchParameters): Observable<SearchResults> {
    return this._http
      .get<SearchResults>(
        `${environment.API_PUB}/expanded-search/${this.buildSearchUrl(
          querryParam
        )}`,
        {
          headers: { Accept: 'application/json' },
        }
      )
      .pipe(catchError(this._errorHandler.handleError))
  }

  buildSearchUrl(querryParam: SearchParameters): string {
    const escapedParams: SearchParameters = {}
    Object.keys(querryParam).map(key => {
      escapedParams[key] = this.escapeReservedChar(querryParam[key])
    })

    const orcidId =
      this.extractOrcidId(escapedParams.orcid) ||
      this.extractOrcidId(escapedParams.searchQuery)

    if (escapedParams && orcidId) {
      // When there is an Orcid id on the "Advance search Orcid iD" or "Quick search input" only: search the orcid ID
      return this.encodeAndAddPagination(`orcid:${orcidId}`, querryParam)
    } else if (escapedParams && escapedParams.searchQuery) {
      // When there is a searchQuery parameter with no Orcid iD:  do a quick search

      return this.encodeAndAddPagination(
        this.quickSearchEDisMax + escapedParams.searchQuery,
        querryParam
      )
    } else if (escapedParams) {
      // otherwise do an advance search
      const searchParameters = []
      if (escapedParams.firstName) {
        let searchValue = `given-names:${escapedParams.firstName}`
        if (escapedParams.otherFields === 'true') {
          searchValue += ` OR other-names:${escapedParams.firstName}`
        }
        searchParameters.push(searchValue)
      }
      if (escapedParams.lastName) {
        searchParameters.push(`family-name:${escapedParams.lastName}`)
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
      return this.encodeAndAddPagination(
        searchParameters.join(' AND '),
        querryParam
      )
    }
  }

  escapeReservedChar(inputText: any) {
    // escape all reserved chars except double quotes
    // per https://lucene.apache.org/solr/guide/6_6/the-standard-query-parser.html#TheStandardQueryParser-EscapingSpecialCharacters
    const escapedText = inputText.replace(/([!^&*()+=\[\]\\/{}|:?~])/g, '\\$1')
    return escapedText.toLowerCase().trim()
  }

  extractOrcidId(string: any) {
    const regexResult = ORCID_REGEXP.exec(string)
    if (regexResult) {
      return regexResult[0]
    }
    return null
  }

  // Remove empty values and trim strings
  trimSearchParameters(value: SearchParameters) {
    const trimParameters = {}
    Object.keys(value).forEach(element => {
      if (typeof value[element] === 'string') {
        if (value[element].trim()) {
          trimParameters[element] = value[element].trim()
        }
      } else {
        trimParameters[element] = value[element]
      }
    })
    return trimParameters
  }

  private encodeAndAddPagination(searchStream, querryParam) {
    return (
      `?q=${encodeURIComponent(searchStream)}` +
      this.handlePagination(querryParam)
    )
  }

  private handlePagination(querryParam: SearchParameters): string {
    return `&start=${querryParam.pageIndex * querryParam.pageSize ||
      0}&rows=${querryParam.pageSize || 50}`
  }
}
