import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TwoFactorSetupComponent } from './pages/two-factor/two-factor-setup.component'

const routes: Routes = [
  {
    path: '',
    component: TwoFactorSetupComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwoFactorSetupRoutingModule {}
