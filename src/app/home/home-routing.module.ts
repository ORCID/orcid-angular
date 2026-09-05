import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './pages/home/home.component'
import { HomepagePreviewComponent } from './pages/homepage-preview/homepage-preview.component'

const routes: Routes = [
  // Listed first: the empty path below matches as a prefix, so the router would
  // otherwise try it before this one.
  {
    path: 'homepage-preview',
    component: HomepagePreviewComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
