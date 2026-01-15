import { Injectable, NgModule } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterModule,
  Routes,
} from '@angular/router'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { Observable, of } from 'rxjs'
import { ResetPasswordEmailForm } from 'src/app/types/reset-password.endpoint'
import { PasswordRecoveryService } from 'src/app/core/password-recovery/password-recovery.service'
import { ResetPasswordGuard } from '../guards/reset-password.guard'

@Injectable({ providedIn: 'root' })
export class PasswordResetTokenResolver
  implements Resolve<ResetPasswordEmailForm>
{
  constructor(private _accountRecoveryService: PasswordRecoveryService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ResetPasswordEmailForm> {
    const key = route.params['key']
    return this._accountRecoveryService.resetPasswordEmailValidateToken({
      encryptedEmail: key,
    })
  }
}

const routes: Routes = [
  {
    path: '',
    canActivate: [ResetPasswordGuard],
    component: ResetPasswordComponent,
    resolve: {
      tokenVerification: PasswordResetTokenResolver,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {}
