import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss', './panels.component.scss-theme.scss'],
})
export class PanelsComponent implements OnInit {
  expandedContent = true
  @Input() title
  @Input() type:
    | 'activities'
    | 'peer-review'
    | 'funding'
    | 'sub-peer-review'
    | 'funding'
    | 'research-resources' = 'activities'
  @Input() currentAmount
  @Input() total
  @Input() isPublicRecord: any = false

  constructor() {}

  add() {}
  sort() {}
  collapse() {
    this.expandedContent = !this.expandedContent
  }
  ngOnInit(): void {}
}
