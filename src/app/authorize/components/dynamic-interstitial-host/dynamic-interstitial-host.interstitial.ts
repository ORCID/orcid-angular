import { Directive, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[app-dynamic-interstitial-host]',
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
