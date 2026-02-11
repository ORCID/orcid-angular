import { Directive, HostBinding, Input } from '@angular/core'

@Directive({
  selector: '[orcidBrandSecondaryDarkButton]',
  standalone: true,
})
export class BrandSecondaryDarkButtonDirective {
  @Input() orcidBrandSecondaryDarkButton: boolean | '' = true

  private get enabled(): boolean {
    return this.orcidBrandSecondaryDarkButton !== false
  }

  @HostBinding('style.--mdc-filled-button-container-color')
  get filledContainerColor(): string | null {
    return this.enabled ? 'var(--orcid-color-brand-secondary-dark, #085c77)' : null
  }

  @HostBinding('style.--mdc-filled-button-hover-container-color')
  get filledHoverColor(): string | null {
    return this.enabled ? 'var(--orcid-color-brand-secondary-dark, #085c77)' : null
  }

  @HostBinding('style.--mdc-filled-button-label-text-color')
  get filledLabelColor(): string | null {
    return this.enabled ? 'var(--orcid-color-brand-white, #ffffff)' : null
  }

  @HostBinding('style.--mat-button-filled-container-color')
  get matFilledContainerColor(): string | null {
    return this.enabled ? 'var(--orcid-color-brand-secondary-dark, #085c77)' : null
  }

  @HostBinding('style.--mat-button-filled-label-text-color')
  get matFilledLabelColor(): string | null {
    return this.enabled ? 'var(--orcid-color-brand-white, #ffffff)' : null
  }

  @HostBinding('style.background-color')
  get backgroundColor(): string | null {
    return this.enabled ? 'var(--orcid-color-brand-secondary-dark, #085c77)' : null
  }

  @HostBinding('style.color')
  get textColor(): string | null {
    return this.enabled ? 'var(--orcid-color-brand-white, #ffffff)' : null
  }

  @HostBinding('style.border')
  get border(): string | null {
    return this.enabled
      ? '1px solid var(--orcid-color-brand-secondary-dark, #085c77)'
      : null
  }

  @HostBinding('style.border-radius')
  get borderRadius(): string | null {
    return this.enabled ? '4px' : null
  }
}
