import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthenticatedNoDelegatorGuard } from '../guards/authenticated-no-delagator.guard'
import { RecoveryPhoneComponent } from './pages/recovery-phone/recovery-phone.component'

const routes: Routes = [
  {
    path: '',
    // Not for a delegate, as Account settings is not (F4.5). The parent
    // route's AuthenticatedGuard has already sent a signed-out user to sign in
    canActivate: [AuthenticatedNoDelegatorGuard],
    component: RecoveryPhoneComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwoFactorRecoveryPhoneRoutingModule {}
