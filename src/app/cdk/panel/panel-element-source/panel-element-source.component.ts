import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-panel-element-source',
  templateUrl: './panel-element-source.component.html',
  styleUrls: [
    './panel-element-source.component.scss',
    './panel-element-source.component.scss-theme.scss',
  ],
})
export class PanelElementSourceComponent  {
  @Input() name: string
  @Input() date: string
  @Input() isLastItem: boolean
  @Input() assertion: string
  constructor() {}

}
