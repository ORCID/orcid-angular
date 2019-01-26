import { Component, OnInit, Input, Output, HostListener } from '@angular/core'
import { WorkGroup } from '../../../types'

@Component({
  selector: 'app-profile-records-stack',
  templateUrl: './profile-records-stack.component.html',
  styleUrls: ['./profile-records-stack.component.scss'],
})
export class ProfileRecordsStackComponent implements OnInit {
  _profileworksStack: WorkGroup
  workCardState = {}
  @Input()
  set profileworksStack(profileworksStack: WorkGroup) {
    console.log('STACK ', profileworksStack)
    this._profileworksStack = profileworksStack
    this._profileworksStack.works.forEach(
      work => (this.workCardState[work.putCode.value] = { stackState: 'close' })
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
}
