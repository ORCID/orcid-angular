import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, delay, map } from 'rxjs/operators'
import {
  DEFAULT_PAGE_SIZE,
  ORCID_REGEXP_CASE_INSENSITIVE,
} from 'src/app/constants'
import { SearchParameters, SearchResults } from 'src/app/types'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

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
    return of({"expanded-result":[{"orcid-id":"0000-0001-6860-7376","given-names":"Pedro**","family-names":"18nov2020","credit-name":null,"other-name":["Другое имя","其他名字","alia nomo","other names","andre navne"],"email":[],"institution-name":["Massachusetts Institute of Technology","Ministry of Science and Technology of the People's Republic of China","NASA","NASA Education","ORCID","Royal College of Music"]},{"orcid-id":"0000-0001-6444-0281","given-names":"Pedro","family-names":"20nov2020","credit-name":null,"other-name":["Другое имя","其他名字","alia nomo","other names","andre navne"],"email":[],"institution-name":["Massachusetts Institute of Technology","Ministry of Science and Technology of the People's Republic of China","NASA","NASA Education","ORCID","Royal College of Music"]},{"orcid-id":"0000-0002-9576-3507","given-names":"Pedro","family-names":"Costa","credit-name":null,"other-name":["Другое имя","其他名字","alia nomo","other names","andre navne"],"email":[],"institution-name":["Massachusetts Institute of Technology","Ministry of Science and Technology of the People's Republic of China","NASA","NASA Education","National Statistical Institute of Portugal","ORCID"]},{"orcid-id":"0000-0003-4498-9335","given-names":"Pedro","family-names":"2020dec14","credit-name":null,"other-name":["Другое имя","其他名字","alia nomo","other names","andre navne"],"email":["pedro.2020dec14_1@mailinator.com","pedro.2020dec14@mailinator.com"],"institution-name":["Massachusetts Institute of Technology","Ministry of Science and Technology of the People's Republic of China","NASA","NASA Education","ORCID","Royal College of Music"]},{"orcid-id":"0000-0002-4586-0915","given-names":"Pedro","family-names":"20210723","credit-name":null,"other-name":[],"email":[],"institution-name":["Irish Research Council","Maynooth University"]},{"orcid-id":"0000-0001-9091-4938","given-names":"Pedro","family-names":"Costa","credit-name":null,"other-name":[],"email":[],"institution-name":["Irish Research Council","Maynooth University"]},{"orcid-id":"0000-0001-7945-7676","given-names":"Pedro","family-names":"Costa","credit-name":null,"other-name":[],"email":[],"institution-name":["Example Organization Name","NASA","University of Wisconsin-Madison","common:name","org name","organization name"]},{"orcid-id":"0000-0002-9578-7373","given-names":"Pedro","family-names":"Costa","credit-name":"Pedro M. Costa","other-name":["duplicate name","PEDRO MIGUEL MACHADO DA COSTA","àáâãäåçèéêëìíîðñòôõöö","* ? / \\ | < > , . ( ) [ ] { } ; : ‘ “ ! @ # $ % ^ &","MyOtherName1","Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero","Carl","MyOtherName1","DUPLICATE NAME","duplicate name","Duplicate Name"],"email":["pedro.hello@mailinator.com","pedro.costa1@mailinator.com","pedro.hello1@mailinator.com","p.costa+b0OiAFfbQK16X21OFXsimJx9Sida4mDsGykClXorHjrqsK6kHg39LqdBYkVLsfVIkmKKLnpuh2mZqownu3NK7R76m6nmcGf1kcmdMVIHlQuoYnHJa9aY2mmXuNdEkjtiyxBO8a3HgBgowcF11nhaJVoWzOu3hKmhiBqVToG11a7CgJ3HHRtdlDhuH1AgEkW0EtbPcxWIwNIfXQKGUppcGHjYlAGwpiNfKXszWBD7tE4aiKIG7bAlewyHWKY99JBf00J3NtOtPCLYEX814swew3Qpyf5d4l3t1rkaKjcdmdHrFUb6UaJMepCXas1IyyRYguYQ7YFC9AlRSuNXsm0f7FT5dJaW21JPT1aPllFsYDjVCIRUVX5aIioLB2L4VIOAbhtroFWxLJR3oenc@orcid.org"],"institution-name":["American Association for the Advancement of Science","Example Organization Name","Howard Hughes Medical Institute - Harvard Medical School","Molecular Cardiology and Neuromuscular Institute","NASA","National Science Foundation","ORCID","University of Wisconsin-Madison","common:name","org name","organization name","this is an organization name"]},{"orcid-id":"0000-0002-6349-8243","given-names":"Pedro","family-names":"2021-02-08","credit-name":null,"other-name":["Другое имя","其他名字","alia nomo","other names","andre navne"],"email":[],"institution-name":["Massachusetts Institute of Technology","Ministry of Science and Technology of the People's Republic of China","NASA","NASA Education","ORCID","Royal College of Music"]},{"orcid-id":"0000-0003-1492-897X","given-names":"Pedro","family-names":"Costa","credit-name":"Pedro Miguel Costa","other-name":[],"email":[],"institution-name":["ORCID"]}],"num-found":157}).pipe(
      delay(1000),
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
