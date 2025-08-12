import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'replaceText',
  standalone: false,
})
export class ReplaceTextPipe implements PipeTransform {
  transform(input: any, pattern: any, replacement: any): any {
    let toreturn = input.replace(pattern, replacement)
    return toreturn
  }
}
