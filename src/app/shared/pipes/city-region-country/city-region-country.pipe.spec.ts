import { CityRegionCountry } from './city-region-country.pipe'

describe('RegionCityCountryPipe', () => {
  it('create an instance', () => {
    const pipe = new CityRegionCountry()
    expect(pipe).toBeTruthy()
  })
})
