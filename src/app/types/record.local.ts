import {
  Person,
  Emails,
  OtherNames,
  Countries,
  Keywords,
  Website,
  ExternalIdentifier,
  Names,
  Preferences,
  Biography,
} from '.'

export interface UserRecord {
  person: Person
  emails: Emails
  otherNames: OtherNames
  countries: Countries
  keyword: Keywords
  website: Website
  externalIdentifier: ExternalIdentifier
  names: Names
  biography: Biography
  preferences: Preferences
}
