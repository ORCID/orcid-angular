import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-modal-title',
  templateUrl: './modal-title.component.html',
  styleUrls: [
    './modal-title.component.scss',
    './modal-title.component.scss-theme.scss',
  ],
  standalone: false,
})
export class ModalTitleComponent {
  @Input() featured: boolean = false
}
