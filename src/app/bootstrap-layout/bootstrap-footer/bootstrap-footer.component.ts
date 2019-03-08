import { Component, OnInit } from '@angular/core'
import { PlatformInfoService } from '../../core'

@Component({
  selector: 'app-bootstrap-footer',
  templateUrl: './bootstrap-footer.component.html',
  styleUrls: ['./bootstrap-footer.component.scss'],
})
export class BootstrapFooterComponent implements OnInit {
  tabletOrHandset

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.get().subscribe(platformInfo => {
      this.tabletOrHandset = platformInfo.tabletOrHandset
    })
  }

  ngOnInit() {}
}
