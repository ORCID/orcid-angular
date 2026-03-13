import { Component } from '@angular/core'

@Component({
  selector: 'orcid-spacing-page',
  standalone: true,
  templateUrl: './spacing-page.component.html',
  styleUrl: './spacing-page.component.scss',
})
export class SpacingPageComponent {
  spacingTokens: { name: string; var: string; value: string; pixels: number; displayWidth: number }[] = [
    { name: 'XXS', var: '--orcid-space-xxs', value: '2px', pixels: 2, displayWidth: 12 },
    { name: 'XS', var: '--orcid-space-xs', value: '4px', pixels: 4, displayWidth: 16 },
    { name: 'S', var: '--orcid-space-s', value: '8px', pixels: 8, displayWidth: 24 },
    { name: 'Base', var: '--orcid-space-base', value: '16px', pixels: 16, displayWidth: 32 },
    { name: 'M', var: '--orcid-space-m', value: '24px', pixels: 24, displayWidth: 44 },
    { name: 'L', var: '--orcid-space-l', value: '32px', pixels: 32, displayWidth: 52 },
    { name: 'XL', var: '--orcid-space-xl', value: '64px', pixels: 64, displayWidth: 64 },
  ]
}
