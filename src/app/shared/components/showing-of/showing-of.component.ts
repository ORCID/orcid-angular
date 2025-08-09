import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-showing-of',
  templateUrl: './showing-of.component.html',
  styleUrls: ['./showing-of.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class ShowingOfComponent implements OnInit {
  @Input() displaying: number
  @Input() total: number

  constructor() {}

  ngOnInit(): void {}
}
