import { Pipe, PipeTransform } from '@angular/core'
import { OrgDisambiguated } from 'src/app/types'

@Pipe({
    name: 'cityRegionCountry',
    standalone: false
})
export class CityRegionCountry implements PipeTransform {
  transform(orgDisambiguated: OrgDisambiguated, args?: any): string {
    let value = ''
    if (orgDisambiguated) {
      value += orgDisambiguated.city ? orgDisambiguated.city : ''
      value += orgDisambiguated.region
        ? orgDisambiguated.city
          ? ', ' + orgDisambiguated.region
          : orgDisambiguated.region
        : ''

      value += orgDisambiguated.country
        ? value
          ? ', ' + orgDisambiguated.country
          : orgDisambiguated.country
        : ''
    }
    return value
  }
}
