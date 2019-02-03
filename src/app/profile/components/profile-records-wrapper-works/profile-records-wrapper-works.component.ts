import { Component, OnInit, Input, Output, HostListener } from '@angular/core'
import { WorkGroup } from '../../../types'
import { nestedListAnimation, itemMarginAnimation } from 'src/app/animations'
import { WorksService } from 'src/app/core/works/works.service'
import { Work } from 'src/app/types/works.endpoint'
import { merge, of } from 'rxjs'
import { PlatformInfoService } from 'src/app/core'
import { platform } from 'os'

@Component({
  selector: 'app-profile-records-wrapper-works',
  templateUrl: './profile-records-wrapper-works.component.html',
  styleUrls: ['./profile-records-wrapper-works.scss'],
  animations: [nestedListAnimation, itemMarginAnimation],
})
export class ProfileRecordsWrapperWorksComponent implements OnInit {
  _profileworksStack: WorkGroup
  workCardState = {}
  stackMode = false
  workDetailsState = {}
  createdDate

  workInfo: Work
  noopAnimation = false

  @Input() id
  @Input()
  set profileworksStack(profileworksStack: WorkGroup) {
    this._profileworksStack = profileworksStack
    this._profileworksStack.works.forEach(work => {
      this.workCardState[work.putCode.value] = {
        stackState: this.isPrefered(work) ? 'open' : 'close',
      }
      this.workDetailsState[work.putCode.value] = {
        detailShowData: 'close',
        detailShowLoader: 'close',
        detailShowOffline: 'close',
        state: 'close',
      }
    })
  }
  get profileworksStack() {
    return this._profileworksStack
  }

  constructor(
    private _worksService: WorksService,
    private _platformInfo: PlatformInfoService
  ) {
    this._platformInfo.get().subscribe(data => {
      // TODO Firefox, Explorer and Edge all seem to have proble with :leave on itemChildListAnimation
      // More info about what is causing this problems must be looked for.
      //
      this.noopAnimation = data.firefox || data.edge || data.ie
    })
  }

  ngOnInit() {}

  onClick(work) {
    Object.keys(this.workCardState).forEach(key => {
      this.workCardState[key].stackState = 'close'
    })
    this.workCardState[work.putCode.value].stackState =
      this.workCardState[work.putCode.value].stackState === 'open'
        ? 'close'
        : 'open'
  }

  isPrefered(work) {
    return work
      ? this.profileworksStack.defaultPutCode.toString() === work.putCode.value
      : false
  }

  toggleDetails(workParam: Work) {
    const putCode = workParam.putCode.value
    this.workDetailsState[putCode].state =
      this.workDetailsState[putCode].state === 'close' ? 'open' : 'close'

    if (this.workDetailsState[putCode].state === 'open') {
      this.workDetailsState[putCode].detailShowData = 'close'
      this.workDetailsState[putCode].detailShowLoader = 'open'
      this.workDetailsState[putCode].detailShowOffline = 'close'

      this._worksService
        .getDetails(this.id, workParam.putCode.value)
        .subscribe(data => {
          this._profileworksStack.works = this._profileworksStack.works.map(
            work => {
              if (work.putCode.value === data.putCode.value) {
                return data
              } else {
                return work
              }
            }
          )
          this.workDetailsState[putCode].detailShowData = 'open'
          this.workDetailsState[putCode].detailShowLoader = 'close'
          this.workDetailsState[putCode].detailShowOffline = 'close'
        })
    } else {
      this.workDetailsState[putCode].detailShowData = 'close'
      this.workDetailsState[putCode].detailShowLoader = 'close'
      this.workDetailsState[putCode].detailShowOffline = 'close'
    }
  }

  trackByFn(index, work: Work) {
    return work.putCode.value
  }

  call(event) {
    console.log('>>>', event)
  }
}
