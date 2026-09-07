import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RecoveryPhoneComponent } from './pages/recovery-phone/recovery-phone.component'

const routes: Routes = [
  {
    path: '',
    component: RecoveryPhoneComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwoFactorRecoveryPhoneRoutingModule {}
