import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core'
import { VisibilityStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-panel-element',
  templateUrl: './panel-element.component.html',
  styleUrls: [
    './panel-element.component.scss',
    './panel-element.component.scss-theme.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PanelElementComponent implements OnInit {
  @Input() visibility: VisibilityStrings | ''
  @Input() bold: Boolean
  @Input() italic: Boolean
  @Input() hideVisibility: Boolean = true
  @Input() isPublicRecord: string
  @Input() separator: Boolean = false

  constructor() {}

  ngOnInit(): void {}
}
