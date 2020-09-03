import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TwoFactorComponent } from './pages/two-factor/two-factor.component'

const routes: Routes = [
  {
    path: '',
    component: TwoFactorComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwoFactorRoutingModule {}
