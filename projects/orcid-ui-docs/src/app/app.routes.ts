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
    path: 'material-buttons-directives',
    loadComponent: () =>
      import('./pages/material-buttons-directives-page.component').then(
        (m) => m.MaterialButtonsDirectivesPageComponent
      ),
  },
  {
    path: 'alert-message',
    loadComponent: () =>
      import('./pages/alert-message-page.component').then(
        (m) => m.AlertMessagePageComponent
      ),
  },
  {
    path: 'action-surface',
    loadComponent: () =>
      import('./pages/action-surface-page.component').then(
        (m) => m.ActionSurfacePageComponent
      ),
  },
  {
    path: 'action-surface-container',
    loadComponent: () =>
      import('./pages/action-surface-container-page.component').then(
        (m) => m.ActionSurfaceContainerPageComponent
      ),
  },
  {
    path: 'registry-permission-notifications',
    loadComponent: () =>
      import('./pages/registry-permission-notifications-page.component').then(
        (m) => m.RegistryPermissionNotificationsPageComponent
      ),
  },
  {
    path: 'panel',
    loadComponent: () =>
      import('./pages/panel-page.component').then((m) => m.PanelPageComponent),
  },
  {
    path: 'skeleton-placeholder',
    loadComponent: () =>
      import('./pages/skeleton-placeholder-page.component').then(
        (m) => m.SkeletonPlaceholderPageComponent
      ),
  },
  {
    path: 'two-factor-auth-form',
    loadComponent: () =>
      import('./pages/two-factor-auth-form-page.component').then(
        (m) => m.TwoFactorAuthFormPageComponent
      ),
  },
]
