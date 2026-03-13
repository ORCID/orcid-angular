import { Component } from '@angular/core'

interface ColorToken {
  name: string
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
  /** Only defined colours for now (design system brand palette). */
  brandColours: ColorToken[] = [
    { name: 'brand-logo-grey', value: '#A6A8AB', foreground: '#222222' },
    { name: 'brand-primary', value: '#A6CE39', foreground: '#222222' },
    { name: 'brand-primary-light', value: '#D4E7A1', foreground: '#222222' },
    { name: 'brand-primary-lightest', value: '#F5F9E8', foreground: '#222222' },
    { name: 'brand-primary-dark', value: '#7FAA26', foreground: '#ffffff' },
    { name: 'brand-primary-darkest', value: '#447405', foreground: '#ffffff' },
    { name: 'brand-secondary', value: '#2E7F9F', foreground: '#ffffff' },
    { name: 'brand-secondary-light', value: '#8EC2DB', foreground: '#222222' },
    { name: 'brand-secondary-dark', value: '#085C77', foreground: '#ffffff' },
    { name: 'brand-secondary-darkest', value: '#003449', foreground: '#ffffff' },
    { name: 'brand-tertiary-lightest', value: '#DCCDDB', foreground: '#222222' },
    { name: 'brand-citrus-lemon', value: '#FFC814', foreground: '#222222' },
    { name: 'brand-citrus-lemon-lightest', value: '#FFFCF3', foreground: '#222222' },
  ]
}
