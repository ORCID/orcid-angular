import { Component, Input, OnInit } from '@angular/core'
import { VisibilityStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-panel-element',
  templateUrl: './panel-element.component.html',
  styleUrls: ['./panel-element.component.scss'],
})
export class PanelElementComponent implements OnInit {
  @Input() visibility: VisibilityStrings | ''
  @Input() bold: Boolean
  @Input() hideVisibility: Boolean = true
  @Input() isPublicRecord: string

  constructor() {}

  ngOnInit(): void {}
}
