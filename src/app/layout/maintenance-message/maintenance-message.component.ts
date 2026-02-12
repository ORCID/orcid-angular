import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { MaintenanceMessage } from 'src/app/types/togglz.local'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-maintenance-message',
  templateUrl: './maintenance-message.component.html',
  styleUrls: [
    './maintenance-message.component.scss-theme.scss',
    './maintenance-message.component.scss',
  ],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceMessageComponent {
  maintenanceMessage: MaintenanceMessage
  closableElement: Element
  labelMaintenance = $localize`:@@layout.ariaLabelMaintenance:Maintenance message`

  constructor(togglz: TogglzService, private cdr: ChangeDetectorRef) {
    togglz
      .getMaintenanceMessages()
      .pipe(take(1))
      .subscribe((value) => {
        this.maintenanceMessage = value
        this.cdr.markForCheck()
      })
  }
}
