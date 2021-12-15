import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component'

const routes: Routes = [
  {
    path: '',
    component: AccountSettingsComponent,
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountSettingsRoutingModule {}
