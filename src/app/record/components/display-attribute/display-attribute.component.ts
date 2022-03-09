import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-display-attribute',
  templateUrl: './display-attribute.component.html',
  styleUrls: ['./display-attribute.component.scss'],
})
export class DisplayAttributeComponent  {
  @Input() title
  @Input() content

  constructor() {}
}
