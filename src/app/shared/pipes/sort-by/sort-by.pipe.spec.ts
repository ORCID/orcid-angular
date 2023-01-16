import { SortByPipe } from './sort-by.pipe'
import { getCountries } from '../../../core/record-countries/record-countries.service.spec'

describe('SortByPipe', () => {
  let pipe: SortByPipe

  beforeEach(() => {
    pipe = new SortByPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should sort contributors alphabetically in ascending order', () => {
    const countriesSorted = [
      { key: 'Albania', value: 'AL' },
      { key: 'Mexico', value: 'MX' },
      { key: 'South Africa', value: 'ZA' },
    ]

    expect(
      equalsCheck(
        pipe.transform(getUnsortedCountries(), 'asc', 'key'),
        countriesSorted
      )
    ).toEqual(true)
  })

  it('should sort contributors alphabetically in ascending order in portuguese', () => {
    const countriesSorted = [
      { key: 'Áustria', value: 'AT' },
      { key: 'Estados Unidos', value: 'US' },
      { key: 'México', value: 'MX' },
    ]

    expect(
      equalsCheck(
        pipe.transform(getUnsortedCountriesPortuguese(), 'asc', 'key'),
        countriesSorted
      )
    ).toEqual(true)
  })
})

export const getUnsortedCountries = (): { key: string; value: string }[] => {
  const countries = getCountries()
  return [countries[1], countries[2], countries[0]]
}

const getUnsortedCountriesPortuguese = (): { key: string; value: string }[] => {
  return [
    { key: 'Estados Unidos', value: 'US' },
    { key: 'México', value: 'MX' },
    { key: 'Áustria', value: 'AT' },
  ]
}

const equalsCheck = (
  a: { key: string; value: string }[],
  b: { key: string; value: string }[]
) => a.length === b.length && a.every((v, i) => v.key === b[i].key)
