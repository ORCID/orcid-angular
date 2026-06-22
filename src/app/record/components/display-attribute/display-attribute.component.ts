import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-display-attribute',
  templateUrl: './display-attribute.component.html',
  styleUrls: ['./display-attribute.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DisplayAttributeComponent implements OnInit {
  @Input() title
  @Input() content

  constructor() {}
  ngOnInit(): void {}
}
