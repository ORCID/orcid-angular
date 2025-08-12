import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-code-panel',
  templateUrl: './code-panel.component.html',
  styleUrls: [
    './code-panel.component.scss',
    './code-panel.component.scss-theme.scss',
  ],
  standalone: false,
})
export class CodePanelComponent implements OnInit {
  collapseAriaLabel = $localize`:@@developerTools.collapse:Collapse`
  expandAriaLabel = $localize`:@@developerTools.expand:Expand`
  exampleCodeAriaLabel = $localize`:@@developerTools.exampleCode2:example code`

  openState = false
  @Input() title: string
  constructor() {}

  ngOnInit(): void {}

  swapOpenState() {
    this.openState = !this.openState
  }
}
