import { animate, style, transition, trigger } from '@angular/animations'
import { Component, OnInit, Input } from '@angular/core'
import { PlatformInfoService } from '../../../core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(400, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  tabletOrHandset

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.getPlatformInfo().subscribe(platformInfo => {
      this.tabletOrHandset = platformInfo.tabletOrHandset
    })
  }

  ngOnInit() {}
}
