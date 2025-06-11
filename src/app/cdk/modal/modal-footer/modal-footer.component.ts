import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: [
    './modal-footer.component.scss',
    './modal-footer.component.scss-theme.scss',
  ],
})
export class ModalFooterComponent implements OnInit, OnDestroy {
  handset: boolean
  screenDirection: string
  constructor(private _platform: PlatformInfoService) {}
  $destroy: Subject<void> = new Subject<void>()

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.handset = platform.columns4 || platform.columns8
        this.screenDirection = platform.screenDirection
      })
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.unsubscribe()
  }
}
