import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BootstrapNewsComponent } from './components/bootstrap-news/bootstrap-news.component'
import { BootstrapHomeComponent } from './pages/bootstrap-home/bootstrap-home.component'
import { BootstrapHomeRoutingModule } from 'src/app/bootstrap-home/bootstrap-home-routing.module'

@NgModule({
  imports: [BootstrapHomeRoutingModule, CommonModule],
  declarations: [BootstrapNewsComponent, BootstrapHomeComponent],
})
export class BootstrapHomeModule {
  constructor() {
    console.log('init boostrap home')
  }
}
