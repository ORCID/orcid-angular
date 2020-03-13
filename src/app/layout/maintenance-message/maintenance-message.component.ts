import { Component, OnInit } from '@angular/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
  selector: 'app-maintenance-message',
  templateUrl: './maintenance-message.component.html',
  styleUrls: [
    './maintenance-message.component.scss-theme.scss',
    './maintenance-message.component.scss',
  ],
})
export class MaintenanceMessageComponent implements OnInit {
  maintenanceMessage
  constructor(togglz: TogglzService) {
    togglz.getMessageOf('MAINTENANCE_MESSAGE').subscribe(value => {
      this.maintenanceMessage = value
    })
  }
  ngOnInit() {}
}
