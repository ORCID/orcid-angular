import { Injectable, NgModule } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterModule,
  Routes,
} from '@angular/router'
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component'
import { AuthenticatedNoDelegatorGuard } from '../guards/authenticated-no-delagator.guard'
import { AuthenticatedGuard } from '../guards/authenticated.guard'
import { ConfirmDeactivateAccountComponent } from './pages/confirm-deactivate-account/confirm-deactivate-account.component'
import { DeactivationGuard } from '../guards/deactivation.guard'
import { ExpiringLinkVerification } from '../types/common.endpoint'
import { Observable, of } from 'rxjs'
import { AccountActionsDeactivateService } from '../core/account-actions-deactivate/account-actions-deactivate.service'

@Injectable({ providedIn: 'root' })
export class DeactivationTokenResolver
  implements Resolve<ExpiringLinkVerification>
{
  constructor(private _deactivateService: AccountActionsDeactivateService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ExpiringLinkVerification> {
    const token = route.queryParamMap.get('token')
    return this._deactivateService.verifyDeactivationToken(token)
  }
}

const routes: Routes = [
  {
    path: 'deactivate',
    canActivate: [DeactivationGuard],
    component: ConfirmDeactivateAccountComponent,
    resolve: {
      tokenVerification: DeactivationTokenResolver,
    },
  },
  {
    path: '',
    canActivate: [AuthenticatedGuard, AuthenticatedNoDelegatorGuard],
    component: AccountSettingsComponent,
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountSettingsRoutingModule {}
