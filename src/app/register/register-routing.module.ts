import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { RegisterComponent } from './pages/register/register.component'

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
