import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/orcid-ui/overview-page.component').then(
        (m) => m.OverviewPageComponent
      ),
  },
  {
    path: 'colors',
    loadComponent: () =>
      import('./pages/orcid-ui/colors-page.component').then(
        (m) => m.ColorsPageComponent
      ),
  },
  {
    path: 'typography',
    loadComponent: () =>
      import('./pages/orcid-ui/typography-page.component').then(
        (m) => m.TypographyPageComponent
      ),
  },
  {
    path: 'spacing',
    loadComponent: () =>
      import('./pages/orcid-ui/spacing-page.component').then(
        (m) => m.SpacingPageComponent
      ),
  },
  {
    path: 'record-header',
    loadComponent: () =>
      import('./pages/orcid-ui/record-header-page.component').then(
        (m) => m.RecordHeaderPageComponent
      ),
  },
  {
    path: 'text-with-tooltip',
    loadComponent: () =>
      import('./pages/orcid-ui/text-with-tooltip-page.component').then(
        (m) => m.TextWithTooltipPageComponent
      ),
  },
  {
    path: 'material-buttons-directives',
    loadComponent: () =>
      import(
        './pages/orcid-ui/material-buttons-directives-page.component'
      ).then((m) => m.MaterialButtonsDirectivesPageComponent),
  },
  {
    path: 'alert-message',
    loadComponent: () =>
      import('./pages/orcid-ui/alert-message-page.component').then(
        (m) => m.AlertMessagePageComponent
      ),
  },
  {
    path: 'action-surface',
    loadComponent: () =>
      import('./pages/orcid-ui/action-surface-page.component').then(
        (m) => m.ActionSurfacePageComponent
      ),
  },
  {
    path: 'action-surface-container',
    loadComponent: () =>
      import('./pages/orcid-ui/action-surface-container-page.component').then(
        (m) => m.ActionSurfaceContainerPageComponent
      ),
  },
  {
    path: 'panel',
    loadComponent: () =>
      import('./pages/orcid-ui/panel-page.component').then(
        (m) => m.PanelPageComponent
      ),
  },
  {
    path: 'modal',
    loadComponent: () =>
      import('./pages/orcid-ui/modal-page.component').then(
        (m) => m.ModalPageComponent
      ),
  },
  {
    path: 'skeleton-placeholder',
    loadComponent: () =>
      import('./pages/orcid-ui/skeleton-placeholder-page.component').then(
        (m) => m.SkeletonPlaceholderPageComponent
      ),
  },
  {
    path: 'auth-challenge',
    loadComponent: () =>
      import('./pages/orcid-registry-ui/auth-challenge-page.component').then(
        (m) => m.AuthChallengePageComponent
      ),
  },
  {
    path: 'registry-permission-notifications',
    loadComponent: () =>
      import(
        './pages/orcid-registry-ui/registry-permission-notifications-page.component'
      ).then((m) => m.RegistryPermissionNotificationsPageComponent),
  },
  {
    path: 'registry-import-works-dialog',
    loadComponent: () =>
      import(
        './pages/orcid-registry-ui/import-works-dialog-page.component'
      ).then((m) => m.ImportWorksDialogPageComponent),
  },
]
