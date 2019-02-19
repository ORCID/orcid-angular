import { Pipe, PipeTransform } from '@angular/core'
import { OrgDisambiguated } from '../../../types'

@Pipe({
  name: 'regionCityCountry',
})
export class RegionCityCountryPipe implements PipeTransform {
  transform(orgDisambiguated: OrgDisambiguated, args?: any): string {
    let value = ''
    if (orgDisambiguated) {
      value += orgDisambiguated.region ? orgDisambiguated.region : ''
      value += orgDisambiguated.city
        ? orgDisambiguated.region
          ? ', ' + orgDisambiguated.city
          : orgDisambiguated.city
        : ''

      value += orgDisambiguated.country
        ? orgDisambiguated.city
          ? ', ' + orgDisambiguated.country
          : orgDisambiguated.country
        : ''
    }
    return value
  }
}
