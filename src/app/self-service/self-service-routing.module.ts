import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SelfServiceComponent } from './self-service/self-service.component'

const routes: Routes = [
  {
    path: '',
    component: SelfServiceComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelfServiceRoutingModule {}
