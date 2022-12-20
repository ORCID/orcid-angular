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

    expect(pipe.transform(getUnsortedCountries(), 'asc', 'key')).toEqual(countriesSorted)
  })
})


export const getUnsortedCountries = (): { key: string; value: string }[] => {
  const countries = getCountries()
  return [
    countries[1],
    countries[2],
    countries[0],
  ]
}
