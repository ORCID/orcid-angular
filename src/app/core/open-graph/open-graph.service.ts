import { Injectable } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { NamesEndPoint } from 'src/app/types/record-name.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class OpenGraphService {
  openGraphDataSet = false
  private titleMeta = 'og:title'
  private descriptionMeta = 'og:description'
  private imageMeta = 'og:image'
  private typeMeta = 'og:type'
  private urlMeta = 'og:url'
  private firstNameMeta = 'profile:first_name'
  private lastNameMeta = 'profile:last_name'
  private usernameMeta = 'profile:username'
  private siteNameMeta = 'og:site_name'

  constructor(private meta: Meta, private _titleService: Title) {}

  addOpenGraphData(record: UserRecord): HTMLMetaElement[] {
    console.log(record.userInfo)

    if (record.userInfo && record.names && !this.openGraphDataSet) {
      this.openGraphDataSet = true
      try {
        const { displayedNameWithId, displayedName } = this.getDisplayNames(
          record.names,
          record.userInfo.EFFECTIVE_USER_ORCID
        )
        this._titleService.setTitle(displayedNameWithId)
        return this.meta.addTags([
          { property: this.titleMeta, content: displayedNameWithId },
          {
            property: this.descriptionMeta,
            content:
              $localize`:@@record.ogDescription1:ORCID record for` +
              ` ` +
              (displayedName || displayedNameWithId) +
              `. ` +
              $localize`:@@record.ogDescription2:ORCID provides an identifier for individuals to use with their name as they engage in research, scholarship, and innovation activities.`,
          },

          { property: this.typeMeta, content: 'profile' },
          {
            property: this.urlMeta,
            content:
              'https:' +
              environment.BASE_URL +
              record.userInfo.EFFECTIVE_USER_ORCID,
          },
          {
            property: this.firstNameMeta,
            content: record.names?.givenNames?.value || '',
          },
          {
            property: this.lastNameMeta,
            content: record.names?.familyName?.value || '',
          },
          {
            property: this.usernameMeta,
            content: record.userInfo.EFFECTIVE_USER_ORCID,
          },
          { property: this.siteNameMeta, content: 'Orcid' },
        ])
      } catch (e) {
        this.openGraphDataSet = false
      }
    }
  }
  private getDisplayNames(
    recordNames: NamesEndPoint,
    effectiveID: string
  ): { displayedNameWithId: string; displayedName: string } {
    let displayedName = ''
    if (recordNames?.creditName) {
      displayedName = recordNames.creditName.value
    } else if (
      recordNames?.givenNames?.value &&
      recordNames?.familyName?.value
    ) {
      displayedName = `${recordNames.givenNames.value} ${recordNames.familyName.value}`
    } else if (recordNames?.givenNames?.value) {
      displayedName = `${recordNames.givenNames.value}`
    }

    displayedName = displayedName.trim()
    let displayedNameWithId = ''
    if (displayedName !== '') {
      displayedNameWithId = `${displayedName} (${effectiveID})`
    } else {
      displayedNameWithId = `${effectiveID}`
    }
    return { displayedNameWithId, displayedName }
  }

  removeOpenGraphData() {
    this.meta.removeTag(`property="${this.titleMeta}"`)
    this.meta.removeTag(`property="${this.descriptionMeta}"`)
    this.meta.removeTag(`property="${this.imageMeta}"`)
    this.meta.removeTag(`property="${this.typeMeta}"`)
    this.meta.removeTag(`property="${this.urlMeta}"`)
    this.meta.removeTag(`property="${this.firstNameMeta}"`)
    this.meta.removeTag(`property="${this.lastNameMeta}"`)
    this.meta.removeTag(`property="${this.usernameMeta}"`)
    this.meta.removeTag(`property="${this.siteNameMeta}"`)
    this._titleService.setTitle('ORCID')
    this.openGraphDataSet = false
  }
}
