import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-info-drop-down',
  templateUrl: './info-drop-down.component.html',
  styleUrls: [
    './info-drop-down.component.scss',
    './info-drop-down.component.scss-theme.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class InfoDropDownComponent implements OnInit {
  @Input() name
  @Input() description
  show = false

  ariaLabelShowDetailsFor = $localize`:@@shared.showDetailsFor:Show details for`
  ariaLabelHideDetailsFor = $localize`:@@shared.hideDetailsFor:Hide details for`

  constructor() {}

  ngOnInit(): void {}
}
