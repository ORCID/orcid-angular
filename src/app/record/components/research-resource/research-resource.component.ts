import { Component, Input, OnInit } from '@angular/core'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { first, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import {
  Host,
  Item,
  ResearchResource,
} from '../../../types/record-research-resources.endpoint'
import { URL_REGEXP } from '../../../constants'
import { OrgDisambiguated } from '../../../types'
import { OrganizationsService } from '../../../core'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'

@Component({
  selector: 'app-research-resource',
  templateUrl: './research-resource.component.html',
  styleUrls: [
    './research-resource.component.scss',
    './research-resource.component.scss-theme.scss',
  ],
  standalone: false,
})
export class ResearchResourceComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() isPublicRecord: string
  @Input() researchResource: ResearchResource
  @Input() stackMode
  @Input() orgDisambiguated: OrgDisambiguated
  @Input() panelTitle: string
  @Input() panelId: string

  detailsResearchResources: {
    putCode: string
    researchResource: ResearchResource
  }[] = []
  detailsOrgDisambiguated: {
    disambiguationSource: string
    orgDisambiguatedId: string
    orgDisambiguated: OrgDisambiguated
  }[] = []

  platform: PlatformInfo

  isMobile: boolean

  constructor(
    _platform: PlatformInfoService,
    private _organizationsService: OrganizationsService,
    private _recordResearchResourceService: RecordResearchResourceService
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
        this.isMobile = data.columns4 || data.columns8
      })
  }

  ngOnInit(): void {}

  getResearchResource(putCode: string): ResearchResource {
    if (this.detailsResearchResources.length === 0) {
      return null
    }

    return this.detailsResearchResources
      .filter((value) => value.putCode === putCode)
      .map((value) => {
        return value.researchResource
      })[0]
  }

  getDetails(researchResource: ResearchResource, putCode: string): void {
    if (this.isPublicRecord) {
      this._recordResearchResourceService
        .getPublicResearchResourceById(this.isPublicRecord, putCode)
        .pipe(first())
        .subscribe(
          (data) => {
            this.detailsResearchResources.push({
              putCode: putCode,
              researchResource: data,
            })
            const research: ResearchResource = data
            research.hosts.forEach((host) => {
              this.getOrganizationDisambiguatedDetails(
                null,
                host.disambiguationSource,
                host.orgDisambiguatedId
              )
            })
            researchResource.showDetails = true
          },
          (error) => {
            console.error('getDetailsError', error)
          }
        )
    } else {
      this._recordResearchResourceService
        .getResearchResourceById(putCode)
        .pipe(first())
        .subscribe(
          (data) => {
            const research: ResearchResource = data
            this.detailsResearchResources.push({
              putCode: putCode,
              researchResource: research,
            })
            research.hosts.forEach((host) => {
              this.getOrganizationDisambiguatedDetails(
                null,
                host.disambiguationSource,
                host.orgDisambiguatedId
              )
            })
            researchResource.showDetails = true
          },
          (error) => {
            console.error('getDetailsError', error)
          }
        )
    }
  }

  getOrganizationDisambiguated(host: Host): OrgDisambiguated {
    const disambiguationSource = host.disambiguationSource
    const orgDisambiguatedId = host.orgDisambiguatedId

    return this.detailsOrgDisambiguated
      .filter(
        (value) =>
          value.disambiguationSource === disambiguationSource &&
          value.orgDisambiguatedId === orgDisambiguatedId
      )
      .map((value) => {
        return value.orgDisambiguated
      })[0]
  }

  getOrganizationDisambiguatedDetails(
    item: Item,
    disambiguationSource,
    orgDisambiguatedId
  ): void {
    this._organizationsService
      .getOrgDisambiguated(disambiguationSource, orgDisambiguatedId)
      .pipe(first())
      .subscribe((organizationDisambiguated) => {
        this.detailsOrgDisambiguated.push({
          disambiguationSource,
          orgDisambiguatedId,
          orgDisambiguated: organizationDisambiguated,
        })
        if (item) {
          item.showDetails = true
        }
      })
  }

  collapse(value: ResearchResource | Item) {
    value.showDetails = !value.showDetails
  }
}
