import { Component } from '@angular/core'

export interface TypeScaleItem {
  sizeVar: string
  size: string
  lineHeightVar: string
  lineHeight: string
  letterSpacingVar: string
  letterSpacing: string
  specimenClass: string
  previewText: string
  isParagraph?: boolean
}

@Component({
  selector: 'orcid-typography-page',
  standalone: true,
  imports: [],
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

  /** Type scale: size, line-height, letter-spacing (aligned with tokens.css and Figma style guide). */
  readonly typeScale: TypeScaleItem[] = [
    {
      sizeVar: '--orcid-font-size-display-large',
      size: '96px',
      lineHeightVar: '--orcid-line-height-display-large',
      lineHeight: '120px',
      letterSpacingVar: '--orcid-letter-spacing-display-large',
      letterSpacing: '-1.5px',
      specimenClass: 'specimen-display-large',
      previewText: 'Display Large',
    },
    {
      sizeVar: '--orcid-font-size-display',
      size: '60px',
      lineHeightVar: '--orcid-line-height-display',
      lineHeight: 'normal',
      letterSpacingVar: '--orcid-letter-spacing-display',
      letterSpacing: '-0.5px',
      specimenClass: 'specimen-display',
      previewText: 'Display',
    },
    {
      sizeVar: '--orcid-font-size-display-small',
      size: '48px',
      lineHeightVar: '--orcid-line-height-display-small',
      lineHeight: '48px',
      letterSpacingVar: '--orcid-letter-spacing-display-small',
      letterSpacing: '0',
      specimenClass: 'specimen-display-small',
      previewText: 'Display Small',
    },
    {
      sizeVar: '--orcid-font-size-heading-large',
      size: '40px',
      lineHeightVar: '--orcid-line-height-heading-large',
      lineHeight: 'normal',
      letterSpacingVar: '--orcid-letter-spacing-heading-large',
      letterSpacing: '0.5px',
      specimenClass: 'specimen-heading-large',
      previewText: 'Heading Large',
    },
    {
      sizeVar: '--orcid-font-size-heading',
      size: '32px',
      lineHeightVar: '--orcid-line-height-heading',
      lineHeight: 'normal',
      letterSpacingVar: '--orcid-letter-spacing-heading',
      letterSpacing: '0.5px',
      specimenClass: 'specimen-heading',
      previewText: 'Heading',
    },
    {
      sizeVar: '--orcid-font-size-heading-small',
      size: '24px',
      lineHeightVar: '--orcid-line-height-heading-small',
      lineHeight: 'normal',
      letterSpacingVar: '--orcid-letter-spacing-heading-small',
      letterSpacing: '0.5px',
      specimenClass: 'specimen-heading-small',
      previewText: 'Heading Small',
    },
    {
      sizeVar: '--orcid-font-size-heading-6',
      size: '20px',
      lineHeightVar: '--orcid-line-height-heading-6',
      lineHeight: 'normal',
      letterSpacingVar: '--orcid-letter-spacing-heading-6',
      letterSpacing: '0.15px',
      specimenClass: 'specimen-heading-6',
      previewText: 'Heading 6',
    },
    {
      sizeVar: '--orcid-font-size-body-large',
      size: '18px',
      lineHeightVar: '--orcid-line-height-body-large',
      lineHeight: 'normal',
      letterSpacingVar: '--orcid-letter-spacing-body-large',
      letterSpacing: 'normal',
      specimenClass: 'specimen-body-large',
      previewText:
        'Researchers use ORCID to distinguish their work and connect their contributions across systems. This is body large text for lead paragraphs or emphasis.',
      isParagraph: true,
    },
    {
      sizeVar: '--orcid-font-size-body',
      size: '16px',
      lineHeightVar: '--orcid-line-height-body',
      lineHeight: '20px',
      letterSpacingVar: '--orcid-letter-spacing-body',
      letterSpacing: 'normal',
      specimenClass: 'specimen-body',
      previewText:
        'Researchers use ORCID to distinguish their work and connect their contributions across systems. Body text is the default for most content and should remain readable at this size.',
      isParagraph: true,
    },
    {
      sizeVar: '--orcid-font-size-body-small',
      size: '14px',
      lineHeightVar: '--orcid-line-height-body-small',
      lineHeight: '24px',
      letterSpacingVar: '--orcid-letter-spacing-body-small',
      letterSpacing: '0.25px',
      specimenClass: 'specimen-body-small',
      previewText:
        'Body small is used for captions and secondary text. Researchers use ORCID to distinguish their work and connect their contributions across systems.',
      isParagraph: true,
    },
    {
      sizeVar: '--orcid-font-size-small-print',
      size: '12px',
      lineHeightVar: '--orcid-line-height-small-print',
      lineHeight: '16px',
      letterSpacingVar: '--orcid-letter-spacing-small-print',
      letterSpacing: '0.5px',
      specimenClass: 'specimen-small-print',
      previewText:
        'Small print is for labels and fine print. Researchers use ORCID to distinguish their work. Keep line length comfortable for reading at this size.',
      isParagraph: true,
    },
  ]
}
