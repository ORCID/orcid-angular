// Use Ben Nadel solution shown on
// https://www.bennadel.com/blog/3633-giving-click-anchor-links-tab-access-using-a-directive-in-angular-7-2-15.htm
import { Directive, HostBinding, HostListener } from '@angular/core'

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: `a[click]:not([href]):not([role]):not([tabindex]),
     a[matMenuTriggerFor]:not([href]):not([role]):not([tabindex])`,
  standalone: false,
})
export class A11yLinkDirective {
  @HostBinding('attr.role') role = 'button'
  @HostBinding('attr.tabindex') tabindex = '0'
  @HostListener('keydown', ['$event'])
  onKeyDown(e: any) {
    if (e.which === 13 || e.which === 32) {
      e.preventDefault()
      e.target.click()
    }
  }
}
