import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { InstitutionalLinkingComponent } from './pages/institutional-linking/institutional-linking.component'

const routes: Routes = [
  {
    path: '',
    component: InstitutionalLinkingComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinkAccountRoutingModule {}
