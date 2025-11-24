import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/overview-page.component').then(
        (m) => m.OverviewPageComponent
      ),
  },
  {
    path: 'colors',
    loadComponent: () =>
      import('./pages/colors-page.component').then(
        (m) => m.ColorsPageComponent
      ),
  },
  {
    path: 'typography',
    loadComponent: () =>
      import('./pages/typography-page.component').then(
        (m) => m.TypographyPageComponent
      ),
  },
  {
    path: 'record-header',
    loadComponent: () =>
      import('./pages/record-header-page.component').then(
        (m) => m.RecordHeaderPageComponent
      ),
  },
  {
    path: 'text-with-tooltip',
    loadComponent: () =>
      import('./pages/text-with-tooltip-page.component').then(
        (m) => m.TextWithTooltipPageComponent
      ),
  },
  {
    path: 'accent-button',
    loadComponent: () =>
      import('./pages/accent-button-page.component').then(
        (m) => m.AccentButtonPageComponent
      ),
  },
  {
    path: 'alert-message',
    loadComponent: () =>
      import('./pages/alert-message-page.component').then(
        (m) => m.AlertMessagePageComponent
      ),
  },
]
