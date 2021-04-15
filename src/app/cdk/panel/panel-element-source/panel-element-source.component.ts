import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-panel-element-source',
  templateUrl: './panel-element-source.component.html',
  styleUrls: [
    './panel-element-source.component.scss',
    './panel-element-source.component.scss-theme.scss',
  ],
})
export class PanelElementSourceComponent implements OnInit {
  @Input() name: string
  @Input() date: string
  constructor() {}

  ngOnInit(): void {}
}
