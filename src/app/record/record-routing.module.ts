import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { MyOrcidComponent } from './pages/my-orcid/my-orcid.component'

const routes: Routes = [
  {
    path: '',
    component: MyOrcidComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordRoutingModule {}
