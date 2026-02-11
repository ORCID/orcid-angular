import { Directive, HostBinding, Input } from '@angular/core'

@Directive({
  selector: '[orcidUnderlineButton]',
  standalone: true,
})
export class UnderlineButtonDirective {
  @Input() orcidUnderlineButton: boolean | '' = true

  private get enabled(): boolean {
    return this.orcidUnderlineButton !== false
  }

  @HostBinding('style.text-decoration')
  get textDecoration(): string | null {
    return this.enabled ? 'underline' : null
  }

  @HostBinding('style.text-underline-offset')
  get underlineOffset(): string | null {
    return this.enabled ? '3px' : null
  }

  @HostBinding('style.color')
  get textColor(): string | null {
    return this.enabled
      ? 'var(--orcid-color-brand-secondary-dark, #085c77)'
      : null
  }

  @HostBinding('style.--mdc-text-button-label-text-color')
  get mdcTextButtonLabelColor(): string | null {
    return this.enabled
      ? 'var(--orcid-color-brand-secondary-dark, #085c77)'
      : null
  }

  @HostBinding('style.--mat-text-button-label-text-color')
  get matTextButtonLabelColor(): string | null {
    return this.enabled
      ? 'var(--orcid-color-brand-secondary-dark, #085c77)'
      : null
  }
}
