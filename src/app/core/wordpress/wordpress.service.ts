import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, LOCALE_ID } from '@angular/core'
import { WordpressPost } from 'src/app/types/wordpress'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class WordpressService {
  constructor(
    private httpClient: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  getHomePagePost() {
    return this.httpClient.get(
      `${
        environment.WORDPRESS_S3
      }/index${this.getWordpressLocalizationCode()}.html`,
      { responseType: 'text' }
    )
  }
  getWordpressLocalizationCode() {
    if (this.locale.includes('en')) {
      return ''
    }
    return '-' + this.locale
  }
}
