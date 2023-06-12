import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-code-panel',
  templateUrl: './code-panel.component.html',
  styleUrls: [
    './code-panel.component.scss',
    './code-panel.component.scss-theme.scss',
  ],
})
export class CodePanelComponent implements OnInit {
  openState = false
  @Input() title: string
  constructor() {}

  ngOnInit(): void {}
}
