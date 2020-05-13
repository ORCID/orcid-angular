import { NgModule } from '@angular/core'
import { RouterModule, Routes, UrlSegment } from '@angular/router'

import {
  isValidOrcidFormat,
  URL_PRIVATE_PROFILE,
  ApplicationRoutes,
} from './constants'

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
    path: ApplicationRoutes.home,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  // {
  //   matcher: matcher,
  //   loadChildren:
  //   () => import('./profile/profile.module').then(m => m.ProfileModule)
  // },
  {
    path: ApplicationRoutes.institutional,
    loadChildren: () =>
      import('./institutional/institutional.module').then(
        m => m.InstitutionalModule
      ),
  },
  {
    path: ApplicationRoutes.login,
    redirectTo: ApplicationRoutes.signin,
  },
  {
    path: ApplicationRoutes.signin,
    loadChildren: () =>
      import('./sign-in/sign-in.module').then(m => m.SignInModule),
  },
  {
    path: ApplicationRoutes.resetPassword,
    loadChildren: () =>
      import('./password-recovery/password-recovery.module').then(
        m => m.PasswordRecoveryModule
      ),
  },
  {
    path: ApplicationRoutes.register,
    loadChildren: () =>
      import('./register/register.module').then(m => m.RegisterModule),
  },
  {
    path: ApplicationRoutes.search,
    loadChildren: () =>
      import('./search/search.module').then(m => m.SearchModule),
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
