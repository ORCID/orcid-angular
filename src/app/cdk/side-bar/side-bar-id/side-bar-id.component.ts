import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from '../../platform-info'
import { environment } from '../../../../environments/environment'
import { WINDOW } from '../../window'

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
  @Input() id: string
  @Input() privateView = true
  platform: PlatformInfo

  constructor(
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }

  ngOnInit(): void {
    this.clipboard()
  }

  clipboard() {
    const source = document.querySelector('div.id')
    source.addEventListener('copy', (event) => {
      const selection = document.getSelection()
      this.window.navigator.clipboard.writeText(
        selection.toString().replace(/\s+/g, '')
      )
      event.preventDefault()
    })
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
