// Custom email REGEXP
// https://regex101.com/r/jV4aN7/14
// tslint:disable-next-line: max-line-length
export const EMAIL_REGEXP = /^([^@\s]|(".+"))+@([^@\s\."'\(\)\[\]\{\}\\/,:;]+\.)*([^@\s\."'\(\)\[\]\{\}\\/,:;]{2,})+$/

export const EMAIL_REGEXP_GENERIC = /^\s*?(.+)@(.+?)\s*$/
// https://regex101.com/r/9MXmdl/1
export const ORCID_REGEXP = /(\d{4}[- ]{0,}){3}\d{3}[\dX]$/i
// https://regex101.com/r/V95col/6
// tslint:disable-next-line: max-line-length
export const ORCID_URI_REGEXP = /(orcid\.org\/|qa\.orcid\.org\/|sandbox\.orcid\.org\/|dev\.orcid\.org\/|localhost.*)(\d{4}[- ]{0,}){3}\d{3}[\dX]$/i
// https://www.regextester.com/94502
export const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
// https://www.regextester.com/96577
export const ILLEGAL_NAME_CHARACTERS_REGEXP = /([@\$!])/
// https://regex101.com/r/aoHxNo/1
export const HAS_NUMBER = /(?=.*[0-9]).*/
// https://regex101.com/r/NNIuKQ/1
export const HAS_LETTER_OR_SYMBOL = /(?=.*[^\d\s]).*/

export const ApplicationRoutes = {
  institutionalLinking: 'institutional-linking',
  social: 'social-linking',
  institutional: 'institutional-signin',
  inbox: 'inbox',
  login: 'login',
  signin: 'signin',
  authorize: 'oauth/authorize',
  search: 'orcid-search/search',
  resetPassword: 'reset-password',
  register: 'register',
  home: '',
}

export const PerformanceMarks = {
  navigationStartPrefix: 'start_',
  navigationEndPrefix: 'ends_',
}

export function isValidOrcidFormat(id) {
  const regExp = new RegExp('([0-9]{4}-){3}[0-9]{4}')
  return id && regExp.test(id)
}

export function getOrcidNumber(userId) {
  const orcidPattern = ORCID_REGEXP
  const extId = orcidPattern.exec(userId)
  if (extId != null) {
    userId = extId[0].toString().replace(/ /g, '')
    userId = userId.toString().replace(/-/g, '')
    const temp = userId.toString().replace(/(.{4})/g, '$1-')
    const length = temp.length
    userId = temp.substring(0, length - 1).toUpperCase()
  }
  return userId
}

export const URL_PRIVATE_PROFILE = 'myorcid'

// LAYOUT DEFINITIONS

export const GRID_GUTTER = {
  desktop: 12,
  tablet: 8,
  handset: 4,
}

export const GRID_MARGINS = {
  desktop: 200,
  tablet: 16,
  handset: 16,
}

export const GRID_COLUMNS = {
  desktop: 12,
  tablet: 8,
  handset: 4,
}

export const VISIBILITY_OPTIONS = ['PUBLIC', 'LIMITED', 'PRIVATE']

export const AMOUNT_OF_RETRIEVE_NOTIFICATIONS_PER_CALL = 10

export function isRedirectToTheAuthorizationPage(data: { url: string }) {
  return data.url.toLowerCase().includes('oauth/authorize')
}

export const COUNTRY_NAMES_TO_COUNTRY_CODES = {
  'Papua New Guinea': 'PG',
  Cambodia: 'KH',
  Paraguay: 'PY',
  Kazakhstan: 'KZ',
  'Åland Islands': 'AX',
  Syria: 'SY',
  'Solomon Islands': 'SB',
  'Côte d’Ivoire': 'CI',
  Bahamas: 'BS',
  Montserrat: 'MS',
  'Marshall Islands': 'MH',
  Mali: 'ML',
  Panama: 'PA',
  Guadeloupe: 'GP',
  Laos: 'LA',
  Argentina: 'AR',
  'Falkland Islands': 'FK',
  Seychelles: 'SC',
  Zambia: 'ZM',
  Belize: 'BZ',
  Bahrain: 'BH',
  'Guinea-Bissau': 'GW',
  Namibia: 'NA',
  'Palestinian Territories': 'PS',
  Finland: 'FI',
  'Faroe Islands': 'FO',
  Comoros: 'KM',
  'North Macedonia': 'MK',
  Georgia: 'GE',
  'Saint Kitts and Nevis': 'KN',
  Yemen: 'YE',
  'Puerto Rico': 'PR',
  Eritrea: 'ER',
  Madagascar: 'MG',
  Aruba: 'AW',
  Libya: 'LY',
  'Svalbard and Jan Mayen': 'SJ',
  Sweden: 'SE',
  'South Georgia and the South Sandwich Islands': 'GS',
  'Saint Martin': 'MF',
  Malawi: 'MW',
  Andorra: 'AD',
  Liechtenstein: 'LI',
  Poland: 'PL',
  Jordan: 'JO',
  Bulgaria: 'BG',
  Tunisia: 'TN',
  'United Arab Emirates': 'AE',
  Tuvalu: 'TV',
  Kenya: 'KE',
  'French Polynesia': 'PF',
  Lebanon: 'LB',
  Djibouti: 'DJ',
  Brunei: 'BN',
  Cuba: 'CU',
  Azerbaijan: 'AZ',
  'Czech Republic': 'CZ',
  'Saint Lucia': 'LC',
  Mauritania: 'MR',
  Guernsey: 'GG',
  Mayotte: 'YT',
  'San Marino': 'SM',
  Israel: 'IL',
  Australia: 'AU',
  Tajikistan: 'TJ',
  Cameroon: 'CM',
  Gibraltar: 'GI',
  Cyprus: 'CY',
  'Northern Mariana Islands': 'MP',
  Malaysia: 'MY',
  Oman: 'OM',
  Iceland: 'IS',
  Armenia: 'AM',
  Gabon: 'GA',
  Luxembourg: 'LU',
  'Hong Kong SAR China': 'HK',
  Brazil: 'BR',
  'Turks and Caicos Islands': 'TC',
  Algeria: 'DZ',
  Slovenia: 'SI',
  Jersey: 'JE',
  'Antigua and Barbuda': 'AG',
  Ecuador: 'EC',
  Colombia: 'CO',
  Moldova: 'MD',
  'Cocos [Keeling] Islands': 'CC',
  Vanuatu: 'VU',
  Italy: 'IT',
  Honduras: 'HN',
  Antarctica: 'AQ',
  Nauru: 'NR',
  Haiti: 'HT',
  Burundi: 'BI',
  Afghanistan: 'AF',
  Singapore: 'SG',
  'French Guiana': 'GF',
  'Christmas Island': 'CX',
  'American Samoa': 'AS',
  'Vatican City': 'VA',
  Russia: 'RU',
  'Macau SAR China': 'MO',
  Netherlands: 'NL',
  China: 'CN',
  'British Antarctic Territory': 'BQ',
  Martinique: 'MQ',
  'Saint Pierre and Miquelon': 'PM',
  Kyrgyzstan: 'KG',
  Bhutan: 'BT',
  Romania: 'RO',
  Togo: 'TG',
  Philippines: 'PH',
  Uzbekistan: 'UZ',
  'Myanmar [Burma]': 'MM',
  'British Virgin Islands': 'VG',
  Zimbabwe: 'ZW',
  'Congo - Kinshasa': 'CD',
  'British Indian Ocean Territory': 'IO',
  Montenegro: 'ME',
  Indonesia: 'ID',
  Dominica: 'DM',
  Benin: 'BJ',
  Angola: 'AO',
  Sudan: 'SD',
  'Congo - Brazzaville': 'CG',
  Portugal: 'PT',
  'New Caledonia': 'NC',
  'North Korea': 'KP',
  Grenada: 'GD',
  Greece: 'GR',
  'Cayman Islands': 'KY',
  'Sint Maarten (Dutch Part)': 'SX',
  Mongolia: 'MN',
  Latvia: 'LV',
  Morocco: 'MA',
  Iran: 'IR',
  'U.S. Minor Outlying Islands': 'UM',
  Guyana: 'GY',
  Guatemala: 'GT',
  Iraq: 'IQ',
  Chile: 'CL',
  Nepal: 'NP',
  'Heard Island and McDonald Islands': 'HM',
  'Isle of Man': 'IM',
  Ukraine: 'UA',
  Tanzania: 'TZ',
  Ghana: 'GH',
  Curaçao: 'CW',
  Anguilla: 'AI',
  India: 'IN',
  Canada: 'CA',
  Maldives: 'MV',
  Turkey: 'TR',
  Belgium: 'BE',
  Taiwan: 'TW',
  'Trinidad and Tobago': 'TT',
  'South Africa': 'ZA',
  Bermuda: 'BM',
  'Central African Republic': 'CF',
  Jamaica: 'JM',
  Turkmenistan: 'TM',
  Peru: 'PE',
  Germany: 'DE',
  Tokelau: 'TK',
  Fiji: 'FJ',
  'United States': 'US',
  Guinea: 'GN',
  Somalia: 'SO',
  Chad: 'TD',
  'Pitcairn Islands': 'PN',
  Thailand: 'TH',
  Kiribati: 'KI',
  'Equatorial Guinea': 'GQ',
  'Costa Rica': 'CR',
  Vietnam: 'VN',
  'São Tomé and Príncipe': 'ST',
  Nigeria: 'NG',
  Kuwait: 'KW',
  Croatia: 'HR',
  Uruguay: 'UY',
  'Sri Lanka': 'LK',
  'Cook Islands': 'CK',
  'Timor-Leste': 'TL',
  'United Kingdom': 'GB',
  Switzerland: 'CH',
  Samoa: 'WS',
  Spain: 'ES',
  Venezuela: 'VE',
  Liberia: 'LR',
  'Burkina Faso': 'BF',
  Swaziland: 'SZ',
  'Saint Barthélemy': 'BL',
  Palau: 'PW',
  Estonia: 'EE',
  'Wallis and Futuna': 'WF',
  Niue: 'NU',
  'South Korea': 'KR',
  Austria: 'AT',
  Mozambique: 'MZ',
  'El Salvador': 'SV',
  Monaco: 'MC',
  Guam: 'GU',
  Lesotho: 'LS',
  Tonga: 'TO',
  'Western Sahara': 'EH',
  'South Sudan': 'SS',
  Réunion: 'RE',
  Hungary: 'HU',
  Japan: 'JP',
  Belarus: 'BY',
  Mauritius: 'MU',
  'Bouvet Island': 'BV',
  'Norfolk Island': 'NF',
  Albania: 'AL',
  'New Zealand': 'NZ',
  Senegal: 'SN',
  Ethiopia: 'ET',
  Egypt: 'EG',
  'Sierra Leone': 'SL',
  Bolivia: 'BO',
  Malta: 'MT',
  'Saudi Arabia': 'SA',
  'Cape Verde': 'CV',
  Pakistan: 'PK',
  Gambia: 'GM',
  Qatar: 'QA',
  Ireland: 'IE',
  'U.S. Virgin Islands': 'VI',
  Slovakia: 'SK',
  Serbia: 'RS',
  Lithuania: 'LT',
  France: 'FR',
  'Bosnia and Herzegovina': 'BA',
  Niger: 'NE',
  Rwanda: 'RW',
  'French Southern Territories': 'TF',
  Bangladesh: 'BD',
  Nicaragua: 'NI',
  Barbados: 'BB',
  Norway: 'NO',
  'Saint Vincent and the Grenadines': 'VC',
  Botswana: 'BW',
  'Dominican Republic': 'DO',
  Denmark: 'DK',
  Uganda: 'UG',
  Mexico: 'MX',
  Suriname: 'SR',
  Micronesia: 'FM',
  'Saint Helena': 'SH',
  Greenland: 'GL',
}
