import { Pipe, PipeTransform } from '@angular/core'
import { URL_REGEXP_BACKEND } from '../../../constants'

@Pipe({
  name: 'isUrlWithProtocol',
  standalone: false,
})
export class IsUrlWithProtocolPipe implements PipeTransform {
  transform(value: string): boolean {
    return RegExp(URL_REGEXP_BACKEND).test(value)
  }
}
