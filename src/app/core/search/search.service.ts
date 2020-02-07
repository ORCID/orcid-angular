import { Injectable } from '@angular/core'
import { Params } from '@angular/router'
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { SearchParameters, SearchResults } from 'src/app/types'
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private _http: HttpClient) {}

  search(querryParam: SearchParameters): Observable<SearchResults> {
    console.log(querryParam)
    return this._http.get<SearchResults>(
      `${environment.API_PUB}/expanded-search/${this.buildSearchUrl(
        querryParam
      )}`,
      {
        headers: { Accept: 'application/json' },
      }
    )
  }

  buildSearchUrl(querryParam: SearchParameters): string {
    const escapedParams: SearchParameters = {}
    Object.keys(querryParam).map(key => {
      escapedParams[key] = this.escapeReservedChar(querryParam[key])
    })
    if (escapedParams && escapedParams.searchQuery) {
      // When there is a searchQuery parameter do a quick search
      return (
        `?q=${escapedParams.searchQuery}` + this.handlePagination(querryParam)
      )
    } else if (escapedParams && escapedParams.orcid) {
      // When there is an Orcid id only search the orcid ID
      return (
        `?q=orcid:${escapedParams.orcid}` + this.handlePagination(querryParam)
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
      console.log(escapedParams)
      return (
        `?q=${encodeURIComponent(searchParameters.join(' AND '))}` +
        this.handlePagination(querryParam)
      )
    }
  }

  handlePagination(querryParam: SearchParameters): string {
    return `&start=${querryParam.pageIndex * querryParam.pageSize ||
      0}&rows=${querryParam.pageSize || 50}`
  }

  escapeReservedChar(inputText: any) {
    // escape all reserved chars except double quotes
    // per https://lucene.apache.org/solr/guide/6_6/the-standard-query-parser.html#TheStandardQueryParser-EscapingSpecialCharacters
    const escapedText = inputText.replace(/([!^&*()+=\[\]\\/{}|:?~])/g, '\\$1')
    return escapedText.toLowerCase().trim()
  }

  trimSearchParameters(value: SearchParameters) {
    const trimParameters = {}
    Object.keys(value).forEach(element => {
      if (typeof value[element] === 'string') {
        trimParameters[element] = value[element].trim()
      }
    })
    return trimParameters
  }
}
