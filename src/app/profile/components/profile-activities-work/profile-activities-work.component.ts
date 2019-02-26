import { Component, Input, OnInit } from '@angular/core'
import { first } from 'rxjs/operators'
import { itemMarginAnimation, nestedListAnimation } from 'src/app/animations'
import { PlatformInfoService } from 'src/app/core'
import { WorksService } from 'src/app/core/works/works.service'
import { WorkGroup } from 'src/app/types'
import { Work } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-profile-activities-work',
  templateUrl: './profile-activities-work.component.html',
  styleUrls: ['./profile-activities-work.scss'],
  animations: [nestedListAnimation, itemMarginAnimation],
})
export class ProfileActivitiesWorkComponent implements OnInit {
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

  _profileworksStack: WorkGroup
  workCardState = {}
  stackMode = false
  workDetailsState = {}
  createdDate
  noopAnimation = false

  constructor(
    private _worksService: WorksService,
    private _platformInfo: PlatformInfoService
  ) {
    this._platformInfo.get().subscribe(data => {
      // TODO Firefox, Explorer and Edge all seem to have proble with :leave on itemChildListAnimation
      // More person about what is causing this problems must be looked for.
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
        .pipe(first())
        .subscribe(() => {
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
}
