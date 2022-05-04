import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ResetPasswordComponent } from './reset-password/reset-password.component'

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {}
