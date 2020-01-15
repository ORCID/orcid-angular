import { NgModule } from '@angular/core'
import { RouterModule, Routes, UrlSegment } from '@angular/router'

import { isValidOrcidFormat, URL_PRIVATE_PROFILE } from './constants'
import { EnvironmentBannerComponent } from './environment-banner/environment-banner/environment-banner.component'

export function matcher(segments: UrlSegment[]) {
  if (
    (segments[0] && isValidOrcidFormat(segments[0].path)) ||
    (segments[0] && segments[0].path.toLowerCase() === URL_PRIVATE_PROFILE)
  ) {
    return { consumed: [segments[0]] }
  }
  return {
    consumed: [],
  }
}

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  // {
  //   matcher: matcher,
  //   loadChildren:
  //   () => import('./profile/profile.module').then(m => m.ProfileModule)
  // },
  // {
  //   path: 'reset-password-email',
  //   loadChildren:
  //   () => import('./password-recovery/password-recovery.module').then(m => m.PasswordRecoveryModule)
  // },
  {
    path: 'signin',
    loadChildren: () =>
      import('./sign-in/sign-in.module').then(m => m.SignInModule),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./password-recovery/password-recovery.module').then(
        m => m.PasswordRecoveryModule
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
  // {
  //   path: '**',
  //   redirectTo: '/',
  // },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
