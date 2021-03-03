import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core'

@Component({
  selector: 'app-panel-data',
  templateUrl: './panel-data.component.html',
  styleUrls: [
    './panel-data.component.scss',
    './panel-data.component.scss-theme.scss',
  ],
})
export class PanelDataComponent implements OnInit {
  @HostBinding('class.border-bottom') borderBottomClass = false
  @Input() set borderBottom(borderBottom: boolean) {
    this.borderBottomClass = borderBottom
  }

  state = false

  constructor() {}

  ngOnInit(): void {}
}
