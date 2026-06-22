import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-modal-side-bar',
  templateUrl: './modal-side-bar.component.html',
  styleUrls: [
    './modal-side-bar.component.scss',
    './modal-side-bar.component.scss-theme.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ModalSideBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
