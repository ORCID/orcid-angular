import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs/internal/Subject'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from '../../platform-info'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-side-bar-id',
  templateUrl: './side-bar-id.component.html',
  styleUrls: [
    './side-bar-id.component.scss',
    './side-bar-id.component-scss-theme.scss',
  ],
})
export class SideBarIdComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  environment = environment
  desktop: boolean
  @Input() id: string
  privateView = true
  platform: PlatformInfo

  constructor(private _platform: PlatformInfoService) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
