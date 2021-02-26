import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-data',
  templateUrl: './card-data.component.html',
  styleUrls: ['./card-data.component.scss']
})
export class CardDataComponent implements OnInit {

  @Input() startDate
  @Input() date
  @Input() endDate
  @Input() sourceName
  @Input() role
  @Input() type
  @Input() department

  constructor() { }

  ngOnInit(): void {
  }

}
