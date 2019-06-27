import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { BootstrapHomeComponent } from './pages/bootstrap-home/bootstrap-home.component'

const routes: Routes = [
  {
    path: '',
    component: BootstrapHomeComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BootstrapHomeRoutingModule {}
