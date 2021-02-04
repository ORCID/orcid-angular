import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs/internal/Subject'
import { first, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../platform-info'

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

  desktop: boolean
  @Input() id: string
  privateView = true
  constructor(private _platform: PlatformInfoService) {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((x) => {
        this.desktop = x.columns12
      })
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
