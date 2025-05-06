import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PageNotFound404RoutingModule } from './page-not-found-404-routing.module'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { NotFoundComponent } from './not-found/not-found.component'

@NgModule({
  declarations: [PageNotFoundComponent, NotFoundComponent],
  imports: [CommonModule, PageNotFound404RoutingModule],
  exports: [NotFoundComponent],
})
export class PageNotFound404Module {}
