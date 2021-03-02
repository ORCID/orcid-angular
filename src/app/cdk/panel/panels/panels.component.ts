import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss', './panels.component.scss-theme.scss'],
})
export class PanelsComponent implements OnInit {
  expandedContent: boolean = true
  @Input() title
  @Input() currentAmount
  @Input() total

  constructor() {}

  add() {}
  sort() {}
  collapse() {
    this.expandedContent = !this.expandedContent
  }
  ngOnInit(): void {}
}
