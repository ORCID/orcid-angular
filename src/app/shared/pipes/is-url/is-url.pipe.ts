import { Pipe, PipeTransform } from '@angular/core'
import { URL_REGEXP } from '../../../constants'

@Pipe({
    name: 'isUrl',
    standalone: false
})
export class IsUrlPipe implements PipeTransform {
  transform(value: string): boolean {
    return RegExp(URL_REGEXP).test(value)
  }
}
