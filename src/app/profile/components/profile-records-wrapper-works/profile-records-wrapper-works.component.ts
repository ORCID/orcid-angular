import { Component, OnInit, Input, Output, HostListener } from '@angular/core'
import { WorkGroup } from '../../../types'
import { nestedListAnimation } from 'src/app/animations'
import { WorksService } from 'src/app/core/works/works.service'
import { Work } from 'src/app/types/works.endpoint'
import { merge, of } from 'rxjs'

@Component({
  selector: 'app-profile-records-wrapper-works',
  templateUrl: './profile-records-wrapper-works.component.html',
  styleUrls: ['./profile-records-wrapper-works.scss'],
  animations: [nestedListAnimation],
})
export class ProfileRecordsWrapperWorksComponent implements OnInit {
  _profileworksStack: WorkGroup
  workCardState = {}
  stackMode = false
  workDetailsState = {}
  createdDate

  workInfo: Work

  @Input() id
  @Input()
  set profileworksStack(profileworksStack: WorkGroup) {
    console.log('STACK ', profileworksStack)
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
    console.log('>>> ', this.profileworksStack)
  }
  get profileworksStack() {
    return this._profileworksStack
  }

  constructor(private _worksService: WorksService) {}

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
}
