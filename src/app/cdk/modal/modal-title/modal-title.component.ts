import { Component, Input, ChangeDetectionStrategy } from '@angular/core'

@Component({
  selector: 'app-modal-title',
  templateUrl: './modal-title.component.html',
  styleUrls: [
    './modal-title.component.scss',
    './modal-title.component.scss-theme.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ModalTitleComponent {
  @Input() featured: boolean = false
}
