import { Component } from '@angular/core'

@Component({
  selector: 'orcid-spacing-page',
  standalone: true,
  templateUrl: './spacing-page.component.html',
  styleUrl: './spacing-page.component.scss',
})
export class SpacingPageComponent {
  spacingTokens: { name: string; var: string; value: string; pixels: number }[] = [
    { name: 'XXS', var: '--orcid-space-xxs', value: '2px', pixels: 2 },
    { name: 'XS', var: '--orcid-space-xs', value: '4px', pixels: 4 },
    { name: 'S', var: '--orcid-space-s', value: '8px', pixels: 8 },
    { name: 'Base', var: '--orcid-space-base', value: '16px', pixels: 16 },
    { name: 'M', var: '--orcid-space-m', value: '24px', pixels: 24 },
    { name: 'L', var: '--orcid-space-l', value: '32px', pixels: 32 },
    { name: 'XL', var: '--orcid-space-xl', value: '64px', pixels: 64 },
  ]
}
