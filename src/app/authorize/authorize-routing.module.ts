import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthorizeComponent } from './pages/authorize/authorize.component'

const routes: Routes = [
  {
    path: '',
    component: AuthorizeComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizeRoutingModule {}
