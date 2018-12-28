import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomeModule',
  },
  {
    path: '',
    loadChildren: './profile/profile.module#ProfileModule',
    canLoad: [
      // With Angular 7 is possible to create a 'canLoad' type of Guard to avoid loading/downloading a module if the url segment don't match
      // a child route.
    ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
