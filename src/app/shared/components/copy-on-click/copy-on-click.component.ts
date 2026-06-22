import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-copy-on-click',
  templateUrl: './copy-on-click.component.html',
  styleUrls: ['./copy-on-click.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CopyOnClickComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
