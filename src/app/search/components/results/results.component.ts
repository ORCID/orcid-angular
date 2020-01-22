import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: [
    './results.component.scss-theme.scss',
    './results.component.scss',
  ],
  preserveWhitespaces: true,
})
export class ResultsComponent implements OnInit {
  @Input() searchResults
  constructor() {}
  ngOnInit() {}
}
