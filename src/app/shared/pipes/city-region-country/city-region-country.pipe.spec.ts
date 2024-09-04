import { CityRegionCountry } from './city-region-country.pipe'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RegionCityCountryPipe', () => {
  it('create an instance', () => {
    const pipe = new CityRegionCountry()
    expect(pipe).toBeTruthy()
  })
})
