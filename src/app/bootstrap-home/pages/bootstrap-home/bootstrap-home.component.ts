import { Component, OnInit } from '@angular/core'
import { enterAnimation } from 'src/app/animations'

@Component({
  selector: 'app-bootstrap-home',
  templateUrl: './bootstrap-home.component.html',
  styleUrls: ['./bootstrap-home.component.scss'],
  animations: [enterAnimation],
})
export class BootstrapHomeComponent implements OnInit {
  constructor() {
    console.log('init BootstrapHomeComponent')
  }

  ngOnInit() {}
}
