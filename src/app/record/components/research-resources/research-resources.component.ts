import { Component, Input, OnInit } from '@angular/core'
import { UserRecord } from '../../../types/record.local'
import { Subject } from 'rxjs'
import { NameForm, RequestInfoForm, UserInfo } from '../../../types'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'
import { RecordService } from '../../../core/record/record.service'
import { first, takeUntil } from 'rxjs/operators'
import { UserService } from '../../../core'
import { ResearchResource } from '../../../types/record-research-resources.endpoint'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'

@Component({
  selector: 'app-research-resources',
  templateUrl: './research-resources.component.html',
  styleUrls: [
    './research-resources.component.scss',
    './research-resources.component.scss-theme.scss'
  ]
})
export class ResearchResourcesComponent implements OnInit {
  @Input() publicView: any = false

  $destroy: Subject<boolean> = new Subject<boolean>()

  userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  userRecord: UserRecord
  platform: PlatformInfo
  detailsResearchResources: {
    putCode: number
    researchResource: ResearchResource
  }[] = []

  ngOrcidResearchResources = $localize`:@@researchResources.researchResources:Research resources`

  constructor(
    _platform: PlatformInfoService,
    private _record: RecordService,
    private _recordResearchResourceService: RecordResearchResourceService,
    private _user: UserService,
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  ngOnInit(): void {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession

        // TODO @amontenegro
        // AVOID requiring the orcid url to getPerson to call all the record data on parallel
        this._record
          .getRecord(this.userSession.userInfo.EFFECTIVE_USER_ORCID)
          .pipe(takeUntil(this.$destroy))
          .subscribe((userRecord) => {
            this.userRecord = userRecord
            console.log('researchResource ' + JSON.stringify(this.userRecord.researchResources.groups))
          })
      })
  }

  getDetails(researchResource: ResearchResource, putCode: number): void {
    if (this.publicView) {
      this._recordResearchResourceService
        .getPublicResearchResourceById(
          this.userSession.userInfo.EFFECTIVE_USER_ORCID,
          putCode
        )
        .pipe(first())
        .subscribe(
          (data) => {
            this.detailsResearchResources.push({ putCode: putCode, researchResource: data })
            researchResource.showDetails = true
          },
          (error) => {
            console.log('getDetailsError', error)
          }
        )
    } else {
      this._recordResearchResourceService
        .getPublicResearchResourceById(
          this.userSession.userInfo.EFFECTIVE_USER_ORCID,
          putCode
        )
        .pipe(first())
        .subscribe(
          (data) => {
            this.detailsResearchResources.push({ putCode: putCode, researchResource: data })
            researchResource.showDetails = true
          },
          (error) => {
            console.log('getDetailsError', error)
          }
        )
    }
  }

  getResearchResource(putCode: number): ResearchResource {
    if (this.detailsResearchResources.length === 0) {
      return null
    }

    return this.detailsResearchResources
      .filter((value) => value.putCode === putCode)
      .map((value) => {
        return value.researchResource
      })[0]
  }

  collapse(researchResource: ResearchResource) {
    researchResource.showDetails = !researchResource.showDetails
  }
}
