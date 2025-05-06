import { NgModule } from '@angular/core'
import { LoadChildrenCallback, RouterModule, Routes } from '@angular/router'

import {
  ApplicationRoutes,
  routerPublicPageUrl,
  routerReactivation,
  routerSummaryPageUrl,
  routerThirdPartySignInMatch,
} from './constants'
import { AuthenticatedGuard } from './guards/authenticated.guard'
import { SignInGuard } from './guards/sign-in.guard'
import { AuthorizeGuard } from './guards/authorize.guard'
import { RegisterGuard } from './guards/register.guard'
import { LinkAccountGuard } from './guards/link-account.guard'
import { LanguageGuard } from './guards/language.guard'
import { TwoFactorSigninGuard } from './guards/two-factor-signin.guard'
import { AuthenticatedNoDelegatorGuard } from './guards/authenticated-no-delagator.guard'
import { ThirdPartySigninCompletedGuard } from './guards/third-party-signin-completed.guard'

const routes: Routes = [
  {
    path: ApplicationRoutes.home,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    matcher: routerSummaryPageUrl,
    loadChildren: () =>
      import('./trusted-summary/trusted-summary.module').then(
        (m) => m.TrustedSummaryPageModule
      ),
  },
  {
    matcher: routerPublicPageUrl,
    loadChildren: () =>
      import('./record/record.module').then((m) => m.RecordModule),
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
    path: ApplicationRoutes.myOrcid,
    canActivateChild: [LanguageGuard, AuthenticatedGuard],
    loadChildren: () =>
      import('./record/record.module').then((m) => m.RecordModule),
  },
  {
    path: ApplicationRoutes.account,
    canActivateChild: [AuthenticatedGuard, AuthenticatedNoDelegatorGuard],
    loadChildren: () =>
      import('./account-settings/account-settings.module').then(
        (m) => m.AccountSettingsModule
      ),
  },
  {
    path: ApplicationRoutes.trustedParties,
    canActivateChild: [AuthenticatedGuard],
    loadChildren: () =>
      import('./account-trusted-parties/account-trusted-parties.module').then(
        (m) => m.AccountTrustedPartiesModule
      ),
  },
  {
    path: ApplicationRoutes.twoFactor,
    canActivateChild: [TwoFactorSigninGuard],
    loadChildren: () =>
      import('./two-factor/two-factor.module').then((m) => m.TwoFactorModule),
  },
  {
    path: ApplicationRoutes.twoFactorSetup,
    canActivateChild: [AuthenticatedGuard],
    loadChildren: () =>
      import('./two-factor-setup/two-factor-setup.module').then(
        (m) => m.TwoFactorSetupModule
      ),
  },
  {
    path: ApplicationRoutes.resetPasswordEmail + '/:key',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
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
    path: ApplicationRoutes.selfService,
    canActivateChild: [AuthenticatedGuard],
    loadChildren: () =>
      import('./self-service/self-service.module').then(
        (m) => m.SelfServiceModule
      ),
  },
  {
    path: ApplicationRoutes.developerTools,
    canActivateChild: [AuthenticatedGuard],
    loadChildren: () =>
      import('./developer-tools/developer-tools.module').then(
        (m) => m.DeveloperToolsModule
      ),
  },
  {
    path: '404',
    loadChildren: () =>
      import('./page-not-found-404/page-not-found-404.module').then(
        (m) => m.PageNotFound404Module
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./page-not-found-404/page-not-found-404.module').then(
        (m) => m.PageNotFound404Module
      ),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
