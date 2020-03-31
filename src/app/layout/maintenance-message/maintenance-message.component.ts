import { Component, OnInit } from '@angular/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { CookieService } from 'ngx-cookie-service'
import { MaintenanceMessage } from 'src/app/types/togglz.endpoint'

@Component({
  selector: 'app-maintenance-message',
  templateUrl: './maintenance-message.component.html',
  styleUrls: [
    './maintenance-message.component.scss-theme.scss',
    './maintenance-message.component.scss',
  ],
})
export class MaintenanceMessageComponent implements OnInit {
  maintenanceMessage: MaintenanceMessage
  closableElement: Element

  constructor(togglz: TogglzService, private _cookie: CookieService) {
    togglz.getMaintenanceMessages().subscribe(value => {
      this.maintenanceMessage = value
      console.log(this.maintenanceMessage)
    })
  }

  ngOnInit() {}
}
