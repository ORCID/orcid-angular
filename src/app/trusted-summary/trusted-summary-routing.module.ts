import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TrustedSummaryPageComponent } from './pages/trusted-summary/trusted-summary.component'

const routes: Routes = [
  {
    path: '',
    component: TrustedSummaryPageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrustedSummaryPageRouting {}
