import { Component } from '@angular/core'

@Component({
  selector: 'orcid-typography-page',
  standalone: true,
  templateUrl: './typography-page.component.html',
  styleUrl: './typography-page.component.scss',
})
export class TypographyPageComponent {
  weightScale: { var: string; value: string | number }[] = [
    { var: '--orcid-font-weight-light', value: 200 },
    { var: '--orcid-font-weight-regular', value: 300 },
    { var: '--orcid-font-weight-normal', value: 400 },
    { var: '--orcid-font-weight-medium', value: 500 },
    { var: '--orcid-font-weight-semibold', value: 600 },
    { var: '--orcid-font-weight-bold', value: 700 },
  ]

  sizeScale: { var: string; size: string; lineHeight: string; letterSpacing: string }[] = [
    { var: '--orcid-font-size-display-large', size: '96px', lineHeight: '96px', letterSpacing: '-1.5px' },
    { var: '--orcid-font-size-display', size: '60px', lineHeight: 'normal', letterSpacing: '-0.5px' },
    { var: '--orcid-font-size-display-small', size: '48px', lineHeight: '48px', letterSpacing: '0' },
    { var: '--orcid-font-size-heading-large', size: '40px', lineHeight: 'normal', letterSpacing: '0.5px' },
    { var: '--orcid-font-size-heading', size: '32px', lineHeight: 'normal', letterSpacing: '0.5px' },
    { var: '--orcid-font-size-heading-small', size: '24px', lineHeight: 'normal', letterSpacing: '0.5px' },
    { var: '--orcid-font-size-heading-6', size: '20px', lineHeight: 'normal', letterSpacing: '0.15px' },
    { var: '--orcid-font-size-body-large', size: '18px', lineHeight: 'normal', letterSpacing: 'normal' },
    { var: '--orcid-font-size-body', size: '16px', lineHeight: '20px', letterSpacing: 'normal' },
    { var: '--orcid-font-size-body-small', size: '14px', lineHeight: '24px', letterSpacing: '0.25px' },
    { var: '--orcid-font-size-small-print', size: '12px', lineHeight: '16px', letterSpacing: '0.5px' },
  ]
}
