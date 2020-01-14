import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { EnvironmentBannerComponent } from './environment-banner/environment-banner.component'

const routes: Routes = [
  {
    path: '',
    component: EnvironmentBannerComponent,
    outlet: 'banner',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EnvironmentRoutingModule {}
