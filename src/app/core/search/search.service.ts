import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
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
    return of({
      'expanded-result': [
        {
          'orcid-id': '0000-0002-2386-9396',
          'given-names': 'July31',
          'family-names': '[test]',
          'credit-name': null,
          'other-name': ['Другое имя', '其他名字', 'other names'],
          email: [],
          'institution-name': [
            'Dow Jones and Co Inc Washington',
            'Green Events and Ink Distribution Ltd',
            'Massachusetts Institute of Technology',
            "Ministry of Science and Technology of the People's Republic of China",
            'NASA',
            'Not from the list',
            'ORCID',
            'Oberlin College',
            'Ohio Education Association Department of Education Policy Research and Member Advocacy',
            'Organisation of Eastern Caribbean States',
            'Research Data Alliance',
            'THE ALLEN-TREW FAMILY SETTLEMENT 2014',
            'University of Michigan',
          ],
        },
        {
          'orcid-id': '0000-0003-3329-9793',
          'given-names': 'ma test',
          'family-names': '19aug2016',
          'credit-name': null,
          'other-name': ['AKA'],
          email: [],
          'institution-name': ['ORCID', 'Updated name'],
        },
        {
          'orcid-id': '0000-0002-4927-0058',
          'given-names': 'Nov 1',
          'family-names': 'Test',
          'credit-name': 'test',
          'other-name': ['other name'],
          email: ['nov1@mailinator.com'],
          'institution-name': ['ORCID', 'Program 973'],
        },
        {
          'orcid-id': '0000-0001-5794-2056',
          'given-names': 'test-in',
          'family-names': '01aug2019',
          'credit-name': null,
          'other-name': [
            'Другое имя',
            '其他名字',
            'alia nomo',
            'other names',
            'andre navne',
          ],
          email: [],
          'institution-name': [
            'Massachusetts Institute of Technology',
            "Ministry of Science and Technology of the People's Republic of China",
            'NASA',
            'NASA Education',
            'ORCID',
            'Royal College of Music',
          ],
        },
        {
          'orcid-id': '0000-0002-7307-2131',
          'given-names': 'obo-test',
          'family-names': 'reallylongnamefortestingifitstilllooksokwithobo',
          'credit-name': null,
          'other-name': [
            'Другое имя',
            '其他名字',
            'alia nomo',
            'other names',
            'andre navne',
          ],
          email: [],
          'institution-name': [
            'Massachusetts Institute of Technology',
            "Ministry of Science and Technology of the People's Republic of China",
            'NASA',
            'NASA Education',
            'ORCID',
            'Royal College of Music',
          ],
        },
        {
          'orcid-id': '0000-0001-9826-2524',
          'given-names': 'rc3',
          'family-names': 'First Test',
          'credit-name': null,
          'other-name': ['API 1.2 a', 'user added'],
          email: [],
          'institution-name': [
            'Cherry Orchard Hospital',
            'National Documentation Centre on Drug Use',
            'University of Michigan',
          ],
        },
        {
          'orcid-id': '0000-0002-7361-1027',
          'given-names': 'Independent Test',
          'family-names': 'Record',
          'credit-name': null,
          'other-name': ['Other name'],
          email: ['independent@mailiantor.com'],
          'institution-name': [
            'AARP',
            'AFL-CIO Employees FCU',
            'Massachusetts Institute of Technology',
            'ORCID',
            'Oberlin College',
            'Swarthmore College',
          ],
        },
        {
          'orcid-id': '0000-0002-3874-7658',
          'given-names': 'Everything Public',
          'family-names': 'MA test',
          'credit-name': 'Published Name',
          'other-name': ['Also know As'],
          email: ['public_ma@mailinator.com'],
          'institution-name': [
            'Alpena Community College',
            'City of Austin',
            'City of Boston',
            'City of Madison Wisconsin',
            'New York City Council',
            'ORCID',
            'San Francisco Foundation',
          ],
        },
        {
          'orcid-id': '0000-0002-8533-6659',
          'given-names': 'Test',
          'family-names': null,
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': ['Test  – –', 'Test Parent'],
        },
        {
          'orcid-id': '0000-0001-5054-3861',
          'given-names': 'July_17',
          'family-names': 'Test',
          'credit-name': null,
          'other-name': ['Другое имя'],
          email: [],
          'institution-name': ['ORCID'],
        },
      ],
      'num-found': 1040,
    })

    // this._http
    //   .get<SearchResults>(
    //     `${environment.API_PUB}/expanded-search/${this.buildSearchUrl(
    //       querryParam
    //     )}`,
    //     {
    //       headers: { Accept: 'application/json' },
    //     }
    //   )
    //   .pipe(
    //     catchError((error) => this._errorHandler.handleError(error)),
    //     map((x) => {
    //       x['expanded-result'] = x['expanded-result']?.map((element) => {
    //         if (!element['given-names'] && !element['family-names']) {
    //           element[
    //             'given-names'
    //           ] = $localize`:@@account.nameIsPri:Name is private`
    //         }

    //         return element
    //       })
    //       return x
    //     })
    //   )
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
