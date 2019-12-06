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
    component: EnvironmentBannerComponent,
    outlet: 'banner',
  },
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
  },
  // {
  //   matcher: matcher,
  //   loadChildren: './profile/profile.module#ProfileModule',
  // },
  {
    path: 'reset-password-email',
    loadChildren:
      './password-recovery/password-recovery.module#PasswordRecoveryModule',
  },
  {
    path: '**',
    redirectTo: '/',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
