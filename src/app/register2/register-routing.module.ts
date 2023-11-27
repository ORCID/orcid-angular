import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { Register2Component } from './pages/register/register2.component'

const routes: Routes = [
  {
    path: '',
    component: Register2Component,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
