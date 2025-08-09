import { Component, OnInit } from '@angular/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { MaintenanceMessage } from 'src/app/types/togglz.local'

@Component({
  selector: 'app-maintenance-message',
  templateUrl: './maintenance-message.component.html',
  styleUrls: [
    './maintenance-message.component.scss-theme.scss',
    './maintenance-message.component.scss',
  ],
  standalone: false,
})
export class MaintenanceMessageComponent implements OnInit {
  maintenanceMessage: MaintenanceMessage
  closableElement: Element
  labelMaintenance = $localize`:@@layout.ariaLabelMaintenance:Maintenance message`

  constructor(togglz: TogglzService) {
    togglz.getMaintenanceMessages().subscribe((value) => {
      this.maintenanceMessage = value
    })
  }

  ngOnInit() {}
}
