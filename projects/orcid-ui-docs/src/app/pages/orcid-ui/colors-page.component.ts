import { Component } from '@angular/core'

interface ColorToken {
  name: string
  var: string
  value: string
  foreground: string
}

@Component({
  selector: 'orcid-colors-page',
  standalone: true,
  templateUrl: './colors-page.component.html',
  styleUrl: './colors-page.component.scss',
})
export class ColorsPageComponent {
  /** Orcid Design official brand palette (in tokens.css/scss/json). */
  brandColours: ColorToken[] = [
    {
      name: 'brand-logo-grey',
      var: '--orcid-color-brand-logo-grey',
      value: '#A6A8AB',
      foreground: '#222222',
    },
    {
      name: 'brand-primary',
      var: '--orcid-color-brand-primary',
      value: '#A6CE39',
      foreground: '#222222',
    },
    {
      name: 'brand-primary-light',
      var: '--orcid-color-brand-primary-light',
      value: '#D4E7A1',
      foreground: '#222222',
    },
    {
      name: 'brand-primary-lightest',
      var: '--orcid-color-brand-primary-lightest',
      value: '#F5F9E8',
      foreground: '#222222',
    },
    {
      name: 'brand-primary-dark',
      var: '--orcid-color-brand-primary-dark',
      value: '#7FAA26',
      foreground: '#ffffff',
    },
    {
      name: 'brand-primary-darkest',
      var: '--orcid-color-brand-primary-darkest',
      value: '#447405',
      foreground: '#ffffff',
    },
    {
      name: 'brand-secondary',
      var: '--orcid-color-brand-secondary',
      value: '#2E7F9F',
      foreground: '#ffffff',
    },
    {
      name: 'brand-secondary-light',
      var: '--orcid-color-brand-secondary-light',
      value: '#8EC2DB',
      foreground: '#222222',
    },
    {
      name: 'brand-secondary-dark',
      var: '--orcid-color-brand-secondary-dark',
      value: '#085C77',
      foreground: '#ffffff',
    },
    {
      name: 'brand-secondary-darkest',
      var: '--orcid-color-brand-secondary-darkest',
      value: '#003449',
      foreground: '#ffffff',
    },
    {
      name: 'brand-tertiary-lightest',
      var: '--orcid-color-brand-tertiary-lightest',
      value: '#DCCDDB',
      foreground: '#222222',
    },
    {
      name: 'brand-citrus-lemon',
      var: '--orcid-color-brand-citrus-lemon',
      value: '#FFC814',
      foreground: '#222222',
    },
    {
      name: 'brand-citrus-lemon-lightest',
      var: '--orcid-color-brand-citrus-lemon-lightest',
      value: '#FFFCF3',
      foreground: '#222222',
    },
  ]

  /** State colours: warning, notice, info (with light/lightest/dark/darkest). */
  stateColours: ColorToken[] = [
    {
      name: 'state-warning',
      var: '--orcid-color-state-warning',
      value: '#F44336',
      foreground: '#ffffff',
    },
    {
      name: 'state-warning-light',
      var: '--orcid-color-state-warning-light',
      value: '#FFCDD2',
      foreground: '#222222',
    },
    {
      name: 'state-warning-lightest',
      var: '--orcid-color-state-warning-lightest',
      value: '#FFEBEE',
      foreground: '#222222',
    },
    {
      name: 'state-warning-dark',
      var: '--orcid-color-state-warning-dark',
      value: '#D32F2F',
      foreground: '#ffffff',
    },
    {
      name: 'state-warning-darkest',
      var: '--orcid-color-state-warning-darkest',
      value: '#B71C1C',
      foreground: '#ffffff',
    },
    {
      name: 'state-notice',
      var: '--orcid-color-state-notice',
      value: '#FFBF00',
      foreground: '#222222',
    },
    {
      name: 'state-notice-light',
      var: '--orcid-color-state-notice-light',
      value: '#FFDF72',
      foreground: '#222222',
    },
    {
      name: 'state-notice-lightest',
      var: '--orcid-color-state-notice-lightest',
      value: '#FFECAB',
      foreground: '#222222',
    },
    {
      name: 'state-notice-dark',
      var: '--orcid-color-state-notice-dark',
      value: '#FF9C00',
      foreground: '#222222',
    },
    {
      name: 'state-notice-darkest',
      var: '--orcid-color-state-notice-darkest',
      value: '#FF6400',
      foreground: '#ffffff',
    },
    {
      name: 'state-info',
      var: '--orcid-color-state-info',
      value: '#2962FF',
      foreground: '#ffffff',
    },
    {
      name: 'state-info-light',
      var: '--orcid-color-state-info-light',
      value: '#64B5F6',
      foreground: '#222222',
    },
    {
      name: 'state-info-lightest',
      var: '--orcid-color-state-info-lightest',
      value: '#BBDEFB',
      foreground: '#222222',
    },
    {
      name: 'state-info-dark',
      var: '--orcid-color-state-info-dark',
      value: '#1565C0',
      foreground: '#ffffff',
    },
    {
      name: 'state-info-darkest',
      var: '--orcid-color-state-info-darkest',
      value: '#0D47A1',
      foreground: '#ffffff',
    },
  ]

  /** Visibility colours: everyone, trusted, only me. */
  visibilityColours: ColorToken[] = [
    {
      name: 'visibility-everyone',
      var: '--orcid-color-visibility-everyone',
      value: '#00A500',
      foreground: '#ffffff',
    },
    {
      name: 'visibility-trusted',
      var: '--orcid-color-visibility-trusted',
      value: '#FFBD32',
      foreground: '#222222',
    },
    {
      name: 'visibility-onlyme',
      var: '--orcid-color-visibility-onlyme',
      value: '#AB1600',
      foreground: '#ffffff',
    },
  ]

  /** UI background scale (light to dark). */
  uiBackgroundColours: ColorToken[] = [
    {
      name: 'ui-background',
      var: '--orcid-color-ui-background',
      value: '#BDBDBD',
      foreground: '#222222',
    },
    {
      name: 'ui-background-light',
      var: '--orcid-color-ui-background-light',
      value: '#EEEEEE',
      foreground: '#222222',
    },
    {
      name: 'ui-background-lightest',
      var: '--orcid-color-ui-background-lightest',
      value: '#FAFAFA',
      foreground: '#222222',
    },
    {
      name: 'ui-background-dark',
      var: '--orcid-color-ui-background-dark',
      value: '#616161',
      foreground: '#ffffff',
    },
    {
      name: 'ui-background-darkest',
      var: '--orcid-color-ui-background-darkest',
      value: '#212121',
      foreground: '#ffffff',
    },
  ]
}
