import { Component, OnInit, Input, Output, HostListener } from '@angular/core'
import { WorkGroup } from '../../../types'
import { nestedListAnimation } from 'src/app/animations'

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
  @Input()
  set profileworksStack(profileworksStack: WorkGroup) {
    console.log('STACK ', profileworksStack)
    this._profileworksStack = profileworksStack
    this._profileworksStack.works.forEach(
      work =>
        (this.workCardState[work.putCode.value] = {
          stackState: this.isPrefered(work) ? 'open' : 'close',
        })
    )
  }
  get profileworksStack() {
    return this._profileworksStack
  }

  constructor() {}

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
    return (
      this.profileworksStack.defaultPutCode.toString() === work.putCode.value
    )
  }
}
