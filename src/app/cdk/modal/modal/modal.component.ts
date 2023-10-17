import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  columns12: boolean
  screenDirection: 'rtl' | 'ltr'
  $destroy: Subject<boolean> = new Subject<boolean>()
  @Input() loading = false
  @Input() noSidebar = false

  constructor(
    private dialogRef: MatDialogRef<any>,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.columns12 = platform.columns12
        this.screenDirection = platform.screenDirection
      })
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.unsubscribe()
  }
}
