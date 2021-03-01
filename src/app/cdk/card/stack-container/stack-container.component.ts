import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-stack-container',
  templateUrl: './stack-container.component.html',
  styleUrls: [
    './stack-container.component.scss',
    './tack-container.component.scss-theme.scss',
  ],
})
export class StackContainerComponent implements OnInit {
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
