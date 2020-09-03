import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss', 'panel.component.scss-theme.scss'],
})
export class PanelComponent implements OnInit {
  openState = false
  editable = true
  constructor() {}

  ngOnInit(): void {}
}
