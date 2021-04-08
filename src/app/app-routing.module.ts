import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import {
  ApplicationRoutes,
  routerReactivation,
  routerThirdPartySignInMatch,
} from './constants'
import { AuthenticatedGuard } from './guards/authenticated.guard'
import { SignInGuard } from './guards/sign-in.guard'
import { AuthorizeGuard } from './guards/authorize.guard'
import { RegisterGuard } from './guards/register.guard'
import { LinkAccountGuard } from './guards/link-account.guard'
import { LanguageGuard } from './guards/language.guard'
import { ThirdPartySigninCompletedGuard } from './guards/third-party-signin-completed.guard'

const routes: Routes = [
  {
    path: ApplicationRoutes.home,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: ApplicationRoutes.inbox,
    canActivateChild: [AuthenticatedGuard],
    loadChildren: () =>
      import('./inbox/inbox.module').then((m) => m.InboxModule),
  },
  {
    path: ApplicationRoutes.authorize,
    canActivateChild: [LanguageGuard, AuthorizeGuard],
    loadChildren: () =>
      import('./authorize/authorize.module').then((m) => m.AuthorizeModule),
  },
  {
    path: ApplicationRoutes.institutional,
    loadChildren: () =>
      import('./institutional/institutional.module').then(
        (m) => m.InstitutionalModule
      ),
  },
  {
    path: ApplicationRoutes.social,
    canActivateChild: [LinkAccountGuard],
    loadChildren: () =>
      import('./link-account/link-account.module').then(
        (m) => m.LinkAccountModule
      ),
  },
  {
    path: ApplicationRoutes.institutionalLinking,
    canActivateChild: [LinkAccountGuard],
    loadChildren: () =>
      import('./link-account/link-account.module').then(
        (m) => m.LinkAccountModule
      ),
  },
  {
    path: ApplicationRoutes.login,
    redirectTo: ApplicationRoutes.signin,
  },
  {
    path: ApplicationRoutes.signin,
    canActivateChild: [LanguageGuard, SignInGuard],
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInModule),
  },
  {
    path: ApplicationRoutes.resetPassword,
    loadChildren: () =>
      import('./password-recovery/password-recovery.module').then(
        (m) => m.PasswordRecoveryModule
      ),
  },
  {
    path: ApplicationRoutes.register,
    canActivateChild: [LanguageGuard, RegisterGuard],
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: ApplicationRoutes.search,
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: ApplicationRoutes.myOrcidTEMP,
    canActivateChild: [LanguageGuard, AuthenticatedGuard],
    loadChildren: () =>
      import('./record/record.module').then((m) => m.RecordModule),
  },
  {
    path: ApplicationRoutes.twoFactor,
    canActivateChild: [LinkAccountGuard],
    loadChildren: () =>
      import('./two-factor/two-factor.module').then((m) => m.TwoFactorModule),
  },
  {
    matcher: routerThirdPartySignInMatch,
    canActivateChild: [ThirdPartySigninCompletedGuard],
    loadChildren: () =>
      import('./record/record.module').then((m) => m.RecordModule),
  },
  {
    matcher: routerReactivation,
    canActivateChild: [LanguageGuard, RegisterGuard],
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
