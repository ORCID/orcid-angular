import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SmsPocComponent } from './pages/sms-poc/sms-poc.component'

const routes: Routes = [
  {
    path: '',
    component: SmsPocComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmsPocRoutingModule {}
