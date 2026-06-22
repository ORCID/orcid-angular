import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-showing-of',
  templateUrl: './showing-of.component.html',
  styleUrls: ['./showing-of.component.scss'],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ShowingOfComponent implements OnInit {
  @Input() displaying: number
  @Input() total: number

  constructor() {}

  ngOnInit(): void {}
}
