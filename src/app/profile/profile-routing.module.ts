import { NgModule } from '@angular/core'
import { Routes, RouterModule, UrlSegment } from '@angular/router'
import { ProfilePublicPageComponent } from './pages/profile-public-page/profile-public-page.component'
import { ProfilePrivatePageComponent } from './pages/profile-private-page/profile-private-page.component'
import { isValidOrcidFormat } from '../constants'

export function idMatcher(url: UrlSegment[]) {
  if (url[0] && isValidOrcidFormat(url[0].path)) {
    return {
      consumed: [url[0]],
    }
  }
  return { consumed: [] }
}

export const routes: Routes = [
  {
    matcher: idMatcher,
    component: ProfilePublicPageComponent,
  },
  {
    path: 'myOrcid',
    component: ProfilePrivatePageComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
