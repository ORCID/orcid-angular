import { MonthDayYearDate, Value, Visibility } from './common.endpoint';

export interface RecordCountryCodesEndpoint {
  [key: string]: string
}

export interface Address {
  visibility: Visibility;
  errors: any[];
  iso2Country: Value;
  countryName: string;
  putCode: string;
  displayIndex: number;
  createdDate: MonthDayYearDate;
  lastModified: MonthDayYearDate;
  source: string;
  sourceName: string;
  assertionOriginOrcid?: any;
  assertionOriginClientId?: any;
  assertionOriginName?: any;
}


export interface CountriesEndpoint {
  errors: string[]
  addresses: Address[]
  visibility: Visibility
}