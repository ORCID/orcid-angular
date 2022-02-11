import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map, retry, switchMap } from 'rxjs/operators'
import { EMAIL_REGEXP } from 'src/app/constants'
import {
  SocialAccount,
  SocialAccountDeleteResponse,
  SocialAccountId,
} from 'src/app/types/account-alternate-sign-in.endpoint'
import { Institutional } from 'src/app/types/institutional.endpoint'
import { environment } from 'src/environments/environment'
import { DiscoService } from '../disco/disco.service'

import { ErrorHandlerService } from '../error-handler/error-handler.service'

@Injectable({
  providedIn: 'root',
})
export class AccountSecurityAlternateSignInService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })
  constructor(
    private _errorHandler: ErrorHandlerService,
    private _discoFeed: DiscoService,
    private _http: HttpClient
  ) {}

  get(): Observable<SocialAccount[]> {
    return (
      of([
        {
          dateCreated: 1644598345944,
          lastModified: 1644598355198,
          id: {
            userid: '-7674652337265586484',
            providerid: 'facebook' as any,
            provideruserid: '10206988298263273',
          },
          accesstoken:
            'EAALGNO62uUcBAEXLgrPqidG3LQNeWWpWJp6fkezD6fFs8ex1aVZATJ21aSV5FohHRND3rtPTRfKQCJ10UEFMgE5L33ERdCQEHXzmZCxZBZAYIAMY7Mr8emi2VOmE8RaZCcuG3XdTm5Xi0VftWj7YcKaJ55B23NmUc8ChXTmcnkVZBKIRoaZAlxVZAMeoRAgcRnFu94GSjSNcB7ZBrSza48DVkA3MmcBGQ2lPKG1y1rS28zgZDZD',
          displayname: 'Leonardo Mendoza',
          email: 'leomendoza123@gmail.com',
          expiretime: 5184000,
          imageurl: null,
          lastLogin: 1644598345944,
          orcid: '0000-0002-2036-7905',
          profileurl: null,
          rank: 1,
          refreshtoken: null,
          secret: null,
          idType: null,
          headersJson: null,
          connectionSatus: 'STARTED',
          linked: true,
          accountIdForDisplay: 'leomendoza123@gmail.com',
        },
        {
          dateCreated: 1644598158697,
          lastModified: 1644605278835,
          id: {
            userid: '2824828673484688413',
            providerid: 'https://samltest.id/saml/idp' as any,
            provideruserid: 'msmith@samltest.id',
          },
          accesstoken: null,
          displayname: 'Morty Smith',
          email: null,
          expiretime: null,
          imageurl: null,
          lastLogin: 1644605278768,
          orcid: '0000-0002-2036-7905',
          profileurl: 'http://qa.orcid.org/0000-0002-2036-7905',
          rank: 1,
          refreshtoken: null,
          secret: null,
          idType: 'subject-id',
          headersJson:
            '{"referer":"https://qa.orcid.org/institutional-linking","x-forwarded-port":"443","sslclientcertstatus":"NoClientCert","remote_user":"msmith@samltest.id","shib-session-index":"_161059b6b5191681c10f2fd5ce065527","subject-id":"msmith@samltest.id","cf-visitor":"{\\"scheme\\":\\"https\\"}","x-xsrf-token":"0a9da676-46b7-418e-97ab-3e0da6eef1ce","givenname":"Mortimer","host":"qa.orcid.org","connection":"close","sslsessionid":"","shib-session-id":"_e5cd034e29db8d438ad65ff60ed012a4","x-cluster-client-ip":"172.69.16.132","shib-application-id":"default","cf-worker":"orcid.org","cdn-loop":"cloudflare; subreqs=1","accept-language":"en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7","cookie":"orcidCookiePolicyAlert=dont%20show%20message; testWarningCookie=dont%20show%20message; _hjid=50f299c5-2e63-4e0e-b4a8-be6e5f03297d; _ga=GA1.2.986162629.1637358124; _hjSessionUser_1220063=eyJpZCI6ImQ3OGI3Y2NkLTdhZDQtNTFmOC1hZjQ2LTc2ZmFjMDRjZjRkMCIsImNyZWF0ZWQiOjE2MzczNTgxMjQxMTYsImV4aXN0aW5nIjp0cnVlfQ==; _saml_institutional=aHR0cHM6Ly9zYW1sdGVzdC5pZC9zYW1sL2lkcA%3D%3D; X-Mapping-fjhppofk=8090532A90E505DB99C6009FFB46B5B7; locale_v3=en; orcidUserConnectionId=-7309133083358113166; _gid=GA1.2.1624802607.1644506270; _hjSession_1220063=eyJpZCI6ImEyY2JmZjY2LTg3ZTAtNGJiMy04YWRmLWM1ZDJmNjg3ODUwNCIsImNyZWF0ZWQiOjE2NDQ1OTYxMDQwMTIsImluU2FtcGxlIjp0cnVlfQ==; _hjAbsoluteSessionInProgress=0; XSRF-TOKEN=0a9da676-46b7-418e-97ab-3e0da6eef1ce; _hjIncludedInSessionSample=1; _gat_gtag_UA_17492803_6=1; _shibsession_64656661756c7468747470733a2f2f71612e6f726369642e6f72672f73616d6c322f73702f31=_e5cd034e29db8d438ad65ff60ed012a4; JSESSIONID=FC95A96DBA39C727AF86A4CD8F9C5522","entitlement":"Ambassador;None","x-forwarded-for":"45.239.64.75, 172.69.16.132","accept":"application/json, text/plain, */*","shib-authentication-method":"urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport","cf-ew-via":"15","content-length":"69","cf-ipcountry":"CR","sec-fetch-site":"same-origin","shib-handler":"https://qa.orcid.org/Shibboleth.sso","origin":"https://qa.orcid.org","shib-session-inactivity":"1644601758","sec-ch-ua-mobile":"?0","content-type":"application/x-www-form-urlencoded;charset=UTF-8","cf-connecting-ip":"45.239.64.75","shib-authentication-instant":"2022-02-11T16:49:04.049Z","sn":"Smith","sec-fetch-mode":"cors","shib-session-expires":"1644626949","auth_type":"shibboleth","cf-ray":"6dbf11d8f2937d4c-TGU","x-forwarded-proto":"https","sslclientcipher":"TLS_AES_256_GCM_SHA384, version=TLSv1.3, bits=256","shib-authncontext-class":"urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport","x-real-ip":"45.239.64.75","sec-ch-ua":"\\"NotA;Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"98\\", \\"GoogleChrome\\";v=\\"98\\"","sec-ch-ua-platform":"\\"macOS\\"","displayname":"Morty Smith","shib-identity-provider":"https://samltest.id/saml/idp","accept-encoding":"gzip","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36","sec-fetch-dest":"empty"}',
          connectionSatus: 'NOTIFIED',
          linked: true,
          accountIdForDisplay: 'Morty Smith',
        },
      ] as SocialAccount[])
        // this._http
        //   .get<SocialAccount[]>(
        //     environment.API_WEB + `account/socialAccounts.json`,
        //     {
        //       headers: this.headers,
        //     }
        //   )
        .pipe(
          switchMap((socialAccounts) => {
            return this._discoFeed.getDiscoFeed().pipe(
              map((feed) => {
                this.populateIdPNames({ socialAccounts, feed })
                this.populateEmails(socialAccounts)
                return socialAccounts
              })
            )
          }),
          retry(3),
          catchError((error) => this._errorHandler.handleError(error))
        )
    )
  }
  populateEmails(socialAccounts: SocialAccount[]) {
    socialAccounts.forEach(
      (account) => (account.email = this.getAccountDisplayEmail(account))
    )
  }
  private getAccountDisplayEmail(account: SocialAccount): string {
    if (account.email) {
      return account.email
    } else if (
      account.id?.provideruserid &&
      EMAIL_REGEXP.test(account.id?.provideruserid)
    ) {
      return account.id?.provideruserid
    } else {
      return account.displayname
    }
  }
  delete(idToManage: SocialAccountId): Observable<SocialAccountDeleteResponse> {
    return this._http
      .post<SocialAccountDeleteResponse>(
        environment.API_WEB + `account/revokeSocialAccount.json`,
        { idToManage },
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error))
      )
  }

  populateIdPNames({
    socialAccounts,
    feed,
  }: {
    socialAccounts: SocialAccount[]
    feed: Institutional[]
  }): void {
    socialAccounts.forEach((account) => {
      if (
        account.id.providerid === 'facebook' ||
        account.id.providerid === 'google'
      ) {
        account.idpName =
          account.id.providerid.charAt(0).toUpperCase() +
          account.id.providerid.slice(1)
      } else {
        account.idpName = this._discoFeed.getInstitutionNameBaseOnIdFromObject(
          this._discoFeed.getInstitutionBaseOnIDFromObject(
            feed,
            account.id.providerid
          )
        )
      }
      if (!account.idpName) {
        account.idpName = account.id.providerid
      }
    })
  }
}
