import {
  Person,
  EmailsEndpoint,
  OtherNamesEndPoint,
  CountriesEndpoint,
  Keywords,
  Website,
  ExternalIdentifier,
  NamesEndPoint,
  Preferences,
  BiographyEndPoint,
} from '.'

export interface UserRecord {
  person: Person
  emails: EmailsEndpoint
  otherNames: OtherNamesEndPoint
  countries: CountriesEndpoint
  keyword: Keywords
  website: Website
  externalIdentifier: ExternalIdentifier
  names: NamesEndPoint
  biography: BiographyEndPoint
  preferences: Preferences
}
