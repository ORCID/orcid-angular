import { Injectable } from '@angular/core'
import { Meta } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root',
})
export class OpenGraphService {
  private titleMeta = 'og:title'
  private descriptionMeta = 'og:description'
  private imageMeta = 'og:image'

  constructor(private meta: Meta) {}

  addOpenGraphData(publicId: string): HTMLMetaElement[] {
    return this.meta.addTags([
      { property: this.titleMeta, content: publicId },
      {
        property: this.descriptionMeta,
        content: $localize`:@@record.ogDescription:ORCID provides an identifier for individuals to use with their name as they engage in research, scholarship, and innovation activities.`,
      },
      { property: this.imageMeta, content: 'assets/img/orcid-og-image.png' },
    ])
  }
  removeOpenGraphData() {
    this.meta.removeTag(`property="${this.titleMeta}"`)
    this.meta.removeTag(`property="${this.descriptionMeta}"`)
    this.meta.removeTag(`property="${this.imageMeta}"`)
  }
}
