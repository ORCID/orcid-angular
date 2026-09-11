import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RecordCorrectionsComponent } from './pages/record-corrections/record-corrections.component'

const routes: Routes = [
  {
    path: '',
    component: RecordCorrectionsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordCorrectionsRoutingModule {}
