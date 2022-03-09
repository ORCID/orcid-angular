import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountTrustedPartiesComponent } from './pages/account-trusted-parties/account-trusted-parties.component';

const routes: Routes = [
  {
    path: '',
    component: AccountTrustedPartiesComponent,
  },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountTrustedPartiesRoutingModule {}
