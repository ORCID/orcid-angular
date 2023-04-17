import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, ReplaySubject } from 'rxjs'
import { retry, catchError, tap, map } from 'rxjs/operators'
import { CountriesEndpoint } from 'src/app/types/record-country.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

@Injectable({
  providedIn: 'root',
})
export class RecordCountriesService {
  $addresses: ReplaySubject<CountriesEndpoint>
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  })

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService,
    private _recordPublicSidebar: RecordPublicSideBarService
  ) {}

  getCountryCodes(): Observable<{ key: string; value: string }[]> {
    return of([
      { key: $localize`:@@share.af:Afghanistan`, value: 'AF' },
      { key: $localize`:@@share.AL:Albania`, value: 'AL' },
      { key: $localize`:@@share.DZ:Algeria`, value: 'DZ' },
      { key: $localize`:@@share.AS:American Samoa`, value: 'AS' },
      { key: $localize`:@@share.AD:Andorra`, value: 'AD' },
      { key: $localize`:@@share.AO:Angola`, value: 'AO' },
      { key: $localize`:@@share.AI:Anguilla`, value: 'AI' },
      { key: $localize`:@@share.AQ:Antarctica`, value: 'AQ' },
      { key: $localize`:@@share.AG:Antigua and Barbuda`, value: 'AG' },
      { key: $localize`:@@share.AR:Argentina`, value: 'AR' },
      { key: $localize`:@@share.AM:Armenia`, value: 'AM' },
      { key: $localize`:@@share.AW:Aruba`, value: 'AW' },
      { key: $localize`:@@share.AU:Australia`, value: 'AU' },
      { key: $localize`:@@share.AT:Austria`, value: 'AT' },
      { key: $localize`:@@share.AZ:Azerbaijan`, value: 'AZ' },
      { key: $localize`:@@share.BS:Bahamas`, value: 'BS' },
      { key: $localize`:@@share.BH:Bahrain`, value: 'BH' },
      { key: $localize`:@@share.BD:Bangladesh`, value: 'BD' },
      { key: $localize`:@@share.BB:Barbados`, value: 'BB' },
      { key: $localize`:@@share.BY:Belarus`, value: 'BY' },
      { key: $localize`:@@share.BE:Belgium`, value: 'BE' },
      { key: $localize`:@@share.BZ:Belize`, value: 'BZ' },
      { key: $localize`:@@share.BJ:Benin`, value: 'BJ' },
      { key: $localize`:@@share.BM:Bermuda`, value: 'BM' },
      { key: $localize`:@@share.BT:Bhutan`, value: 'BT' },
      { key: $localize`:@@share.BO:Bolivia`, value: 'BO' },
      { key: $localize`:@@share.BA:Bosnia and Herzegovina`, value: 'BA' },
      { key: $localize`:@@share.BW:Botswana`, value: 'BW' },
      { key: $localize`:@@share.BV:Bouvet Island`, value: 'BV' },
      { key: $localize`:@@share.BR:Brazil`, value: 'BR' },
      { key: $localize`:@@share.BQ:British Antarctic Territory`, value: 'BQ' },
      {
        key: $localize`:@@share.IO:British Indian Ocean Territory`,
        value: 'IO',
      },
      { key: $localize`:@@share.VG:British Virgin Islands`, value: 'VG' },
      { key: $localize`:@@share.BN:Brunei`, value: 'BN' },
      { key: $localize`:@@share.BG:Bulgaria`, value: 'BG' },
      { key: $localize`:@@share.BF:Burkina Faso`, value: 'BF' },
      { key: $localize`:@@share.BI:Burundi`, value: 'BI' },
      { key: $localize`:@@share.KH:Cambodia`, value: 'KH' },
      { key: $localize`:@@share.CM:Cameroon`, value: 'CM' },
      { key: $localize`:@@share.CA:Canada`, value: 'CA' },
      { key: $localize`:@@share.CV:Cape Verde`, value: 'CV' },
      { key: $localize`:@@share.KY:Cayman Islands`, value: 'KY' },
      { key: $localize`:@@share.CF:Central African Republic`, value: 'CF' },
      { key: $localize`:@@share.TD:Chad`, value: 'TD' },
      { key: $localize`:@@share.CL:Chile`, value: 'CL' },
      { key: $localize`:@@share.CN:China`, value: 'CN' },
      { key: $localize`:@@share.CX:Christmas Island`, value: 'CX' },
      { key: $localize`:@@share.CC:Cocos [Keeling] Islands`, value: 'CC' },
      { key: $localize`:@@share.CO:Colombia`, value: 'CO' },
      { key: $localize`:@@share.KM:Comoros`, value: 'KM' },
      { key: $localize`:@@share.CG:Congo - Brazzaville`, value: 'CG' },
      { key: $localize`:@@share.CD:Congo - Kinshasa`, value: 'CD' },
      { key: $localize`:@@share.CK:Cook Islands`, value: 'CK' },
      { key: $localize`:@@share.CR:Costa Rica`, value: 'CR' },
      { key: $localize`:@@share.HR:Croatia`, value: 'HR' },
      { key: $localize`:@@share.CU:Cuba`, value: 'CU' },
      { key: $localize`:@@share.CW:Curaçao`, value: 'CW' },
      { key: $localize`:@@share.CY:Cyprus`, value: 'CY' },
      { key: $localize`:@@share.CZ:Czech Republic`, value: 'CZ' },
      { key: $localize`:@@share.CI:Côte d'Ivoire`, value: 'CI' },
      { key: $localize`:@@share.DK:Denmark`, value: 'DK' },
      { key: $localize`:@@share.DJ:Djibouti`, value: 'DJ' },
      { key: $localize`:@@share.DM:Dominica`, value: 'DM' },
      { key: $localize`:@@share.DO:Dominican Republic`, value: 'DO' },
      { key: $localize`:@@share.EC:Ecuador`, value: 'EC' },
      { key: $localize`:@@share.EG:Egypt`, value: 'EG' },
      { key: $localize`:@@share.SV:El Salvador`, value: 'SV' },
      { key: $localize`:@@share.GQ:Equatorial Guinea`, value: 'GQ' },
      { key: $localize`:@@share.ER:Eritrea`, value: 'ER' },
      { key: $localize`:@@share.EE:Estonia`, value: 'EE' },
      { key: $localize`:@@share.ET:Ethiopia`, value: 'ET' },
      { key: $localize`:@@share.FK:Falkland Islands`, value: 'FK' },
      { key: $localize`:@@share.FO:Faroe Islands`, value: 'FO' },
      { key: $localize`:@@share.FJ:Fiji`, value: 'FJ' },
      { key: $localize`:@@share.FI:Finland`, value: 'FI' },
      { key: $localize`:@@share.FR:France`, value: 'FR' },
      { key: $localize`:@@share.GF:French Guiana`, value: 'GF' },
      { key: $localize`:@@share.PF:French Polynesia`, value: 'PF' },
      { key: $localize`:@@share.TF:French Southern Territories`, value: 'TF' },
      { key: $localize`:@@share.GA:Gabon`, value: 'GA' },
      { key: $localize`:@@share.GM:Gambia`, value: 'GM' },
      { key: $localize`:@@share.GE:Georgia`, value: 'GE' },
      { key: $localize`:@@share.DE:Germany`, value: 'DE' },
      { key: $localize`:@@share.GH:Ghana`, value: 'GH' },
      { key: $localize`:@@share.GI:Gibraltar`, value: 'GI' },
      { key: $localize`:@@share.GR:Greece`, value: 'GR' },
      { key: $localize`:@@share.GL:Greenland`, value: 'GL' },
      { key: $localize`:@@share.GD:Grenada`, value: 'GD' },
      { key: $localize`:@@share.GP:Guadeloupe`, value: 'GP' },
      { key: $localize`:@@share.GU:Guam`, value: 'GU' },
      { key: $localize`:@@share.GT:Guatemala`, value: 'GT' },
      { key: $localize`:@@share.GG:Guernsey`, value: 'GG' },
      { key: $localize`:@@share.GN:Guinea`, value: 'GN' },
      { key: $localize`:@@share.GW:Guinea-Bissau`, value: 'GW' },
      { key: $localize`:@@share.GY:Guyana`, value: 'GY' },
      { key: $localize`:@@share.HT:Haiti`, value: 'HT' },
      {
        key: $localize`:@@share.HM:Heard Island and McDonald Islands`,
        value: 'HM',
      },
      { key: $localize`:@@share.HN:Honduras`, value: 'HN' },
      { key: $localize`:@@share.HK:Hong Kong SAR China`, value: 'HK' },
      { key: $localize`:@@share.HU:Hungary`, value: 'HU' },
      { key: $localize`:@@share.IS:Iceland`, value: 'IS' },
      { key: $localize`:@@share.IN:India`, value: 'IN' },
      { key: $localize`:@@share.ID:Indonesia`, value: 'ID' },
      { key: $localize`:@@share.IR:Iran`, value: 'IR' },
      { key: $localize`:@@share.IQ:Iraq`, value: 'IQ' },
      { key: $localize`:@@share.IE:Ireland`, value: 'IE' },
      { key: $localize`:@@share.IM:Isle of Man`, value: 'IM' },
      { key: $localize`:@@share.IL:Israel`, value: 'IL' },
      { key: $localize`:@@share.IT:Italy`, value: 'IT' },
      { key: $localize`:@@share.JM:Jamaica`, value: 'JM' },
      { key: $localize`:@@share.JP:Japan`, value: 'JP' },
      { key: $localize`:@@share.JE:Jersey`, value: 'JE' },
      { key: $localize`:@@share.JO:Jordan`, value: 'JO' },
      { key: $localize`:@@share.KZ:Kazakhstan`, value: 'KZ' },
      { key: $localize`:@@share.KE:Kenya`, value: 'KE' },
      { key: $localize`:@@share.KI:Kiribati`, value: 'KI' },
      { key: $localize`:@@share.XK:Kosovo`, value: 'XK' },
      { key: $localize`:@@share.KW:Kuwait`, value: 'KW' },
      { key: $localize`:@@share.KG:Kyrgyzstan`, value: 'KG' },
      { key: $localize`:@@share.LA:Laos`, value: 'LA' },
      { key: $localize`:@@share.LV:Latvia`, value: 'LV' },
      { key: $localize`:@@share.LB:Lebanon`, value: 'LB' },
      { key: $localize`:@@share.LS:Lesotho`, value: 'LS' },
      { key: $localize`:@@share.LR:Liberia`, value: 'LR' },
      { key: $localize`:@@share.LY:Libya`, value: 'LY' },
      { key: $localize`:@@share.LI:Liechtenstein`, value: 'LI' },
      { key: $localize`:@@share.LT:Lithuania`, value: 'LT' },
      { key: $localize`:@@share.LU:Luxembourg`, value: 'LU' },
      { key: $localize`:@@share.MO:Macau SAR China`, value: 'MO' },
      { key: $localize`:@@share.MG:Madagascar`, value: 'MG' },
      { key: $localize`:@@share.MW:Malawi`, value: 'MW' },
      { key: $localize`:@@share.MY:Malaysia`, value: 'MY' },
      { key: $localize`:@@share.MV:Maldives`, value: 'MV' },
      { key: $localize`:@@share.ML:Mali`, value: 'ML' },
      { key: $localize`:@@share.MT:Malta`, value: 'MT' },
      { key: $localize`:@@share.MH:Marshall Islands`, value: 'MH' },
      { key: $localize`:@@share.MQ:Martinique`, value: 'MQ' },
      { key: $localize`:@@share.MR:Mauritania`, value: 'MR' },
      { key: $localize`:@@share.MU:Mauritius`, value: 'MU' },
      { key: $localize`:@@share.YT:Mayotte`, value: 'YT' },
      { key: $localize`:@@share.MX:Mexico`, value: 'MX' },
      { key: $localize`:@@share.FM:Micronesia`, value: 'FM' },
      { key: $localize`:@@share.MD:Moldova`, value: 'MD' },
      { key: $localize`:@@share.MC:Monaco`, value: 'MC' },
      { key: $localize`:@@share.MN:Mongolia`, value: 'MN' },
      { key: $localize`:@@share.ME:Montenegro`, value: 'ME' },
      { key: $localize`:@@share.MS:Montserrat`, value: 'MS' },
      { key: $localize`:@@share.MA:Morocco`, value: 'MA' },
      { key: $localize`:@@share.MZ:Mozambique`, value: 'MZ' },
      { key: $localize`:@@share.MM:Myanmar [Burma]`, value: 'MM' },
      { key: $localize`:@@share.NA:Namibia`, value: 'NA' },
      { key: $localize`:@@share.NR:Nauru`, value: 'NR' },
      { key: $localize`:@@share.NP:Nepal`, value: 'NP' },
      { key: $localize`:@@share.NL:Netherlands`, value: 'NL' },
      { key: $localize`:@@share.NC:New Caledonia`, value: 'NC' },
      { key: $localize`:@@share.NZ:New Zealand`, value: 'NZ' },
      { key: $localize`:@@share.NI:Nicaragua`, value: 'NI' },
      { key: $localize`:@@share.NE:Niger`, value: 'NE' },
      { key: $localize`:@@share.NG:Nigeria`, value: 'NG' },
      { key: $localize`:@@share.NU:Niue`, value: 'NU' },
      { key: $localize`:@@share.NF:Norfolk Island`, value: 'NF' },
      { key: $localize`:@@share.KP:North Korea`, value: 'KP' },
      { key: $localize`:@@share.MK:North Macedonia`, value: 'MK' },
      { key: $localize`:@@share.MP:Northern Mariana Islands`, value: 'MP' },
      { key: $localize`:@@share.NO:Norway`, value: 'NO' },
      { key: $localize`:@@share.OM:Oman`, value: 'OM' },
      { key: $localize`:@@share.PK:Pakistan`, value: 'PK' },
      { key: $localize`:@@share.PW:Palau`, value: 'PW' },
      { key: $localize`:@@share.PS:Palestinian Territories`, value: 'PS' },
      { key: $localize`:@@share.PA:Panama`, value: 'PA' },
      { key: $localize`:@@share.PG:Papua New Guinea`, value: 'PG' },
      { key: $localize`:@@share.PY:Paraguay`, value: 'PY' },
      { key: $localize`:@@share.PE:Peru`, value: 'PE' },
      { key: $localize`:@@share.PH:Philippines`, value: 'PH' },
      { key: $localize`:@@share.PN:Pitcairn Islands`, value: 'PN' },
      { key: $localize`:@@share.PL:Poland`, value: 'PL' },
      { key: $localize`:@@share.PT:Portugal`, value: 'PT' },
      { key: $localize`:@@share.PR:Puerto Rico`, value: 'PR' },
      { key: $localize`:@@share.QA:Qatar`, value: 'QA' },
      { key: $localize`:@@share.RO:Romania`, value: 'RO' },
      { key: $localize`:@@share.RU:Russia`, value: 'RU' },
      { key: $localize`:@@share.RW:Rwanda`, value: 'RW' },
      { key: $localize`:@@share.RE:Réunion`, value: 'RE' },
      { key: $localize`:@@share.BL:Saint Barthélemy`, value: 'BL' },
      { key: $localize`:@@share.SH:Saint Helena`, value: 'SH' },
      { key: $localize`:@@share.KN:Saint Kitts and Nevis`, value: 'KN' },
      { key: $localize`:@@share.LC:Saint Lucia`, value: 'LC' },
      { key: $localize`:@@share.MF:Saint Martin`, value: 'MF' },
      { key: $localize`:@@share.PM:Saint Pierre and Miquelon`, value: 'PM' },
      {
        key: $localize`:@@share.VC:Saint Vincent and the Grenadines`,
        value: 'VC',
      },
      { key: $localize`:@@share.WS:Samoa`, value: 'WS' },
      { key: $localize`:@@share.SM:San Marino`, value: 'SM' },
      { key: $localize`:@@share.SA:Saudi Arabia`, value: 'SA' },
      { key: $localize`:@@share.SN:Senegal`, value: 'SN' },
      { key: $localize`:@@share.RS:Serbia`, value: 'RS' },
      { key: $localize`:@@share.SC:Seychelles`, value: 'SC' },
      { key: $localize`:@@share.SL:Sierra Leone`, value: 'SL' },
      { key: $localize`:@@share.SG:Singapore`, value: 'SG' },
      { key: $localize`:@@share.SX:Sint Maarten (Dutch Part)`, value: 'SX' },
      { key: $localize`:@@share.SK:Slovakia`, value: 'SK' },
      { key: $localize`:@@share.SI:Slovenia`, value: 'SI' },
      { key: $localize`:@@share.SB:Solomon Islands`, value: 'SB' },
      { key: $localize`:@@share.SO:Somalia`, value: 'SO' },
      { key: $localize`:@@share.ZA:South Africa`, value: 'ZA' },
      {
        key: $localize`:@@share.GS:South Georgia and the South Sandwich Islands`,
        value: 'GS',
      },
      { key: $localize`:@@share.KR:South Korea`, value: 'KR' },
      { key: $localize`:@@share.SS:South Sudan`, value: 'SS' },
      { key: $localize`:@@share.ES:Spain`, value: 'ES' },
      { key: $localize`:@@share.LK:Sri Lanka`, value: 'LK' },
      { key: $localize`:@@share.SD:Sudan`, value: 'SD' },
      { key: $localize`:@@share.SR:Suriname`, value: 'SR' },
      { key: $localize`:@@share.SJ:Svalbard and Jan Mayen`, value: 'SJ' },
      { key: $localize`:@@share.SZ:Swaziland`, value: 'SZ' },
      { key: $localize`:@@share.SE:Sweden`, value: 'SE' },
      { key: $localize`:@@share.CH:Switzerland`, value: 'CH' },
      { key: $localize`:@@share.SY:Syria`, value: 'SY' },
      { key: $localize`:@@share.ST:São Tomé and Príncipe`, value: 'ST' },
      { key: $localize`:@@share.TW:Taiwan`, value: 'TW' },
      { key: $localize`:@@share.TJ:Tajikistan`, value: 'TJ' },
      { key: $localize`:@@share.TZ:Tanzania`, value: 'TZ' },
      { key: $localize`:@@share.TH:Thailand`, value: 'TH' },
      { key: $localize`:@@share.TL:Timor-Leste`, value: 'TL' },
      { key: $localize`:@@share.TG:Togo`, value: 'TG' },
      { key: $localize`:@@share.TK:Tokelau`, value: 'TK' },
      { key: $localize`:@@share.TO:Tonga`, value: 'TO' },
      { key: $localize`:@@share.TT:Trinidad and Tobago`, value: 'TT' },
      { key: $localize`:@@share.TN:Tunisia`, value: 'TN' },
      { key: $localize`:@@share.TR:Türkiye`, value: 'TR' },
      { key: $localize`:@@share.TM:Turkmenistan`, value: 'TM' },
      { key: $localize`:@@share.TC:Turks and Caicos Islands`, value: 'TC' },
      { key: $localize`:@@share.TV:Tuvalu`, value: 'TV' },
      { key: $localize`:@@share.UM:U.S. Minor Outlying Islands`, value: 'UM' },
      { key: $localize`:@@share.VI:U.S. Virgin Islands`, value: 'VI' },
      { key: $localize`:@@share.UG:Uganda`, value: 'UG' },
      { key: $localize`:@@share.UA:Ukraine`, value: 'UA' },
      { key: $localize`:@@share.AE:United Arab Emirates`, value: 'AE' },
      { key: $localize`:@@share.GB:United Kingdom`, value: 'GB' },
      { key: $localize`:@@share.US:United States`, value: 'US' },
      { key: $localize`:@@share.UY:Uruguay`, value: 'UY' },
      { key: $localize`:@@share.UZ:Uzbekistan`, value: 'UZ' },
      { key: $localize`:@@share.VU:Vanuatu`, value: 'VU' },
      { key: $localize`:@@share.VA:Vatican City`, value: 'VA' },
      { key: $localize`:@@share.VE:Venezuela`, value: 'VE' },
      { key: $localize`:@@share.VN:Vietnam`, value: 'VN' },
      { key: $localize`:@@share.WF:Wallis and Futuna`, value: 'WF' },
      { key: $localize`:@@share.EH:Western Sahara`, value: 'EH' },
      { key: $localize`:@@share.YE:Yemen`, value: 'YE' },
      { key: $localize`:@@share.ZM:Zambia`, value: 'ZM' },
      { key: $localize`:@@share.ZW:Zimbabwe`, value: 'ZW' },
      { key: $localize`:@@share.AX:Åland Islands`, value: 'AX' },
    ])
  }

  getAddresses(
    options: UserRecordOptions = {
      forceReload: false,
    }
  ): Observable<CountriesEndpoint> {
    if (options.publicRecordId) {
      return this._recordPublicSidebar
        .getPublicRecordSideBar(options)
        .pipe(map((value) => value.countries))
    }

    if (!this.$addresses) {
      this.$addresses = new ReplaySubject<CountriesEndpoint>(1)
    } else if (!options.forceReload) {
      return this.$addresses
    }
    if (options.cleanCacheIfExist && this.$addresses) {
      this.$addresses.next(<CountriesEndpoint>undefined)
    }

    this._http
      .get<CountriesEndpoint>(
        environment.API_WEB + `account/countryForm.json`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        catchError(() => of({ addresses: [] } as CountriesEndpoint)),
        tap((value) => {
          this.reverseSort(value)
        }),
        tap((value) => {
          this.$addresses.next(value)
        })
      )
      .subscribe()
    return this.$addresses
  }

  postAddresses(countries: CountriesEndpoint): Observable<CountriesEndpoint> {
    return this._http
      .post<CountriesEndpoint>(
        environment.API_WEB + `account/countryForm.json`,
        countries,
        { headers: this.headers }
      )
      .pipe(
        retry(3),
        catchError((error) => this._errorHandler.handleError(error)),
        tap(() => this.getAddresses({ forceReload: true }))
      )
  }

  private reverseSort(value: CountriesEndpoint) {
    value.addresses.sort((a, b) => a.displayIndex - b.displayIndex)
    value.addresses.reverse()
  }
}
