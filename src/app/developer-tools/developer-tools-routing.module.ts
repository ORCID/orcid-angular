import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DeveloperToolsComponent } from './pages/developer-tools/developer-tools.component'

const routes: Routes = [{ path: '', component: DeveloperToolsComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeveloperToolsRoutingModule {}
