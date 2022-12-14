import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { PlatformInfo, PlatformInfoService } from '../../platform-info'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: [
    './modal-header.component.scss',
    './modal-header.component.scss-theme.scss',
  ],
})
export class ModalHeaderComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Output() close = new EventEmitter<boolean>()
  @Input() closeLabel = $localize`:@@shared.ariaLabelClose:Close`
  platform: PlatformInfo

  constructor(
    private dialogReg: MatDialogRef<any>,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.platform = platform
      })
  }

  closeEvent() {
    this.dialogReg.close()
    this.close.next()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
