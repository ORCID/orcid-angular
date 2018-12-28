import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NewsService } from './news/news.service'
import { HttpClientModule } from '@angular/common/http'
import { ErrorHandlerService } from './error-handler/error-handler.service'

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [], // Should not declare anything
  providers: [],
})
export class CoreModule {}
