import { Directive, ElementRef } from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mde-popover-target, [mdePopoverTarget]',
  exportAs: 'mdePopoverTarget',
})
// tslint:disable-next-line: directive-class-suffix
export class MdePopoverTarget {
  // tslint:disable-line:directive-class-suffix

  constructor(public _elementRef: ElementRef) {}
}
