import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TrustedSummaryComponent } from './pages/trusted-summary/trusted-summary.component'

const routes: Routes = [
  {
    path: '',
    component: TrustedSummaryComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrustedSummaryRouting {}
