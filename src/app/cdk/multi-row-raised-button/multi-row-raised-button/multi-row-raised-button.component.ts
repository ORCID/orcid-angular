import { Component, OnInit, Input } from '@angular/core'
import { disableBindings } from '@angular/core/src/render3'

@Component({
  selector: 'app-multi-row-raised-button',
  templateUrl: './multi-row-raised-button.component.html',
  styleUrls: ['./multi-row-raised-button.component.scss'],
})
export class MultiRowRaisedButtonComponent implements OnInit {
  @Input() color
  @Input() disabled
  @Input() disableRipple

  constructor() {}

  ngOnInit() {}
}
