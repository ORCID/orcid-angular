import { Component, Input, OnInit } from '@angular/core'
import { MonthDayYearDate } from 'src/app/types'

@Component({
  selector: 'app-source-hit',
  templateUrl: './source-hit.component.html',
  styleUrls: ['./source-hit.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class SourceHitComponent implements OnInit {
  @Input() createdDate: MonthDayYearDate
  @Input() source: string
  @Input() assertion: string

  constructor() {}

  ngOnInit(): void {}
}
