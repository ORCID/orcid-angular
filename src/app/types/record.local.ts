import { Person, ExternalIdentifier, Preferences } from '.'
import { OtherNamesEndPoint } from './record-other-names.endpoint'
import { KeywordEndPoint } from './record-keyword.endpoint'
import { NamesEndPoint } from './record-name.endpoint'
import { BiographyEndPoint } from './record-biography.endpoint'
import { CountriesEndpoint } from './record-country.endpoint'
import { EmailsEndpoint } from './record-email.endpoint'
import { WebsitesEndPoint } from './record-websites.endpoint'

export interface UserRecord {
  person: Person
  emails: EmailsEndpoint
  otherNames: OtherNamesEndPoint
  countries: CountriesEndpoint
  keyword: KeywordEndPoint
  website: WebsitesEndPoint
  externalIdentifier: ExternalIdentifier
  names: NamesEndPoint
  biography: BiographyEndPoint
  preferences: Preferences
}
