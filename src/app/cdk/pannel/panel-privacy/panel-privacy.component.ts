import { Component, Input, OnInit } from '@angular/core'
import { VisibilityStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-panel-privacy',
  templateUrl: './panel-privacy.component.html',
  styleUrls: [
    './panel-privacy.component.scss',
    './panel-privacy.component.scss-theme.scss',
  ],
})
export class PanelPrivacyComponent implements OnInit {
  @Input() visibility: VisibilityStrings
  constructor() {}

  ngOnInit(): void {}
}
